/* ========================================
   🧩 페이지 상단 제목 공용 컴포넌트
   ======================================== */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import app_styles from "@/styles/partner/campaign_application/campaign_application.module.css";

interface PageHeaderProps {
  title: string;
  right?: React.ReactNode; // 필요 시 우측 액션 추가 가능
}

export default function PageHeader({ title, right }: PageHeaderProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={app_styles.page_header}>
      {/* 모바일에서만 뒤로가기 버튼 표시 */}
      <button
        className={app_styles.mobile_back_button}
        onClick={handleGoBack}
        aria-label="뒤로가기"
      >
        <img
          src="/images/header/header_arrow_back.svg"
          alt="뒤로가기"
          width={16}
          height={16}
        />
      </button>
      <h1 className={app_styles.page_title}>{title}</h1>
      {right}
    </div>
  );
}
