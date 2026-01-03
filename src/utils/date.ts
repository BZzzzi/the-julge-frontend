/**
 * 날짜 및 시간 포맷팅 유틸리티
 */

/**
 * 공고 시간 범위 포맷팅
 * @param startsAt 시작 시간 (ISO 문자열)
 * @param workhour 근무 시간 (시간 단위)
 * @returns 포맷팅된 시간 범위 문자열 (예: "2023-01-14 15:00~18:00")
 */
export function formatNoticeTimeRange(startsAt: string, workhour: number): string {
  const startTime = new Date(startsAt);
  const endTime = new Date(startTime.getTime() + workhour * 60 * 60 * 1000);

  const dateStr = startTime.toISOString().split("T")[0];
  const startHour = String(startTime.getHours()).padStart(2, "0");
  const startMin = String(startTime.getMinutes()).padStart(2, "0");
  const endHour = String(endTime.getHours()).padStart(2, "0");
  const endMin = String(endTime.getMinutes()).padStart(2, "0");

  return `${dateStr} ${startHour}:${startMin}~${endHour}:${endMin}`;
}

/**
 * 상대 시간 포맷팅
 * @param date 날짜 (ISO 문자열 또는 Date 객체)
 * @returns 포맷팅된 상대 시간 문자열 (예: "1분 전", "2시간 전", "3일 전")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "방금 전";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}년 전`;
}
