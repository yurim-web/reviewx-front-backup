"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TabNavigation from "@/components/campaign_management/TabNavigation";
import type { MainTab } from "@/types/campaignManagement";
import styles from "../../styles/mypage/mypage.module.css";
import SubHeader from "@/components/fragments/SubHeader";

export default function MypagePage() {
  const router = useRouter();
  const [activeTopTab, setActiveTopTab] = useState<MainTab>("account");
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "channel">(
    "profile"
  );

  const handleBackClick = () => {
    router.back();
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
                      onClick={() => router.push("/mypage/edit")}
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
                onClick={() => router.push("/notice")}
              >
                <div className={styles.menu_icon} />
                <div className={styles.menu_text}>공지사항</div>
              </button>
              <button
                className={styles.menu_item}
                onClick={() => router.push("/faq")}
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
            {/* 채널 섹션 */}
            <div className={styles.channel_section}>
              <div className={styles.section_title}>채널</div>

              {/* 네이버 블로그 */}
              <div className={styles.platform_item}>
                <div className={styles.platform_icon} />
                <div className={styles.platform_info}>
                  <div className={styles.platform_name}>네이버 블로그</div>
                  <div className={styles.platform_url}>
                    https://blog.naver.com/catcat12344
                  </div>
                </div>
                <button className={styles.more_button}>
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

              {/* 인스타그램 */}
              <div className={styles.platform_item}>
                <div className={styles.platform_icon} />
                <div className={styles.platform_info}>
                  <div className={styles.platform_name}>인스타그램</div>
                  <div className={styles.platform_status}>
                    계정을 연결해 주세요.
                  </div>
                </div>
                <button className={styles.more_button}>
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

              {/* 유튜브 */}
              <div className={styles.platform_item}>
                <div className={styles.platform_icon} />
                <div className={styles.platform_info}>
                  <div className={styles.platform_name}>유튜브</div>
                  <div className={styles.platform_status}>
                    계정을 연결해 주세요.
                  </div>
                </div>
                <button className={styles.more_button}>
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

              {/* 틱톡 */}
              <div className={styles.platform_item}>
                <div className={styles.platform_icon} />
                <div className={styles.platform_info}>
                  <div className={styles.platform_name}>틱톡</div>
                  <div className={styles.platform_status}>
                    계정을 연결해 주세요.
                  </div>
                </div>
                <button className={styles.more_button}>
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
            </div>

            {/* 스토어 섹션 */}
            <div className={styles.store_section}>
              <div className={styles.section_title}>스토어</div>

              <div className={styles.store_grid}>
                {/* 네이버 쇼핑 */}
                <div className={styles.store_item}>
                  <div className={styles.store_icon} />
                  <div className={styles.store_info}>
                    <div className={styles.store_name}>네이버 쇼핑</div>
                    <div className={styles.store_id}>gdhong12</div>
                  </div>
                  <button className={styles.store_more_button}>
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

                {/* 쿠팡 */}
                <div className={styles.store_item}>
                  <div className={styles.store_icon} />
                  <div className={styles.store_info}>
                    <div className={styles.store_name}>쿠팡</div>
                    <div className={styles.store_id}>gdong@naver.com</div>
                  </div>
                  <button className={styles.store_more_button}>
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

                {/* 카카오 쇼핑 */}
                <div className={styles.store_item}>
                  <div className={styles.store_icon} />
                  <div className={styles.store_info}>
                    <div className={styles.store_name}>카카오 쇼핑</div>
                    <div className={styles.store_id}>gdhong@kakao.com</div>
                  </div>
                  <button className={styles.store_more_button}>
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

                {/* 카카오 선물하기 */}
                <div className={styles.store_item}>
                  <div className={styles.store_icon} />
                  <div className={styles.store_info}>
                    <div className={styles.store_name}>카카오 선물하기</div>
                    <div className={styles.store_status}>
                      계정을 연결해 주세요.
                    </div>
                  </div>
                  <button className={styles.store_more_button}>
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

                {/* 오늘의집 */}
                <div className={styles.store_item}>
                  <div className={styles.store_icon} />
                  <div className={styles.store_info}>
                    <div className={styles.store_name}>오늘의집</div>
                    <div className={styles.store_status}>
                      계정을 연결해 주세요.
                    </div>
                  </div>
                  <button className={styles.store_more_button}>
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

                {/* 올리브영 */}
                <div className={styles.store_item}>
                  <div className={styles.store_icon} />
                  <div className={styles.store_info}>
                    <div className={styles.store_name}>올리브영</div>
                    <div className={styles.store_status}>
                      계정을 연결해 주세요.
                    </div>
                  </div>
                  <button className={styles.store_more_button}>
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

                {/* 컬리 */}
                <div className={styles.store_item}>
                  <div className={styles.store_icon} />
                  <div className={styles.store_info}>
                    <div className={styles.store_name}>컬리</div>
                    <div className={styles.store_status}>
                      계정을 연결해 주세요.
                    </div>
                  </div>
                  <button className={styles.store_more_button}>
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

                {/* 지그재그 */}
                <div className={styles.store_item}>
                  <div className={styles.store_icon} />
                  <div className={styles.store_info}>
                    <div className={styles.store_name}>지그재그</div>
                    <div className={styles.store_status}>
                      계정을 연결해 주세요.
                    </div>
                  </div>
                  <button className={styles.store_more_button}>
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
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
