"use client";

import { apiClient } from "@/lib/api";
import { useUser } from "@/store/user";
import type { UserAlertsRes } from "@/types/alert";
import { useCallback, useEffect, useState } from "react";

const LIMIT = 10;

/**
 * 사용자 알림 데이터를 가져오는 커스텀 훅
 */
export function useUserAlerts(isOpen: boolean) {
  const { user, isLoggedIn } = useUser();
  const [alertsData, setAlertsData] = useState<UserAlertsRes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    if (!isOpen || !isLoggedIn || !user?.userId) {
      setAlertsData(null);
      return;
    }

    const fetchAlerts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiClient.alert.getUserAlerts(user.userId, {
          limit: LIMIT,
          offset: 0,
        });
        setAlertsData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("알림 데이터를 불러오는데 실패했습니다."));
        console.error("알림 데이터 로딩 오류:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [isOpen, isLoggedIn, user?.userId]);

  // 추가 데이터 로드
  const loadMore = useCallback(async () => {
    if (
      !isOpen ||
      !isLoggedIn ||
      !user?.userId ||
      !alertsData ||
      !alertsData.hasNext ||
      isLoadingMore
    ) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);

    try {
      const data = await apiClient.alert.getUserAlerts(user.userId, {
        limit: LIMIT,
        offset: alertsData.items.length,
      });
      setAlertsData({
        ...data,
        items: [...alertsData.items, ...data.items],
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("알림 데이터를 불러오는데 실패했습니다."));
      console.error("알림 데이터 로딩 오류:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isOpen, isLoggedIn, user?.userId, alertsData, isLoadingMore]);

  return { alertsData, isLoading, isLoadingMore, error, loadMore };
}
