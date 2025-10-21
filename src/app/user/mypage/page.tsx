/* ========================================
   👤 마이페이지 메인 페이지
   ======================================== */

/**
 * 마이페이지 메인 페이지
 *
 * 목적: 사용자의 프로필 정보, 채널 연결, 메뉴 등을 관리하는 마이페이지입니다.
 *
 * 페이지 경로:
 * - /user/mypage
 *
 * 사용 파일:
 * - 컴포넌트: TabNavigation, SubHeader, ChannelSection, SubTabNavigation
 * - 타입: MainTab
 * - CSS: layout.module.css, navigation.module.css, profile.module.css, channel.module.css
 *
 * 주요 기능:
 * - 프로필 정보 표시 및 편집
 * - 채널 연결 관리 (네이버 블로그, 인스타그램, 유튜브, 틱톡)
 * - 이용 가이드, 공지사항, FAQ, 카카오톡 상담 메뉴
 * - 탭 네비게이션 (프로필/채널)
 * - 상단 고정 탭 네비게이션
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
