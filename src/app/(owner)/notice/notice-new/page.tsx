"use client";

import Header from "@/components/common/layouts/header";
import NoticeRegisterForm from "@/components/domain/notice-new/notice-register-form";

export default function NoticeNewPage() {
  return (
    <div className="bg-gray-5 flex min-h-screen flex-col">
      <Header />
      <NoticeRegisterForm />
    </div>
  );
}
