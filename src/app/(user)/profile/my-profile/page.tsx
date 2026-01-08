import { Button } from "@/components/common/button";
import Header from "@/components/common/layouts/header";
import Footer from "@/components/domain/footer";
import ProfileCard from "@/components/domain/user-profile/profile-card";
import UserTable from "@/components/domain/user-profile/user-table";
import { apiClient } from "@/lib/api";
import { getUserIdFromUserInfoCookie } from "@/lib/auth";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function MyProfilePage() {
  const cookieStore = await cookies();
  const userInfoCookie = cookieStore.get("userInfo")?.value;
  const userId = getUserIdFromUserInfoCookie(userInfoCookie);
  const userRes = await apiClient.user.getUser(userId as string);
  const userName = userRes.item.name ?? null;

  if (!userName) {
    return (
      <div className="flex h-dvh flex-col justify-between">
        <div>
          <Header showSearchInput={false} />
          <main>
            <section className="mx-auto w-87.75 px-2 py-10 md:w-170 lg:w-241">
              <h1 className="mb-6 text-2xl font-bold">내 프로필</h1>

              <div className="border-gray-20 rounded-xl border px-5 py-15 text-center md:p-15">
                <p className="mb-6 text-sm text-black md:text-lg">
                  내 프로필을 등록하고 원하는 가게에 지원해 보세요.
                </p>
                <Link href={`/profile/my-profile/${userId}`}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-50 text-sm md:w-86.5 md:text-[16px]"
                  >
                    내 프로필 등록하기
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
  return (
    <div className="bg-gray-5 flex min-h-screen flex-col">
      <Header showSearchInput={false} />
      <main className="flex flex-1 flex-col items-center py-10 md:py-[60px]">
        <div className="flex max-w-87.5 flex-col gap-8 px-4 md:max-w-170 md:gap-12 lg:max-w-241">
          <ProfileCard userInfo={userRes} />
          <UserTable userInfo={userRes} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
