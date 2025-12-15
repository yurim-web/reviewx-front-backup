/* ========================================
   🔧 SA 관리자 출금 요청 페이지 레이아웃
   ======================================== */

/**
 * SA 관리자 출금 요청 페이지 레이아웃
 *
 * 목적: 출금 요청 페이지의 공통 레이아웃을 제공하는 레이아웃 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal_request (출금 요청 페이지)
 *
 * 주요 기능:
 * - 페이지 레이아웃 구조 제공
 * - 하위 페이지 컴포넌트를 감싸는 컨테이너 역할
 *
 * 학습 포인트:
 * - Next.js의 Layout 컴포넌트는 같은 경로의 모든 페이지에 공통 레이아웃을 적용합니다
 * - children prop을 통해 하위 페이지 컴포넌트를 받아 렌더링합니다
 * - 레이아웃은 페이지 전환 시에도 유지되어 성능을 향상시킵니다
 */

/**
 * 출금 요청 페이지 레이아웃 컴포넌트
 *
 * @param children - 하위 페이지 컴포넌트 (Next.js가 자동으로 전달)
 * @returns 레이아웃으로 감싼 페이지 컴포넌트
 */
export default function WithdrawalRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




