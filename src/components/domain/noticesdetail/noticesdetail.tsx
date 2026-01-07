"use client";

import Modal from "@/components/common/modal/Modal";
import ShopInfoCard from "@/components/common/shop-info/shop-info-card";
import Card, { CardData } from "@/components/domain/card";
import { apiClient } from "@/lib/api";
import { useNoticeSelection, useUser } from "@/store/user";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const BASE_HOURLY_PAY = 10320;

/** =========================
 *  최근본 storage
========================= */
type RecentKey = string;

function getRecentStorageKey(userId: string | null) {
  return userId ? `recentNotices:${userId}` : "recentNotices:guest";
}

function loadRecent(key: string): RecentKey[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as RecentKey[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(key: string, list: RecentKey[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

function makeKey(shopId: string, noticeId: string) {
  return `${shopId}:${noticeId}`;
}

function splitKey(k: string) {
  const [shopId, noticeId] = k.split(":");
  return { shopId: shopId ?? "", noticeId: noticeId ?? "" };
}

function pushToFrontRecent(list: RecentKey[], key: RecentKey, limit = 6) {
  return [key, ...list.filter((x) => x !== key)].slice(0, limit);
}

/** =========================
 *  타입 (필요한 필드만)
========================= */
type Shop = {
  id: string;
  name: string;
  address1: string;
  imageUrl: string;
  description?: string;
};

type NoticeDetail = {
  id: string;
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description?: string;
  closed?: boolean;
  shop: { item?: Shop } | Shop;
};

type ModalMode = "apply" | "cancel";

function formatKSTDateTime(date: Date) {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}

function formatKSTTime(date: Date) {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("hour")}:${get("minute")}`;
}

function unwrapShop(shop: NoticeDetail["shop"]): Shop | null {
  if (!shop) return null;
  const maybe = shop as { item?: Shop };
  if (maybe.item) return maybe.item;
  return shop as Shop;
}

export default function NoticeListWithDetailPage() {
  const { user } = useUser();
  const userId = (user as unknown as { id?: string } | null)?.id ?? null;

  const selected = useNoticeSelection((s) => s.selected);
  const setSelected = useNoticeSelection((s) => s.setSelected);

  const [cards, setCards] = useState<CardData[]>([]);
  const [detailsByKey, setDetailsByKey] = useState<Record<string, NoticeDetail>>({});

  const [applied, setApplied] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("apply");

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /** ✅ 선택 키 */
  const selectedKey = selected ? makeKey(selected.shopId, selected.noticeId) : null;

  /** =========================
   *  최근본 + 선택값 기준으로 목록/상세 불러오기
  ========================= */
  useEffect(() => {
    let alive = true;

    async function fetchAll() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const storageKey = getRecentStorageKey(userId);
        const recent = loadRecent(storageKey);
        let recentFinal = recent;
        if (selected) {
          const k = makeKey(selected.shopId, selected.noticeId);
          recentFinal = pushToFrontRecent(recent, k, 6);
          saveRecent(storageKey, recentFinal);
        }

        if (recentFinal.length === 0) {
          if (!alive) return;
          setCards([]);
          setDetailsByKey({});
          return;
        }
        
        const results = await Promise.all(
          recentFinal.map(async (k) => {
            const { shopId, noticeId } = splitKey(k);
            if (!shopId || !noticeId) return null;

            const res = (await apiClient.notices.getShopOnlyNotice(shopId, noticeId)) as unknown as
              | { item: NoticeDetail }
              | NoticeDetail;

            const notice: NoticeDetail = (res as { item?: NoticeDetail }).item ?? (res as NoticeDetail);
            const shop = unwrapShop(notice.shop);
            if (!shop) return null;

            const now = Date.now();
            const isPast = new Date(notice.startsAt).getTime() < now;
            const isClosed = Boolean(notice.closed);

            const card: CardData = {
              noticeId: notice.id,
              shopId,
              name: shop.name,
              startsAt: notice.startsAt,
              workhour: notice.workhour,
              address1: shop.address1,
              hourlyPay: notice.hourlyPay,
              imageUrl: shop.imageUrl,
              isPast,
              isClosed,
            };

            return { key: k, notice, card };
          }),
        );

        const nextDetails: Record<string, NoticeDetail> = {};
        const nextCards: CardData[] = [];

        results.forEach((r) => {
          if (!r) return;
          nextDetails[r.key] = r.notice;
          nextCards.push(r.card);
        });

        if (!alive) return;
        setDetailsByKey(nextDetails);
        setCards(nextCards);
      } catch (e) {
        if (!alive) return;
        setErrorMsg(e instanceof Error ? e.message : "불러오지 못했습니다.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    fetchAll();
    return () => {
      alive = false;
    };
    
  }, [userId, selected, selectedKey]);

  /** ✅ 선택된 공고 상세 (선택 없으면 null -> 빈 화면) */
  const detail = useMemo(() => {
    if (!selectedKey) return null;
    return detailsByKey[selectedKey] ?? null;
  }, [detailsByKey, selectedKey]);

  const derived = useMemo(() => {
    if (!detail) return null;

    const shop = unwrapShop(detail.shop);
    if (!shop) return null;

    const start = new Date(detail.startsAt);
    const end = new Date(start.getTime() + detail.workhour * 60 * 60 * 1000);

    const diffPercent = ((detail.hourlyPay - BASE_HOURLY_PAY) / BASE_HOURLY_PAY) * 100;
    const isUp = diffPercent >= 0;
    const percentText = Math.round(Math.abs(diffPercent));

    const wageBadgeIcon = (
      <Image
        src="/icon/arrowfff.svg"
        alt={isUp ? "up" : "down"}
        width={16}
        height={16}
        className={isUp ? "" : "rotate-90"}
      />
    );

    const isPast = start.getTime() < Date.now();
    const isClosed = Boolean(detail.closed);
    const selectedIsBlocked = isPast || isClosed;

    return {
      selectedIsBlocked,
      imageUrl: shop.imageUrl,
      imageAlt: shop.name,
      wageText: `${detail.hourlyPay.toLocaleString()}원`,
      wageBadgeText: `기존 시급보다 ${percentText}%`,
      wageBadgeIcon,
      scheduleText: `${formatKSTDateTime(start)} ~ ${formatKSTTime(end)} (${detail.workhour}시간)`,
      address: shop.address1,
      infoDescription: shop.description ?? "가게 설명이 없습니다.",
      detailDescription: detail.description ?? "공고 설명이 없습니다.",
    };
  }, [detail]);

  const handlePrimaryButtonClick = () => {
    if (!derived) return;
    if (derived.selectedIsBlocked) return;

    if (!applied) {
      setModalMode("apply");
      setOpen(true);
    } else {
      setModalMode("cancel");
      setOpen(true);
    }
  };

  const modalIcon = useMemo(() => {
    return modalMode === "apply" ? (
      <Image src="/icon/checked.svg" alt="확인" width={24} height={24} />
    ) : (
      <Image src="/icon/caution.svg" alt="주의" width={24} height={24} />
    );
  }, [modalMode]);

  const modalProps = useMemo(() => {
    if (modalMode === "apply") {
      return {
        description: "지원하시겠어요?",
        actions: [
          { label: "취소", onClick: () => setOpen(false), variant: "outline" as const },
          {
            label: "확인",
            onClick: () => {
              setApplied(true);
              setOpen(false);
            },
            variant: "primary" as const,
          },
        ] as const,
      };
    }

    return {
      description: "신청을 취소하시겠습니까?",
      actions: [
        { label: "아니오", onClick: () => setOpen(false), variant: "outline" as const },
        {
          label: "취소하기",
          onClick: () => {
            setApplied(false);
            setOpen(false);
          },
          variant: "primary" as const,
        },
      ] as const,
    };
  }, [modalMode]);

  if (loading) return <NoticeDetailSkeleton />;
  if (errorMsg) return <div className="p-6">에러: {errorMsg}</div>;

  return (
    <div>
      <div className="mt-15 flex items-start justify-center">
        {detail && derived ? (
          <ShopInfoCard
            variant="notice"
            imageUrl={derived.imageUrl}
            imageAlt={derived.imageAlt}
            wageText={derived.wageText}
            wageBadge={{ text: derived.wageBadgeText, icon: derived.wageBadgeIcon }}
            scheduleText={derived.scheduleText}
            address={derived.address}
            description={derived.infoDescription}
            footer={
              derived.selectedIsBlocked ? (
                <button disabled className="bg-gray-40 w-full cursor-not-allowed rounded-xl py-3 font-bold text-white">
                  신청 불가
                </button>
              ) : (
                <button
                  onClick={handlePrimaryButtonClick}
                  className={[
                    "w-full rounded-xl py-3 font-bold text-white",
                    applied ? "bg-gray-700" : "bg-orange-600",
                    "cursor-pointer",
                  ].join(" ")}
                >
                  {applied ? "취소하기" : "신청하기"}
                </button>
              )
            }
            detail={{ title: "공고 설명", content: derived.detailDescription }}
          />
        ) : (
          <div className="p-6 text-sm text-neutral-500">
            아직 선택된 공고가 없습니다. (notices 페이지에서 공고를 클릭하면 상세가 표시됩니다)
          </div>
        )}
      </div>

      <div className="my-30">
        <Card
          cards={cards}
          selectedNoticeId={selected?.noticeId ?? null}
          title="최근에 본 공고"
          pastLabel="지난 공고"
          closedLabel="마감 공고"
          onSelect={({ shopId, noticeId }) => {
            setSelected({ shopId, noticeId });

            const storageKey = getRecentStorageKey(userId);
            const key = makeKey(shopId, noticeId);
            const prev = loadRecent(storageKey);
            const next = pushToFrontRecent(prev, key, 6);
            saveRecent(storageKey, next);
          }}
        />
      </div>

      <Modal
        variant="icon"
        open={open}
        onClose={() => setOpen(false)}
        description={modalProps.description}
        icon={modalIcon}
        actions={[...modalProps.actions]}
      />
    </div>
  );
}

/* =========================
  Skeleton UI (그대로)
========================= */

function Skeleton({ className }: { className: string }) {
  return <div className={["bg-gray-20/70 animate-pulse rounded-lg", className].join(" ")} aria-hidden="true" />;
}

function NoticeDetailSkeleton() {
  return (
    <div>
      <div className="mt-15 flex items-start justify-center">
        <div
          className={[
            "flex w-full flex-col rounded-2xl",
            "h-112.5 gap-4 p-4 md:h-169.25",
            "md:gap-6 md:p-6",
            "lg:h-89 lg:w-241 lg:flex-row lg:gap-8 lg:p-6",
            "bg-white",
          ].join(" ")}
        >
          <Skeleton className="h-44.5 w-full rounded-2xl md:h-76.75 lg:h-77 lg:w-134.75" />

          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-5 w-16 md:h-6" />
            <Skeleton className="h-8 w-40 md:h-10 md:w-56" />
            <Skeleton className="h-6 w-56 rounded-full md:w-72" />

            <div className="mt-1 flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-4 w-64 md:h-5 md:w-80" />
            </div>

            <div className="mt-1 flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-4 w-48 md:h-5 md:w-72" />
            </div>

            <div className="mt-2 flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[92%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>

            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 w-full max-w-241 px-4 lg:px-0">
        <div className="bg-gray-10 w-full rounded-2xl px-6 py-5 md:px-8 md:py-6">
          <Skeleton className="h-5 w-24 md:h-6" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
        </div>
      </div>

      <div className="mx-auto my-30 max-w-87.5 px-0 sm:max-w-87.5 md:max-w-169.5 lg:max-w-241">
        <div className="mb-4 md:mb-8">
          <Skeleton className="h-7 w-40 md:h-9 md:w-56" />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-2 md:grid-cols-2 md:gap-3.5 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-gray-20 relative h-full overflow-hidden rounded-lg border bg-white">
              <div className="mx-3 mt-3 sm:mx-3 sm:mt-3 md:mx-4 md:mt-4">
                <Skeleton className="h-21 w-full rounded-xl sm:h-21 lg:h-40" />
              </div>

              <div className="mt-3 px-3 sm:mt-3 sm:px-3 lg:mt-4 lg:px-4">
                <Skeleton className="h-5 w-32 md:h-6 md:w-40" />
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 w-56 md:w-64" />
                  <Skeleton className="h-4 w-44 md:w-56" />
                </div>

                <div className="mt-4 mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <Skeleton className="h-7 w-24 md:h-8 md:w-28" />
                  <Skeleton className="h-5 w-28 rounded-full md:h-8 md:w-42" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
