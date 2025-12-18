/* ========================================
   🚫 차단된 회원 공용 페이지
   ======================================== */

/**
 * 차단된 회원 공용 페이지
 *
 * 목적: 차단된 상태인 사용자가 로그인했을 때
 *       서비스 이용 제한 안내를 보여주는 공용 페이지입니다.
 *
 * 페이지 경로:
 * - /blocked
 *
 * 주요 기능:
 * - 차단 안내 메시지 표시
 * - 회원 탈퇴 버튼 제공
 *
 * 학습 포인트:
 * - Next.js App Router에서의 페이지 컴포넌트 기본 형태
 * - 기본 default export 함수 컴포넌트 패턴
 */

import BlockedUserPage from '@/components/common/BlockedUserPage';

/**
 * 차단된 회원 공용 페이지 컴포넌트
 *
 * @returns JSX.Element - 차단 안내 UI를 렌더링하는 React 컴포넌트
 */
export default function BlockedPage() {
  return <BlockedUserPage />;
}


