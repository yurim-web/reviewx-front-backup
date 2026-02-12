/* ========================================
   ✅ 유저 회원가입 완료 페이지
   ======================================== */

/**
 * 유저 회원가입 완료 페이지
 *
 * 목적: 회원가입이 성공적으로 완료되었음을 알리는 페이지입니다.
 *
 * 페이지 경로:
 * - /user/signup/complete
 *
 * 주요 기능:
 * - 회원가입 완료 메시지 표시
 * - 캠페인 보러 가기 버튼 (홈으로 이동)
 * - 로그인하기 버튼 (로그인 페이지로 이동)
 */

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/fragments/Header";
import styles from "@/styles/user/signup/complete.module.css";

/**
 * 유저 회원가입 완료 페이지 컴포넌트
 *
 * @returns JSX.Element - 유저 회원가입 완료 페이지 UI
 */
export default function UserSignupCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 이 페이지에서만 헤더 보더 색상 흰색으로 설정
  useEffect(() => {
    document.body.classList.add("signup_complete_page");
    return () => {
      document.body.classList.remove("signup_complete_page");
    };
  }, []);

  // URL 파라미터에서 닉네임 가져오기 (없으면 기본값 사용)
  const nickname = searchParams.get("nickname") || "회원";

  // 닉네임이 비어있거나 공백만 있으면 기본값 사용
  const displayNickname = nickname.trim() || "회원";

  /**
   * 캠페인 보러 가기 버튼 클릭 핸들러
   * 홈 페이지로 이동
   */
  const handleGoToCampaigns = () => {
    router.push("/");
  };

  /**
   * 로그인하기 버튼 클릭 핸들러
   * 로그인 페이지로 이동
   */
  const handleGoToLogin = () => {
    router.push("/user/login");
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
              {displayNickname !== "회원" ? (
                <>
                  <span className={styles.nickname_text}>
                    {displayNickname}
                  </span>
                  <span className={styles.nickname_honorific}>님,</span>
                  <br className={styles.desktop_br} />
                  리뷰엑스의 리뷰어가
                  <br className={styles.mobile_br} /> 되신 것을 환영합니다.
                </>
              ) : (
                <>
                  리뷰엑스의 리뷰어가
                  <br className={styles.mobile_br} /> 되신 것을 환영합니다.
                </>
              )}
            </h1>
            <p className={styles.welcome_message}>
              지금 바로 리뷰엑스의
              <br className={styles.mobile_br} /> 다양한 서비스를 이용해 보세요!
              🔥🙌
            </p>
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div className={styles.button_section}>
          <button
            type="button"
            className={styles.campaign_button}
            onClick={handleGoToCampaigns}
          >
            캠페인 신청하러 가기
          </button>
          <button
            type="button"
            className={styles.login_button}
            onClick={handleGoToLogin}
          >
            로그인
          </button>
        </div>
      </main>
    </div>
  );
}
