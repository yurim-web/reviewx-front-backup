/**
 * 다음 버튼 컴포넌트
 *
 * 인증 완료 후 다음 단계로 진행하는 버튼입니다.
 *
 * 사용처:
 * - src/components/common/FindAccountPage.tsx
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
