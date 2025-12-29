import { NextRequest, NextResponse } from "next/server";

/**
 *
 * 클라이언트 컴포넌트 API 요청을 위한 프록시 서버
 *
 */
export async function proxyHandler(req: NextRequest) {
  const { pathname, search } = new URL(req.url);
  const targetPath = pathname.replace("/api", "");
  const EXTERNAL_API_URL = process.env.BASE_URL;

  if (!EXTERNAL_API_URL) {
    return NextResponse.json({ message: "BASE_URL이 설정되지 않았습니다." }, { status: 500 });
  }

  // 기본 헤더 설정
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // 토큰 추출 및 Authorization 헤더 추가
  // 있으면 넣어서 보내고 없으면 그냥 기본 헤더를 보낸다.
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch {
    console.warn("[Proxy] 서버 환경에서 쿠키에 접근할 수 없습니다.");
  }

  // 외부 API로 요청 전달
  try {
    const response = await fetch(`${EXTERNAL_API_URL}${targetPath}${search}`, {
      method: req.method,
      headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Proxy] 외부 API 요청 실패:", error);
    return NextResponse.json({ message: "외부 API 요청 중 오류가 발생했습니다." }, { status: 500 });
  }
}

export {
  proxyHandler as DELETE,
  proxyHandler as GET,
  proxyHandler as PATCH,
  proxyHandler as POST,
  proxyHandler as PUT,
};
