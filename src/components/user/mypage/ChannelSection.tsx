"use client";

import React, { useState } from "react";
import ChannelConnectModal from "./ChannelConnectModal";
import styles from "../../../styles/user/mypage/mypage.module.css";

interface ChannelInfo {
  name: string;
  url?: string;
  status: "connected" | "disconnected";
}

interface ChannelSectionProps {
  channels: ChannelInfo[];
  onChannelUpdate: (channelName: string, channelInfo: { url: string }) => void;
}

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
    // 실제로는 각 채널별 아이콘을 반환
    return `/images/brand_logo/${channelName
      .toLowerCase()
      .replace(/\s+/g, "")}.svg`;
  };

  return (
    <>
      <div className={styles.channel_section}>
        <div className={styles.section_title}>채널</div>

        <div className={styles.channel_grid}>
          {channels.map((channel) => (
            <div key={channel.name} className={styles.channel_item}>
              <div className={styles.channel_icon}>
                <img
                  src={getChannelIcon(channel.name)}
                  alt={channel.name}
                  onError={(e) => {
                    // 아이콘이 없을 경우 기본 아이콘 표시
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
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M14 8V20M8 14H20"
                    stroke="#333"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <ChannelConnectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        channelName={selectedChannel || ""}
        onConnect={handleConnect}
      />
    </>
  );
}
