/**
 * 에러 모달 컴포넌트
 *
 * 에러 메시지를 표시하는 모달 컴포넌트입니다.
 *
 * 사용처:
 * - src/components/common/mypage/ProfilePhotoUpload.tsx
 */

"use client";

import styles from "@/styles/user/mypage/edit_profile.module.css";

interface ErrorModalProps {
  /** 에러 메시지 */
  message: string | null;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
}

export default function ErrorModal({ message, onClose }: ErrorModalProps) {
  if (!message) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.upload_alert_overlay} onClick={handleOverlayClick}>
      <div className={styles.upload_alert_container}>
        <div className={styles.upload_alert_content}>
          <p className={styles.upload_alert_message}>{message}</p>
          <button
            type="button"
            className={styles.upload_alert_close_button}
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
