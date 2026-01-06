"use client";

import { useUser } from "@/store/user";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { Swiper as SwiperType } from "swiper";
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

import Card, { type CardData } from "@/components/domain/card";

type NoticesResponse = {
  items: Array<{
    item: {
      id: string;
      hourlyPay: number;
      startsAt: string;
      workhour: number;
      closed?: boolean;
      shop: {
        item: {
          id?: string;
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

type CardClickPayload = {
  noticeId: string;
  shopId: string;
  isPast: boolean;
  isClosed: boolean;
};

const LIST_LIMIT = 6;

const parsePositiveInt = (v: unknown) => {
  if (typeof v === "number" && Number.isFinite(v) && v > 0) return Math.floor(v);
  if (typeof v === "string" && /^\d+$/.test(v.trim())) return Number(v.trim());
  return null;
};

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

  if (sortValue === "workhour") {
    next.sort((a, b) => (a.workhour ?? 0) - (b.workhour ?? 0));
  } else if (sortValue === "name") {
    next.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "ko"));
  }

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

const mapToCardData = (data: NoticesResponse): CardData[] => {
  const now = Date.now();

  return data.items.map((n) => {
    const startsAt = n.item.startsAt;
    const isPast = new Date(startsAt).getTime() < now;

    return {
      noticeId: n.item.id,
      shopId: n.item.shop.item.id ?? "",
      name: n.item.shop.item.name,
      startsAt,
      workhour: n.item.workhour,
      address1: n.item.shop.item.address1,
      hourlyPay: n.item.hourlyPay,
      imageUrl: n.item.shop.item.imageUrl,
      isPast,
      isClosed: Boolean(n.item.closed),
    };
  });
};

const TitleBlock = ({ keyword }: { keyword: string }) => {
  if (!keyword) return <h3 className="mb-0 text-black">전체 공고</h3>;
  return (
    <h3 className="text-black] mb-0">
      <span className="text-red-40">{keyword}</span>에 대한 공고 목록
    </h3>
  );
};

const FitCards = ({
  cards,
  onSelect,
  onCardClick,
}: {
  cards: CardData[];
  onSelect: (payload: CardClickPayload) => void;
  onCardClick: (payload: CardClickPayload) => void;
}) => {
  if (!cards.length) return null;

  const handleSwiperReady = (swiper: SwiperType) => {
    requestAnimationFrame(() => swiper.update());
  };

  const handleAfterSlideChange = (swiper: SwiperType) => {
    requestAnimationFrame(() => swiper.update());
  };

  return (
    <>
      <div className="lg:hidden">
        <div className="-mr-3 w-full min-w-0 overflow-hidden md:-mr-8">
          <Swiper
            slidesPerView={2.1}
            slidesPerGroup={1}
            spaceBetween={8}
            style={{ paddingBottom: 4 }}
            autoHeight
            nested
            simulateTouch
            touchStartPreventDefault={false}
            resistanceRatio={0.6}
            threshold={5}
            observer
            observeParents
            resizeObserver
            updateOnWindowResize
            onSwiper={handleSwiperReady}
            onSlideChangeTransitionEnd={handleAfterSlideChange}
            className="[&_.swiper-slide]:h-auto [&_.swiper-wrapper]:items-stretch"
            breakpoints={{
              768: {
                slidesPerView: 2.15,
                spaceBetween: 12,
              },
            }}
          >
            {cards.slice(0, 6).map((c) => (
              <SwiperSlide key={c.noticeId} className="h-auto!">
                <div className="[&_.grid]:grid-cols-1!">
                  <Card
                    title=""
                    cards={[c]}
                    selectedNoticeId={null}
                    onSelect={onSelect}
                    onCardClick={onCardClick}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ✅ PC */}
      <div className="hidden lg:block">
        <Card
          title=""
          cards={cards.slice(0, 3)}
          selectedNoticeId={null}
          onSelect={onSelect}
          onCardClick={onCardClick}
        />
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
  const [cards, setCards] = useState<CardData[]>([]);
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

  const handleSelect = (_payload: CardClickPayload) => {};

  const handleCardClick = (payload: CardClickPayload) => {
    const qs = new URLSearchParams({ noticeId: payload.noticeId });
    router.push(`/notice/notices-detail?${qs.toString()}`);
  };

  // ✅ 맞춤공고
  useEffect(() => {
    if (!isLoggedIn) return;

    fetchNotices(
      buildListQuery({
        limit: 6,
        offset: 0,
        sort: "time",
        keyword: "",
        filterQueryString: "",
      }),
    )
      .then((data) => setFitCards(mapToCardData(data)))
      .catch(() => setFitCards([]));
  }, [isLoggedIn]);

  useEffect(() => {
    fetchNotices(listQueryString)
      .then((data) => {
        const mapped = mapToCardData(data);
        const sorted = applyClientSort(mapped, sortValue);
        setCards(sorted);

        const nextTotalPage = getTotalPage(data);
        setTotalPage(nextTotalPage);

        if (pageParam > nextTotalPage) setUrlPage(nextTotalPage);
      })
      .catch(() => {
        setCards([]);
        setTotalPage(1);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listQueryString, sortValue]);

  return (
    <>
      {isLoggedIn && (
        <section className="bg-red-10">
          <div className="mx-auto w-full max-w-87.5 py-12 md:max-w-169.5 lg:max-w-241 lg:py-10">
            <h3 className="text-black">맞춤 공고</h3>
            <FitCards cards={fitCards} onSelect={handleSelect} onCardClick={handleCardClick} />
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

          <Card
            title=""
            cards={cards}
            selectedNoticeId={null}
            onSelect={handleSelect}
            onCardClick={handleCardClick}
          />

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
