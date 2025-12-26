import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // 주의! 미들웨어의 request.cookies는 비동기가 아님
  const token = request.cookies.get("token")?.value;
  // const userInfoCookie = request.cookies.get("userInfo")?.value;

  const { pathname } = request.nextUrl;
  const publicPage = ["/login", "/signup"];

  // 토큰이 없는데 publicPage가 아닌 곳에 접근하면 로그인 페이지로 리다이렉트
  if (!token && !publicPage.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // TODO: 라우트명 확정되면 접근 권한 처리하기 위해 주석 처리함
  // if (userInfoCookie) {
  //   // 쿠키가 JSON string이므로 파싱 필요했음
  //   const userInfo = JSON.parse(userInfoCookie);
  //   if (userInfo.type === "employer" && pathname.startsWith("/user")) {
  //     return NextResponse.redirect(new URL("/notice", request.url));
  //   } else if (userInfo.type === "employee" && pathname.startsWith("/notice")) {
  //     return NextResponse.redirect(new URL("/user", request.url));
  //   }
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
