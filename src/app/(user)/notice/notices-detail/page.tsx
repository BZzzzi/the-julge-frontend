import Footer from "@/components/common/layouts/footer";
import Header from "@/components/common/layouts/header";
import NoticeListWithDetailPage from "@/components/domain/noticesdetail/noticesdetail";

export default function Page() {
  return (
    <div>
      <Header showSearchInput={false} />
      <NoticeListWithDetailPage />
      <Footer />
    </div>
  );
}
