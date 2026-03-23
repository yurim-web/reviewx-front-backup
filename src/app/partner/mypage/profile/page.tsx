/* ========================================
   파트너 프로필 탭 전용 페이지
   ======================================== */

/**
 * 파트너 프로필 탭 전용 페이지
 *
 * 목적: 파트너(광고주)의 프로필 정보와 메뉴를 보여주는 독립적인 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/mypage/profile
 */

"use client";

import { useState } from "react";
import PartnerTabNavigation from "@/components/partner/campaign_management/TabNavigation";
import SubTabNavigation from "@/components/common/mypage/SubTabNavigation";
import ProfileContent from "@/components/common/mypage/ProfileContent";
import Loading from "@/app/loading";
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import type { PartnerMainTab } from "@/types/domain/partner";
import { useAuth } from "@/hooks/useAuth";
import { usePartnerProfile } from "@/hooks/partner/mypage/usePartnerMypage";

/**
 * 파트너 프로필 탭 전용 페이지 컴포넌트
 */
export default function PartnerProfilePage() {
  const { logout } = useAuth();
  const { data: profile, isLoading } = usePartnerProfile();

  const [activeTopTab, setActiveTopTab] = useState<PartnerMainTab>("account");
  const [activeSubTab, setActiveSubTab] = useState<"profile">("profile");

  const handleSubTabChange = (tab: "profile" | "channel") => {
    if (tab === "profile") {
      setActiveSubTab(tab);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) return <Loading />;

  return (
    <div className={layoutStyles.mypage_container}>
      {/* 메인 컨텐츠 */}
      <div className={layoutStyles.main_content}>
        {/* 상단 탭 네비게이션: 캠페인/포인트/계정 등 */}
        <PartnerTabNavigation activeTab={activeTopTab} setActiveTab={setActiveTopTab} />

        {/* 서브 탭 네비게이션: 프로필 */}
        <SubTabNavigation
          activeSubTab={activeSubTab}
          setActiveSubTab={handleSubTabChange}
          basePath="/partner/mypage"
          availableTabs={["profile"]}
        />

        {/* ProfileContent 공통 컴포넌트 — API에서 가져온 프로필 데이터 전달 */}
        <ProfileContent
          role="광고주"
          nickname={profile?.businessName || profile?.name || "파트너"}
          editPath="/partner/mypage/edit"
          onLogout={handleLogout}
          profileImage={profile?.profileImage || undefined}
        />
      </div>
    </div>
  );
}
