/* ========================================
   🔍 상태 필터 모달 컴포넌트
   ======================================== */

/**
 * 상태 필터 모달 컴포넌트
 *
 * 목적: 결제 내역 페이지에서 계정 상태를 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - PaymentHistoryFilterSection 컴포넌트에서 상태 필터로 사용
 * - /manager_sa/settlement/payment_history (결제 내역 페이지)
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 계정 상태 옵션: 정상, 일시 정지, 영구 정지, 탈퇴
 * - 필터 적용/초기화 기능
 * - 모달 외부 클릭으로 닫기
 */

"use client";

import BaseFilterModal, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterModal";

// 계정 상태 타입 정의
// 각 상태 설명:
// - "정상": 정상 상태
// - "일시 정지": 일시적으로 정지된 상태
// - "영구 정지": 영구적으로 정지된 상태
// - "탈퇴": 탈퇴한 상태
export type AccountStatus = "정상" | "일시 정지" | "영구 정지" | "탈퇴";

interface AccountStatusFilterModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 현재 선택된 계정 상태들
  selected_statuses: AccountStatus[];
  // 필터 적용 함수 (선택된 계정 상태들을 부모 컴포넌트로 전달)
  on_apply: (statuses: AccountStatus[]) => void;
}

// 계정 상태 필터 옵션 배열
const account_status_options: AccountStatus[] = [
  "정상",
  "일시 정지",
  "영구 정지",
  "탈퇴",
];

// 계정 상태 옵션을 FilterOption 형태로 변환하는 함수
const get_account_status_options = (): FilterOption<AccountStatus>[] => {
  return account_status_options.map((status) => ({
    value: status,
    label: status,
  }));
};

export default function AccountStatusFilterModal({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
}: AccountStatusFilterModalProps) {
  const options = get_account_status_options();

  return (
    <BaseFilterModal<AccountStatus>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
      options={options}
      section_title="상태"
    />
  );
}

