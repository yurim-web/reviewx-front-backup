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
import { patchReviewerProfile } from "@/lib/api/reviewer";
import {
  useReviewerProfile,
  useInvalidateReviewerProfile,
  getReviewerIdNum,
} from "@/hooks/user/mypage/useReviewerProfile";
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
  const { data: profile } = useReviewerProfile(user?.id);
  const invalidateProfile = useInvalidateReviewerProfile();
  const [channels, setChannels] = useState<ChannelInfo[]>(defaultChannels);

  // 서버 프로필에서 채널 정보 로드
  useEffect(() => {
    if (!user || !profile?.channel_details) return;

    const loadedChannels = defaultChannels.map((channel) => {
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

  // 채널 연결/수정 핸들러
  const handleChannelUpdate = (channelName: string, channelInfo: { url: string }) => {
    const updatedChannels = channels.map((ch) =>
      ch.name === channelName ? { ...ch, url: channelInfo.url, status: "connected" as const } : ch
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
          console.error("채널 연결 API 호출 실패:", _apiError);
        });
    }

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
