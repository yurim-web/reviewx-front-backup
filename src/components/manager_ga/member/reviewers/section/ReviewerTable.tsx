/* ========================================
   📋 리뷰어 목록 테이블 컴포넌트 (래퍼)
   ======================================== */

/**
 * 리뷰어 목록 테이블 컴포넌트 (래퍼)
 *
 * 목적: GA 관리자 리뷰어 목록 페이지에서 공통 ReviewerTable을 사용합니다.
 *       스타일과 상세 페이지 경로를 전달하여 manager_ga에 맞게 렌더링합니다.
 *
 * 사용 위치:
 * - /manager_ga/member/reviewers (리뷰어 목록 페이지)
 *
 */

import ReviewerTableCommon from '@/components/manager_common/member/table/ReviewerTable';
import styles from '@/styles/manager_ga/member/reviewers/reviewer_table.module.css';

interface ReviewerTableProps {
  search_query: string;
}

export default function ReviewerTable({ search_query }: ReviewerTableProps) {
  return (
    <ReviewerTableCommon
      search_query={search_query}
      styles={
        styles as {
          table_container: string;
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
          empty_message: string;
        }
      }
      detail_path="/manager_ga/member/reviewers"
    />
  );
}
