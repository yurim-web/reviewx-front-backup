/* ========================================
   유저 로그인 페이지
   ======================================== */

/**
 * UserLoginPage
 *
 * 목적: 카카오/네이버 소셜 로그인으로 사용자를 인증하는 페이지
 *
 * 사용 페이지:
 * - /user/login (사용자 로그인)
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import styles from "@/styles/user/login/user_login.module.css";

// ⚠️ 실제 API 연결 시 이 import는 삭제하고 실제 API 호출로 교체
import {
  UNIFIED_ACCOUNTS,
  type UnifiedAccount,
} from "@/data/login/unifiedAccountData";
import { authenticateUnifiedAccount } from "@/lib/auth";

type RecentLoginProvider = "naver" | "kakao" | null;

export default function UserLoginPage() {
  const router = useRouter();

  // 최근 로그인한 소셜 제공자 (테스트용)
  const [recentLoginProvider] = useState<RecentLoginProvider>("naver");

  // ========================================
  // 자동 로그인 비활성화
  // ========================================
  // useEffect(() => {
  //   // 이미 로그인되어 있으면 처리
  //   if (user) {
  //     // user 계정이면 user 페이지로 리다이렉트
  //     if (user.role === 'user') {
  //       router.push('/user/campaign_management');
  //     }
  //     // 파트너/관리자 계정이면 자동 로그인 안 함
  //     return;
  //   }

  //   // 로그인되어 있지 않으면 자동으로 네이버 계정으로 로그인
  //   const naver_account = UNIFIED_ACCOUNTS.find(
  //     (account) => account.userType === "user" && account.snsType === "naver"
  //   );

  //   if (naver_account) {
  //     login(naver_account);
  //     router.push(naver_account.redirectUrl || '/user/campaign_management');
  //   }
  // }, [user, login, router]);

  // 소셜 로그인 성공 후 계정 상태에 따른 리다이렉트 + 로컬 세션 저장
  const handle_social_login_success = async (account: UnifiedAccount) => {
    try {
      // SNS 계정 정보를 바로 AuthUser로 변환해서 LocalStorage에 저장
      await authenticateUnifiedAccount(account);
    } catch (_error) {
      alert("로그인 중 오류가 발생했습니다.");
      return;
    }

    if (account.isBanned) {
      router.push("/pause_info");
      return;
    }

    if (account.isBlocked) {
      router.push("/blacklist_info");
      return;
    }

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
    // ========================================
    // ⚠️ 실제 API 연결 시 사용할 코드 (아래 주석 해제)
    // ========================================
    // try {
    //   // 네이버 OAuth 인증 페이지로 리다이렉트
    //   window.location.href = "네이버 OAuth URL";
    // } catch (_error) {
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
        alert("로그인 중 오류가 발생했습니다.");
        return;
      }

      // 소셜 로그인 성공 처리
      await handle_social_login_success(naver_account);
    } catch (_error) {
      alert("로그인 중 오류가 발생했습니다.");
    }
    // ========================================
  };

  /**
   * 카카오 버튼 클릭 핸들러
   *
   * 리뷰어 회원가입 페이지로 이동합니다.
   * (네이버는 로그인, 카카오는 회원가입으로 분리)
   */
  const handleKakaoLogin = () => {
    router.push("/user/signup");
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
            계정 찾기
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
