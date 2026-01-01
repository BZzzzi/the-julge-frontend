"use client";

import { Button } from "@/components/common/button";
import {
  Field,
  FieldInput,
  Select,
} from "@/components/common/input";
import Image from "next/image";

export default function ShopRegisterPage() {
  return (
    <main className="min-h-screen bg-gray-5 py-10">
      <section>
        <div className="mx-auto w-full max-w-241 rounded-2xl p-8">
          {/* 헤더 */}
          <header className="mb-4 flex items-center justify-between">
            <h1 className="text-[24px] font-extrabold text-gray-90">
              가게 정보
            </h1>
            <button
              type="button"
              aria-label="닫기"
              className="rounded-md p-2 text-gray-90 hover:bg-black/5"
            >
              ✕
            </button>
          </header>

          {/* 폼 */}
          <form className="flex flex-col gap-8">
            {/* 상단 2열 */}
            <div className="grid gird-cols-1 md:grid-cols-2 gap-6">
              {/* 왼쪽 */}
              <div className="flex flex-col gap-6" >
                <Field label="가게 이름" required htmlFor="name">
                  <FieldInput id="name" placeholder="입력" />
                </Field>

                <Field label="주소" required htmlFor="address1">
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
                    defaultValue=""
                  />
                </Field>

                <Field label="기본 시급" required htmlFor="originalHourlyPay">
                  <FieldInput id="originalHourlyPay" placeholder="입력" rightSlot="원"/>
                </Field>

                {/* 이미지 */}
                <Field label="이미지">
                  <div className="flex h-60 md:min-w-105 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-black/20 bg-gray-10">
                    <Image
                      src="/icon/camera.svg"
                      alt="이미지 추가"
                      width={28}
                      height={28}
                    />
                    <p className="text-[14px] text-gray-50">
                      이미지 추가하기
                    </p>
                  </div>
                </Field>
              </div>

              {/* 오른쪽 */}
              <div className="flex flex-col gap-6">
                <Field label="분류" required htmlFor="category">
                  <Select
                    placeholder="선택"
                    options={[
                      { label: "한식", value: "KOREAN" },
                      { label: "중식", value: "CHINESE" },
                      { label: "일식", value: "JAPANESE" },
                      { label: "양식", value: "WESTERN" },
                      { label: "분식", value: "FLOURBASED" },
                      { label: "카페", value: "CAFE" },
                      { label: "편의점", value: "CONVENIENCE" },
                      { label: "기타", value: "ETC" },
                    ]}
                    defaultValue=""
                  />
                </Field>

                <Field label="상세 주소" required htmlFor="address2">
                  <FieldInput id="address2" placeholder="입력" />
                </Field>
              </div>
            </div>

            {/* 가게 설명 */}
            <Field label="가게 설명" htmlFor="description">
              <FieldInput
                as="textarea"
                rows={6}
                placeholder="입력"
              />
            </Field>

            {/* 버튼 */}
            <div className="flex justify-center pt-2">
              <Button size="lg" className="w-75">
                등록하기
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
