/* ========================================
   마이페이지 프로필 탭 페이지
   ======================================== */

/**
 * ProfilePage
 *
 * 목적: 사용자의 프로필 정보와 마이페이지 메뉴를 보여주는 페이지
 *
 * 사용 페이지:
 * - /user/mypage/profile (프로필 탭)
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface LocalAccount {
  id?: string;
  email?: string;
  name?: string;
  nickname?: string;
  profile_image?: string;
}
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import SubTabNavigation from "@/components/common/mypage/SubTabNavigation";
import ProfileContent from "@/components/common/mypage/ProfileContent";
import BaseModal from "@/components/common/modal/BaseModal";
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
  const [activeSubTab, _setActiveSubTab] = useState<"profile" | "channel">(
    "profile",
  );

  // 유저 정보 상태
  const [userNickname, setUserNickname] = useState("리뷰어");
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);

  // 회원 유형 상태 (리뷰어/광고주)
  const [memberType, setMemberType] = useState<"reviewer" | "partner">("reviewer");
  // 광고주 정보 없음 모달 (리뷰어 → 광고주 전환 시)
  const [showPartnerInfoModal, setShowPartnerInfoModal] = useState(false);

  // 컴포넌트 마운트 시 localStorage에서 유저 정보 로드
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      try {
        const storedAccounts = localStorage.getItem("user_accounts");
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts) as LocalAccount[];
          const userAccountIndex = accounts.findIndex(
            (a) => a.id === user.id || a.email === user.email,
          );
          const userAccount =
            userAccountIndex >= 0 ? accounts[userAccountIndex] : null;

          if (userAccount) {
            const defaultNicknameMap: Record<string, string> = {
              user_kakao_001: "양치하는고양이",
              user_naver_001: "은지블로그",
            };

            let nickname = userAccount.nickname || "";
            if (!nickname || nickname === userAccount.name) {
              nickname =
                defaultNicknameMap[userAccount.id || user.id] || "";

              if (nickname && userAccountIndex >= 0) {
                accounts[userAccountIndex] = {
                  ...accounts[userAccountIndex],
                  nickname,
                };
                localStorage.setItem(
                  "user_accounts",
                  JSON.stringify(accounts),
                );
              }
            }

            setUserNickname(nickname);

            if (userAccount.profile_image) {
              setProfileImage(userAccount.profile_image);
            }
          }
        }
      } catch (_error) {
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
    if (type === "partner") {
      // 광고주(파트너) 정보 등록 여부 확인
      try {
        const stored = localStorage.getItem("partner_accounts");
        const accounts = stored ? (JSON.parse(stored) as { id?: string; email?: string }[]) : [];
        const hasPartnerInfo = accounts.some(
          (a) => a.id === user?.id || a.email === user?.email,
        );
        if (!hasPartnerInfo) {
          setShowPartnerInfoModal(true);
          return;
        }
      } catch {
        setShowPartnerInfoModal(true);
        return;
      }
      setMemberType("partner");
      router.push("/partner/mypage");
      return;
    }
    setMemberType(type);
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

        {/* 광고주 정보 없음 모달: 등록 클릭 시 파트너 내 정보 수정 페이지로 이동 */}
        <BaseModal
          is_open={showPartnerInfoModal}
          on_close={() => setShowPartnerInfoModal(false)}
          message="광고주 정보가 없습니다.<br>사업자 정보 등록 후 활동할 수 있습니다."
          buttons={["닫기", "등록"]}
          on_cancel={() => setShowPartnerInfoModal(false)}
          on_confirm={() => {
            setShowPartnerInfoModal(false);
            router.push("/partner/mypage/edit");
          }}
          type="center"
        />
      </main>
    </div>
  );
}
