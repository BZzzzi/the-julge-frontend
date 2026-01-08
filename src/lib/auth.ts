type JwtPayload = {
  userId?: string;
  id?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
};

/**
 * JWT payload에서 userId 추출 (verify는 안 하고 payload만 디코드)
 * - 보통 payload에 userId가 오지만, 혹시 id/sub로 오면 fallback 처리
 */
export function getUserIdFromToken(token: string): string | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    // base64url -> base64
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf8");
    const payload = JSON.parse(json) as JwtPayload;

    const userId =
      (typeof payload.userId === "string" && payload.userId) ||
      (typeof payload.id === "string" && payload.id) ||
      (typeof payload.sub === "string" && payload.sub) ||
      null;

    return userId;
  } catch {
    return null;
  }
}

export function getUserIdFromUserInfoCookie(cookieValue?: string): string | null {
  if (!cookieValue) return null;

  try {
    const decoded = decodeURIComponent(cookieValue);
    const parsed = JSON.parse(decoded) as { id?: string | number };

    if (parsed?.id === undefined || parsed?.id === null) return null;
    return String(parsed.id);
  } catch {
    return null;
  }
}
