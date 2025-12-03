/* ========================================
   📦 섹션 래퍼 컴포넌트
   ======================================== */

/**
 * 섹션 래퍼 컴포넌트
 *
 * 목적: 디테일 페이지에서 섹션을 일관되게 표시하기 위한 래퍼 컴포넌트입니다.
 *
 * 사용 위치:
 * - 리뷰어 디테일 페이지
 * - 파트너 디테일 페이지
 *
 * 주요 기능:
 * - 섹션 제목과 내용을 표시합니다
 * - 일관된 스타일을 제공합니다
 *
 */

'use client';

import styles from '@/styles/manager_ga/member/member_detail/section.module.css';

interface SectionProps {
  // 섹션 제목
  title: string;
  // 섹션 내용 (children을 통해 전달)
  children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <div className={styles.member_detail_section}>
      {/* 섹션 제목 */}
      <h2 className={styles.member_detail_section_title}>{title}</h2>
      {/* 섹션 내용: children prop을 통해 전달된 내용을 렌더링합니다 */}
      {children}
    </div>
  );
}
