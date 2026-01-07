"use client";

import Card, { CardData } from "@/components/domain/card";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface ShopInfo {
  id: string;
  name: string;
  address1: string;
  imageUrl: string;
}

type Props = {
  initialCards: CardData[];
  shopInfo: ShopInfo;
};

const LIMIT = 6;

export default function EmployerNoticesSection({ initialCards, shopInfo }: Props) {
  const router = useRouter();

  const [cards, setCards] = useState<CardData[]>(initialCards);
  const [offset, setOffset] = useState(LIMIT);
  const [hasNextPage, setHasNextPage] = useState(initialCards.length === LIMIT);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);

  const handleSelect = (payload: { noticeId: string; shopId: string }) => {
    setSelectedNoticeId(payload.noticeId);
    router.push(`/notice/notice-detail/${payload.shopId}/${payload.noticeId}`);
  };

  const fetchMoreNotices = useCallback(async () => {
    if (isLoading || !hasNextPage) return;

    setIsLoading(true);

    try {
      const res = await apiClient.notices.getShopNotices(shopInfo.id, {
        offset: offset,
        limit: LIMIT,
      });

      const newNotices = res.items ?? [];

      if (newNotices.length < LIMIT) {
        setHasNextPage(false);
      }

      const newCards: CardData[] = newNotices.map((n) => {
        const notice = n.item;
        return {
          noticeId: notice.id,
          shopId: shopInfo.id,
          name: shopInfo.name,
          startsAt: notice.startsAt,
          workhour: notice.workhour,
          address1: shopInfo.address1,
          hourlyPay: notice.hourlyPay,
          imageUrl: shopInfo.imageUrl,
          isPast: false, 
          isClosed: notice.closed,
        };
      });

      setCards((prev) => [...prev, ...newCards]);
      setOffset((prev) => prev + LIMIT);
    } catch (error) {
      console.error("공고 추가 로딩 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasNextPage, offset, shopInfo]);

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          fetchMoreNotices();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [fetchMoreNotices, hasNextPage, isLoading]);

  return (
    <>
      <Card
        cards={cards}
        selectedNoticeId={selectedNoticeId}
        onSelect={handleSelect}
        title="내가 등록한 공고"
        pastLabel="지난 공고"
        closedLabel="마감 공고"
      />

      {hasNextPage && (
        <div ref={observerRef} className="flex h-20 w-full items-center justify-center">
          {isLoading && <div className="text-gray-400">불러오는 중...</div>}
        </div>
      )}
    </>
  );
}
