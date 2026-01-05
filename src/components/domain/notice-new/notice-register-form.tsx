"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

// 1. Zustand 스토어 및 타입 임포트
import { useUser } from "@/store/user";
import { UserInfoRes } from "@/types/user";

import { Button } from "@/components/common/button";
import { Field, FieldInput } from "@/components/common/input";
import Modal from "@/components/common/modal/Modal";

interface NoticeFormInputs {
  hourlyPay: string;
  startsAt: string;
  workHour: string;
  description: string;
}

export default function NoticeRegisterForm() {
  const router = useRouter();

  // 2. 스토어에서 유저 기본 정보(userId)와 로그인 상태 가져오기
  const { user, isLoggedIn } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NoticeFormInputs>({
    mode: "onBlur",
  });

  const values = watch();
  const isFormValid = values.hourlyPay && values.startsAt && values.workHour;

  const handleClose = () => {
    router.back();
  };

  const onSubmit = async (data: NoticeFormInputs) => {
    setIsLoading(true);

    try {
      // 3. 로그인 체크 (user 객체 안에 userId가 있는지 확인)
      if (!isLoggedIn || !user?.userId) {
        alert("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("인증 토큰이 없습니다. 다시 로그인해주세요.");
        router.push("/login");
        return;
      }

      // userId를 사용해 가게 ID(shopId)를 직접 조회합니다.

      // 4-1. 유저 상세 정보 조회 (GET /users/{userId})
      const userRes = await fetch(
        `https://bootcamp-api.codeit.kr/api/0-1/the-julge/users/${user.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!userRes.ok) {
        throw new Error("유저 정보를 불러오는데 실패했습니다.");
      }

      const userData: UserInfoRes = await userRes.json();

      // 4-2. 조회한 정보에서 가게 ID 추출 (UserInfoItem -> shop -> item -> id)
      // shop이 없는 경우(사장님이 아닌 경우 등)에 대한 방어 로직 포함
      const shopId = userData.item.shop?.item.id;

      if (!shopId) {
        alert("등록된 가게 정보가 없습니다. 가게를 먼저 등록해주세요.");
        return; // 가게 ID가 없으면 중단
      }
      // 5. 공고 등록 요청 (POST /shops/{shopId}/notices)
      const isoStartsAt = new Date(data.startsAt).toISOString();

      const response = await fetch(
        `https://bootcamp-api.codeit.kr/api/0-1/the-julge/shops/${shopId}/notices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hourlyPay: Number(data.hourlyPay),
            startsAt: isoStartsAt,
            workhour: Number(data.workHour),
            description: data.description,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "공고 등록에 실패했습니다.");
      }

      setIsModalOpen(true);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message || "알 수 없는 에러가 발생했습니다.");
      } else {
        alert(String(error) || "알 수 없는 에러가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    router.push("/notice/notice-detail");
  };

  return (
    <div className="flex flex-1 flex-col items-center px-5 py-[60px]">
      <div className="w-full max-w-[964px]">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black">공고 등록</h1>
          <button type="button" onClick={handleClose} aria-label="닫기">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6L18 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="flex flex-wrap gap-5">
            <Field
              label="시급"
              required
              htmlFor="hourlyPay"
              className="w-full flex-none min-[744px]:w-[308px]"
            >
              <FieldInput
                id="hourlyPay"
                type="number"
                placeholder="0"
                rightSlot="원"
                size="lg"
                className="h-[58px]"
                {...register("hourlyPay", { required: true })}
              />
            </Field>

            <Field
              label="시작 일시"
              required
              htmlFor="startsAt"
              className="w-full flex-none min-[744px]:w-[308px]"
            >
              <FieldInput
                id="startsAt"
                type="datetime-local"
                size="lg"
                className="h-[58px]"
                {...register("startsAt", { required: true })}
              />
            </Field>

            <Field
              label="업무 시간"
              required
              htmlFor="workHour"
              className="w-full flex-none min-[744px]:w-[308px]"
            >
              <FieldInput
                id="workHour"
                type="number"
                rightSlot="시간"
                size="lg"
                className="h-[58px]"
                {...register("workHour", { required: true })}
              />
            </Field>
          </div>

          <Field label="공고 설명" htmlFor="description">
            <FieldInput
              as="textarea"
              id="description"
              className="h-[153px]"
              placeholder="구체적인 업무 내용, 근무 여건, 지원 자격 등을 적어주세요."
              {...register("description")}
            />
          </Field>

          <div className="mt-2 flex justify-center">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-[312px]"
              disabled={!isFormValid || isLoading}
              loading={isLoading}
            >
              등록하기
            </Button>
          </div>
        </form>

        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          variant="basic"
          description="등록이 완료되었습니다."
          onAction={handleModalConfirm}
          actionLabel="확인"
        />
      </div>
    </div>
  );
}
