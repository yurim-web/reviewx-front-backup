/* ========================================
   🔍 리뷰어 필터 섹션 컴포넌트 (공통 래퍼)
   ======================================== */

/**
 * 리뷰어 필터 섹션 컴포넌트 (공통 래퍼)
 *
 * 목적: GA/SA 관리자 리뷰어 목록 페이지에서 공통 MemberFilterSection을 사용합니다.
 *       스타일과 필터 모달 컴포넌트를 전달하여 렌더링합니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers (GA 관리자 리뷰어 목록 페이지)
 * - /manager_sa/member/reviewers (SA 관리자 리뷰어 목록 페이지)
 */

import MemberFilterSectionCommon from "@/components/manager/common/member/filter/MemberFilterSection";
import styles from "@/styles/manager/common/member/reviewers/reviewer_filter_section.module.css";
import ChannelFilterModal from "@/components/manager/common/member/reviewers/filter/ChannelFilterModal";
import GradeFilterModal from "@/components/manager/common/member/reviewers/filter/GradeFilterModal";
import TypeFilterModal from "@/components/manager/common/member/reviewers/filter/TypeFilterModal";
import StatusFilterModal from "@/components/manager/common/member/reviewers/filter/StatusFilterModal";
import type { Channel } from "@/data/manager/common/filterOptions";
import type {
  ReviewerStatus,
  ReviewerStatusType,
} from "@/data/manager_ga/common/filterOptions";
import type { ReviewerGrade } from "@/components/manager/common/member/reviewers/filter/GradeFilterModal";

interface ReviewerFilterSectionProps {
  // 검색어 상태
  search_query: string;
  // 검색어 변경 핸들러 함수
  on_search_change: (query: string) => void;
  // 필터 상태
  selected_channels: Channel[];
  on_channels_change: (channels: Channel[]) => void;
  selected_grades: ReviewerGrade[];
  on_grades_change: (grades: ReviewerGrade[]) => void;
  selected_types: ReviewerStatusType[];
  on_types_change: (types: ReviewerStatusType[]) => void;
  selected_statuses: ReviewerStatus[];
  on_statuses_change: (statuses: ReviewerStatus[]) => void;
}

// 채널 이름 매핑 객체
const channel_name_map: Record<Channel, string> = {
  Blog: "네이버 블로그",
  Clip: "네이버 클립",
  Instagram: "인스타그램",
  Youtube: "유튜브",
  Store: "네이버 스토어",
};

export default function ReviewerFilterSection({
  search_query,
  on_search_change,
  selected_channels,
  on_channels_change,
  selected_grades,
  on_grades_change,
  selected_types,
  on_types_change,
  selected_statuses,
  on_statuses_change,
}: ReviewerFilterSectionProps) {
  return (
    <MemberFilterSectionCommon<
      Channel,
      ReviewerGrade,
      ReviewerStatusType,
      ReviewerStatus
    >
      search_query={search_query}
      on_search_change={on_search_change}
      selected_channels={selected_channels}
      on_channels_change={on_channels_change}
      selected_divisions={selected_grades}
      on_divisions_change={on_grades_change}
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
      grade_or_division_label="등급"
      GradeOrDivisionFilterModal={GradeFilterModal as any}
      TypeFilterModal={TypeFilterModal as any}
      StatusFilterModal={StatusFilterModal as any}
      download_button_text="리뷰어 목록 다운로드"
    />
  );
}
