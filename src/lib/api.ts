import { AlertReq, UserAlertsRes, UserAlertStatusRes } from "@/types/alert";
import {
  ApplicationStatusReq,
  NoticeApplicationItem,
  NoticeApplicationsReq,
  NoticeApplicationsRes,
} from "@/types/application";
import { ImgReq, ImgRes } from "@/types/image";
import {
  NoticeItem,
  NoticeReq,
  NoticesRes,
  ShopNoticeReq,
  UpsertShopNoticeReq,
} from "@/types/notice";
import { ShopItem, UpsertShopReq } from "@/types/shop";
import { SignupUserReq, SignupUserRes, UserInfoPutReq, UserInfoRes } from "@/types/user";
import { fetcher } from "./api-client";

/**
 *
 * 팀원들이 가져다 쓸 API 모듈
 *
 */
export const apiClient = {
  /**
   * image
   */
  images: {
    createImg: (data: ImgReq): Promise<ImgRes> =>
      fetcher("/images", { method: "POST", body: JSON.stringify(data) }),
  },

  /**
   * notice
   */
  notices: {
    getNotices: (params?: NoticeReq): Promise<NoticesRes> => {
      return fetcher(`/notices`, { method: "GET", params });
    },

    getShopNotices: (shopId: string, params?: ShopNoticeReq): Promise<NoticesRes> => {
      return fetcher(`/shops/${shopId}/notices`, { method: "GET", params });
    },

    getShopOnlyNotice: (shopId: string, noticeId: string): Promise<NoticeItem> => {
      return fetcher(`/shops/${shopId}/notices/${noticeId}`, { method: "GET" });
    },

    createShopNotice: (shopId: string, data: UpsertShopNoticeReq): Promise<NoticeItem> =>
      fetcher(`/shops/${shopId}/notices`, { method: "POST", body: JSON.stringify(data) }),

    updateShopOnlyNotice: (
      shopId: string,
      noticeId: string,
      data: UpsertShopNoticeReq,
    ): Promise<NoticeItem> => {
      return fetcher(`/shops/${shopId}/notices/${noticeId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
  },

  /**
   * shop
   */
  shops: {
    getShops: (shopId: string): Promise<ShopItem> => fetcher(`/shops/${shopId}`, { method: "GET" }),

    createShop: (data: UpsertShopReq): Promise<ShopItem> =>
      fetcher("/shops", { method: "POST", body: JSON.stringify(data) }),

    updateShopInfo: (shopId: string, data: UpsertShopReq): Promise<ShopItem> =>
      fetcher(`/shops/${shopId}`, { method: "PUT", body: JSON.stringify(data) }),
  },

  /**
   * application
   */
  applications: {
    getShopNoticeApplications: (
      shopId: string,
      noticeId: string,
      params?: NoticeApplicationsReq,
    ): Promise<NoticeApplicationsRes> => {
      return fetcher(`/shops/${shopId}/notices/${noticeId}/applications`, {
        method: "GET",
        params,
      });
    },

    getShopNoticeUserApplications: (
      userId: string,
      params?: NoticeApplicationsReq,
    ): Promise<NoticeApplicationsRes> => {
      return fetcher(`/users/${userId}/applications`, { method: "GET", params });
    },

    createShopNoticeApplication: (
      shopId: string,
      noticeId: string,
    ): Promise<NoticeApplicationItem> =>
      fetcher(`/shops/${shopId}/notices/${noticeId}/applications`, { method: "POST" }),

    updateShopNoticeApplicationStatus: (
      shopId: string,
      noticeId: string,
      applicationId: string,
      data: ApplicationStatusReq,
    ): Promise<NoticeApplicationItem> =>
      fetcher(`/shops/${shopId}/notices/${noticeId}/applications/${applicationId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  /**
   * user
   */
  user: {
    getUser: (userId: string): Promise<UserInfoRes> =>
      fetcher(`/users/${userId}`, { method: "GET" }),

    createUser: (data: SignupUserReq): Promise<SignupUserRes> =>
      fetcher("/users", { method: "POST", body: JSON.stringify(data) }),

    updateUserInfo: (userId: string, data: UserInfoPutReq): Promise<UserInfoRes> =>
      fetcher(`/users/${userId}`, { method: "PUT", body: JSON.stringify(data) }),
  },

  /**
   * alert
   */
  alert: {
    getUserAlerts: (userId: string, params?: AlertReq): Promise<UserAlertsRes> => {
      return fetcher(`/users/${userId}/alerts`, { method: "GET", params });
    },

    updateUserAlertStatus: (userId: string, alertId: string): Promise<UserAlertStatusRes> =>
      fetcher(`/users/${userId}/alerts/${alertId}`, { method: "PUT" }),
  },
};
