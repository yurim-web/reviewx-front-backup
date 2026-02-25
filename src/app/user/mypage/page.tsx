/* ========================================
   👤 마이페이지 메인 페이지
   ======================================== */

/**
 * 마이페이지 메인 페이지
 *
 * 목적: 사용자의 프로필 정보, 채널 연결, 메뉴 등을 관리하는 마이페이지입니다.
 *
 * 사용 페이지:
 * - /user/mypage (마이페이지 메인 - 프로필 탭으로 리다이렉트)
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 마이페이지 메인 페이지 컴포넌트
 * 프로필 탭 페이지로 리다이렉트
 */
export default function MypagePage() {
  const router = useRouter();

  useEffect(() => {
    // 메인 마이페이지 접근 시 프로필 탭으로 리다이렉트
    router.replace("/user/mypage/profile");
  }, [router]);

  // 리다이렉트 중에는 아무것도 렌더링하지 않음
  return null;
}
