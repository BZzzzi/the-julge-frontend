import { cn } from "@/utils/cn";
import * as React from "react";
import { inputSizeClassMap, type InputSize } from "./inputStyles";

type CommonProps = {
  error?: boolean;
  size?: InputSize;
  as?: "input" | "textarea";
  rightSlot?: React.ReactNode;
};

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  as?: "input";
};

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  as: "textarea";
};

export type FieldInputProps = CommonProps & (InputProps | TextareaProps);

const FieldInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FieldInputProps>(
  ({ className, error = false, size = "md", as = "input", rightSlot, id, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const isTextarea = as === "textarea";

    const baseClass = cn(
      "w-full rounded-md border bg-white px-5 text-sm text-gray-900 outline-none",
      "placeholder:text-gray-40",
      "focus:ring-2 focus:ring-offset-0",
      inputSizeClassMap[size],
      error
        ? "border-red-500 focus:ring-red-200"
        : "border-gray-30 focus:border-gray-40 focus:ring-gray-20",
      props.disabled && "cursor-not-allowed bg-gray-10 text-gray-50",
      !isTextarea && rightSlot && "pr-12",
      className,
    );

    return (
      <div className="relative">
        {isTextarea ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={inputId}
            aria-invalid={error || undefined}
            className={cn(baseClass, "min-h-30 resize-none overflow-y-auto py-3")}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <>
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={inputId}
              aria-invalid={error || undefined}
              className={baseClass}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
            {rightSlot && (
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-gray-700">
                {rightSlot}
              </div>
            )}
          </>
        )}
      </div>
    );
  },
);

FieldInput.displayName = "FieldInput";
export default FieldInput;
