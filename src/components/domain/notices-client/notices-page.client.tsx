"use client";

import { useUser } from "@/store/user";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { Pagination } from "@/components/common/pagination";
import FilterModal, {
  buildNoticesFilterQueryString,
  type NoticeFilter,
} from "@/components/domain/notices-client/notices-filter-modal";

import NoticesToolbar, {
  type SortValue,
} from "@/components/domain/notices-client/notices-toolbar.client";

type CardData = {
  id: string;
  name: string;
  startsAt: string;
  workhour: number;
  address1: string;
  hourlyPay: number;
  imageUrl: string;
};

type NoticesResponse = {
  items: Array<{
    item: {
      id: string;
      hourlyPay: number;
      startsAt: string;
      workhour: number;
      shop: {
        item: {
          name: string;
          address1: string;
          imageUrl: string;
        };
      };
    };
  }>;
  totalPage?: number | string;
  totalPages?: number | string;
  totalCount?: number | string;
  count?: number | string;
  total?: number | string;
};

const BASE_HOURLY_PAY = 10320;
const LIST_LIMIT = 6;

const parsePositiveInt = (v: unknown) => {
  if (typeof v === "number" && Number.isFinite(v) && v > 0) return Math.floor(v);
  if (typeof v === "string" && /^\d+$/.test(v.trim())) return Number(v.trim());
  return null;
};

const formatKSTDateTime = (date: Date) => {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
};

const formatKSTTime = (date: Date) => {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("hour")}:${get("minute")}`;
};

const mapToCards = (data: NoticesResponse): CardData[] =>
  data.items.map((n) => ({
    id: n.item.id,
    name: n.item.shop.item.name,
    startsAt: n.item.startsAt,
    address1: n.item.shop.item.address1,
    hourlyPay: n.item.hourlyPay,
    workhour: n.item.workhour,
    imageUrl: n.item.shop.item.imageUrl,
  }));

const getTotalPage = (data: NoticesResponse) => {
  const tp =
    parsePositiveInt(data.totalPage) ??
    parsePositiveInt(data.totalPages) ??
    parsePositiveInt((data as { total_page?: unknown }).total_page);

  if (tp) return tp;

  const totalCount =
    parsePositiveInt(data.totalCount) ??
    parsePositiveInt(data.count) ??
    parsePositiveInt(data.total) ??
    parsePositiveInt((data as { total_count?: unknown }).total_count);

  if (!totalCount) return 1;
  return Math.max(1, Math.ceil(totalCount / LIST_LIMIT));
};

const getServerSort = (sortValue: SortValue) => {
  if (sortValue === "workhour" || sortValue === "name") return "time";
  return sortValue;
};

const applyClientSort = (cards: CardData[], sortValue: SortValue) => {
  const next = [...cards];

  if (sortValue === "workhour") next.sort((a, b) => a.workhour - b.workhour);
  else if (sortValue === "name") next.sort((a, b) => a.name.localeCompare(b.name, "ko"));

  return next;
};

const buildListQuery = ({
  limit,
  offset,
  sort,
  keyword,
  filterQueryString,
}: {
  limit: number;
  offset: number;
  sort: string;
  keyword: string;
  filterQueryString: string;
}) => {
  const qs = new URLSearchParams();
  qs.set("limit", String(limit));
  qs.set("offset", String(offset));
  qs.set("sort", sort);
  if (keyword) qs.set("keyword", keyword);

  if (filterQueryString) {
    const extra = new URLSearchParams(filterQueryString);
    extra.forEach((value, key) => qs.append(key, value));
  }

  return qs.toString();
};

const fetchNotices = async (queryString: string) => {
  const res = await fetch(`/api/notices?${queryString}`);
  if (!res.ok) throw new Error("fetch failed");
  return (await res.json()) as NoticesResponse;
};

const TitleBlock = ({ keyword }: { keyword: string }) => {
  if (!keyword) return <h3 className="mb-0 text-[var(--color-black)]">전체 공고</h3>;
  return (
    <h3 className="mb-0 text-[var(--color-black)]">
      <span className="text-[var(--color-red-40)]">{keyword}</span>에 대한 공고 목록
    </h3>
  );
};

const NoticeCard = (c: CardData) => {
  const diffPercent = ((c.hourlyPay - BASE_HOURLY_PAY) / BASE_HOURLY_PAY) * 100;
  const isUp = diffPercent >= 0;
  const percentText = Math.round(Math.abs(diffPercent));

  const start = new Date(c.startsAt);
  const end = new Date(start.getTime() + c.workhour * 60 * 60 * 1000);

  const isPast = start.getTime() < new Date().getTime();
  const imgDim = isPast ? "opacity-70 grayscale" : "opacity-100";

  return (
    <div className="relative h-full cursor-pointer overflow-hidden rounded-lg border border-[var(--color-gray-20)] bg-white">
      {isPast && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center bg-black/25 pt-19.75">
          <span className="text-[28px] font-bold text-white">지난 공고</span>
        </div>
      )}

      <div className="mx-3 mt-3 md:mx-4 md:mt-4">
        <div className="relative h-21 w-full overflow-hidden rounded-xl bg-[var(--color-gray-30)] lg:h-40">
          <Image
            src={c.imageUrl}
            alt={c.name}
            fill
            sizes="100vw"
            className={`object-cover ${imgDim}`}
          />
        </div>
      </div>

      <div className="mt-3 px-3 lg:mt-4 lg:px-4">
        <p
          className={`text-[16px] font-bold md:text-[20px] ${
            isPast ? "text-[var(--color-gray-30)]" : "text-[var(--color-black)]"
          }`}
        >
          {c.name}
        </p>

        <div className="mt-2 flex items-start gap-1.5 md:items-center">
          <Image
            src="/icon/clock.svg"
            alt="clock"
            width={16}
            height={16}
            className={`md:h-5 md:w-5 ${imgDim}`}
          />
          <div
            className={`text-xs md:text-sm ${
              isPast ? "text-[var(--color-gray-30)]" : "text-[var(--color-gray-50)]"
            }`}
          >
            <div className="md:hidden">
              <div>{formatKSTDateTime(start).slice(0, 10)}</div>
              <div>
                {formatKSTTime(start)} ~ {formatKSTTime(end)} ({c.workhour}시간)
              </div>
            </div>

            <div className="hidden md:block">
              {formatKSTDateTime(start)} ~ {formatKSTTime(end)} ({c.workhour}시간)
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1.5 md:gap-2">
          <Image
            src="/icon/location.svg"
            alt="location"
            width={12.8}
            height={16}
            className={`md:h-5 md:w-4 ${imgDim}`}
          />
          <p
            className={`text-xs md:text-sm ${
              isPast ? "text-[var(--color-gray-30)]" : "text-[var(--color-gray-50)]"
            }`}
          >
            {c.address1}
          </p>
        </div>

        <div className="mt-4 mb-4 flex flex-col justify-between md:flex-row">
          <p
            className={`text-lg font-bold md:text-2xl ${
              isPast ? "text-[var(--color-gray-30)]" : "text-[var(--color-black)]"
            }`}
          >
            {c.hourlyPay.toLocaleString()}원
          </p>

          <div
            className={`flex h-[18px] w-[123px] items-center justify-center rounded-[20px] bg-transparent md:h-8 md:w-42 ${
              isPast
                ? "md:bg-[var(--color-gray-20)]"
                : isUp
                  ? "md:bg-[var(--color-red-40)]"
                  : "md:bg-blue-500"
            }`}
          >
            <div className="flex w-full items-center justify-start gap-0.5 text-xs md:justify-center md:text-sm">
              <span
                className={`md:text-[var(--color-white)] ${
                  isPast ? "text-[var(--color-gray-30)]" : "text-[var(--color-red-40)]"
                }`}
              >
                기존 시급보다 {percentText}%
              </span>

              <Image
                src="/icon/arrowfff.svg"
                alt={isUp ? "up" : "down"}
                width={13}
                height={13}
                className={`${isUp ? "" : "rotate-90"} ${imgDim} hidden md:block`}
              />

              <Image
                src="/icon/arrowred.svg"
                alt={isUp ? "up" : "down"}
                width={10.45}
                height={10.56}
                className={`${isUp ? "" : "rotate-90"} ${imgDim} block md:hidden`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-10 cursor-pointer" aria-hidden />
    </div>
  );
};

const NoticeGrid = ({ cards }: { cards: CardData[] }) => (
  <div className="grid grid-cols-2 gap-2 md:gap-3.5 lg:grid-cols-3">
    {cards.map((c) => (
      <div key={c.id}>{NoticeCard(c)}</div>
    ))}
  </div>
);

const FitCards = ({ cards }: { cards: CardData[] }) => {
  return (
    <>
      <div className="lg:hidden">
        <Swiper slidesPerView={2.3} spaceBetween={8} style={{ paddingBottom: 4 }}>
          {cards.map((c) => (
            <SwiperSlide key={c.id} className="!h-auto">
              {NoticeCard(c)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-3 gap-4">
          {cards.slice(0, 3).map((c) => (
            <div key={c.id}>{NoticeCard(c)}</div>
          ))}
        </div>
      </div>
    </>
  );
};

export default function NoticesPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useUser();

  const keyword = (searchParams.get("keyword") ?? "").trim();
  const pageParam = parsePositiveInt(searchParams.get("page") ?? "1") ?? 1;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState<NoticeFilter>({
    locations: [],
    startDate: "",
    minPay: "",
  });

  const [sortValue, setSortValue] = useState<SortValue>("time");

  const [fitCards, setFitCards] = useState<CardData[]>([]);
  const [allCards, setAllCards] = useState<CardData[]>([]);
  const [totalPage, setTotalPage] = useState(1);

  const filterQueryString = useMemo(
    () => buildNoticesFilterQueryString(appliedFilter),
    [appliedFilter],
  );

  const listQueryString = useMemo(() => {
    const offset = (pageParam - 1) * LIST_LIMIT;
    const serverSort = getServerSort(sortValue);
    return buildListQuery({
      limit: LIST_LIMIT,
      offset,
      sort: serverSort,
      keyword,
      filterQueryString,
    });
  }, [filterQueryString, keyword, pageParam, sortValue]);

  const setUrlPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const resetToFirstPage = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchNotices(
      buildListQuery({
        limit: 3,
        offset: 0,
        sort: "time",
        keyword: "",
        filterQueryString: "",
      }),
    )
      .then((data) => setFitCards(mapToCards(data)))
      .catch(() => setFitCards([]));
  }, [isLoggedIn]);

  useEffect(() => {
    fetchNotices(listQueryString)
      .then((data) => {
        const mapped = mapToCards(data);
        const sorted = applyClientSort(mapped, sortValue);

        setAllCards(sorted);
        setTotalPage(getTotalPage(data));

        const nextTotalPage = getTotalPage(data);
        if (pageParam > nextTotalPage) setUrlPage(nextTotalPage);
      })
      .catch(() => {
        setAllCards([]);
        setTotalPage(1);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listQueryString, sortValue]);

  return (
    <>
      {isLoggedIn && (
        <section className="bg-[var(--color-red-10)]">
          <div className="mx-auto w-full max-w-87.5 py-6 md:max-w-169.5 lg:max-w-241 lg:py-10">
            <h3 className="text-[var(--color-black)]">맞춤 공고</h3>
            <FitCards cards={fitCards} />
          </div>
        </section>
      )}

      <main className="mx-auto w-full max-w-87.5 pb-10 md:max-w-169.5 lg:max-w-241">
        <section className={isLoggedIn ? "mt-10" : "mt-6"}>
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <TitleBlock keyword={keyword} />
            <NoticesToolbar
              sortValue={sortValue}
              onChangeSort={(v) => {
                setSortValue(v);
                resetToFirstPage();
              }}
              onOpenFilter={() => setIsFilterOpen(true)}
            />
          </div>

          <NoticeGrid cards={allCards} />

          <div className="mt-8 flex justify-center">
            <Pagination
              totalPage={totalPage}
              currentPage={pageParam}
              onPageChange={(p) => {
                if (p < 1 || p > totalPage) return;
                setUrlPage(p);
              }}
            />
          </div>
        </section>
      </main>

      {isFilterOpen && (
        <FilterModal
          onClose={() => setIsFilterOpen(false)}
          onApply={(filter: NoticeFilter) => {
            setAppliedFilter(filter);
            setIsFilterOpen(false);
            resetToFirstPage();
          }}
        />
      )}
    </>
  );
}
