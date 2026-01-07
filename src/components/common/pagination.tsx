import { ApiLink } from "@/types/common";
import { cn } from "@/utils/cn";

interface PaginationProps {
  links: ApiLink[];
  offset: number;
  limit: number;
  count: number;
  onPageChange: (href: string) => void;
}

export const Pagination = ({ links, offset, limit, count, onPageChange }: PaginationProps) => {
  const PAGE_COUNT = 7; // 한 그룹당 보여줄 페이지 개수

  // links에서 self 찾기
  const selfLink = links.find((link) => link.rel === "self");

  // 현재 페이지 계산
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPage = Math.ceil(count / limit);

  const startPage = Math.floor((currentPage - 1) / PAGE_COUNT) * PAGE_COUNT + 1;
  const endPage = Math.min(totalPage, startPage + PAGE_COUNT - 1);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  // 페이지 번호로 href 생성 (self 링크의 href를 기반으로 offset만 변경)
  const getPageHref = (page: number) => {
    if (!selfLink) return "";
    const pageOffset = (page - 1) * limit;
    return selfLink.href.replace(/offset=\d+/, `offset=${pageOffset}`);
  };

  // 이전 그룹의 마지막 페이지 href 계산
  const getPrevGroupHref = () => {
    if (startPage === 1) return "";
    const prevGroupLastPage = startPage - 1;
    return getPageHref(prevGroupLastPage);
  };

  // 다음 그룹의 첫 페이지 href 계산
  const getNextGroupHref = () => {
    if (endPage === totalPage) return "";
    const nextGroupFirstPage = endPage + 1;
    return getPageHref(nextGroupFirstPage);
  };

  return (
    <div className="flex items-center justify-center gap-0.5">
      {/* 이전 그룹 버튼 (<) */}
      <button
        type="button"
        onClick={() => {
          const href = getPrevGroupHref();
          if (href) onPageChange(href);
        }}
        disabled={startPage === 1}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-[4px] bg-white transition-colors",
          "hover:bg-gray-10 disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="#111322"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 페이지 번호 버튼들 */}
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => {
            const href = getPageHref(page);
            if (href) onPageChange(href);
          }}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-[4px] text-sm font-medium transition-colors",
            page === currentPage
              ? "bg-red-30 hover:bg-red-30 text-white" // Active
              : "hover:bg-gray-10 bg-white text-black", // Inactive
          )}
        >
          {page}
        </button>
      ))}

      {/* 다음 그룹 버튼 (>) */}
      <button
        type="button"
        onClick={() => {
          const href = getNextGroupHref();
          if (href) onPageChange(href);
        }}
        disabled={endPage === totalPage}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-[4px] bg-white transition-colors",
          "hover:bg-gray-10 disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="#111322"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
