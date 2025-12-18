/* ========================================
   📄 관리자 페이지 제목 컴포넌트
   ======================================== */

/**
 * ManagerPageTitle 컴포넌트
 *
 * 목적: 관리자 페이지(GA/SA)에서 사용하는 페이지 제목을 표시하는 재사용 가능한 컴포넌트입니다.
 *
 * 사용 위치:
 * - 모든 GA/SA 관리자 페이지의 상단에 페이지 제목을 표시할 때 사용
 *
 * 주요 기능:
 * - 페이지 제목 텍스트를 props로 받아서 표시
 * - 일관된 스타일 적용
 * - 접근성을 위한 시맨틱 HTML (h1 태그 사용)
 */

"use client";

import styles from "@/styles/common/manager_page_title.module.css";

interface ManagerPageTitleProps {
  /** 페이지 제목 텍스트 */
  title: string;
  /** 하단 여백 제거 여부 (기본값: false) - 대시보드처럼 page_header에 padding이 있는 경우 사용 */
  no_padding?: boolean;
}

export default function ManagerPageTitle({
  title,
  no_padding = false,
}: ManagerPageTitleProps) {
  return (
    <h1
      className={no_padding ? styles.page_title_no_padding : styles.page_title}
    >
      {title}
    </h1>
  );
}

