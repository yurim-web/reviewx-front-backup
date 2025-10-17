/* ========================================
   🏢 파트너 캠페인 관리 메인 페이지
   ======================================== */

/**
 * 파트너 캠페인 관리 메인 페이지
 *
 * 목적: 파트너가 생성한 캠페인들을 관리하고 모니터링하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner
 *
 * 사용 파일:
 * - 컴포넌트: TabNavigation, StatisticsTab, CampaignList
 * - 타입: MainTab
 * - CSS: layout.module.css, campaign_card.module.css
 *
 * 주요 기능:
 * - 캠페인/포인트 탭 네비게이션
 * - 캠페인 상태별 통계 표시 (전체/예정/신청/진행/종료/취소)
 * - 상태별 캠페인 목록 필터링 및 표시
 * - 캠페인별 액션 버튼 (수정, 삭제, 검수 등)
 */

"use client";

import { useState } from "react";
import TabNavigation from "@/components/partner/TabNavigation";
import StatisticsTab from "@/components/partner/StatisticsTab";
import CampaignList from "@/components/partner/CampaignList";
import PenaltyContent from "@/components/partner/PenaltyContent";
import type { MainTab } from "@/types/campaignManagement";
import layoutStyles from "../../styles/partner/layout.module.css";
import cardStyles from "../../styles/partner/campaign_card.module.css";

import type {
  PartnerStatTab,
  PartnerCampaignStats,
  PartnerCampaign,
} from "@/types/partner";

/**
 * 목업 캠페인 데이터
 * TODO: 실제로는 API에서 데이터를 가져와야 함
 */
const mockCampaigns: PartnerCampaign[] = [
  {
    id: "1",
    title:
      "푸러블 고농축 캡슐세제 플라워, 1개, 110개입 푸러블 고농축 세제 플라워 1개 110개입 푸러블 고농축 세제품...",
    type: "배송형",
    status: "신청",
    deadline: "캠페인 선정 발표까지 1일 남았습니다.",
    applicants: 0,
    recruits: 12,
  },
  {
    id: "2",
    title: "[이야온] 진동클렌저",
    type: "방문형",
    status: "선정",
    deadline: "오픈까지 2일 남았습니다.",
    applicants: 0,
    recruits: 12,
  },

  {
    id: "3",
    title: "[1만캐시 지급] MBC에브리원 <시골경찰 리턴즈> 9회 보고 리뷰 쓰자",
    type: "방문형",
    status: "완료",
    deadline: "마감까지 2일 남았습니다.",
    applicants: 0,
    recruits: 12,
    submissions: 4,
    selected: 0,
  },
  {
    id: "4",
    title: "[서울/영등포] 남자왁싱 체험단 모집",
    type: "방문형",
    status: "취소/반려",
    deadline: "마감까지 2일 남았습니다.",
    applicants: 0,
    recruits: 12,
    submissions: 0,
    selected: 0,
  },
  {
    id: "5",
    title: "택배닥스 체험단 모집",
    type: "방문형",
    status: "완료",
    deadline: "당첨자 선정하기",
    applicants: 0,
    recruits: 12,
    submissions: 0,
    selected: 0,
  },
];

/**
 * 파트너 캠페인 관리 메인 페이지 컴포넌트
 */
export default function PartnerCampaignPage() {
  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");

  // 통계 탭 상태 (전체 / 예정 / 신청 / 진행 / 종료 / 취소)
  const [activeStatTab, setActiveStatTab] = useState<PartnerStatTab>("전체");

  /**
   * 각 상태별 캠페인 개수 계산
   */
  const mockStats: PartnerCampaignStats = {
    전체: mockCampaigns.length,
    예정: mockCampaigns.filter((c) => c.status === "신청").length,
    신청: mockCampaigns.filter((c) => c.status === "신청").length,
    진행: mockCampaigns.filter((c) => c.status === "선정").length,
    종료: mockCampaigns.filter((c) => c.status === "완료").length,
    취소: mockCampaigns.filter((c) => c.status === "취소/반려").length,
  };

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 상단 탭 네비게이션: 캠페인/포인트 */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 통계 탭: 전체/예정/신청/진행/종료/취소 */}
        <StatisticsTab
          activeStatTab={activeStatTab}
          setActiveStatTab={setActiveStatTab}
          stats={mockStats}
        />

        {/* 캠페인 목록 */}
        <CampaignList campaigns={mockCampaigns} activeStatTab={activeStatTab} />
      </div>
    </div>
  );
}
