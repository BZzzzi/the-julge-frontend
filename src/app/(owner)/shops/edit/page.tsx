// src/app/(owner)/shops/edit/page.tsx
import { apiClient } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";
import { cookies } from "next/headers";
import Link from "next/link";
import ShopEditForm from "./shopEditForm";

export default async function ShopEditPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

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

  const userRes = await apiClient.user.getUser(userId);
  const shop = userRes.item.shop?.item ?? null;

  if (!shop) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-10">
        <p className="mb-4">등록된 가게가 없습니다.</p>
        <Link className="underline" href="/shops/my-shop">
          내 가게로 이동
        </Link>
      </section>
    );
  }

  return <ShopEditForm initialShop={shop} />;
}
