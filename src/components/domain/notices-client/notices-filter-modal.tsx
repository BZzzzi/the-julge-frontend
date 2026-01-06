"use client";

import { useEffect, useMemo } from "react";
import { create } from "zustand";

export type NoticeFilter = {
  locations: string[];
  startDate: string;
  minPay: string;
};

const SEOUL_GU_OPTIONS: string[] = [
  "서울시 종로구",
  "서울시 중구",
  "서울시 용산구",
  "서울시 성동구",
  "서울시 광진구",
  "서울시 동대문구",
  "서울시 중랑구",
  "서울시 성북구",
  "서울시 강북구",
  "서울시 도봉구",
  "서울시 노원구",
  "서울시 은평구",
  "서울시 서대문구",
  "서울시 마포구",
  "서울시 양천구",
  "서울시 강서구",
  "서울시 구로구",
  "서울시 금천구",
  "서울시 영등포구",
  "서울시 동작구",
  "서울시 관악구",
  "서울시 서초구",
  "서울시 강남구",
  "서울시 송파구",
  "서울시 강동구",
];

const EMPTY_FILTER: NoticeFilter = {
  locations: [],
  startDate: "",
  minPay: "",
};

export const toStartsAtGte = (dateYYYYMMDD: string) => {
  const now = new Date();
  const selected = new Date(`${dateYYYYMMDD}T00:00:00`);
  const gte = selected < now ? now : selected;
  return gte.toISOString();
};

export const buildNoticesFilterQueryString = (filter: NoticeFilter) => {
  const searchParams = new URLSearchParams();
  filter.locations.forEach((addr) => searchParams.append("address", addr));
  if (filter.startDate) searchParams.set("startsAtGte", toStartsAtGte(filter.startDate));
  if (filter.minPay) searchParams.set("hourlyPayGte", String(Number(filter.minPay)));
  return searchParams.toString();
};

/** 20251227 -> 2025-12-27 */
const formatToHyphenDate = (value: string) => {
  const digits = value.replace(/[^\d]/g, "").slice(0, 8);
  const y = digits.slice(0, 4);
  const m = digits.slice(4, 6);
  const d = digits.slice(6, 8);

  if (digits.length <= 4) return y;
  if (digits.length <= 6) return `${y}-${m}`;
  return `${y}-${m}-${d}`;
};

const isValidHyphenDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;

  const yyyy = String(date.getFullYear()).padStart(4, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}` === value;
};

type FilterStore = {
  draft: NoticeFilter;
  applied: NoticeFilter;

  syncDraftFromApplied: () => void;
  discardDraft: () => void;

  toggleLocation: (loc: string) => void;
  removeLocation: (loc: string) => void;

  setStartDate: (value: string) => void;
  setMinPay: (value: string) => void;

  resetDraft: () => void;
  applyDraft: () => void;
};

const useNoticeFilterStore = create<FilterStore>((set, get) => ({
  draft: EMPTY_FILTER,
  applied: EMPTY_FILTER,

  syncDraftFromApplied: () =>
    set(() => {
      const { applied } = get();
      return { draft: { ...applied, locations: [...applied.locations] } };
    }),

  discardDraft: () =>
    set(() => {
      const { applied } = get();
      return { draft: { ...applied, locations: [...applied.locations] } };
    }),

  toggleLocation: (loc) =>
    set((state) => {
      const exists = state.draft.locations.includes(loc);
      const locations = exists
        ? state.draft.locations.filter((v) => v !== loc)
        : [...state.draft.locations, loc];

      return { draft: { ...state.draft, locations } };
    }),

  removeLocation: (loc) =>
    set((state) => ({
      draft: { ...state.draft, locations: state.draft.locations.filter((v) => v !== loc) },
    })),

  setStartDate: (value) => set((state) => ({ draft: { ...state.draft, startDate: value } })),

  setMinPay: (value) =>
    set((state) => ({
      draft: { ...state.draft, minPay: value.replace(/[^\d]/g, "") },
    })),

  resetDraft: () => set({ draft: EMPTY_FILTER }),

  applyDraft: () =>
    set(() => {
      const { draft } = get();
      return { applied: { ...draft, locations: [...draft.locations] } };
    }),
}));

type FilterModalProps = {
  onClose?: () => void;
  onApply?: (filter: NoticeFilter) => void;
};

const FilterModal = ({ onClose, onApply }: FilterModalProps) => {
  const draft = useNoticeFilterStore((state) => state.draft);

  const syncDraftFromApplied = useNoticeFilterStore((state) => state.syncDraftFromApplied);
  const discardDraft = useNoticeFilterStore((state) => state.discardDraft);

  const toggleLocation = useNoticeFilterStore((state) => state.toggleLocation);
  const removeLocation = useNoticeFilterStore((state) => state.removeLocation);

  const setStartDate = useNoticeFilterStore((state) => state.setStartDate);
  const setMinPay = useNoticeFilterStore((state) => state.setMinPay);

  const resetDraft = useNoticeFilterStore((state) => state.resetDraft);
  const applyDraft = useNoticeFilterStore((state) => state.applyDraft);

  useEffect(() => {
    syncDraftFromApplied();
  }, [syncDraftFromApplied]);

  const selectedCountText = useMemo(() => {
    if (draft.locations.length === 0) return "";
    return `${draft.locations.length}개 선택됨`;
  }, [draft.locations.length]);

  const handleCloseClick = () => {
    discardDraft();
    onClose?.();
  };

  const handleResetClick = () => {
    resetDraft();
  };

  const handleApplyClick = () => {
    applyDraft();
    onApply?.({ ...draft, locations: [...draft.locations] });
  };

  const LOCATION_ITEM_H = 36;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden md:items-center">
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative flex h-dvh w-screen flex-col overflow-hidden rounded-none bg-white shadow-none md:h-auto md:max-h-[min(845px,100dvh)] md:w-[390px] md:rounded-2xl md:shadow-xl">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col px-3 md:px-5">
            <div className="pt-4 md:pt-6">
              <div className="flex h-9 w-full items-center justify-between">
                <h3 className="mb-0 text-[16px] leading-[24px] font-bold">상세 필터</h3>

                <button
                  type="button"
                  onClick={handleCloseClick}
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="flex flex-col">
                <section className="flex w-full flex-col gap-2">
                  <div className="flex w-full items-center justify-between">
                    <div className="text-[16px] leading-[26px] font-normal">위치</div>

                    <div className="text-[14px] leading-[22px] text-black/50">
                      {selectedCountText}
                    </div>
                  </div>

                  <div className="flex w-full flex-col rounded-lg border border-black/10 p-2">
                    <div className="h-[258px] w-[350px] max-w-full overflow-y-auto pr-2">
                      <ul className="m-0 flex w-full list-none flex-wrap gap-2 p-0">
                        {SEOUL_GU_OPTIONS.map((loc) => {
                          const selected = draft.locations.includes(loc);

                          return (
                            <li
                              key={loc}
                              className="flex-none"
                              style={{
                                width: "calc((100% - 8px) / 2)",
                                height: `${LOCATION_ITEM_H}px`,
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => toggleLocation(loc)}
                                className={[
                                  "flex h-full w-full items-center rounded-md px-2 text-left text-[14px] leading-[22px] transition",
                                  selected
                                    ? "bg-red-100 font-bold text-red-600"
                                    : "bg-white text-black/80 hover:bg-black/5",
                                ].join(" ")}
                              >
                                {loc}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  {draft.locations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {draft.locations.map((loc) => (
                        <div
                          key={loc}
                          className="flex-none"
                        >
                          <div className="flex h-8 items-center justify-between rounded-full bg-red-100 px-3 text-[12px] leading-[22px] font-bold text-red-600">
                            <span className="min-w-0 flex-1 truncate">{loc}</span>
                            <button
                              type="button"
                              onClick={() => removeLocation(loc)}
                              className="ml-2 flex h-5 w-5 items-center justify-center rounded-full"
                              aria-label={`${loc} 제거`}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <div className="mt-6 border-y-2 border-black/10 py-6">
                  <section className="flex w-full flex-col gap-2">
                    <div className="text-[14px] leading-[20px] font-semibold">시작일</div>

                    <input
                      inputMode="numeric"
                      placeholder="입력"
                      value={draft.startDate}
                      onChange={(event) => {
                        const formatted = formatToHyphenDate(event.target.value);

                        if (formatted.length === 10 && !isValidHyphenDate(formatted)) {
                          setStartDate("");
                          return;
                        }

                        setStartDate(formatted);
                      }}
                      className="h-16 w-full rounded-lg border border-black/10 px-3 text-[14px] leading-[20px] outline-none focus:border-orange-500"
                    />
                  </section>
                </div>

                <div className="pt-6">
                  <section className="flex w-full flex-col gap-2">
                    <div className="text-[14px] leading-[20px] font-semibold">금액</div>

                    <div className="flex w-full items-center gap-2 md:w-56">
                      <div className="relative h-16 min-w-0 flex-1 md:w-40 md:flex-none">
                        <input
                          inputMode="numeric"
                          placeholder="입력"
                          value={draft.minPay}
                          onChange={(event) => setMinPay(event.target.value)}
                          className="h-full w-full rounded-lg border border-black/10 px-3 pr-10 text-[14px] leading-[20px] outline-none focus:border-orange-500"
                        />
                        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[14px] leading-[20px] text-black/50">
                          원
                        </span>
                      </div>

                      <span className="shrink-0 text-[14px] leading-[20px] text-black/60">
                        이상부터
                      </span>
                    </div>
                  </section>
                </div>

                <div className="h-4 md:h-10" />
              </div>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col bg-white px-0 pt-0 pb-0">
            <div className="w-full md:hidden">
              <div className="w-full border-t border-black/10 bg-white shadow-sm">
                <div className="pt-4 pb-4">
                  <div className="flex w-full items-center gap-2 px-3">
                    <button
                      type="button"
                      onClick={handleResetClick}
                      className="h-12 flex-82 rounded-lg border border-red-600 text-[14px] leading-[20px] font-semibold text-red-600"
                    >
                      초기화
                    </button>

                    <button
                      type="button"
                      onClick={handleApplyClick}
                      className="h-12 flex-260 rounded-lg bg-red-600 text-[14px] leading-[20px] font-semibold text-white hover:bg-red-700"
                    >
                      적용하기
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="pb-6">
                <div className="mx-auto flex w-[350px] max-w-full items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetClick}
                    className="h-12 w-[82px] shrink-0 rounded-lg border border-red-600 text-[14px] leading-[20px] font-semibold text-red-600 hover:bg-red-50"
                  >
                    초기화
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyClick}
                    className="h-12 w-[260px] shrink-0 rounded-lg bg-red-600 text-[14px] leading-[20px] font-semibold text-white hover:bg-red-700"
                  >
                    적용하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
