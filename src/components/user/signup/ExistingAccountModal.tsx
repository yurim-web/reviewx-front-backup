/* ========================================
   🔔 기존 계정 모달 컴포넌트
   ======================================== */

/**
 * 모듈 목적
 *
 * - 해당 휴대폰 번호로 가입된 계정이 있을 때 표시되는 모달
 * - 소셜 로그인 타입(카카오/네이버)에 따라 버튼 텍스트와 동작 변경
 * - 카카오 또는 네이버 로그인하기 버튼 및 닫기 버튼 제공
 *
 * 📍 사용 페이지/컴포넌트:
 * - src/app/user/signup/page.tsx
 *   (사용자 회원가입 페이지에서 휴대폰 인증 완료 후 기존 계정이 있을 때 표시)
 */

'use client';

import styles from '@/styles/user/signup/user_signup.module.css';

/**
 * 소셜 로그인 타입
 * - 'kakao': 카카오 로그인
 * - 'naver': 네이버 로그인
 */
export type SocialLoginType = 'kakao' | 'naver';

interface ExistingAccountModalProps {
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 소셜 로그인 타입 (카카오 또는 네이버) */
  socialLoginType: SocialLoginType;
  /** 카카오 로그인 핸들러 */
  onKakaoLogin: () => void;
  /** 네이버 로그인 핸들러 */
  onNaverLogin: () => void;
}

export default function ExistingAccountModal({
  onClose,
  socialLoginType,
  onKakaoLogin,
  onNaverLogin,
}: ExistingAccountModalProps) {
  /**
   * 소셜 로그인 타입에 따른 버튼 텍스트 결정
   * - 'kakao' → '카카오 로그인하기'
   * - 'naver' → '네이버 로그인하기'
   */
  const getButtonText = () => {
    return socialLoginType === 'kakao'
      ? '카카오 로그인하기'
      : '네이버 로그인하기';
  };

  /**
   * 소셜 로그인 타입에 따른 핸들러 선택
   * - 'kakao' → onKakaoLogin
   * - 'naver' → onNaverLogin
   */
  const handleSocialLogin = () => {
    if (socialLoginType === 'kakao') {
      onKakaoLogin();
    } else {
      onNaverLogin();
    }
  };

  /**
   * 소셜 로그인 타입에 따른 CSS 클래스 결정
   * - 카카오: kakao_login_button
   * - 네이버: naver_login_button
   */
  const getButtonClassName = () => {
    return socialLoginType === 'kakao'
      ? styles.kakao_login_button
      : styles.naver_login_button;
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_container}>
        <div className={styles.modal_content}>
          <p className={styles.modal_message}>
            입력하신 휴대폰 번호로 가입된 계정이 있습니다.
            <br />
            아래 안내된 버튼을 통해 로그인해 주세요.
          </p>
          <button
            type="button"
            className={getButtonClassName()}
            onClick={handleSocialLogin}
          >
            {getButtonText()}
          </button>
          <button
            type="button"
            className={styles.modal_close_button}
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
