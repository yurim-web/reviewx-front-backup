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
import { patchReviewerProfile } from "@/lib/api/reviewer";
import {
  useReviewerProfile,
  useInvalidateReviewerProfile,
  getReviewerIdNum,
} from "@/hooks/user/mypage/useReviewerProfile";

const DEFAULT_CHANNELS = [
  { name: "네이버 블로그", url: "", status: "disconnected" as const },
  { name: "네이버 클립", url: "", status: "disconnected" as const },
  { name: "인스타그램", url: "", status: "disconnected" as const },
  { name: "유튜브", url: "", status: "disconnected" as const },
];

export default function ChannelPage() {
  const { user } = useAuth();
  const { data: profile } = useReviewerProfile(user?.id);
  const invalidateProfile = useInvalidateReviewerProfile();
  const [activeTopTab, setActiveTopTab] = useState<MainTab>("account");
  const [activeSubTab, _setActiveSubTab] = useState<"profile" | "channel">("channel");

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

  // 서버 프로필에서 채널 정보 로드
  useEffect(() => {
    if (!user || !profile?.channel_details) return;

    const loadedChannels = DEFAULT_CHANNELS.map((channel) => {
      const detail = profile.channel_details!.find((d) => d.name === channel.name);
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
  }, [user, profile]);

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

    // 서버에 채널 정보 저장
    const reviewerIdNum = getReviewerIdNum(user?.id);
    if (reviewerIdNum) {
      patchReviewerProfile(reviewerIdNum, {
        channel_details: updatedChannels.map((ch) => ({
          name: ch.name,
          url: ch.url ?? "",
          status: ch.status,
        })),
      })
        .then(() => invalidateProfile(user?.id))
        .catch((_apiError) => {
          console.error("채널 수정 API 호출 실패:", _apiError);
        });
    }
  };

  return (
    <div className={layoutStyles.mypage_container}>
      {showSubHeader && <SubHeader />}

      <main className={layoutStyles.main_content}>
        <TabNavigation activeTab={activeTopTab} setActiveTab={setActiveTopTab} />

        <SubTabNavigation
          activeSubTab={activeSubTab}
          setActiveSubTab={handleSubTabChange}
          basePath="/user/mypage"
          availableTabs={["profile", "channel"]}
        />

        <ChannelSection channels={channels} onChannelUpdate={handleChannelUpdate} />
      </main>
    </div>
  );
}
