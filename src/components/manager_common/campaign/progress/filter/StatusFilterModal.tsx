/* ========================================
   🔍 상태 필터 모달 컴포넌트
   ======================================== */

/**
 * 상태 필터 모달 컴포넌트
 *
 * 목적: GA/SA 관리자 진행 현황 페이지에서 캠페인 상태를 필터링하는 모달입니다.
 *
 * 📍 사용 위치:
 * - src/components/manager_ga/campaign/progress/section/FilterSection.tsx
 *   (GA 관리자 진행 현황 페이지의 필터 섹션)
 * - src/components/manager_sa/campaign/progress/section/FilterSection.tsx
 *   (SA 관리자 진행 현황 페이지의 필터 섹션)
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 상태 옵션: 예정, 신청, 진행, 종료, 긴급
 * - 필터 적용/초기화 기능
 * - 모달 오버레이 클릭으로 닫기
 *
 */

'use client';

import { createFilterModal } from './createFilterModal';

// 캠페인 상태 타입 정의
export type CampaignStatus =
  | '예정'
  | '신청'
  | '진행'
  | '종료'
  | '취소'
  | '긴급';

interface StatusFilterModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  selected_statuses: CampaignStatus[]; // 현재 선택된 상태들
  on_apply: (statuses: CampaignStatus[]) => void; // 필터 적용 함수
}

// 상태 필터 옵션
const status_options: CampaignStatus[] = [
  '예정',
  '신청',
  '진행',
  '종료',
  '취소',
  '긴급',
];

// 팩토리 함수를 사용하여 필터 모달 생성
// - createFilterModal: 공통 패턴을 추출한 팩토리 함수입니다
// - label_map 없음: value와 label이 동일하므로 매핑이 불필요합니다
const StatusFilterModalComponent = createFilterModal<CampaignStatus>({
  options: status_options,
  section_title: '상태',
});

// Props 이름을 StatusFilterModalProps에 맞게 변환하는 래퍼 컴포넌트
export default function StatusFilterModal({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
}: StatusFilterModalProps) {
  return (
    <StatusFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_statuses}
      on_apply={on_apply}
    />
  );
}
