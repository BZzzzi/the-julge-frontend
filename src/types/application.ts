/**
 * 공고 지원 관련 타입
 */

import { ApiLink, NestedItem } from "@/types/common";
import { NoticeDetail } from "@/types/notice";
import { ShopDetail } from "@/types/shop";

/**
 * GET, POST, PUT
 */

// 지원 상태 타입 정의
export type ApplicationStatus = "pending" | "accepted" | "rejected" | "canceled";

// 사용자 정보 타입
export type UserItem = {
  id: string;
  email: string;
  type: "employer" | "employee";
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
};

export type User = {
  item: UserItem;
  href: string;
};

// 지원 공고 목록 조회 요청 파라미터
export interface NoticeApplicationsReq {
  offset?: number;
  limit?: number;
}

// 지원 공고 정보 상세
export interface NoticeApplicationItem {
  item: {
    id: string;
    status: ApplicationStatus;
    createdAt: string;
    user?: NestedItem<UserItem>;
    shop?: NestedItem<ShopDetail>;
    notice?: NestedItem<NoticeDetail>;
  };
  links?: ApiLink[];
}

// 최종 지원 공고 목록 응답 데이터
export interface NoticeApplicationsRes {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: NoticeApplicationItem[];
  links: ApiLink[];
}

// 특정 가게 지원 공고 승인, 거절
export interface ApplicationStatusReq {
  status: "accepted | rejected | canceled";
}
