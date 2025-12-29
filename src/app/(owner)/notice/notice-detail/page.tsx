"use client";

import Table from "@/components/common/table";
import { NoticeApplicationItem } from "@/types/application";
import { useState } from "react";

// [샘플 데이터]
const MOCK_DATA: NoticeApplicationItem[] = [
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
  {
    item: {
      id: "app-7",
      status: "rejected",
      createdAt: "2023-12-04T09:00:00Z",
      user: {
        item: {
          id: "user-7",
          email: "employee-test-07@test.com",
          type: "employee",
          name: "박철수",
          phone: "010-7777-7777",
          bio: "안녕하세요! 열심히 하겠습니다.",
        },
        href: "",
      },
    },
  },
  {
    item: {
      id: "app-8",
      status: "pending",
      createdAt: "2023-12-04T15:00:00Z",
      user: {
        item: {
          id: "user-8",
          email: "employee-test-08@test.com",
          type: "employee",
          name: "정수민",
          phone: "010-8888-8888",
          bio: "시간 약속 철저히 지킵니다. 믿고 맡겨주세요.",
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
  const applications = MOCK_DATA.slice(offset, offset + ITEMS_PER_PAGE);
  const totalCount = MOCK_DATA.length;

  return (
    <div className="flex min-h-screen flex-col items-center py-10">
      <div className="w-full max-w-[964px]">
        <h1 className="mb-10 text-3xl font-bold">공고 상세 페이지</h1>

        <div className="mb-10 rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-gray-500">공고 상세 정보 영역</p>
        </div>

        <Table
          applications={applications}
          totalCount={totalCount}
          page={page}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
