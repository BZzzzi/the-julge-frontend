import { cn } from "@/utils/cn";
import * as React from "react";

export type FieldProps = {
  label?: string;
  required?: boolean;
  helperText?: string;
  errorMessage?:string;
  error?: boolean;
  className?: string;

  children: React.ReactNode;

  /** 입력 요소 id를 전달하면 label/htmlFor, helper aria-describedby 연결이 더 정확해짐 */
  htmlFor?: string;
};

export default function Field({
  label,
  required = false,
  helperText,
  errorMessage,
  error = false,
  className,
  children,
  htmlFor,
}: FieldProps) {
  const id = htmlFor ?? undefined;
  const helperId = id ? `${id}-helper` : undefined;
  const isError = error || !!errorMessage;

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-semibold text-gray-900"
        >
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
      )}

      {/* children에 helperId, error를 자동 주입하고 싶다면 cloneElement 패턴도 가능하지만,
          팀 사용성(예측 가능성) 위해 명시적으로 props 넘기는 방식 추천 */}
      {children}

      {(helperText || isError) && (
        <p
          id={helperId}
          className={cn(
            "mt-2 text-xs",
            isError ? "text-red-600" : "text-gray-500"
          )}
        >
          {isError ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
}