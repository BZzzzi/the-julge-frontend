/**
 * 가게 관련 타입
 */

import { User } from "@/types/application";
import { ApiLink } from "@/types/common";

/**
 * GET, POST, PUT
 */

// 가게 카테고리 유니온 타입
export type ShopCategory = "한식" | "중식" | "일식" | "양식" | "분식" | "카페" | "편의점" | "기타";

// 가게 주소 유니온 타입
export type SeoulRegion =
  | "서울시 종로구"
  | "서울시 중구"
  | "서울시 용산구"
  | "서울시 성동구"
  | "서울시 광진구"
  | "서울시 동대문구"
  | "서울시 중랑구"
  | "서울시 성북구"
  | "서울시 강북구"
  | "서울시 도봉구"
  | "서울시 노원구"
  | "서울시 은평구"
  | "서울시 서대문구"
  | "서울시 마포구"
  | "서울시 양천구"
  | "서울시 강서구"
  | "서울시 구로구"
  | "서울시 금천구"
  | "서울시 영등포구"
  | "서울시 동작구"
  | "서울시 관악구"
  | "서울시 서초구"
  | "서울시 강남구"
  | "서울시 송파구"
  | "서울시 강동구";

// 가게 등록 요청 데이터
export interface UpsertShopReq {
  name: string;
  category: ShopCategory;
  address1: SeoulRegion;
  address2: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: number;
}

// 가게 정보 상세
export interface ShopDetail {
  id: string;
  name: string;
  category: string;
  address1: string;
  address2: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: number;
  user?: User;
}

// 개별 가게 아이템
export interface ShopItem {
  item: ShopDetail;
  links: ApiLink[];
}
