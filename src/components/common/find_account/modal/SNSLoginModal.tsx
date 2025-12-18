/* ========================================
   🔍 SNS 로그인 유도 모달 컴포넌트
   ======================================== */

/**
 * SNS 로그인 유도 모달 컴포넌트
 *
 * 목적: 휴대폰 번호로 가입된 계정이 SNS(카카오)로만 가입된 경우,
 *       SNS 로그인을 유도하는 모달입니다.
 *
 * 주요 기능:
 * - SNS 로그인 안내 메시지 표시
 * - 카카오 로그인 버튼
 * - 닫기 버튼
 *
 * 사용처:
 * - src/components/common/FindAccountPage.tsx
 */

"use client";

import styles from "@/styles/common/find_account.module.css";
import ModalButton from "./ModalButton";

/**
 * SNSLoginModal Props 타입
 */
interface SNSLoginModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 카카오 로그인 버튼 클릭 핸들러 */
  onKakaoLogin?: () => void;
}

/**
 * SNS 로그인 유도 모달 컴포넌트
 */
export default function SNSLoginModal({
  isOpen,
  onClose,
  onKakaoLogin,
}: SNSLoginModalProps) {
  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div
      className={styles.sns_modal_overlay}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={styles.sns_modal_container}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.sns_modal_content}>
          <p className={styles.sns_modal_message}>
            입력하신 휴대폰 번호로 가입된 계정이 있습니다.
            <br />
            아래 안내된 버튼을 통해 로그인해 주세요.
          </p>

          <div className={styles.sns_modal_button_group}>
            <ModalButton
              variant="kakao"
              onClick={() => {
                onKakaoLogin?.();
                onClose();
              }}
            >
              카카오 로그인하기
            </ModalButton>
            <ModalButton variant="sns-secondary" onClick={onClose}>
              닫기
            </ModalButton>
          </div>
        </div>
      </div>
    </div>
  );
}
