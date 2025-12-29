import Image from "next/image";
import type { ReactNode } from "react";

type Badge = {
  text: string;
};

type NoticeVariantProps = {
  variant: "notice";
  wageLabel?: string;            // "시급"
  wageText: string;              // "15,000원"
  wageBadge?: Badge;             // "기존 시급보다 50% ↑"
  scheduleText?: string;         // "2023-01-02 15:00~18:00 (3시간)"
  address: string;               // "서울시 송파구"
  description: string;
  footer: ReactNode;             // 보통 버튼 1개
};

type ShopVariantProps = {
  variant: "shop";
  categoryLabel?: string;        // "식당"
  title: string;                 // "도토리 식당"
  address: string;
  description: string;
  footer: ReactNode;             // 보통 버튼 2개
};

type CommonProps = {
  imageUrl: string;
  imageAlt?: string;
  className?: string;
};

type ShopInfoCardProps = CommonProps & (NoticeVariantProps | ShopVariantProps);

export default function ShopInfoCard(props: ShopInfoCardProps) {
  const { imageUrl, imageAlt, className } = props;

  return (
    <section
      className={[
        // mobile / tablet
        "flex flex-col w-full rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
        "h-[450px] md:h-[677px] p-4 gap-4",
        // tablet spacing
        "md:p-6 md:gap-6",
        // desktop
        "lg:flex-row lg:w-241 lg:h-89 lg:p-6 lg:gap-8",
        props.variant === "shop" ? "bg-[#FDE9E4]" : "bg-white",
        className ?? "",
      ].join(" ")}
      aria-label="가게/공고 카드"
    >
      {/* image */}
      <div
        className={[
          "relative w-full overflow-hidden rounded-2xl bg-neutral-100",
          // mobile / tablet image height
          "h-[178px] md:h-[307px]",
          // desktop fixed
          "lg:w-134.75 lg:h-77",
        ].join(" ")}
      >
        <Image
          src={imageUrl}
          alt={imageAlt || "대표 이미지"}
          fill
          className="object-cover"
          sizes="(min-width: 1440px) 539px, 100vw"
        />
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col">
        {props.variant === "notice" ? (
          <NoticeContent {...props} />
        ) : (
          <ShopContent {...props} />
        )}
      </div>
    </section>
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
      <p className="mt-1 text-base md:text-lg font-extrabold text-orange-600">
        {wageLabel}
      </p>

      <div className="flex items-center gap-3">
        <p className="text-2xl md:text-[28px] font-extrabold tracking-tight text-neutral-900">
          {wageText}
        </p>

        {wageBadge && (
          <span className="inline-flex items-center rounded-full bg-orange-600 px-3 py-1.5 text-sm font-extrabold text-white">
            {wageBadge.text}
          </span>
        )}
      </div>

      {scheduleText && (
        <div className="mt-1 md:mt-2 flex items-center gap-2 text-neutral-500">
          <Image src="/icon/clock.svg" alt="근무 시간" width={20} height={20}/>
          <span className="text-sm md:text-base">{scheduleText}</span>
        </div>
      )}

      <div className="mt-1 md:mt-2 flex items-center gap-2 text-neutral-500">
        <Image src="/icon/pin.svg" alt="근무 지역" width={20} height={20}/>
        <span className="text-sm md:text-base font-normal">{address}</span>
      </div>
      
      <div className="mt-2 md:mt-3 flex-1 overflow-hidden">
        <p className="text-sm md:text-base leading-relaxed text-neutral-800 line-clamp-3 whitespace-pre-line">
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
      <p className="mt-1 text-base md:text-lg font-bold text-orange-600">{categoryLabel}</p>

      <h3 className="mt-2 text-xl md:text-[28px] font-extrabold text-neutral-900">
        {title}
      </h3>

      <div className="mt-1 md:mt-2 flex items-center gap-2 text-neutral-500">
        <Image
          src="/icon/pin.svg"
          alt="근무 지역"
          width={20}
          height={20}
        />
        <span className="text-sm md:text-base font-normal">{address}</span>
      </div>

      <div className="mt-3 md:mt-4 flex-1 overflow-hidden">
        <p className="text-sm md:text-base leading-relaxed text-neutral-800 line-clamp-5 whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="pt-3.5">{footer}</div>
    </>
  );
}


