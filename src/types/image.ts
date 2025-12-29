/**
 * 이미지 관련 타입
 */

import { ApiLink } from "@/types/common";

/**
 * POST
 */

export interface ImgReq {
  name: string;
}

export interface ImgRes {
  item: {
    url: string;
  };
  links: ApiLink[];
}
