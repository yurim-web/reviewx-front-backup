/* ========================================
   🔐 소셜 로그인 페이지 (SNS Login)
   ======================================== */

/**
 * 소셜 로그인 페이지
 *
 * 목적: 사용자가 소셜 로그인(네이버, 카카오)을 통해 서비스에 접근할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /user/sns_login
 *
 * 주요 기능:
 * - 네이버 소셜 로그인
 * - 카카오 소셜 로그인
 * - 아이디/비밀번호 찾기 링크
 * - 파트너 회원 로그인 링크
 * - 최근 로그인 배지 표시
 *
 * - React의 useState 훅: 컴포넌트 내부 상태 관리
 * - 조건부 렌더링: showRecentLogin 상태에 따라 배지 표시/숨김
 * - 이벤트 핸들러: onClick으로 버튼 클릭 이벤트 처리
 * - Next.js Link 컴포넌트: 클라이언트 사이드 네비게이션
 * - CSS 모듈: 스타일을 컴포넌트별로 격리하여 관리
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/user/login/sns_login.module.css";

/**
 * 소셜 로그인 페이지 컴포넌트
 *
 * @returns JSX.Element - 소셜 로그인 페이지 UI
 */
export default function SnsLoginPage() {
  // ========================================
  // 상태 관리 (State Management)
  // ========================================

  /**
   * 최근 로그인 배지 표시 여부 상태
   *
   * useState 훅 사용법:
   * - useState(false): 초기값을 false로 설정
   * - showRecentLogin: 현재 상태 값
   * - setShowRecentLogin: 상태를 변경하는 함수
   *
   * 예시: setShowRecentLogin(true) 호출 시 showRecentLogin이 true로 변경됨
   */
  const [showRecentLogin, setShowRecentLogin] = useState(false);

  // ========================================
  // 이벤트 핸들러 (Event Handlers)
  // ========================================

  /**
   * 네이버 로그인 핸들러
   *
   * 실제로는 네이버 OAuth API를 호출해야 함
   *
   * - 화살표 함수: const 함수명 = () => { } 형태
   * - console.log: 개발자 도구에서 확인할 수 있는 디버깅 메서드
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
            {/* 최근 로그인 배지 (조건부 렌더링) */}
            {showRecentLogin && (
              <div className={styles.recent_login_badge}>
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
            {/* 최근 로그인 배지 (조건부 렌더링) */}
            {showRecentLogin && (
              <div className={styles.recent_login_badge}>
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
          {/* 사용자 전용 계정찾기 페이지로 이동 링크
              - href="/user/find-account": 사용자 전용 계정찾기 페이지
              - 클릭 시 클라이언트 사이드 네비게이션으로 이동 */}
          <Link href="/user/find-account" className={styles.login_link}>
            계정찾기
          </Link>
          <Link href="/inquiry" className={styles.login_link}>
            문의가 필요한가요?
          </Link>
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
