/* ========================================
   계정 찾기 다음 단계 버튼 컴포넌트
   ======================================== */

/**
 * NextButton
 *
 * 목적: 인증 완료 후 다음 단계로 진행하는 버튼
 *
 * 사용 페이지:
 * - src/components/common/find_account/page/FindAccountPage.tsx (계정 찾기 페이지)
 */

"use client";

import styles from "@/styles/common/find_account/find_account.module.css";

interface NextButtonProps {
  /** 버튼 활성화 여부 */
  disabled?: boolean;
  /** 클릭 핸들러 */
  onClick: () => void;
}

export default function NextButton({ disabled, onClick }: NextButtonProps) {
  return (
    <section className={styles.button_section}>
      <button
        type="button"
        className={styles.next_button}
        onClick={onClick}
        disabled={disabled}
        aria-label="다음"
      >
        다음
      </button>
    </section>
  );
}
