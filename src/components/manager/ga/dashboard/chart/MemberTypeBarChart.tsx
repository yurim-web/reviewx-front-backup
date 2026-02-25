/* ========================================
   
   ======================================== */

/**
 * 회원 유형 막대 차트 컴포넌트
 *
 * 목적: 파트너, 리뷰어의 비율을 세로 프로그레스 바로 표시합니다.
 *
 * 사용 페이지:
 * - MemberStatsSection 컴포넌트 (전체 회원 통계 카드 2)
 *
 */

"use client";

import MemberTypeBarChartCommon from "@/components/manager/common/dashboard/MemberTypeBarChart";

interface MemberTypeBarChartProps {
  totalPartnerPercentage: number;
  totalReviewerPercentage: number;
  activePartnerPercentage: number;
  activeReviewerPercentage: number;
}

export default function MemberTypeBarChart({
  totalPartnerPercentage,
  totalReviewerPercentage,
  activePartnerPercentage,
  activeReviewerPercentage,
}: MemberTypeBarChartProps) {
  // 막대 차트 데이터 생성
  const member_type_bar_data = [
    {
      category: "전체",
      partner: totalPartnerPercentage,
      reviewer: totalReviewerPercentage,
    },
    {
      category: "활성",
      partner: activePartnerPercentage,
      reviewer: activeReviewerPercentage,
    },
  ];

  return <MemberTypeBarChartCommon member_type_bar_data={member_type_bar_data} />;
}
