/* ========================================
   DetailProductInfo 스토리북
   ======================================== */

/**
 * DetailProductInfo.stories
 *
 * 목적: 캠페인 제품 정보 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/CampaignDetail/DetailProductInfo)
 */

import type { Meta, StoryObj } from "@storybook/react";
import CampaignProductInfo from "./DetailProductInfo";

const meta: Meta<typeof CampaignProductInfo> = {
  title: "User/CampaignDetail/DetailProductInfo",
  component: CampaignProductInfo,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    title: {
      description: "제품 제목",
      control: "text",
    },
    description: {
      description: "제품 설명",
      control: "text",
    },
    image: {
      description: "제품 이미지 경로",
      control: "text",
    },
    children: {
      description: "추가 콘텐츠 (예: 캠페인 일정 정보)",
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignProductInfo>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderCampaignProductInfo = (args: any) => {
  return <CampaignProductInfo {...args} />;
};

/**
 * 기본 제품 정보
 *
 * 제품 제목, 설명, 이미지를 표시하는 기본 제품 정보입니다.
 */
export const Default: Story = {
  render: renderCampaignProductInfo,
  args: {
    title: "프리미엄 뷰티 제품",
    description: "고품질 뷰티 제품을 체험하고 솔직한 리뷰를 작성해주세요.",
    image: "/images/test_img/product_test.png",
  },
};

/**
 * 추가 콘텐츠 포함
 *
 * children을 통해 추가 콘텐츠를 포함한 제품 정보입니다.
 */
export const WithChildren: Story = {
  render: (args) => {
    return (
      <CampaignProductInfo {...args}>
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          추가 콘텐츠: 캠페인 일정 정보 등
        </div>
      </CampaignProductInfo>
    );
  },
  args: {
    title: "프리미엄 뷰티 제품",
    description: "고품질 뷰티 제품을 체험하고 솔직한 리뷰를 작성해주세요.",
    image: "/images/test_img/product_test.png",
  },
};

/**
 * 학습 포인트:
 *
 * 1. children prop
 *    - ReactNode 타입으로 추가 콘텐츠를 받을 수 있습니다
 *    - 유연하게 컴포넌트를 확장할 수 있습니다
 *
 * 2. 시맨틱 HTML
 *    - h1 태그로 제품 제목을 표시합니다 (SEO에 유리)
 *    - article 태그로 제품 정보 섹션을 구분합니다
 *
 * 3. 컴포넌트 조합
 *    - children을 통해 다른 컴포넌트를 포함할 수 있습니다
 *    - 예: 캠페인 일정 정보 컴포넌트를 children으로 전달
 */
