import { Button } from "@/components/common/button";
import Footer from "@/components/common/layouts/footer";
import Header from "@/components/common/layouts/header";
import ShopInfoCard from "@/components/common/shop-info/ShopInfoCard";
import { apiClient } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import EmployerNoticesSection from "@/app/(owner)/shops/my-shop/employer-notices-section";
import type { CardData } from "@/components/domain/card";

export default async function MyShopPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <>
        <Header />
        <main>
          <section className="flex min-h-screen items-center justify-center px-4 bg-gray-10">
            <div className="w-full max-w-md rounded-xl border bg-white border-gray-20 p-14 text-center">
              <Image 
                src="/icon/caution.svg"  
                alt="로그인 필요"
                width={48}
                height={48}
                className="mx-auto mb-6"
              />
              <p className="mb-6 text-lg text-black">
                로그인이 필요합니다.
              </p>
              <Link href={"/login"}>
                <Button variant="primary" size="lg" className="w-86.5">
                  로그인하러 가기
                </Button>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return (
      <>
        <Header />
        <main>
          <section className="flex min-h-screen items-center justify-center px-4 bg-gray-10">
            <div className="w-full max-w-md rounded-xl border bg-white border-gray-20 p-14 text-center">
              <Image 
                src="/icon/caution.svg"  
                alt="올바르지 않은 로그인"
                width={48}
                height={48}
                className="mx-auto mb-6"
              />
              <p className="mb-6 text-lg text-black">
                로그인 정보가 올바르지 않습니다.
              </p>
              <Link href={"/login"}>
                <Button variant="primary" size="lg" className="w-86.5">
                  다시 로그인하기
                </Button>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const userRes = await apiClient.user.getUser(userId);
  const shop = userRes.item.shop?.item ?? null;

  if (!shop) {
    return (
      <>
        <Header />
        <main>
          <section className="mx-auto max-w-5xl px-4 py-10">
            <h1 className="mb-6 text-2xl font-bold">내 가게</h1>

            <div className="rounded-xl border border-gray-20 p-14 text-center">
              <p className="mb-6 text-lg text-black">
                내 가게를 소개하고 공고도 등록해 보세요.
              </p>
              <Link href={"/shops/new"}>
                <Button variant="primary" size="lg" className="w-86.5">
                  가게 등록하기
                </Button>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const noticesRes = await apiClient.notices.getShopNotices(shop.id, { offset: 0, limit: 6 });
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
      <Header />
      <main>
        <section className="mx-auto max-w-5xl px-4 py-14">
          <div className="mx-auto w-87.75 md:w-170 lg:w-241">
            <h1 className="mb-6 text-xl md:text-[28px] font-bold">내 가게</h1>
            <ShopInfoCard
              variant="shop"
              imageUrl={shop.imageUrl}
              title={shop.name}
              address={`${shop.address1} ${shop.address2}`}
              description={shop.description}
              footer={
                <div className="flex gap-3">
                  <div className="w-full flex justify-between gap-4">
                    <Link href={`/shops/edit`} className="block w-full">
                      <Button variant="outline" size="lg" className="w-full">
                        편집하기
                      </Button>
                    </Link>
                    <Link href={`/notice/notice-new`} className="block w-full">
                      <Button variant="primary" size="lg" className="w-full">
                        공고 등록하기
                      </Button>
                    </Link>
                  </div>
                </div>
              }
            />
          </div>
        </section>

        <section className="w-full bg-gray-5">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <div className="mx-auto w-87.75 md:w-170 lg:w-241">

            {notices.length === 0 ? (
              <div className="rounded-xl border border-gray-20 p-14 text-center">
                <p className="mb-6 text-lg text-black">
                  공고를 등록해 보세요.
                </p>
                <Link href={`/notice/notice-new`}>
                  <Button variant="primary" size="lg" className="inline-block w-full max-w-86.5">
                    공고 등록하기
                  </Button>
                </Link>
              </div>
            ) : (
              <EmployerNoticesSection cards={cards}  />
            )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
