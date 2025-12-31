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
 * - 채널별 URL 입력 (네이버 블로그, 네이버 클립, 인스타그램, 유튜브)
 * - 채널별 다른 입력 형태 제공 (전체 URL, @ 프리픽스, 도메인 프리픽스)
 * - 채널 연결 처리
 * - 모달 오버레이 클릭으로 닫기
 */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import BaseModal from "@/components/common/modal/BaseModal";
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
  // 에러 타입: null(에러 없음), "not_found"(채널을 찾을 수 없음), "already_registered"(이미 등록된 채널), "server_error"(서버 오류)
  const [errorType, setErrorType] = useState<
    "not_found" | "already_registered" | "server_error" | null
  >(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // 연결 성공 모달 표시 여부

  /**
   * 채널별 설정 정보
   * 각 채널의 prefix, placeholder, 에러 메시지 등을 중앙에서 관리합니다.
   */
  const channel_config = {
    "네이버 블로그": {
      prefix: "https://blog.naver.com/",
      placeholder: "네이버 블로그 아이디 입력",
      link_error_message: "네이버 블로그 아이디만 입력해 주세요.",
      info_message: null, // 인스타그램만 info_message가 있음
    },
    "네이버 클립": {
      prefix: "",
      placeholder: "네이버 클립 아이디 입력",
      link_error_message: "네이버 클립 아이디만 입력해 주세요.",
      info_message: null,
    },
    인스타그램: {
      prefix: "@",
      placeholder: "인스타그램 아이디 입력",
      link_error_message: "인스타그램 아이디만 입력해 주세요.",
      info_message:
        "비활성화 또는 비공개 상태의 인스타그램 계정은 확인이 불가능하여 체험단 선정 대상에서 제외됩니다.",
    },
    유튜브: {
      prefix: "https://www.youtube.com/@",
      placeholder: "유튜브 핸들(아이디) 입력",
      link_error_message: "유튜브 핸들(아이디)만 입력해 주세요.",
      info_message: null,
    },
  };

  /**
   * 에러 메시지 텍스트 매핑
   * 에러 타입에 따라 표시할 메시지를 반환합니다.
   */
  const error_messages = {
    not_found: "채널을 찾을 수 없습니다.",
    already_registered: "이미 등록된 채널입니다.",
    server_error: "채널 정보를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.",
  };

  /**
   * URL에서 채널별 아이디/핸들을 추출하는 함수
   * 각 채널별로 다른 패턴을 사용하여 아이디를 추출합니다.
   */
  const extractUsernameFromUrl = (url: string, channelType: string): string => {
    if (!url || !url.trim()) return "";

    try {
      switch (channelType) {
        case "네이버 블로그":
          // https://blog.naver.com/아이디 형태에서 아이디 추출
          const blogMatch = url.match(/blog\.naver\.com\/([^\/\?]+)/);
          return blogMatch ? blogMatch[1] : "";
        case "네이버 클립":
          // 네이버 클립은 URL 전체를 사용하거나 아이디만 있을 수 있음
          // URL 형태면 그대로, 아니면 아이디로 간주
          if (url.startsWith("http://") || url.startsWith("https://")) {
            return url; // URL 전체를 username으로 사용
          }
          return url; // 아이디만 있는 경우
        case "인스타그램":
          // @아이디 또는 https://instagram.com/아이디 형태에서 아이디 추출
          if (url.startsWith("@")) {
            return url.substring(1); // @ 제거
          }
          const instaMatch = url.match(/instagram\.com\/([^\/\?]+)/);
          return instaMatch ? instaMatch[1] : "";
        case "유튜브":
          // https://www.youtube.com/@핸들 형태에서 핸들 추출
          const youtubeMatch = url.match(/youtube\.com\/@([^\/\?]+)/);
          return youtubeMatch ? youtubeMatch[1] : "";
        default:
          return "";
      }
    } catch {
      return "";
    }
  };

  // 모달이 열릴 때마다 입력값 초기화 또는 기존 URL 설정
  useEffect(() => {
    if (isOpen) {
      if (initialUrl) {
        // 기존 URL이 있으면 (수정 모드)
        // URL에서 채널별 아이디를 추출하여 username에 설정
        const extractedUsername = extractUsernameFromUrl(
          initialUrl,
          channelName
        );
        setUsername(extractedUsername);
        setUrl(initialUrl);
      } else {
        // 기존 URL이 없으면 (새로 연결하는 모드)
        setUsername("");
        setUrl("");
      }
      setErrorType(null); // 오류 메시지 초기화
    }
  }, [isOpen, initialUrl, channelName]);

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
      const hasValidHost = Boolean(url.hostname && url.hostname.length > 0);

      return isValidProtocol && hasValidHost;
    } catch {
      return false;
    }
  };

  /**
   * 버튼 활성화 상태 계산
   * - 모든 채널: username 입력 시 활성화
   * - 단, 링크 형태로 입력했을 때는 비활성화
   */
  const isButtonEnabled = (): boolean => {
    // 입력값이 없으면 비활성화
    if (username.trim().length === 0) return false;

    // 링크 형태로 입력했을 때는 비활성화
    if (isLinkFormat(username, channelName)) return false;

    return true;
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 채널 연결 핸들러
   * 실제로는 백엔드 API를 호출하여 채널 존재 여부를 확인해야 합니다
   *
   * 에러 타입별 처리:
   * - "not_found": 채널을 찾을 수 없거나, 비공개 계정, 기존에 연결된 채널이 삭제되거나 계정이 차단 당한 경우
   * - "already_registered": 이미 다른 계정에서 사용 중인 채널
   * - "server_error": 서버 오류 또는 기타 읽을 수 없는 경우
   */
  const handleConnect = async () => {
    if (!isButtonEnabled()) return;

    try {
      // TODO: 실제 채널 검증 API 호출
      // 예시: const response = await validateChannel(channelName, url);
      // 실제 구현 시에는 API 응답에 따라 에러 타입을 설정하거나 연결을 진행합니다

      // 임시: 채널을 찾을 수 없다고 가정 (실제로는 API 응답에 따라 결정)
      const channelExists = false; // 실제로는 API 응답으로 결정

      if (!channelExists) {
        // TODO: API 응답에 따라 에러 타입 결정
        // 예시:
        // if (response.error === "CHANNEL_NOT_FOUND") setErrorType("not_found");
        // else if (response.error === "ALREADY_REGISTERED") setErrorType("already_registered");
        // else if (response.error === "SERVER_ERROR") setErrorType("server_error");

        // 임시로 not_found로 설정 (실제로는 API 응답에 따라 결정)
        setErrorType("not_found");
        return; // 오류가 있으면 연결하지 않음
      }

      // 채널이 존재하면 연결 진행
      onConnect({ username, url: url.trim() });
      setUrl("");
      setUsername("");
      setErrorType(null);

      // 연결 성공 모달 표시를 위해 현재 모달을 먼저 닫고 성공 모달을 띄움
      onClose();
      setIsSuccessModalOpen(true);
    } catch (error) {
      // 서버 오류 또는 기타 읽을 수 없는 경우
      setErrorType("server_error");
    }
  };

  /**
   * 입력값이 링크 형태인지 확인하는 함수
   * 각 채널별로 다른 패턴을 확인합니다.
   */
  const isLinkFormat = (value: string, channelType: string): boolean => {
    if (!value.trim()) return false;

    const link_patterns = {
      "네이버 블로그": (val: string) =>
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.includes("blog.naver.com"),
      "네이버 클립": (val: string) =>
        val.startsWith("http://") || val.startsWith("https://"),
      인스타그램: (val: string) =>
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.includes("instagram.com"),
      유튜브: (val: string) =>
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.includes("youtube.com"),
    };

    const check_pattern =
      link_patterns[channelType as keyof typeof link_patterns];
    return check_pattern ? check_pattern(value) : false;
  };

  /**
   * 입력값이 변경되면 오류 메시지 초기화 및 URL 생성
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    channelType: string
  ) => {
    const value = e.target.value;
    setUsername(value);
    setErrorType(null); // 입력값 변경 시 오류 메시지 초기화

    // 채널별 URL 생성
    const url_generators = {
      "네이버 블로그": (val: string) => `https://blog.naver.com/${val}`,
      "네이버 클립": (val: string) => val,
      인스타그램: (val: string) => `@ ${val}`,
      유튜브: (val: string) => `https://www.youtube.com/@${val}`,
    };

    const generate_url =
      url_generators[channelType as keyof typeof url_generators];
    setUrl(generate_url ? generate_url(value) : value);
  };

  return (
    <>
      {/* 채널 연결 모달 */}
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

          {/* 모달 바디 - 채널별로 다른 입력 형태 제공 */}
          <div className={styles.modal_body}>
            <div className={styles.input_section}>
              {/* 채널별 입력 필드 - 공통 구조로 렌더링 */}
              {(() => {
                const config =
                  channel_config[channelName as keyof typeof channel_config];
                if (!config) return null;

                return (
                  <div className={styles.input_group}>
                    <div className={styles.prefix_input_group}>
                      {/* prefix가 있으면 표시 */}
                      {config.prefix && (
                        <span className={styles.prefix_text}>
                          {config.prefix}
                        </span>
                      )}
                      <input
                        type="text"
                        className={styles.input_field_with_prefix}
                        placeholder={config.placeholder}
                        value={username}
                        onChange={(e) => handleInputChange(e, channelName)}
                      />
                    </div>
                    {/* 링크 형태로 입력했을 때 안내 문구 */}
                    {isLinkFormat(username, channelName) && (
                      <p className={styles.error_text}>
                        {config.link_error_message}
                      </p>
                    )}
                    {/* 에러 메시지 표시 */}
                    {/* 에러 타입별 메시지:
                        - not_found: 채널을 찾을 수 없거나, 비공개 계정, 기존에 연결된 채널이 삭제되거나 계정이 차단 당한 경우
                        - already_registered: 이미 다른 계정에서 사용 중인 채널
                        - server_error: 서버 오류 또는 기타 읽을 수 없는 경우 */}
                    {errorType && (
                      <p className={styles.channel_not_found_text}>
                        {error_messages[errorType]}
                      </p>
                    )}
                    {/* 인스타그램만 info_message 표시 */}
                    {config.info_message && (
                      <p className={styles.info_text}>{config.info_message}</p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* 모달 푸터 */}
          <div className={styles.modal_footer}>
            <button
              className={`${styles.connect_button} ${
                !isButtonEnabled() ? styles.disabled_button : ""
              }`}
              onClick={handleConnect}
              disabled={!isButtonEnabled()}
            >
              채널 연결
            </button>
          </div>
        </div>
      </div>

      {/* 연결 성공 모달 */}
      <BaseModal
        is_open={isSuccessModalOpen}
        on_close={() => setIsSuccessModalOpen(false)}
        message="채널이 연결되었습니다."
        buttons={["닫기"]}
      />
    </>
  );
}
