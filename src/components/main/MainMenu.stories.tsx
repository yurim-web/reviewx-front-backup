/**
 * MainMenu 컴포넌트 스토리북
 * 
 * 메인 네비게이션 메뉴 컴포넌트입니다.
 * usePathname 훅을 사용하므로 Storybook에서 모킹이 필요합니다.
 * 
 * 참고: 실제로는 preview.ts에서 전역 모킹을 하지만,
 * 각 스토리에서 다른 pathname을 테스트하기 위해
 * 컴포넌트를 래핑하는 방식으로 구현합니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import MainMenu from "./MainMenu";

const meta: Meta<typeof MainMenu> = {
  title: "Main/MainMenu",
  component: MainMenu,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MainMenu>;

/**
 * 홈 페이지에서의 메뉴
 * 
 * 홈 경로(/)에서 활성화된 상태를 보여줍니다.
 * "홈" 메뉴가 활성화되어 있습니다.
 */
export const HomePage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
};

/**
 * 배송형 페이지에서의 메뉴
 * 
 * 배송형 경로(/campaign/delivery)에서 활성화된 상태를 보여줍니다.
 * "배송형" 메뉴가 활성화되어 있습니다.
 */
export const DeliveryPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/campaign/delivery",
      },
    },
  },
};

/**
 * 방문형 페이지에서의 메뉴
 */
export const VisitPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/campaign/visit",
      },
    },
  },
};

/**
 * 구매평 페이지에서의 메뉴
 */
export const ReviewPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/campaign/review",
      },
    },
  },
};

/**
 * 파트너 페이지에서의 메뉴
 * 
 * 파트너 경로(/partner)에서 홈 버튼이 /partner로 이동하는 것을 보여줍니다.
 * 일반 홈(/)과 달리 파트너 홈(/partner)으로 이동합니다.
 */
export const PartnerPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/partner",
      },
    },
  },
};

/**
 * 학습 포인트:
 * 
 * 1. Next.js 훅 모킹
 *    - usePathname 같은 Next.js 훅은 Storybook에서 직접 사용할 수 없습니다
 *    - parameters를 통해 모킹하거나, 데코레이터에서 처리해야 합니다
 * 
 * 2. 클라이언트 컴포넌트
 *    - "use client" 지시어가 있는 컴포넌트는 클라이언트 사이드에서만 작동합니다
 *    - Storybook도 클라이언트 환경이므로 대부분 잘 작동합니다
 * 
 * 3. 동적 스타일링
 *    - pathname에 따라 active 클래스가 동적으로 적용됩니다
 *    - 각 스토리에서 다른 pathname을 설정하여 다양한 상태를 확인할 수 있습니다
 * 
 * 4. 조건부 렌더링
 *    - pathname.startsWith('/partner')로 파트너 페이지인지 확인합니다
 *    - 이런 조건부 로직도 Storybook에서 테스트할 수 있습니다
 */

