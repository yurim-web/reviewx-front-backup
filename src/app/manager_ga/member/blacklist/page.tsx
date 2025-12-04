/* ========================================
   🚫 GA 관리자 차단 이력 페이지
   ======================================== */

/**
 * GA 관리자 차단 이력 페이지
 *
 * 목적: GA 관리자가 차단된 회원 목록을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/member/blacklist
 *
 * 주요 기능:
 * - 필터 섹션 (선택 기간 조회, 구분, 차단 코드, 검색어, 정렬, 삭제)
 * - 차단 이력 테이블 (체크박스, 이름/상호명, 구분, 보유 포인트, 등급, 차단 코드, 차단 사유, 등록일, 등록자)
 *
 * 컴포넌트 구조:
 * - BlacklistFilterSection: 필터 섹션
 * - BlacklistTable: 차단 이력 테이블
 *
 * @returns 차단 이력 페이지 JSX
 */

"use client";

import { useState } from "react";
import styles from "@/styles/manager_ga/member/blacklist/page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import BlacklistFilterSection from "@/components/manager/common/member/blacklist/BlacklistFilterSection";
import BlacklistTable from "@/components/manager/common/member/blacklist/BlacklistTable";

export default function BlacklistPage() {
  // 검색어 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [search_query, set_search_query] = useState<string>("");

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="차단 내역" />

        {/* 필터 섹션 */}
        <BlacklistFilterSection
          search_query={search_query}
          on_search_change={set_search_query}
        />

        {/* 차단 이력 테이블 */}
        <BlacklistTable search_query={search_query} />
      </div>
    </div>
  );
}
