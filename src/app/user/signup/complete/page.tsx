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

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/fragments/Header';
import styles from '@/styles/user/signup/complete.module.css';

/**
 * 유저 회원가입 완료 페이지 컴포넌트
 *
 * @returns JSX.Element - 유저 회원가입 완료 페이지 UI
 */
export default function UserSignupCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 닉네임 가져오기 (없으면 기본값 사용)
  const nickname = searchParams.get('nickname') || '회원';

  /**
   * 캠페인 보러 가기 버튼 클릭 핸들러
   * 홈 페이지로 이동
   */
  const handleGoToCampaigns = () => {
    router.push('/');
  };

  /**
   * 로그인하기 버튼 클릭 핸들러
   * 로그인 페이지로 이동
   */
  const handleGoToLogin = () => {
    router.push('/user/login');
  };

  return (
    <div className={styles.complete_page_container}>
      {/* 메인 헤더 */}
      <Header />

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.complete_main}>
        {/* 로고 섹션 */}
        <div className={styles.logo_section}>
          <h2 className={styles.logo_text}>VX.</h2>
        </div>

        {/* 완료 메시지 섹션 */}
        <div className={styles.message_section}>
          <h1 className={styles.welcome_title}>
            {nickname}님,
            <br />
            리뷰엑스의 리뷰어가 되신 것을 환영합니다.
          </h1>
          <p className={styles.welcome_message}>
            지금 바로 리뷰엑스의 다양한 서비스를 이용해 보세요! 🔥🙌
          </p>
        </div>

        {/* 버튼 섹션 */}
        <div className={styles.button_section}>
          <button
            type="button"
            className={styles.campaign_button}
            onClick={handleGoToCampaigns}
          >
            캠페인 보러 가기
          </button>
          <button
            type="button"
            className={styles.login_button}
            onClick={handleGoToLogin}
          >
            로그인하기
          </button>
        </div>
      </main>
    </div>
  );
}
