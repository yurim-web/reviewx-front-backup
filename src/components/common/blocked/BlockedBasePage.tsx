/* ========================================
   🚫 이용 제한/정지/탈퇴 안내 공용 페이지 컴포넌트
   ======================================== */

/**
 * 이용 제한 / 정지 / 탈퇴 안내 공용 레이아웃 컴포넌트
 *
 * 사용 컴포넌트:
 * - /blocked
 * - /blacklist_info
 * - /pause_info
 * - /blocked/account
 * - /partner/blocked
 */

import styles from "@/styles/common/blocked_user/blocked_user.module.css";

interface BlockedBasePageProps {
  /** 안내 문구 */
  message: string;
  /** 버튼 텍스트 */
  buttonLabel: string;
  /** 버튼 링크 href */
  buttonHref: string;
  /** 버튼 aria-label */
  buttonAriaLabel: string;
  /** (선택) 버튼 클릭 핸들러 - Client 컴포넌트에서만 사용 */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function BlockedBasePage({
  message,
  buttonLabel,
  buttonHref,
  buttonAriaLabel,
  onClick,
}: BlockedBasePageProps) {
  // 모바일에서 줄바꿈 처리를 위한 메시지 분리
  // "서비스 이용이 제한되었습니다." -> ["서비스 이용이", "제한되었습니다."]
  // "서비스 일시 정지 혹은 탈퇴된 회원입니다." -> ["서비스 일시 정지 혹은 탈퇴된", "회원입니다."]
  const messageParts = message.split(" ");
  const firstPart = messageParts.slice(0, -1).join(" ");
  const lastPart = messageParts[messageParts.length - 1];

  return (
    <div className={styles.blocked_user_page_container}>
      <main className={styles.blocked_user_main}>
        <section className={styles.content_section}>
          <div className={styles.logo_container}>
            <h1 className={styles.logo_text}>VX.</h1>
          </div>
          <p className={styles.message_text}>
            <span className={styles.message_line1}>{firstPart}</span>
            <br className={styles.mobile_br} />
            <span className={styles.message_line2}>{lastPart}</span>
          </p>
          <a
            href={buttonHref}
            className={styles.withdrawal_button}
            aria-label={buttonAriaLabel}
            onClick={onClick}
          >
            {buttonLabel}
          </a>
        </section>
      </main>
    </div>
  );
}
