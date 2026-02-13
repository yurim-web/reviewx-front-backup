/* ========================================
   관리자(manager) 공통 레이아웃
   ======================================== */

/**
 * /manager/* 경로 공통 레이아웃
 *
 * 목적:
 * - URL 직접 접근 시에도 첫 페인트부터 max-width 1000px가 적용되도록
 *   서버에서 감싸는 컨테이너를 제공합니다.
 * - 새로고침과 동일한 레이아웃이 보이도록 합니다.
 */

import React from "react";
import styles from "@/styles/login/login/login_page.module.css";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.partner_login_page_container}>{children}</div>
  );
}
