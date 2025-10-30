/* ========================================
   🧩 페이지 상단 제목 공용 컴포넌트
   ======================================== */

"use client";

import React from "react";
import app_styles from "@/styles/partner/campaign_application/campaign_application.module.css";

interface PageHeaderProps {
  title: string;
  right?: React.ReactNode; // 필요 시 우측 액션 추가 가능
}

export default function PageHeader({ title, right }: PageHeaderProps) {
  return (
    <div className={app_styles.page_header}>
      <h1 className={app_styles.page_title}>{title}</h1>
      {right}
    </div>
  );
}
