/* ========================================
   📊 캠페인 관리 메인 페이지
   ======================================== */

/**
 * 캠페인 관리 메인 페이지
 *
 * 목적: 사용자가 신청/선정/완료된 캠페인을 관리하고 패널티 정보를 확인하는 통합 관리 페이지입니다.
 *
 * 페이지 경로:
 * - /user/campaign_management
 *
 * 사용 파일:
 * - 컴포넌트: TabNavigation, StatisticsTab, CampaignList
 * - 타입: CampaignApplication, MainTab
 * - CSS: campaign_management.module.css
 *
 * 주요 기능:
 * - 캠페인 상태별 통계 표시 (신청/선정/완료/취소반려/패널티)
 * - 상태별 캠페인 목록 필터링 및 표시
 * - 캠페인별 액션 버튼 (신청 취소, 콘텐츠 등록, 패널티 해제 등)
 * - 상단 고정 탭 네비게이션 (캠페인/포인트/계정)
 * - 통계 탭 네비게이션 (상태별 필터링)
 * - 패널티 내역 및 현황 표시
 */

"use client";

import { useState } from "react";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import StatisticsTab from "@/components/user/campaign_management/StatisticsTab";
import CampaignList from "@/components/user/campaign_management/CampaignList";
import PenaltyContent from "@/components/user/campaign_management/PenaltyContent";
import type { CampaignApplication, MainTab } from "@/types/campaignManagement";
import layoutStyles from "../../../styles/user/campaign_management/layout.module.css";
import cardStyles from "../../../styles/user/campaign_management/campaign_card.module.css";

/**
 * 목업 캠페인 데이터
 * TODO: 실제로는 API에서 데이터를 가져와야 함
 */
const mockApplications: CampaignApplication[] = [
  {
    id: "1",
    title: "데일리포근 누빔 침대패드 Q 퀸",
    category: "네이버블로그",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/campaign_detail/exdetail_1.png",
    status: "신청",
    remainingDays: 1,
    type: "배송형",
    isUrgent: true,
  },
  {
    id: "2",
    title: "[1만캐시 지급] MBC에브리원 <시골경찰 리턴즈2> 9회 보고 리뷰 쓰자",
    category: "네이버블로그",
    categoryIcon: "/images/brand_logo/naverblog.svg",
    image: "/images/campaign_detail/exdetail_1.png",
    status: "신청",
    remainingDays: 2,
    type: "배송형",
    isUrgent: false,
  },
  {
    id: "3",
    title: "올리브영 신제품 체험단 모집",
    category: "올리브영",
    categoryIcon: "/images/brand_logo/oliveyoung.svg",
    image: "/images/campaign_detail/exdetail_1.png",
    status: "선정",
    remainingDays: 5,
    type: "방문형",
    isUrgent: false,
    subStatus: "content_not_registered", // 아직 콘텐츠 등록 안함
    hasContent: false,
  },
  {
    id: "4",
    title: "쿠팡 신상품 리뷰 이벤트",
    category: "쿠팡",
    categoryIcon: "/images/brand_logo/coupang.svg",
    image: "/images/campaign_detail/exdetail_1.png",
    status: "선정",
    remainingDays: 3,
    type: "배송형",
    isUrgent: false,
    subStatus: "content_registered", // 콘텐츠 등록 완료
    hasContent: true,
  },
  {
    id: "8",
    title: "[올리브영] 헤어케어 제품 리뷰 캠페인",
    category: "올리브영",
    categoryIcon: "/images/brand_logo/oliveyoung.svg",
    image: "/images/campaign_detail/exdetail_1.png",
    status: "선정",
    remainingDays: 5,
    type: "배송형",
    isUrgent: false,
    subStatus: "content_not_registered", // 콘텐츠 등록 안함
    hasContent: false,
  },
  {
    id: "9",
    title: "[네이버쇼핑] 뷰티 제품 체험단",
    category: "네이버쇼핑",
    categoryIcon: "/images/brand_logo/navershop.svg",
    image: "/images/campaign_detail/exdetail_1.png",
    status: "선정",
    remainingDays: 7,
    type: "배송형",
    isUrgent: false,
    subStatus: "receipt_not_registered", // 구매 영수증 등록 안함
    hasContent: false,
  },
  {
    id: "10",
    title: "[쿠팡] 생활용품 체험단 모집",
    category: "쿠팡",
    categoryIcon: "/images/brand_logo/coupang.svg",
    image: "/images/campaign_detail/exdetail_1.png",
    status: "선정",
    remainingDays: 4,
    type: "배송형",
    isUrgent: false,
    subStatus: "receipt_registered", // 구매 영수증 등록 완료
    hasContent: false,
  },
  {
    id: "5",
    title: "유튜브 크리에이터 콘텐츠 제작",
    category: "유튜브",
    categoryIcon: "/images/brand_logo/youtube.svg",
    image: "/images/campaign_detail/exdetail_1.png",
    status: "완료",
    remainingDays: 0,
    type: "방문형",
    isUrgent: false,
  },
  {
    id: "6",
    title: "네이버 쇼핑 리뷰 이벤트",
    category: "네이버쇼핑",
    categoryIcon: "/images/brand_logo/navershop.svg",
    image: "/images/campaign_detail/exdetail_1.png",
    status: "취소/반려",
    remainingDays: 0,
    type: "배송형",
    isUrgent: false,
    subStatus: "content_rejected", // 콘텐츠 반려됨
    hasContent: true,
  },
  {
    id: "7",
    title: "인스타그램 인플루언서 캠페인",
    category: "인스타그램",
    categoryIcon: "/images/brand_logo/insta.svg",
    image: "/images/campaign_detail/exdetail_1.png",
    status: "취소/반려",
    remainingDays: 0,
    type: "방문형",
    isUrgent: false,
    subStatus: "penalty", // 패널티 부과됨
    isPenalty: true,
  },
];

/**
 * 캠페인 관리 메인 페이지 컴포넌트
 */
export default function CampaignManagementPage() {
  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");

  // 통계 탭 상태 (신청 / 선정 / 완료 / 취소반려 / 패널티)
  // 메뉴부분
  const [activeStatTab, setActiveStatTab] = useState<
    "신청" | "선정" | "완료" | "취소/반려" | "패널티"
  >("신청");

  /**
   * 각 상태별 캠페인 개수 계산
   */
  const mockStats = {
    신청: mockApplications.filter((app) => app.status === "신청").length,
    선정: mockApplications.filter((app) => app.status === "선정").length,
    완료: mockApplications.filter((app) => app.status === "완료").length,
    "취소/반려": mockApplications.filter((app) => app.status === "취소/반려")
      .length,
    패널티: 0, // TODO: 실제 패널티 개수 계산 필요
  };

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 상단 탭 네비게이션: 캠페인/포인트/계정/커뮤니티 */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 통계 탭: 신청/선정/완료/취소반려/패널티 */}
        <StatisticsTab
          activeStatTab={activeStatTab}
          setActiveStatTab={setActiveStatTab}
          stats={mockStats}
        />
        {/* 캠페인 목록 또는 패널티 내역 */}
        {activeStatTab === "패널티" ? (
          <div className={cardStyles.campaign_list}>
            <PenaltyContent />
          </div>
        ) : (
          <CampaignList
            campaigns={mockApplications}
            activeStatTab={activeStatTab}
          />
        )}
      </div>
    </div>
  );
}
