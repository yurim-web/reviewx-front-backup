/* ========================================
   유저 회원가입 완료 페이지
   ======================================== */

/**
 * UserSignupCompletePage
 *
 * 목적: 회원가입이 성공적으로 완료되었음을 알리는 페이지
 *
 * 사용 페이지:
 * - /user/signup/complete (회원가입 완료 페이지)
 *
 * 호출 API:
 * - GET /api/v1/reviewer/sign-up/finish (완료 상태 확인)
 */

"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/fragments/Header";
import { useSignupFinish } from "@/hooks/user/signup/useReviewerSignup";
import Loading from "@/app/loading";
import styles from "@/styles/user/signup/complete.module.css";

function SignupCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 회원가입 완료 상태 확인 (비정상 접근 방지)
  const { isError } = useSignupFinish();

  // 이 페이지에서만 헤더 보더 색상 흰색으로 설정
  useEffect(() => {
    document.body.classList.add("signup_complete_page");
    return () => {
      document.body.classList.remove("signup_complete_page");
    };
  }, []);

  // 비정상 접근 시 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (isError) {
      router.replace("/user/login");
    }
  }, [isError, router]);

  // URL 파라미터에서 닉네임 가져오기 (SNS 닉네임 → 이름 → "회원")
  const nickname = searchParams.get("nickname") || "회원";
  const displayNickname = nickname.trim() || "회원";

  const handleGoToCampaigns = () => {
    router.push("/");
  };

  const handleGoToLogin = () => {
    router.push("/user/login");
  };

  return (
    <div className={styles.complete_page_container}>
      <Header />

      <main className={styles.complete_main}>
        <div className={styles.content_section}>
          <div className={styles.logo_section}>
            <h2 className={styles.logo_text}>VX.</h2>
          </div>

          <div className={styles.message_section}>
            <h1 className={styles.welcome_title}>
              {displayNickname !== "회원" ? (
                <>
                  <span className={styles.nickname_text}>{displayNickname}</span>
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
              <br className={styles.mobile_br} /> 다양한 서비스를 이용해 보세요! 🔥🙌
            </p>
          </div>
        </div>

        <div className={styles.button_section}>
          <button type="button" className={styles.campaign_button} onClick={handleGoToCampaigns}>
            캠페인 신청하러 가기
          </button>
          <button type="button" className={styles.login_button} onClick={handleGoToLogin}>
            로그인
          </button>
        </div>
      </main>
    </div>
  );
}

export default function UserSignupCompletePage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignupCompleteContent />
    </Suspense>
  );
}
