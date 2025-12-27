"use client";

import { cn } from "@/utils/cn";
import * as SelectPrimitive from "@radix-ui/react-select";
import { inputSizeClassMap, type InputSize } from "./inputStyles";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  size?: InputSize;
  className?: string;
};

export default function Select({
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder = "선택",
  error = false,
  disabled = false,
  size = "md",
  className,
}: SelectProps) {
  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        className={cn(
          "relative w-full rounded-md border bg-white px-5 text-sm",
          "flex items-center",
          "outline-none focus:outline-none focus-visible:outline-none",
          "focus:ring-2 focus:ring-offset-0",
          inputSizeClassMap[size],
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-gray-400 focus:ring-gray-200",
          disabled && "cursor-not-allowed bg-gray-100",
          "text-gray-900, data-placeholder:text-gray-400",
          className
        )}
        aria-invalid={error || undefined}
      >
        <SelectPrimitive.Value placeholder={placeholder} />

        <SelectPrimitive.Icon className="pointer-events-none absolute right-5 text-gray-700">
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M5.5 7.5l4.5 4.5 4.5-4.5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={8}
          className={cn(
            "z-50 min-w-(--radix-select-trigger-width) overflow-hidden rounded-md border border-gray-300 bg-white shadow-md"
          )}
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((opt) => (
              <SelectPrimitive.Item
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm px-4 py-2 text-sm outline-none",
                  "data-highlighted:bg-gray-100",
                  "data-disabled:cursor-not-allowed data-disabled:opacity-50"
                )}
              >
                <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
