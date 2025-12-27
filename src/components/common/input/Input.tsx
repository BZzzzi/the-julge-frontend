import { cn } from "@/utils/cn";
import * as React from "react";
import { inputSizeClassMap, type InputSize } from "./inputStyles";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  error?: boolean;
  rightSlot?: React.ReactNode;
  size?: InputSize;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error = false, rightSlot, size="md", id, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;

    return (
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error || undefined}
          className={cn(
            // 디자인에 맞춰 조절 가능
            "w-full rounded-md border bg-white px-5 text-sm text-gray-900 outline-none",
            "placeholder:text-gray-400",
            "focus:ring-2 focus:ring-offset-0",
            inputSizeClassMap[size],
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-gray-400 focus:ring-gray-200",
            props.disabled && "cursor-not-allowed bg-gray-100 text-gray-500",
            rightSlot && "pr-12", // 오른쪽 슬롯이 있으면 padding 확보
            className
          )}
          {...props}
        />

        {rightSlot && (
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-gray-700">
            {rightSlot}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
