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
        "flex w-241 h-89 rounded-2xl p-6 gap-8",
        "shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
        props.variant === "shop" ? " bg-[#FDE9E4]" : "bg-white",
        className ?? "",
      ].join(" ")}
      aria-label="가게/공고 카드"
    >
      {/* left image */}
      <div className="relative w-134.75 h-77 overflow-hidden rounded-2xl bg-neutral-100">
        <Image
          src={imageUrl}
          alt={imageAlt || "대표 이미지"}
          fill
          className="object-cover"
          sizes="539px"
        />
      </div>

      {/* right content */}
      <div className="flex flex-1 flex-col">
        {props.variant === "notice" ? <NoticeContent {...props} /> : <ShopContent {...props} />}
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
      <p className="mt-1 text-lg font-extrabold text-orange-600">{wageLabel}</p>

      <div className="mt-1 flex items-center gap-3">
        <p className="text-3xl font-extrabold tracking-tight text-neutral-900">{wageText}</p>

        {wageBadge && (
          <span className="inline-flex items-center rounded-full bg-orange-600 px-3 py-1.5 text-sm font-extrabold text-white">
            {wageBadge.text}
          </span>
        )}
      </div>

      {scheduleText && (
        <div className="mt-3 flex items-center gap-2 text-neutral-500">
          <Image
            src="/icon/clock.svg"
            alt="근무 시간"
            width={20}
            height={20}
          />
          <span className="text-md">{scheduleText}</span>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 text-neutral-500">
        <Image
            src="/icon/pin.svg"
            alt="근무 지역"
            width={20}
            height={20}
          />
        <span className="text-md font-normal">{address}</span>
      </div>
      
      <div className="mt-3 flex-1 overflow-hidden">
        <p className=" text-md leading-relaxed text-neutral-800 line-clamp-3 whitespace-pre-line">
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
      <p className="mt-1 text-lg font-bold text-orange-600">{categoryLabel}</p>

      <h3 className="mt-1 text-[28px] font-extrabold text-neutral-900">
        {title}
      </h3>

      <div className="mt-2 flex items-center gap-2 text-neutral-500">
        <Image
          src="/icon/pin.svg"
          alt="근무 지역"
          width={20}
          height={20}
        />
        <span className="text-md font-normal">{address}</span>
      </div>

      <div className="mt-3 flex-1 overflow-hidden">
        <p className="text-md leading-relaxed text-neutral-800 line-clamp-5 whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="pt-3.5">{footer}</div>
    </>
  );
}


