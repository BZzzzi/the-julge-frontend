import { Button } from "@/components/common/button";
import Footer from "@/components/common/layouts/footer";
import Header from "@/components/common/layouts/header";
import ShopInfoCard from "@/components/common/shop-info/shop-info-card";
import { apiClient } from "@/lib/api";
import { getUserIdFromUserInfoCookie } from "@/lib/auth";
import { cookies } from "next/headers";
import Link from "next/link";

import EmployerNoticesSection from "@/app/(owner)/shops/my-shop/employer-notices-section";
import type { CardData } from "@/components/domain/card";

export default async function MyShopPage() {
  const cookieStore = await cookies();

  const userInfoCookie = cookieStore.get("userInfo")?.value;
  const userId = getUserIdFromUserInfoCookie(userInfoCookie);

  const userRes = await apiClient.user.getUser(userId as string);
  const shop = userRes.item.shop?.item ?? null;

  if (!shop) {
    return (
      <div className="flex h-dvh flex-col justify-between">
        <div>
          <Header />
          <main>
            <section className="mx-auto w-87.75 px-4 py-10 md:w-170 lg:w-241">
              <h1 className="mb-6 text-2xl font-bold">내 가게</h1>

              <div className="border-gray-20 rounded-xl border px-5 py-15 text-center md:p-15">
                <p className="mb-6 text-sm text-black md:text-lg">
                  내 가게를 소개하고 공고도 등록해 보세요.
                </p>
                <Link href={"/shops/new"}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-50 text-sm md:w-86.5 md:text-[16px]"
                  >
                    가게 등록하기
                  </Button>
                </Link>
              </div>
            </section>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  const noticesRes = await apiClient.notices.getShopNotices(shop.id, {
    offset: 0,
    limit: 6,
  });
  const notices = noticesRes.items ?? [];

  const cards: CardData[] = notices.map((n) => {
    const notice = n.item;

    return {
      noticeId: notice.id,
      shopId: shop.id,
      name: shop.name,
      startsAt: notice.startsAt,
      workhour: notice.workhour,
      address1: shop.address1,
      hourlyPay: notice.hourlyPay,
      imageUrl: shop.imageUrl,
      isPast: false,
      isClosed: notice.closed,
    };
  });

  return (
    <>
      <Header showSearchInput={false}/>
      <main>
        <section className="mx-auto max-w-5xl px-4 py-14">
          <div className="mx-auto w-87.75 md:w-170 lg:w-241">
            <h1 className="mb-6 text-xl font-bold md:text-[28px]">내 가게</h1>
            <ShopInfoCard
              variant="shop"
              imageUrl={shop.imageUrl}
              title={shop.name}
              address={`${shop.address1} ${shop.address2}`}
              description={shop.description}
              footer={
                <div className="flex gap-3">
                  <div className="flex w-full justify-between gap-4">
                    <Link
                      href={`/shops/edit`}
                      className="block w-full"
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        편집하기
                      </Button>
                    </Link>
                    <Link
                      href={`/notice/notice-detail/${shop.id}/new`}
                      className="block w-full"
                    >
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                      >
                        공고 등록하기
                      </Button>
                    </Link>
                  </div>
                </div>
              }
            />
          </div>
        </section>

        <section className="bg-gray-5 w-full">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <div className="mx-auto w-87.75 md:w-170 lg:w-241">
              {notices.length === 0 ? (
                <div className="border-gray-20 rounded-xl border p-14 text-center">
                  <p className="mb-6 text-lg text-black">공고를 등록해 보세요.</p>
                  <Link href={`/notice/notice-detail/${shop.id}/new`}>
                    <Button
                      variant="primary"
                      size="lg"
                      className="inline-block w-full max-w-86.5"
                    >
                      공고 등록하기
                    </Button>
                  </Link>
                </div>
              ) : (
                <EmployerNoticesSection 
                  initialCards={cards}
                  shopInfo={{
                    id: shop.id,
                    name: shop.name,
                    address1: shop.address1,
                    imageUrl: shop.imageUrl
                  }} />
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
