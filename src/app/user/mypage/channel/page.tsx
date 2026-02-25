/* ========================================
   마이페이지 채널 탭 페이지
   ======================================== */

/**
 * ChannelPage
 *
 * 목적: 사용자의 소셜 채널 연결 현황을 관리하는 페이지
 *
 * 사용 페이지:
 * - /user/mypage/channel (채널 탭)
 */

"use client";

import { useState, useEffect } from "react";

import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import SubTabNavigation from "@/components/common/mypage/SubTabNavigation";
import ChannelSection from "@/components/user/mypage/ChannelSection";
import SubHeader from "@/components/fragments/SubHeader";
import type { MainTab } from "@/types/domain/user";
import layoutStyles from "@/styles/user/mypage/mypage_layout.module.css";
import { useAuth } from "@/hooks/useAuth";

interface ChannelDetail {
  name: string;
  url?: string;
  status?: "connected" | "disconnected";
}

interface LocalAccount {
  id?: string;
  email?: string;
  channel_details?: ChannelDetail[];
}

const DEFAULT_CHANNELS = [
  { name: "네이버 블로그", url: "", status: "disconnected" as const },
  { name: "네이버 클립", url: "", status: "disconnected" as const },
  { name: "인스타그램", url: "", status: "disconnected" as const },
  { name: "유튜브", url: "", status: "disconnected" as const },
];

/**
 * 채널 탭 전용 페이지 컴포넌트
 */
export default function ChannelPage() {
  const { user } = useAuth();
  const [activeTopTab, setActiveTopTab] = useState<MainTab>("account");
  const [activeSubTab, _setActiveSubTab] = useState<"profile" | "channel">("channel");

  // SubHeader 표시 여부 (모달에서 들어온 경우에만 표시)
  const [showSubHeader, setShowSubHeader] = useState(false);

  useEffect(() => {
    const shouldShow = sessionStorage.getItem("showSubHeader");
    if (shouldShow === "true") {
      setShowSubHeader(true);
      sessionStorage.removeItem("showSubHeader");
    }
  }, []);

  const [channels, setChannels] =
    useState<{ name: string; url: string; status: "connected" | "disconnected" }[]>(
      DEFAULT_CHANNELS
    );

  // user_accounts에서 채널 정보 로드
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      try {
        const storedAccounts = localStorage.getItem("user_accounts");
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts) as LocalAccount[];
          const userAccount = accounts.find((a) => a.id === user.id || a.email === user.email);

          if (userAccount?.channel_details) {
            const loadedChannels = DEFAULT_CHANNELS.map((channel) => {
              const detail = userAccount.channel_details!.find((d) => d.name === channel.name);
              if (detail) {
                return {
                  name: channel.name,
                  url: detail.url || "",
                  status: detail.status || ("disconnected" as const),
                };
              }
              return channel;
            });
            setChannels(loadedChannels);
          }
        }
      } catch (_error) {}
    }
  }, [user]);

  const handleSubTabChange = (tab: "profile" | "channel") => {
    switch (tab) {
      case "profile":
        window.location.href = "/user/mypage/profile";
        break;
      case "channel":
        break;
    }
  };

  const handleChannelUpdate = (channelName: string, channelInfo: { url: string }) => {
    const updatedChannels = channels.map((channel) =>
      channel.name === channelName
        ? { ...channel, url: channelInfo.url, status: "connected" as const }
        : channel
    );
    setChannels(updatedChannels);

    if (typeof window !== "undefined" && user) {
      try {
        const storedAccounts = localStorage.getItem("user_accounts");
        const accounts: LocalAccount[] = storedAccounts ? JSON.parse(storedAccounts) : [];

        const accountIndex = accounts.findIndex((a) => a.id === user.id || a.email === user.email);

        if (accountIndex >= 0) {
          accounts[accountIndex] = {
            ...accounts[accountIndex],
            channel_details: updatedChannels,
          };
          localStorage.setItem("user_accounts", JSON.stringify(accounts));
        }
      } catch (_error) {}
    }
  };

  return (
    <div className={layoutStyles.mypage_container}>
      {/* SubHeader - 모달에서 들어온 경우에만 표시 */}
      {showSubHeader && <SubHeader />}

      <main className={layoutStyles.main_content}>
        {/* 상단 탭 네비게이션: 캠페인/포인트/계정/커뮤니티 */}
        <TabNavigation activeTab={activeTopTab} setActiveTab={setActiveTopTab} />

        {/* 서브 탭 (프로필/채널·스토어) */}
        <SubTabNavigation
          activeSubTab={activeSubTab}
          setActiveSubTab={handleSubTabChange}
          basePath="/user/mypage"
          availableTabs={["profile", "channel"]}
        />

        {/* 채널 섹션 */}
        <ChannelSection channels={channels} onChannelUpdate={handleChannelUpdate} />
      </main>
    </div>
  );
}
