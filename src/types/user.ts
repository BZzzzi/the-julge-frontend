/**
 * 유저 관련 타입
 */

import { ApiLink, NestedItem } from "@/types/common";
import { SeoulRegion, ShopDetail } from "@/types/shop";

/**
 * GET
 */

// 유저 정보 타입
export type UserInfoItem = {
  id: string;
  email: string;
  type: "employer" | "employee";
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
  shop?: NestedItem<ShopDetail> | null;
};

// 유저 정보 응답 데이터
export interface UserInfoRes {
  item: UserInfoItem;
  links: ApiLink[];
}

/**
 * POST
 */

// Auth 유저 정보
export interface UserInfo {
  userId: string;
  userType: "employer" | "employee";
}

// 회원가입 요청 데이터
export interface SignupUserReq {
  email: string;
  password: string;
  type: "employer" | "employee";
}

export interface UserItem {
  id: string;
  email: string;
  type: "employer" | "employee";
}

// 회원가입 응답 데이터
export interface SignupUserRes {
  item: UserItem;
  links: ApiLink[];
}

/**
 * PUT
 */

// 유저 정보 수정 요청 데이터
export interface UserInfoPutReq {
  name: string;
  phone: string;
  address: SeoulRegion;
  bio: string;
}
