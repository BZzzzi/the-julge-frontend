"use server";

import { apiClient } from "@/lib/api";

export async function signup(
  prevState: { error: string } | { success: boolean } | null | void,
  formData: FormData,
): Promise<{ error: string } | { success: boolean } | null> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const type = formData.get("type") as "employer" | "employee";

  try {
    await apiClient.user.createUser({
      email,
      password,
      type,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "회원가입에 실패했습니다." };
  }
}
