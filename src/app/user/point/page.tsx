/* ========================================
   💰 포인트 관리 페이지
   ======================================== */

/**
 * 포인트 관리 페이지
 *
 * 목적: 사용자의 포인트 현황, 내역, 출금 신청을 관리하는 포인트 전용 페이지입니다.
 *
 * 페이지 경로:
 * - /user/point
 *
 * 사용 파일:
 * - 컴포넌트: Header, TabNavigation, PointTabNavigation
 * - 타입: MainTab, PointTab
 * - 데이터: pointHistoryData
 * - CSS: point.module.css
 *
 * 주요 기능:
 * - 보유 포인트 현황 표시
 * - 포인트 내역 조회 (전체/적립/출금)
 * - 출금 신청 기능
 * - 포인트 상태별 필터링 (적립, 완료, 신청, 취소)
 * - 상단 고정 탭 네비게이션
 * - 포인트 내역 상세 정보 표시
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 포인트 메인 페이지 컴포넌트
 * 전체 탭 페이지로 리다이렉트
 */
export default function PointPage() {
  const router = useRouter();

  useEffect(() => {
    // 메인 포인트 페이지 접근 시 전체 탭으로 리다이렉트
    router.replace("/user/point/all");
  }, [router]);

  // 리다이렉트 중에는 아무것도 렌더링하지 않음
  return null;
}
