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
import { useReviewerProfile } from "@/hooks/user/mypage/useReviewerProfile";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import SubTabNavigation from "@/components/common/mypage/SubTabNavigation";
import ProfileContent from "@/components/common/mypage/ProfileContent";
import BaseModal from "@/components/common/modal/BaseModal";
import type { MainTab } from "@/types/domain/user";
import layoutStyles from "@/styles/user/mypage/mypage_layout.module.css";
import Loading from "@/app/loading";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const { data: profile, isLoading, error } = useReviewerProfile(user?.id);

  const [activeTopTab, setActiveTopTab] = useState<MainTab>("account");
  const [activeSubTab, _setActiveSubTab] = useState<"profile" | "channel">("profile");

  const [userNickname, setUserNickname] = useState("리뷰어");
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);

  const [memberType, setMemberType] = useState<"reviewer" | "partner">("reviewer");
  const [showPartnerInfoModal, setShowPartnerInfoModal] = useState(false);
  const [showServerErrorModal, setShowServerErrorModal] = useState(false);

  // 비로그인 시 리디렉트 (로딩 완료 후에만)
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/user/login");
    }
  }, [isAuthLoading, user, router]);

  // 서버 오류 처리
  useEffect(() => {
    if (error) {
      setShowServerErrorModal(true);
    }
  }, [error]);

  // 서버 프로필에서 유저 정보 로드
  useEffect(() => {
    if (!user) return;

    if (profile) {
      const defaultNicknameMap: Record<string, string> = {
        user_kakao_001: "양치하는고양이",
        user_naver_001: "은지블로그",
      };

      let nickname = profile.nickname || "";
      if (!nickname || nickname === profile.name) {
        nickname = defaultNicknameMap[user.id] || "";
      }

      setUserNickname(nickname);

      if (profile.profile_image) {
        setProfileImage(profile.profile_image);
      }
    }
  }, [user, profile]);

  const handleSubTabChange = (tab: "profile" | "channel") => {
    switch (tab) {
      case "profile":
        break;
      case "channel":
        window.location.href = "/user/mypage/channel";
        break;
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleMemberTypeChange = (type: "reviewer" | "partner") => {
    if (type === "partner") {
      try {
        const stored = localStorage.getItem("partner_accounts");
        const accounts = stored ? (JSON.parse(stored) as { id?: string; email?: string }[]) : [];
        const hasPartnerInfo = accounts.some((a) => a.id === user?.id || a.email === user?.email);
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

  if (isLoading) return <Loading />;

  return (
    <div className={layoutStyles.mypage_container}>
      <main className={layoutStyles.main_content}>
        <TabNavigation activeTab={activeTopTab} setActiveTab={setActiveTopTab} />

        <SubTabNavigation
          activeSubTab={activeSubTab}
          setActiveSubTab={handleSubTabChange}
          basePath="/user/mypage"
          availableTabs={["profile", "channel"]}
        />

        <ProfileContent
          role="리뷰어"
          nickname={userNickname}
          editPath="/user/mypage/edit"
          onLogout={handleLogout}
          profileImage={profileImage}
          showMemberTypeToggle={false}
          activeMemberType={memberType}
          onMemberTypeChange={handleMemberTypeChange}
        />

        {/* 파트너 정보 없음 모달 */}
        <BaseModal
          is_open={showPartnerInfoModal}
          on_close={() => setShowPartnerInfoModal(false)}
          message="광고주 정보가 없습니다.<br>사업자 정보 등록 후 활동할 수 있습니다."
          buttons={["닫기", "등록"]}
          on_cancel={() => setShowPartnerInfoModal(false)}
          on_confirm={() => {
            setShowPartnerInfoModal(false);
            router.push("/user/mypage/edit");
          }}
          type="center"
        />

        {/* E_M5: 서버 오류 모달 */}
        <BaseModal
          is_open={showServerErrorModal}
          on_close={() => setShowServerErrorModal(false)}
          message="일시적인 오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
          buttons={["닫기", "재시도"]}
          on_cancel={() => setShowServerErrorModal(false)}
          on_confirm={() => {
            setShowServerErrorModal(false);
            window.location.reload();
          }}
          type="center"
        />
      </main>
    </div>
  );
}
