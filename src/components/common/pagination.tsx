import { cn } from "@/utils/cn";

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ totalPage, currentPage, onPageChange }: PaginationProps) => {
  const PAGE_COUNT = 7; // 한 그룹당 보여줄 페이지 개수

  const startPage = Math.floor((currentPage - 1) / PAGE_COUNT) * PAGE_COUNT + 1;

  const endPage = Math.min(totalPage, startPage + PAGE_COUNT - 1);

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="flex items-center justify-center gap-0.5">
      {/* 이전 그룹 버튼 (<) */}
      <button
        type="button"
        onClick={() => onPageChange(startPage - PAGE_COUNT)}
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
          onClick={() => onPageChange(page)}
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
        onClick={() => onPageChange(startPage + PAGE_COUNT)}
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
