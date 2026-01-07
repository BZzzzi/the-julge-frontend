"use client";

import { apiClient } from "@/lib/api";
import { useNoticeSelection, useUser } from "@/store/user";
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
import NoticesToolbar, { type SortValue } from "@/components/domain/notices-client/notices-toolbar.client";

import Card, { type CardData } from "@/components/domain/card";

/** =========================
 *  최근 클릭 기록(로그인/비로그인 분리)
========================= */
type RecentKey = string;

function makeKey(shopId: string, noticeId: string) {
  return `${shopId}:${noticeId}`;
}

function getRecentStorageKey(userId: string | null) {
  return userId ? `recentNotices:${userId}` : "recentNotices:guest";
}

function loadRecent(key: string): RecentKey[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as RecentKey[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(key: string, list: RecentKey[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

function pushToFrontRecent(list: RecentKey[], key: RecentKey, limit = 6) {
  return [key, ...list.filter((k) => k !== key)].slice(0, limit);
}

/** =========================
 *  API
========================= */
type NoticesResponse = {
  items: Array<{
    item: {
      id: string;
      hourlyPay: number;
      startsAt: string;
      workhour: number;
      closed?: boolean;
      shop: { item: { id?: string; name: string; address1: string; imageUrl: string } };
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
  if (sortValue === "workhour") next.sort((a, b) => (a.workhour ?? 0) - (b.workhour ?? 0));
  else if (sortValue === "name") next.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "ko"));
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
    <h3 className="mb-0 text-black">
      <span className="text-red-40">{keyword}</span>에 대한 공고 목록
    </h3>
  );
};

/** =========================
 *  맞춤공고 Swiper 컴포넌트(원래 있던 것 복구)
========================= */
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

  const { user, isLoggedIn } = useUser();
  const userId = (user as unknown as { id?: string } | null)?.id ?? null;

  const setSelected = useNoticeSelection((s) => s.setSelected);

  const keyword = (searchParams.get("keyword") ?? "").trim();
  const pageParam = parsePositiveInt(searchParams.get("page") ?? "1") ?? 1;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState<NoticeFilter>({
    locations: [],
    startDate: "",
    minPay: "",
  });

  const [sortValue, setSortValue] = useState<SortValue>("time");
  const [cards, setCards] = useState<CardData[]>([]);
  const [totalPage, setTotalPage] = useState(1);

  /** 맞춤공고 state 복구 */
  const [fitCards, setFitCards] = useState<CardData[]>([]);

  const filterQueryString = useMemo(() => buildNoticesFilterQueryString(appliedFilter), [appliedFilter]);

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

  // 로그인/비로그인 상관없이 동일하게 detail로 이동(기존 로직 유지)
  const handleCardClick = ({ shopId, noticeId }: CardClickPayload) => {
    // 1) 선택값 저장 (detail에서 읽음)
    setSelected({ shopId, noticeId });

    // 2) 최근본 저장
    const storageKey = getRecentStorageKey(userId);
    const key = makeKey(shopId, noticeId);
    const prev = loadRecent(storageKey);
    const next = pushToFrontRecent(prev, key, 6);
    saveRecent(storageKey, next);

    // 3) 이동
    router.push("/notice/notices-detail");
  };


useEffect(() => {
  if (!isLoggedIn) {
    setFitCards([]);
    return;
  }

  let alive = true;

  const getUserIdSafe = (u: unknown): string | null => {
    if (!u || typeof u !== "object") return null;
    const obj = u as Record<string, unknown>;
    const id = obj.id;
    const userId = obj.userId;
    if (typeof id === "string" && id.trim()) return id.trim();
    if (typeof userId === "string" && userId.trim()) return userId.trim();
    return null;
  };

  (async () => {
    try {
      const uid = getUserIdSafe(user);
      if (!uid) {
        if (alive) setFitCards([]);
        return;
      }

      // 1) 내 프로필(주소) 가져오기
      const meRes = await apiClient.user.getUser(uid);
      const me =
        (meRes as unknown as { item?: { address?: string } }).item ??
        (meRes as unknown as { address?: string });

      const address = (me?.address ?? "").trim();
      if (!address) {
        if (alive) setFitCards([]);
        return;
      }

      const tokens = address.split(" ").map((t) => t.trim()).filter(Boolean);
      const lastToken = tokens.length ? tokens[Math.min(1, tokens.length - 1)] : ""; 
      const cityGu = tokens.slice(0, 2).join(" "); 
      const raw = await fetchNotices(
        buildListQuery({
          limit: 60,
          offset: 0,
          sort: "time",
          keyword: "",
          filterQueryString: "",
        }),
      );

      const mapped = mapToCardData(raw);

      const filtered = mapped.filter((c) => {
        const a = (c.address1 ?? "").trim();
        return (cityGu && a.includes(cityGu)) || (lastToken && a.includes(lastToken));
      });

      const finalCards = (filtered.length ? filtered : mapped).slice(0, 6);

      if (!alive) return;
      setFitCards(finalCards);
    } catch {
      if (!alive) return;
      setFitCards([]);
    }
  })();

  return () => {
    alive = false;
  };
}, [isLoggedIn, user]); // apiClient는 보통 안정적이지만 린트가 뭐라하면 넣어도 됨



  // 공고 리스트 fetch (기존 로직 유지)
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
              links={[
                {
                  rel: "self",
                  href: `?offset=${(pageParam - 1) * 10}&limit=10`,
                  method: "GET",
                  description: "self link",
                },
              ]}
              offset={(pageParam - 1) * 10}
              limit={10}
              count={totalPage * 10}
              onPageChange={(href) => {
                const match = href.match(/offset=(\d+)/);
                if (match) {
                  const nextOffset = parseInt(match[1], 10);
                  const nextPage = Math.floor(nextOffset / 10) + 1;
                  setUrlPage(nextPage);
                }
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
