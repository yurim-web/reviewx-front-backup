/* ========================================
   👥 GA 관리자 파트너 목록 페이지
   ======================================== */

/**
 * GA 관리자 파트너 목록 페이지
 *
 * 목적: GA 관리자가 파트너 목록을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/member/partners
 *
 * 주요 기능:
 * - 파트너 통계 섹션 (전체 가입자 수, 간단 활동 회원, 간단 정규 가입자 수, 면제 회원)
 * - 필터 섹션 (채널, 구분, 유형, 상태, 검색어, 정렬, 차단, 다운로드)
 * - 파트너 목록 테이블 (번호, 상호명, 사업자등록번호·대표자, 구분, 가입일, 캠페인 진행, 캠페인 완료, 보유 포인트, 사용 포인트, 유형, 상태)
 *
 * 컴포넌트 구조:
 * - PartnerStatsSection: 파트너 통계 섹션
 * - PartnerFilterSection: 필터 섹션
 * - PartnerTable: 파트너 목록 테이블
 *
 *
 * @returns 파트너 목록 페이지 JSX
 */

"use client";

import { useState } from "react";
import styles from "@/styles/manager_ga/member/partners/page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import PartnerStatsSection from "@/components/manager/common/member/partners/PartnerStatsSection";
import PartnerFilterSection from "@/components/manager/common/member/partners/PartnerFilterSection";
import PartnerTable from "@/components/manager/common/member/partners/PartnerTable";

export default function PartnersPage() {
  // 검색어 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [search_query, set_search_query] = useState<string>("");

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="파트너 목록" />

        {/* 파트너 통계 섹션 */}
        <PartnerStatsSection />

        {/* 필터 섹션 */}
        <PartnerFilterSection
          search_query={search_query}
          on_search_change={set_search_query}
        />

        {/* 파트너 목록 테이블 */}
        <PartnerTable 
          search_query={search_query} 
          detail_path="/manager_ga/member/partners"
        />
      </div>
    </div>
  );
}
