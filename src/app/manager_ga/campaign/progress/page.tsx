/* ========================================
   📊 GA 관리자 진행 상황 페이지
   ======================================== */

/**
 * GA 관리자 진행 상황 페이지
 *
 * 목적: GA 관리자가 캠페인 진행 상황을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/campaign/progress
 *
 * 실무에서 사용하는 패턴:
 * - 공통 페이지 컴포넌트(ProgressPageCommon)를 사용하여 코드 중복을 제거합니다
 * - manager_type='ga'를 전달하여 GA 관리자에 맞는 데이터와 스타일을 사용합니다
 * - 각 경로에서는 공통 컴포넌트를 wrapper로 사용하는 간단한 구조입니다
 *
 * 주요 기능:
 * - 상단 통계 카드 (오픈 예정, 진행 중, 신청 중, 전체, 종료, 취소)
 * - 필터 섹션 (날짜, 검색, 상태, 유형, 채널, 정렬, 저장)
 * - 캠페인 목록 테이블 (체크박스, 번호, 파트너명, 캠페인명, 유형, 채널, 상태, 모집 수, 신청 수, 지급 포인트)
 *
 */

"use client";

import { useCallback } from "react";
import ProgressPageCommon from "@/components/manager/common/campaign/progress/ProgressPageCommon";
import Loading from "@/app/loading";
import { useAdminCampaigns } from "@/hooks/manager/ga/useAdminCampaigns";

/**
 * GA 관리자 진행 상황 페이지 컴포넌트
 */
export default function ProgressPage() {
  const { campaigns, isLoading, reportCampaign } = useAdminCampaigns();

  // mutation 시그니처를 컴포넌트 prop 시그니처로 변환
  const handleReport = useCallback(
    async (campaignId: number, body: { reportCode: string; reportReason?: string }) => {
      await reportCampaign({ campaignId, body });
    },
    [reportCampaign]
  );

  if (isLoading) return <Loading />;
  return (
    <ProgressPageCommon manager_type="ga" campaigns={campaigns} onReportCampaign={handleReport} />
  );
}
