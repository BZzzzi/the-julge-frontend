"use client";

import { Button } from "@/components/common/button";
import { Field, FieldInput, Select } from "@/components/common/input";
import Modal from "@/components/common/modal/Modal";
import { apiClient } from "@/lib/api";
import type { SeoulRegion } from "@/types/shop";
import { UserInfoRes } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface ProfileFormInputs {
  name: string;
  phone: string;
  address: string;
  bio: string;
}

export default function ProfileUpsertForm({ userInfo }: { userInfo: UserInfoRes }) {
  const router = useRouter();
  const userName = userInfo.item.name ?? null;
  const userId = userInfo.item.id ?? null;
  const isEditMode = !!userName;

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormInputs>({
    mode: "onBlur",
  });

  const values = watch();
  const isFormValid = values.name && values.phone && values.address && values.bio;

  // 편집 모드일 때 기존 프로필 데이터 가져오기
  useEffect(() => {
    if (isEditMode && userId) {
      const fetchProfile = async () => {
        try {
          setIsLoadingProfile(true);
          const userData = await apiClient.user.getUser(userId);

          reset({
            name: userData.item.name || "",
            phone: userData.item.phone || "",
            address: userData.item.address || "",
            bio: userData.item.bio || "",
          });
        } catch (error) {
          console.error("프로필 정보를 불러오는데 실패했습니다:", error);
          alert("프로필 정보를 불러오는데 실패했습니다.");
        } finally {
          setIsLoadingProfile(false);
        }
      };

      fetchProfile();
    } else {
      setIsLoadingProfile(false);
    }
  }, [isEditMode, userId, reset]);

  const handleClose = () => {
    router.back();
  };

  const onSubmit = async (data: ProfileFormInputs) => {
    if (!userId) {
      alert("사용자 ID가 없습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const requestData = {
        name: data.name,
        phone: data.phone,
        address: data.address as SeoulRegion,
        bio: data.bio || "",
      };

      await apiClient.user.updateUserInfo(userId, requestData);

      setIsModalOpen(true);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message || `${isEditMode ? "프로필 수정" : "프로필 등록"}에 실패했습니다.`);
      } else {
        alert(String(error) || `${isEditMode ? "프로필 수정" : "프로필 등록"}에 실패했습니다.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    router.push(`/profile/my-profile`);
  };

  if (isLoadingProfile) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-[60px]">
        <div className="w-full max-w-[964px]">
          <p className="text-center text-gray-500">프로필 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center px-5 py-[60px]">
      <div className="w-full max-w-[350px] md:max-w-[680px] lg:max-w-[964px]">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black">
            {isEditMode ? "내 프로필 수정" : "내 프로필 등록"}
          </h1>
          <button
            type="button"
            onClick={handleClose}
            aria-label="닫기"
          >
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-wrap gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
            <Field
              label="이름"
              required
              htmlFor="name"
              className="w-full flex-none"
            >
              <FieldInput
                id="name"
                type="text"
                placeholder="입력"
                size="lg"
                className="h-[58px]"
                {...register("name", { required: true })}
              />
            </Field>

            <Field
              label="연락처"
              required
              htmlFor="phone"
              className="w-full flex-none"
            >
              <FieldInput
                id="phone"
                type="tel"
                size="lg"
                placeholder="000-0000-0000"
                className="h-[58px]"
                {...register("phone", { required: true })}
              />
            </Field>

            <Field
              label="주소"
              required
              htmlFor="address"
              errorMessage={errors.address?.message}
            >
              <Select
                className="h-[58px] overflow-y-auto"
                placeholder="선택"
                options={[
                  { label: "서울시 종로구", value: "서울시 종로구" },
                  { label: "서울시 중구", value: "서울시 중구" },
                  { label: "서울시 용산구", value: "서울시 용산구" },
                  { label: "서울시 성동구", value: "서울시 성동구" },
                  { label: "서울시 광진구", value: "서울시 광진구" },
                  { label: "서울시 동대문구", value: "서울시 동대문구" },
                  { label: "서울시 중랑구", value: "서울시 중랑구" },
                  { label: "서울시 성북구", value: "서울시 성북구" },
                  { label: "서울시 강북구", value: "서울시 강북구" },
                  { label: "서울시 도봉구", value: "서울시 도봉구" },
                  { label: "서울시 노원구", value: "서울시 노원구" },
                  { label: "서울시 은평구", value: "서울시 은평구" },
                  { label: "서울시 서대문구", value: "서울시 서대문구" },
                  { label: "서울시 마포구", value: "서울시 마포구" },
                  { label: "서울시 양천구", value: "서울시 양천구" },
                  { label: "서울시 강서구", value: "서울시 강서구" },
                  { label: "서울시 구로구", value: "서울시 구로구" },
                  { label: "서울시 금천구", value: "서울시 금천구" },
                  { label: "서울시 영등포구", value: "서울시 영등포구" },
                  { label: "서울시 동작구", value: "서울시 동작구" },
                  { label: "서울시 관악구", value: "서울시 관악구" },
                  { label: "서울시 서초구", value: "서울시 서초구" },
                  { label: "서울시 강남구", value: "서울시 강남구" },
                  { label: "서울시 송파구", value: "서울시 송파구" },
                  { label: "서울시 강동구", value: "서울시 강동구" },
                ]}
                value={values.address}
                onValueChange={(v) => setValue("address", v as SeoulRegion)}
                error={!!errors.address}
              />
            </Field>
          </div>

          <Field
            label="소개"
            htmlFor="bio"
          >
            <FieldInput
              as="textarea"
              id="bio"
              className="h-[153px]"
              placeholder="본인을 상세하게 소개해 주세요."
              {...register("bio")}
            />
          </Field>

          <div className="mt-2 flex justify-center">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-[312px]"
              disabled={!isFormValid || isLoading || isLoadingProfile}
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
