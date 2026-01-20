/* ========================================

   📱 채널 탭 전용 페이지

   ======================================== */

/**

 * 채널 탭 전용 페이지

 *

 * 목적: 사용자의 채널 연결 관리를 보여주는 독립적인 페이지입니다.

 *

 * 페이지 경로:

 * - /user/mypage/channel

 *

 * 주요 기능:

 * - 채널 연결 관리 (네이버 블로그, 네이버 클립, 인스타그램, 유튜브)

 * - 채널 연결/해제 기능

 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지

 */

"use client";

import { useState, useEffect } from "react";

import TabNavigation from "@/components/user/campaign_management/TabNavigation";

import SubTabNavigation from "@/components/common/mypage/SubTabNavigation";

import ChannelSection from "@/components/user/mypage/ChannelSection";

import SubHeader from "@/components/fragments/SubHeader";

import type { MainTab } from "@/types/domain/user";

import layoutStyles from "../../../../styles/user/mypage/layout.module.css";

/**

 * 채널 탭 전용 페이지 컴포넌트

 */

export default function ChannelPage() {
  const [activeTopTab, setActiveTopTab] = useState<MainTab>("account");

  const [activeSubTab, setActiveSubTab] = useState<"profile" | "channel">(
    "channel"
  );

  // SubHeader 표시 여부 (모달에서 들어온 경우에만 표시)
  const [showSubHeader, setShowSubHeader] = useState(false);

  // sessionStorage에서 SubHeader 표시 플래그 확인
  useEffect(() => {
    const shouldShow = sessionStorage.getItem("showSubHeader");
    if (shouldShow === "true") {
      setShowSubHeader(true);
      // 플래그 제거 (한 번만 표시)
      sessionStorage.removeItem("showSubHeader");
    }
  }, []);

  // 채널 데이터 상태 - 사용자가 연결할 수 있는 소셜 미디어 채널 목록

  const [channels, setChannels] = useState([
    {
      name: "네이버 블로그",

      url: "https://blog.naver.com/catcat12344",

      status: "connected" as const,
    },

    { name: "네이버 클립", status: "disconnected" as const },

    { name: "인스타그램", status: "disconnected" as const },

    { name: "유튜브", status: "disconnected" as const },
  ]);

  /**

   * 서브 탭 변경 핸들러

   * 각 탭 클릭 시 해당 페이지로 이동

   */

  const handleSubTabChange = (tab: "profile" | "channel") => {
    switch (tab) {
      case "profile":
        window.location.href = "/user/mypage/profile";

        break;

      case "channel":
        // 현재 페이지이므로 아무것도 하지 않음

        break;
    }
  };

  // 채널 연결 핸들러

  const handleChannelUpdate = (
    channelName: string,

    channelInfo: { url: string }
  ) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.name === channelName
          ? { ...channel, url: channelInfo.url, status: "connected" as const }
          : channel
      )
    );
  };

  return (
    <div
      className={layoutStyles.mypage_container}
      style={showSubHeader ? { paddingTop: "80px" } : {}}
    >
      {/* SubHeader - 모달에서 들어온 경우에만 표시 */}
      {showSubHeader && <SubHeader />}

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

        {/* 채널 섹션 */}

        <ChannelSection
          channels={channels}
          onChannelUpdate={handleChannelUpdate}
        />
      </main>
    </div>
  );
}
