/* ========================================
   🔽 채널 필터 드롭다운 컴포넌트 (공통)
   ======================================== */

/**
 * 채널 필터 드롭다운 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 리뷰어 목록 페이지에서 채널을 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/common/member/filter/MemberFilterSection.tsx (리뷰어용)
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";
import type { Channel } from "@/data/manager_ga/member/reviewers";

interface ChannelFilterDropdownProps {
  is_open: boolean;
  on_close: () => void;
  selected_channels: Channel[];
  on_apply: (channels: Channel[]) => void;
  container_ref?: React.RefObject<HTMLDivElement>;
}

// 채널 필터 옵션 배열
const channel_options: { value: Channel; label: string }[] = [
  { value: "Blog", label: "네이버 블로그" },
  { value: "Clip", label: "네이버 클립" },
  { value: "Instagram", label: "인스타그램" },
  { value: "Youtube", label: "유튜브" },
];

// 채널 옵션을 FilterOption 형태로 변환
const filter_options: FilterOption<Channel>[] = channel_options.map(
  (option) => ({
    value: option.value,
    label: option.label,
  })
);

export default function ChannelFilterDropdown({
  is_open,
  on_close,
  selected_channels,
  on_apply,
  container_ref,
}: ChannelFilterDropdownProps) {
  return (
    <BaseFilterDropdown<Channel>
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_channels}
      on_apply={on_apply}
      options={filter_options}
      container_ref={container_ref}
    />
  );
}
