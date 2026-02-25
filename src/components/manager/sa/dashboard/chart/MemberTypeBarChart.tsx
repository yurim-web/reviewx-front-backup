/* ========================================
   📊 회원 유형 막대 차트 컴포넌트
   ======================================== */

/**
 * 회원 유형 막대 차트 컴포넌트
 *
 * 목적: 파트너, 리뷰어의 비율을 세로 프로그레스 바로 표시합니다.
 *
 * 사용 페이지:
 * - /manager_sa (대시보드 페이지) - MemberTypeSection
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
  // props로 받은 비율 데이터를 member_type_bar_data 형식으로 변환
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
