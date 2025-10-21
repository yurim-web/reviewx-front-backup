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

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../../../styles/user/mypage/channel_connect_modal.module.css";

interface ChannelConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  channelIcon?: string;
  initialUrl?: string; // 이미 연결된 URL (수정용)
  onConnect: (accountInfo: { username: string; url: string }) => void;
}

export default function ChannelConnectModal({
  isOpen,
  onClose,
  channelName,
  channelIcon,
  initialUrl,
  onConnect,
}: ChannelConnectModalProps) {
  const [username, setUsername] = useState("");
  const [url, setUrl] = useState("");

  // 모달이 열릴 때마다 입력값 초기화 또는 기존 URL 설정
  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setUrl(initialUrl || ""); // 기존 URL이 있으면 설정, 없으면 빈 문자열
    }
  }, [isOpen, initialUrl]);

  // URL 유효성 검사 함수
  const isValidUrl = (urlString: string): boolean => {
    if (!urlString.trim()) return false;

    try {
      // URL 객체를 생성하여 유효성 검사
      const url = new URL(urlString);

      // http 또는 https 프로토콜만 허용
      const isValidProtocol =
        url.protocol === "http:" || url.protocol === "https:";

      // 호스트명이 있는지 확인 (www 포함)
      const hasValidHost = url.hostname && url.hostname.length > 0;

      return isValidProtocol && hasValidHost;
    } catch {
      return false;
    }
  };

  // 버튼 활성화 상태 계산
  const isButtonEnabled = isValidUrl(url);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConnect = () => {
    if (isButtonEnabled) {
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
            <Image
              src="/images/filter/x_icon.svg"
              alt="닫기"
              width={20}
              height={20}
            />
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
            className={`${styles.connect_button} ${
              !isButtonEnabled ? styles.disabled_button : ""
            }`}
            onClick={handleConnect}
            disabled={!isButtonEnabled}
          >
            채널 연결하기
          </button>
        </div>
      </div>
    </div>
  );
}
