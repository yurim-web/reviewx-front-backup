/**
 * 필터 모달 팩토리 함수
 *
 * ChannelFilterModal, StatusFilterModal, TypeFilterModal 등
 * 동일한 패턴의 필터 모달을 쉽게 생성할 수 있도록 하는 팩토리 함수입니다.
 *
 * 사용 위치:
 * - src/components/manager/common/campaign/progress/filter/ChannelFilterModal.tsx
 * - src/components/manager/common/campaign/progress/filter/StatusFilterModal.tsx
 * - src/components/manager/common/campaign/progress/filter/TypeFilterModal.tsx
 */

"use client";

import BaseFilterModal, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterModal";

interface CreateFilterModalParams<T extends string> {
  /** 필터 옵션 배열 */
  options: T[];
  /** 섹션 제목 (모달에서 표시할 제목) */
  section_title: string;
  /** 라벨 매핑 (선택 항목, value와 label을 다르게 표시할 때 사용) */
  label_map?: Record<T, string>;
}

interface FilterModalProps<T extends string> {
  is_open: boolean;
  on_close: () => void;
  selected_values: T[];
  on_apply: (values: T[]) => void;
}

export function createFilterModal<T extends string>({
  options,
  section_title,
  label_map,
}: CreateFilterModalParams<T>) {
  const get_filter_options = (): FilterOption<T>[] => {
    return options.map((value) => ({
      value,
      label: label_map ? label_map[value] : value,
    }));
  };

  function FilterModal({
    is_open,
    on_close,
    selected_values,
    on_apply,
  }: FilterModalProps<T>) {
    const filter_options = get_filter_options();

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

  return FilterModal;
}
