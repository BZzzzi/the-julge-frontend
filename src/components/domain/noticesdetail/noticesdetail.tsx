"use client";

import Modal from "@/components/common/modal/Modal";
import ShopInfoCard from "@/components/common/shop-info/shop-info-card";
import Card, { CardData } from "@/components/domain/card";
import { apiClient } from "@/lib/api";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type NoticesResponse = {
  items: Array<{
    item: {
      id: string;
      hourlyPay: number;
      startsAt: string;
      workhour: number;
      description?: string;
      closed?: boolean;
      shop: {
        item: {
          id: string;
          name: string;
          category?: string;
          address1: string;
          address2?: string;
          description?: string;
          imageUrl: string;
          originalHourlyPay?: number;
        };
      };
    };
  }>;
};

const BASE_HOURLY_PAY = 10320;

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

type ModalMode = "apply" | "cancel";

type Props = {
  userId: string | null;
};

/** =========================
 *  최근 클릭 기록 (로그인/비로그인 분리)
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

function pushToFrontRecent(list: RecentKey[], key: RecentKey, limit = 6) {
  return [key, ...list.filter((k) => k !== key)].slice(0, limit);
}

function reorderByRecent(cards: CardData[], recent: RecentKey[]) {
  const rank = new Map<RecentKey, number>();
  recent.forEach((k, idx) => rank.set(k, idx));

  return cards
    .map((c, idx) => ({ c, idx }))
    .sort((a, b) => {
      const ka = makeKey(a.c.shopId, a.c.noticeId);
      const kb = makeKey(b.c.shopId, b.c.noticeId);
      const ra = rank.has(ka) ? (rank.get(ka) as number) : 1_000_000;
      const rb = rank.has(kb) ? (rank.get(kb) as number) : 1_000_000;

      if (ra !== rb) return ra - rb; // recent 앞쪽이 먼저
      return a.idx - b.idx; // recent에 없으면 기존 순서 유지
    })
    .map((x) => x.c);
}

export default function NoticeListWithDetailPage({ userId }: Props) {
  const [items, setItems] = useState<NoticesResponse["items"]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [applied, setApplied] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("apply");
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);
  const [selectedIsPast, setSelectedIsPast] = useState(false);
  const [selectedIsClosed, setSelectedIsClosed] = useState(false);
  const selectedIsBlocked = selectedIsPast || selectedIsClosed;
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    let alive = true;

    async function fetchNotices() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const data = (await apiClient.notices.getNotices({
          limit: 6,
          sort: "time",
        })) as unknown as NoticesResponse;

        if (!alive) return;

        setItems(data.items);

        const now = Date.now();

        const mapped: CardData[] = data.items.map((n) => {
          const startsAt = n.item.startsAt;
          const isPast = new Date(startsAt).getTime() < now;
          const isClosed = Boolean(n.item.closed);

          return {
            noticeId: n.item.id,
            shopId: n.item.shop.item.id,
            name: n.item.shop.item.name,
            startsAt,
            address1: n.item.shop.item.address1,
            hourlyPay: n.item.hourlyPay,
            workhour: n.item.workhour,
            imageUrl: n.item.shop.item.imageUrl,
            isPast,
            isClosed,
          };
        });

        // 최근 클릭 기록 기반으로 카드 순서 재정렬
        const storageKey = getRecentStorageKey(userId);
        const recent = loadRecent(storageKey);
        const reordered = reorderByRecent(mapped, recent);

        setCards(reordered);

        // 기본 선택 = 맨 앞 카드
        if (reordered.length > 0) {
          setSelectedNoticeId(reordered[0].noticeId);
          setSelectedIsPast(reordered[0].isPast);
          setSelectedIsClosed(Boolean(reordered[0].isClosed));
        }
      } catch (e) {
        if (!alive) return;
        setErrorMsg(e instanceof Error ? e.message : "리스트를 불러오지 못했습니다.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    fetchNotices();
    return () => {
      alive = false;
    };
  }, [userId]);

  const selected = useMemo(() => {
    if (!selectedNoticeId) return null;
    return items.find((n) => n.item.id === selectedNoticeId)?.item ?? null;
  }, [items, selectedNoticeId]);

  const derived = useMemo(() => {
    if (!selected) return null;

    const start = new Date(selected.startsAt);
    const end = new Date(start.getTime() + selected.workhour * 60 * 60 * 1000);

    const diffPercent = ((selected.hourlyPay - BASE_HOURLY_PAY) / BASE_HOURLY_PAY) * 100;
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

    return {
      imageUrl: selected.shop.item.imageUrl,
      imageAlt: selected.shop.item.name,
      wageText: `${selected.hourlyPay.toLocaleString()}원`,
      wageBadgeText: `기존 시급보다 ${percentText}%`,
      wageBadgeIcon,
      scheduleText: `${formatKSTDateTime(start)} ~ ${formatKSTTime(end)} (${selected.workhour}시간)`,
      address: selected.shop.item.address1,
      infoDescription: selected.shop.item.description ?? "가게 설명이 없습니다.",
      detailDescription: selected.description ?? "공고 설명이 없습니다.",
    };
  }, [selected]);

  const handlePrimaryButtonClick = () => {
    if (selectedIsBlocked) return;

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
      <Image
        src="/icon/checked.svg"
        alt="확인"
        width={24}
        height={24}
      />
    ) : (
      <Image
        src="/icon/caution.svg"
        alt="주의"
        width={24}
        height={24}
      />
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
        {selected && derived ? (
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
              selectedIsBlocked ? (
                <button
                  disabled
                  className="bg-gray-40 w-full cursor-not-allowed rounded-xl py-3 font-bold text-white"
                >
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
          <div className="p-6 text-sm text-neutral-500">공고를 선택하면 상세가 표시됩니다.</div>
        )}
      </div>

      <div className="my-30">
        <Card
          cards={cards}
          selectedNoticeId={selectedNoticeId}
          title="최근에 본 공고"
          pastLabel="지난 공고"
          closedLabel="마감 공고"
          onSelect={({ noticeId, shopId, isPast, isClosed }) => {
            scrollYRef.current = window.scrollY;
            setSelectedNoticeId(noticeId);
            setSelectedIsPast(isPast);
            setSelectedIsClosed(isClosed);

            // 클릭한 공고를 맨 앞으로: localStorage + cards 재정렬
            const storageKey = getRecentStorageKey(userId);
            const key = makeKey(shopId, noticeId);
            const prev = loadRecent(storageKey);
            const next = pushToFrontRecent(prev, key, 6);
            saveRecent(storageKey, next);
            setCards((prevCards) => reorderByRecent(prevCards, next));
            requestAnimationFrame(() => {
              window.scrollTo({ top: scrollYRef.current });
            });
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
  Skeleton UI
========================= */

function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={["bg-gray-20/70 animate-pulse rounded-lg", className].join(" ")}
      aria-hidden="true"
    />
  );
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
            <div
              key={i}
              className="border-gray-20 relative h-full overflow-hidden rounded-lg border bg-white"
            >
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
