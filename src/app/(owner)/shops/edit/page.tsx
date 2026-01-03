import { Button } from "@/components/common/button";
import { apiClient } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import ShopEditForm from "./shopEditForm";

export default async function ShopEditPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <section className="flex min-h-screen items-center justify-center px-4 bg-gray-10">
        <div className="w-full max-w-md rounded-xl border bg-white border-gray-20 p-14 text-center">
          <Image 
            src="/icon/caution.svg"  
            alt="가게 없음"
            width={48}
            height={48}
            className="mx-auto mb-6"
          />
          <p className="mb-6 text-lg text-black">
            로그인이 필요합니다
          </p>
          <Link href={"/login"}>
            <Button variant="primary" size="lg" className="w-86.5">
              로그인 하기
            </Button>
          </Link>
        </div>
      </section>
      
    );
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return (
      <section className="flex min-h-screen items-center justify-center px-4 bg-gray-10">
        <div className="w-full max-w-md rounded-xl border bg-white border-gray-20 p-14 text-center">
          <Image 
            src="/icon/caution.svg" 
            alt="가게 없음"
            width={48}
            height={48}
            className="mx-auto mb-6"
          />
          <p className="mb-6 text-lg text-black">
            로그인 정보가 올바르지 않습니다.
          </p>
          <Link href={"/login"}>
            <Button variant="primary" size="lg" className="w-86.5">
              다시 로그인 하기
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const userRes = await apiClient.user.getUser(userId);
  const shop = userRes.item.shop?.item ?? null;

  if (!shop) {
    return (
      <section className="flex min-h-screen items-center justify-center px-4 bg-gray-10">
        <div className="w-full max-w-md rounded-xl border bg-white border-gray-20 p-14 text-center">
          <Image 
            src="/icon/caution.svg"  
            alt="가게 없음"
            width={48}
            height={48}
            className="mx-auto mb-6"
          />
          <p className="mb-6 text-lg text-black">
            등록된 가게가 없습니다.
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

  return <ShopEditForm initialShop={shop} />;
}
