"use client";

import { Button } from "@/components/common/button";
import { UserInfoRes } from "@/types/user";
import Image from "next/image";
import Link from "next/link";

export default function ProfileCard({ userInfo }: { userInfo: UserInfoRes }) {
  const userItem = userInfo.item ?? null;

  if (!userItem) {
    return null;
  }

  return (
    <div>
      <section className="mx-auto flex w-full flex-col justify-between md:w-170 lg:w-241 lg:flex-row">
        <h1 className="mb-6 text-2xl font-bold">내 프로필</h1>
        <div className="bg-red-10 flex w-full justify-between rounded-xl p-5 text-center md:w-[665px] md:p-8">
          <div className="flex flex-col gap-5 text-left md:gap-7">
            <div>
              <p className="mb-[8px] text-sm font-semibold text-[#EA3C12] md:text-[16px]">이름</p>
              <h3 className="mb-[8px] md:text-[26px]">{userItem.name}</h3>
              <div className="mb-[8px] flex items-center gap-1">
                <Image
                  src="/icon/phone.svg"
                  alt="핸드폰"
                  width={20}
                  height={20}
                />
                <p className="text-sm text-gray-50 md:text-[16px]"> {userItem.phone}</p>
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src="/icon/location.svg"
                  alt="근무 지역"
                  width={20}
                  height={20}
                />
                <p className="text-sm text-gray-50 md:text-[16px]">{userItem.address}</p>
              </div>
            </div>
            <p className="text-sm md:text-[16px]">{userItem.bio}</p>
          </div>
          <Link href={`/profile/my-profile/${userItem.id}`}>
            <Button
              variant="outline"
              size="lg"
              className="h-10 w-25 text-sm md:h-12 md:w-40 md:text-[16px]"
            >
              편집하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
