/**
 * 공고 관련 타입
 */

import { ApplicationStatus } from "@/types/application";
import { ApiLink, NestedItem } from "@/types/common";
import { ShopDetail } from "@/types/shop";

/**
 * GET
 */

// 현재 유저의 지원 정보
export interface CurrentUserApplication {
  item: {
    id: string;
    status: ApplicationStatus;
    createdAt: string;
  };
}

// 공고 정보 상세
export interface NoticeDetail {
  id: string;
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
  closed: boolean;
  shop?: NestedItem<ShopDetail>;
  currentUserApplication?: CurrentUserApplication | null;
}

// 공고 목록 조회 요청 파라미터
export interface NoticeReq {
  offset?: number;
  limit?: number;
  address?: string;
  keyword?: string;
  startsAtGte?: string;
  hourlyPayGte?: number;
  sort?: "time" | "pay" | "hour" | "shop";
}

// 특정 가게 공고 목록 조회 요청 파라미터
export interface ShopNoticeReq {
  offset?: number;
  limit?: number;
}

// 개별 공고 아이템
export interface NoticeItem {
  item: NoticeDetail;
  links: ApiLink[];
}

// 최종 공고 목록 응답 데이터
export interface NoticesRes {
  offset: number;
  limit: number;
  address: string[];
  count: number;
  hasNext: boolean;
  items: NoticeItem[];
  links: ApiLink[];
}

/**
 *
 * POST, PUT
 *
 */

// 가게 공고 등록 요청 데이터
export interface UpsertShopNoticeReq {
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
}
