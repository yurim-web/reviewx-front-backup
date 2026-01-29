/* ========================================

   📺 채널 섹션 컴포넌트

   ======================================== */

/**

 * 채널 섹션 컴포넌트

 *

 * 목적: 마이페이지의 채널 탭에서 사용되는 채널 연결 관리 섹션입니다.

 *

 * 사용 페이지:

 * - /user/mypage (채널 탭)

 *

 * 주요 기능:

 * - 채널 목록 표시 (연결됨/연결 안됨 상태)

 * - 채널 연결 모달 열기

 * - 채널 정보 업데이트

 * - 채널별 아이콘 표시

 */

"use client";

import React, { useState } from "react";

import ChannelConnectModal from "./ChannelConnectModal";

import styles from "../../../styles/user/mypage/channel.module.css";

interface ChannelInfo {
  name: string;

  url?: string;

  status: "connected" | "disconnected";
}

interface ChannelSectionProps {
  channels: ChannelInfo[];

  onChannelUpdate: (channelName: string, channelInfo: { url: string }) => void;
}

const CHANNEL_ICON_MAP: Record<string, string> = {
  "네이버 블로그": "/images/brand_logo/naverblog.svg",

  "네이버 클립": "/images/brand_logo/naverclip.svg",

  인스타그램: "/images/brand_logo/insta.svg",

  유튜브: "/images/brand_logo/youtube.svg",
};

export default function ChannelSection({
  channels,

  onChannelUpdate,
}: ChannelSectionProps) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChannelClick = (channelName: string) => {
    setSelectedChannel(channelName);

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setSelectedChannel(null);
  };

  const handleConnect = (channelInfo: { url: string }) => {
    if (selectedChannel) {
      onChannelUpdate(selectedChannel, channelInfo);
    }
  };

  const getChannelIcon = (channelName: string) => {
    return CHANNEL_ICON_MAP[channelName] ?? "";
  };

  return (
    <>
      <div className={styles.channel_section}>
        <div className={styles.channel_grid}>
          {channels.map((channel) => (
            <div key={channel.name} className={styles.channel_item}>
              <div className={styles.channel_icon}>
                <img
                  src={getChannelIcon(channel.name)}
                  alt={channel.name}
                  onError={(e) => {
                    // 아이콘이 없을 경우 기본 아이콘 표시 대신 숨김 처리

                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className={styles.channel_info}>
                <div className={styles.channel_name}>{channel.name}</div>

                {channel.status === "connected" ? (
                  <div className={styles.channel_url}>{channel.url}</div>
                ) : (
                  <div className={styles.channel_status}>
                    계정을 연결해 주세요.
                  </div>
                )}
              </div>

              <button
                className={styles.channel_more_button}
                onClick={() => handleChannelClick(channel.name)}
              >
                <img
                  src={
                    channel.status === "connected"
                      ? "/images/mypage/channel/channel_ok.svg"
                      : "/images/mypage/channel/channel_add.svg"
                  }
                  alt={
                    channel.status === "connected"
                      ? "채널 연결됨"
                      : "채널 연결하기"
                  }
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <ChannelConnectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        channelName={selectedChannel || ""}
        initialUrl={channels.find((ch) => ch.name === selectedChannel)?.url}
        onConnect={handleConnect}
      />
    </>
  );
}
