/* ========================================
   ✅ 파트너 회원가입 완료 페이지
   ======================================== */

/**
 * 파트너 회원가입 완료 페이지
 *
 * 목적: 파트너 회원가입이 성공적으로 완료되었음을 알리는 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/signup/complete
 */

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/fragments/Header";
import styles from "@/styles/user/signup/complete.module.css";

/**
 * 파트너 회원가입 완료 페이지 컴포넌트
 *
 * @returns JSX.Element - 파트너 회원가입 완료 페이지 UI
 */
export default function PartnerSignupCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 이 페이지에서만 헤더 보더 색상 흰색으로 설정
  useEffect(() => {
    document.body.classList.add("signup_complete_page");
    return () => {
      document.body.classList.remove("signup_complete_page");
    };
  }, []);

  // URL 파라미터에서 상호명 가져오기 (피그마 디자인 기준)
  const businessName = searchParams.get("businessName") || "파트너";

  /**
   * 캠페인 보러 가기 버튼 클릭 핸들러
   * 홈 페이지로 이동
   */
  const handleGoToCampaigns = () => {
    router.push("/partner");
  };

  /**
   * 로그인하기 버튼 클릭 핸들러
   * 로그인 페이지로 이동
   */
  const handleGoToLogin = () => {
    router.push("/partner/login");
  };

  return (
    <div className={styles.complete_page_container}>
      {/* 메인 헤더 */}
      <Header />

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.complete_main}>
        {/* 글 부분 (로고 + 메시지) - 화면 상하 중앙 배치 */}
        <div className={styles.content_section}>
          {/* 로고 섹션 */}
          <div className={styles.logo_section}>
            <h2 className={styles.logo_text}>VX.</h2>
          </div>

          {/* 완료 메시지 섹션 */}
          <div className={styles.message_section}>
            <h1 className={styles.welcome_title}>
              {businessName !== "파트너" ? (
                <>
                  <span className={styles.nickname_text}>{businessName}</span>
                  <span className={styles.nickname_honorific}>님,</span>
                  <br className={styles.desktop_br} />
                  리뷰엑스의 파트너가
                  <br className={styles.mobile_br} /> 되신 것을 환영합니다.
                </>
              ) : (
                <>
                  리뷰엑스의 파트너가
                  <br className={styles.mobile_br} /> 되신 것을 환영합니다.
                </>
              )}
            </h1>
            <p className={styles.welcome_message}>
              지금 바로 리뷰엑스의
              <br className={styles.mobile_br} /> 다양한 서비스를 이용해 보세요! 🔥🙌
            </p>
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div className={styles.button_section}>
          <button type="button" className={styles.campaign_button} onClick={handleGoToCampaigns}>
            캠페인 등록 가이드 보기
          </button>
          <button type="button" className={styles.login_button} onClick={handleGoToLogin}>
            로그인
          </button>
        </div>
      </main>
    </div>
  );
}
