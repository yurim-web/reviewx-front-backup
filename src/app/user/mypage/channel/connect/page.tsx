/* ========================================
   채널 연결 페이지
   ======================================== */

/**
 * ChannelConnectPage
 *
 * 목적: 소셜 채널(네이버 블로그, 인스타그램 등)을 연결/해제하는 페이지
 *
 * 사용 페이지:
 * - /user/mypage/channel/connect (채널 연결)
 * - 캠페인 신청 모달에서 채널 수정 시 이동
 */

"use client";

import { useState, useEffect } from "react";

import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import { getChannelLogo } from "@/utils/channelLogoMap";
import ChannelSection from "@/components/user/mypage/ChannelSection";
import { useAuth } from "@/hooks/useAuth";
import { fetchReviewerChannels, updateReviewerChannel } from "@/lib/api/reviewer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import layoutStyles from "@/styles/user/mypage/edit_profile/edit_profile_layout.module.css";
import headerStyles from "@/styles/user/mypage/edit_profile/header.module.css";

interface ChannelInfo {
  name: string;
  url?: string;
  status: "connected" | "disconnected";
}

const defaultChannels: ChannelInfo[] = [
  { name: "네이버 블로그", url: "", status: "disconnected" },
  { name: "네이버 클립", url: "", status: "disconnected" },
  { name: "인스타그램", url: "", status: "disconnected" },
  { name: "유튜브", url: "", status: "disconnected" },
];

export default function ChannelConnectPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: channelData } = useQuery({
    queryKey: ["reviewerChannels"],
    queryFn: fetchReviewerChannels,
    enabled: !!user,
    staleTime: 30_000,
  });
  const [channels, setChannels] = useState<ChannelInfo[]>(defaultChannels);

  // R-29: reviewerProfile.channel[] 배열에서 채널 목록 로드
  useEffect(() => {
    if (!user || !channelData?.reviewerProfile?.channel) return;

    const serverChannels = channelData.reviewerProfile.channel;
    const loadedChannels = defaultChannels.map((ch) => {
      const found = serverChannels.find(
        (sc: { channelName: string; isConnected: boolean; channelUrl: string | null }) =>
          sc.channelName === ch.name
      );
      if (found && found.isConnected) {
        return { name: ch.name, url: found.channelUrl || "", status: "connected" as const };
      }
      return ch;
    });
    setChannels(loadedChannels);
  }, [user, channelData]);

  // 채널 연결/수정 핸들러
  const handleChannelUpdate = (channelName: string, channelInfo: { url: string }) => {
    const updatedChannels = channels.map((ch) =>
      ch.name === channelName ? { ...ch, url: channelInfo.url, status: "connected" as const } : ch
    );
    setChannels(updatedChannels);

    // R-30: POST /user/mypage/channel 으로 채널 정보 저장
    const serverChannels = channelData?.reviewerProfile?.channel || [];
    const targetChannel = serverChannels.find(
      (sc: { channelName: string }) => sc.channelName === channelName
    );
    const channelId =
      targetChannel?.channelId || defaultChannels.findIndex((c) => c.name === channelName) + 1;

    updateReviewerChannel({
      channelId,
      externalId: channelInfo.url.split("/").pop() || "",
      channelUrl: channelInfo.url,
    })
      .then(() => queryClient.invalidateQueries({ queryKey: ["reviewerChannels"] }))
      .catch((err: Error) => {
        console.error("채널 연결 API 호출 실패:", err);
      });

    // 캠페인 신청 모달에서 온 경우 sessionStorage에 저장
    const shouldOpenModal = sessionStorage.getItem("shouldOpenApplicationModal");
    if (shouldOpenModal === "true") {
      sessionStorage.setItem(
        "userChannelInfo",
        JSON.stringify({
          channelName,
          channelUrl: channelInfo.url,
        })
      );
    }
  };

  return (
    <div className={headerStyles.edit_profile_container}>
      <SubHeader />

      <main className={layoutStyles.main_min_height}>
        <PageTitle title="채널 연결" />
        <ChannelSection
          channels={channels}
          onChannelUpdate={handleChannelUpdate}
          getChannelIcon={getChannelLogo}
        />
      </main>
    </div>
  );
}
