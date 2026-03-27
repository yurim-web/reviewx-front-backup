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
 *
 * 호출 API:
 * - GET /api/v1/auth/{provider}/authorize (소셜 로그인 시작 → 302 Redirect)
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import styles from "@/styles/user/login/user_login.module.css";
import { getLastLoginProvider } from "@/lib/api/userAuth";
import { getStoredToken } from "@/lib/auth";
import type { SocialProvider } from "@/types/api/auth";

// ⚠️ 백엔드 연동 시 아래 2줄 삭제 + startSocialLogin import 복구
import { UNIFIED_ACCOUNTS } from "@/data/login/unifiedAccountData";
import { authenticateUnifiedAccount } from "@/lib/auth";

export default function UserLoginPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [recentProvider, setRecentProvider] = useState<SocialProvider | null>(null);

  useEffect(() => {
    // 이미 로그인되어 있으면 캠페인 관리 페이지로 리다이렉트
    const token = getStoredToken("user");
    if (token) {
      router.replace("/user/campaign_management");
      return;
    }

    // 최근 로그인한 소셜 제공자 조회 (배지 표시용)
    setRecentProvider(getLastLoginProvider());
    setReady(true);
  }, [router]);

  // ⚠️ 백엔드 연동 시 아래 함수 삭제 + onClick={() => startSocialLogin('naver')} 복구
  const handleNaverLogin = async () => {
    const account = UNIFIED_ACCOUNTS.find((a) => a.id === "user_naver_001");
    if (!account) return;
    await authenticateUnifiedAccount(account);
    localStorage.setItem("reviewx_last_login_provider", "naver");
    router.push("/user/campaign_management");
  };

  // ⚠️ 백엔드 연동 시 아래 함수 삭제 + onClick={() => startSocialLogin('kakao')} 복구
  const handleKakaoLogin = () => {
    router.push("/user/signup?signupToken=mock_kakao_token&provider=KAKAO");
  };

  // 토큰 체크 완료 전까지 빈 화면 (깜빡임 방지)
  if (!ready) return null;

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
            {recentProvider === "naver" && (
              <div className={`${styles.recent_login_badge} ${styles.recent_login_badge_top}`}>
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
            <button
              className={`${styles.login_button} ${styles.kakao_button}`}
              onClick={handleKakaoLogin}
              type="button"
              aria-label="카카오로 로그인"
            >
              카카오로 시작하기
            </button>

            {recentProvider === "kakao" && (
              <div className={`${styles.recent_login_badge} ${styles.recent_login_badge_bottom}`}>
                <span className={styles.badge_text}>최근 로그인</span>
              </div>
            )}
          </div>
        </section>

        {/* 하단 링크 섹션 */}
        <section className={styles.login_links_section}>
          <Link href="/user/find-account" className={styles.login_link}>
            계정 찾기
          </Link>
          <a
            href="https://pf.kakao.com"
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
