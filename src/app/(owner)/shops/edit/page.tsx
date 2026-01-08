import { Button } from "@/components/common/button";
import Header from "@/components/common/layouts/header";
import { apiClient } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import ShopEditForm from "./shop-edit-form";

export default async function ShopEditPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <>
        <Header showSearchInput={false} />
        <main className="bg-gray-10 min-h-screen">
          <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
            <div className="mx-auto w-87.75 md:w-170 lg:w-241">
              <div className="border-gray-20 w-full rounded-xl border bg-white p-14 text-center">
                <Image
                  src="/icon/caution.svg"
                  alt="가게 없음"
                  width={48}
                  height={48}
                  className="mx-auto mb-6"
                />
                <p className="mb-6 text-lg text-black">로그인이 필요합니다</p>
                <Link href={"/login"}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-86.5"
                  >
                    로그인 하기
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return (
      <>
        <Header showSearchInput={false} />
        <main className="bg-gray-5 min-h-screen">
          <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
            <div className="border-gray-20 w-full max-w-md rounded-xl border bg-white p-14 text-center">
              <Image
                src="/icon/caution.svg"
                alt="가게 없음"
                width={48}
                height={48}
                className="mx-auto mb-6"
              />
              <p className="mb-6 text-lg text-black">로그인 정보가 올바르지 않습니다.</p>
              <Link href={"/login"}>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-86.5"
                >
                  다시 로그인 하기
                </Button>
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  const userRes = await apiClient.user.getUser(userId);
  const shop = userRes.item.shop?.item ?? null;

  if (!shop) {
    return (
      <>
        <Header showSearchInput={false} />
        <main className="bg-gray-5 min-h-screen">
          <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
            <div className="border-gray-20 w-full max-w-md rounded-xl border bg-white p-14 text-center">
              <Image
                src="/icon/caution.svg"
                alt="가게 없음"
                width={48}
                height={48}
                className="mx-auto mb-6"
              />
              <p className="mb-6 text-lg text-black">등록된 가게가 없습니다.</p>
              <Link href={"/shops/new"}>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-86.5"
                >
                  가게 등록하기
                </Button>
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Header showSearchInput={false} />
      <ShopEditForm initialShop={shop} />
    </>
  );
}
