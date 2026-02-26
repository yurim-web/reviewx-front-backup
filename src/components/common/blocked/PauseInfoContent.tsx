/* ========================================
   서비스 일시 정지/탈퇴 안내 컴포넌트
   ======================================== */

/**
 * PauseInfoContent
 *
 * 목적: 서비스 일시 정지 또는 탈퇴된 회원에게 안내 메시지를 표시
 *
 * 사용 페이지:
 * - /pause_info (서비스 일시 정지/탈퇴 안내 페이지)
 */

"use client";

import { useRouter } from "next/navigation";
import BlockedBasePage from "@/components/common/blocked/BlockedBasePage";

export default function PauseInfoContent() {
  const router = useRouter();

  const handleBack = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    router.back();
  };

  return (
    <BlockedBasePage
      message="서비스 일시 정지 혹은 탈퇴된 회원입니다."
      buttonLabel="돌아가기"
      buttonHref="/user/login"
      buttonAriaLabel="돌아가기"
      onClick={handleBack}
    />
  );
}
