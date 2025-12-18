/**
 * ContactPersonSection 컴포넌트 스토리북
 *
 * 담당자 정보 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import ContactPersonSection from "./ContactPersonSection";

const meta: Meta<typeof ContactPersonSection> = {
  title: "Manager/Common/Member/Partners/Section/ContactPersonSection",
  component: ContactPersonSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    contact_phone: {
      description: "문의 담당자 휴대폰 번호",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ContactPersonSection>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderContactPersonSection = (args: any) => {
  return <ContactPersonSection {...args} />;
};

/**
 * 기본 담당자 정보 섹션
 *
 * 파트너의 담당자 정보를 표시하는 섹션입니다.
 */
export const Default: Story = {
  render: renderContactPersonSection,
  args: {
    contact_phone: "010-1234-5678",
  },
};

/**
 * 담당자 번호가 없는 경우
 *
 * 담당자 번호가 없을 때 "-"를 표시합니다.
 */
export const NoContactPhone: Story = {
  render: renderContactPersonSection,
  args: {
    contact_phone: "",
  },
};

/**
 * 학습 포인트:
 *
 * 1. 담당자 정보 섹션 컴포넌트
 *    - GA/SA 관리자 파트너 상세 페이지에서 담당자 정보를 표시하는 섹션입니다
 *    - 문의 담당자 휴대폰 번호를 보여줍니다
 *
 * 2. InfoCard 컴포넌트 사용
 *    - 공통 InfoCard 컴포넌트를 사용하여 정보를 표시합니다
 *    - label과 value를 props로 전달합니다
 *
 * 3. null 병합 연산자
 *    - contact_phone이 없거나 빈 문자열일 경우 "-"를 표시합니다
 *    - || 연산자를 사용하여 기본값을 제공합니다
 *
 * 4. Section 컴포넌트 사용
 *    - 공통 Section 컴포넌트를 사용하여 섹션 제목을 표시합니다
 *    - "담당자 정보"라는 제목을 가집니다
 */


