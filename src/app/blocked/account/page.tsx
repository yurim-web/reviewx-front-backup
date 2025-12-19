/* ========================================
   🚫 정지/탈퇴 안내 페이지
   ======================================== */

/**
 * 정지/탈퇴 안내 페이지
 *
 * 페이지 경로:
 * - /blocked/account
 */

import type { Metadata } from "next";
import BlockedBasePage from "@/components/common/blocked/BlockedBasePage";

export const metadata: Metadata = {
  title: "ReviewX | 정지 · 탈퇴 안내",
};

export default function BlockedAccountInfoPage() {
  return (
    <BlockedBasePage
      message="정지되었거나 탈퇴된 계정입니다."
      buttonLabel="로그인 페이지로 이동"
      buttonHref="/user/login"
      buttonAriaLabel="로그인 페이지로 이동"
    />
  );
}
