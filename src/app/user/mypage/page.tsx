"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import type { MainTab } from "@/types/campaignManagement";
import styles from "../../../styles/user/mypage/mypage.module.css";
import SubHeader from "@/components/fragments/SubHeader";
import ChannelSection from "@/components/user/mypage/ChannelSection";
import StoreSection from "@/components/user/mypage/StoreSection";

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

  // 스토어 데이터 상태
  const [stores, setStores] = useState([
    {
      name: "네이버 쇼핑",
      storeId: "gdhong12",
      email: "",
      status: "connected" as const,
    },
    {
      name: "쿠팡",
      storeId: "",
      email: "gdong@naver.com",
      status: "connected" as const,
    },
    {
      name: "카카오 쇼핑",
      storeId: "",
      email: "gdhong@kakao.com",
      status: "connected" as const,
    },
    {
      name: "카카오 선물하기",
      storeId: "",
      email: "",
      status: "disconnected" as const,
    },
    {
      name: "오늘의집",
      storeId: "",
      email: "",
      status: "disconnected" as const,
    },
    {
      name: "올리브영",
      storeId: "",
      email: "",
      status: "disconnected" as const,
    },
    { name: "컬리", storeId: "", email: "", status: "disconnected" as const },
    {
      name: "지그재그",
      storeId: "",
      email: "",
      status: "disconnected" as const,
    },
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

  // 스토어 연결 핸들러
  const handleStoreUpdate = (
    storeName: string,
    storeInfo: { storeId: string; email: string }
  ) => {
    setStores((prev) =>
      prev.map((store) =>
        store.name === storeName
          ? {
              name: store.name,
              storeId: storeInfo.storeId,
              email: storeInfo.email,
              status: "connected" as const,
            }
          : store
      )
    );
  };

  return (
    <div className={styles.mypage_container}>
      {/* 메인 컨텐츠 */}
      <main className={styles.main_content}>
        {/* 상단 탭 네비게이션: 캠페인/포인트/계정/커뮤니티 */}
        <TabNavigation
          activeTab={activeTopTab}
          setActiveTab={setActiveTopTab}
        />

        {/* 서브 탭 (프로필/채널·스토어) */}
        <div className={styles.sub_tab_container}>
          <button
            className={`${styles.sub_tab_item} ${
              activeSubTab === "profile" ? styles.active : ""
            }`}
            onClick={() => setActiveSubTab("profile")}
          >
            프로필
          </button>
          <button
            className={`${styles.sub_tab_item} ${
              activeSubTab === "channel" ? styles.active : ""
            }`}
            onClick={() => setActiveSubTab("channel")}
          >
            채널 · 스토어
          </button>
          {activeSubTab === "profile" && (
            <div className={styles.sub_tab_indicator} />
          )}
          {activeSubTab === "channel" && (
            <div className={styles.sub_tab_indicator_channel} />
          )}
        </div>

        {/* 프로필 섹션 */}
        {activeSubTab === "profile" && (
          <>
            <div className={styles.profile_section}>
              <div className={styles.profile_info}>
                <div className={styles.profile_image} />
                <div className={styles.profile_details}>
                  <div className={styles.profile_role}>리뷰어</div>
                  <div className={styles.profile_nickname_container}>
                    <div className={styles.profile_nickname}>
                      양치하는고양이123456
                    </div>
                    <svg
                      className={styles.edit_icon}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => router.push("/user/mypage/edit")}
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="#444"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 메뉴 리스트 */}
            <div className={styles.menu_list}>
              <button
                className={styles.menu_item}
                onClick={() =>
                  window.open("https://markx.dev/guide_book", "_blank")
                }
              >
                <div className={styles.menu_icon} />
                <div className={styles.menu_text}>이용 가이드</div>
              </button>
              <button
                className={styles.menu_item}
                onClick={() => router.push("/user/notice")}
              >
                <div className={styles.menu_icon} />
                <div className={styles.menu_text}>공지사항</div>
              </button>
              <button
                className={styles.menu_item}
                onClick={() => router.push("/user/faq")}
              >
                <div className={styles.menu_icon} />
                <div className={styles.menu_text}>자주 묻는 질문</div>
              </button>
              <button
                className={styles.menu_item}
                onClick={() =>
                  window.open("https://pf.kakao.com/_xjxdxoxG/chat", "_blank")
                }
              >
                <div className={styles.menu_icon} />
                <div className={styles.menu_text}>카카오톡 상담</div>
              </button>
            </div>
          </>
        )}

        {/* 채널·스토어 섹션 */}
        {activeSubTab === "channel" && (
          <>
            <ChannelSection
              channels={channels}
              onChannelUpdate={handleChannelUpdate}
            />
            <StoreSection stores={stores} onStoreUpdate={handleStoreUpdate} />
          </>
        )}
      </main>
    </div>
  );
}
