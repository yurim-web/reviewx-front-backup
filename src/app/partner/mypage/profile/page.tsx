/* ========================================
   👤 파트너 프로필 탭 전용 페이지
   ======================================== */

/**
 * 파트너 프로필 탭 전용 페이지
 *
 * 목적: 파트너(광고주)의 프로필 정보와 메뉴를 보여주는 독립적인 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/mypage/profile
 *
 * 주요 기능:
 * - 프로필 정보 표시 및 편집
 * - 이용 가이드, 공지사항, FAQ, 카카오톡 상담 메뉴
 * - 로그아웃 기능
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 *
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PartnerTabNavigation from "@/components/partner/campaign_management/TabNavigation";
import SubTabNavigation from "@/components/common/mypage/SubTabNavigation";
import ProfileContent from "@/components/common/mypage/ProfileContent";
import layoutStyles from "../../../../styles/partner/layout.module.css";
import type { PartnerMainTab } from "@/types/domain/partner";
import type { AuthUser } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";

/**
 * 파트너 프로필 탭 전용 페이지 컴포넌트
 */
export default function PartnerProfilePage() {
  // Next.js의 useRouter 훅: 페이지 이동을 위한 라우터 객체
  const router = useRouter();
  const { logout } = useAuth();

  // useState 훅: 컴포넌트의 상태(state)를 관리합니다.
  // activeTopTab: 현재 활성화된 상단 탭 (캠페인/포인트/계정)
  const [activeTopTab, setActiveTopTab] = useState<PartnerMainTab>("account");

  // activeSubTab: 현재 활성화된 서브 탭 (프로필)
  const [activeSubTab, setActiveSubTab] = useState<"profile">("profile");

  // 파트너 정보 상태
  const [partnerName, setPartnerName] = useState("주식회사 청명종합광고기획");
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);

  // 컴포넌트 마운트 시 localStorage에서 파트너 정보 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // 현재 로그인한 사용자 정보 가져오기
        const storedUser = localStorage.getItem('reviewx_auth_user');
        // console.log('🔍 [프로필 페이지] storedUser:', storedUser);

        if (storedUser) {
          const user: AuthUser = JSON.parse(storedUser);
          // console.log('👤 [프로필 페이지] user:', user);

          // partner_accounts에서 최신 정보 가져오기
          const storedAccounts = localStorage.getItem('partner_accounts');
          // console.log('📦 [프로필 페이지] partner_accounts:', storedAccounts);

          if (storedAccounts) {
            const accounts = JSON.parse(storedAccounts);
            // console.log('📋 [프로필 페이지] accounts array:', accounts);

            const partnerAccount = accounts.find((a: any) =>
              a.id === user.id || a.email === user.email
            );
            // console.log('✅ [프로필 페이지] partnerAccount:', partnerAccount);

            if (partnerAccount) {
              // 사업자명 설정
              setPartnerName(partnerAccount.business_name || partnerAccount.name || "주식회사 청명종합광고기획");
              // console.log('🏢 [프로필 페이지] 사업자명:', partnerAccount.business_name);

              // 프로필 이미지 설정
              // console.log('🖼️ [프로필 페이지] profile_image:', partnerAccount.profile_image);
              if (partnerAccount.profile_image) {
                setProfileImage(partnerAccount.profile_image);
                // console.log('✅ [프로필 페이지] 프로필 이미지 설정됨:', partnerAccount.profile_image);
              } else {
                // console.log('❌ [프로필 페이지] profile_image가 없습니다');
              }
            }
          } else {
            // console.log('⚠️ [프로필 페이지] partner_accounts가 없음');
            // partner_accounts가 없으면 reviewx_auth_user에서 가져오기
            if (user.business_name) {
              setPartnerName(user.business_name);
            }
          }
        }
      } catch (error) {
        console.error('❌ [프로필 페이지] 파트너 정보 로드 실패:', error);
      }
    }
  }, []);

  /**
   * 서브 탭 변경 핸들러
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
          nickname={partnerName}
          editPath="/partner/mypage/edit"
          onLogout={handleLogout}
          profileImage={profileImage}
        />
      </div>
    </div>
  );
}
