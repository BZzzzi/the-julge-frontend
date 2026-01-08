"use client";

import { Button } from "@/components/common/button";
import { Field, FieldInput } from "@/components/common/input";
import Modal from "@/components/common/modal/Modal";
import { apiClient } from "@/lib/api";
import { NoticeItem } from "@/types/notice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface NoticeFormInputs {
  hourlyPay: string;
  startsAt: string;
  workHour: string;
  description: string;
}

interface NoticeUpsertFormProps {
  shopId: string;
  noticeId?: string;
}

export default function NoticeUpsertForm({ shopId, noticeId }: NoticeUpsertFormProps) {
  const router = useRouter();
  const isEditMode = !!noticeId;

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingNotice, setIsLoadingNotice] = useState(isEditMode);

  const { register, handleSubmit, watch, reset } = useForm<NoticeFormInputs>({
    mode: "onBlur",
  });

  const values = watch();
  const isFormValid = values.hourlyPay && values.startsAt && values.workHour;

  // 편집 모드일 때 기존 공고 데이터 가져오기
  useEffect(() => {
    if (isEditMode && noticeId) {
      const fetchNotice = async () => {
        try {
          setIsLoadingNotice(true);
          const noticeData: NoticeItem = await apiClient.notices.getShopOnlyNotice(
            shopId,
            noticeId,
          );
          const notice = noticeData.item;
          const startsAtDate = new Date(notice.startsAt);
          const year = startsAtDate.getFullYear();
          const month = String(startsAtDate.getMonth() + 1).padStart(2, "0");
          const day = String(startsAtDate.getDate()).padStart(2, "0");
          const hours = String(startsAtDate.getHours()).padStart(2, "0");
          const minutes = String(startsAtDate.getMinutes()).padStart(2, "0");
          const formattedStartsAt = `${year}-${month}-${day}T${hours}:${minutes}`;

          reset({
            hourlyPay: String(notice.hourlyPay),
            startsAt: formattedStartsAt,
            workHour: String(notice.workhour),
            description: notice.description || "",
          });
        } catch (error) {
          console.error("공고 정보를 불러오는데 실패했습니다:", error);
          alert("공고 정보를 불러오는데 실패했습니다.");
        } finally {
          setIsLoadingNotice(false);
        }
      };

      fetchNotice();
    }
  }, [isEditMode, noticeId, shopId, reset]);

  const handleClose = () => {
    router.back();
  };

  const onSubmit = async (data: NoticeFormInputs) => {
    setIsLoading(true);

    try {
      const isoStartsAt = new Date(data.startsAt).toISOString();
      const requestData = {
        hourlyPay: Number(data.hourlyPay),
        startsAt: isoStartsAt,
        workhour: Number(data.workHour),
        description: data.description || "",
      };

      if (isEditMode && noticeId) {
        await apiClient.notices.updateShopOnlyNotice(shopId, noticeId, requestData);
      } else {
        await apiClient.notices.createShopNotice(shopId, requestData);
      }

      setIsModalOpen(true);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message || `${isEditMode ? "공고 수정" : "공고 등록"}에 실패했습니다.`);
      } else {
        alert(String(error) || `${isEditMode ? "공고 수정" : "공고 등록"}에 실패했습니다.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    if (isEditMode && noticeId) {
      router.push(`/notice/notice-detail/${shopId}/${noticeId}`);
    } else {
      router.push("/shops/my-shop");
    }
  };

  if (isLoadingNotice) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-[60px]">
        <div className="w-full max-w-[964px]">
          <p className="text-center text-gray-500">공고 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-5 flex flex-1 flex-col items-center px-5 py-[60px]">
      <div className="w-full max-w-[350px] md:max-w-[680px] lg:max-w-[964px]">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="mb-0 text-2xl font-bold text-black md:text-3xl">
            {isEditMode ? "공고 편집" : "공고 등록"}
          </h1>
          <button
            type="button"
            onClick={handleClose}
            aria-label="닫기"
            className="cursor-pointer"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6L18 18" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-wrap gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
            <Field
              label="시급"
              required
              htmlFor="hourlyPay"
              className="w-full flex-none"
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
              className="w-full flex-none"
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
              className="w-full flex-none"
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

          <Field
            label="공고 설명"
            htmlFor="description"
          >
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
              className="w-full md:w-[312px]"
              disabled={!isFormValid || isLoading || isLoadingNotice}
              loading={isLoading}
            >
              {isEditMode ? "수정하기" : "등록하기"}
            </Button>
          </div>
        </form>

        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          variant="basic"
          description={isEditMode ? "수정이 완료되었습니다." : "등록이 완료되었습니다."}
          onAction={handleModalConfirm}
          actionLabel="확인"
        />
      </div>
    </div>
  );
}
