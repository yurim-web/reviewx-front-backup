/* ========================================
   🔍 정지/탈퇴 계정 모달 컴포넌트
   ======================================== */

/**
 * 정지/탈퇴 계정 모달 컴포넌트
 *
 * 목적: 정지되었거나 탈퇴된 계정일 때 표시하는 모달입니다.
 *
 * 주요 기능:
 * - 정지/탈퇴 안내 메시지 표시
 * - 닫기 버튼
 *
 * 사용처:
 * - src/components/common/FindAccountPage.tsx
 */

"use client";

import styles from "@/styles/common/find_account/find_account.module.css";
import ModalButton from "./ModalButton";

/**
 * BlockedAccountModal Props 타입
 */
interface BlockedAccountModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
}

/**
 * 정지/탈퇴 계정 모달 컴포넌트
 */
export default function BlockedAccountModal({
  isOpen,
  onClose,
}: BlockedAccountModalProps) {
  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div
      className={styles.error_modal_overlay}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={styles.error_modal_container}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.error_modal_content}>
          <p className={styles.error_modal_message}>
            정지되었거나 탈퇴된 계정입니다.
          </p>

          <ModalButton variant="close" onClick={onClose}>
            닫기
          </ModalButton>
        </div>
      </div>
    </div>
  );
}
