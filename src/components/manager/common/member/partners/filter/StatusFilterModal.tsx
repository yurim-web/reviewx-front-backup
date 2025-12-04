/* ========================================
   🔍 상태 필터 모달 컴포넌트 (공통)
   ======================================== */

/**
 * 상태 필터 모달 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 파트너 목록 페이지에서 상태를 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - PartnerFilterSection 컴포넌트에서 상태 필터로 사용
 * - /manager_ga/member/partners (GA 관리자 파트너 목록 페이지)
 * - /manager_sa/member/partners (SA 관리자 파트너 목록 페이지)
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 상태 옵션: 정상, 일시 정지, 영구 정지
 * - 필터 적용/초기화 기능
 * - 모달 외부 클릭으로 닫기
 */

"use client";

import BaseFilterModal, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterModal";
import type { PartnerStatus } from "@/data/manager_ga/member/partners";

interface StatusFilterModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 현재 선택된 상태들
  selected_statuses: PartnerStatus[];
  // 필터 적용 함수 (선택된 상태들을 부모 컴포넌트로 전달)
  on_apply: (statuses: PartnerStatus[]) => void;
}

// 상태 필터 옵션 배열
const status_options: PartnerStatus[] = ["정상", "일시 정지", "영구 정지"];

// 상태 옵션을 FilterOption 형태로 변환하는 함수
const get_status_options = (): FilterOption<PartnerStatus>[] => {
  return status_options.map((status) => ({
    value: status,
    label: status,
  }));
};

export default function StatusFilterModal({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
}: StatusFilterModalProps) {
  const options = get_status_options();

  return (
    <BaseFilterModal<PartnerStatus>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
      options={options}
      section_title="상태"
    />
  );
}
