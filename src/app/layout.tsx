import StoreInitializer from "@/components/domain/auth/store-initializer";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";

const spoqaHanSans = localFont({
  src: [
    { path: "../fonts/SpoqaHanSansNeo-Thin.woff2", weight: "100" },
    { path: "../fonts/SpoqaHanSansNeo-Light.woff2", weight: "300" },
    { path: "../fonts/SpoqaHanSansNeo-Regular.woff2", weight: "400" },
    { path: "../fonts/SpoqaHanSansNeo-Medium.woff2", weight: "500" },
    { path: "../fonts/SpoqaHanSansNeo-Bold.woff2", weight: "700" },
  ],
  variable: "--font-spoqa",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Julge",
  description: "The Julge app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const userInfoCookie = cookieStore.get("userInfo")?.value;

  let userInfo = null;

  try {
    userInfo = userInfoCookie ? JSON.parse(userInfoCookie) : null;
  } catch {
    userInfo = null;
  }

  return (
    <html
      lang="ko"
      className={`${spoqaHanSans.variable}`}
    >
      <StoreInitializer userInfo={userInfo} />
      <body className="antialiased">{children}</body>
    </html>
  );
}
