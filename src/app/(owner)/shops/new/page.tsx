"use client";

import { Button } from "@/components/common/button";
import { Field, FieldInput, Select } from "@/components/common/input";
import Header from "@/components/common/layouts/header";
import Modal from "@/components/common/modal/Modal";
import { apiClient } from "@/lib/api";
import type { SeoulRegion, ShopCategory } from "@/types/shop";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type FormState = {
  name: string;
  category: ShopCategory | "";
  address1: SeoulRegion | "";
  address2: string;
  description: string;
  originalHourlyPay: string;
};

type FormErrors = Partial<Record<keyof FormState | "imageUrl", string>>;

export default function ShopRegisterPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    address1: "",
    address2: "",
    category: "",
    description: "",
    originalHourlyPay: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAction, setErrorAction] = useState<"goMyShop" | "close">("close");

  const setValue = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onPickImage = () => fileRef.current?.click();

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1) 로컬 미리보기
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setErrors((prev) => ({ ...prev, imageUrl: undefined }));

    try {
      setUploading(true);

      // 2) presigned URL 생성
      const { item } = await apiClient.images.createImg({ name: file.name });
      const presignedUrl = item.url;

      // 3) S3로 PUT 업로드
      const putRes = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });

      if (!putRes.ok) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }

      // 4) 쿼리스트링 제거한 URL을 imageUrl로 저장
      const finalUrl = presignedUrl.split("?")[0];
      setImageUrl(finalUrl);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "이미지 업로드 오류";

      setErrorMessage(msg);
      setErrorAction("close");
      setErrorOpen(true);

      setPreviewUrl("");
      setImageUrl("");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};

    if (!form.name.trim()) next.name = "가게 이름을 입력해 주세요.";
    if (!form.address1.trim()) next.address1 = "주소를 선택해 주세요.";
    if (!form.address2.trim()) next.address2 = "상세 주소를 입력해 주세요.";
    if (!form.category.trim()) next.category = "분류를 선택해 주세요.";
    if (!form.description.trim()) next.description = "가게 설명을 입력해 주세요.";

    const pay = Number(form.originalHourlyPay);
    if (!form.originalHourlyPay.trim()) next.originalHourlyPay = "기존 시급을 입력해 주세요.";
    else if (Number.isNaN(pay) || pay <= 0) next.originalHourlyPay = "올바른 금액을 입력해 주세요.";

    if (!imageUrl) next.imageUrl = "이미지를 추가해 주세요.";
    return next;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);

      const payload = {
        name: form.name.trim(),
        category: form.category as ShopCategory,
        address1: form.address1 as SeoulRegion,
        address2: form.address2.trim(),
        description: form.description.trim(),
        imageUrl,
        originalHourlyPay: Number(form.originalHourlyPay),
      };

      await apiClient.shops.createShop(payload);

      setSuccessOpen(true);
    } catch (err) {
      console.error(err);

      const message = err instanceof Error ? err.message : "가게 등록 실패";
      setErrorMessage(message);

      if (message.includes("이미 등록한 가게가 있습니다")) {
        setErrorAction("goMyShop");
      } else {
        setErrorAction("close");
      }

      setErrorOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const onConfirmSuccess = () => {
    setSuccessOpen(false);
    router.push("/shops/my-shop");
  };

  return (
    <>
      <Header />
      <main className="bg-gray-5 min-h-screen py-10">
        <section>
          <div className="mx-auto px-4 md:px-6 lg:px-0">
            <div className="mx-auto w-87.75 md:w-170 lg:w-241">
              <header className="mb-4 flex items-center justify-between">
                <h1 className="text-gray-90 text-[24px] font-extrabold">가게 정보</h1>
                <button
                  type="button"
                  aria-label="닫기"
                  className="text-gray-90 rounded-md p-2 hover:bg-black/5"
                  onClick={() => router.push("/shops/my-shop")}
                >
                  ✕
                </button>
              </header>

              {/* 폼 */}
              <form
                className="flex flex-col gap-8"
                onSubmit={onSubmit}
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-6">
                    <Field
                      label="가게 이름"
                      required
                      htmlFor="name"
                    >
                      <FieldInput
                        id="name"
                        placeholder="입력"
                        value={form.name}
                        onChange={(e) => setValue("name", e.target.value)}
                        error={!!errors.name}
                      />
                    </Field>

                    <Field
                      label="주소"
                      required
                      htmlFor="address1"
                      errorMessage={errors.address1}
                    >
                      <Select
                        className="max-h-60 overflow-y-auto"
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
                        value={form.address1}
                        onValueChange={(v) => setValue("address1", v as SeoulRegion)}
                        error={!!errors.address1}
                      />
                    </Field>

                    <Field
                      label="기본 시급"
                      required
                      htmlFor="originalHourlyPay"
                      errorMessage={errors.originalHourlyPay}
                    >
                      <FieldInput
                        id="originalHourlyPay"
                        placeholder="입력"
                        rightSlot="원"
                        value={form.originalHourlyPay}
                        onChange={(e) => setValue("originalHourlyPay", e.target.value)}
                        error={!!errors.originalHourlyPay}
                      />
                    </Field>

                    {/* 이미지 */}
                    <Field
                      label="이미지"
                      errorMessage={errors.imageUrl}
                    >
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onChangeFile}
                      />

                      <button
                        type="button"
                        onClick={onPickImage}
                        className={[
                          "relative flex h-60 w-full flex-col items-center justify-center gap-3 rounded-xl",
                          "bg-gray-10 border border-dashed border-black/20",
                          errors.imageUrl ? "ring-2 ring-red-200" : "",
                        ].join(" ")}
                        disabled={uploading}
                      >
                        {previewUrl ? (
                          <Image
                            src={previewUrl}
                            alt="미리보기"
                            fill
                            className="rounded-xl object-cover"
                          />
                        ) : (
                          <>
                            <Image
                              src="/icon/cameraicon.svg"
                              alt="이미지 추가"
                              width={28}
                              height={28}
                            />
                            <p className="text-[14px] text-gray-50">
                              {uploading ? "업로드 중..." : "이미지 추가하기"}
                            </p>
                          </>
                        )}
                      </button>
                    </Field>
                  </div>

                  {/* 오른쪽 */}
                  <div className="flex flex-col gap-6">
                    <Field
                      label="분류"
                      required
                      htmlFor="category"
                      errorMessage={errors.category}
                    >
                      <Select
                        placeholder="선택"
                        options={[
                          { label: "한식", value: "한식" },
                          { label: "중식", value: "중식" },
                          { label: "일식", value: "일식" },
                          { label: "양식", value: "양식" },
                          { label: "분식", value: "분식" },
                          { label: "카페", value: "카페" },
                          { label: "편의점", value: "편의점" },
                          { label: "기타", value: "기타" },
                        ]}
                        value={form.category}
                        onValueChange={(v) => setValue("category", v as ShopCategory)}
                        error={!!errors.category}
                      />
                    </Field>

                    <Field
                      label="상세 주소"
                      required
                      htmlFor="address2"
                      errorMessage={errors.address2}
                    >
                      <FieldInput
                        id="address2"
                        placeholder="입력"
                        value={form.address2}
                        onChange={(e) => setValue("address2", e.target.value)}
                        error={!!errors.address2}
                      />
                    </Field>
                  </div>
                </div>

                {/* 가게 설명 */}
                <Field
                  label="가게 설명"
                  htmlFor="description"
                  errorMessage={errors.description}
                >
                  <FieldInput
                    as="textarea"
                    rows={6}
                    placeholder="입력"
                    value={form.description}
                    onChange={(e) => setValue("description", e.target.value)}
                    error={!!errors.description}
                  />
                </Field>

                {/* 버튼 */}
                <div className="flex justify-center pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-75"
                    disabled={uploading || submitting}
                  >
                    {submitting ? "등록 중..." : uploading ? "업로드 중..." : "등록하기"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <Modal
          variant="basic"
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          description={"가게 등록이 완료되었습니다."}
          actionLabel="확인"
          onAction={onConfirmSuccess}
        />

        <Modal
          variant="basic"
          open={errorOpen}
          onClose={() => setErrorOpen(false)}
          description={errorMessage}
          actionLabel={errorAction === "goMyShop" ? "이동" : "확인"}
          onAction={() => {
            setErrorOpen(false);
            if (errorAction === "goMyShop") {
              router.push("/shops/my-shop");
            }
          }}
        />
      </main>
    </>
  );
}
