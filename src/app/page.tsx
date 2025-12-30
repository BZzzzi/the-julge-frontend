import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-screen-lg space-y-16 p-6 md:p-10">
      {/* 테스트 페이지 */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">테스트 페이지</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/css-test"
            className="bg-blue-20 hover:bg-blue-20/90 active:bg-blue-20/80 rounded-lg px-6 py-3 text-center font-medium text-white transition-colors"
          >
            공통 css 테스트 페이지
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-gray-50 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-gray-50/90 active:bg-gray-50/80"
          >
            로그인 페이지
          </Link>
          <Link
            href="/signup"
            className="bg-red-30 rounded-lg px-6 py-3 text-center font-medium text-white transition-colors hover:bg-gray-50/90 active:bg-gray-50/80"
          >
            회원가입 페이지
          </Link>
        </div>
      </div>

      {/* 공고 관련 (Owner) */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">공고 관련 (Owner)</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/notice/notices-list"
            className="rounded-lg bg-purple-500 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-purple-600 active:bg-purple-700"
          >
            공고 리스트
          </Link>
          <Link
            href="/notice/notices-detail"
            className="rounded-lg bg-purple-500 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-purple-600 active:bg-purple-700"
          >
            공고 리스트 상세
          </Link>
        </div>
      </div>

      {/* 공고 관련 (Owner) */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">공고 관련 (Owner)</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/notice/notice-detail"
            className="rounded-lg bg-indigo-500 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-indigo-600 active:bg-indigo-700"
          >
            공고 상세
          </Link>
          <Link
            href="/notice/notice-new"
            className="rounded-lg bg-indigo-500 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-indigo-600 active:bg-indigo-700"
          >
            공고 등록
          </Link>
        </div>
      </div>

      {/* 프로필 관련 (User) */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">프로필 관련 (User)</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/profile/profile-detail"
            className="rounded-lg bg-green-500 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-green-600 active:bg-green-700"
          >
            내 프로필 상세
          </Link>
          <Link
            href="/profile/profile-new"
            className="rounded-lg bg-green-500 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-green-600 active:bg-green-700"
          >
            내 프로필 등록
          </Link>
        </div>
      </div>

      {/* 가게 관련 (Owner) */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">가게 관련 (Owner)</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/shops/new"
            className="rounded-lg bg-orange-500 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-orange-600 active:bg-orange-700"
          >
            가게 정보 등록
          </Link>
          <Link
            href="/shops/test-shop-id"
            className="rounded-lg bg-orange-500 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-orange-600 active:bg-orange-700"
          >
            가게 정보 상세
          </Link>
          <Link
            href="/shops/test-shop-id/edit"
            className="rounded-lg bg-orange-500 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-orange-600 active:bg-orange-700"
          >
            가게 정보 편집
          </Link>
        </div>
      </div>
    </div>
  );
}
