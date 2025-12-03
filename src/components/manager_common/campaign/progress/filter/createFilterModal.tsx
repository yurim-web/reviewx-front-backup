/* ========================================
   🏭 필터 모달 팩토리 함수
   ======================================== */

/**
 * 필터 모달 팩토리 함수
 *
 * 목적: ChannelFilterModal, StatusFilterModal, TypeFilterModal 등
 *       동일한 패턴의 필터 모달을 쉽게 생성할 수 있도록 하는 팩토리 함수입니다.
 *
 * 📍 사용 위치:
 * - src/components/manager_common/campaign/progress/filter/ChannelFilterModal.tsx
 *   (채널 필터 모달 - label_map 사용)
 * - src/components/manager_common/campaign/progress/filter/StatusFilterModal.tsx
 *   (상태 필터 모달 - label_map 없음)
 * - src/components/manager_common/campaign/progress/filter/TypeFilterModal.tsx
 *   (유형 필터 모달 - label_map 없음)
 *
 */

'use client';

import BaseFilterModal, {
  type FilterOption,
} from '@/components/manager_ga/common/filter/BaseFilterModal';

// ============================================================
// 타입 정의
// ============================================================

/**
 * 필터 모달 생성 함수의 파라미터 타입
 *
 * @template T - 필터 값의 타입 (예: Channel, CampaignStatus, CampaignType)
 */
interface CreateFilterModalParams<T extends string> {
  // 필터 옵션 배열
  options: T[];
  // 섹션 제목 (모달에 표시될 제목)
  section_title: string;
  // 레이블 매핑 (선택사항, value와 label이 다를 때 사용)
  // 예: { Blog: '네이버 블로그', Instagram: '인스타그램' }
  label_map?: Record<T, string>;
}

// ============================================================

/**
 * 필터 모달 컴포넌트의 Props 타입
 *
 * @template T - 필터 값의 타입
 */
interface FilterModalProps<T extends string> {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 현재 선택된 값들
  selected_values: T[];
  // 필터 적용 함수
  on_apply: (values: T[]) => void;
}

// ============================================================
// 팩토리 함수
// ============================================================

/**
 * 필터 모달을 생성하는 팩토리 함수
 *
 * @template T - 필터 값의 타입
 * @param params - 필터 모달 생성 파라미터
 * @returns 필터 모달 컴포넌트
 *
 * 사용 예시:
 * ```typescript
 * // 레이블 매핑이 필요한 경우 (Channel)
 * const ChannelFilterModal = createFilterModal({
 *   options: ['Blog', 'Instagram', 'Youtube'],
 *   section_title: '채널',
 *   label_map: { Blog: '네이버 블로그', Instagram: '인스타그램', Youtube: '유튜브' }
 * });
 *
 * // 레이블 매핑이 불필요한 경우 (Status, Type)
 * const StatusFilterModal = createFilterModal({
 *   options: ['예정', '신청', '진행'],
 *   section_title: '상태'
 * });
 * ```
 */
export function createFilterModal<T extends string>({
  options,
  section_title,
  label_map,
}: CreateFilterModalParams<T>) {
  // ============================================================
  // 옵션 변환 함수
  // ============================================================
  /**
   * 옵션을 FilterOption 형태로 변환하는 함수
   * - label_map이 있으면 매핑된 레이블 사용
   * - 없으면 value를 그대로 label로 사용
   */
  const get_filter_options = (): FilterOption<T>[] => {
    return options.map((value) => ({
      value,
      label: label_map ? label_map[value] : value,
    }));
  };

  // ============================================================
  // 필터 모달 컴포넌트
  // ============================================================
  /**
   * 필터 모달 컴포넌트
   * - 클로저를 통해 외부 함수의 options, section_title, label_map에 접근합니다
   */
  function FilterModal({
    is_open,
    on_close,
    selected_values,
    on_apply,
  }: FilterModalProps<T>) {
    // 옵션을 FilterOption 형태로 변환
    const filter_options = get_filter_options();

    // BaseFilterModal 공통 컴포넌트를 사용하여 중복 코드 제거
    return (
      <BaseFilterModal<T>
        is_open={is_open}
        on_close={on_close}
        selected_values={selected_values}
        on_apply={on_apply}
        options={filter_options}
        section_title={section_title}
      />
    );
  }

  // 컴포넌트 반환
  return FilterModal;
}
