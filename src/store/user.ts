"use client";

import { UserInfo } from "@/types/user";
import { create } from "zustand";
import { combine, createJSONStorage, devtools, persist } from "zustand/middleware";

/** =========================
 *  User Store
========================= */
type UserState = { isLoggedIn: true; user: UserInfo } | { isLoggedIn: false; user: null };

const initialState = {
  isLoggedIn: false,
  user: null,
} as UserState;

const useUserStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        setUserInfo: (userInfo: UserInfo) => {
          set({ user: userInfo, isLoggedIn: true });
        },
        clearUserInfo: () => {
          set({ ...initialState });
        },
      },
    })),
    { name: "UserStore" },
  ),
);

export const useUser = () => {
  const user = useUserStore((state) => state.user);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  return { user, isLoggedIn };
};

export const useUserActions = () => useUserStore((state) => state.actions);

export const useUserType = () => useUserStore((state) => state.user?.userType ?? "employer");

/** =========================
 *  Notice Selection Store (notices -> notices-detail 전달)
========================= */
export type SelectedNotice = { shopId: string; noticeId: string } | null;

type NoticeSelectionState = {
  selected: SelectedNotice;
  setSelected: (v: SelectedNotice) => void;
  clear: () => void;
};

export const useNoticeSelection = create<NoticeSelectionState>()(
  persist(
    (set) => ({
      selected: null,
      setSelected: (v) => set({ selected: v }),
      clear: () => set({ selected: null }),
    }),
    {
      name: "noticeSelection",
      storage: createJSONStorage(() => sessionStorage), 
      partialize: (s) => ({ selected: s.selected }),
    },
  ),
);
