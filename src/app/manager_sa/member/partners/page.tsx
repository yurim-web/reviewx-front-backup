/* ========================================
   SA 관리자 파트너 목록 페이지
   ======================================== */

/**
 * PartnersPage
 *
 * 목적: SA 관리자가 파트너 목록을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/partners
 */

"use client";

import { useState, useRef } from "react";
import styles from "@/styles/manager/common/manager_common_page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import PartnerStatsSection from "@/components/manager/common/member/partners/PartnerStatsSection";
import PartnerFilterSection from "@/components/manager/common/member/partners/PartnerFilterSection";
import PartnerTable from "@/components/manager/common/member/partners/PartnerTable";
import type { Channel } from "@/data/manager/common/filterOptions";
import type { PartnerDivision, PartnerStatus } from "@/data/manager_ga/common/filterOptions";
import type { PartnerType } from "@/components/manager/common/member/partners/filter/TypeFilterModal";

export default function PartnersPage() {
  // 검색어 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [search_query, set_search_query] = useState<string>("");

  // 필터 상태 관리
  // 각 필터의 선택된 값들을 배열로 관리합니다
  const [selected_channels, set_selected_channels] = useState<Channel[]>([]);
  const [selected_divisions, set_selected_divisions] = useState<PartnerDivision[]>([]);
  const [selected_types, set_selected_types] = useState<PartnerType[]>([]);
  const [selected_statuses, set_selected_statuses] = useState<PartnerStatus[]>([]);

  // 테이블 참조 (모달 열기 함수 호출용)
  // useRef: React Hook으로 DOM 요소나 컴포넌트 인스턴스에 접근할 수 있게 해줍니다
  // <{ open_restriction_modal: () => void }>: ref가 가리킬 컴포넌트의 타입을 지정합니다
  const table_ref = useRef<{ open_restriction_modal: () => void }>(null);

  // 이용 제한 버튼 클릭 핸들러
  // 필터 섹션의 "이용 제한" 버튼 클릭 시 테이블의 모달을 엽니다
  const handle_restriction_click = () => {
    // ?. (옵셔널 체이닝): ref.current가 null이 아닐 때만 함수를 호출합니다
    table_ref.current?.open_restriction_modal();
  };

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
          selected_channels={selected_channels}
          on_channels_change={set_selected_channels}
          selected_divisions={selected_divisions}
          on_divisions_change={set_selected_divisions}
          selected_types={selected_types}
          on_types_change={set_selected_types}
          selected_statuses={selected_statuses}
          on_statuses_change={set_selected_statuses}
          on_restriction_click={handle_restriction_click}
        />

        {/* 파트너 목록 테이블 */}
        <PartnerTable
          ref={table_ref}
          search_query={search_query}
          selected_channels={selected_channels}
          selected_divisions={selected_divisions}
          selected_types={selected_types}
          selected_statuses={selected_statuses}
          detail_path="/manager_sa/member/partners"
        />
      </div>
    </div>
  );
}
