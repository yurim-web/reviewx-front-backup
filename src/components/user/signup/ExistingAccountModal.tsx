/* ========================================
   🔔 기존 계정 모달 컴포넌트
   ======================================== */

/**
 * 모듈 목적
 *
 * - 해당 휴대폰 번호로 가입된 계정이 있을 때 표시되는 모달
 * - 카카오 로그인하기 버튼 및 닫기 버튼 제공
 */

'use client';

import styles from '@/styles/user/signup/signup.module.css';

interface ExistingAccountModalProps {
  onClose: () => void;
  onKakaoLogin: () => void;
}

export default function ExistingAccountModal({
  onClose,
  onKakaoLogin,
}: ExistingAccountModalProps) {
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
            className={styles.kakao_login_button}
            onClick={onKakaoLogin}
          >
            카카오 로그인하기
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

