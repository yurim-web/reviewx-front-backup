/* ========================================
   📭 신청 내역 빈 상태 컴포넌트
   ======================================== */

/**
 * 신청 내역 빈 상태 컴포넌트
 *
 * 목적: 캠페인 신청 내역 페이지에서 신청자 목록이 없을 때 표시되는 빈 상태 메시지입니다.
 *
 * 사용 페이지:
 * - /partner/campaign_application/delivery (배송형 캠페인 신청내역)
 * - /partner/campaign_application/visit (방문형 캠페인 신청내역)
 * - /partner/campaign_application/review (리뷰형 캠페인 신청내역)
 * - /partner/campaign_application/reporter (기자단형 캠페인 신청내역)
 * - /partner/campaign_application/mission (미션형 캠페인 신청내역)
 *
 * 학습 포인트:
 * - 컴포넌트 재사용성: 여러 페이지에서 동일한 UI를 공통으로 사용
 * - 조건부 렌더링: 신청자 목록이 비어있을 때만 표시
 * - CSS 모듈 사용: 인라인 스타일 대신 CSS 모듈로 스타일 관리
 */

"use client";

import React from "react";
import emptyStyles from "@/styles/partner/campaign_application/empty_applicants.module.css";

interface EmptyApplicantsListProps {
  /**
   * 표시할 메시지
   * 기본값: "신청 내역이 없습니다."
   */
  message?: string;
}

/**
 * 신청 내역 빈 상태 컴포넌트
 *
 * @param message - 표시할 메시지 (기본값: "신청 내역이 없습니다.")
 * @returns 빈 상태 메시지를 표시하는 JSX 요소
 */
export default function EmptyApplicantsList({
  message = "신청 내역이 없습니다.",
}: EmptyApplicantsListProps) {
  return (
    <div className={emptyStyles.empty_container}>
      <p className={emptyStyles.empty_message}>{message}</p>
    </div>
  );
}

