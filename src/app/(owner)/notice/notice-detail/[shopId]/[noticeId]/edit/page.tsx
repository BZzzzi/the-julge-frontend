import Header from "@/components/common/layouts/header";
import NoticeUpsertForm from "@/components/domain/notice-shop/notice-upsert-form";

interface PageProps {
  params: Promise<{
    shopId: string;
    noticeId: string;
  }>;
}

export default async function NoticeEditPage({ params }: PageProps) {
  const { shopId, noticeId } = await params;

  return (
    <div className="bg-gray-5 flex min-h-screen flex-col">
      <Header />
      <NoticeUpsertForm
        shopId={shopId}
        noticeId={noticeId}
      />
    </div>
  );
}
