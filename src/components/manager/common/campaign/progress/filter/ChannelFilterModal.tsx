/**
 * 채널 필터 모달 컴포넌트
 *
 * GA/SA 관리자 진행 현황 페이지에서 캠페인 채널을 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - src/components/manager_ga/campaign/progress/section/FilterSection.tsx
 * - src/components/manager_sa/campaign/progress/section/FilterSection.tsx
 */

"use client";

import { createFilterModal } from "./createFilterModal";

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

interface ChannelFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_channels: Channel[];
  on_apply: (channels: Channel[]) => void;
}

const channel_options: Channel[] = ["Blog", "Instagram", "Youtube", "Clip", "Reels", "Shorts"];

const ChannelFilterModalComponent = createFilterModal<Channel>({
  options: channel_options,
  section_title: "채널",
  label_map: channel_label_map,
});

export default function ChannelFilterModal({
  is_open,
  on_close,
  selected_channels,
  on_apply,
}: ChannelFilterModalProps) {
  return (
    <ChannelFilterModalComponent
      is_open={is_open}
      on_close={on_close}
      selected_values={selected_channels}
      on_apply={on_apply}
    />
  );
}
