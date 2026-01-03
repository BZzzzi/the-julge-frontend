"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  prevState: { error: string } | null | void,
  formData: FormData,
): Promise<{ error: string } | null> {
  const email = formData.get("email");
  const password = formData.get("password");

  const res = await fetch(`${process.env.BASE_URL}/token`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) return { error: data.message };

  const resolvedCookie = await cookies();
  const userInfo = { id: data.item.user.item.id, type: data.item.user.item.type };

  // 토큰 정보 쿠키
  resolvedCookie.set("token", data.item.token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  // 유저 정보 쿠키
  resolvedCookie.set("userInfo", JSON.stringify(userInfo), {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  // TODO: 로그인 후, 페이지 이동
  redirect("/notice/notices-list");
}
