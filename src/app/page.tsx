import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const userInfoCookie = cookieStore.get("userInfo")?.value;

  if (!userInfoCookie) {
    redirect("/login");
  }

  const userInfo = JSON.parse(userInfoCookie);

  if (!userInfo || !userInfo.type) {
    redirect("/login");
  }
  if (userInfo.type === "employee") {
    redirect("/notice/notices-list");
  } else if (userInfo.type === "employer") {
    redirect("/shops/my-shop");
  } else {
    redirect("/login");
  }
}
