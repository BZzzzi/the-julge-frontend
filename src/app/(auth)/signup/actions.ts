"use server";

import { apiClient } from "@/lib/api";
import { redirect } from "next/navigation";

export async function signup(
  prevState: { error: string } | null | void,
  formData: FormData,
): Promise<{ error: string } | null> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const type = formData.get("type") as "employer" | "employee";

  try {
    await apiClient.user.createUser({
      email,
      password,
      type,
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "회원가입에 실패했습니다." };
  }
  redirect("/login");
}
