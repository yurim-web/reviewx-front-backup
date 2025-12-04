/* ========================================
   🚫 파트너 차단 페이지
   ======================================== */

/**
 * 파트너 차단 페이지
 *
 * 목적: 차단된 파트너 회원이 로그인했을 때 서비스 이용 제한 안내를 표시하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/blocked
 *
 * 주요 기능:
 * - 차단 안내 메시지 표시
 * - 회원 탈퇴 버튼 제공
 */

import BlockedUserPage from '@/components/common/BlockedUserPage';

/**
 * 파트너 차단 페이지 컴포넌트
 *
 * @returns JSX.Element - 파트너 차단 페이지 UI
 */
export default function PartnerBlockedPage() {
  return <BlockedUserPage />;
}


