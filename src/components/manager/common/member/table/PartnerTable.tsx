/* ========================================
   📋 파트너 목록 테이블 컴포넌트 (공통)
   ======================================== */

/**
 * 파트너 목록 테이블 컴포넌트 (공통)
 *
 * 목적: 파트너 목록 페이지의 파트너 목록을 테이블 형태로 표시합니다.
 *
 * 📍 사용 위치:
 * - /manager_ga/member/partners (GA 관리자 파트너 목록 페이지)
 * - /manager_sa/member/partners (SA 관리자 파트너 목록 페이지)
 *
 * 주요 기능:
 * - 파트너 목록을 테이블로 표시합니다
 * - 검색어 필터를 적용합니다
 * - 체크박스로 파트너를 선택할 수 있습니다
 * - 사업자등록번호·대표자명을 표시합니다
 * - 파트너 구분 태그를 표시합니다 (법인/개인)
 * - 파트너 상태를 표시합니다
 *
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTableSort } from "@/hooks/table/useTableSort";
import {
  get_sort_arrow_transform,
  get_sort_arrow_alt,
  type SortColumnConfig,
} from "@/utils/table/sort";
import {
  partner_list,
  type PartnerItem,
  type PartnerDivision,
  type PartnerStatus,
} from "@/data/manager_ga/member/partners";
import MemberStatusTag from "@/components/manager/common/tags/MemberStatusTag";
import BusinessTypeTag from "@/components/manager/common/tags/BusinessTypeTag";
import type { BusinessType } from "@/components/manager/common/tags/BusinessTypeTag";

interface PartnerTableProps {
  // 검색어 상태를 props로 받습니다
  search_query: string;
  // CSS 모듈 스타일 객체
  styles: Record<string, string> & {
    table_container: string;
    table_header: string;
    table_body: string;
    table_row: string;
    table_cell_checkbox: string;
    table_cell_number: string;
    table_cell_business_name: string;
    table_cell_division: string;
    table_cell_last_access: string;
    table_cell_join_date: string;
    table_cell_campaign_in_progress: string;
    table_cell_campaign_completed: string;
    table_cell_current_points: string;
    table_cell_used_points: string;
    table_cell_status_type: string;
    table_cell_status: string;
    checkbox: string;
    sort_icon: string;
    business_name_wrapper: string;
    business_name_row: string;
    business_name_text: string;
    business_info_text: string;
    download_info_button: string;
    download_info_icon: string;
    division_tag: string;
    division_tag_corporate: string;
    division_tag_individual: string;
    status_tag: string;
    status_tag_normal: string;
    status_tag_suspended: string;
    status_tag_permanent: string;
    empty_message: string;
  };
  // 상세 페이지 경로 (예: '/manager_ga/member/partners' 또는 '/manager_sa/member/partners')
  detail_path: string;
}

export default function PartnerTable({
  search_query,
  styles: cssStyles,
  detail_path,
}: PartnerTableProps) {
  // Next.js의 useRouter 훅을 사용하여 페이지 이동 기능 가져오기
  // useRouter: Next.js에서 제공하는 클라이언트 사이드 라우팅 훅입니다
  const router = useRouter();

  // 선택된 파트너 ID 목록 상태 관리
  const [selected_partner_ids, set_selected_partner_ids] = useState<string[]>(
    []
  );

  // 전체 선택/해제 상태 관리
  const [is_all_selected, set_is_all_selected] = useState(false);

  // 검색어로 필터링된 파트너 목록
  const filtered_partners = partner_list.filter((partner) => {
    if (!search_query) return true;
    // 상호명으로 검색
    return partner.business_name
      .toLowerCase()
      .includes(search_query.toLowerCase());
  });

  // 컬럼별 타입 설정
  const column_config: SortColumnConfig = {
    number: "numeric_string",
    business_name: "string",
    last_access_date: "date",
    join_date: "date",
    campaign_in_progress: "number",
    campaign_completed: "number",
    current_points: "number",
    used_points: "number",
    status: "string",
  };

  // 정렬 훅 사용
  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_partners,
  } = useTableSort({
    data: filtered_partners,
    initial_column_key: "number",
    initial_direction: "asc",
    column_config,
  });

  // 개별 체크박스 토글 핸들러
  const handle_checkbox_toggle = (partner_id: string) => {
    set_selected_partner_ids((prev) => {
      if (prev.includes(partner_id)) {
        // 이미 선택된 경우 제거
        return prev.filter((id) => id !== partner_id);
      } else {
        // 선택되지 않은 경우 추가
        return [...prev, partner_id];
      }
    });
  };

  // 전체 선택/해제 핸들러
  const handle_select_all = () => {
    if (is_all_selected) {
      // 전체 해제
      set_selected_partner_ids([]);
      set_is_all_selected(false);
    } else {
      // 전체 선택
      set_selected_partner_ids(filtered_partners.map((p) => p.id));
      set_is_all_selected(true);
    }
  };

  // 숫자를 천 단위로 포맷팅하는 함수
  const format_number = (num: number): string => {
    return num.toLocaleString();
  };

  // 파트너 행 클릭 핸들러
  // 테이블 행을 클릭하면 해당 파트너의 디테일 페이지로 이동합니다
  const handle_row_click = (partner_id: string) => {
    // router.push: Next.js에서 제공하는 페이지 이동 함수입니다
    router.push(`${detail_path}/${partner_id}`);
  };

  return (
    <div className={cssStyles.table_container}>
      {/* 테이블 헤더 */}
      <div className={cssStyles.table_header}>
        <div className={cssStyles.table_cell_checkbox}>
          <input
            type="checkbox"
            checked={is_all_selected}
            onChange={handle_select_all}
            className={cssStyles.checkbox}
          />
        </div>
        <div className={cssStyles.table_cell_number}>
          <span>번호</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handle_sort("number");
            }}
            aria-label="번호 정렬"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <img
              src="/images/icons/table_arrow.svg"
              alt={get_sort_arrow_alt(sort_state, "number")}
              className={cssStyles.sort_icon}
              style={{
                transform: get_sort_arrow_transform(sort_state, "number"),
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>
        <div className={cssStyles.table_cell_business_name}>
          <span>상호명</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handle_sort("business_name");
            }}
            aria-label="상호명 정렬"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <img
              src="/images/icons/table_arrow.svg"
              alt={get_sort_arrow_alt(sort_state, "business_name")}
              className={cssStyles.sort_icon}
              style={{
                transform: get_sort_arrow_transform(
                  sort_state,
                  "business_name"
                ),
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>
        <div className={cssStyles.table_cell_division}>
          <span>구분</span>
        </div>
        <div className={cssStyles.table_cell_last_access}>
          <span>접속일</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handle_sort("last_access_date");
            }}
            aria-label="접속일 정렬"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <img
              src="/images/icons/table_arrow.svg"
              alt={get_sort_arrow_alt(sort_state, "last_access_date")}
              className={cssStyles.sort_icon}
              style={{
                transform: get_sort_arrow_transform(
                  sort_state,
                  "last_access_date"
                ),
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>
        <div className={cssStyles.table_cell_join_date}>
          <span>가입일</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handle_sort("join_date");
            }}
            aria-label="가입일 정렬"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <img
              src="/images/icons/table_arrow.svg"
              alt={get_sort_arrow_alt(sort_state, "join_date")}
              className={cssStyles.sort_icon}
              style={{
                transform: get_sort_arrow_transform(sort_state, "join_date"),
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>
        <div className={cssStyles.table_cell_campaign_in_progress}>
          <span>캠페인 진행</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handle_sort("campaign_in_progress");
            }}
            aria-label="캠페인 진행 정렬"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <img
              src="/images/icons/table_arrow.svg"
              alt={get_sort_arrow_alt(sort_state, "campaign_in_progress")}
              className={cssStyles.sort_icon}
              style={{
                transform: get_sort_arrow_transform(
                  sort_state,
                  "campaign_in_progress"
                ),
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>
        <div className={cssStyles.table_cell_campaign_completed}>
          <span>캠페인 완료</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handle_sort("campaign_completed");
            }}
            aria-label="캠페인 완료 정렬"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <img
              src="/images/icons/table_arrow.svg"
              alt={get_sort_arrow_alt(sort_state, "campaign_completed")}
              className={cssStyles.sort_icon}
              style={{
                transform: get_sort_arrow_transform(
                  sort_state,
                  "campaign_completed"
                ),
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>
        <div className={cssStyles.table_cell_current_points}>
          <span>보유 포인트</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handle_sort("current_points");
            }}
            aria-label="보유 포인트 정렬"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <img
              src="/images/icons/table_arrow.svg"
              alt={get_sort_arrow_alt(sort_state, "current_points")}
              className={cssStyles.sort_icon}
              style={{
                transform: get_sort_arrow_transform(
                  sort_state,
                  "current_points"
                ),
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>
        <div className={cssStyles.table_cell_used_points}>
          <span>사용 포인트</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handle_sort("used_points");
            }}
            aria-label="사용 포인트 정렬"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <img
              src="/images/icons/table_arrow.svg"
              alt={get_sort_arrow_alt(sort_state, "used_points")}
              className={cssStyles.sort_icon}
              style={{
                transform: get_sort_arrow_transform(sort_state, "used_points"),
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>
        <div className={cssStyles.table_cell_status_type}>
          <span>유형</span>
        </div>
        <div className={cssStyles.table_cell_status}>
          <span>상태</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handle_sort("status");
            }}
            aria-label="상태 정렬"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <img
              src="/images/icons/table_arrow.svg"
              alt={get_sort_arrow_alt(sort_state, "status")}
              className={cssStyles.sort_icon}
              style={{
                transform: get_sort_arrow_transform(sort_state, "status"),
                transition: "transform 0.2s",
              }}
            />
          </button>
        </div>
      </div>

      {/* 테이블 바디 */}
      <div className={cssStyles.table_body}>
        {filtered_partners.length === 0 ? (
          <div className={cssStyles.empty_message}>파트너가 없습니다.</div>
        ) : (
          sorted_partners.map((partner) => {
            const is_selected = selected_partner_ids.includes(partner.id);
            return (
              <div
                key={partner.id}
                className={cssStyles.table_row}
                onClick={() => handle_row_click(partner.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  // 키보드 접근성: Enter 키나 Space 키를 누르면 클릭과 동일하게 동작합니다
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handle_row_click(partner.id);
                  }
                }}
                aria-label={`${partner.business_name} 파트너 상세 정보 보기`}
              >
                {/* 체크박스 */}
                <div
                  className={cssStyles.table_cell_checkbox}
                  onClick={(e) => {
                    // 체크박스 클릭 시 행 클릭 이벤트가 발생하지 않도록 이벤트 전파를 막습니다
                    // stopPropagation: 이벤트 버블링을 방지하는 메서드입니다
                    e.stopPropagation();
                  }}
                >
                  <input
                    type="checkbox"
                    checked={is_selected}
                    onChange={() => handle_checkbox_toggle(partner.id)}
                    className={cssStyles.checkbox}
                  />
                </div>

                {/* 번호 */}
                <div className={cssStyles.table_cell_number}>
                  {partner.number}
                </div>

                {/* 상호명 */}
                <div className={cssStyles.table_cell_business_name}>
                  <div className={cssStyles.business_name_wrapper}>
                    <div className={cssStyles.business_name_row}>
                      <span className={cssStyles.business_name_text}>
                        {partner.business_name}
                      </span>
                      <button
                        className={cssStyles.download_info_button}
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: 사업자 정보 다운로드 기능 구현
                        }}
                        aria-label={`${partner.business_name} 사업자 정보 다운로드`}
                      >
                        <img
                          src="/images/icons/table_download.svg"
                          alt="다운로드"
                          className={cssStyles.download_info_icon}
                        />
                      </button>
                    </div>
                    <span className={cssStyles.business_info_text}>
                      {partner.business_number} · {partner.representative_name}
                    </span>
                  </div>
                </div>

                {/* 구분 (법인/개인) */}
                <div className={cssStyles.table_cell_division}>
                  <BusinessTypeTag
                    type={partner.division as BusinessType}
                    styles={cssStyles}
                  />
                </div>

                {/* 접속일 */}
                <div className={cssStyles.table_cell_last_access}>
                  {partner.last_access_date}
                </div>

                {/* 가입일 */}
                <div className={cssStyles.table_cell_join_date}>
                  {partner.join_date}
                </div>

                {/* 캠페인 진행 */}
                <div className={cssStyles.table_cell_campaign_in_progress}>
                  {format_number(partner.campaign_in_progress)}회
                </div>

                {/* 캠페인 완료 */}
                <div className={cssStyles.table_cell_campaign_completed}>
                  {format_number(partner.campaign_completed)}회
                </div>

                {/* 보유 포인트 */}
                <div className={cssStyles.table_cell_current_points}>
                  {format_number(partner.current_points)}
                </div>

                {/* 사용 포인트 */}
                <div className={cssStyles.table_cell_used_points}>
                  {format_number(partner.used_points)}
                </div>

                {/* 유형 (상태 유형) */}
                <div className={cssStyles.table_cell_status_type}>
                  {partner.status_type}
                </div>

                {/* 상태 */}
                <div className={cssStyles.table_cell_status}>
                  <MemberStatusTag
                    status={
                      partner.status as "정상" | "일시 정지" | "영구 정지"
                    }
                    styles={cssStyles}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
