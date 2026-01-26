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
 * - 네이버 블로그 연결
 * - 네이버 클립 연결
 * - 인스타그램 연결
 * - 유튜브 연결
 * - 채널 연결/해제 기능
 *
 * 사용 위치:
 * - 캠페인 신청 모달에서 채널 수정 버튼 클릭 시 이동
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import { getChannelLogo } from "@/utils/channelLogoMap";
import ChannelConnectModal from "@/components/user/mypage/ChannelConnectModal";
import layoutStyles from "@/styles/user/mypage/edit_profile/layout.module.css";
import channelStyles from "@/styles/user/mypage/channel.module.css";

// 채널 정보 타입
interface ChannelInfo {
  name: string;
  url?: string;
  status: "connected" | "disconnected";
}

export default function ChannelConnectPage() {
  const router = useRouter();
  const pathname = usePathname();

  // 채널 데이터 상태 - 사용자가 연결할 수 있는 소셜 미디어 채널 목록
  const [channels, setChannels] = useState<ChannelInfo[]>([
    {
      name: "네이버 블로그",
      url: "https://blog.naver.com/catcat12344",
      status: "connected",
    },
    { name: "네이버 클립", status: "disconnected" },
    { name: "인스타그램", status: "disconnected" },
    { name: "유튜브", status: "disconnected" },
  ]);

  // 채널 연결 모달 상태
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<ChannelInfo | null>(
    null
  );

  /**
   * 뒤로가기 시 모달 상태 복원
   *
   * 설명:
   * - 캠페인 신청 모달에서 채널 수정 버튼을 눌러 이 페이지로 온 경우,
   *   뒤로가기 시 모달이 다시 열리도록 처리합니다.
   * - SubHeader의 뒤로가기 버튼을 통해 이전 페이지로 돌아가면,
   *   CampaignDetailPage에서 모달이 자동으로 열립니다.
   */
  useEffect(() => {
    // sessionStorage에서 모달 열기 플래그 확인
    const shouldOpen = sessionStorage.getItem("shouldOpenApplicationModal");
    if (shouldOpen === "true") {
      // 뒤로가기 시 모달이 열리도록 플래그 유지
      // (모달은 CampaignDetailPage에서 처리)
    }
  }, [pathname]);

  /**
   * 채널 연결/수정 핸들러
   *
   * 설명:
   * - 채널 연결 모달을 열거나 채널을 연결/수정합니다.
   */
  const handleChannelClick = (channelName: string) => {
    const channel = channels.find((ch) => ch.name === channelName);
    if (channel) {
      setSelectedChannel(channel);
      setIsChannelModalOpen(true);
    }
  };

  /**
   * 채널 연결 완료 핸들러
   *
   * 설명:
   * - 채널 연결 모달에서 연결이 완료되면 호출됩니다.
   * - 채널 정보를 업데이트하고 sessionStorage에 저장합니다.
   */
  const handleChannelConnect = (accountInfo: { username: string; url: string }) => {
    if (!selectedChannel) return;

    // 채널 정보 업데이트
    const updatedChannels = channels.map((ch) =>
      ch.name === selectedChannel.name
        ? {
            ...ch,
            url: accountInfo.url,
            status: "connected" as const,
          }
        : ch
    );
    setChannels(updatedChannels);

    // sessionStorage에 채널 정보 저장
    // 캠페인 신청 모달에서 요구하는 채널 이름을 확인
    const shouldOpenModal = sessionStorage.getItem("shouldOpenApplicationModal");
    if (shouldOpenModal === "true") {
      // 캠페인 신청 모달에서 온 경우에만 저장
      // 채널 이름과 URL을 저장
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "userChannelInfo",
          JSON.stringify({
            channelName: selectedChannel.name,
            channelUrl: accountInfo.url,
          })
        );
      }
    }

    // 모달 닫기
    setIsChannelModalOpen(false);
    setSelectedChannel(null);
  };

  /**
   * 채널 아이콘 가져오기
   *
   * 설명:
   * - 채널 이름에 따라 적절한 아이콘을 반환합니다.
   */
  const getChannelIcon = (channelName: string) => {
    return getChannelLogo(channelName);
  };

  return (
    <div className={layoutStyles.edit_profile_container}>
      {/* 서브헤더: 항상 상단에 고정 */}
      <SubHeader />

      {/* 메인 컨텐츠 영역 */}
      <main className={layoutStyles.main_content}>
        {/* 페이지 제목 */}
        <PageTitle title="채널 연결" />

        {/* 채널 목록 */}
        <section className={layoutStyles.section_container}>
          {channels.map((channel) => (
            <div key={channel.name} className={channelStyles.channel_item}>
              {/* 채널 아이콘 */}
              <div className={channelStyles.channel_icon}>
                <img
                  src={getChannelIcon(channel.name)}
                  alt={channel.name}
                  onError={(e) => {
                    // 아이콘이 없을 경우 기본 아이콘 표시 대신 숨김 처리
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* 채널 정보 */}
              <div className={channelStyles.channel_info}>
                <div className={channelStyles.channel_name}>{channel.name}</div>
                {channel.status === "connected" && channel.url ? (
                  <div className={channelStyles.channel_url}>{channel.url}</div>
                ) : (
                  <div className={channelStyles.channel_status}>
                    계정을 연결해 주세요.
                  </div>
                )}
              </div>

              {/* 채널 연결/수정 버튼 */}
              <button
                className={channelStyles.channel_more_button}
                onClick={() => handleChannelClick(channel.name)}
                type="button"
              >
                {channel.status === "connected" ? (
                  // 연결된 경우: 더보기 아이콘 (수정/해제)
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path
                      d="M14 8V20M8 14H20"
                      stroke="#333"
                      strokeWidth="2"
                      strokeLinecap="round"
                      transform="rotate(90 14 14)"
                    />
                  </svg>
                ) : (
                  // 연결되지 않은 경우: 플러스 아이콘 (연결)
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path
                      d="M14 8V20M8 14H20"
                      stroke="#333"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </section>
      </main>

      {/* 채널 연결 모달 */}
      {selectedChannel && (
        <ChannelConnectModal
          isOpen={isChannelModalOpen}
          onClose={() => {
            setIsChannelModalOpen(false);
            setSelectedChannel(null);
          }}
          channelName={selectedChannel.name}
          channelIcon={getChannelIcon(selectedChannel.name)}
          initialUrl={selectedChannel.url}
          onConnect={handleChannelConnect}
        />
      )}
    </div>
  );
}
