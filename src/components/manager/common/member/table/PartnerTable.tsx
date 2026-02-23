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

import {
  useState,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import EllipsisTooltip from "@/components/manager/common/table/EllipsisTooltip";
import type { TableColumn } from "@/components/manager/common/table/CommonTable";
import tooltip_container_styles from "@/styles/manager/common/table/table_tooltip.module.css";
import {
  partner_list,
  get_partner_list,
  update_partner_status_type,
  type PartnerItem,
  type PartnerDivision,
  type PartnerStatus,
} from "@/data/manager_ga/member/partners";
import type { Channel } from "@/data/manager/common/filterOptions";
import type { PartnerType } from "@/components/manager/common/member/partners/filter/TypeFilterModal";
import MemberStatusTag from "@/components/manager/common/tags/MemberStatusTag";
import BusinessTypeTag from "@/components/manager/common/tags/BusinessTypeTag";
import type { BusinessType } from "@/components/manager/common/tags/BusinessTypeTag";
import ManagerRestrictionModal from "@/components/manager/common/campaign/modal/ManagerRestrictionModal";
import BaseModal from "@/components/common/modal/BaseModal";
import {
  add_blacklist_item,
  get_blacklist_data,
  type BlacklistItem,
  type BlockReason,
  block_code_reason_map,
} from "@/data/manager_ga/member/blacklist";
import type { BlockCode } from "@/data/manager_ga/common/filterOptions";

interface PartnerTableProps {
  // 검색어 상태를 props로 받습니다
  search_query: string;
  // 필터 상태
  selected_channels?: Channel[];
  selected_divisions?: PartnerDivision[];
  selected_types?: PartnerType[];
  selected_statuses?: PartnerStatus[];
  // CSS 모듈 스타일 객체
  styles: Record<string, string> & {
    table_container: string;
    table_grid_wrapper: string;
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

// 테이블에서 외부로 노출할 함수들의 타입 정의
export interface PartnerTableRef {
  open_restriction_modal: () => void;
}

const PartnerTable = forwardRef<PartnerTableRef, PartnerTableProps>(
  function PartnerTable(
    {
      search_query,
      selected_channels = [],
      selected_divisions = [],
      selected_types = [],
      selected_statuses = [],
      styles: cssStyles,
      detail_path,
    },
    ref
  ) {
    // Next.js의 useRouter 훅을 사용하여 페이지 이동 기능 가져오기
    // useRouter: Next.js에서 제공하는 클라이언트 사이드 라우팅 훅입니다
    const router = useRouter();

    // 선택된 파트너 ID 목록 상태 관리
    const [selected_partner_ids, set_selected_partner_ids] = useState<string[]>(
      []
    );

    // 전체 선택/해제 상태 관리
    const [is_all_selected, set_is_all_selected] = useState(false);

    // 이용 제한 모달 상태 관리
    const [restriction_modal_open, set_restriction_modal_open] =
      useState(false);

    // 경고 모달 상태 관리 (이용 제한은 한 명만 가능하다는 메시지)
    const [warning_modal_open, set_warning_modal_open] = useState(false);

    // 이미 처리된 요청 모달 상태 관리
    const [already_processed_modal_state, set_already_processed_modal_state] =
      useState(false);

    // 클라이언트 마운트 상태 관리 (SSR Hydration 오류 방지)
    const [is_mounted, set_is_mounted] = useState(false);

    // 컴포넌트 마운트 후 클라이언트 사이드임을 표시
    useEffect(() => {
      set_is_mounted(true);
    }, []);

    // 외부에서 모달을 열 수 있도록 함수 노출
    // useImperativeHandle: 부모 컴포넌트에서 자식 컴포넌트의 함수를 호출할 수 있게 해주는 Hook입니다
    // useCallback을 사용하여 selected_partner_ids가 변경될 때마다 함수를 재생성합니다
    const open_restriction_modal = useCallback(() => {
      // 이용 제한은 한 번에 한 명만 가능합니다
      if (selected_partner_ids.length === 0) {
        return;
      }
      if (selected_partner_ids.length > 1) {
        // 여러 명이 선택된 경우 경고 모달 표시
        set_warning_modal_open(true);
        return;
      }
      // 한 명만 선택된 경우에만 이용 제한 모달 열기
      set_restriction_modal_open(true);
    }, [selected_partner_ids]);

    useImperativeHandle(
      ref,
      () => ({
        open_restriction_modal,
      }),
      [open_restriction_modal] // 의존성 배열: open_restriction_modal이 변경될 때마다 ref를 업데이트합니다
    );

    // 검색어 및 필터로 필터링된 파트너 목록
    // SSR Hydration 오류 방지를 위해 클라이언트에서만 localStorage 데이터를 반영합니다
    const filtered_partners = useMemo(() => {
      // 서버 사이드에서는 기본 데이터만 사용
      const partners_to_filter = is_mounted ? get_partner_list() : partner_list;

      return partners_to_filter.filter((partner) => {
        // 검색어 필터
        if (search_query) {
          const matches_search = partner.business_name
            .toLowerCase()
            .includes(search_query.toLowerCase());
          if (!matches_search) return false;
        }

        // 채널 필터 (현재 파트너 데이터에 채널 정보가 없으므로 일단 통과)
        // TODO: 파트너 데이터에 채널 정보 추가 시 필터링 로직 구현

        // 구분 필터
        if (selected_divisions.length > 0) {
          if (!selected_divisions.includes(partner.division)) return false;
        }

        // 유형 필터 (status_type 필드 사용)
        if (selected_types.length > 0) {
          if (!selected_types.includes(partner.status_type)) return false;
        }

        // 상태 필터
        if (selected_statuses.length > 0) {
          if (!selected_statuses.includes(partner.status)) return false;
        }

        return true;
      });
    }, [
      is_mounted,
      search_query,
      selected_divisions,
      selected_types,
      selected_statuses,
    ]);

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
      initial_direction: "desc", // 번호 최신순
      column_config,
    });

    // 개별 체크박스 토글 핸들러
    // 체크박스는 여러 개 선택할 수 있습니다
    const handle_checkbox_toggle = (partner_id: string) => {
      set_selected_partner_ids((prev) => {
        if (prev.includes(partner_id)) {
          // 이미 선택된 경우 제거
          const new_selected = prev.filter((id) => id !== partner_id);
          // 전체 선택 상태 업데이트
          set_is_all_selected(
            new_selected.length === filtered_partners.length &&
              filtered_partners.length > 0
          );
          return new_selected;
        } else {
          // 선택되지 않은 경우 추가
          const new_selected = [...prev, partner_id];
          // 전체 선택 상태 업데이트
          set_is_all_selected(
            new_selected.length === filtered_partners.length &&
              filtered_partners.length > 0
          );
          return new_selected;
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

    // 이용 제한 버튼 클릭 핸들러
    // 체크박스로 선택된 파트너가 정확히 1명일 때만 모달을 엽니다
    const handle_restriction_button_click = () => {
      if (selected_partner_ids.length === 0) {
        return;
      }
      if (selected_partner_ids.length > 1) {
        // 여러 명이 선택된 경우 경고 모달 표시
        set_warning_modal_open(true);
        return;
      }
      // 한 명만 선택된 경우에만 모달 열기
      set_restriction_modal_open(true);
    };

    // 이용 제한 모달 닫기 핸들러
    const handle_restriction_modal_close = () => {
      set_restriction_modal_open(false);
    };

    // 이용 제한 확인 핸들러
    // 모달에서 사유를 선택하고 "확인" 버튼을 클릭했을 때 실행됩니다
    const handle_restriction_confirm = (restriction_reason: string) => {
      // 선택된 파트너가 정확히 1명인지 확인
      if (selected_partner_ids.length !== 1) {
        return;
      }

      // 선택된 파트너 정보 가져오기
      const selected_partner_id = selected_partner_ids[0];
      const selected_partner = filtered_partners.find(
        (p) => p.id === selected_partner_id
      );

      if (!selected_partner) {
        return;
      }

      // 이미 이용 제한된 계정인지 확인
      const existing_blacklist = get_blacklist_data();
      const is_already_blocked = existing_blacklist.some(
        (item) => item.name === selected_partner.business_name
      );

      // 이미 이용 제한된 경우 예외 처리
      if (is_already_blocked) {
        // 이용 제한 모달 닫기
        set_restriction_modal_open(false);
        // 이미 처리된 요청 모달 표시
        set_already_processed_modal_state(true);
        return;
      }

      // 차단 사유를 BlockReason 타입으로 변환
      const block_reason_map: Record<string, BlockReason> = {
        "반복 반려 누적": "반복 반려 누적",
        "반복 취소 누적": "반복 반려 누적",
        "무단 이탈 · 노쇼 누적": "무단 이탈 · 노쇼 누적",
        "공정위 위반 게시 요청 누적": "공정위 위반 게시 요청",
        "부적절 캠페인 게시": "부적절 캠페인 게시",
        "콘텐츠 도용 · 중복": "콘텐츠 중복 · 도용",
        "비정상 요청 · 접근": "비정상 운영 행위",
        "외부 결제 · 금전 요구": "외부 결제 · 금전 요구",
        "비매너 행위": "커뮤니티 가이드 위반",
      };

      const mapped_block_reason: BlockReason =
        block_reason_map[restriction_reason] || "커뮤니티 가이드 위반";

      // 차단 코드 찾기
      const block_code =
        (Object.keys(block_code_reason_map) as BlockCode[]).find(
          (code) => block_code_reason_map[code] === mapped_block_reason
        ) || "B004";

      // 새로운 블랙리스트 항목 ID 생성
      const existing_data = get_blacklist_data();
      const max_id = Math.max(
        ...existing_data.map((item) => parseInt(item.id) || 0)
      );
      const new_id = (max_id + 1).toString();

      // 현재 날짜/시간 생성
      const current_date = format(new Date(), "yyyy-MM-dd HH:mm");

      // 블랙리스트 항목 생성
      const new_blacklist_item: BlacklistItem = {
        id: new_id,
        name: selected_partner.business_name,
        user_id: selected_partner.id,
        division: "파트너",
        current_points: selected_partner.current_points,
        ip_address: "0.0.0.0",
        block_code: block_code as BlockCode,
        block_reason: mapped_block_reason,
        registered_date: current_date,
        registered_by: "관리자",
      };

      // 블랙리스트에 추가
      add_blacklist_item(new_blacklist_item);

      // 파트너의 status_type을 "이용 제한 회원"으로 업데이트
      update_partner_status_type(selected_partner_id, "이용 제한 회원");

      // 이용 제한 처리 후 선택 해제
      set_selected_partner_ids([]);
      set_is_all_selected(false);
      set_restriction_modal_open(false);

      // 페이지 이동 없이 현재 페이지에 머무릅니다
    };

    // 테이블 컬럼 정의
    const columns: TableColumn[] = [
      {
        key: "number",
        label: "번호",
        sortable: true,
        className: cssStyles.table_cell_number,
      },
      {
        key: "business_name",
        label: "상호명",
        sortable: true,
        className: cssStyles.table_cell_business_name,
      },
      {
        key: "division",
        label: "구분",
        className: cssStyles.table_cell_division,
      },
      {
        key: "last_access_date",
        label: "접속일",
        sortable: true,
        className: cssStyles.table_cell_last_access,
      },
      {
        key: "join_date",
        label: "가입일",
        sortable: true,
        className: cssStyles.table_cell_join_date,
      },
      {
        key: "campaign_in_progress",
        label: "캠페인 진행",
        sortable: true,
        className: cssStyles.table_cell_campaign_in_progress,
      },
      {
        key: "campaign_completed",
        label: "캠페인 완료",
        sortable: true,
        className: cssStyles.table_cell_campaign_completed,
      },
      {
        key: "current_points",
        label: "보유 포인트",
        sortable: true,
        className: cssStyles.table_cell_current_points,
      },
      {
        key: "used_points",
        label: "사용 포인트",
        sortable: true,
        className: cssStyles.table_cell_used_points,
      },
      {
        key: "status_type",
        label: "유형",
        className: cssStyles.table_cell_status_type,
      },
      {
        key: "status",
        label: "상태",
        className: cssStyles.table_cell_status,
      },
    ];

    // 커스텀 헤더 렌더링 (SortableTableHeader 공통 컴포넌트 사용)
    const render_custom_header = () => {
      return (
        <SortableTableHeader
          columns={columns}
          sort_state={sort_state}
          handle_sort={handle_sort}
          handle_select_all={handle_select_all}
          is_all_selected={is_all_selected}
          styles={cssStyles}
          use_header_row={false}
        />
      );
    };

    return (
      <div className={`${cssStyles.table_container} ${tooltip_container_styles.tooltip_container_visible}`}>
        <div className={cssStyles.table_grid_wrapper}>
          {/* 테이블 헤더 */}
          {render_custom_header()}
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
                    <EllipsisTooltip content={partner.number}>
                      <span>{partner.number}</span>
                    </EllipsisTooltip>
                  </div>

                  {/* 상호명 */}
                  <div className={cssStyles.table_cell_business_name}>
                    <div className={cssStyles.business_name_wrapper}>
                      <div className={cssStyles.business_name_row}>
                        <EllipsisTooltip content={partner.business_name}>
                          <span className={cssStyles.business_name_text}>
                            {partner.business_name}
                          </span>
                        </EllipsisTooltip>
                        <button
                          className={cssStyles.download_info_button}
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: 사업자 정보 다운로드 기능 구현
                          }}
                          aria-label={`${partner.business_name} 사업자 정보 다운로드`}
                        >
                          <img
                            // 구분(division)에 따라 다른 아이콘 표시
                            // 삼항 연산자: 조건 ? 참일 때 값 : 거짓일 때 값
                            // partner.division이 "법인"이면 table_download.svg, "개인"이면 table_download_grey.svg 사용
                            src={
                              partner.division === "법인"
                                ? "/images/management_page/table/table_download.svg"
                                : "/images/management_page/table/table_download_grey.svg"
                            }
                            alt="다운로드"
                            className={cssStyles.download_info_icon}
                          />
                        </button>
                      </div>
                      <EllipsisTooltip
                        content={`${partner.business_number} · ${partner.representative_name}`}
                      >
                        <span className={cssStyles.business_info_text}>
                          {partner.business_number} ·{" "}
                          {partner.representative_name}
                        </span>
                      </EllipsisTooltip>
                    </div>
                  </div>

                  {/* 구분 (법인/개인) */}
                  <div className={cssStyles.table_cell_division}>
                    <BusinessTypeTag type={partner.division as BusinessType} />
                  </div>

                  {/* 접속일 */}
                  <div className={cssStyles.table_cell_last_access}>
                    <EllipsisTooltip content={partner.last_access_date}>
                      <span>{partner.last_access_date}</span>
                    </EllipsisTooltip>
                  </div>

                  {/* 가입일 */}
                  <div className={cssStyles.table_cell_join_date}>
                    <EllipsisTooltip content={partner.join_date}>
                      <span>{partner.join_date}</span>
                    </EllipsisTooltip>
                  </div>

                  {/* 캠페인 진행 */}
                  <div className={cssStyles.table_cell_campaign_in_progress}>
                    <EllipsisTooltip content={`${format_number(partner.campaign_in_progress)}회`}>
                      <span>{format_number(partner.campaign_in_progress)}회</span>
                    </EllipsisTooltip>
                  </div>

                  {/* 캠페인 완료 */}
                  <div className={cssStyles.table_cell_campaign_completed}>
                    <EllipsisTooltip content={`${format_number(partner.campaign_completed)}회`}>
                      <span>{format_number(partner.campaign_completed)}회</span>
                    </EllipsisTooltip>
                  </div>

                  {/* 보유 포인트 */}
                  <div className={cssStyles.table_cell_current_points}>
                    <EllipsisTooltip content={format_number(partner.current_points)}>
                      <span>{format_number(partner.current_points)}</span>
                    </EllipsisTooltip>
                  </div>

                  {/* 사용 포인트 */}
                  <div className={cssStyles.table_cell_used_points}>
                    <EllipsisTooltip content={format_number(partner.used_points)}>
                      <span>{format_number(partner.used_points)}</span>
                    </EllipsisTooltip>
                  </div>

                  {/* 유형 (상태 유형) */}
                  <div className={cssStyles.table_cell_status_type}>
                    <EllipsisTooltip content={partner.status_type}>
                      <span>{partner.status_type}</span>
                    </EllipsisTooltip>
                  </div>

                  {/* 상태 */}
                  <div className={cssStyles.table_cell_status}>
                    <MemberStatusTag
                      status={
                        partner.status as "정상" | "일시 정지" | "영구 정지"
                      }
                    />
                  </div>
                </div>
              );
            })
          )}
          </div>
        </div>
        {/* 이용 제한 사유 모달 */}
        <ManagerRestrictionModal
          is_open={restriction_modal_open}
          on_close={handle_restriction_modal_close}
          on_block={handle_restriction_confirm}
        />
        {/* 경고 모달: 이용 제한은 한 번에 한 명만 가능합니다 */}
        <BaseModal
          is_open={warning_modal_open}
          on_close={() => set_warning_modal_open(false)}
          message="이용 제한은 한 번에 한 명만 가능합니다."
          buttons={["확인"]}
        />
        {/* 이미 처리된 요청 모달 */}
        <BaseModal
          is_open={already_processed_modal_state}
          on_close={() => set_already_processed_modal_state(false)}
          message="이미 처리된 요청입니다."
          buttons={["닫기"]}
        />
      </div>
    );
  }
);

export default PartnerTable;
