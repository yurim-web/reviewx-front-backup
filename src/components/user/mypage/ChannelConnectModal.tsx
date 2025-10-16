/* ========================================
   🔗 채널 연결 모달 컴포넌트
   ======================================== */

/**
 * 채널 연결 모달 컴포넌트
 *
 * 목적: 마이페이지의 채널 섹션에서 채널을 연결할 때 사용되는 모달창입니다.
 *
 * 사용 페이지:
 * - /user/mypage (채널 탭 - 채널 연결 시)
 *
 * 주요 기능:
 * - 채널별 URL 입력 (네이버 블로그, 인스타그램, 유튜브, 틱톡)
 * - 채널별 플레이스홀더 텍스트 제공
 * - 채널 연결 처리
 * - 모달 오버레이 클릭으로 닫기
 */

"use client";

import React, { useState } from "react";
import styles from "../../../styles/user/mypage/channel_connect_modal.module.css";

interface ChannelConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  channelIcon?: string;
  onConnect: (accountInfo: { username: string; url: string }) => void;
}

export default function ChannelConnectModal({
  isOpen,
  onClose,
  channelName,
  channelIcon,
  onConnect,
}: ChannelConnectModalProps) {
  const [username, setUsername] = useState("");
  const [url, setUrl] = useState("");

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConnect = () => {
    if (url.trim()) {
      onConnect({ username: "", url: url.trim() });
      setUrl("");
      onClose();
    }
  };

  // 임시 데이터!

  const getChannelPlaceholder = () => {
    switch (channelName) {
      case "네이버 블로그":
        return "https://blog.naver.com/your-id";
      case "인스타그램":
        return "https://instagram.com/your-id";
      case "유튜브":
        return "https://youtube.com/@your-id";
      case "틱톡":
        return "https://tiktok.com/@your-id";
      default:
        return "https://example.com/your-id";
    }
  };

  const getUsernamePlaceholder = () => {
    switch (channelName) {
      case "네이버 블로그":
        return "블로그 ID";
      case "인스타그램":
        return "인스타그램 ID";
      case "유튜브":
        return "유튜브 채널명";
      case "틱톡":
        return "틱톡 ID";
      default:
        return "사용자 ID";
    }
  };

  return (
    <div className={styles.modal_overlay} onClick={handleBackdropClick}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className={styles.modal_header}>
          <h3 className={styles.modal_title}>{channelName} 연결</h3>
          <button className={styles.modal_close_button} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 모달 바디 */}
        <div className={styles.modal_body}>
          <div className={styles.input_section}>
            <div className={styles.input_group}>
              <input
                type="url"
                className={styles.input_field}
                placeholder={getChannelPlaceholder()}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className={styles.modal_footer}>
          <button
            className={styles.connect_button}
            onClick={handleConnect}
            disabled={!url.trim()}
          >
            채널 연결하기
          </button>
        </div>
      </div>
    </div>
  );
}
