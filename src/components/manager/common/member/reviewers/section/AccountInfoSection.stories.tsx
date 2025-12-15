/**
 * AccountInfoSection 컴포넌트 스토리북
 *
 * 계좌 정보 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import AccountInfoSection from "./AccountInfoSection";
import type { AccountInfo } from "@/data/manager_ga/member/reviewers";

// Mock 계좌 정보 데이터
const mockAccountInfo: AccountInfo = {
  account_holder: "홍길동",
  bank: "국민은행",
  account_number: "123-456-789012",
  resident_number: "123456-1******",
};

const meta: Meta<typeof AccountInfoSection> = {
  title: "Manager/Common/Member/Reviewers/Section/AccountInfoSection",
  component: AccountInfoSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    account_info: {
      description: "계좌 정보 객체",
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof AccountInfoSection>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderAccountInfoSection = (args: any) => {
  return <AccountInfoSection {...args} />;
};

/**
 * 기본 계좌 정보 섹션
 *
 * 리뷰어의 계좌 정보를 표시하는 섹션입니다.
 */
export const Default: Story = {
  render: renderAccountInfoSection,
  args: {
    account_info: mockAccountInfo,
  },
};

/**
 * 학습 포인트:
 *
 * 1. 계좌 정보 섹션 컴포넌트
 *    - GA/SA 관리자 리뷰어 상세 페이지에서 계좌 정보를 표시하는 섹션입니다
 *    - 예금주, 은행, 계좌번호, 주민등록번호 정보를 보여줍니다
 *
 * 2. InfoCard 컴포넌트 사용
 *    - 공통 InfoCard 컴포넌트를 사용하여 각 정보를 표시합니다
 *    - label과 value를 props로 전달합니다
 *
 * 3. Section 컴포넌트 사용
 *    - 공통 Section 컴포넌트를 사용하여 섹션 제목을 표시합니다
 *    - "계좌 정보"라는 제목을 가집니다
 */




