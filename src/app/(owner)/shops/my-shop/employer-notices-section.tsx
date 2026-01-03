"use client";

import Card, { CardData } from "@/components/domain/card";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Props = {
  cards: CardData[];
};

const NOW = Date.now();

export default function EmployerNoticesSection({ cards }: Props) {
  const router = useRouter();
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);

  const computedCards = useMemo(() => {
    return cards.map((card) => ({
      ...card,
      isPast: new Date(card.startsAt).getTime() < NOW,
    }));
  }, [cards]);

  const handleSelect = (payload: { noticeId: string; shopId: string; isPast: boolean }) => {
    // 지난 공고면 클릭 막고 싶으면 여기서 return
    if (payload.isPast) return;

    setSelectedNoticeId(payload.noticeId);

    // ✅ 공고 상세 경로는 프로젝트 라우팅에 맞게 수정
    // 예시: /shops/[shopId]/notices/[noticeId]
    router.push(`/shops/${payload.shopId}/notices/${payload.noticeId}`);
  };

  return (
    <Card
      cards={computedCards}
      selectedNoticeId={selectedNoticeId}
      onSelect={handleSelect}
    />
  );
}
