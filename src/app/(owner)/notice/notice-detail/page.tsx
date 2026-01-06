"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/common/button";
import Footer from "@/components/common/layouts/footer";
import Header from "@/components/common/layouts/header";
import ShopInfoCard from "@/components/common/shop-info/ShopInfoCard";
import Table from "@/components/common/table";

import { NoticeApplicationItem } from "@/types/application";

// [샘플 데이터]
const MOCK_APPLICANTS: NoticeApplicationItem[] = [
  {
    item: {
      id: "app-1",
      status: "pending",
      createdAt: "2023-12-01T10:00:00Z",
      user: {
        item: {
          id: "user-1",
          email: "employee-test-01@test.com",
          type: "employee",
          name: "김강현",
          phone: "010-1111-1111",
          bio: "최선을 다해 열심히 일합니다. 다수의 업무 경험을 바탕으로 확실한 일처리 보여드립니다!",
        },
        href: "",
      },
    },
  },
  {
    item: {
      id: "app-2",
      status: "pending",
      createdAt: "2023-12-01T11:00:00Z",
      user: {
        item: {
          id: "user-2",
          email: "employee-test-02@test.com",
          type: "employee",
          name: "서혜진",
          phone: "010-2222-2222",
          bio: "열심히 하겠습니다! 잘 부탁드려요.",
        },
        href: "",
      },
    },
  },
  {
    item: {
      id: "app-3",
      status: "accepted",
      createdAt: "2023-12-02T09:00:00Z",
      user: {
        item: {
          id: "user-3",
          email: "employee-test-03@test.com",
          type: "employee",
          name: "주진혁",
          phone: "010-3333-3333",
          bio: "성실한 자세로 열심히 일합니다. 한번 경험해 보고 싶어요~",
        },
        href: "",
      },
    },
  },
  {
    item: {
      id: "app-4",
      status: "accepted",
      createdAt: "2023-12-02T14:00:00Z",
      user: {
        item: {
          id: "user-4",
          email: "employee-test-04@test.com",
          type: "employee",
          name: "장민혁",
          phone: "010-4444-4444",
          bio: "일을 꼼꼼하게 하는 성격입니다. 도토리 식당에서 일해보고 싶습니다.",
        },
        href: "",
      },
    },
  },
  {
    item: {
      id: "app-5",
      status: "accepted",
      createdAt: "2023-12-03T10:00:00Z",
      user: {
        item: {
          id: "user-5",
          email: "employee-test-05@test.com",
          type: "employee",
          name: "고기훈",
          phone: "010-5555-5555",
          bio: "하루라도 최선을 다해서 일하겠습니다! 감사합니다.",
        },
        href: "",
      },
    },
  },
  {
    item: {
      id: "app-6",
      status: "rejected",
      createdAt: "2023-12-03T12:00:00Z",
      user: {
        item: {
          id: "user-6",
          email: "employee-test-06@test.com",
          type: "employee",
          name: "이영희",
          phone: "010-6666-6666",
          bio: "성실함이 무기입니다. 연락 기다리겠습니다.",
        },
        href: "",
      },
    },
  },
];

const ITEMS_PER_PAGE = 5;

export default function NoticeDetailPage() {
  const [page, setPage] = useState(1);

  const offset = (page - 1) * ITEMS_PER_PAGE;
  const applications = MOCK_APPLICANTS.slice(offset, offset + ITEMS_PER_PAGE);
  const totalCount = MOCK_APPLICANTS.length;

  return (
    <div className="bg-gray-5 flex min-h-screen flex-col">
      <Header />
      <div className="flex w-full flex-1 flex-col items-center py-10 md:py-[60px]">
        <main className="flex w-full max-w-[964px] flex-col gap-8 px-4 md:gap-12">
          {/* 상단: 가게 이름 및 공고 정보 */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="mb-2 block text-lg font-bold text-orange-600">식당</span>
              <h1 className="text-3xl font-bold text-black">도토리 식당</h1>
            </div>

            <ShopInfoCard
              variant="notice"
              imageUrl="https://plus.unsplash.com/premium_photo-1663852297267-827c73e7529e?q=80&w=2940&auto=format&fit=crop"
              wageText="15,000원"
              wageBadge={{
                text: "기존 시급보다 50% ↑",
                icon: (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="ml-1"
                  >
                    <path
                      d="M6 2L6 10M6 2L2 6M6 2L10 6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              }}
              scheduleText="2023-01-02 15:00~18:00 (3시간)"
              address="서울시 송파구"
              description={`알바하기 편한 너구리네 라면집!
              라면 올려두고 끓이기만 하면 되어서 쉬운 편에 속하는 가게입니다.`}
              detail={{
                content: `기존 알바 친구가 그만둬서 새로운 친구를 구했는데, 그 사이에 하루가 비네요.
                급해서 시급도 높였고 그렇게 바쁜 날이 아니라서 괜찮을거예요.`,
              }}
              footer={
                <Link
                  href="/notice/notice-edit"
                  passHref
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full bg-white"
                  >
                    공고 편집하기
                  </Button>
                </Link>
              }
            />
          </div>
          <div className="flex flex-col gap-6">
            <Table
              applications={applications}
              totalCount={totalCount}
              page={page}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setPage}
            />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
