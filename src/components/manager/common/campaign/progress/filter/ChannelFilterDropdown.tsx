/* ========================================
   🔽 채널 필터 드롭다운 컴포넌트
   ======================================== */

/**
 * 채널 필터 드롭다운 컴포넌트
 *
 * 목적: GA/SA 관리자 진행 현황 페이지에서 캠페인 채널을 필터링하는 드롭다운입니다.
 *       모달 대신 버튼 아래에 드롭다운 형태로 표시됩니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/common/campaign/progress/section/CampaignProgressFilterSection.tsx
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 선택 시 즉시 적용
 * - 외부 클릭으로 닫기
 *
 * React 핵심 개념:
 * - props: 부모 컴포넌트에서 전달받는 데이터
 * - 제네릭 타입: BaseFilterDropdown에서 사용하는 제네릭 타입
 */

"use client";

import BaseFilterDropdown, {
  type FilterOption,
} from "@/components/manager/ga/common/filter/BaseFilterDropdown";

export type Channel =
  | "Blog"
  | "Clip"
  | "Instagram"
  | "Mission"
  | "Reels"
  | "Review"
  | "Shorts"
  | "Store"
  | "Youtube";

// 채널 라벨 매핑 (영문 코드를 한글 이름으로 변환)
// Record 타입: 키와 값의 타입을 정의하는 TypeScript 타입
export const channel_label_map: Record<Channel, string> = {
  Blog: "네이버 블로그",
  Instagram: "인스타그램",
  Youtube: "유튜브",
  Clip: "클립",
  Reels: "릴스",
  Review: "구매평",
  Shorts: "쇼츠",
  Mission: "미션",
  Store: "스토어",
};

interface ChannelFilterDropdownProps {
  // 드롭다운 열림/닫힘 상태
  is_open: boolean;
  // 드롭다운 닫기 함수
  on_close: () => void;
  // 현재 선택된 채널들
  selected_channels: Channel[];
  // 필터 적용 함수
  on_apply: (channels: Channel[]) => void;
  // 드롭다운 컨테이너 ref (위치 계산용)
  container_ref?: React.RefObject<HTMLDivElement | null>;
}

// 채널 옵션 목록
const channel_options: Channel[] = ["Blog", "Instagram", "Youtube", "Clip", "Reels", "Shorts"];

// FilterOption 배열로 변환
// map 함수: 배열을 순회하며 각 요소를 FilterOption 형태로 변환합니다
// channel_label_map을 사용하여 영문 코드를 한글 이름으로 변환합니다
const filter_options: FilterOption<Channel>[] = channel_options.map((channel) => ({
  value: channel,
  label: channel_label_map[channel], // 영문 코드를 한글 이름으로 변환
}));

/**
 * 채널 필터 드롭다운 컴포넌트
 *
 * @param props - ChannelFilterDropdownProps 타입의 props
 * @returns 채널 필터 드롭다운 JSX 요소
 */
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
