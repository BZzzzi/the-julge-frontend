import Footer from "@/components/common/layouts/footer";
import Header from "@/components/common/layouts/header";
import NoticeShopCard from "@/components/domain/notice-shop/notice-shop-card";
import OwnerTable from "@/components/domain/notice-shop/owner-table";
import { apiClient } from "@/lib/api";
import { NoticeApplicationsRes } from "@/types/application";
import { NoticeItem } from "@/types/notice";

interface PageProps {
  params: Promise<{
    shopId: string;
    noticeId: string;
  }>;
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { shopId, noticeId } = await params;

  let noticeData: NoticeItem | null = null;
  try {
    noticeData = await apiClient.notices.getShopOnlyNotice(shopId, noticeId);
  } catch (error) {
    console.error("공고 정보를 불러오는데 실패했습니다:", error);
  }

  let applicationsData: NoticeApplicationsRes | null = null;
  try {
    applicationsData = await apiClient.applications.getShopNoticeApplications(shopId, noticeId, {
      offset: 0,
      limit: 5,
    });
  } catch (error) {
    console.error("신청자 목록을 불러오는데 실패했습니다:", error);
  }

  return (
    <div className="bg-gray-5 flex min-h-screen flex-col">
      <Header showSearchInput={false} />
      <main className="flex flex-1 flex-col items-center py-10 md:py-[60px]">
        <div className="flex max-w-87.5 flex-col gap-8 px-4 md:max-w-170 md:gap-12 lg:max-w-241">
          <NoticeShopCard
            shopId={shopId}
            noticeId={noticeId}
            initialNotice={noticeData}
          />
          <OwnerTable
            shopId={shopId}
            noticeId={noticeId}
            initialApplications={applicationsData}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
