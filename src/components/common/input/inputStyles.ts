export type InputSize = "md" | "lg";

/**
 * md: 일반 페이지용 (h-12)
 * lg: 로그인/회원가입 등 큰 인풋 (h-14)
 */
export const inputSizeClassMap: Record<InputSize, string> = {
  md: "h-12",
  lg: "h-14",
};
