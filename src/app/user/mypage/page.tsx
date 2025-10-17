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

                    <svg
                      className={profileStyles.edit_icon}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => router.push("/user/mypage/edit")}
                    >
                      <path
                        d="M4.70179 2.40511C4.64165 2.34146 4.59463 2.26659 4.56342 2.18477C4.53221 2.10295 4.51742 2.01578 4.51989 1.92825C4.52237 1.84072 4.54206 1.75453 4.57785 1.6746C4.61363 1.59468 4.66481 1.52258 4.72846 1.46244C4.79211 1.40229 4.86698 1.35527 4.9488 1.32406C5.03061 1.29285 5.11778 1.27806 5.20531 1.28054C5.29285 1.28302 5.37904 1.30271 5.45896 1.3385C5.53889 1.37428 5.61098 1.42546 5.67112 1.48911L11.3378 7.48911C11.4548 7.61288 11.52 7.77676 11.52 7.94711C11.52 8.11745 11.4548 8.28133 11.3378 8.40511L5.67112 14.4058C5.61138 14.4708 5.5393 14.5233 5.45908 14.5603C5.37886 14.5972 5.2921 14.6179 5.20384 14.621C5.11558 14.6241 5.02757 14.6097 4.94493 14.5786C4.8623 14.5474 4.78667 14.5001 4.72246 14.4395C4.65825 14.3788 4.60672 14.3061 4.57088 14.2253C4.53503 14.1446 4.51558 14.0576 4.51366 13.9693C4.51174 13.881 4.52738 13.7932 4.55968 13.711C4.59197 13.6288 4.64028 13.5538 4.70179 13.4904L9.93646 7.94711L4.70179 2.40511Z"
                        fill="#444444"
                      />
                    </svg>
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
