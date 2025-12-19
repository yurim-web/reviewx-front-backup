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
