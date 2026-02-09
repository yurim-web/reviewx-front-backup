/* ========================================
   📱 채널 연결 페이지
   ======================================== */

/**
 * 채널 연결 페이지
 *
 * 목적: 사용자의 소셜 미디어 채널을 연결할 수 있는 독립적인 페이지입니다.
 *
 * 페이지 경로:
 * - /user/mypage/channel/connect
 *
 * 주요 기능:
 * - 네이버 블로그, 네이버 클립, 인스타그램, 유튜브 연결
 * - 채널 연결/해제 기능
 *
 * 사용 위치:
 * - 캠페인 신청 모달에서 채널 수정 버튼 클릭 시 이동
 */

"use client";

import { useState, useEffect } from "react";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import { getChannelLogo } from "@/utils/channelLogoMap";
import ChannelSection from "@/components/user/mypage/ChannelSection";
import { useAuth } from "@/hooks/useAuth";
import layoutStyles from "@/styles/user/mypage/edit_profile/layout.module.css";
import headerStyles from "@/styles/user/mypage/edit_profile/header.module.css";

// 채널 정보 타입
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
  const [channels, setChannels] = useState<ChannelInfo[]>(defaultChannels);

  /**
   * localStorage에서 채널 정보 로드
   */
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      try {
        const storedAccounts = localStorage.getItem("user_accounts");
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts);
          const userAccount = accounts.find(
            (a: any) => a.id === user.id || a.email === user.email,
          );

          if (userAccount?.channel_details) {
            const loadedChannels = defaultChannels.map((channel) => {
              const detail = userAccount.channel_details.find(
                (d: any) => d.name === channel.name,
              );
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
      } catch (error) {
        console.error("❌ [채널 연결 페이지] 채널 정보 로드 실패:", error);
      }
    }
  }, [user]);

  /**
   * 채널 연결/수정 핸들러
   * - 채널 정보 업데이트
   * - localStorage의 user_accounts에 저장
   * - 캠페인 신청 모달에서 온 경우 sessionStorage에 채널 정보 저장
   */
  const handleChannelUpdate = (
    channelName: string,
    channelInfo: { url: string },
  ) => {
    const updatedChannels = channels.map((ch) =>
      ch.name === channelName
        ? { ...ch, url: channelInfo.url, status: "connected" as const }
        : ch,
    );
    setChannels(updatedChannels);

    // localStorage에 저장
    if (typeof window !== "undefined" && user) {
      try {
        const storedAccounts = localStorage.getItem("user_accounts");
        const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];
        const accountIndex = accounts.findIndex(
          (a: any) => a.id === user.id || a.email === user.email,
        );

        if (accountIndex >= 0) {
          accounts[accountIndex] = {
            ...accounts[accountIndex],
            channel_details: updatedChannels,
          };
          localStorage.setItem("user_accounts", JSON.stringify(accounts));
        }
      } catch (error) {
        console.error("❌ [채널 연결] localStorage 저장 실패:", error);
      }
    }

    // 캠페인 신청 모달에서 온 경우 sessionStorage에 저장
    const shouldOpenModal = sessionStorage.getItem(
      "shouldOpenApplicationModal",
    );
    if (shouldOpenModal === "true") {
      sessionStorage.setItem(
        "userChannelInfo",
        JSON.stringify({
          channelName,
          channelUrl: channelInfo.url,
        }),
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
