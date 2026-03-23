/* ========================================
   👤 파트너 마이페이지
   ======================================== */

/**
 * 파트너 마이페이지
 *
 * 목적: 파트너(광고주)의 프로필 정보와 메뉴를 보여주는 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/mypage
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PartnerTabNavigation from "@/components/partner/campaign_management/TabNavigation";
import SubTabNavigation from "@/components/common/mypage/SubTabNavigation";
import ProfileContent from "@/components/common/mypage/ProfileContent";
import BaseModal from "@/components/common/modal/BaseModal";
import Loading from "@/app/loading";
import layoutStyles from "@/styles/partner/partner_layout.module.css";
import type { PartnerMainTab } from "@/types/domain/partner";
import { withPartnerAuth } from "@/components/auth/withAuth";
import { useAuth } from "@/hooks/useAuth";
import { usePartnerProfile } from "@/hooks/partner/mypage/usePartnerMypage";

/**
 * 파트너 마이페이지 컴포넌트
 */
function PartnerMypagePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { data: profile, isLoading } = usePartnerProfile();

  const [activeTopTab, setActiveTopTab] = useState<PartnerMainTab>("account");
  const [activeSubTab, setActiveSubTab] = useState<"profile">("profile");

  // 회원 유형 상태 (리뷰어/광고주)
  const [memberType, setMemberType] = useState<"reviewer" | "partner">("partner");
  // 리뷰어 정보 없음 모달 (광고주 → 리뷰어 전환 시)
  const [showReviewerInfoModal, setShowReviewerInfoModal] = useState(false);

  const handleSubTabChange = (tab: "profile" | "channel") => {
    if (tab === "profile") {
      setActiveSubTab(tab);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleMemberTypeChange = (type: "reviewer" | "partner") => {
    if (type === "reviewer") {
      // 리뷰어(유저) 정보 등록 여부 확인
      try {
        const stored = localStorage.getItem("user_accounts");
        const accounts = stored ? (JSON.parse(stored) as { id?: string; email?: string }[]) : [];
        const hasReviewerInfo = accounts.some((a) => a.email === profile?.email);
        if (!hasReviewerInfo) {
          setShowReviewerInfoModal(true);
          return;
        }
      } catch {
        setShowReviewerInfoModal(true);
        return;
      }
      setMemberType("reviewer");
      router.push("/user/mypage/profile");
      return;
    }
    setMemberType(type);
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

        {/*
          ProfileContent 공통 컴포넌트 사용
          API에서 가져온 프로필 데이터를 전달
        */}
        <ProfileContent
          role="광고주"
          nickname={profile?.businessName || profile?.name || "파트너"}
          editPath="/partner/mypage/edit"
          onLogout={handleLogout}
          profileImage={profile?.profileImage || undefined}
          // 광고주,리뷰어 토글 버튼 -- 숨김처리
          showMemberTypeToggle={false}
          activeMemberType={memberType}
          onMemberTypeChange={handleMemberTypeChange}
        />

        {/* 리뷰어 정보 없음 모달: 등록 클릭 시 유저 내 정보 수정 페이지로 이동 */}
        <BaseModal
          is_open={showReviewerInfoModal}
          on_close={() => setShowReviewerInfoModal(false)}
          message="리뷰어 정보가 없습니다.<br>내 정보 등록 후 활동할 수 있습니다."
          buttons={["닫기", "등록"]}
          on_cancel={() => setShowReviewerInfoModal(false)}
          on_confirm={() => {
            setShowReviewerInfoModal(false);
            router.push("/partner/mypage/edit");
          }}
          type="center"
        />
      </div>
    </div>
  );
}

// 파트너 전용 페이지로 보호
export default withPartnerAuth(PartnerMypagePage);
