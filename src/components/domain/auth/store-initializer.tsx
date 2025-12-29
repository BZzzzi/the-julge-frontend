"use client";

import { useUserActions } from "@/store/user";
import { useEffect } from "react";

interface StoreInitializerProps {
  userInfo: {
    id: string;
    type: "employer" | "employee";
  } | null;
}

// 서버에서 전달받은 userInfo를 Zustand 스토어에 동기화하는 컴포넌트
// layout.tsx에서 쿠키로부터 읽은 userInfo를 클라이언트 스토어에 반영
// userInfo가 변경될 때마다 스토어 상태를 업데이트
export default function StoreInitializer({ userInfo }: StoreInitializerProps) {
  const { setUserInfo, clearUserInfo } = useUserActions();

  useEffect(() => {
    if (userInfo) {
      setUserInfo({ userId: userInfo.id, userType: userInfo.type });
    } else {
      // userInfo가 null이면 스토어 상태 초기화
      clearUserInfo();
    }
  }, [userInfo, setUserInfo, clearUserInfo]);

  return null;
}
