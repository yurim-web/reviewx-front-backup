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
import { useRouter } from "next/navigation";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import SubTabNavigation from "@/components/common/mypage/SubTabNavigation";
import ChannelSection from "@/components/user/mypage/ChannelSection";
import SubHeader from "@/components/fragments/SubHeader";
import BaseModal from "@/components/common/modal/BaseModal";
import type { MainTab } from "@/types/domain/user";
import layoutStyles from "@/styles/user/mypage/mypage_layout.module.css";
import Loading from "@/app/loading";
import { useAuth } from "@/hooks/useAuth";
import { fetchReviewerChannels, updateReviewerChannel } from "@/lib/api/reviewer";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const DEFAULT_CHANNELS = [
  { name: "네이버 블로그", url: "", status: "disconnected" as const },
  { name: "네이버 클립", url: "", status: "disconnected" as const },
  { name: "인스타그램", url: "", status: "disconnected" as const },
  { name: "유튜브", url: "", status: "disconnected" as const },
];

export default function ChannelPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();
  const {
    data: channelData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviewerChannels"],
    queryFn: fetchReviewerChannels,
    enabled: !!user,
    staleTime: 30_000,
  });
  const [activeTopTab, setActiveTopTab] = useState<MainTab>("account");
  const [activeSubTab, _setActiveSubTab] = useState<"profile" | "channel">("channel");

  const [showSubHeader, setShowSubHeader] = useState(false);
  const [showChannelCompleteModal, setShowChannelCompleteModal] = useState(false);
  const [showServerErrorModal, setShowServerErrorModal] = useState(false);
  const [channelError, setChannelError] = useState<string>("");

  // 비로그인 시 리디렉트 (로딩 완료 후에만)
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/user/login");
    }
  }, [isAuthLoading, user, router]);

  // 서버 오류 처리
  useEffect(() => {
    if (error) {
      setShowServerErrorModal(true);
    }
  }, [error]);

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

  // R-29: reviewerProfile.channel[] 배열에서 채널 목록 로드
  useEffect(() => {
    if (!user || !channelData?.reviewerProfile?.channel) return;

    const serverChannels = channelData.reviewerProfile.channel;
    const loadedChannels = DEFAULT_CHANNELS.map((ch) => {
      const found = serverChannels.find((sc) => sc.channelName === ch.name);
      if (found && found.isConnected) {
        return { name: ch.name, url: found.channelUrl || "", status: "connected" as const };
      }
      return ch;
    });
    setChannels(loadedChannels);
  }, [user, channelData]);

  const handleSubTabChange = (tab: "profile" | "channel") => {
    switch (tab) {
      case "profile":
        router.push("/user/mypage/profile");
        break;
      case "channel":
        break;
    }
  };

  const handleChannelUpdate = (channelName: string, channelInfo: { url: string }) => {
    // 간단한 URL 유효성 검사
    if (channelInfo.url && !channelInfo.url.startsWith("http")) {
      setChannelError("올바른 URL 형식이 아닙니다. http:// 또는 https://로 시작해야 합니다.");
      return;
    }

    const updatedChannels = channels.map((channel) =>
      channel.name === channelName
        ? { ...channel, url: channelInfo.url, status: "connected" as const }
        : channel
    );
    setChannels(updatedChannels);
    setChannelError("");

    // R-30: 서버에 채널 정보 저장
    const serverChannels = channelData?.reviewerProfile?.channel || [];
    const targetChannel = serverChannels.find((sc) => sc.channelName === channelName);
    const channelId =
      targetChannel?.channelId || DEFAULT_CHANNELS.findIndex((c) => c.name === channelName) + 1;

    updateReviewerChannel({
      channelId,
      externalId: channelInfo.url.split("/").pop() || "",
      channelUrl: channelInfo.url,
    })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["reviewerChannels"] });
        // C_M6: 채널 연결 완료 모달
        setShowChannelCompleteModal(true);
      })
      .catch((apiError) => {
        // 에러 처리
        if (apiError?.response?.status === 400) {
          const errorCode = apiError?.response?.data?.error;
          if (errorCode === "INVALID_CHANNEL") {
            setChannelError("유효하지 않은 채널입니다.");
          } else if (errorCode === "MISSING_REQUIRED_FIELD") {
            setChannelError("필수 항목이 입력되지 않았습니다.");
          } else {
            setChannelError("채널 정보를 저장할 수 없습니다.");
          }
        } else if (apiError?.response?.status === 500) {
          setShowServerErrorModal(true);
        } else {
          setChannelError("채널 정보를 저장하는 중 오류가 발생했습니다.");
        }
      });
  };

  if (isLoading) return <Loading />;

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

        <ChannelSection
          channels={channels}
          onChannelUpdate={handleChannelUpdate}
          error={channelError}
        />

        {/* C_M6: 채널 연결 완료 모달 */}
        <BaseModal
          is_open={showChannelCompleteModal}
          on_close={() => setShowChannelCompleteModal(false)}
          message="채널이 연결되었습니다."
          buttons={["확인"]}
          on_confirm={() => setShowChannelCompleteModal(false)}
          type="center"
        />

        {/* E_M5: 서버 오류 모달 */}
        <BaseModal
          is_open={showServerErrorModal}
          on_close={() => setShowServerErrorModal(false)}
          message="일시적인 오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
          buttons={["닫기", "재시도"]}
          on_cancel={() => setShowServerErrorModal(false)}
          on_confirm={() => {
            setShowServerErrorModal(false);
            router.refresh();
          }}
          type="center"
        />
      </main>
    </div>
  );
}
