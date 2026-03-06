/* ========================================
   📄 페이지 제목 컴포넌트 (공통)
   ======================================== */

/**
 * 페이지 제목 컴포넌트
 * SubHeader 아래에 표시되는 페이지 제목을 일관되게 표시하기 위한 공통 컴포넌트
 *
 * 사용 페이지:
 * - /reset-password (새 비밀번호 설정)
 * - /user/mypage/edit (내 정보 수정)
 * - /partner/mypage/edit (내 정보 수정)
 * - /faq (자주 묻는 질문)
 * - /notice (공지사항)
 * - /user/point/withdrawal_request (포인트 출금 신청)
 * - /partner/point/charge (포인트 충전)
 */

"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/common/page_title.module.css";

interface PageTitleProps {
  title: string;
  className?: string;
  /** 오른쪽에 표시할 추가 콘텐츠 (예: 전체 삭제 버튼) */
  right_content?: ReactNode;
}

export default function PageTitle({ title, className, right_content }: PageTitleProps) {
  const router = useRouter();
  const combinedClassName = className
    ? `${styles.page_title} ${className}`.trim()
    : styles.page_title;

  return (
    <div className={styles.page_title_wrapper}>
      <button
        type="button"
        className={styles.mobile_back_button}
        onClick={() => router.back()}
        aria-label="뒤로가기"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/header/mobile/mo_back_btn.svg" alt="뒤로가기" />
      </button>
      <h1 className={combinedClassName}>{title}</h1>
      {right_content && <div className={styles.page_title_right}>{right_content}</div>}
    </div>
  );
}
