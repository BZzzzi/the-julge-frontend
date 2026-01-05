"use client";

import { Button } from "@/components/common/button";
import ShopInfoCard from "@/components/common/shop-info/ShopInfoCard";
import { NoticeItem } from "@/types/notice";
import Image from "next/image";
import Link from "next/link";

interface NoticeShopCardProps {
  shopId: string;
  noticeId: string;
  initialNotice: NoticeItem | null;
}

export default function NoticeShopCard({ shopId, noticeId, initialNotice }: NoticeShopCardProps) {
  if (!initialNotice) {
    return null;
  }

  const notice = initialNotice.item;
  const shop = notice.shop?.item;
  const BASE_HOURLY_PAY = 10320;

  if (!shop) {
    return null;
  }

  // 시급 포맷팅
  const wageText = `${notice.hourlyPay.toLocaleString()}원`;

  // 기존 시급과 비교하는 배지 생성
  const originalHourlyPay = shop.originalHourlyPay || 0;
  const wageBadge =
    originalHourlyPay > 0 && notice.hourlyPay > originalHourlyPay
      ? {
          text: `기존 시급보다 ${Math.round(((notice.hourlyPay - BASE_HOURLY_PAY) / BASE_HOURLY_PAY) * 100)}%`,
          icon: (
            <Image
              src="/icon/arrowfff.svg"
              alt="증가"
              width={12}
              height={12}
            />
          ),
        }
      : undefined;

  // 일정 포맷팅
  const formatSchedule = (startsAt: string, workhour: number) => {
    const startDate = new Date(startsAt);
    const endDate = new Date(startDate.getTime() + workhour * 60 * 60 * 1000);

    const startStr = startDate
      .toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\//g, ".")
      .replace(/,/g, "");

    const endStr = endDate.toLocaleString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${startStr}~${endStr} (${workhour}시간)`;
  };

  const scheduleText = formatSchedule(notice.startsAt, notice.workhour);

  // 주소 포맷팅
  const address = `${shop.address1} ${shop.address2 || ""}`.trim();

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="mx-auto w-87.75 md:w-170 lg:w-241">
        <span className="mb-2 block text-lg font-bold text-orange-600">
          {shop.category || "식당"}
        </span>
        <h1 className="text-3xl font-bold text-black">{shop.name}</h1>
      </div>

      <ShopInfoCard
        variant="notice"
        imageUrl={shop.imageUrl}
        wageText={wageText}
        wageBadge={wageBadge}
        scheduleText={scheduleText}
        address={address}
        description={shop.description}
        footer={
          <Link href={`/notice/notice-detail/${shopId}/${noticeId}/edit`}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={notice.closed}
            >
              {notice.closed ? "마감 공고" : "공고 편집하기"}
            </Button>
          </Link>
        }
        detail={{ title: "공고 설명", content: notice.description }}
      />
    </div>
  );
}
