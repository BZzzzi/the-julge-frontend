"use client";

import { logoutAction } from "@/app/(auth)/(logout)/actions";
import Alert from "@/components/common/layouts/alert";
import { useUser, useUserActions } from "@/store/user";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const buttonStyle = "cursor-pointer text-sm font-semibold";

export default function UserMenu() {
  const { user, isLoggedIn } = useUser();
  const { clearUserInfo } = useUserActions();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleLogout = () => {
    logoutAction(); // 쿠키 삭제 서버 액션
    clearUserInfo(); // 스토어 초기화
  };

  const handleNotificationClick = () => {
    setIsAlertOpen(true);
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

  return (
    <div className="flex items-center gap-3 lg:gap-10">
      {isLoggedIn ? (
        <>
          <Link
            href={user?.userType === "employer" ? `/shops/my-shop` : `/profile/my-profile`}
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
          {user?.userType === "employee" && (
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="cursor-pointer"
                aria-label="알림 열기"
              >
                <Image
                  src="/icon/notification.svg"
                  alt="알림"
                  width={24}
                  height={24}
                />
              </button>
              <Alert
                isOpen={isAlertOpen}
                onClose={handleAlertClose}
              />
            </div>
          )}
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
}
