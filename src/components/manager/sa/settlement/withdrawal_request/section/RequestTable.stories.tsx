/**
 * RequestTable 컴포넌트 스토리북
 *
 * 출금 요청 테이블 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import RequestTable from "./RequestTable";
import type { WithdrawalRequestItem } from "@/data/manager_sa/settlement/withdrawalRequestData";

// Mock 출금 요청 데이터
const mockWithdrawalRequests: WithdrawalRequestItem[] = [
  {
    id: "1",
    number: "1",
    round: "-",
    name: "홍길동",
    account: "국민은행 123-456-789012 예금주명",
    ssn: "123456-1******",
    amount: "1,000,000",
    remaining: "500,000",
    requestDate: "2024-01-15 10:30",
    type: "모범 회원",
    status: "정상",
    isSelected: false,
  },
  {
    id: "2",
    number: "2",
    round: "2024-01",
    name: "김철수",
    account: "신한은행 987-654-321098 예금주명",
    ssn: "234567-2******",
    amount: "2,500,000",
    remaining: "1,000,000",
    requestDate: "2024-01-14 14:20",
    type: "일반 회원",
    status: "정상",
    isSelected: false,
  },
  {
    id: "3",
    number: "3",
    round: "2024-01",
    name: "이영희",
    account: "우리은행 555-666-777888 예금주명",
    ssn: "345678-3******",
    amount: "3,000,000",
    remaining: "0",
    requestDate: "2024-01-13 09:15",
    type: "이용 제한 회원",
    status: "정상",
    isSelected: true,
  },
];

const meta: Meta<typeof RequestTable> = {
  title: "Manager/SA/Settlement/WithdrawalRequest/Section/RequestTable",
  component: RequestTable,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
    },
  },
  argTypes: {
    title: {
      description: "섹션 제목",
      control: "text",
    },
    data: {
      description: "표시할 출금 요청 목록",
      control: "object",
    },
    show_total: {
      description: "합계 행 표시 여부",
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof RequestTable>;

/**
 * 기본 테이블
 *
 * 출금 요청 목록을 테이블 형태로 표시합니다.
 */
export const Default: Story = {
  args: {
    title: "이번 회차 정산",
    data: mockWithdrawalRequests,
    show_total: true,
  },
};

/**
 * 긴급 요청 테이블
 *
 * 긴급 출금 요청을 표시하는 테이블입니다.
 */
export const UrgentRequests: Story = {
  args: {
    title: "긴급",
    data: [
      {
        ...mockWithdrawalRequests[0],
        round: "-",
      },
    ],
    show_total: true,
  },
};

/**
 * 합계 없는 테이블
 *
 * 합계 행이 없는 테이블입니다.
 */
export const WithoutTotal: Story = {
  args: {
    title: "이번 회차 정산",
    data: mockWithdrawalRequests,
    show_total: false,
  },
};
