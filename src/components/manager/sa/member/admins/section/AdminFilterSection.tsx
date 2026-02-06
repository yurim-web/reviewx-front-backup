/* ========================================
   🔍 관리자 필터 섹션 컴포넌트
   ======================================== */

/**
 * 관리자 필터 섹션 컴포넌트
 *
 * 목적: 관리자 목록을 필터링하기 위한 필터 버튼들을 표시하는 섹션입니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/admins (관리자 목록 페이지)
 *
 * 주요 기능:
 * - 채널 필터
 * - 등급 필터
 * - 유형 필터
 * - 상태 필터
 * - 검색어 필터
 * - 정렬 필터 (최신순)
 * - 등록 버튼
 * - 삭제 버튼
 *
 */

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import StatusFilterDropdown from "../filter/StatusFilterDropdown";
import type { AdminStatus } from "@/data/manager_sa/member/admins";
import FilterButton from "@/components/manager/ga/common/filter/FilterButton";
import baseFilterStyles from "@/styles/manager/common/section/filter_section.module.css";
import filterButtonStyles from "@/styles/manager_ga/common/filter/filter_button.module.css";
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
import type { AdminTableRef } from "./AdminTable";
import {
  update_admin_status,
  delete_multiple_admins,
} from "@/data/manager_sa/member/admins";

interface AdminFilterSectionProps {
  search_query: string;
  on_search_change: (query: string) => void;
  // 필터 상태
  selected_statuses?: AdminStatus[];
  on_statuses_change?: (statuses: AdminStatus[]) => void;
  // AdminTable의 ref를 받아서 선택된 관리자 정보에 접근
  admin_table_ref?: React.RefObject<AdminTableRef>;
}

export default function AdminFilterSection({
  search_query,
  on_search_change,
  selected_statuses = [],
  on_statuses_change,
  admin_table_ref,
}: AdminFilterSectionProps) {
  // Next.js의 useRouter 훅을 사용하여 페이지 이동 기능 가져오기
  const router = useRouter();

  // 상태 필터 드롭다운 열림/닫힘 상태 관리
  const [is_status_dropdown_open, set_is_status_dropdown_open] =
    useState(false);
  // useRef: DOM 요소에 대한 참조를 생성하는 React Hook입니다
  // <HTMLDivElement | null>: ref가 가리킬 수 있는 타입을 명시합니다 (null도 포함)
  const status_filter_button_ref = useRef<HTMLDivElement | null>(null);

  // 이용 제한 모달 상태 관리
  // useState: React Hook으로 컴포넌트의 상태를 관리합니다
  // [상태값, 상태를 변경하는 함수] = useState(초기값)
  const [restriction_modal_open, set_restriction_modal_open] = useState(false);

  // 경고 모달 상태 관리 (이용 제한은 한 명만 가능하다는 메시지)
  const [warning_modal_open, set_warning_modal_open] = useState(false);

  // 삭제 확인 모달 상태 관리
  // useState: React Hook으로 컴포넌트의 상태를 관리합니다
  const [delete_confirm_modal_open, set_delete_confirm_modal_open] =
    useState(false);

  // 상태 필터 핸들러
  const handle_status_apply = (statuses: AdminStatus[]) => {
    on_statuses_change?.(statuses);
  };

  // 활성 필터 태그 목록 생성 (상태 필터만)
  const active_filter_tags: FilterTag<string>[] = [
    ...selected_statuses.map((status) => ({ value: status, label: status })),
  ];

  // 필터 태그 제거 핸들러
  const handle_filter_tag_remove = (value: string) => {
    on_statuses_change?.(
      selected_statuses.filter((s) => s !== (value as AdminStatus))
    );
  };

  // 등록 버튼 핸들러
  // Next.js의 useRouter를 사용하여 관리자 등록 페이지로 이동
  const handle_register = () => {
    // 관리자 등록 페이지로 이동
    router.push("/manager_sa/member/admins/create");
  };

  // 삭제 버튼 핸들러
  // 삭제 버튼을 클릭했을 때 실행되는 함수입니다
  const handle_delete = () => {
    // admin_table_ref가 없으면 함수 종료
    if (!admin_table_ref?.current) return;

    // 선택된 관리자 ID 목록 가져오기
    const selected_ids = admin_table_ref.current.get_selected_admin_ids();

    // 선택된 관리자가 없으면 함수 종료
    if (selected_ids.length === 0) {
      // 선택된 관리자가 없을 때 경고 모달 표시 (선택사항)
      // 또는 아무 동작도 하지 않을 수 있습니다
      return;
    }

    // 삭제 확인 모달 표시
    set_delete_confirm_modal_open(true);
  };

  // 삭제 확인 핸들러
  // 삭제 확인 모달에서 "확인" 버튼을 클릭했을 때 실행되는 함수입니다
  const handle_delete_confirm = () => {
    // admin_table_ref가 없으면 함수 종료
    if (!admin_table_ref?.current) return;

    // 선택된 관리자 ID 목록 가져오기
    const selected_ids = admin_table_ref.current.get_selected_admin_ids();

    // 선택된 관리자가 없으면 함수 종료
    if (selected_ids.length === 0) return;

    // 여러 관리자를 한 번에 삭제
    // delete_multiple_admins 함수를 사용하여 localStorage에서 관리자를 삭제합니다
    const deleted_count = delete_multiple_admins(selected_ids);

    console.log(`${deleted_count}명의 관리자가 삭제되었습니다.`);

    // 삭제 확인 모달 닫기
    set_delete_confirm_modal_open(false);

    // 페이지 새로고침하여 테이블에 변경사항 반영
    // window.location.reload(): 현재 페이지를 새로고침합니다
    window.location.reload();
  };

  // 이용제한 버튼 핸들러
  // 이용제한 버튼을 클릭했을 때 실행되는 함수입니다
  const handle_block = () => {
    // admin_table_ref가 없으면 함수 종료
    if (!admin_table_ref?.current) return;

    // 선택된 관리자 ID 목록 가져오기
    const selected_ids = admin_table_ref.current.get_selected_admin_ids();

    // 선택된 관리자가 없으면 함수 종료
    if (selected_ids.length === 0) return;

    // 선택된 관리자가 여러 명인 경우 경고 모달 표시
    if (selected_ids.length > 1) {
      set_warning_modal_open(true);
      return;
    }

    // 선택된 관리자가 1명인 경우 이용 제한 사유 모달 표시
    set_restriction_modal_open(true);
  };

  // 이용 제한 확인 핸들러
  // 이용 제한 사유 모달에서 "확인" 버튼을 클릭했을 때 실행되는 함수입니다
  const handle_restriction_confirm = (restriction_reason: string) => {
    // admin_table_ref가 없으면 함수 종료
    if (!admin_table_ref?.current) return;

    // 선택된 관리자 정보 가져오기 (1명만 선택되어 있어야 함)
    const selected_admin = admin_table_ref.current.get_selected_admin();

    // 선택된 관리자가 없으면 함수 종료
    if (!selected_admin) return;

    // 차단 사유를 BlockReason 타입으로 변환
    // 모달의 차단 사유 옵션과 BlockReason 타입을 매핑
    const block_reason_map: Record<string, BlockReason> = {
      "반복 반려 누적": "반복 반려 누적",
      "반복 취소 누적": "반복 반려 누적", // 가장 유사한 것으로 매핑
      "무단 이탈·노쇼 누적": "무단 이탈 · 노쇼 누적",
      "공정위 위반 게시 요청 누적": "공정위 위반 게시 요청",
      "콘텐츠 도용·중복": "콘텐츠 중복 · 도용",
      "부적절 캠페인 게시": "부적절 캠페인 게시",
      "비정상 요청·접근": "비정상 운영 행위",
      "외부 결제·금전 요구": "외부 결제 · 금전 요구",
      "비매너 행위": "커뮤니티 가이드 위반", // 가장 유사한 것으로 매핑
    };

    const mapped_block_reason: BlockReason =
      block_reason_map[restriction_reason] || "커뮤니티 가이드 위반";

    // 차단 코드 찾기 (역방향 매핑)
    // block_code_reason_map에서 block_reason에 해당하는 block_code를 찾습니다
    const block_code =
      (Object.keys(block_code_reason_map) as BlockCode[]).find(
        (code) => block_code_reason_map[code] === mapped_block_reason
      ) || "B004"; // 기본값

    // 새로운 블랙리스트 항목 ID 생성
    // 기존 블랙리스트 데이터에서 가장 큰 ID를 찾아서 +1 합니다
    const existing_data = get_blacklist_data();
    const max_id = Math.max(
      ...existing_data.map((item) => parseInt(item.id) || 0)
    );
    const new_id = (max_id + 1).toString();

    // 현재 날짜/시간 생성
    // format: date-fns 라이브러리의 함수로 날짜를 원하는 형식으로 포맷팅합니다
    const current_date = format(new Date(), "yyyy-MM-dd HH:mm");

    // 블랙리스트 항목 생성
    const new_blacklist_item: BlacklistItem = {
      id: new_id,
      name: selected_admin.name,
      user_id: selected_admin.id,
      division: "관리자", // 구분은 "관리자"로 설정
      current_points: 0, // 관리자는 포인트가 없으므로 0으로 설정
      ip_address: "0.0.0.0", // 임시 IP 주소
      block_code: block_code as BlockCode,
      block_reason: mapped_block_reason,
      registered_date: current_date,
      registered_by: "관리자",
    };

    // 블랙리스트에 추가
    add_blacklist_item(new_blacklist_item);

    // 관리자 상태를 localStorage에 업데이트
    // 차단 사유에 따라 상태 결정
    // "영구 정지" 사유인 경우 "영구 정지", 그 외는 "일시 정지"
    const new_status: "일시 정지" | "영구 정지" =
      mapped_block_reason === "외부 결제 · 금전 요구" ||
      mapped_block_reason === "비정상 운영 행위"
        ? "영구 정지"
        : "일시 정지";

    // update_admin_status 함수를 사용하여 localStorage에 저장된 관리자 상태를 업데이트합니다
    update_admin_status(selected_admin.id, new_status);

    // 이용 제한 모달 닫기
    set_restriction_modal_open(false);

    // 페이지 새로고침하여 테이블에 변경사항 반영
    // window.location.reload(): 현재 페이지를 새로고침합니다
    window.location.reload();
  };

  // 다운로드 버튼 핸들러
  const handle_download = () => {
    // TODO: 관리자 목록 다운로드 기능 구현
    alert("기능 구현 중");
  };

  return (
    <div>
      {/* BaseFilterSection 공통 컴포넌트 사용 */}
      <BaseFilterSection<string>
        search_query={search_query}
        on_search_change={on_search_change}
        // 필터 드롭다운 버튼 (상태 필터만)
        filter_modal_button={
          <div
            ref={status_filter_button_ref}
            className={filterButtonStyles.filter_button_dropdown_wrapper}
          >
            <FilterButton
              label="상태"
              onClick={() => set_is_status_dropdown_open((prev) => !prev)}
              isActive={selected_statuses.length > 0}
              styles={{
                filter_item: baseFilterStyles.filter_item,
                checkbox_icon: baseFilterStyles.checkbox_icon,
                checkbox_icon_checked: filterButtonStyles.checkbox_icon_checked,
                filter_text: baseFilterStyles.filter_text,
                dropdown_arrow: baseFilterStyles.dropdown_arrow,
                filter_item_active: filterButtonStyles.filter_item_active,
                filter_text_active: filterButtonStyles.filter_text_active,
                dropdown_arrow_active: filterButtonStyles.dropdown_arrow_active,
              }}
            />
            <StatusFilterDropdown
              is_open={is_status_dropdown_open}
              on_close={() => set_is_status_dropdown_open(false)}
              selected_statuses={selected_statuses}
              on_apply={handle_status_apply}
              container_ref={status_filter_button_ref}
            />
          </div>
        }
        // 검색 필터 뒤에 올 버튼 (관리자 목록 다운로드)
        search_after_buttons={
          <div className={baseFilterStyles.filter_item} onClick={handle_download}>
            <img
              src="/images/excel_icon.png"
              alt="다운로드"
              className={baseFilterStyles.download_icon}
            />
            <span className={baseFilterStyles.download_button_text}>관리자 목록 다운로드</span>
          </div>
        }
        // 오른쪽에 위치할 버튼들 (등록, 삭제, 이용제한)
        right_buttons={
          <>
            {/* 등록 버튼 */}
            <div className={baseFilterStyles.filter_item} onClick={handle_register}>
              <img
                src="/images/icons/sign_plus.svg"
                alt="등록"
                className={baseFilterStyles.action_icon}
              />
              <span className={baseFilterStyles.post_action_text}>등록</span>
            </div>
            {/* 삭제 버튼 */}
            <div className={baseFilterStyles.filter_item} onClick={handle_delete}>
              <img
                src="/images/icons/sign_x.svg"
                alt="삭제"
                className={baseFilterStyles.action_icon}
              />
              <span className={baseFilterStyles.post_action_text}>삭제</span>
            </div>
            
            {/* 이용제한 버튼 */}
            <div className={baseFilterStyles.filter_item} onClick={handle_block}>
              <img
                src="/images/icons/block_btn_icon.svg"
                alt="이용제한"
                className={baseFilterStyles.block_icon}
              />
              <span className={baseFilterStyles.post_action_text}>이용 제한</span>
            </div>
          </>
        }
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
      />

      {/* 이용 제한 사유 모달 */}
      {/* 선택된 관리자가 1명일 때 표시되는 모달입니다 */}
      <ManagerRestrictionModal
        is_open={restriction_modal_open}
        on_close={() => set_restriction_modal_open(false)}
        on_block={handle_restriction_confirm}
      />

      {/* 경고 모달 (이용 제한은 한 명만 가능) */}
      {/* 선택된 관리자가 여러 명일 때 표시되는 모달입니다 */}
      <BaseModal
        is_open={warning_modal_open}
        on_close={() => set_warning_modal_open(false)}
        message="이용 제한은 한 번에 한 명만 가능합니다."
        buttons={["확인"]}
      />

      {/* 삭제 확인 모달 */}
      {/* 선택된 관리자를 삭제할지 확인하는 모달입니다 */}
      <BaseModal
        is_open={delete_confirm_modal_open}
        on_close={() => set_delete_confirm_modal_open(false)}
        message="선택한 내역을 삭제하시겠습니까?"
        buttons={["취소", "확인"]}
        on_confirm={handle_delete_confirm}
      />
    </div>
  );
}
