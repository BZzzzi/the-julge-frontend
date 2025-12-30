"use client";

import { cn } from "@/utils/cn";
import * as React from "react";
import {
  buttonBaseClass,
  buttonDisabledClass,
  buttonSizeClassMap,
  buttonVariantClassMap,
  type ButtonSize,
  type ButtonVariant,
} from "./buttonStyles";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;

  /** 부모 너비 꽉 채우고 싶을 때 */
  fullWidth?: boolean;

  /** 로딩 상태 (클릭 방지 + 텍스트 대신 로딩 표시) */
  loading?: boolean;

  /** 로딩 문구 커스텀 */
  loadingText?: string;
};

export default function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  loading = false,
  loadingText = "처리 중 ...",
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        buttonBaseClass,
        buttonSizeClassMap[size],
        buttonVariantClassMap[variant],
        fullWidth && "w-full",
        isDisabled && buttonDisabledClass,
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white"
            aria-hidden="true"
          />
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
