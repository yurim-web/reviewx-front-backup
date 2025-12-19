/* ========================================
   🚫 이용 제한 안내 페이지
   ======================================== */

/**
 * 이용 제한 안내 페이지
 *
 * 페이지 경로:
 * - /blacklist_info
 */

import type { Metadata } from "next";
import BlockedBasePage from "@/components/common/blocked/BlockedBasePage";

export const metadata: Metadata = {
  title: "ReviewX | 이용 제한 안내",
};

export default function BlacklistInfoPage() {
  return (
    <BlockedBasePage
      message="서비스 이용이 제한되었습니다."
      buttonLabel="회원 탈퇴"
      buttonHref="/user/login"
      buttonAriaLabel="회원 탈퇴"
    />
  );
}
