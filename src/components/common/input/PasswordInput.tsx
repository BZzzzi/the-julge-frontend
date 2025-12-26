"use client";

import { cn } from "@/utils/cn";
import * as React from "react";
import { inputSizeClassMap, type InputSize } from "./inputStyles";

export type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> & {
  error?: boolean;
  /** 토글 버튼 숨기고 싶으면 false */
  allowToggle?: boolean;
  size?: InputSize;
};

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error = false, allowToggle = true, size="md", id, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={error || undefined}
          className={cn(
            "w-full rounded-md border bg-white px-4 text-sm text-gray-900 outline-none",
            "placeholder:text-gray-400",
            "focus:ring-2 focus:ring-offset-0",
            inputSizeClassMap[size],
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-gray-400 focus:ring-gray-200",
            props.disabled && "cursor-not-allowed bg-gray-100 text-gray-500",
            allowToggle && "pr-16",
            className
          )}
          {...props}
        />

        {allowToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-3 my-auto h-8 rounded px-2 text-xs text-gray-600 hover:bg-gray-100"
            onClick={() => setVisible((v) => !v)}
            tabIndex={props.disabled ? -1 : 0}
            disabled={props.disabled}
          >
            {visible ? "숨김" : "보기"}
          </button>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
