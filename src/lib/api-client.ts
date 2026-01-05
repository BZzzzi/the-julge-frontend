/**
 *
 * 서버 컴포넌트 API 요청은 외부 API로 바로 요청
 * 클라이언트 컴포넌틑 API 요청은 Next.js 프록시 서버로 보냄(BFF 패턴)
 *
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface Option<TParams = Record<string, unknown>> extends Omit<RequestInit, "method"> {
  method?: HttpMethod;
  params?: TParams;
}

export async function fetcher<TParams = Record<string, unknown>>(
  endpoint: string,
  options: Option<TParams> = {},
) {
  const isServer = typeof window === "undefined";

  // URL 설정
  const url = isServer ? `${process.env.BASE_URL}${endpoint}` : `/api${endpoint}`;

  // 기본 헤더 설정
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as HeadersInit),
  };

  //객체를 쿼리 스트링으로 변환하는 헬퍼 함수
  // 있으면 쿼리 스트링을 붙인다.
  let queryString = "";
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params as Record<string, unknown>).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    queryString = "?" + searchParams.toString();
  }

  // 토큰 추출 및 Authorization 헤더 추가
  // 있으면 넣어서 보내고 없으면 그냥 기본 헤더를 보낸다.
  if (isServer) {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;

      if (token) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      console.warn("[API Client] 서버 환경에서 쿠키에 접근할 수 없습니다.");
    }
  }

  // API 요청
  const response = await fetch(url + queryString, {
    ...options,
    headers,
  });

  // 에러 처리
  if (!response.ok) {
    let errorMessage = "API 요청 중 오류가 발생했습니다.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      console.warn("[API Client] 응답 JSON 파싱 실패:");
    }

    console.error(`[API ERROR] ${response.status} ${url}:`, errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
}
