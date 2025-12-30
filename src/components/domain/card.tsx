"use client";

import Image from "next/image";

/* ===== 카드에서 사용할 데이터 타입 ===== */
export type CardData = {
  id: string;
  name: string;
  startsAt: string;
  workhour: number;
  address1: string;
  hourlyPay: number;
  imageUrl: string;
  isPast: boolean; // ✅ page.tsx에서 미리 계산해서 내려줌
};

type CardProps = {
  cards: CardData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const BASE_HOURLY_PAY = 10320;

// KST 기준 "YYYY-MM-DD HH:mm"
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

// KST 기준 "HH:mm"
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

export default function Card({ cards, selectedId, onSelect }: CardProps) {
  return (
    <div className="mx-auto lg:max-w-241 md:max-w-169.5 sm:max-w-87.5 max-w-87.5">
      <p className="font-bold text-[var(--color-black)] text-xl mb-4 md:text-[28px] md:mb-8">
        최근에 본 공고
      </p>

      <div className="grid lg:grid-cols-3 md:gap-3.5 md:grid-cols-2 sm:grid-cols-2 sm:gap-2 grid-cols-2 gap-2">
        {cards.map((c) => {
          const diffPercent =
            ((c.hourlyPay - BASE_HOURLY_PAY) / BASE_HOURLY_PAY) * 100;
          const isUp = diffPercent >= 0;
          const percentText = Math.round(Math.abs(diffPercent));

          const start = new Date(c.startsAt);
          const end = new Date(start.getTime() + c.workhour * 60 * 60 * 1000);

          // ✅ Date.now() 없음 / setNow 없음
          const isPast = c.isPast;

          const imgDim = isPast ? "opacity-70 grayscale" : "opacity-100";
          const isSelected = selectedId === c.id;

          return (
            <div
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={[
                "relative h-full rounded-lg overflow-hidden cursor-pointer border border-[var(--color-gray-20)]",
                isSelected
              ].join(" ")}
            >
              {/* 지난 공고 */}
              {isPast && (
                <div className="absolute inset-0 z-20 pt-19.75 flex items-start justify-center bg-black/25 pointer-events-none">
                  <span className="text-[28px] text-white font-bold">
                    지난 공고
                  </span>
                </div>
              )}

              <div className="mx-3 mt-3 sm:mx-3 sm:mt-3 md:mx-4 md:mt-4">
                <div className="relative w-full lg:h-40 sm:h-21 h-21 rounded-xl overflow-hidden bg-[var(--color-gray-30)]">
                  <Image
                    src={c.imageUrl}
                    alt={c.name}
                    fill
                    className={`object-cover ${imgDim}`}
                  />
                </div>
              </div>

              {/* 내용 */}
              <div className="px-3 mt-3 lg:px-4 lg:mt-4 sm:px-3 sm:mt-3">
                <p
                  className={`font-bold md:text-[20px] sm:text-[16px] text-[16px] ${isPast
                    ? "text-[var(--color-gray-30)]"
                    : "text-[var(--color-black)]"
                    }`}
                >
                  {c.name}
                </p>

                <div className="flex items-start md:items-center gap-1.5 mt-2">
                  <Image
                    src="/icon/clock.svg"
                    alt="clock"
                    width={16}
                    height={16}
                    className={`md:w-5 md:h-5 ${imgDim}`}
                  />
                  <div
                    className={`text-xs md:text-sm font-regular ${isPast
                      ? "text-[var(--color-gray-30)]"
                      : "text-[var(--color-gray-50)]"
                      }`}
                  >
                    {/* 모바일(기본): 2줄 */}
                    <div className="md:hidden sm:block">
                      <div>{formatKSTDateTime(start).slice(0, 10)}</div>
                      <div>
                        {formatKSTTime(start)} ~ {formatKSTTime(end)} (
                        {c.workhour}시간)
                      </div>
                    </div>

                    {/* md 이상: 1줄 */}
                    <div className="hidden md:block">
                      {formatKSTDateTime(start)} ~ {formatKSTTime(end)} (
                      {c.workhour}시간)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-2 md:gap-2">
                  <Image
                    src="/icon/location.svg"
                    alt="location"
                    width={12.8}
                    height={16}
                    className={`md:w-4 md:h-5 ${imgDim}`}
                  />
                  <p
                    className={`text-xs md:text-sm font-regular ${isPast
                      ? "text-[var(--color-gray-30)]"
                      : "text-[var(--color-gray-50)]"
                      }`}
                  >
                    {c.address1}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-left justify-between mt-4 mb-4">
                  <p
                    className={`text-lg md:text-2xl font-bold ${isPast
                      ? "text-[var(--color-gray-30)]"
                      : "text-[var(--color-black)]"
                      }`}
                  >
                    {c.hourlyPay.toLocaleString()}원
                  </p>

                  <div
                    className={`
                      md:w-42 md:h-8 w-[123px] h-[18px] flex items-center justify-center rounded-[20px]
                      bg-transparent
                      ${isPast
                        ? "md:bg-[var(--color-gray-20)]"
                        : isUp
                          ? "md:bg-[var(--color-red-40)] "
                          : "md:bg-blue-500"
                      }
                    `}
                  >
                    <div className="flex items-center justify-start w-full gap-0.5 text-xs md:text-sm md:justify-center font-regular">
                      <span
                        className={`md:text-[var(--color-white)] ${isPast
                          ? "text-[var(--color-gray-30)]"
                          : "text-[var(--color-red-40)]"
                          }`}
                      >
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
