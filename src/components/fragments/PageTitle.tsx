/* ========================================
   📄 페이지 제목 컴포넌트 (공통)
   ======================================== */

/**
 * 페이지 제목 컴포넌트
 * SubHeader 아래에 표시되는 페이지 제목을 일관되게 표시하기 위한 공통 컴포넌트
 *
 * 사용 페이지:
 * - /find-account/reset-password (새 비밀번호 설정)
 * - /user/mypage/edit (내 정보 수정)
 * - /partner/mypage/edit (내 정보 수정)
 * - /faq (자주 묻는 질문)
 * - /notice (공지사항)
 * - /user/point/withdrawal_request (포인트 출금 신청)
 * - /partner/point/charge (포인트 충전)
 */

"use client";

import styles from "@/styles/common/page_title.module.css";

interface PageTitleProps {
  title: string;
  className?: string;
}

export default function PageTitle({ title, className }: PageTitleProps) {
  const combinedClassName = className
    ? `${styles.page_title} ${className}`.trim()
    : styles.page_title;

  return <h1 className={combinedClassName}>{title}</h1>;
}
