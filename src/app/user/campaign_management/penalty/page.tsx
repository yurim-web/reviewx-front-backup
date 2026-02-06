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
 *
 * 패널티 점수 체계:
 * - 0~100점: 경고 조치
 * - 101~150점: 주의 조치
 * - 150점 이상: 정지 조치
 *
 * 일시 정지 기간:
 * - 이용 정지 7일: 7일간 캠페인 참여 제한
 * - 이용 정지 15일: 15일간 캠페인 참여 제한
 * - 이용 정지 30일: 30일간 캠페인 참여 제한
 * - 이용 정지 60일: 60일간 캠페인 참여 제한
 * - 이용 정지 90일: 90일간 캠페인 참여 제한
 * - 이용 정지 120일: 120일간 캠페인 참여 제한
 * - 영구 정지: 영구적으로 캠페인 참여 제한
 *
 * 경고 조치 회원 복구 조건:
 * - 기준 기간(1개월) 동안 캠페인을 참여하면서 패널티가 없었을 경우 복구 가능
 * - 최소 1개 이상의 캠페인에 참여해야 함
 * - 복구 기간 내 패널티가 발생하지 않아야 함
 *
 * 정지 상태 제한사항:
 * - 정지 상태에서는 캠페인 참여 제한 (신청 불가)
 * - 정지 회원이 캠페인 신청 시도 시 "정지 회원은 캠페인 신청이 불가합니다." 모달 표시
 * - 정지 상태에서 캠페인 참여 버튼이 활성화되어 있을 때 자동 비활성화 및 "유효하지 않은 요청입니다." 모달 표시
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CampaignManagementHeader from "@/components/user/campaign_management/CampaignManagementHeader";
import PenaltyContent from "@/components/common/campaign_management/penalty/PenaltyContent";
import type { MainTab } from "@/types/domain/user";
import layoutStyles from "../../../../styles/user/campaign_management/layout.module.css";
import cardStyles from "../../../../styles/user/campaign_management/campaign_card.module.css";
import { userPenaltyData, userPenaltyStatus } from "@/data/user/penaltyData";

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
      // 패널티가 아닌 탭을 클릭하면 해당 탭 전용 페이지로 이동
      switch (tab) {
        case "신청":
          router.push("/user/campaign_management/applied");
          break;
        case "선정":
          router.push("/user/campaign_management/selected");
          break;
        case "완료":
          router.push("/user/campaign_management/completed");
          break;
        case "취소/반려":
          router.push("/user/campaign_management/cancelled");
          break;
      }
    }
  };

  return (
    <div className={layoutStyles.container}>
      {/* 메인 컨텐츠 영역 */}
      <div className={layoutStyles.main_content}>
        {/* 공통 헤더: 상단 탭 네비게이션 + 통계 탭 */}
        <CampaignManagementHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeStatTab={activeStatTab}
          setActiveStatTab={handleStatTabChange}
        />

        {/* 패널티 컨텐츠 영역 */}
        <div className={cardStyles.campaign_list}>
          <PenaltyContent
            penaltyData={userPenaltyData}
            userStatus={userPenaltyStatus}
          />
        </div>
      </div>
    </div>
  );
}
