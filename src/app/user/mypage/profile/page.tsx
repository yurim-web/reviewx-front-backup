/* ========================================
   👤 프로필 탭 전용 페이지
   ======================================== */

/**
 * 프로필 탭 전용 페이지
 *
 * 목적: 사용자의 프로필 정보와 메뉴를 보여주는 독립적인 페이지입니다.
 *
 * 페이지 경로:
 * - /user/mypage/profile
 *
 * 주요 기능:
 * - 프로필 정보 표시 및 편집
 * - 이용 가이드, 공지사항, FAQ, 카카오톡 상담 메뉴
 * - 로그아웃 기능
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 *
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import SubTabNavigation from "@/components/common/mypage/SubTabNavigation";
import ProfileContent from "@/components/common/mypage/ProfileContent";
import type { MainTab } from "@/types/user/user";
import layoutStyles from "../../../../styles/user/mypage/layout.module.css";

/**
 * 프로필 탭 전용 페이지 컴포넌트
 */
export default function ProfilePage() {
  // Next.js의 useRouter 훅: 페이지 이동을 위한 라우터 객체
  const router = useRouter();

  // useState 훅: 컴포넌트의 상태(state)를 관리합니다.
  // activeTopTab: 현재 활성화된 상단 탭 (캠페인/포인트/계정/커뮤니티)
  const [activeTopTab, setActiveTopTab] = useState<MainTab>("account");

  // activeSubTab: 현재 활성화된 서브 탭 (프로필/채널)
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "channel">(
    "profile"
  );

  /**
   * 서브 탭 변경 핸들러
   * 각 탭 클릭 시 해당 페이지로 이동
   *
   * switch 문: 여러 조건을 비교할 때 사용하는 JavaScript 문법입니다.
   */
  const handleSubTabChange = (tab: "profile" | "channel") => {
    switch (tab) {
      case "profile":
        // 현재 페이지이므로 아무것도 하지 않음
        break;
      case "channel":
        // window.location.href: 브라우저의 현재 URL을 변경하여 페이지 이동
        window.location.href = "/user/mypage/channel";
        break;
    }
  };

  /**
   * 로그아웃 핸들러
   *
   * 로그아웃 버튼 클릭 시 실행되는 함수입니다.
   * TODO: 실제 로그아웃 로직 구현 필요 (세션 삭제, 쿠키 삭제 등)
   */
  const handleLogout = () => {
    // TODO: 실제 로그아웃 API 호출
    // 예: await logoutAPI();
    // 예: localStorage.removeItem('token');
    // 예: router.push('/user/login');
    console.log("로그아웃 처리");
  };

  return (
    <div className={layoutStyles.mypage_container}>
      {/* 메인 컨텐츠 */}
      <main className={layoutStyles.main_content}>
        {/* 상단 탭 네비게이션: 캠페인/포인트/계정/커뮤니티 */}
        <TabNavigation
          activeTab={activeTopTab}
          setActiveTab={setActiveTopTab}
        />

        {/* 서브 탭 (프로필/채널·스토어) */}
        <SubTabNavigation
          activeSubTab={activeSubTab}
          setActiveSubTab={handleSubTabChange}
          basePath="/user/mypage"
          availableTabs={["profile", "channel"]}
        />

        {/* 
          ProfileContent 공통 컴포넌트 사용
          Props로 필요한 데이터를 전달합니다:
          - role: 사용자 역할 ("리뷰어")
          - nickname: 사용자 닉네임
          - editPath: 내 정보 수정 페이지 경로
          - onLogout: 로그아웃 버튼 클릭 시 실행할 함수
        */}
        <ProfileContent
          role="리뷰어"
          nickname="양치하는고양이123456"
          editPath="/user/mypage/edit"
          onLogout={handleLogout}
        />
      </main>
    </div>
  );
}
