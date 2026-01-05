import Footer from "@/components/common/layouts/footer";
import Header from "@/components/common/layouts/header";
import NoticeListWithDetailPage from "@/components/domain/noticesdetail/noticesdetail";
import { getServerAuth } from "@/lib/server-auth";

export default async function Notices_detail() {
  const { userId } = await getServerAuth();

  return (
    <div>
      <Header />
      <NoticeListWithDetailPage userId={userId} />
      <Footer />
    </div>
  );
}
