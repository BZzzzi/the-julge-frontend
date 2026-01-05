"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export const SORT_OPTIONS = [
  { label: "마감임박순", value: "time" },
  { label: "시급많은순", value: "pay" },
  { label: "시간적은순", value: "workhour" },
  { label: "가나다순", value: "name" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

type Props = {
  sortValue: SortValue;
  onChangeSort: (v: SortValue) => void;
  onOpenFilter: () => void;
};

export default function NoticesToolbar({ sortValue, onChangeSort, onOpenFilter }: Props) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortWrapRef = useRef<HTMLDivElement | null>(null);

  const selectedSortLabel = useMemo(
    () => SORT_OPTIONS.find((o) => o.value === sortValue)?.label ?? "마감임박순",
    [sortValue],
  );

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!sortWrapRef.current) return;
      if (sortWrapRef.current.contains(e.target as Node)) return;
      setSortOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div className="flex items-center gap-[10px] md:justify-end">
      <div className="relative" ref={sortWrapRef}>
        <button
          type="button"
          onClick={() => setSortOpen((v) => !v)}
          className="flex h-[30px] w-[105px] cursor-pointer items-center justify-between rounded-md bg-[var(--color-gray-10)] px-2 text-[14px] font-bold text-[var(--color-black)]"
        >
          <span className="truncate">{selectedSortLabel}</span>

          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={sortOpen ? "rotate-180 transition-transform" : "transition-transform"}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#111322"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {sortOpen && (
          <div className="absolute top-full left-0 z-30 mt-2 w-[105px] overflow-hidden rounded-md border border-[var(--color-gray-20)] bg-white shadow-md">
            {SORT_OPTIONS.map((opt) => {
              const isSelected = opt.value === sortValue;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChangeSort(opt.value);
                    setSortOpen(false);
                  }}
                  className={[
                    "flex h-[30px] w-full items-center px-3 text-left text-[14px] text-[var(--color-black)] hover:bg-[var(--color-gray-10)]",
                    isSelected ? "font-bold" : "font-normal",
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenFilter}
        className="h-[30px] w-[79px] cursor-pointer rounded-md bg-[var(--color-red-30)] text-[14px] font-bold text-[var(--color-white)]"
      >
        상세필터
      </button>
    </div>
  );
}
