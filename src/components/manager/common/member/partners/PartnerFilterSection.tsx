/* ========================================
   🔍 파트너 필터 섹션 컴포넌트 (공통 래퍼)
   ======================================== */

/**
 * 파트너 필터 섹션 컴포넌트 (공통 래퍼)
 *
 * 목적: GA/SA 관리자 파트너 목록 페이지에서 공통 MemberFilterSection을 사용합니다.
 *       스타일과 필터 모달 컴포넌트를 전달하여 렌더링합니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/partners (GA 관리자 파트너 목록 페이지)
 * - /manager_sa/member/partners (SA 관리자 파트너 목록 페이지)
 */

import MemberFilterSectionCommon from "@/components/manager/common/member/filter/MemberFilterSection";
import styles from "@/styles/manager/common/member/partners/partner_filter_section.module.css";
import ChannelFilterModal from "@/components/manager/common/member/partners/filter/ChannelFilterModal";
import DivisionFilterModal from "@/components/manager/common/member/partners/filter/DivisionFilterModal";
import TypeFilterModal, {
  type PartnerType,
} from "@/components/manager/common/member/partners/filter/TypeFilterModal";
import StatusFilterModal from "@/components/manager/common/member/partners/filter/StatusFilterModal";
import type { Channel } from "@/data/manager/common/filterOptions";
import type {
  PartnerDivision,
  PartnerStatus,
} from "@/data/manager_ga/common/filterOptions";

interface PartnerFilterSectionProps {
  // 검색어 상태
  search_query: string;
  // 검색어 변경 핸들러 함수
  on_search_change: (query: string) => void;
  // 필터 상태
  selected_channels: Channel[];
  on_channels_change: (channels: Channel[]) => void;
  selected_divisions: PartnerDivision[];
  on_divisions_change: (divisions: PartnerDivision[]) => void;
  selected_types: PartnerType[];
  on_types_change: (types: PartnerType[]) => void;
  selected_statuses: PartnerStatus[];
  on_statuses_change: (statuses: PartnerStatus[]) => void;
}

// 채널 이름 매핑 객체
const channel_name_map: Record<Channel, string> = {
  Blog: "네이버 블로그",
  Clip: "네이버 클립",
  Instagram: "인스타그램",
  Youtube: "유튜브",
  Store: "네이버 스토어",
};

export default function PartnerFilterSection({
  search_query,
  on_search_change,
  selected_channels,
  on_channels_change,
  selected_divisions,
  on_divisions_change,
  selected_types,
  on_types_change,
  selected_statuses,
  on_statuses_change,
}: PartnerFilterSectionProps) {
  return (
    <MemberFilterSectionCommon<
      Channel,
      PartnerDivision,
      PartnerType,
      PartnerStatus
    >
      search_query={search_query}
      on_search_change={on_search_change}
      selected_channels={selected_channels}
      on_channels_change={on_channels_change}
      selected_divisions={selected_divisions}
      on_divisions_change={on_divisions_change}
      selected_types={selected_types}
      on_types_change={on_types_change}
      selected_statuses={selected_statuses}
      on_statuses_change={on_statuses_change}
      styles={
        styles as {
          filter_item: string;
          checkbox_icon: string;
          checkbox_icon_checked: string;
          filter_text: string;
          dropdown_arrow: string;
          download_icon: string;
          report_icon: string;
        }
      }
      channel_name_map={channel_name_map}
      ChannelFilterModal={ChannelFilterModal as any}
      grade_or_division_label="구분"
      GradeOrDivisionFilterModal={DivisionFilterModal as any}
      TypeFilterModal={TypeFilterModal as any}
      StatusFilterModal={StatusFilterModal as any}
      download_button_text="파트너 목록 다운로드"
    />
  );
}
