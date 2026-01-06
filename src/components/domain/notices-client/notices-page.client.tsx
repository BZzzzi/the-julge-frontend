"use client";

import { useUser } from "@/store/user";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { Pagination } from "@/components/common/pagination";
import FilterModal, {
  toStartsAtGte,
  type NoticeFilter,
} from "@/components/domain/notices-client/notices-filter-modal";
import { ApiLink } from "@/types/common";

import NoticesToolbar, {
  type SortValue,
} from "@/components/domain/notices-client/notices-toolbar.client";

import Card, { type CardData } from "@/components/domain/card";
import { apiClient } from "@/lib/api";
import { NoticeReq, NoticesRes } from "@/types/notice";

// 하위 호환성을 위한 확장 타입
type NoticesResponse = NoticesRes & {
  // 하위 호환성을 위한 필드들
  totalPage?: number | string;
  totalPages?: number | string;
  totalCount?: number | string;
  total?: number | string;
};

type CardClickPayload = {
  noticeId: string;
  shopId: string;
  isPast: boolean;
  isClosed: boolean;
};

const LIST_LIMIT = 6;
const FIT_CARDS_LIMIT = 6;
const FIT_CARDS_DISPLAY_LIMIT = 3;

const parsePositiveInt = (v: unknown) => {
  if (typeof v === "number" && Number.isFinite(v) && v > 0) return Math.floor(v);
  if (typeof v === "string" && /^\d+$/.test(v.trim())) return Number(v.trim());
  return null;
};

const getTotalPage = (data: NoticesResponse) => {
  // 하위 호환성을 위한 totalPage 체크
  const totalPage =
    parsePositiveInt(data.totalPage) ??
    parsePositiveInt(data.totalPages) ??
    parsePositiveInt((data as { total_page?: unknown }).total_page);

  if (totalPage) return totalPage;

  // count를 기반으로 계산
  const totalCount =
    parsePositiveInt(data.totalCount) ??
    parsePositiveInt(data.count) ??
    parsePositiveInt(data.total) ??
    parsePositiveInt((data as { total_count?: unknown }).total_count);

  if (!totalCount) return 1;
  return Math.max(1, Math.ceil(totalCount / LIST_LIMIT));
};

const getServerSort = (sortValue: SortValue): "time" | "pay" | "hour" | "shop" => {
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

const buildListParams = ({
  limit,
  offset,
  sort,
  keyword,
  filter,
}: {
  limit: number;
  offset: number;
  sort: "time" | "pay" | "hour" | "shop";
  keyword: string;
  filter: NoticeFilter;
}): NoticeReq => {
  const params: NoticeReq = {
    limit,
    offset,
    sort,
  };

  if (keyword) {
    params.keyword = keyword;
  }

  // 필터 파라미터 추가
  if (filter.locations.length > 0) {
    params.address = filter.locations;
  }

  if (filter.startDate && filter.startDate.trim()) {
    params.startsAtGte = toStartsAtGte(filter.startDate);
  }

  if (filter.minPay && filter.minPay.trim()) {
    const minPayNum = Number(filter.minPay);
    if (!isNaN(minPayNum) && minPayNum > 0) {
      params.hourlyPayGte = minPayNum;
    }
  }

  return params;
};

const fetchNotices = async (params: NoticeReq): Promise<NoticesResponse> => {
  return await apiClient.notices.getNotices(params);
};

const mapToCardData = (data: NoticesResponse): CardData[] => {
  const now = Date.now();

  return data.items
    .filter((n) => n.item.shop) // shop이 없는 항목은 필터링
    .map((n) => {
      const startsAt = n.item.startsAt;
      const isPast = new Date(startsAt).getTime() < now;
      const shop = n.item.shop!; // 위에서 필터링했으므로 non-null assertion 가능

      return {
        noticeId: n.item.id,
        shopId: shop.item.id ?? "",
        name: shop.item.name,
        startsAt,
        workhour: n.item.workhour,
        address1: shop.item.address1,
        hourlyPay: n.item.hourlyPay,
        imageUrl: shop.item.imageUrl,
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
            {cards.slice(0, FIT_CARDS_LIMIT).map((c) => (
              <SwiperSlide
                key={c.noticeId}
                className="h-auto!"
              >
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
          cards={cards.slice(0, FIT_CARDS_DISPLAY_LIMIT)}
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
  const [paginationData, setPaginationData] = useState<{
    links: ApiLink[];
    offset: number;
    limit: number;
    count: number;
  }>({
    links: [],
    offset: 0,
    limit: LIST_LIMIT,
    count: 0,
  });

  const listParams = useMemo(() => {
    const offset = (pageParam - 1) * LIST_LIMIT;
    const serverSort = getServerSort(sortValue);

    return buildListParams({
      limit: LIST_LIMIT,
      offset,
      sort: serverSort,
      keyword,
      filter: appliedFilter,
    });
  }, [appliedFilter, keyword, pageParam, sortValue]);

  // URL 파라미터 업데이트 헬퍼 함수
  const updateUrlParams = (updater: (params: URLSearchParams) => void, replace = false) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    if (replace) {
      router.replace(url);
    } else {
      router.push(url);
    }
  };

  const setUrlPage = (nextPage: number) => {
    updateUrlParams((params) => {
      if (nextPage <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(nextPage));
      }
    });
  };

  const resetToFirstPage = () => {
    updateUrlParams((params) => params.delete("page"), true);
  };

  // href에서 offset을 파싱해서 페이지 번호로 변환하고 URL 업데이트
  const handlePageChange = (href: string) => {
    try {
      const url = new URL(href, window.location.origin);
      const offsetParam = url.searchParams.get("offset");
      if (offsetParam) {
        const offset = parseInt(offsetParam, 10);
        const page = Math.floor(offset / LIST_LIMIT) + 1;
        setUrlPage(page);
      }
    } catch {
      // href 파싱 실패 시 무시
    }
  };

  const handleSelect = () => {
    // 현재 사용하지 않음
  };

  const handleCardClick = (payload: CardClickPayload) => {
    const qs = new URLSearchParams({ noticeId: payload.noticeId });
    router.push(`/notice/notices-detail?${qs.toString()}`);
  };

  // ✅ 맞춤공고
  useEffect(() => {
    if (!isLoggedIn) return;

    fetchNotices(
      buildListParams({
        limit: FIT_CARDS_LIMIT,
        offset: 0,
        sort: "time",
        keyword: "",
        filter: { locations: [], startDate: "", minPay: "" },
      }),
    )
      .then((data) => setFitCards(mapToCardData(data)))
      .catch(() => setFitCards([]));
  }, [isLoggedIn]);

  useEffect(() => {
    fetchNotices(listParams)
      .then((data) => {
        const mapped = mapToCardData(data);
        const sorted = applyClientSort(mapped, sortValue);
        setCards(sorted);

        const offset = data.offset ?? (pageParam - 1) * LIST_LIMIT;
        const limit = data.limit ?? LIST_LIMIT;
        const count =
          data.count ?? parsePositiveInt(data.totalCount) ?? parsePositiveInt(data.total) ?? 0;
        const links = data.links ?? [];

        setPaginationData({
          links,
          offset,
          limit,
          count,
        });

        const nextTotalPage = getTotalPage(data);
        if (pageParam > nextTotalPage && nextTotalPage > 0) {
          setUrlPage(nextTotalPage);
        }
      })
      .catch(() => {
        setCards([]);
        setPaginationData({
          links: [],
          offset: 0,
          limit: LIST_LIMIT,
          count: 0,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listParams, sortValue]);

  return (
    <>
      {isLoggedIn && (
        <section className="bg-red-10">
          <div className="mx-auto w-full max-w-87.5 py-12 md:max-w-169.5 lg:max-w-241 lg:py-10">
            <h3 className="text-black">맞춤 공고</h3>
            <FitCards
              cards={fitCards}
              onSelect={handleSelect}
              onCardClick={handleCardClick}
            />
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
              links={paginationData.links}
              offset={paginationData.offset}
              limit={paginationData.limit}
              count={paginationData.count}
              onPageChange={handlePageChange}
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
