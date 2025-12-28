export type ButtonVariant = "primary" | "outline";
export type ButtonSize = "lg" | "md" | "sm";

export const buttonBaseClass =
  "inline-flex items-center justify-center gap-2 rounded-md font-bold transition-colors cursor-pointer " +
  "outline-none disabled:cursor-not-allowed disabled:opacity-100";

export const buttonSizeClassMap: Record<ButtonSize, string> = {
  // 높이/패딩/폰트만 통일 (너비는 레이아웃에서 w-full로)
  lg: "h-12 px-4 text-md", // CTA bold1
  md: "h-10 px-3 text-md", // 기본 bold2
  sm: "h-9 px-2 text-xs" ,  // 작은 버튼 caption
};

export const buttonVariantClassMap: Record<ButtonVariant, string> = {
  primary:
    "bg-orange-600 text-white hover:bg-orange-700 ",
  outline:
    "border border-orange-600 bg-white text-orange-600 hover:bg-orange-50 ",
};

 // disabled 상태는 variant 위에 "덮어쓰기"로 통일 처리
export const buttonDisabledClass =
  "bg-gray-400 text-white border-transparent hover:bg-gray-300" ;
