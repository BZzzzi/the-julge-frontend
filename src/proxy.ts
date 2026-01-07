import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    // OPTIONS 요청 처리
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 다른 API 요청은 CORS 헤더만 추가하고 통과
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
  }
  // 주의! 미들웨어의 request.cookies는 비동기가 아님
  const token = request.cookies.get("token")?.value;
  const userInfoCookie = request.cookies.get("userInfo")?.value;
  const publicPages = ["/", "/login", "/signup", "/notice/notices-detail", "/notice/notices-list"];

  // 토큰이 없는데 publicPage가 아닌 곳에 접근하면 로그인 페이지로 리다이렉트
  if (!token) {
    const isPublic = publicPages.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    if (!isPublic) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.next();
  }

  if (!userInfoCookie) return NextResponse.redirect(new URL("/login", request.url));

  // TODO: 개발 환경에서 주석 처리
  // TODO: 바로 리다이렉트 아니고 클라이언트에서 alert 띄우도록 바꾸기
  // 쿠키가 JSON string이므로 파싱 필요했음
  // let user: { id: string; type: "employee" | "employer" };
  // try {
  //   user = JSON.parse(userInfoCookie);
  // } catch {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
  // employee 전용 페이지
  // const employeeOnlyPaths = [
  //   "/user",
  //   "/notice/notices-list",
  //   "/notice/notices-detail",
  //   "/profile/profile-detail",
  //   "/profile/profile-new",
  // ];

  // // employer 전용 페이지
  // const employerOnlyPaths = ["/notice/notice-detail", "/notice/notice-new", "/shops/"];

  // const isEmployeeOnly = employeeOnlyPaths.some((p) => pathname.startsWith(p));
  // const isEmployerOnly = employerOnlyPaths.some((p) => pathname.startsWith(p));

  // // employee가 employer 영역 접근 → 차단
  // if (user.type === "employee" && isEmployerOnly) {
  //   return NextResponse.redirect(new URL("/notice/notices-list", request.url));
  // }

  // // employer가 employee 영역 접근 → 차단
  // if (user.type === "employer" && isEmployeeOnly) {
  //   return NextResponse.redirect(new URL("/notice/notice-new", request.url));
  // }

  return NextResponse.next();
}
// 아래 경로를 제외한 모든 페이지에 미들웨어를 적용한다는 정규 표현식
// _next/static/* (Next.js 정적 파일)
// _next/image/* (Next.js 이미지 최적화)
// favicon.ico (파비콘)
// 정적 파일 확장자 (.svg, .png, .jpg 등)
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)).*)",
  ],
};
