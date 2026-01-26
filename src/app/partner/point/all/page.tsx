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
    console.log('🔍 [포인트 페이지] user:', user);
    if (user?.id) {
      console.log('🔍 [포인트 페이지] user.id:', user.id);
      const userHistory = getPartnerPointHistory(user.id);
      const userSummary = getPartnerPointSummary(user.id);
      console.log('🔍 [포인트 페이지] userHistory:', userHistory);
      console.log('🔍 [포인트 페이지] userSummary:', userSummary);

      // 파트너 테스트 계정인 경우 목업 데이터와 실제 충전 내역을 합침
      if (user.id === 'partner_test_001') {
        console.log('✅ [포인트 페이지] 파트너 테스트 계정 감지');
        // 목업 데이터와 실제 데이터를 합쳐서 표시
        const combinedHistory = [...userHistory, ...partnerPointHistoryData];
        console.log('🔍 [포인트 페이지] combinedHistory:', combinedHistory);
        setHistoryData(combinedHistory);
      } else {
        // 다른 계정은 실제 데이터만 표시
        setHistoryData(userHistory);
      }

      setSummary(userSummary);
    } else {
      console.log('⚠️ [포인트 페이지] 로그인되지 않음');
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
