"use client";

import { Button } from "@/components/common/button";
import * as React from "react";

type Action = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline";
};

type BaseProps = {
  open: boolean;
  onClose: () => void;

  /** 모달 본문 문구 */
  description: string;

  className?: string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
};

type BasicVariantProps = BaseProps & {
  variant: "basic";
  actionLabel?: string;
  onAction?: () => void;
};

type IconVariantProps = BaseProps & {
  variant: "icon";
  icon: React.ReactNode;
  actions: [Action] | [Action, Action];
};

export type ModalProps = BasicVariantProps | IconVariantProps;

export default function Modal(props: ModalProps) {
  const {
    open,
    onClose,
    description,
    className,
    closeOnBackdrop = true,
    closeOnEsc = true,
  } = props;

  // ESC 닫기
  React.useEffect(() => {
    if (!open || !closeOnEsc) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEsc, onClose]);

  // body scroll lock
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const footer = (() => {
    // basic: 확인 1개 고정
    if (props.variant === "basic") {
      const label = props.actionLabel ?? "확인";
      const onAction = props.onAction ?? onClose;

      return (
        <div className="flex w-full max-w-[320px] justify-center">
          <Button className="w-30" variant="primary" size="lg" onClick={onAction}>
            {label}
          </Button>
        </div>
      );
    }

    // icon: 1개 or 2개
    const actions = props.actions;

    if (actions.length === 1) {
      const a = actions[0];
      return (
        <div className="flex w-full max-w-[320px] justify-center">
          <Button
            className="w-20"
            variant={a.variant ?? "primary"}
            size="md"
            onClick={a.onClick}
          >
            {a.label}
          </Button>
        </div>
      );
    }

    const [left, right] = actions;
    return (
      <div className="flex max-w-50 gap-3 justify-center">
        <Button
          className="w-20"
          variant={left.variant ?? "outline"}
          size="md"
          onClick={left.onClick}
        >
          {left.label}
        </Button>
        <Button
          className="w-20"
          variant={right.variant ?? "primary"}
          size="md"
          onClick={right.onClick}
        >
          {right.label}
        </Button>
      </div>
    );
  })();

  const panelClass =
    props.variant === "icon"
      ? [
        // ✅ icon: 고정 사이즈 298x184
        "w-[298px] h-[184px]",
        "rounded-2xl bg-white shadow-[0_12px_32px_rgba(0,0,0,0.16)]",
        "relative",
        className ?? "",
      ].join(" ")
      : [
        // ✅ basic: 기본 540x250, 화면 작아지면 w 줄어듦
        "w-[327px] h-[220px] md:w-full md:max-w-[540px] md:h-[250px]",
        "rounded-2xl bg-white shadow-[0_12px_32px_rgba(0,0,0,0.16)]",
        "relative",
        className ?? "",
      ].join(" ");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="모달 닫기"
        className="absolute inset-0 bg-black/50"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* panel */}
      <div className={panelClass}>
        {props.variant === "icon" ? (
          // ================= icon layout =================
          <div className="h-full p-6 flex flex-col justify-between items-center">
            <div className="flex flex-col items-center gap-3 text-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center">{props.icon}</div>
              <p className="whitespace-pre-line text-[16px] leading-relaxed text-gray-900">
                {description}
              </p>
            </div>
            {footer}
          </div>
        ) : (
          // ================= basic layout =================
          <div className="h-full px-6">
            <div className="h-full flex items-center justify-center text-center -translate-y-3">
              <p className="whitespace-pre-line leading-relaxed text-[18px] text-gray-900">
                {description}
              </p>
            </div>

            <div className="absolute left-0 right-0 bottom-6 flex justify-center">{footer}</div>
          </div>
        )}
      </div>
    </div>
  );
}
