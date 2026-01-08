"use client";

import Modal from "@/components/common/modal/Modal";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccessDeniedModal() {
  const searchParams = useSearchParams();
  const accessDenied = searchParams.get("accessDenied");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (accessDenied === "true") {
      // URL에서 쿼리 파라미터 제거
      const url = new URL(window.location.href);
      url.searchParams.delete("accessDenied");
      window.history.replaceState({}, "", url.toString());
      // 다음 틱에서 상태 업데이트하여 cascading render 방지
      setTimeout(() => {
        setOpen(true);
      }, 0);
    }
  }, [accessDenied]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <Modal
      variant="icon"
      open={open}
      onClose={handleClose}
      description="접근 권한이 없습니다."
      icon={
        <Image
          src="/icon/caution.svg"
          alt="주의"
          width={24}
          height={24}
        />
      }
      actions={[
        {
          label: "확인",
          onClick: handleConfirm,
          variant: "primary",
        },
      ]}
    />
  );
}
