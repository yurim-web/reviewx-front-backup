/* ========================================
   📊 SA 관리자 진행 상황 페이지
   ======================================== */

/**
 * SA 관리자 진행 상황 페이지
 *
 * 목적: SA 관리자가 캠페인 진행 상황을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_sa/campaign/progress
 *
 * 실무에서 사용하는 패턴:
 * - 공통 페이지 컴포넌트(ProgressPageCommon)를 사용하여 코드 중복을 제거합니다
 * - manager_type='sa'를 전달하여 SA 관리자에 맞는 데이터와 스타일을 사용합니다
 * - 각 경로에서는 공통 컴포넌트를 wrapper로 사용하는 간단한 구조입니다
 *
 * 주요 기능:
 * - 상단 통계 카드 (오픈 예정, 진행 중, 신청 중, 전체, 종료, 취소)
 * - 필터 섹션 (날짜, 검색, 상태, 유형, 채널, 정렬, 저장)
 * - 캠페인 목록 테이블 (체크박스, 번호, 파트너명, 캠페인명, 유형, 채널, 상태, 모집 수, 신청 수, 진행 확인)
 *
 */

'use client';

import ProgressPageCommon from '@/components/manager/common/campaign/progress/ProgressPageCommon';

/**
 * SA 관리자 진행 상황 페이지 컴포넌트
 *
 * 학습 포인트:
 * - 공통 컴포넌트를 사용하여 코드 중복을 제거하는 방법
 * - Props를 통해 컴포넌트의 동작을 제어하는 방법
 * - Next.js 페이지 컴포넌트는 라우트 경로에 따라 자동으로 렌더링됩니다
 *
 * @returns SA 관리자 진행 상황 페이지 JSX 요소
 */
export default function ProgressPage() {
  // 공통 페이지 컴포넌트를 사용합니다
  // manager_type='sa'를 전달하여 SA 관리자에 맞는 데이터와 스타일을 사용합니다
  return <ProgressPageCommon manager_type="sa" />;
}
