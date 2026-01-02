"use client";

import { UserInfo } from "@/types/user";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type UserState = { isLoggedIn: true; user: UserInfo } | { isLoggedIn: false; user: null };

const initialState = {
  isLoggedIn: false,
  user: null,
} as UserState;

const useUserStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        // 로그인 성공 시 또는 Hydration 시 유저 정보 설정
        setUserInfo: (userInfo: UserInfo) => {
          set({ user: userInfo, isLoggedIn: true });
        },
        // 로그아웃 시 상태 초기화
        clearUserInfo: () => {
          set({ ...initialState });
        },
      },
    })),
    { name: "UserStore" },
  ),
);

// 1. 유저 정보 및 로그인 여부 확인용
export const useUser = () => {
  const user = useUserStore((state) => state.user);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  return { user, isLoggedIn };
};

// 2. 액션만 따로 가져오기
export const useUserActions = () => useUserStore((state) => state.actions);

// 3. employer/employee 구분용
export const useUserType = () => useUserStore((state) => state.user?.userType ?? "employer");
