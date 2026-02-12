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
 */

import BlockedBasePage from "@/components/common/blocked/BlockedBasePage";

export default function PartnerBlockedPage() {
  return (
    <BlockedBasePage
      message="서비스 이용이 제한되었습니다."
      buttonLabel="회원 탈퇴"
      buttonHref="/user/login"
      buttonAriaLabel="회원 탈퇴"
    />
  );
}
