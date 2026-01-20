/* ========================================
   👤 SA 관리자 관리자 목록 페이지
   ======================================== */

/**
 * SA 관리자 관리자 목록 페이지
 *
 * 목적: SA 관리자가 관리자 목록을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_sa/member/admins
 *
 * 주요 기능:
 * - 필터 섹션 (채널, 등급, 유형, 상태, 검색어, 정렬, 등록, 삭제)
 * - 관리자 목록 테이블 (번호, 이름, 신고 횟수, 차단 횟수, 가입일, 상태)
 *
 * 컴포넌트 구조:
 * - AdminFilterSection: 필터 섹션
 * - AdminTable: 관리자 목록 테이블
 *
 *
 * @returns 관리자 목록 페이지 JSX
 */

"use client";

import { useState, useRef } from "react";
import styles from "@/styles/manager_sa/member/admins/page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import AdminFilterSection from "@/components/manager/sa/member/admins/section/AdminFilterSection";
import AdminTable, {
  type AdminTableRef,
} from "@/components/manager/sa/member/admins/section/AdminTable";
import type { AdminStatus } from "@/data/manager_sa/member/admins";

export default function AdminsPage() {
  // 검색어 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [search_query, set_search_query] = useState<string>("");

  // 필터 상태 관리
  const [selected_statuses, set_selected_statuses] = useState<
    AdminStatus[]
  >([]);

  // AdminTable의 ref 생성
  // useRef: React Hook으로 DOM 요소나 컴포넌트 인스턴스에 접근할 수 있게 해줍니다
  // <AdminTableRef>: ref가 가리킬 컴포넌트의 타입을 지정합니다
  const admin_table_ref = useRef<AdminTableRef>(null);

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="관리자 목록" />

        {/* 필터 섹션 */}
        <AdminFilterSection
          search_query={search_query}
          on_search_change={set_search_query}
          selected_statuses={selected_statuses}
          on_statuses_change={set_selected_statuses}
          admin_table_ref={admin_table_ref}
        />

        {/* 관리자 목록 테이블 */}
        <AdminTable
          ref={admin_table_ref}
          search_query={search_query}
          selected_statuses={selected_statuses}
        />
      </div>
    </div>
  );
}
