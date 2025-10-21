/* ========================================
   ⚠️ 패널티 전용 페이지
   ======================================== */

/**
 * 패널티 전용 페이지
 *
 * 목적: 사용자의 패널티 현황과 내역을 보여주는 독립적인 페이지입니다.
 *
 * 페이지 경로:
 * - /user/campaign_management/penalty
 *
 * 주요 기능:
 * - 패널티 현황 표시 (활동 가능, 경고 조치, 이용 정지, 영구 정지)
 * - 패널티 단계별 진행 상황 시각화 (진행바)
 * - 패널티 내역 리스트 표시 (경고, 주의, 정지, 제재)
 * - 뒤로가기 버튼으로 캠페인 관리 페이지로 이동
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import StatisticsTab from "@/components/user/campaign_management/StatisticsTab";
import PenaltyContent from "@/components/user/campaign_management/PenaltyContent";
import type { MainTab } from "@/types/campaignManagement";
import layoutStyles from "../../../../styles/user/campaign_management/layout.module.css";
import cardStyles from "../../../../styles/user/campaign_management/campaign_card.module.css";

// 임시 데이터 import
import { campaignManagementStats } from "@/data/user/campaign_management/campaignManagementData";

/**
 * 패널티 전용 페이지 컴포넌트
 *
 * React Hook 사용:
 * - useRouter: Next.js의 클라이언트 사이드 라우팅을 위한 훅
 * - 컴포넌트 내부에서 프로그래밍 방식으로 페이지 이동 가능
 */
export default function PenaltyPage() {
  // Next.js의 useRouter 훅을 사용하여 라우팅 기능 가져오기
  // useRouter는 클라이언트 컴포넌트에서만 사용 가능 ("use client" 필요)
  const router = useRouter();

  // 상단 메인 탭 상태 (캠페인 / 포인트)
  const [activeTab, setActiveTab] = useState<MainTab>("campaign");

  // 통계 탭 상태 - 패널티 탭이 활성화된 상태로 설정
  const [activeStatTab, setActiveStatTab] = useState<
    "신청" | "선정" | "완료" | "취소/반려" | "패널티"
  >("패널티");

  // 임시 데이터에서 통계 정보 사용
  const stats = campaignManagementStats;

  /**
   * 통계 탭 변경 핸들러
   * 패널티가 아닌 다른 탭을 클릭하면 캠페인 관리 페이지로 이동
   */
  const handleStatTabChange = (
    tab: "신청" | "선정" | "완료" | "취소/반려" | "패널티"
  ) => {
    if (tab === "패널티") {
      setActiveStatTab(tab);
    } else {
      // 패널티가 아닌 탭을 클릭하면 캠페인 관리 페이지로 이동
      router.push("/user/campaign_management");
    }
  };

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 상단 탭 네비게이션: 캠페인/포인트/계정 */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 통계 탭: 신청/선정/완료/취소반려/패널티 */}
        <StatisticsTab
          activeStatTab={activeStatTab}
          setActiveStatTab={handleStatTabChange}
          stats={stats}
        />

        {/* 패널티 컨텐츠 영역 */}
        <div className={cardStyles.campaign_list}>
          <PenaltyContent />
        </div>
      </div>
    </div>
  );
}
