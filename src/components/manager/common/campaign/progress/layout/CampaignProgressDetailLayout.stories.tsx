/**
 * CampaignProgressDetailLayout 컴포넌트 스토리북
 *
 * 캠페인 진행현황 상세 페이지 공통 레이아웃 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import CampaignProgressDetailLayout from "./CampaignProgressDetailLayout";
import type {
  CampaignWithApplicants,
  AllApplicant,
} from "@/data/partner/sharedCampaigns";
import type {
  SortOption,
  TabType,
} from "@/hooks/manager/common/campaign/useCampaignProgressDetail";
import BasicCard from "@/components/partner/campaign_application/card_type/basic/BasicCard";
import styles from "@/styles/partner/campaign_application/campaign_application.module.css";

// Mock 캠페인 데이터
const mockCampaignData: CampaignWithApplicants = {
  id: "1",
  campaignInfo: {
    title: "프리미엄 뷰티 제품 체험 캠페인",
    brandName: "테스트 브랜드",
    category: "뷰티",
    points: 5000,
    recruitmentCount: 10,
    recruitmentPeriod: "2024-01-01 ~ 2024-01-31",
    announcementDate: "2024-02-01",
    registrationPeriod: "2024-02-01 ~ 2024-02-15",
    thumbnail: "/images/test_img/product_test.png",
  },
  applicants: [],
};

// Mock 신청자 데이터
const mockApplicants: AllApplicant[] = [
  {
    id: "1",
    userType: "리뷰어",
    nickname: "테스트리뷰어1",
    profileImage: "/images/test_img/profile_test.png",
    channel: "네이버블로그",
    channelId: "blog.naver.com/test1",
    registrationDate: "2024-01-15 17:37",
    selectionStatus: "신청",
    memo: "",
  },
  {
    id: "2",
    userType: "인플루언서",
    nickname: "테스트인플루언서1",
    profileImage: "/images/test_img/profile_test.png",
    channel: "인스타그램",
    channelId: "instagram.com/test1",
    registrationDate: "2024-01-16 10:20",
    selectionStatus: "신청",
    memo: "",
  },
  {
    id: "3",
    userType: "리뷰어",
    nickname: "테스트리뷰어2",
    profileImage: "/images/test_img/profile_test.png",
    channel: "유튜브",
    channelId: "youtube.com/test1",
    registrationDate: "2024-01-17 14:30",
    selectionStatus: "선정",
    memo: "",
  },
];

// Mock 카드 렌더링 함수
const mockRenderCard = (
  applicant: AllApplicant,
  is_selected: boolean,
  campaign_data: CampaignWithApplicants | null,
  handle_select: (id: string) => void,
  handle_cancel: (id: string) => void
) => {
  return (
    <BasicCard
      applicant={applicant as any}
      onSelect={is_selected ? handle_cancel : handle_select}
    />
  );
};

const meta: Meta<typeof CampaignProgressDetailLayout> = {
  title: "Manager/Common/Campaign/Progress/Layout/CampaignProgressDetailLayout",
  component: CampaignProgressDetailLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
      navigation: {
        pathname: "/manager_ga/campaign/progress/delivery/1",
      },
    },
  },
  argTypes: {
    campaign_data: {
      description: "캠페인 데이터",
      control: "object",
    },
    active_tab: {
      description: "활성 탭",
      control: "select",
      options: ["applicants", "selected"],
    },
    sort_order: {
      description: "정렬 옵션",
      control: "select",
      options: ["latest", "popular", "deadline", "point"],
    },
    applicants_count: {
      description: "신청자 수",
      control: "number",
    },
    selected_count: {
      description: "선정자 수",
      control: "number",
    },
    campaign_id: {
      description: "캠페인 ID",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignProgressDetailLayout>;

// 안정적인 render 함수를 컴포넌트 외부에 정의 (깜빡임 방지)
// args를 받아서 컴포넌트에 전달해야 합니다
const renderCampaignProgressDetailLayout = (args: any) => {
  return <CampaignProgressDetailLayout {...args} />;
};

/**
 * 기본 레이아웃 (신청 탭)
 *
 * 신청자 목록을 표시하는 기본 레이아웃입니다.
 */
export const Default: Story = {
  render: renderCampaignProgressDetailLayout,
  args: {
    campaign_data: mockCampaignData,
    active_tab: "applicants",
    set_active_tab: (tab: TabType) => console.log("Tab changed:", tab),
    sort_order: "latest",
    set_sort_order: (order: SortOption) => console.log("Sort changed:", order),
    sort_options: [
      { value: "latest", label: "최신순" },
      { value: "popular", label: "인기순" },
      { value: "deadline", label: "마감임박순" },
      { value: "point", label: "포인트순" },
    ],
    applicants_count: 2,
    selected_count: 1,
    current_applicants: mockApplicants.filter(
      (a) => a.selectionStatus === "신청"
    ),
    handle_select_applicant: (id) => console.log("Select applicant:", id),
    handle_cancel_applicant: (id) => console.log("Cancel applicant:", id),
    handle_download_applicants: () => console.log("Download applicants"),
    handle_download_selected: () => console.log("Download selected"),
    render_card: mockRenderCard,
    campaign_id: "1",
    detailStyles: {
      detail_page_wrapper: styles.detail_page_wrapper || "detail_page_wrapper",
      content_container: styles.content_container || "content_container",
      content_inner: styles.content_inner || "content_inner",
    },
  },
};

/**
 * 선정 탭
 *
 * 선정된 신청자 목록을 표시하는 레이아웃입니다.
 */
export const SelectedTab: Story = {
  render: renderCampaignProgressDetailLayout,
  args: {
    campaign_data: mockCampaignData,
    active_tab: "selected",
    set_active_tab: (tab: TabType) => console.log("Tab changed:", tab),
    sort_order: "latest",
    set_sort_order: (order: SortOption) => console.log("Sort changed:", order),
    sort_options: [
      { value: "latest", label: "최신순" },
      { value: "popular", label: "인기순" },
      { value: "deadline", label: "마감임박순" },
      { value: "point", label: "포인트순" },
    ],
    applicants_count: 2,
    selected_count: 1,
    current_applicants: mockApplicants.filter(
      (a) => a.selectionStatus === "선정"
    ),
    handle_select_applicant: (id) => console.log("Select applicant:", id),
    handle_cancel_applicant: (id) => console.log("Cancel applicant:", id),
    handle_download_applicants: () => console.log("Download applicants"),
    handle_download_selected: () => console.log("Download selected"),
    render_card: mockRenderCard,
    campaign_id: "1",
    detailStyles: {
      detail_page_wrapper: styles.detail_page_wrapper || "detail_page_wrapper",
      content_container: styles.content_container || "content_container",
      content_inner: styles.content_inner || "content_inner",
    },
  },
};

/**
 * 빈 신청자 목록
 *
 * 신청자가 없을 때 빈 목록을 표시하는 레이아웃입니다.
 */
export const EmptyApplicants: Story = {
  render: renderCampaignProgressDetailLayout,
  args: {
    campaign_data: mockCampaignData,
    active_tab: "applicants",
    set_active_tab: (tab: TabType) => console.log("Tab changed:", tab),
    sort_order: "latest",
    set_sort_order: (order: SortOption) => console.log("Sort changed:", order),
    sort_options: [
      { value: "latest", label: "최신순" },
      { value: "popular", label: "인기순" },
      { value: "deadline", label: "마감임박순" },
      { value: "point", label: "포인트순" },
    ],
    applicants_count: 0,
    selected_count: 0,
    current_applicants: [],
    handle_select_applicant: (id) => console.log("Select applicant:", id),
    handle_cancel_applicant: (id) => console.log("Cancel applicant:", id),
    handle_download_applicants: () => console.log("Download applicants"),
    handle_download_selected: () => console.log("Download selected"),
    render_card: mockRenderCard,
    campaign_id: "1",
    detailStyles: {
      detail_page_wrapper: styles.detail_page_wrapper || "detail_page_wrapper",
      content_container: styles.content_container || "content_container",
      content_inner: styles.content_inner || "content_inner",
    },
  },
};

/**
 * 학습 포인트:
 *
 * 1. 공통 레이아웃 컴포넌트
 *    - 여러 캠페인 타입에서 공통으로 사용하는 레이아웃입니다
 *    - 배송형, 미션형, 기자단, 구매평, 방문형 캠페인에서 재사용됩니다
 *
 * 2. Render Prop 패턴
 *    - render_card 함수를 props로 받아서 동적으로 카드를 렌더링합니다
 *    - 각 캠페인 타입마다 다른 카드 컴포넌트를 사용할 수 있습니다
 *
 * 3. 탭 네비게이션
 *    - 신청 탭과 선정 탭을 전환할 수 있습니다
 *    - 각 탭마다 다른 신청자 목록을 표시합니다
 *
 * 4. 정렬 및 필터
 *    - SortFilterControl 컴포넌트로 정렬 옵션을 제공합니다
 *    - 최신순, 인기순, 마감임박순, 포인트순으로 정렬할 수 있습니다
 *
 * 5. 다운로드 기능
 *    - 전체 신청자 목록 다운로드
 *    - 선정된 신청자 목록 다운로드
 */
