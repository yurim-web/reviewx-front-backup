/**
 * CampaignBox 컴포넌트 스토리북
 * 
 * 캠페인 카드를 표시하는 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CampaignBox from "./CampaignBox";

const meta: Meta<typeof CampaignBox> = {
  title: "Main/CampaignBox",
  component: CampaignBox,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/",
      },
    },
  },
  argTypes: {
    campaign: {
      description: "캠페인 정보 객체",
      control: "object",
    },
    basePath: {
      description: "링크 기본 경로 (기본값: /campaign/delivery)",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignBox>;

/**
 * 기본 배송형 캠페인
 * 
 * 가장 일반적인 배송형 캠페인 카드입니다.
 */
export const DeliveryCampaign: Story = {
  render: (args) => React.createElement(CampaignBox, args),
  args: {
    campaign: {
      id: "1",
      title: "프리미엄 화장품 세트",
      category: "배송형",
      categoryIcon: "/images/brand_logo/coupang.svg",
      image: "/images/main/campaign_img/campaign_1.png",
      dayCount: "D-6",
      recruitment: {
        current: 25,
        total: 50,
      },
    },
  },
};

/**
 * 방문형 캠페인
 * 
 * 방문형 캠페인의 예시입니다.
 */
export const VisitCampaign: Story = {
  render: (args) => React.createElement(CampaignBox, args),
  args: {
    campaign: {
      id: "2",
      title: "카페 방문 리뷰",
      category: "방문형",
      categoryIcon: "/images/brand_logo/naverblog.svg",
      image: "/images/main/campaign_img/campaign_2.png",
      dayCount: "D-3",
      recruitment: {
        current: 10,
        total: 20,
      },
    },
  },
};

/**
 * 구매평 캠페인
 * 
 * 구매평 캠페인의 예시입니다.
 */
export const ReviewCampaign: Story = {
  render: (args) => React.createElement(CampaignBox, args),
  args: {
    campaign: {
      id: "3",
      title: "신제품 구매평 작성",
      category: "구매평",
      categoryIcon: "/images/brand_logo/review.svg",
      image: "/images/main/campaign_img/campaign_3.png",
      dayCount: "D-10",
      recruitment: {
        current: 45,
        total: 100,
      },
    },
  },
};

/**
 * 스케줄 정보가 있는 캠페인
 * 
 * schedule 속성이 있는 경우 이미지 위에 오버레이로 표시됩니다.
 */
export const CampaignWithSchedule: Story = {
  render: (args) => React.createElement(CampaignBox, args),
  args: {
    campaign: {
      id: "4",
      title: "이벤트 캠페인",
      category: "미션형",
      categoryIcon: "/images/brand_logo/misssion.svg",
      image: "/images/main/campaign_img/campaign_4.png",
      dayCount: "D-5",
      schedule: "2024.01.15 ~ 2024.01.30",
      recruitment: {
        current: 30,
        total: 50,
      },
    },
  },
};

/**
 * 모집 완료에 가까운 캠페인
 * 
 * 현재 신청자 수가 모집 인원에 가까운 경우를 보여줍니다.
 */
export const AlmostFull: Story = {
  render: (args) => React.createElement(CampaignBox, args),
  args: {
    campaign: {
      id: "5",
      title: "인기 제품 리뷰",
      category: "기자단",
      categoryIcon: "/images/brand_logo/youtube.svg",
      image: "/images/main/campaign_img/campaign_5.png",
      dayCount: "D-1",
      recruitment: {
        current: 48,
        total: 50,
      },
    },
  },
};

/**
 * dayCount가 없는 캠페인
 * 
 * dayCount 속성이 없으면 상단 라벨이 표시되지 않습니다.
 */
export const WithoutDayCount: Story = {
  render: (args) => React.createElement(CampaignBox, args),
  args: {
    campaign: {
      id: "6",
      title: "일반 캠페인",
      category: "배송형",
      image: "/images/main/campaign_img/campaign_6.png",
      recruitment: {
        current: 15,
        total: 30,
      },
    },
  },
};

/**
 * 학습 포인트:
 * 
 * 1. 복잡한 객체 props
 *    - campaign 객체처럼 중첩된 객체도 args에 그대로 전달할 수 있습니다
 *    - Storybook UI에서 객체의 각 속성을 개별적으로 편집할 수 있습니다
 * 
 * 2. 다양한 상태 표현
 *    - 같은 컴포넌트라도 다른 props로 여러 상태를 보여줄 수 있습니다
 *    - 실제 사용 시나리오를 반영한 스토리를 만들면 유용합니다
 * 
 * 3. 선택적 속성 테스트
 *    - dayCount, schedule 같은 선택적 속성이 있을 때와 없을 때를 모두 테스트합니다
 *    - 조건부 렌더링이 제대로 작동하는지 확인할 수 있습니다
 * 
 * 4. 이미지 경로
 *    - public 폴더의 이미지는 절대 경로로 참조합니다
 *    - Storybook에서도 같은 경로로 접근할 수 있어야 합니다
 */

