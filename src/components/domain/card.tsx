"use client";

import Image from "next/image";

export type CardData = {
  noticeId: string;
  shopId: string;
  name: string;
  startsAt: string;
  workhour: number;
  address1: string;
  hourlyPay: number;
  imageUrl: string;
  isPast: boolean;
};

type CardProps = {
  cards: CardData[];
  selectedNoticeId: string | null;
  onSelect: (payload: { noticeId: string; shopId: string; isPast: boolean }) => void;
  pastLabel?: string;
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

export default function Card({
  cards,
  selectedNoticeId,
  onSelect,
  pastLabel = "지난 공고", // ✅ 기본값
}: CardProps) {
  return (
    <div className="mx-auto max-w-87.5 sm:max-w-87.5 md:max-w-169.5 lg:max-w-241">
      <p className="mb-4 text-xl font-bold text-black md:mb-8 md:text-[28px]">최근에 본 공고</p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-2 md:grid-cols-2 md:gap-3.5 lg:grid-cols-3">
        {cards.map((c) => {
          const diffPercent = ((c.hourlyPay - BASE_HOURLY_PAY) / BASE_HOURLY_PAY) * 100;
          const isUp = diffPercent >= 0;
          const percentText = Math.round(Math.abs(diffPercent));

          const start = new Date(c.startsAt);
          const end = new Date(start.getTime() + c.workhour * 60 * 60 * 1000);

          const isPast = c.isPast;
          const imgDim = isPast ? "opacity-70 grayscale" : "opacity-100";
          const isSelected = selectedNoticeId === c.noticeId;

          return (
            <div
              key={c.noticeId}
              onClick={() => onSelect({ noticeId: c.noticeId, shopId: c.shopId, isPast: c.isPast })}
              className={[
                "border-gray-20 relative h-full cursor-pointer overflow-hidden rounded-lg border",
                isSelected,
              ].join(" ")}
            >
              {isPast && (
                <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center bg-black/25 pt-19.75">
                  <span className="text-[28px] font-bold text-white">{pastLabel}</span>
                </div>
              )}

              <div className="mx-3 mt-3 sm:mx-3 sm:mt-3 md:mx-4 md:mt-4">
                <div className="bg-gray-30 relative h-21 w-full overflow-hidden rounded-xl sm:h-21 lg:h-40">
                  <Image src={c.imageUrl} alt={c.name} fill className={`object-cover ${imgDim}`} />
                </div>
              </div>

              <div className="mt-3 px-3 sm:mt-3 sm:px-3 lg:mt-4 lg:px-4">
                <p
                  className={`text-[16px] font-bold sm:text-[16px] md:text-[20px] ${
                    isPast ? "text-gray-30" : "text-black"
                  }`}
                >
                  {c.name}
                </p>

                <div className="mt-2 flex items-start gap-1.5 md:items-center">
                  <Image
                    src="/icon/clock.svg"
                    alt="clock"
                    width={16}
                    height={16}
                    className={`md:h-5 md:w-5 ${imgDim}`}
                  />
                  <div
                    className={`font-regular text-xs md:text-sm ${
                      isPast ? "text-gray-30" : "text-gray-50"
                    }`}
                  >
                    <div className="sm:block md:hidden">
                      <div>{formatKSTDateTime(start).slice(0, 10)}</div>
                      <div>
                        {formatKSTTime(start)} ~ {formatKSTTime(end)} ({c.workhour}시간)
                      </div>
                    </div>

                    <div className="hidden md:block">
                      {formatKSTDateTime(start)} ~ {formatKSTTime(end)} ({c.workhour}시간)
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-1.5 md:gap-2">
                  <Image
                    src="/icon/location.svg"
                    alt="location"
                    width={12.8}
                    height={16}
                    className={`md:h-5 md:w-4 ${imgDim}`}
                  />
                  <p
                    className={`font-regular text-xs md:text-sm ${
                      isPast ? "text-gray-30" : "text-gray-50"
                    }`}
                  >
                    {c.address1}
                  </p>
                </div>

                <div className="items-left mt-4 mb-4 flex flex-col justify-between md:flex-row">
                  <p className={`text-lg font-bold md:text-2xl ${isPast ? "text-gray-30" : "text-black"}`}>
                    {c.hourlyPay.toLocaleString()}원
                  </p>

                  <div
                    className={`flex h-4.5 w-30.75 items-center justify-center rounded-[20px] bg-transparent md:h-8 md:w-42 ${
                      isPast ? "md:bg-gray-20" : isUp ? "md:bg-red-40" : "md:bg-blue-500"
                    }`}
                  >
                    <div className="font-regular flex w-full items-center justify-start gap-0.5 text-xs md:justify-center md:text-sm">
                      <span className={`md:text-white ${isPast ? "text-gray-30" : "text-red-40"}`}>
                        기존 시급보다 {percentText}%
                      </span>

                      <Image
                        src="/icon/arrowfff.svg"
                        alt={isUp ? "up" : "down"}
                        width={13}
                        height={13}
                        className={`${isUp ? "" : "rotate-90"} ${imgDim} hidden md:block`}
                      />

                      <Image
                        src="/icon/arrowred.svg"
                        alt={isUp ? "up" : "down"}
                        width={10.45}
                        height={10.56}
                        className={`${isUp ? "" : "rotate-90"} ${imgDim} block md:hidden`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 z-10 cursor-pointer" aria-hidden />
            </div>
          );
        })}
      </div>
    </div>
  );
}
