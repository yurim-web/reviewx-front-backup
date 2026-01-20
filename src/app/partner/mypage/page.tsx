/* ========================================
   👤 파트너 마이페이지
   ======================================== */

/**
 * 파트너 마이페이지
 *
 * 목적: 파트너(광고주)의 프로필 정보와 메뉴를 보여주는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/mypage
 *
 * 주요 기능:
 * - 프로필 정보 표시 및 편집
 * - 이용 가이드, 공지사항, FAQ, 카카오톡 상담 메뉴
 * - 로그아웃 기능
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PartnerTabNavigation from "@/components/partner/campaign_management/TabNavigation";
import SubTabNavigation from "@/components/common/mypage/SubTabNavigation";
import ProfileContent from "@/components/common/mypage/ProfileContent";
import layoutStyles from "../../../styles/partner/layout.module.css";
import type { PartnerMainTab } from "@/types/domain/partner";

/**
 * 파트너 마이페이지 컴포넌트
 */
export default function PartnerMypagePage() {
  // Next.js의 useRouter 훅: 페이지 이동을 위한 라우터 객체
  const router = useRouter();

  // useState 훅: 컴포넌트의 상태(state)를 관리합니다.
  // activeTopTab: 현재 활성화된 상단 탭 (캠페인/포인트/계정 등)
  // setActiveTopTab: activeTopTab 값을 변경하는 함수
  const [activeTopTab, setActiveTopTab] = useState<PartnerMainTab>("account");

  // activeSubTab: 현재 활성화된 서브 탭 (프로필)
  const [activeSubTab, setActiveSubTab] = useState<"profile">("profile");

  /**
   * 서브 탭 변경 핸들러
   *
   * SubTabNavigation 컴포넌트가 요구하는 함수 타입에 맞추기 위한 핸들러입니다.
   * 파트너는 프로필 탭만 있으므로 실제로는 사용되지 않지만, 타입 호환성을 위해 필요합니다.
   */
  const handleSubTabChange = (tab: "profile" | "channel") => {
    // 파트너는 프로필만 있으므로 상태만 업데이트
    if (tab === "profile") {
      setActiveSubTab(tab);
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
    // 예: router.push('/partner/login');
    console.log("로그아웃 처리");
  };

  return (
    <div className={layoutStyles.partner_dashboard_container}>
      <main className={layoutStyles.partner_main_content}>
        {/* 상단 탭 네비게이션: 캠페인/포인트/계정 등 */}
        <PartnerTabNavigation
          activeTab={activeTopTab}
          setActiveTab={setActiveTopTab}
        />

        {/* 서브 탭 네비게이션: 프로필 */}
        <SubTabNavigation
          activeSubTab={activeSubTab}
          setActiveSubTab={handleSubTabChange}
          basePath="/partner/mypage"
          availableTabs={["profile"]}
        />

        {/* 마이페이지 컨테이너 */}
        <section className={layoutStyles.mypage_container}>
          {/* 
            ProfileContent 공통 컴포넌트 사용
            Props로 필요한 데이터를 전달합니다:
            - role: 사용자 역할 ("광고주")
            - nickname: 회사명 또는 닉네임
            - editPath: 내 정보 수정 페이지 경로
            - onLogout: 로그아웃 버튼 클릭 시 실행할 함수
          */}
          <ProfileContent
            role="광고주"
            nickname="주식회사 청명종합광고기획"
            editPath="/partner/mypage/edit"
            onLogout={handleLogout}
          />
        </section>
      </main>
    </div>
  );
}
