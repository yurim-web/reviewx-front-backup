/**
 * CampaignProgressDetailLayout 컴포넌트 스토리북
 *
 * 캠페인 진행현황 상세 페이지 레이아웃 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import CampaignProgressDetailLayout from "./CampaignProgressDetailLayout";
import type { CampaignWithApplicants, AllApplicant } from "@/data/partner/sharedCampaigns";
import type {
  SortOption,
  TabType,
} from "@/hooks/manager/common/campaign/useCampaignProgressDetail";
import NaverBlogCard from "@/components/partner/campaign_application/card_type/naverblog/NaverBlogCard";
import InstagramCard from "@/components/partner/campaign_application/card_type/instagram/InstagramCard";
import InstagramSelectedCard from "@/components/partner/campaign_application/card_type/instagram/InstagramSelectedCard";
import type { Applicant } from "@/data/partner/campaign_application/delivery_applicants";
import type { InstagramApplicant } from "@/data/partner/campaign_application/delivery_applicants";

// Mock 캠페인 데이터
const mockCampaignData: CampaignWithApplicants = {
  campaignInfo: {
    id: "1",
    title: "프리미엄 뷰티 제품 체험 캠페인",
    image: "/images/campaign_image.png",
    status: "모집 중",
    campaignType: "배송형",
    category: "뷰티",
    brandName: "뷰티브랜드",
    recruitmentPeriod: "2024-01-01 ~ 2024-01-31",
    announcementDate: "2024-02-05",
    registrationPeriod: "2024-02-10 ~ 2024-02-20",
    recruitedCount: 10,
    totalCount: 20,
    daysLeft: 5,
  },
  applicantData: {
    applicants: [],
    selectedApplicants: [],
  },
};

// Mock 신청자 데이터
const mockApplicants: AllApplicant[] = [
  {
    id: "1",
    Id: "1",
    nickname: "리뷰어1",
    userType: "리뷰어",
    profileImage: "/images/profile1.png",
    memberType: "모범 회원",
    dailyVisits: 100,
    totalVisits: 10000,
    neighbors: 500,
    memo: "열심히 작성하는 리뷰어입니다",
    selectionStatus: "미선택",
    channel: "네이버블로그",
    registrationDate: "2024-01-15",
  },
  {
    id: "2",
    Id: "2",
    nickname: "인플루언서1",
    userType: "인플루언서",
    profileImage: "/images/profile2.png",
    memberType: "모범 회원",
    followers: 50000,
    memo: "인기 인플루언서입니다",
    selectionStatus: "미선택",
    channel: "인스타그램",
    registrationDate: "2024-01-16",
  },
];

// Mock 카드 렌더링 함수 (실제 카드 컴포넌트 사용)
const mockRenderCard = (
  applicant: AllApplicant,
  is_selected: boolean,
  campaign_data: CampaignWithApplicants | null,
  handle_select: (id: string) => void,
  handle_cancel: (id: string) => void
) => {
  // 채널에 따라 다른 카드 컴포넌트 렌더링
  switch (applicant.channel) {
    case "네이버블로그":
      // 네이버블로그는 dailyVisits, totalVisits, neighbors 속성이 모두 있는 Applicant 타입
      if ("dailyVisits" in applicant && "totalVisits" in applicant && "neighbors" in applicant) {
        return (
          <NaverBlogCard
            applicant={applicant as unknown as Applicant}
            variant={is_selected ? "selected" : "applicant"}
            onSelect={handle_select}
            onCancel={handle_cancel}
          />
        );
      }
      break;
    case "인스타그램":
      // 인스타그램은 followers 속성이 있는 InstagramApplicant 타입
      if ("followers" in applicant) {
        if (is_selected) {
          return (
            <InstagramSelectedCard
              applicant={applicant as InstagramApplicant}
              onCancel={handle_cancel}
            />
          );
        }
        return (
          <InstagramCard applicant={applicant as InstagramApplicant} onSelect={handle_select} />
        );
      }
      break;
    default:
      // 기본값: 네이버블로그 카드 사용 (타입 체크 후)
      if ("dailyVisits" in applicant && "totalVisits" in applicant && "neighbors" in applicant) {
        return (
          <NaverBlogCard
            applicant={applicant as unknown as Applicant}
            variant={is_selected ? "selected" : "applicant"}
            onSelect={handle_select}
            onCancel={handle_cancel}
          />
        );
      }
      break;
  }
  // 타입이 맞지 않는 경우 기본 카드 표시
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
      }}
    >
      <div>{applicant.nickname}</div>
      <div>{applicant.channel}</div>
    </div>
  );
};

const meta: Meta<typeof CampaignProgressDetailLayout> = {
  title: "Manager/Common/Campaign/Progress/CampaignProgressDetailLayout",
  component: CampaignProgressDetailLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: false,
    },
  },
  argTypes: {
    campaign_data: {
      description: "캠페인 데이터 (신청자 정보 포함)",
      control: "object",
    },
    active_tab: {
      description: "현재 활성화된 탭",
      control: "select",
      options: ["applicants", "selected"],
    },
    sort_order: {
      description: "현재 정렬 옵션",
      control: "select",
      options: ["latest", "oldest", "name"],
    },
    applicants_count: {
      description: "전체 신청자 수",
      control: "number",
    },
    selected_count: {
      description: "선정된 신청자 수",
      control: "number",
    },
    manager_type: {
      description: "매니저 타입 (ga 또는 sa)",
      control: "select",
      options: ["ga", "sa"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof CampaignProgressDetailLayout>;

/**
 * 기본 레이아웃 (GA 타입)
 *
 * General Admin 타입의 캠페인 진행현황 상세 페이지 레이아웃입니다.
 */
export const DefaultGA: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<TabType>("applicants");
    const [sortOrder, setSortOrder] = useState<SortOption>("latest");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleSelect = useCallback((id: string) => {
      setSelectedIds((prev) => new Set([...prev, id]));
    }, []);

    const handleCancel = useCallback((id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, []);

    const currentApplicants = mockApplicants.filter((app) => {
      if (activeTab === "selected") {
        return selectedIds.has(app.id);
      }
      return true;
    });

    return (
      <CampaignProgressDetailLayout
        {...args}
        campaign_data={{
          ...mockCampaignData,
          applicantData: {
            applicants: mockApplicants,
            selectedApplicants: mockApplicants.filter((app) => selectedIds.has(app.id)),
          },
        }}
        active_tab={activeTab}
        set_active_tab={setActiveTab}
        sort_order={sortOrder}
        set_sort_order={setSortOrder}
        sort_options={[
          { value: "latest", label: "최신순" },
          { value: "oldest", label: "오래된순" },
          { value: "recommend", label: "추천순" },
        ]}
        applicants_count={mockApplicants.length}
        selected_count={selectedIds.size}
        current_applicants={currentApplicants}
        handle_select_applicant={handleSelect}
        handle_cancel_applicant={handleCancel}
        handle_download_applicants={() => console.log("전체 신청자 다운로드")}
        handle_download_selected={() => console.log("선정된 신청자 다운로드")}
        render_card={mockRenderCard}
        campaign_id="1"
        manager_type="ga"
      />
    );
  },
  args: {
    campaign_data: mockCampaignData,
    active_tab: "applicants",
    sort_order: "latest",
    applicants_count: 2,
    selected_count: 0,
    manager_type: "ga",
  },
};

/**
 * SA 타입 레이아웃
 *
 * Super Admin 타입의 캠페인 진행현황 상세 페이지 레이아웃입니다.
 */
export const DefaultSA: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<TabType>("applicants");
    const [sortOrder, setSortOrder] = useState<SortOption>("latest");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleSelect = useCallback((id: string) => {
      setSelectedIds((prev) => new Set([...prev, id]));
    }, []);

    const handleCancel = useCallback((id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, []);

    const currentApplicants = mockApplicants.filter((app) => {
      if (activeTab === "selected") {
        return selectedIds.has(app.id);
      }
      return true;
    });

    return (
      <CampaignProgressDetailLayout
        {...args}
        campaign_data={{
          ...mockCampaignData,
          applicantData: {
            applicants: mockApplicants,
            selectedApplicants: mockApplicants.filter((app) => selectedIds.has(app.id)),
          },
        }}
        active_tab={activeTab}
        set_active_tab={setActiveTab}
        sort_order={sortOrder}
        set_sort_order={setSortOrder}
        sort_options={[
          { value: "latest", label: "최신순" },
          { value: "oldest", label: "오래된순" },
          { value: "recommend", label: "추천순" },
        ]}
        applicants_count={mockApplicants.length}
        selected_count={selectedIds.size}
        current_applicants={currentApplicants}
        handle_select_applicant={handleSelect}
        handle_cancel_applicant={handleCancel}
        handle_download_applicants={() => console.log("전체 신청자 다운로드")}
        handle_download_selected={() => console.log("선정된 신청자 다운로드")}
        render_card={mockRenderCard}
        campaign_id="1"
        manager_type="sa"
      />
    );
  },
  args: {
    campaign_data: mockCampaignData,
    active_tab: "applicants",
    sort_order: "latest",
    applicants_count: 2,
    selected_count: 0,
    manager_type: "sa",
  },
};
