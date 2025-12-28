/**
 * 타입 공통 사용
 * Link, item 중첩 구조 등
 */

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type LinkRel = "self" | "update" | "upload" | "user" | "notices" | string;

export interface ApiLink {
  rel: LinkRel;
  description: string;
  method: HttpMethod;
  href: string;
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
}

export interface NestedItem<T> {
  item: T;
  href?: string;
}
