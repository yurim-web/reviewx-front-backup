/**
 * MemberDetailLayout 컴포넌트 스토리북
 *
 * 회원 디테일 레이아웃 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import MemberDetailLayout from "./MemberDetailLayout";
import styles from "@/styles/manager/common/member/member_detail/member_detail_layout.module.css";

const meta: Meta<typeof MemberDetailLayout> = {
  title: "Manager/Common/Member/MemberDetail/MemberDetailLayout",
  component: MemberDetailLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/manager_ga/member/reviewers/1",
      },
    },
  },
  argTypes: {
    is_loading: {
      description: "로딩 상태",
      control: "boolean",
    },
    is_error: {
      description: "에러 상태",
      control: "boolean",
    },
    error_message: {
      description: "에러 메시지",
      control: "text",
    },
    back_path: {
      description: "목록으로 돌아가기 경로",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof MemberDetailLayout>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderMemberDetailLayout = (args: any) => {
  return <MemberDetailLayout {...args} />;
};

/**
 * 기본 레이아웃 (정상 상태)
 *
 * 회원 디테일 페이지의 기본 레이아웃입니다.
 */
export const Default: Story = {
  render: renderMemberDetailLayout,
  args: {
    is_loading: false,
    is_error: false,
    error_message: "",
    back_path: "/manager_ga/member/reviewers",
    children: (
      <div style={{ padding: "20px" }}>
        <h2>회원 디테일 페이지</h2>
        <p>여기에 회원 상세 정보가 표시됩니다.</p>
      </div>
    ),
  },
};

/**
 * 로딩 상태
 *
 * 데이터를 불러오는 중일 때 로딩 화면을 표시합니다.
 */
export const Loading: Story = {
  render: renderMemberDetailLayout,
  args: {
    is_loading: true,
    is_error: false,
    error_message: "",
    back_path: "/manager_ga/member/reviewers",
    children: null,
  },
};

/**
 * 에러 상태
 *
 * 데이터가 없거나 에러가 발생했을 때 에러 메시지를 표시합니다.
 */
export const Error: Story = {
  render: renderMemberDetailLayout,
  args: {
    is_loading: false,
    is_error: true,
    error_message: "회원 정보를 불러올 수 없습니다.",
    back_path: "/manager_ga/member/reviewers",
    children: null,
  },
};

/**
 * 학습 포인트:
 *
 * 1. 회원 디테일 레이아웃 컴포넌트
 *    - 리뷰어와 파트너 디테일 페이지에서 공통으로 사용되는 레이아웃입니다
 *    - 로딩 상태와 에러 상태를 처리합니다
 *
 * 2. 조건부 렌더링
 *    - is_loading이 true이면 Loading 컴포넌트를 표시합니다
 *    - is_error가 true이면 에러 메시지와 목록으로 돌아가기 버튼을 표시합니다
 *    - 둘 다 false이면 children을 렌더링합니다
 *
 * 3. useRouter 사용
 *    - Next.js의 useRouter를 사용하여 페이지 이동을 처리합니다
 *    - router.push()로 목록 페이지로 이동합니다
 *
 * 4. 재사용성
 *    - 리뷰어와 파트너 디테일 페이지에서 공통으로 사용됩니다
 *    - children을 통해 메인 콘텐츠를 전달받습니다
 */
