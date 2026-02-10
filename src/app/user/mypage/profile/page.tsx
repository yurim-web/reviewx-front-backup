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

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import SubTabNavigation from "@/components/common/mypage/SubTabNavigation";
import ProfileContent from "@/components/common/mypage/ProfileContent";
import type { MainTab } from "@/types/domain/user";
import layoutStyles from "@/styles/user/mypage/mypage_layout.module.css";

/**
 * 프로필 탭 전용 페이지 컴포넌트
 */
export default function ProfilePage() {
  // Next.js의 useRouter 훅: 페이지 이동을 위한 라우터 객체
  const router = useRouter();

  // useAuth 훅: 인증 관련 기능 (로그아웃 등)
  const { user, logout } = useAuth();

  // useState 훅: 컴포넌트의 상태(state)를 관리합니다.
  // activeTopTab: 현재 활성화된 상단 탭 (캠페인/포인트/계정/커뮤니티)
  const [activeTopTab, setActiveTopTab] = useState<MainTab>("account");

  // activeSubTab: 현재 활성화된 서브 탭 (프로필/채널)
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "channel">(
    "profile"
  );

  // 유저 정보 상태
  const [userNickname, setUserNickname] = useState("리뷰어");
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);

  // 회원 유형 상태 (리뷰어/광고주)
  const [memberType, setMemberType] = useState<"reviewer" | "partner">("reviewer");

  // 컴포넌트 마운트 시 localStorage에서 유저 정보 로드
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      try {
        const storedAccounts = localStorage.getItem('user_accounts');
        console.log('📦 [프로필 페이지] user_accounts:', storedAccounts);

        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts);
          const userAccountIndex = accounts.findIndex((a: any) =>
            a.id === user.id || a.email === user.email
          );
          const userAccount = userAccountIndex >= 0 ? accounts[userAccountIndex] : null;
          console.log('✅ [프로필 페이지] userAccount:', userAccount);

          if (userAccount) {
            // 기본 닉네임 데이터 매핑 (user_accounts에 nickname이 없을 때 사용)
            const defaultNicknameMap: Record<string, string> = {
              'user_kakao_001': '양치하는고양이',
              'user_naver_001': '은지블로그',
            };
            
            // nickname이 없거나 name과 같은 경우 기본 데이터에서 가져오기
            let nickname = userAccount.nickname || "";
            if (!nickname || nickname === userAccount.name) {
              nickname = defaultNicknameMap[userAccount.id || user.id] || "";
              
              // user_accounts에 nickname 업데이트
              if (nickname && userAccountIndex >= 0) {
                accounts[userAccountIndex] = {
                  ...accounts[userAccountIndex],
                  nickname: nickname,
                };
                localStorage.setItem('user_accounts', JSON.stringify(accounts));
                console.log('✅ [프로필 페이지] user_accounts nickname 자동 업데이트:', {
                  id: userAccount.id,
                  oldNickname: userAccount.nickname,
                  newNickname: nickname,
                });
              }
            }
            
            // 닉네임 설정 (name을 fallback으로 사용하지 않음)
            setUserNickname(nickname);
            console.log('👤 [프로필 페이지] 닉네임:', {
              nickname: userAccount.nickname,
              name: userAccount.name,
              finalNickname: nickname,
            });

            // 프로필 이미지 설정
            if (userAccount.profile_image) {
              setProfileImage(userAccount.profile_image);
              console.log('🖼️ [프로필 페이지] 프로필 이미지 설정됨:', userAccount.profile_image);
            }
          }
        }
      } catch (error) {
        console.error('❌ [프로필 페이지] 유저 정보 로드 실패:', error);
      }
    }
  }, [user]);

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

  const handleLogout = () => {
    // 실제 로그아웃 처리만 수행하고, 페이지 이동은 ProfileContent의 모달 확인 버튼에서 처리
    logout();
  };

  /**
   * 회원 유형 변경 핸들러
   * 리뷰어 ↔ 광고주 간 전환
   */
  const handleMemberTypeChange = (type: "reviewer" | "partner") => {
    setMemberType(type);

    // 광고주로 전환 시 파트너 마이페이지로 이동
    if (type === "partner") {
      router.push("/partner/mypage");
    }
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
          nickname={userNickname}
          editPath="/user/mypage/edit"
          onLogout={handleLogout}
          profileImage={profileImage}
          showMemberTypeToggle={true}
          activeMemberType={memberType}
          onMemberTypeChange={handleMemberTypeChange}
        />
      </main>
    </div>
  );
}
