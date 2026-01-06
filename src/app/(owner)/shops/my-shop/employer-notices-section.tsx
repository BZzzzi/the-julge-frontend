"use client";

import Card, { CardData } from "@/components/domain/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  cards: CardData[];
};

export default function EmployerNoticesSection({ cards }: Props) {
  const router = useRouter();
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);

  const handleSelect = (payload: { noticeId: string; shopId: string }) => {
    setSelectedNoticeId(payload.noticeId);
    router.push(`/notice/notice-detail/${payload.shopId}/${payload.noticeId}`);
  };

  return (
    <Card
      cards={cards}
      selectedNoticeId={selectedNoticeId}
      onSelect={handleSelect}
      title="내가 등록한 공고"
      pastLabel="지난 공고"
      closedLabel="마감 공고"
    />
  );
}
