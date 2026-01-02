"use client";

import Modal from "@/components/common/modal/Modal";
import ShopInfoCard from "@/components/common/shop-info/ShopInfoCard";
import Card, { CardData } from "@/components/domain/card";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type NoticesResponse = {
  items: Array<{
    item: {
      id: string;
      hourlyPay: number;
      startsAt: string;
      workhour: number;
      description?: string;
      shop: {
        item: {
          name: string;
          address1: string;
          imageUrl: string;
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

export default function NoticeListWithDetailPage() {
  const [items, setItems] = useState<NoticesResponse["items"]>([]);
  const [cards, setCards] = useState<CardData[]>([]);

  // ✅ 신청 여부(버튼 토글용)
  const [applied, setApplied] = useState(false);

  // ✅ 모달 상태 + 모드
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("apply");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIsPast, setSelectedIsPast] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function fetchNotices() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const res = await fetch(`/api/notices?limit=6&sort=time`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`리스트 fetch 실패 (status: ${res.status})`);

        const data: NoticesResponse = await res.json();
        if (!alive) return;

        setItems(data.items);

        const now = Date.now();
        const mapped: CardData[] = data.items.map((n) => {
          const startsAt = n.item.startsAt;
          const isPast = new Date(startsAt).getTime() < now;

          return {
            id: n.item.id,
            name: n.item.shop.item.name,
            startsAt,
            address1: n.item.shop.item.address1,
            hourlyPay: n.item.hourlyPay,
            workhour: n.item.workhour,
            imageUrl: n.item.shop.item.imageUrl,
            isPast,
          };
        });

        setCards(mapped);

        if (mapped.length > 0) {
          setSelectedId(mapped[0].id);
          setSelectedIsPast(mapped[0].isPast);
        }
      } catch (e) {
        if (!alive) return;
        setErrorMsg(
          e instanceof Error ? e.message : "리스트를 불러오지 못했습니다.",
        );
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    fetchNotices();
    return () => {
      alive = false;
    };
  }, []);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return items.find((n) => n.item.id === selectedId)?.item ?? null;
  }, [items, selectedId]);

  const derived = useMemo(() => {
    if (!selected) return null;

    const start = new Date(selected.startsAt);
    const end = new Date(start.getTime() + selected.workhour * 60 * 60 * 1000);

    const diffPercent =
      ((selected.hourlyPay - BASE_HOURLY_PAY) / BASE_HOURLY_PAY) * 100;
    const isUp = diffPercent >= 0;
    const percentText = Math.round(Math.abs(diffPercent));

    return {
      imageUrl: selected.shop.item.imageUrl,
      imageAlt: selected.shop.item.name,
      wageText: `${selected.hourlyPay.toLocaleString()}원`,
      wageBadgeText: `기존 시급보다 ${percentText}% ${isUp ? "↑" : "↓"}`,
      scheduleText: `${formatKSTDateTime(start)} ~ ${formatKSTTime(end)} (${selected.workhour}시간)`,
      address: selected.shop.item.address1,
      description: selected.description ?? "설명이 없습니다.",
    };
  }, [selected]);

  // ✅ 버튼 클릭 핸들러
  const handlePrimaryButtonClick = () => {
    if (selectedIsPast) return;

    if (!applied) {
      setModalMode("apply");
      setOpen(true);
    } else {
      setModalMode("cancel");
      setOpen(true);
    }
  };

  // ✅ 모달 아이콘(모드별)
  const modalIcon = useMemo(() => {
    return modalMode === "apply" ? (
      <Image src="/icon/checked.svg" alt="확인" width={24} height={24} />
    ) : (
      <Image src="/icon/caution.svg" alt="주의" width={24} height={24} />
    );
  }, [modalMode]);

  // ✅ 모달 actions (mode에 따라 바뀜)
  const modalProps = useMemo(() => {
    if (modalMode === "apply") {
      return {
        description: "지원하시겠어요?",
        actions: [
          {
            label: "취소",
            onClick: () => setOpen(false),
            variant: "outline" as const,
          },
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
        {
          label: "아니오",
          onClick: () => setOpen(false),
          variant: "outline" as const,
        },
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

  if (loading) return <div className="p-6">로딩중...</div>;
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
            wageBadge={{ text: derived.wageBadgeText }}
            scheduleText={derived.scheduleText}
            address={derived.address}
            description={derived.description}
            footer={
              selectedIsPast ? (
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
          />
        ) : (
          <div className="p-6 text-sm text-neutral-500">
            공고를 선택하면 상세가 표시됩니다.
          </div>
        )}
      </div>

      <div className="my-30">
        <Card
          cards={cards}
          selectedId={selectedId}
          onSelect={({ id, isPast }) => {
            setSelectedId(id);
            setSelectedIsPast(isPast);
            // 공고 바뀌면 신청 상태 초기화 원하면 켜기
            // setApplied(false);
          }}
        />
      </div>

      {/* ✅ 모달 */}
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
