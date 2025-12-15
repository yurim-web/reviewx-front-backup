/**
 * BusinessInfoSection 컴포넌트 스토리북
 *
 * 사업자 정보 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import BusinessInfoSection from "./BusinessInfoSection";

const meta: Meta<typeof BusinessInfoSection> = {
  title: "Manager/Common/Member/Partners/Section/BusinessInfoSection",
  component: BusinessInfoSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    business_name: {
      description: "상호명",
      control: "text",
    },
    representative_name: {
      description: "대표자명",
      control: "text",
    },
    business_number: {
      description: "사업자등록번호",
      control: "text",
    },
    on_download: {
      description: "사업자등록증 다운로드 핸들러 함수",
      action: "download clicked",
    },
  },
};

export default meta;

type Story = StoryObj<typeof BusinessInfoSection>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderBusinessInfoSection = (args: any) => {
  return <BusinessInfoSection {...args} />;
};

/**
 * 기본 사업자 정보 섹션
 *
 * 파트너의 사업자 정보를 표시하는 섹션입니다.
 */
export const Default: Story = {
  render: renderBusinessInfoSection,
  args: {
    business_name: "주식회사 테스트",
    representative_name: "홍길동",
    business_number: "123-45-67890",
    on_download: () => console.log("사업자등록증 다운로드"),
  },
};

/**
 * 학습 포인트:
 *
 * 1. 사업자 정보 섹션 컴포넌트
 *    - GA/SA 관리자 파트너 상세 페이지에서 사업자 정보를 표시하는 섹션입니다
 *    - 상호명, 대표자명, 사업자등록번호 정보를 보여줍니다
 *
 * 2. InfoCard 컴포넌트 사용
 *    - 공통 InfoCard 컴포넌트를 사용하여 각 정보를 표시합니다
 *    - label과 value를 props로 전달합니다
 *
 * 3. 사업자등록증 다운로드
 *    - 커스텀 카드로 다운로드 버튼을 포함합니다
 *    - on_download 핸들러 함수를 통해 다운로드 기능을 제공합니다
 *
 * 4. Section 컴포넌트 사용
 *    - 공통 Section 컴포넌트를 사용하여 섹션 제목을 표시합니다
 *    - "사업자 정보"라는 제목을 가집니다
 */




