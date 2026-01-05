import Image from "next/image";
import type { ReactNode } from "react";

type Badge = {
  text: string;
  icon: ReactNode;
};

type DetailCard = {
  title?: string; // 기본 "공고 설명"
  content: string; // 회색 카드 내용
  className?: string; // 필요시 커스텀
};

type NoticeVariantProps = {
  variant: "notice";
  wageLabel?: string; // "시급"
  wageText: string; // "15,000원"
  wageBadge?: Badge; // "기존 시급보다 50% ↑"
  scheduleText?: string; // "2023-01-02 15:00~18:00 (3시간)"
  address: string; // "서울시 송파구"
  description: string;
  footer: ReactNode; // 보통 버튼 1개
};

type ShopVariantProps = {
  variant: "shop";
  categoryLabel?: string; // "식당"
  title: string; // "도토리 식당"
  address: string;
  description: string;
  footer: ReactNode; // 보통 버튼 2개
};

type CommonProps = {
  imageUrl: string;
  imageAlt?: string;
  className?: string;

  // 회색 공고 설명 카드
  detail?: DetailCard;
};

type ShopInfoCardProps = CommonProps & (NoticeVariantProps | ShopVariantProps);

export default function ShopInfoCard(props: ShopInfoCardProps) {
  const { imageUrl, imageAlt, className, detail } = props;

  return (
    <div className="w-full">
      <div className="mx-auto flex w-[351px] flex-col gap-4 md:w-[680px] lg:w-[964px]">
        <section
          className={[
            "flex flex-col rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.1)]",
            "h-112.5 gap-4 p-4 md:h-169.25 md:gap-6 md:p-6",
            "lg:h-89 lg:flex-row lg:gap-8 lg:p-6",
            props.variant === "shop" ? "bg-[#FDE9E4]" : "bg-white",
            className ?? "",
          ].join(" ")}
          aria-label="가게/공고 카드"
        >
          {/* image */}
          <div
            className={[
              "relative overflow-hidden rounded-2xl bg-neutral-100",
              "h-44.5 md:h-76.75",
              "lg:h-77 lg:w-134.75",
            ].join(" ")}
          >
            <Image
              src={imageUrl}
              alt={imageAlt || "대표 이미지"}
              fill
              className="object-cover"
              sizes="(min-width: 1440px) 539px, (min-width: 768px) 680px, 351px"
            />
          </div>

          {/* content */}
          <div className="flex flex-1 flex-col">
            {props.variant === "notice" ? <NoticeContent {...props} /> : <ShopContent {...props} />}
          </div>
        </section>

        {/* 회색 카드(옵션) */}
        {detail ? (
          <DetailCardView
            title={detail.title}
            content={detail.content}
            className={detail.className}
          />
        ) : null}
      </div>
    </div>
  );
}

function DetailCardView({
  title = "공고 설명",
  content,
  className,
}: {
  title?: string;
  content: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "bg-gray-10 mt-4 w-full rounded-2xl",
        "px-6 py-5 md:px-8 md:py-6",
        className ?? "",
      ].join(" ")}
      aria-label="공고 설명"
    >
      <h4 className="text-sm font-extrabold text-neutral-900 md:text-base">{title}</h4>

      <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-neutral-700 md:text-base">
        {content}
      </p>
    </div>
  );
}

function NoticeContent({
  wageLabel = "시급",
  wageText,
  wageBadge,
  scheduleText,
  address,
  description,
  footer,
}: Omit<NoticeVariantProps, "variant">) {
  return (
    <>
      <p className="mt-1 text-base font-extrabold text-orange-600 md:text-lg">{wageLabel}</p>

      <div className="flex items-center gap-3">
        <p className="text-2xl font-extrabold tracking-tight text-neutral-900 md:text-[28px]">
          {wageText}
        </p>

        {wageBadge && (
          <span className="inline-flex items-center rounded-full bg-orange-600 px-3 py-1.5 text-sm font-extrabold text-white">
            {wageBadge.text}

            {wageBadge.icon ? <span className="shrink-0">{wageBadge.icon}</span> : null}
          </span>
        )}
      </div>

      {scheduleText && (
        <div className="mt-1 flex items-center gap-2 text-neutral-500 md:mt-2">
          <Image src="/icon/clock.svg" alt="근무 시간" width={20} height={20} />
          <span className="text-sm md:text-base">{scheduleText}</span>
        </div>
      )}

      <div className="mt-1 flex items-center gap-2 text-neutral-500 md:mt-2">
        <Image src="/icon/location.svg" alt="근무 지역" width={20} height={20} />
        <span className="text-sm font-normal md:text-base">{address}</span>
      </div>

      <div className="mt-2 flex-1 overflow-hidden md:mt-3">
        <p className="line-clamp-3 text-sm leading-relaxed whitespace-pre-line text-neutral-800 md:text-base">
          {description}
        </p>
      </div>

      <div className="pt-3.5">{footer}</div>
    </>
  );
}

function ShopContent({
  categoryLabel = "식당",
  title,
  address,
  description,
  footer,
}: Omit<ShopVariantProps, "variant">) {
  return (
    <>
      <p className="mt-1 text-base font-bold text-orange-600 md:text-lg">{categoryLabel}</p>

      <h3 className="mt-2 text-xl font-extrabold text-neutral-900 md:text-[28px]">{title}</h3>

      <div className="mt-1 flex items-center gap-2 text-neutral-500 md:mt-2">
        <Image src="/icon/pin.svg" alt="근무 지역" width={20} height={20} />
        <span className="text-sm font-normal md:text-base">{address}</span>
      </div>

      <div className="mt-3 flex-1 overflow-hidden md:mt-4">
        <p className="line-clamp-5 text-sm leading-relaxed whitespace-pre-line text-neutral-800 md:text-base">
          {description}
        </p>
      </div>

      <div className="pt-3.5">{footer}</div>
    </>
  );
}
