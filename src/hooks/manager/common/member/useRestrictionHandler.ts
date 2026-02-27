/* ========================================
   이용 제한 처리 공통 훅
   ======================================== */

/**
 * useRestrictionHandler
 *
 * 목적: ReviewerTable/PartnerTable의 이용 제한 모달 상태 및 블랙리스트 등록 로직을 공통화합니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers (GA 리뷰어 목록)
 * - /manager_sa/member/reviewers (SA 리뷰어 목록)
 * - /manager_ga/member/partners (GA 파트너 목록)
 * - /manager_sa/member/partners (SA 파트너 목록)
 */

import { useState, useCallback } from "react";
import { format } from "date-fns";
import {
  add_blacklist_item,
  get_blacklist_data,
  type BlacklistItem,
  type BlockReason,
  block_code_reason_map,
} from "@/data/manager_ga/member/blacklist";
import type {
  BlockCode,
  ReviewerStatusType,
  PartnerStatusType,
} from "@/data/manager_ga/common/filterOptions";

/** 이용 제한 사유 → BlockReason 매핑 */
const BLOCK_REASON_MAP: Record<string, BlockReason> = {
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

export interface RestrictionMember {
  id: string;
  display_name: string;
  current_points: number;
}

interface UseRestrictionHandlerConfig {
  selectedIds: string[];
  findMember: (id: string) => RestrictionMember | undefined;
  division: "리뷰어" | "파트너";
  updateStatusType: (id: string, statusType: ReviewerStatusType | PartnerStatusType) => void;
  reset_selection: () => void;
}

export function useRestrictionHandler({
  selectedIds,
  findMember,
  division,
  updateStatusType,
  reset_selection,
}: UseRestrictionHandlerConfig) {
  const [restriction_modal_open, set_restriction_modal_open] = useState(false);
  const [warning_modal_open, set_warning_modal_open] = useState(false);
  const [already_processed_modal_open, set_already_processed_modal_open] = useState(false);

  const open_modal = useCallback(() => {
    if (selectedIds.length === 0) return;
    if (selectedIds.length > 1) {
      set_warning_modal_open(true);
      return;
    }
    set_restriction_modal_open(true);
  }, [selectedIds]);

  const handle_modal_close = () => {
    set_restriction_modal_open(false);
  };

  const handle_confirm = (restriction_reason: string) => {
    if (selectedIds.length !== 1) return;

    const selected_id = selectedIds[0];
    const member = findMember(selected_id);
    if (!member) return;

    // 이미 이용 제한된 계정인지 확인
    const existing_blacklist = get_blacklist_data();
    const is_already_blocked = existing_blacklist.some((item) => item.name === member.display_name);

    if (is_already_blocked) {
      set_restriction_modal_open(false);
      set_already_processed_modal_open(true);
      return;
    }

    // 차단 사유 매핑
    const mapped_block_reason: BlockReason =
      BLOCK_REASON_MAP[restriction_reason] || "커뮤니티 가이드 위반";

    // 차단 코드 찾기
    const block_code =
      (Object.keys(block_code_reason_map) as BlockCode[]).find(
        (code) => block_code_reason_map[code] === mapped_block_reason
      ) || "B004";

    // 새 블랙리스트 항목 생성
    const existing_data = get_blacklist_data();
    const max_id = Math.max(...existing_data.map((item) => parseInt(item.id) || 0));
    const new_id = (max_id + 1).toString();
    const current_date = format(new Date(), "yyyy-MM-dd HH:mm");

    const new_blacklist_item: BlacklistItem = {
      id: new_id,
      name: member.display_name,
      user_id: member.id,
      division,
      current_points: member.current_points,
      ip_address: "0.0.0.0",
      block_code: block_code as BlockCode,
      block_reason: mapped_block_reason,
      registered_date: current_date,
      registered_by: "관리자",
    };

    add_blacklist_item(new_blacklist_item);
    updateStatusType(selected_id, "이용 제한 회원");
    reset_selection();
    set_restriction_modal_open(false);
  };

  return {
    restriction_modal_open,
    warning_modal_open,
    already_processed_modal_open,
    open_modal,
    handle_modal_close,
    handle_confirm,
    close_warning_modal: () => set_warning_modal_open(false),
    close_already_processed_modal: () => set_already_processed_modal_open(false),
  };
}
