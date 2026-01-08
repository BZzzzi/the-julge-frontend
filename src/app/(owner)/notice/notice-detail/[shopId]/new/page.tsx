import Header from "@/components/common/layouts/header";
import NoticeUpsertForm from "@/components/domain/notice-shop/notice-upsert-form";

interface PageProps {
  params: Promise<{
    shopId: string;
  }>;
}
export default async function NoticeNewPage({ params }: PageProps) {
  const { shopId } = await params;

  return (
    <div className="bg-gray-5 flex min-h-screen flex-col">
      <Header showSearchInput={false} />
      <NoticeUpsertForm shopId={shopId} />
    </div>
  );
}
