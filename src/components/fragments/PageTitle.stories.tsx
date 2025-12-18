/**
 * PageTitle 컴포넌트 스토리북
 * 
 * 페이지 제목을 표시하는 공통 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import PageTitle from "./PageTitle";

const meta: Meta<typeof PageTitle> = {
  title: "Fragments/PageTitle",
  component: PageTitle,
  tags: ["autodocs"],
  // 컴포넌트의 props에 대한 설명을 추가할 수 있습니다
  argTypes: {
    title: {
      description: "페이지에 표시할 제목 텍스트",
      control: "text",
    },
    className: {
      description: "추가 CSS 클래스명 (선택적)",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PageTitle>;

/**
 * 기본 사용 예시
 * 
 * 가장 간단한 형태로 제목만 표시합니다.
 */
export const Default: Story = {
  args: {
    title: "페이지 제목",
  },
};

/**
 * 다양한 제목 예시
 * 
 * 실제 프로젝트에서 사용되는 다양한 제목들을 보여줍니다.
 */
export const FindAccount: Story = {
  args: {
    title: "계정 찾기",
  },
};

export const ResetPassword: Story = {
  args: {
    title: "새 비밀번호 설정",
  },
};

export const MyPageEdit: Story = {
  args: {
    title: "내 정보 수정",
  },
};

export const FAQ: Story = {
  args: {
    title: "자주 묻는 질문",
  },
};

export const Notice: Story = {
  args: {
    title: "공지사항",
  },
};

export const WithCustomClassName: Story = {
  args: {
    title: "커스텀 스타일이 적용된 제목",
    className: "custom-title-class",
  },
};

/**
 * 학습 포인트:
 * 
 * 1. args를 사용한 props 전달
 *    - Story의 args 객체에 props를 정의하면 컴포넌트에 전달됩니다
 *    - Storybook UI에서 실시간으로 값을 변경할 수 있습니다
 * 
 * 2. 여러 스토리 생성
 *    - 하나의 컴포넌트에 대해 여러 개의 스토리를 만들 수 있습니다
 *    - 각 스토리는 다른 사용 사례를 보여줍니다
 * 
 * 3. argTypes
 *    - 각 prop에 대한 설명과 컨트롤 타입을 정의할 수 있습니다
 *    - Storybook UI에서 더 나은 사용자 경험을 제공합니다
 * 
 * 4. export const로 스토리 내보내기
 *    - 각 스토리는 export const로 내보내야 Storybook에서 인식합니다
 *    - 이름은 대문자로 시작하는 것이 관례입니다
 */

