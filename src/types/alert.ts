/**
 * 유저 알림 관련 타입
 */

import { ApiLink, NestedItem } from "@/types/common";
import { NoticeDetail } from "@/types/notice";
import { ShopDetail } from "@/types/shop";

/**
 * GET
 */

// 알림 상태 타입 정의
export type AlertStatus = "pending" | "accepted" | "rejected";

// 알림 조회 요청 파라미터
export interface AlertReq {
  offset?: number;
  limit?: number;
}

// 알림 아이템 상세
export interface AlertDetail {
  id: string;
  createdAt: string;
  result: "accepted" | "rejected";
  read: boolean;
  application: NestedItem<{
    id: string;
    status: AlertStatus;
  }>;
  shop?: NestedItem<ShopDetail>;
  notice?: NestedItem<NoticeDetail>;
}

// 알림 아이템 데이터
export interface UserAlertItem {
  item: AlertDetail;
  links?: ApiLink[];
}

// 알림 응답 데이터
export interface UserAlertsRes {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: UserAlertItem[];
  links: ApiLink[];
}

/**
 * PUT
 */

// 알림 읽음 응답 데이터
export interface UserAlertStatusRes {
  offset: number;
  limit: number;
  items: UserAlertItem[];
  links: ApiLink[];
}
