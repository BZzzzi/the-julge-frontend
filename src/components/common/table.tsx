import { Pagination } from "@/components/common/pagination";
import { NoticeApplicationItem } from "@/types/application";

interface TableProps {
  applications: NoticeApplicationItem[];
  totalCount: number;
  page: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onAccept: (applicationId: string) => void;
  onReject: (applicationId: string) => void;
}

export default function Table({
  applications,
  totalCount,
  page,
  itemsPerPage,
  onPageChange,
  onAccept,
  onReject,
}: TableProps) {
  // 신청자가 없으면 렌더링 안 함
  if (!applications || applications.length === 0) {
    return null;
  }

  const totalPage = Math.ceil(totalCount / itemsPerPage) || 1;

  return (
    <div className="flex w-full max-w-[964px] flex-col gap-6">
      <h2 className="text-2xl font-bold text-black">신청자 목록</h2>

      <div className="border-gray-20 w-full overflow-hidden rounded-[10px] border bg-white">
        <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-[964px] table-fixed border-collapse">
            <colgroup>
              <col className="w-[228px]" />
              <col className="w-[300px]" />
              <col className="w-[200px]" />
              <col className="w-[236px]" />
            </colgroup>

            <thead className="bg-red-10">
              <tr className="border-b border-[#FEF7F6]">
                <th className="bg-red-10 sticky left-0 z-10 h-[50px] px-[12px] py-[14px] text-left text-sm font-normal text-black after:absolute after:top-0 after:right-0 after:h-full after:w-[1px] after:bg-gray-200 after:content-[''] min-[964px]:after:hidden">
                  신청자
                </th>
                <th className="h-[50px] px-[12px] py-[14px] text-left text-sm font-normal text-black">
                  소개
                </th>
                <th className="h-[50px] px-[12px] py-[14px] text-left text-sm font-normal text-black">
                  전화번호
                </th>
                <th className="h-[50px] px-[12px] py-[14px] text-left text-sm font-normal text-black">
                  상태
                </th>
              </tr>
            </thead>

            <tbody className="divide-gray-20 divide-y">
              {applications.map((app) => {
                const item = app.item;
                const userItem = item.user?.item;

                return (
                  <tr key={item.id} className="group hover:bg-gray-5 transition-colors">
                    <td className="group-hover:bg-gray-5 sticky left-0 z-10 bg-white px-[12px] py-[16px] align-middle text-base text-black transition-colors after:absolute after:top-0 after:right-0 after:h-full after:w-[1px] after:bg-gray-100 after:content-[''] min-[964px]:after:hidden">
                      <div className="truncate">{userItem?.name || "이름 없음"}</div>
                    </td>

                    <td className="px-[12px] py-[16px] align-middle text-base text-black">
                      <div className="line-clamp-2 break-keep whitespace-normal">
                        {userItem?.bio || "소개가 없습니다."}
                      </div>
                    </td>

                    <td className="px-[12px] py-[16px] align-middle text-base text-black">
                      {userItem?.phone || "010-0000-0000"}
                    </td>

                    <td className="px-[12px] py-[16px] text-left align-middle"></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalCount > 0 && (
          <div className="border-gray-20 flex h-[64px] items-center justify-center border-t px-[12px] py-[8px]">
            <Pagination totalPage={totalPage} currentPage={page} onPageChange={onPageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
