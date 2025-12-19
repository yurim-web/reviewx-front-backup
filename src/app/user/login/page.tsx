// 🔐 사용자 로그인 페이지 (/user/login)
// - 네이버 / 카카오 로그인 버튼
// - 최근 로그인 배지(네이버 / 카카오)
// - 계정찾기 / 문의 / 파트너 로그인 링크

"use client";

import { useState } from "react";

import Link from "next/link";

import styles from "@/styles/user/login/user_login.module.css";

type RecentLoginProvider = "naver" | "kakao" | null;

export default function UserLoginPage() {
  // ========================================
  // 상태 관리 (State Management)
  // ========================================

  /**
   * 최근 로그인 정보 (어느 소셜로 마지막 로그인했는지)
   *
   * TODO: 실제 구현 시에는 localStorage 또는 서버 응답을 통해
   *       마지막 로그인 제공자를 설정하도록 교체 필요
   */
  const [recentLoginProvider] = useState<RecentLoginProvider>("naver");

  // ========================================
  // 이벤트 핸들러 (Event Handlers)
  // ========================================

  /**
   * 네이버 로그인 핸들러
   *
   * 실제로는 네이버 OAuth API를 호출해야 함
   */
  const handleNaverLogin = () => {
    console.log("네이버 로그인 클릭");

    // TODO: 네이버 OAuth 로그인 구현
    // window.location.href = "네이버 OAuth URL";
  };

  /**
   * 카카오 로그인 핸들러
   *
   * 실제로는 카카오 OAuth API를 호출해야 함
   */
  const handleKakaoLogin = () => {
    console.log("카카오 로그인 클릭");

    // TODO: 카카오 OAuth 로그인 구현
    // window.location.href = "카카오 OAuth URL";
  };

  // ========================================
  // 렌더링 (JSX)
  // ========================================

  return (
    <div className={styles.login_page_container}>
      {/* 메인 콘텐츠 영역 */}
      <main className={styles.login_main}>
        {/* 로그인 메시지 섹션 */}
        <section className={styles.login_message_section}>
          <h2 className={styles.login_title}>
            리뷰엑스,
            <br />
            캠페인의 완성은
            <br />
            당신의 리뷰가 담당합니다.
          </h2>
        </section>

        {/* 소셜 로그인 버튼 섹션 */}
        <section className={styles.social_login_section}>
          {/* 네이버 로그인 버튼 */}
          <div className={styles.login_button_wrapper}>
            {/* 최근 로그인 배지 (네이버 최근 로그인 시 - 버튼 위 말풍선) */}
            {recentLoginProvider === "naver" && (
              <div
                className={`${styles.recent_login_badge} ${styles.recent_login_badge_top}`}
              >
                <span className={styles.badge_text}>최근 로그인</span>
              </div>
            )}

            <button
              className={`${styles.login_button} ${styles.naver_button}`}
              onClick={handleNaverLogin}
              type="button"
              aria-label="네이버로 로그인"
            >
              네이버로 시작하기
            </button>
          </div>

          {/* 카카오 로그인 버튼 */}
          <div className={styles.login_button_wrapper}>
            {/* 최근 로그인 배지 (카카오 최근 로그인 시 - 버튼 아래 말풍선) */}
            {recentLoginProvider === "kakao" && (
              <div
                className={`${styles.recent_login_badge} ${styles.recent_login_badge_bottom}`}
              >
                <span className={styles.badge_text}>최근 로그인</span>
              </div>
            )}

            <button
              className={`${styles.login_button} ${styles.kakao_button}`}
              onClick={handleKakaoLogin}
              type="button"
              aria-label="카카오로 로그인"
            >
              카카오로 시작하기
            </button>
          </div>
        </section>

        {/* 하단 링크 섹션 */}
        <section className={styles.login_links_section}>
          {/* 사용자 전용 계정찾기 페이지로 이동 링크 */}
          <Link href="/user/find-account" className={styles.login_link}>
            계정찾기
          </Link>
          {/* 카카오 문의 외부 링크 */}
          <a
            href="https://pf.kakao.com" // TODO: 실제 카카오톡 문의 URL로 교체
            className={styles.login_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            문의가 필요한가요?
          </a>
        </section>
      </main>

      {/* 파트너 회원 로그인 링크 - 화면 하단 고정 */}
      <div className={styles.partner_login_section}>
        <Link href="/partner/login" className={styles.partner_login_link}>
          파트너 회원 로그인
        </Link>
      </div>
    </div>
  );
}
