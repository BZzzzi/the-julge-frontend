// src/app/(owner)/shops/my-shop/page.tsx
import { Button } from "@/components/common/button";
import ShopInfoCard from "@/components/common/shop-info/ShopInfoCard";
import EmployerNoticesGrid from "@/components/domain/card";
import { apiClient } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";
import { cookies } from "next/headers";
import Link from "next/link";


export default async function MyShopPage() {
  /**
   * 1) 서버에서 쿠키 token 읽기
   */
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 로그인 안 되어 있으면
  if (!token) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10">
        <p className="mb-4">로그인이 필요합니다.</p>
        <Link className="underline" href="/login">
          로그인하러 가기
        </Link>
      </section>
    );
  }

  /**
   * 2) token payload에서 userId 뽑기
   */
  const userId = getUserIdFromToken(token);
  if (!userId) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10">
        <p className="mb-4">로그인 정보가 올바르지 않습니다.</p>
        <Link className="underline" href="/login">
          다시 로그인하기
        </Link>
      </section>
    );
  }

  /**
   * 3) 내 정보 조회 (/users/{userId})
   *    - 여기 응답에 shop이 null 또는 shop.item 이 들어있음!
   */
  const userRes = await apiClient.user.getUser(userId);
  const shop = userRes.item.shop?.item ?? null;

  /**
   * A) 가게가 없으면: 가게 등록하기 버튼만 보여주기
   */
  if (!shop) {
    return (
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
    );
  }

  /**
   * 4) 가게가 있으면: 가게 공고 목록 조회 (/shops/{shopId}/notices)
   */
  const noticesRes = await apiClient.notices.getShopNotices(shop.id, { offset: 0, limit: 6 });
  const notices = noticesRes.items ?? [];

  return (
    <>
      <section className="mx-auto max-w-5xl px-4 py-14">
        {/* B) 가게 정보 컴포넌트 */}
        <div className="mx-auto lg:w-241 w-full">
          <h1 className="mt-6 mb-6 text-2xl font-bold">내 가게</h1>
          <ShopInfoCard
            variant="shop"
            imageUrl={shop.imageUrl}
            title={shop.name}
            address={`${shop.address1} ${shop.address2}`}
            description={shop.description}
            footer={
              <div className="flex gap-3">
                <div className="w-full flex justify-between gap-4">
                  <Link href={`/shops/${shop.id}/edit`} className="block w-full">
                    <Button variant="outline" size="lg" className="w-full">
                      편집하기
                    </Button>
                  </Link>
                  {/* 경로 맞는지 확인 */}
                  <Link href={`/notice/${shop.id}/notice-new`} className="block w-full">
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

      <section className="w-full bg-gray-5 mb-4">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <div className="mx-auto w-full lg:w-241 ">

          </div>
          <h1 className="mt-6 mb-6 text-2xl font-bold">내가 등록한 공고</h1>

          {/* C) 공고 없으면: 공고 등록하기 버튼 */}
          {notices.length === 0 ? (
            <div className="rounded-xl border border-gray-20 p-14 text-center">
              <p className="mb-6 text-lg text-black">
                공고를 등록해 보세요.
              </p>
              <Link href={`/notice/${shop.id}/notice-new`}>
                <Button variant="primary" size="lg" className="inlinw-block w-full max-w-86.5">
                  공고 등록하기
                </Button>
              </Link>
            </div>
          ) : (
            // D) 공고 있으면: 공고 목록 컴포넌트
            <EmployerNoticesGrid  />
          )}
        </div>
      </section>
    </>
  );
}
