import Header from "@/components/common/layouts/header";
import Footer from "@/components/domain/footer";
import NoticesPageClient from "@/components/domain/notices-client/notices-page.client";

export default function NoticesPage() {
  return (
    <div className="min-h-dvh bg-white">
      <Header />
      <NoticesPageClient />
      <Footer />
    </div>
  );
}
