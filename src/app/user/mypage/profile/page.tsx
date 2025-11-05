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
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import SubTabNavigation from "@/components/user/mypage/SubTabNavigation";
import type { MainTab } from "@/types/user/user";
import layoutStyles from "../../../../styles/user/mypage/layout.module.css";
import profileStyles from "../../../../styles/user/mypage/profile.module.css";

/**
 * 프로필 탭 전용 페이지 컴포넌트
 */
export default function ProfilePage() {
  const router = useRouter();
  const [activeTopTab, setActiveTopTab] = useState<MainTab>("account");
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "channel">(
    "profile"
  );

  /**
   * 서브 탭 변경 핸들러
   * 각 탭 클릭 시 해당 페이지로 이동
   */
  const handleSubTabChange = (tab: "profile" | "channel") => {
    switch (tab) {
      case "profile":
        // 현재 페이지이므로 아무것도 하지 않음
        break;
      case "channel":
        window.location.href = "/user/mypage/channel";
        break;
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
        />

        {/* 프로필 섹션 */}
        <div className={profileStyles.profile_section}>
          <div className={profileStyles.profile_info}>
            <div className={profileStyles.profile_image} />
            <div className={profileStyles.profile_details}>
              <div className={profileStyles.profile_role}>리뷰어</div>
              <div className={profileStyles.profile_nickname_container}>
                <div className={profileStyles.profile_nickname}>
                  양치하는고양이123456
                </div>

                <Image
                  className={profileStyles.edit_icon}
                  src="/images/icons/chevron_right.svg"
                  alt="프로필 편집 이동"
                  width={16}
                  height={16}
                  onClick={() => router.push("/user/mypage/edit")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <div className={profileStyles.menu_list}>
          <button
            className={profileStyles.menu_item}
            onClick={() =>
              window.open("https://markx.dev/guide_book", "_blank")
            }
          >
            <div className={profileStyles.menu_icon} />
            <div className={profileStyles.menu_text}>이용 가이드</div>
          </button>
          <button
            className={profileStyles.menu_item}
            onClick={() => router.push("/notice")}
          >
            <div className={profileStyles.menu_icon} />
            <div className={profileStyles.menu_text}>공지사항</div>
          </button>
          <button
            className={profileStyles.menu_item}
            onClick={() => router.push("/faq")}
          >
            <div className={profileStyles.menu_icon} />
            <div className={profileStyles.menu_text}>자주 묻는 질문</div>
          </button>
          <button
            className={profileStyles.menu_item}
            onClick={() =>
              window.open("https://pf.kakao.com/_xjxdxoxG/chat", "_blank")
            }
          >
            <div className={profileStyles.menu_icon} />
            <div className={profileStyles.menu_text}>카카오톡 상담</div>
          </button>
        </div>
      </main>
    </div>
  );
}
