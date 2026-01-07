// 🔐 사용자 로그인 페이지 (/user/login)
// - 네이버 / 카카오 로그인 버튼
// - 최근 로그인 배지(네이버 / 카카오)
// - 계정찾기 / 문의 / 파트너 로그인 링크

/**
 * 사용자 로그인 페이지
 *
 * 주요 기능:
 * - 네이버/카카오 소셜 로그인
 * - 로그인 성공 후 계정 상태에 따른 리다이렉트
 *   - 정지/탈퇴된 계정 → /pause_info
 *   - 이용 제한된 계정 → /blacklist_info
 *   - 정상 계정 → 일반 페이지
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import styles from "@/styles/user/login/user_login.module.css";

// 통합 계정 데이터에서 계정 찾기 함수 import
// ⚠️ 실제 API 연결 시 이 import는 삭제하고 실제 API 호출로 교체
import {
  UNIFIED_ACCOUNTS,
  type SNSType,
} from "@/data/login/unifiedAccountData";

type RecentLoginProvider = "naver" | "kakao" | null;

export default function UserLoginPage() {
  // Next.js의 useRouter 훅: 페이지 이동을 위한 라우터 객체
  // 클라이언트 컴포넌트에서 페이지 이동 시 사용합니다.
  const router = useRouter();

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
   * 소셜 로그인 성공 후 계정 상태 확인 및 리다이렉트 처리
   *
   * 기능:
   * 1. 소셜 로그인 성공 후 서버에서 받은 계정 정보를 확인합니다.
   * 2. 계정 상태에 따라 적절한 페이지로 리다이렉트합니다.
   *    - isBanned: true → 정지/탈퇴 계정 → /pause_info
   *    - isBlocked: true → 이용 제한 계정 → /blacklist_info
   *    - 정상 계정 → 일반 페이지로 이동
   *
   * @param account - 로그인한 계정 정보 (서버 응답에서 받아온 데이터)
   *
   * 비동기 함수란?
   * - async 키워드: 이 함수가 비동기 작업을 수행한다는 것을 나타냅니다.
   * - await 키워드: 비동기 작업이 완료될 때까지 기다립니다.
   * - 실제 서비스에서는 서버 API 호출이 비동기로 처리되므로 async/await를 사용합니다.
   */
  const handle_social_login_success = async (account: {
    isBanned: boolean;
    isBlocked: boolean;
    redirectUrl: string;
  }) => {
    // 정지/탈퇴된 계정인 경우
    // 조건문: if (조건) { 실행할 코드 }
    if (account.isBanned) {
      // /pause_info 페이지로 이동
      router.push("/pause_info");
      return; // 함수 종료 (아래 코드 실행 안 됨)
    }

    // 이용 제한된 계정인 경우
    if (account.isBlocked) {
      // /blacklist_info 페이지로 이동
      // 이용 제한된 회원은 로그인은 되지만 제한 화면이 표시됩니다.
      router.push("/blacklist_info");
      return; // 함수 종료
    }

    // 정상 계정인 경우: 일반 페이지로 이동
    // redirectUrl은 서버에서 제공하는 로그인 성공 후 이동할 페이지 URL입니다.
    router.push(account.redirectUrl || "/user/campaign_management");
  };

  /**
   * 네이버 로그인 핸들러
   *
   * 실제로는 네이버 OAuth API를 호출해야 함
   *
   * 소셜 로그인 플로우:
   * 1. 사용자가 네이버 로그인 버튼 클릭
   * 2. 네이버 OAuth 인증 페이지로 리다이렉트
   * 3. 사용자가 네이버에서 인증 완료
   * 4. 콜백 URL로 리다이렉트 (예: /user/login/callback?provider=naver)
   * 5. 콜백에서 인증 코드를 받아 서버에 전달
   * 6. 서버에서 네이버 API로 사용자 정보 조회
   * 7. 서버에서 계정 정보와 함께 응답
   * 8. handle_social_login_success 함수 호출하여 리다이렉트 처리
   */
  const handleNaverLogin = async () => {
    console.log("네이버 로그인 클릭");

    // ========================================
    // ⚠️ 실제 API 연결 시 사용할 코드 (아래 주석 해제)
    // ========================================
    // try {
    //   // 네이버 OAuth 인증 페이지로 리다이렉트
    //   window.location.href = "네이버 OAuth URL";
    // } catch (error) {
    //   console.error("네이버 로그인 오류:", error);
    //   alert("로그인 중 오류가 발생했습니다.");
    // }
    // ========================================

    // ========================================
    // 🧪 테스트용 코드 - 실제 API 연결 시 전체 삭제 필요
    // ========================================
    try {
      // 테스트용: 네이버 로그인 계정 찾기
      // 실제로는 서버에서 소셜 로그인 성공 후 계정 정보를 받아옵니다.
      const naver_account = UNIFIED_ACCOUNTS.find(
        (account) => account.userType === "user" && account.snsType === "naver"
      );

      if (!naver_account) {
        console.error("네이버 계정을 찾을 수 없습니다.");
        alert("로그인 중 오류가 발생했습니다.");
        return;
      }

      // 소셜 로그인 성공 처리
      await handle_social_login_success(naver_account);
    } catch (error) {
      console.error("네이버 로그인 오류:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
    // ========================================
  };

  /**
   * 카카오 로그인 핸들러
   *
   * 실제로는 카카오 OAuth API를 호출해야 함
   *
   * 소셜 로그인 플로우는 네이버와 동일합니다.
   */
  const handleKakaoLogin = async () => {
    console.log("카카오 로그인 클릭");

    // ========================================
    // ⚠️ 실제 API 연결 시 사용할 코드 (아래 주석 해제)
    // ========================================
    // try {
    //   // 카카오 OAuth 인증 페이지로 리다이렉트
    //   window.location.href = "카카오 OAuth URL";
    // } catch (error) {
    //   console.error("카카오 로그인 오류:", error);
    //   alert("로그인 중 오류가 발생했습니다.");
    // }
    // ========================================

    // ========================================
    // 🧪 테스트용 코드 - 실제 API 연결 시 전체 삭제 필요
    // ========================================
    try {
      // 테스트용: 카카오 로그인 계정 찾기
      // 실제로는 서버에서 소셜 로그인 성공 후 계정 정보를 받아옵니다.
      const kakao_account = UNIFIED_ACCOUNTS.find(
        (account) => account.userType === "user" && account.snsType === "kakao"
      );

      if (!kakao_account) {
        console.error("카카오 계정을 찾을 수 없습니다.");
        alert("로그인 중 오류가 발생했습니다.");
        return;
      }

      // 소셜 로그인 성공 처리
      await handle_social_login_success(kakao_account);
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
    // ========================================
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
