/* ========================================
   🚫 차단된 회원 공용 페이지
   ======================================== */

/**
 * 차단된 회원 공용 페이지
 *
 * 페이지 경로:
 * - /blocked
 */

import type { Metadata } from "next";
import BlockedBasePage from "@/components/common/blocked/BlockedBasePage";

export const metadata: Metadata = {
  title: "ReviewX | 이용 제한 안내",
};

export default function BlockedPage() {
  return (
    <BlockedBasePage
      message="서비스 이용이 제한되었습니다."
      buttonLabel="회원 탈퇴"
      buttonHref="/user/login"
      buttonAriaLabel="회원 탈퇴"
    />
  );
}
