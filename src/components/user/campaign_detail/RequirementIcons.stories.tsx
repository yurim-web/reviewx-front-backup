/* ========================================
   RequirementIcons 스토리북
   ======================================== */

/**
 * RequirementIcons.stories
 *
 * 목적: 캠페인 요구사항 아이콘 컴포넌트 스토리 모음
 *
 * 사용 페이지:
 * - Storybook (User/CampaignDetail/RequirementIcons)
 */

import type { Meta, StoryObj } from "@storybook/react";
import RequirementIcons from "./RequirementIcons";

const meta: Meta<typeof RequirementIcons> = {
  title: "User/CampaignDetail/RequirementIcons",
  component: RequirementIcons,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    requirements: {
      description: "요구사항 코드 목록",
      control: "object",
    },
    className: {
      description: "추가 CSS 클래스",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof RequirementIcons>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderRequirementIcons = (args: any) => {
  return <RequirementIcons {...args} />;
};

/**
 * 기본 요구사항
 *
 * 기본적인 요구사항 아이콘들을 표시합니다.
 * requirements가 없으면 아무것도 표시되지 않습니다.
 */
export const Default: Story = {
  render: renderRequirementIcons,
  args: {
    requirements: ["keyword", "product_link", "text_1500"],
  },
};

/**
 * 텍스트 요구사항
 *
 * 텍스트 관련 요구사항을 표시합니다.
 */
export const TextRequirements: Story = {
  render: renderRequirementIcons,
  args: {
    requirements: ["text_1500"],
  },
};

/**
 * 사진 요구사항
 *
 * 사진 관련 요구사항을 표시합니다.
 */
export const PhotoRequirements: Story = {
  render: renderRequirementIcons,
  args: {
    requirements: ["photo_10"],
  },
};

/**
 * 비디오 요구사항
 *
 * 비디오 관련 요구사항을 표시합니다.
 */
export const VideoRequirements: Story = {
  render: renderRequirementIcons,
  args: {
    requirements: ["video_120"],
  },
};

/**
 * 복합 요구사항
 *
 * 여러 요구사항을 함께 표시합니다.
 */
export const MultipleRequirements: Story = {
  render: renderRequirementIcons,
  args: {
    requirements: [
      "text_1500",
      "photo_10",
      "video_120",
      "keyword",
      "product_link",
    ],
  },
};

/**
 * 빈 요구사항
 *
 * requirements가 없거나 빈 배열인 경우 아무것도 표시되지 않습니다.
 */
export const EmptyRequirements: Story = {
  render: renderRequirementIcons,
  args: {
    requirements: [],
  },
};

/**
 * 학습 포인트:
 *
 * 1. 요구사항 아이콘 컴포넌트
 *    - 다양한 요구사항 코드를 아이콘과 텍스트로 변환합니다
 *    - 동적 패턴 매칭으로 요구사항을 처리합니다
 *
 * 2. 패턴 매칭
 *    - text_숫자, photo_숫자, video_숫자 등의 패턴을 인식합니다
 *    - 정규표현식이나 문자열 처리로 패턴을 매칭합니다
 *
 * 3. 빈 요구사항 처리
 *    - requirements가 없거나 빈 배열이면 null을 반환하여 아무것도 표시하지 않습니다
 *    - 이는 컴포넌트의 의도된 동작입니다
 */
