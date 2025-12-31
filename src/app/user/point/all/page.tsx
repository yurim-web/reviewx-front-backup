/* ========================================
   💰 전체 포인트 내역 페이지
   ======================================== */

/**
 * 전체 포인트 내역 페이지
 *
 * 목적: 모든 포인트 내역을 보여주는 독립적인 페이지입니다.
 *
 * 페이지 경로:
 * - /user/point/all
 *
 * 주요 기능:
 * - 모든 포인트 내역 표시 (적립, 출금, 완료, 신청, 취소)
 * - 보유 포인트 현황 표시
 * - 출금 신청 기능
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 *
 * 리팩토링 설명:
 * - 공통 컴포넌트(PointHistoryPage)를 사용하여 코드 중복을 제거했습니다.
 * - 필터링 로직만 props로 전달하여 각 페이지의 특성을 유지합니다.
 */

"use client";

import PointHistoryPage from "@/components/user/point/PointHistoryPage";
import { PointHistory } from "@/types/user/user";

/**
 * 전체 포인트 내역 페이지 컴포넌트
 *
 * 설명:
 * - 공통 컴포넌트를 사용하여 간단하게 구현했습니다.
 * - 필터 함수를 전달하여 모든 내역을 표시합니다.
 *
 * React 학습 포인트:
 * - 컴포넌트 재사용성: 공통 컴포넌트를 여러 곳에서 사용
 * - Props 전달: 부모 컴포넌트에서 자식 컴포넌트로 데이터/함수 전달
 */
export default function AllPointPage() {
  /**
   * 전체 내역 필터 함수
   *
   * 설명:
   * - 모든 포인트 내역을 표시하기 위해 항상 true를 반환합니다.
   * - 필터링 없이 모든 데이터를 보여줍니다.
   *
   * JavaScript 학습 포인트:
   * - 화살표 함수: () => true 형태로 항상 true 반환
   * - 함수를 변수에 저장하여 props로 전달
   */
  const filterAllHistory = (_history: PointHistory) => true;

  return (
    <PointHistoryPage activePointTab="all" filterFunction={filterAllHistory} />
  );
}
