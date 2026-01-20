/* ========================================
   💰 파트너 전체 포인트 내역 페이지
   ======================================== */

/**
 * 파트너 전체 포인트 내역 페이지
 *
 * 목적: 모든 파트너 포인트 내역을 보여주는 독립적인 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/point/all
 *
 * 주요 기능:
 * - 모든 포인트 내역 표시 (적립, 출금, 완료, 신청, 취소)
 * - 보유 포인트 현황 표시
 * - 출금 신청 기능
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 *
 * 📌 리팩토링:
 * - 공통 UI는 PartnerPointPageLayout 컴포넌트로 추출
 * - 이 페이지는 전체 내역을 표시하므로 필터링 없음
 */

"use client";

import { useState } from "react";
import PartnerPointPageLayout from "@/components/partner/point/PartnerPointPageLayout";
import { PartnerPointTab, PartnerPointHistory } from "@/types/domain/partner";
import {
  partnerPointHistoryData,
  partnerPointSummary,
} from "@/data/partner/point/pointData";

/**
 * 파트너 전체 포인트 내역 페이지 컴포넌트
 *
 */
export default function PartnerAllPointPage() {
  // 포인트 내역 상태 관리 (기존 데이터 + 새로 추가된 내역)
  const [historyData, setHistoryData] = useState<PartnerPointHistory[]>(
    partnerPointHistoryData
  );
  // 포인트 요약 정보 상태 관리
  const [summary, setSummary] = useState(partnerPointSummary);

  return (
    <PartnerPointPageLayout
      activePointTab="all"
      historyData={historyData}
      summary={summary}
      onHistoryDataChange={setHistoryData}
      onSummaryChange={setSummary}
      // 필터 함수를 전달하지 않으면 전체 내역 표시
    />
  );
}
