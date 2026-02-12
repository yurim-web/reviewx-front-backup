/* ========================================
   📋 리뷰어 목록 테이블 컴포넌트 (공통 래퍼)
   ======================================== */

/**
 * 리뷰어 목록 테이블 컴포넌트 (공통 래퍼)
 *
 * 목적: GA/SA 관리자 리뷰어 목록 페이지에서 공통 ReviewerTable을 사용합니다.
 *       스타일과 상세 페이지 경로를 전달하여 렌더링합니다.
 *
 * 사용 위치:
 * - /manager_ga/member/reviewers (GA 관리자 리뷰어 목록 페이지)
 * - /manager_sa/member/reviewers (SA 관리자 리뷰어 목록 페이지)
 */

import { forwardRef } from "react";
import ReviewerTableCommon, {
  type ReviewerTableRef,
} from "@/components/manager/common/member/table/ReviewerTable";
import styles from "@/styles/manager/common/member/reviewers/reviewer_table.module.css";

import type { Channel } from "@/data/manager/common/filterOptions";
import type {
  ReviewerStatus,
  ReviewerStatusType,
} from "@/data/manager_ga/common/filterOptions";

import type { ReviewerGrade } from "@/components/manager/common/member/reviewers/filter/GradeFilterModal";

interface ReviewerTableProps {
  // 검색어
  search_query: string;
  // 필터 상태
  selected_channels?: Channel[];
  selected_grades?: ReviewerGrade[];
  selected_types?: ReviewerStatusType[];
  selected_statuses?: ReviewerStatus[];
  // 상세 페이지 경로 (GA 또는 SA에 따라 다름)
  detail_path: string;
}

// forwardRef를 사용하여 ref를 ReviewerTableCommon에 전달합니다
const ReviewerTable = forwardRef<ReviewerTableRef, ReviewerTableProps>(
  function ReviewerTable(
    {
      search_query,
      selected_channels,
      selected_grades,
      selected_types,
      selected_statuses,
      detail_path,
    },
    ref
  ) {
    return (
      <ReviewerTableCommon
        ref={ref}
        search_query={search_query}
        selected_channels={selected_channels}
        selected_grades={selected_grades}
        selected_types={selected_types}
        selected_statuses={selected_statuses}
        styles={
          styles as {
            table_container: string;
            table_header_wrapper: string;
            table_header: string;
            table_body: string;
            table_row: string;
            table_cell_checkbox: string;
            table_cell_number: string;
            table_cell_name: string;
            table_cell_channel: string;
            table_cell_type: string;
            table_cell_last_access: string;
            table_cell_join_date: string;
            table_cell_campaign_participated: string;
            table_cell_campaign_completed: string;
            table_cell_current_points: string;
            table_cell_withdrawn_points: string;
            table_cell_status_type: string;
            table_cell_status: string;
            checkbox: string;
            sort_icon: string;
            channel_icons: string;
            channel_icon_wrapper: string;
            channel_icon: string;
            type_tag: string;
            type_tag_supporter: string;
            type_tag_normal: string;
            type_tag_influencer: string;
            status_tag: string;
            status_tag_normal: string;
            status_tag_suspended: string;
            status_tag_permanent: string;
            restriction_button: string;
            restriction_button_icon: string;
            restriction_button_text: string;
            empty_message: string;
          }
        }
        detail_path={detail_path}
      />
    );
  }
);

export default ReviewerTable;
