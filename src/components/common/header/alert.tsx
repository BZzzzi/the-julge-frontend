"use client";

import { useUserAlerts } from "@/hooks/use-user-alerts";
import type { UserAlertItem } from "@/types/alert";
import { formatNoticeTimeRange, formatRelativeTime } from "@/utils/date";
import Image from "next/image";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

type AlertProps = {
  isOpen: boolean;
  onClose: () => void;
};

// 알림 메시지 포맷팅 컴포넌트
function formatAlertMessage(alert: UserAlertItem) {
  const shopName = alert.item.shop?.item.name || "알 수 없는 가게";
  const notice = alert.item.notice?.item;
  const timeRange =
    notice?.startsAt && notice?.workhour
      ? `(${formatNoticeTimeRange(notice.startsAt, notice.workhour)})`
      : "";

  return (
    <>
      {shopName}
      {timeRange} 공고 지원이{" "}
      {alert.item.result === "accepted" ? (
        <span className="text-blue-500">승인</span>
      ) : (
        <span className="text-red-500">거절</span>
      )}
      되었어요.
    </>
  );
}

// 알림 아이템 컴포넌트
function AlertItem({
  alert,
  onMarkAsRead,
}: {
  alert: UserAlertItem;
  onMarkAsRead: (alertId: string) => void;
}) {
  const handleClick = () => {
    if (!alert.item.read) {
      onMarkAsRead(alert.item.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`border-gray-20 flex flex-col gap-1 rounded-lg border bg-white p-4 transition-opacity ${
        alert.item.read ? "cursor-not-allowed opacity-50" : "cursor-pointer opacity-100"
      }`}
    >
      <div
        className={`h-1.5 w-1.5 rounded-full ${
          alert.item.result === "accepted" ? "bg-blue-500" : "bg-red-500"
        }`}
      />
      <p className="line-clamp-2 text-sm">{formatAlertMessage(alert)}</p>
      <p className="text-gray-40 text-xs">{formatRelativeTime(alert.item.createdAt)}</p>
    </div>
  );
}

// 알림 헤더 컴포넌트
function AlertHeader({
  isLoading,
  count,
  onClose,
}: {
  isLoading: boolean;
  count?: number;
  onClose: () => void;
}) {
  return (
    <div className="flex shrink-0 justify-between">
      {isLoading ? (
        <p className="text-center text-gray-500">로딩 중...</p>
      ) : (
        <>
          <h3 className="text-xl">알림 {count}개</h3>
          <button
            onClick={onClose}
            className="cursor-pointer"
            aria-label="알림 닫기"
          >
            <Image
              src="/icon/close.svg"
              alt="닫기"
              width={24}
              height={24}
            />
          </button>
        </>
      )}
    </div>
  );
}

// 알림 리스트 컴포넌트
function AlertList({
  alertsData,
  error,
  isLoadingMore,
  loadMore,
  onMarkAsRead,
}: {
  alertsData: { items: UserAlertItem[]; hasNext: boolean } | null;
  error: Error | null;
  isLoadingMore: boolean;
  loadMore: () => void;
  onMarkAsRead: (alertId: string) => void;
}) {
  const { ref, inView } = useInView({
    rootMargin: "50px",
  });

  // 하단에 도달하면 추가 데이터 로드
  useEffect(() => {
    if (inView && alertsData?.hasNext && !isLoadingMore) {
      loadMore();
    }
  }, [inView, alertsData?.hasNext, isLoadingMore, loadMore]);

  return (
    <div className="mt-4 flex flex-1 flex-col gap-2 overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="text-red-600">에러: {error.message}</p>
        </div>
      )}
      {!error && alertsData?.items.length === 0 && (
        <p className="text-center text-gray-500">알림이 없습니다.</p>
      )}
      {!error &&
        alertsData?.items.map((alert) => (
          <AlertItem
            key={alert.item.id}
            alert={alert}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      {!error && alertsData && alertsData.items.length > 0 && (
        <div ref={ref}>
          {isLoadingMore && <p className="text-center text-gray-500">로딩 중...</p>}
        </div>
      )}
    </div>
  );
}

export default function Alert({ isOpen, onClose }: AlertProps) {
  const { alertsData, isLoading, isLoadingMore, error, loadMore, markAsRead } =
    useUserAlerts(isOpen);

  // 알림창이 열려있을 때 body 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const containerBaseClasses =
    "bg-red-10 z-50 flex flex-col px-5 rounded-lg border border-gray-30 shadow-inner";
  const pcClasses = `${containerBaseClasses} absolute top-full right-0 mt-2 hidden h-[420px] w-[370px] py-6 md:flex`;
  const mobileClasses = `${containerBaseClasses} fixed inset-0 h-full w-full py-10 md:hidden`;

  return (
    <>
      {/* PC, Tablet */}
      <div className="hidden md:block">
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className={pcClasses}
          onClick={(e) => e.stopPropagation()}
        >
          <AlertHeader
            isLoading={isLoading}
            count={alertsData?.count}
            onClose={onClose}
          />
          {!isLoading && (
            <AlertList
              alertsData={alertsData}
              error={error}
              isLoadingMore={isLoadingMore}
              loadMore={loadMore}
              onMarkAsRead={markAsRead}
            />
          )}
        </div>
      </div>
      {/* Mobile */}
      <div className={mobileClasses}>
        <AlertHeader
          isLoading={isLoading}
          count={alertsData?.count}
          onClose={onClose}
        />
        {!isLoading && (
          <AlertList
            alertsData={alertsData}
            error={error}
            isLoadingMore={isLoadingMore}
            loadMore={loadMore}
            onMarkAsRead={markAsRead}
          />
        )}
      </div>
    </>
  );
}
