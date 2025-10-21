/* ========================================
   👤 마이페이지 메인 페이지
   ======================================== */

/**
 * 마이페이지 메인 페이지
 *
 * 목적: 사용자의 프로필 정보, 채널 연결, 메뉴 등을 관리하는 마이페이지입니다.
 *
 * 페이지 경로:
 * - /user/mypage
 *
 * 사용 파일:
 * - 컴포넌트: TabNavigation, SubHeader, ChannelSection, SubTabNavigation
 * - 타입: MainTab
 * - CSS: layout.module.css, navigation.module.css, profile.module.css, channel.module.css
 *
 * 주요 기능:
 * - 프로필 정보 표시 및 편집
 * - 채널 연결 관리 (네이버 블로그, 인스타그램, 유튜브, 틱톡)
 * - 이용 가이드, 공지사항, FAQ, 카카오톡 상담 메뉴
 * - 탭 네비게이션 (프로필/채널)
 * - 상단 고정 탭 네비게이션
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import type { MainTab } from "@/types/campaignManagement";
import layoutStyles from "../../../styles/user/mypage/layout.module.css";
import navigationStyles from "../../../styles/user/mypage/navigation.module.css";
import profileStyles from "../../../styles/user/mypage/profile.module.css";
import channelStyles from "../../../styles/user/mypage/channel.module.css";
import SubHeader from "@/components/fragments/SubHeader";
import ChannelSection from "@/components/user/mypage/ChannelSection";
import SubTabNavigation from "@/components/user/mypage/SubTabNavigation";

export default function MypagePage() {
  const router = useRouter();
  const [activeTopTab, setActiveTopTab] = useState<MainTab>("account");
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "channel">(
    "profile"
  );

  // 채널 데이터 상태
  const [channels, setChannels] = useState([
    {
      name: "네이버 블로그",
      url: "https://blog.naver.com/catcat12344",
      status: "connected" as const,
    },
    { name: "인스타그램", status: "disconnected" as const },
    { name: "유튜브", status: "disconnected" as const },
    { name: "틱톡", status: "disconnected" as const },
  ]);

  const handleBackClick = () => {
    router.back();
  };

  // 채널 연결 핸들러
  const handleChannelUpdate = (
    channelName: string,
    channelInfo: { url: string }
  ) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.name === channelName
          ? { ...channel, url: channelInfo.url, status: "connected" as const }
          : channel
      )
    );
  };

  return (
    <div className={layoutStyles.mypage_container}>
      {/* 메인 컨텐츠 */}
      <main className={layoutStyles.main_content}>
        {/* 상단 탭 네비게이션: 캠페인/포인트/계정/커뮤니티 */}
        <TabNavigation
          activeTab={activeTopTab}
          setActiveTab={setActiveTopTab}
        />

        {/* 서브 탭 (프로필/채널·스토어) */}
        <SubTabNavigation
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
        />

        {/* 프로필 섹션 */}
        {activeSubTab === "profile" && (
          <>
            <div className={profileStyles.profile_section}>
              <div className={profileStyles.profile_info}>
                <div className={profileStyles.profile_image} />
                <div className={profileStyles.profile_details}>
                  <div className={profileStyles.profile_role}>리뷰어</div>
                  <div className={profileStyles.profile_nickname_container}>
                    <div className={profileStyles.profile_nickname}>
                      양치하는고양이123456
                    </div>

                    <Image
                      className={profileStyles.edit_icon}
                      src="/images/icons/chevron_right.svg"
                      alt="프로필 편집 이동"
                      width={16}
                      height={16}
                      onClick={() => router.push("/user/mypage/edit")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 메뉴 리스트 */}
            <div className={profileStyles.menu_list}>
              <button
                className={profileStyles.menu_item}
                onClick={() =>
                  window.open("https://markx.dev/guide_book", "_blank")
                }
              >
                <div className={profileStyles.menu_icon} />
                <div className={profileStyles.menu_text}>이용 가이드</div>
              </button>
              <button
                className={profileStyles.menu_item}
                onClick={() => router.push("/user/notice")}
              >
                <div className={profileStyles.menu_icon} />
                <div className={profileStyles.menu_text}>공지사항</div>
              </button>
              <button
                className={profileStyles.menu_item}
                onClick={() => router.push("/user/faq")}
              >
                <div className={profileStyles.menu_icon} />
                <div className={profileStyles.menu_text}>자주 묻는 질문</div>
              </button>
              <button
                className={profileStyles.menu_item}
                onClick={() =>
                  window.open("https://pf.kakao.com/_xjxdxoxG/chat", "_blank")
                }
              >
                <div className={profileStyles.menu_icon} />
                <div className={profileStyles.menu_text}>카카오톡 상담</div>
              </button>
            </div>
          </>
        )}

        {/* 채널 섹션 */}
        {activeSubTab === "channel" && (
          <ChannelSection
            channels={channels}
            onChannelUpdate={handleChannelUpdate}
          />
        )}
      </main>
    </div>
  );
}
