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

import { useState, useEffect } from "react";
import PartnerPointPageLayout from "@/components/partner/point/PartnerPointPageLayout";
import { PartnerPointTab, PartnerPointHistory } from "@/types/domain/partner";
import {
  partnerPointHistoryData,
  partnerPointSummary,
  getPartnerPointHistory,
  getPartnerPointSummary,
} from "@/data/partner/point/pointData";
import { useAuth } from "@/hooks/useAuth";

/**
 * 파트너 전체 포인트 내역 페이지 컴포넌트
 *
 */
export default function PartnerAllPointPage() {
  const { user } = useAuth();

  // 포인트 내역 상태 관리 - 로그인된 사용자 기준
  const [historyData, setHistoryData] = useState<PartnerPointHistory[]>([]);
  // 포인트 요약 정보 상태 관리 - 로그인된 사용자 기준
  const [summary, setSummary] = useState(partnerPointSummary);

  // 사용자 포인트 정보 로드
  useEffect(() => {
    if (user?.id) {
      const userHistory = getPartnerPointHistory(user.id);
      const userSummary = getPartnerPointSummary(user.id);

      // localStorage에 데이터가 없으면 샘플 데이터를 fallback으로 사용
      // 이렇게 하면 "충전" 탭과 "사용" 탭처럼 샘플 데이터를 볼 수 있습니다
      setHistoryData(
        userHistory.length > 0 ? userHistory : partnerPointHistoryData
      );
      // 요약 정보도 localStorage에 데이터가 없으면 샘플 데이터 사용
      setSummary(
        userSummary.total_points > 0 || userSummary.available_points > 0
          ? userSummary
          : partnerPointSummary
      );
    } else {
      // 로그인되지 않은 경우 샘플 데이터 표시
      setHistoryData(partnerPointHistoryData);
      setSummary(partnerPointSummary);
    }
  }, [user]);

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
