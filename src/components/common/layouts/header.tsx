"use client";

import { logoutAction } from "@/app/(auth)/(logout)/actions";
import { useUser, useUserActions } from "@/store/user";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

// 검색 Input 컴포넌트
const SearchInput = ({ className = "" }: { className?: string }) => {
  const [keyword, setKeyword] = React.useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL에서 초기 검색어 가져오기
  React.useEffect(() => {
    const urlKeyword = searchParams.get("keyword") || "";
    setKeyword(urlKeyword);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (keyword.trim()) {
      params.set("keyword", keyword.trim());
    } else {
      params.delete("keyword");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setKeyword("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("keyword");
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const hasKeyword = keyword.trim().length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="relative"
    >
      <input
        id="search"
        name="search"
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="가게 이름으로 찾아보세요."
        className={`placeholder:text-gray-40 focus:ring-gray-20 bg-gray-10 rounded-xl py-3 text-sm outline-none focus:ring-2 focus:ring-offset-0 ${
          hasKeyword ? "pr-12 pl-12" : "px-12"
        } ${className}`}
      />
      <div className="text-gray-40 pointer-events-none absolute inset-y-0 left-4 flex items-center">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-current"
        >
          <path
            d="M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 18L14 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {hasKeyword && (
        <button
          type="button"
          onClick={handleClear}
          className="text-gray-40 absolute inset-y-0 right-4 flex items-center hover:text-gray-50"
          aria-label="검색어 지우기"
        >
          <Image
            src="/icon/close.svg"
            alt="검색어 지우기"
            width={20}
            height={20}
          />
        </button>
      )}
    </form>
  );
};

const buttonStyle = "cursor-pointer text-sm font-semibold";

// 버튼 그룹 컴포넌트
const AuthButtons = () => {
  const { user, isLoggedIn } = useUser();
  const { clearUserInfo } = useUserActions();

  const handleLogout = () => {
    logoutAction(); // 쿠키 삭제 서버 액션
    clearUserInfo(); // 스토어 초기화
  };

  return (
    <div className="flex items-center gap-3 lg:gap-10">
      {isLoggedIn ? (
        <>
          <Link
            href={
              user?.userType === "employer" ? `/shops/${user?.userId}` : `/profile/${user?.userId}`
            }
            className={buttonStyle}
          >
            {user?.userType === "employer" ? "내 가게" : "내 프로필"}
          </Link>
          <button
            onClick={handleLogout}
            className={buttonStyle}
          >
            로그아웃
          </button>
          {/* TODO: 알림 컴포넌트 완성되면 붙이기 */}
          <Image
            src="/icon/notification.svg"
            alt="로고"
            width={24}
            height={24}
          />
        </>
      ) : (
        <>
          <Link
            href="/login"
            className={buttonStyle}
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className={buttonStyle}
          >
            회원가입
          </Link>
        </>
      )}
    </div>
  );
};

type HeaderProps = {
  showSearchInput?: boolean;
};

export default function Header({ showSearchInput = true }: HeaderProps) {
  return (
    <div className="bg-white">
      <div className="m-auto flex w-[335px] py-4 md:h-17.5 md:w-[680px] md:items-center lg:w-[1024px]">
        {/* PC, Tablet */}
        <div className="hidden w-full items-center justify-between md:flex">
          <div className="flex gap-8 lg:gap-10">
            <Link
              href="/"
              className="flex items-center"
            >
              <Image
                src="/icon/logo.svg"
                alt="로고"
                width={110}
                height={40}
              />
            </Link>
            {showSearchInput && <SearchInput className="w-85 lg:w-110" />}
          </div>
          <AuthButtons />
        </div>

        {/* Mobile */}
        <div className="flex w-full flex-col gap-4 md:hidden">
          <div className="flex justify-between">
            <Link
              href="/"
              className="flex items-center"
            >
              <Image
                src="/icon/logo.svg"
                alt="로고"
                width={110}
                height={40}
              />
            </Link>
            <AuthButtons />
          </div>
          {showSearchInput && <SearchInput className="w-full" />}
        </div>
      </div>
    </div>
  );
}
