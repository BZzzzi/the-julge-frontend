"use client";

import { Button } from "@/components/common/button";
import Modal from "@/components/common/modal/Modal";
import { Pagination } from "@/components/common/pagination";
import { apiClient } from "@/lib/api";
import {
  ApplicationStatus,
  NoticeApplicationItem,
  NoticeApplicationsRes,
} from "@/types/application";
import Image from "next/image";
import { useEffect, useState } from "react";

interface OwnerTableProps {
  shopId: string;
  noticeId: string;
  initialApplications: NoticeApplicationsRes | null;
  title?: string;
  emptyMessage?: string;
  itemsPerPage?: number;
}

const DEFAULT_ITEMS_PER_PAGE = 5;

export default function OwnerTable({
  shopId,
  noticeId,
  initialApplications,
  title = "신청자 목록",
  emptyMessage = "신청한 사람이 없습니다.",
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}: OwnerTableProps) {
  const [applications, setApplications] = useState<NoticeApplicationItem[]>(
    initialApplications?.items || [],
  );
  const [totalCount, setTotalCount] = useState(initialApplications?.count || 0);
  const [offset, setOffset] = useState(initialApplications?.offset || 0);
  const [limit, setLimit] = useState(initialApplications?.limit || itemsPerPage);
  const [links, setLinks] = useState(initialApplications?.links || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    applicationId: string;
    status: ApplicationStatus;
    userName: string;
  } | null>(null);

  // href에서 offset 파싱
  const parseOffsetFromHref = (href: string): number => {
    const url = new URL(href, window.location.origin);
    const offsetParam = url.searchParams.get("offset");
    return offsetParam ? parseInt(offsetParam, 10) : 0;
  };

  // 신청자 목록 가져오기 (페이지네이션 포함)
  useEffect(() => {
    if (!shopId || !noticeId) return;

    // 첫 페이지이고 이미 데이터가 있으면 스킵
    if (isInitialLoad && initialApplications) {
      setIsInitialLoad(false);
      return;
    }

    async function fetchApplications() {
      try {
        setLoading(true);
        const applicationsRes: NoticeApplicationsRes =
          await apiClient.applications.getShopNoticeApplications(shopId, noticeId, {
            offset,
            limit,
          });

        setApplications(applicationsRes.items);
        setTotalCount(applicationsRes.count);
        setOffset(applicationsRes.offset);
        setLimit(applicationsRes.limit);
        setLinks(applicationsRes.links);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "신청자 목록을 불러오는데 실패했습니다.");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [shopId, noticeId, offset, limit, initialApplications, isInitialLoad]);

  // 페이지 변경 핸들러 (href 사용)
  const handlePageChange = (href: string) => {
    const newOffset = parseOffsetFromHref(href);
    setOffset(newOffset);
    setIsInitialLoad(false);
  };

  const handleStatusChange = async (applicationId: string, status: ApplicationStatus) => {
    if (status === "pending" || status === "canceled") {
      return;
    }

    try {
      await apiClient.applications.updateShopNoticeApplicationStatus(
        shopId,
        noticeId,
        applicationId,
        {
          status: status as "accepted" | "rejected" | "canceled",
        },
      );
      // 상태 변경 후 페이지 새로고침 (또는 목록 다시 불러오기)
      window.location.reload();
    } catch (err) {
      console.error("상태 변경 실패:", err);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const handleStatusButtonClick = (
    applicationId: string,
    status: ApplicationStatus,
    userName: string,
  ) => {
    setPendingAction({ applicationId, status, userName });
    setModalOpen(true);
  };

  const handleModalConfirm = async () => {
    if (!pendingAction) return;

    setModalOpen(false);
    await handleStatusChange(pendingAction.applicationId, pendingAction.status);
    setPendingAction(null);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setPendingAction(null);
  };

  if (loading) {
    return <p className="text-gray-500">신청자 목록을 불러오는 중...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }
  if (!applications || applications.length === 0 || totalCount === 0) {
    return (
      <div className="mx-auto flex w-87.75 flex-col gap-6 md:w-170 lg:w-241">
        <h2 className="text-2xl font-bold text-black">{title}</h2>
        <div className="flex h-[200px] items-center justify-center rounded-[10px] border border-gray-200 bg-white">
          <p className="text-base text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // 공통 스타일
  const thBase = "p-3 text-left text-xs font-normal md:h-[50px] md:text-sm";
  const tdBase = "p-3 text-sm md:h-[90px] md:text-base";

  // 상태 컬럼 고정 스타일
  const stickyColumnBase = "sticky right-0 z-10 w-[150px] lg:w-[236px]";
  const stickyAfter =
    "after:absolute after:top-0 after:left-0 after:h-full after:w-px after:content-[''] after:bg-gray-200 lg:after:hidden";

  return (
    <div className="mx-auto flex w-87.75 flex-col gap-6 md:w-170 lg:w-241">
      <h2 className="text-2xl font-bold text-black">{title}</h2>

      <div className="border-gray-20 w-full overflow-hidden rounded-[10px] border bg-white">
        <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[185px] md:w-[228px]" />
              <col className="w-[200px] md:w-[300px]" />
              <col className="w-[200px] md:w-[200px]" />
              <col className="w-[165px] md:w-[236px]" />
            </colgroup>

            <thead className="bg-red-10">
              <tr className="border-b border-[#FEF7F6]">
                <th className={`h-[40px] ${thBase}`}>신청자</th>
                <th className={`h-[40px] ${thBase}`}>소개</th>
                <th className={`h-[40px] ${thBase}`}>전화번호</th>
                <th className={`bg-red-10 h-[44px] ${thBase} ${stickyColumnBase} ${stickyAfter}`}>
                  상태
                </th>
              </tr>
            </thead>

            <tbody className="divide-gray-20 divide-y">
              {applications.map((app) => {
                const item = app.item;
                const userItem = item.user?.item;
                const noticeItem = item.notice?.item;
                const status = item.status;

                const renderStatusCell = () => {
                  if (status === "pending") {
                    if (noticeItem?.closed) {
                      return (
                        <div className="bg-gray-20 flex h-8 w-30 items-center justify-center rounded-2xl text-xs font-medium text-gray-500 md:text-sm md:font-semibold">
                          마감 되었습니다.
                        </div>
                      );
                    }
                    return (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() =>
                            handleStatusButtonClick(item.id, "rejected", userItem?.name || "신청자")
                          }
                          className="h-8 w-17 border px-1 text-xs font-medium md:h-10 md:w-24 md:px-5 md:text-sm md:font-semibold"
                        >
                          거절하기
                        </Button>
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() =>
                            handleStatusButtonClick(item.id, "accepted", userItem?.name || "신청자")
                          }
                          className="border-blue-20 text-blue-20 h-8 w-17 border px-1 text-xs font-medium md:h-10 md:w-24 md:px-5 md:text-sm md:font-semibold"
                        >
                          승인하기
                        </Button>
                      </div>
                    );
                  }

                  if (status === "accepted") {
                    return (
                      <div className="bg-blue-10 text-blue-20 flex h-8 w-19 items-center justify-center rounded-2xl text-xs font-medium md:text-sm md:font-semibold">
                        승인 완료
                      </div>
                    );
                  }

                  if (status === "rejected") {
                    return (
                      <div className="bg-red-10 text-red-40 flex h-8 w-19 items-center justify-center rounded-2xl text-xs font-medium md:text-sm md:font-semibold">
                        거절
                      </div>
                    );
                  }

                  if (status === "canceled") {
                    return (
                      <div className="flex h-8 w-19 items-center justify-center rounded-2xl bg-yellow-100 text-xs font-medium text-yellow-600 md:text-sm md:font-semibold">
                        취소됨
                      </div>
                    );
                  }

                  return null;
                };

                return (
                  <tr
                    key={item.id}
                    className="group hover:bg-gray-5 transition-colors"
                  >
                    <td className={`h-[45px] ${tdBase}`}>
                      <div className="truncate">{userItem?.name || "이름 없음"}</div>
                    </td>

                    <td className={`h-[45px] ${tdBase}`}>
                      <div className="line-clamp-2">{userItem?.bio || "소개가 없습니다."}</div>
                    </td>

                    <td className={`h-[45px] ${tdBase}`}>{userItem?.phone || "010-0000-0000"}</td>

                    <td
                      className={`group-hover:bg-gray-5 h-[45px] w-[150px] ${tdBase} ${stickyColumnBase} bg-white text-left ${stickyAfter}`}
                    >
                      {renderStatusCell()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalCount > 0 && (
          <div className="border-gray-20 flex h-[56px] items-center justify-center border-t md:h-[64px]">
            <Pagination
              links={links}
              offset={offset}
              limit={limit}
              count={totalCount}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* 상태 변경 확인 모달 */}
      <Modal
        open={modalOpen}
        onClose={handleModalCancel}
        variant="icon"
        icon={
          <Image
            src="/icon/checked.svg"
            alt="확인 아이콘"
            width={25}
            height={25}
          />
        }
        description={
          pendingAction
            ? `신청을 ${pendingAction.status === "accepted" ? "승인" : "거절"}하시겠습니까?`
            : ""
        }
        actions={[
          {
            label: "아니오",
            onClick: handleModalCancel,
            variant: "outline",
          },
          {
            label: `${pendingAction?.status === "accepted" ? "승인하기" : "거절하기"}`,
            onClick: handleModalConfirm,
            variant: "primary",
          },
        ]}
      />
    </div>
  );
}
