/* ========================================
   채널 필터 모달 컴포넌트 (파트너)
   ======================================== */

/**
 * ChannelFilterModal
 *
 * 목적: GA/SA 관리자 파트너 목록 페이지에서 채널을 필터링하는 모달
 *
 * 사용 페이지:
 * - /manager_ga/member/partners (GA 파트너 목록)
 * - /manager_sa/member/partners (SA 파트너 목록)
 */

"use client";

import { createFilterModal } from "@/components/manager/common/campaign/progress/filter/createFilterModal";
import type { Channel } from "@/data/manager_ga/member/partners";

interface ChannelFilterModalProps {
  is_open: boolean;
  on_close: () => void;
  selected_channels: Channel[];
  on_apply: (channels: Channel[]) => void;
}

const ChannelFilterModalComponent = createFilterModal<Channel>({
  options: ["Blog", "Clip", "Instagram", "Youtube"],
  section_title: "채널",
  label_map: {
    Blog: "네이버 블로그",
    Clip: "네이버 클립",
    Instagram: "인스타그램",
    Youtube: "유튜브",
  } as Record<Channel, string>,
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
