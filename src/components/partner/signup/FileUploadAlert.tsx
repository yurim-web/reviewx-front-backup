/* ========================================
   🔔 파일 업로드 얼럿 모달 컴포넌트
   ======================================== */

/**
 * 모듈 목적
 *
 * - 사업자등록증 파일 업로드 시 에러 메시지 표시
 * - 파일 크기 제한 (10mb 이하)
 * - 파일 확장자 제한 (PDF, JPG, PNG만)
 */

'use client';

import styles from '@/styles/partner/signup/signup.module.css';

interface FileUploadAlertProps {
  message: string;
  onClose: () => void;
}

export default function FileUploadAlert({
  message,
  onClose,
}: FileUploadAlertProps) {
  // 오버레이 클릭 시에도 모달 닫기
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.alert_overlay} onClick={handleOverlayClick}>
      <div className={styles.alert_container}>
        <div className={styles.alert_content}>
          <p className={styles.alert_message}>{message || ''}</p>
          <button
            type="button"
            className={styles.alert_close_button}
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

