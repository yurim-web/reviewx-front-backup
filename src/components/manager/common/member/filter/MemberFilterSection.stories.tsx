/**
 * MemberFilterSection 컴포넌트 스토리북
 *
 * 회원 필터 섹션 컴포넌트의 다양한 사용 예시를 보여줍니다.
 * 이 컴포넌트는 제네릭 컴포넌트로 리뷰어와 파트너 목록 페이지에서 공통으로 사용됩니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import MemberFilterSection from "./MemberFilterSection";
import ChannelFilterModal from "@/components/manager/common/member/partners/filter/ChannelFilterModal";
import DivisionFilterModal from "@/components/manager/common/member/partners/filter/DivisionFilterModal";
import TypeFilterModal from "@/components/manager/common/member/partners/filter/TypeFilterModal";
import StatusFilterModal from "@/components/manager/common/member/partners/filter/StatusFilterModal";
import type { Channel } from "@/data/manager_ga/member/partners";
import type { PartnerDivision, PartnerStatus } from "@/data/manager_ga/member/partners";
import type { PartnerType } from "@/components/manager/common/member/partners/filter/TypeFilterModal";
import styles from "@/styles/manager_ga/member/partners/partner_filter_section.module.css";

// 채널 이름 매핑 객체
const channel_name_map: Record<Channel, string> = {
  Blog: "네이버 블로그",
  Clip: "네이버 클립",
  Instagram: "인스타그램",
  Youtube: "유튜브",
  Store: "네이버 스토어",
};

const meta: Meta<typeof MemberFilterSection> = {
  title: "Manager/Common/Member/Filter/MemberFilterSection",
  component: MemberFilterSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
    },
  },
  argTypes: {
    search_query: {
      description: "검색어 상태",
      control: "text",
    },
    on_search_change: {
      description: "검색어 변경 핸들러 함수",
      action: "search changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof MemberFilterSection>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderMemberFilterSection = (args: any) => {
  return (
    <MemberFilterSection<
      Channel,
      PartnerDivision,
      PartnerType,
      PartnerStatus
    >
      {...args}
    />
  );
};

/**
 * 기본 필터 섹션 (파트너 예시)
 *
 * 파트너 목록 페이지의 필터 섹션입니다.
 */
export const Default: Story = {
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState(args.search_query || "");
    return (
      <MemberFilterSection<
        Channel,
        PartnerDivision,
        PartnerType,
        PartnerStatus
      >
        search_query={searchQuery}
        on_search_change={(query) => {
          setSearchQuery(query);
          args.on_search_change?.(query);
        }}
        styles={styles}
        channel_name_map={channel_name_map}
        ChannelFilterModal={ChannelFilterModal as any}
        grade_or_division_label="구분"
        GradeOrDivisionFilterModal={DivisionFilterModal as any}
        TypeFilterModal={TypeFilterModal as any}
        StatusFilterModal={StatusFilterModal as any}
        download_button_text="파트너 목록 다운로드"
      />
    );
  },
  args: {
    search_query: "",
    on_search_change: (query) => console.log("Search changed:", query),
  },
};

/**
 * 검색어가 있는 상태
 *
 * 이미 검색어가 입력된 상태의 필터 섹션입니다.
 */
export const WithSearchQuery: Story = {
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState("프로모즈");
    return (
      <MemberFilterSection<
        Channel,
        PartnerDivision,
        PartnerType,
        PartnerStatus
      >
        search_query={searchQuery}
        on_search_change={(query) => {
          setSearchQuery(query);
          args.on_search_change?.(query);
        }}
        styles={styles}
        channel_name_map={channel_name_map}
        ChannelFilterModal={ChannelFilterModal as any}
        grade_or_division_label="구분"
        GradeOrDivisionFilterModal={DivisionFilterModal as any}
        TypeFilterModal={TypeFilterModal as any}
        StatusFilterModal={StatusFilterModal as any}
        download_button_text="파트너 목록 다운로드"
      />
    );
  },
  args: {
    search_query: "프로모즈",
    on_search_change: (query) => console.log("Search changed:", query),
  },
};

/**
 * 학습 포인트:
 *
 * 1. 회원 필터 섹션 컴포넌트 (제네릭)
 *    - 리뷰어/파트너 목록 페이지에서 필터링을 위한 필터 버튼들을 표시하는 섹션입니다
 *    - 제네릭 타입을 사용하여 다양한 타입의 필터를 지원합니다
 *
 * 2. 제네릭 타입 파라미터
 *    - TChannel: 채널 타입 (예: Channel)
 *    - TGradeOrDivision: 등급/구분 타입 (리뷰어는 등급, 파트너는 구분)
 *    - TType: 유형 타입 (예: PartnerType)
 *    - TStatus: 상태 타입 (예: PartnerStatus)
 *
 * 3. 필터 옵션
 *    - 채널 필터: Blog, Clip, Instagram, Youtube, Store
 *    - 등급/구분 필터: 리뷰어는 등급, 파트너는 구분
 *    - 유형 필터: 프로모즈, 일반, 인플루언서
 *    - 상태 필터: 정상, 일시 정지, 영구 정지
 *
 * 4. Render Prop 패턴
 *    - 필터 모달 컴포넌트들을 props로 받아서 동적으로 렌더링합니다
 *    - React.createElement를 사용하여 동적으로 컴포넌트를 생성합니다
 *
 * 5. BaseFilterSection 사용
 *    - 공통 BaseFilterSection 컴포넌트를 사용합니다
 *    - 검색, 필터 모달 버튼, 활성 필터 태그 등을 제공합니다
 */


