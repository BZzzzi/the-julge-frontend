"use client";

import { Button } from "@/components/common/button";
import Modal from "@/components/common/modal/Modal";
import { Pagination } from "@/components/common/pagination";
import { apiClient } from "@/lib/api";
import { NoticeApplicationItem, NoticeApplicationsRes } from "@/types/application";
import { UserInfoRes } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const DEFAULT_ITEMS_PER_PAGE = 5;

interface UserTableProps {
  userInfo: UserInfoRes;
  title?: string;
  emptyMessage?: string;
  itemsPerPage?: number;
}

export default function UserTable({
  userInfo,
  title = "신청 내역",
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}: UserTableProps) {
  const userId = userInfo.item.id ?? null;
  const [applications, setApplications] = useState<NoticeApplicationItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(itemsPerPage);
  const [links, setLinks] = useState<NoticeApplicationsRes["links"]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

  // href에서 offset 파싱
  const parseOffsetFromHref = (href: string): number => {
    const url = new URL(href, window.location.origin);
    const offsetParam = url.searchParams.get("offset");
    return offsetParam ? parseInt(offsetParam, 10) : 0;
  };

  // 지원한 공고 목록 가져오기 (페이지네이션 포함)
  useEffect(() => {
    if (!userId) return;

    async function fetchApplications() {
      try {
        setLoading(true);
        const applicationsRes: NoticeApplicationsRes =
          await apiClient.applications.getShopNoticeUserApplications(userId, {
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
        setError(
          err instanceof Error ? err.message : "지원한 공고 목록을 불러오는데 실패했습니다.",
        );
        setApplications([]);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, [userId, offset, limit]);

  // 페이지 변경 핸들러 (href 사용)
  const handlePageChange = (href: string) => {
    const newOffset = parseOffsetFromHref(href);
    setOffset(newOffset);
  };

  // 지원 취소 핸들러
  const handleCancelApplication = async (applicationId: string) => {
    if (!userId) return;

    try {
      // 지원 취소 API 호출 (shopId와 noticeId는 application에서 가져와야 함)
      const application = applications.find((app) => app.item.id === applicationId);
      if (!application?.item.notice?.item) {
        alert("공고 정보를 찾을 수 없습니다.");
        return;
      }

      const noticeId = application.item.notice.item.id;
      const shopId = application.item.shop?.item?.id;
      if (!shopId) {
        alert("가게 정보를 찾을 수 없습니다.");
        return;
      }

      await apiClient.applications.updateShopNoticeApplicationStatus(
        shopId,
        noticeId,
        applicationId,
        {
          status: "canceled",
        },
      );

      // 목록 새로고침
      window.location.reload();
    } catch (err) {
      console.error("지원 취소 실패:", err);
      alert("지원 취소에 실패했습니다.");
    }
  };

  const handleModalConfirm = async () => {
    if (!pendingCancelId) return;

    setModalOpen(false);
    await handleCancelApplication(pendingCancelId);
    setPendingCancelId(null);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setPendingCancelId(null);
  };

  if (loading) {
    return <p className="text-gray-500">지원한 공고 목록을 불러오는 중...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!applications || applications.length === 0 || totalCount === 0) {
    return (
      <div>
        <section className="mx-auto w-full px-2 py-10 md:w-170 lg:w-241">
          <h1 className="mb-6 text-2xl font-bold">{title}</h1>
          <div className="border-gray-20 rounded-xl border px-5 py-15 text-center md:p-15">
            <p className="mb-6 text-sm text-black md:text-lg">아직 신청 내역이 없어요.</p>
            <Link href={`/notice/notices-list`}>
              <Button
                variant="primary"
                size="lg"
                className="w-50 text-sm md:w-86.5 md:text-[16px]"
              >
                공고 보러가기
              </Button>
            </Link>
          </div>
        </section>
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
    <div className="mx-auto flex w-full flex-col gap-6 md:w-170 lg:w-241">
      <h1 className="text-2xl font-bold text-black">{title}</h1>

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
                <th className={`h-[40px] ${thBase}`}>가게</th>
                <th className={`h-[40px] ${thBase}`}>일자</th>
                <th className={`h-[40px] ${thBase}`}>시급</th>
                <th className={`bg-red-10 h-[44px] ${thBase} ${stickyColumnBase} ${stickyAfter}`}>
                  상태
                </th>
              </tr>
            </thead>

            <tbody className="divide-gray-20 divide-y">
              {applications.map((app) => {
                const item = app.item;
                const shopItem = item.shop?.item;
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
                      <div className="bg-green-10 text-green-20 flex h-8 w-19 items-center justify-center rounded-2xl text-xs font-medium md:text-sm md:font-semibold">
                        대기 중
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
                      <div className="bg-gray-20 flex h-8 w-19 items-center justify-center rounded-2xl text-xs font-medium text-gray-500 md:text-sm md:font-semibold">
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
                      <div className="truncate">{shopItem?.name || "가게명 없음"}</div>
                    </td>

                    <td className={`h-[45px] ${tdBase}`}>
                      {noticeItem?.startsAt && noticeItem?.workhour
                        ? (() => {
                            const startDate = new Date(noticeItem.startsAt);
                            const endDate = new Date(
                              startDate.getTime() + noticeItem.workhour * 60 * 60 * 1000,
                            );

                            const dateStr = startDate.toISOString().split("T")[0];
                            const startHour = String(startDate.getHours()).padStart(2, "0");
                            const startMin = String(startDate.getMinutes()).padStart(2, "0");
                            const endHour = String(endDate.getHours()).padStart(2, "0");
                            const endMin = String(endDate.getMinutes()).padStart(2, "0");

                            return `${dateStr} ${startHour}:${startMin} ~ ${endHour}:${endMin} (${noticeItem.workhour}시간)`;
                          })()
                        : "-"}
                    </td>

                    <td className={`h-[45px] ${tdBase}`}>
                      {noticeItem?.hourlyPay ? `${noticeItem.hourlyPay.toLocaleString()}원` : "-"}
                    </td>

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

      {/* 지원 취소 확인 모달 */}
      <Modal
        open={modalOpen}
        onClose={handleModalCancel}
        variant="icon"
        icon={
          <Image
            src="/icon/caution.svg"
            alt="주의 아이콘"
            width={25}
            height={25}
          />
        }
        description="지원을 취소하시겠습니까?"
        actions={[
          {
            label: "아니오",
            onClick: handleModalCancel,
            variant: "outline",
          },
          {
            label: "취소하기",
            onClick: handleModalConfirm,
            variant: "primary",
          },
        ]}
      />
    </div>
  );
}
