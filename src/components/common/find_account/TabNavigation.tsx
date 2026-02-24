/**
 * 탭 네비게이션 컴포넌트
 *
 * 아이디 찾기 / 비밀번호 찾기 탭을 표시합니다.
 *
 * 사용 페이지:
 * - src/components/common/FindAccountPage.tsx
 */

"use client";

import styles from "@/styles/common/find_account/find_account.module.css";

interface TabNavigationProps {
  /** 현재 활성화된 탭 */
  activeTab: "id" | "password";
  /** 탭 변경 핸들러 */
  onTabChange: (tab: "id" | "password") => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const handleTabClick = (tab: "id" | "password", e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onTabChange(tab);
  };

  return (
    <section className={styles.tab_section}>
      <button
        type="button"
        className={`${styles.tab_button} ${activeTab === "id" ? styles.tab_button_active : ""}`}
        onClick={(e) => handleTabClick("id", e)}
        aria-label="아이디 찾기"
        aria-selected={activeTab === "id"}
      >
        아이디 찾기
      </button>
      <button
        type="button"
        className={`${styles.tab_button} ${
          activeTab === "password" ? styles.tab_button_active : ""
        }`}
        onClick={(e) => handleTabClick("password", e)}
        aria-label="비밀번호 찾기"
        aria-selected={activeTab === "password"}
      >
        비밀번호 찾기
      </button>
    </section>
  );
}
