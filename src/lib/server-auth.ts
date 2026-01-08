import { getUserIdFromToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function getServerAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? null;

  if (!token) return { token: null, userId: null };

  const userId = getUserIdFromToken(token);
  return { token, userId };
}
