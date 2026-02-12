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

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PartnerTabNavigation from "@/components/partner/campaign_management/TabNavigation";
import SubTabNavigation from "@/components/common/mypage/SubTabNavigation";
import ProfileContent from "@/components/common/mypage/ProfileContent";
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import type { PartnerMainTab } from "@/types/domain/partner";
import { withPartnerAuth } from "@/components/auth/withAuth";
import { useAuth } from "@/hooks/useAuth";

/**
 * 파트너 마이페이지 컴포넌트
 */
function PartnerMypagePage() {
  // Next.js의 useRouter 훅: 페이지 이동을 위한 라우터 객체
  const router = useRouter();
  const { user, logout } = useAuth();

  // useState 훅: 컴포넌트의 상태(state)를 관리합니다.
  // activeTopTab: 현재 활성화된 상단 탭 (캠페인/포인트/계정 등)
  // setActiveTopTab: activeTopTab 값을 변경하는 함수
  const [activeTopTab, setActiveTopTab] = useState<PartnerMainTab>("account");

  // activeSubTab: 현재 활성화된 서브 탭 (프로필)
  const [activeSubTab, setActiveSubTab] = useState<"profile">("profile");

  // 프로필 이미지 상태
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);

  // 회원 유형 상태 (리뷰어/광고주)
  const [memberType, setMemberType] = useState<"reviewer" | "partner">("partner");

  // 컴포넌트 마운트 시 localStorage에서 프로필 이미지 로드
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      try {
        const storedAccounts = localStorage.getItem('partner_accounts');
        // console.log('📦 [마이페이지] partner_accounts:', storedAccounts);

        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts);
          const partnerAccount = accounts.find((a: any) =>
            a.id === user.id || a.email === user.email
          );
          // console.log('✅ [마이페이지] partnerAccount:', partnerAccount);

          if (partnerAccount?.profile_image) {
            setProfileImage(partnerAccount.profile_image);
            // console.log('🖼️ [마이페이지] 프로필 이미지 설정됨:', partnerAccount.profile_image);
          } else {
            // console.log('❌ [마이페이지] profile_image가 없습니다');
          }
        }
      } catch (error) {
        console.error('❌ [마이페이지] 프로필 이미지 로드 실패:', error);
      }
    }
  }, [user]);

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

  const handleLogout = () => {
    logout();
  };

  /**
   * 회원 유형 변경 핸들러
   * 리뷰어 ↔ 광고주 간 전환
   */
  const handleMemberTypeChange = (type: "reviewer" | "partner") => {
    setMemberType(type);

    // 리뷰어로 전환 시 유저 마이페이지로 이동
    if (type === "reviewer") {
      router.push("/user/mypage/profile");
    }
  };

  return (
    <div className={layoutStyles.mypage_container}>
      {/* 메인 컨텐츠 */}
      <div className={layoutStyles.main_content}>
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
          nickname={user?.business_name || user?.name || "파트너"}
          editPath="/partner/mypage/edit"
          onLogout={handleLogout}
          profileImage={profileImage}
          showMemberTypeToggle={true}
          activeMemberType={memberType}
          onMemberTypeChange={handleMemberTypeChange}
        />
      </div>
    </div>
  );
}

// 파트너 전용 페이지로 보호
export default withPartnerAuth(PartnerMypagePage);
