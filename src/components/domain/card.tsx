"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/* ===== 카드에서 사용할 데이터 타입 ===== */
type CardData = {
  id: string;
  name: string;
  startsAt: string;
  workhour: number;
  address1: string;
  hourlyPay: number;
  imageUrl: string;
};

/* ===== API 응답 타입 ===== */
type NoticesResponse = {
  items: Array<{
    item: {
      id: string;
      hourlyPay: number;
      startsAt: string;
      workhour: number;
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

const BASE_URL = "https://bootcamp-api.codeit.kr/api/20-1/the-julge";
const BASE_HOURLY_PAY = 10320;

// KST 기준 "YYYY-MM-DD HH:mm" 포맷
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

// KST 기준 "HH:mm" 포맷
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

export default function Card() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch(`${BASE_URL}/notices?limit=6&sort=time`);
        if (!res.ok) throw new Error("fetch 실패");

        const data: NoticesResponse = await res.json();

        const mapped: CardData[] = data.items.map((n) => ({
          id: n.item.id,
          name: n.item.shop.item.name,
          startsAt: n.item.startsAt,
          address1: n.item.shop.item.address1,
          hourlyPay: n.item.hourlyPay,
          workhour: n.item.workhour,
          imageUrl: n.item.shop.item.imageUrl,
        }));

        setCards(mapped);
      } catch {
        setError(true);
      }
    }

    fetchNotices();
  }, []);

  if (error) return <div>카드를 불러오지 못했습니다.</div>;

  return (
    <div className="max-w-241 mx-auto">
      <p className="font-bold text-[28px] mb-8">최근에 본 공고</p>

      <div className="grid grid-cols-3 gap-3.5">
        {cards.map((c) => {
          const diffPercent =
            ((c.hourlyPay - BASE_HOURLY_PAY) / BASE_HOURLY_PAY) * 100;
          const isUp = diffPercent >= 0;
          const percentText = Math.round(Math.abs(diffPercent));

          // 시작/종료 시간 계산
          const start = new Date(c.startsAt);
          const end = new Date(start.getTime() + c.workhour * 60 * 60 * 1000);

          // 기한 기준: 시작 시간이 현재보다 과거면 지난 공고
          const isPast = start.getTime() < Date.now();

          // ✅ 지난 공고면 "모든 이미지" 톤 다운
          const imgDim = isPast ? "opacity-70 grayscale" : "opacity-100";

          return (
            <div
              key={c.id}
              className={`relative h-87.25 rounded-lg overflow-hidden cursor-pointer ${
                isPast ? "bg-[var(--color-gray-30)]" : "bg-white"
              }`}
            >
              {/* 지난 공고 */}
              {isPast && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/25 pointer-events-none">
                  <span className="text-[28px] text-white font-bold">
                    지난 공고
                  </span>
                </div>
              )}

              <div className="mx-4 mt-4">
                {/* ✅ 메인 이미지도 배경색이 보이게: 컨테이너에 bg 깔고 이미지 dim */}
                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-[var(--color-gray-30)]">
                  <Image
                    src={c.imageUrl}
                    alt={c.name}
                    fill
                    className={`object-cover ${imgDim}`}
                  />
                </div>
              </div>

              {/* 내용 */}
              <div className="px-4 mt-5">
                <p className={`font-bold text-[20px] ${isPast ? "text-gray-600" : "text-black"}`}>
                  {c.name}
                </p>

                <div className="flex items-center gap-1.5 mt-2">
                  <Image
                    src="/icon/clock.svg"
                    alt="clock"
                    width={20}
                    height={20}
                    className={imgDim}   // ✅ 아이콘도 dim
                  />
                  <p className={`text-sm ${isPast ? "text-gray-600" : "text-black"}`}>
                    {formatKSTDateTime(start)} ~ {formatKSTTime(end)} ({c.workhour}시간)
                  </p>
                </div>

                <div className="flex items-center gap-1.5 mt-2">
                  <Image
                    src="/icon/location.svg"
                    alt="location"
                    width={16}
                    height={20}
                    className={imgDim}   // ✅ 아이콘도 dim
                  />
                  <p className="text-sm font-regular text-gray-600">{c.address1}</p>
                </div>

                <div className="flex items-center justify-between mt-4 mb-4">
                  <p className={`text-2xl font-bold ${isPast ? "text-gray-600" : "text-black"}`}>
                    {c.hourlyPay.toLocaleString()}원
                  </p>

                  <div
                    className={`w-[168px] h-[32px] flex items-center justify-center text-center rounded-[20px] text-white ${
                      isPast ? "bg-gray-400" : isUp ? "bg-red-500" : "bg-blue-500"
                    }`}
                  >
                    <div className="flex items-center justify-center w-full gap-0.5">
                      <span>기존 시급보다 {percentText}%</span>

                      <Image
                        src="/icon/vector.svg"
                        alt={isUp ? "up" : "down"}
                        width={16}
                        height={16}
                        className={`${isUp ? "" : "rotate-90"} ${imgDim}`} // ✅ 벡터도 dim + 회전
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 카드 클릭 커서 유지 */}
              <div className="absolute inset-0 z-10 cursor-pointer" aria-hidden />
            </div>
          );
        })}
      </div>
    </div>
  );
}
