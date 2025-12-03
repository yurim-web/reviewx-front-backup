/* ========================================
   📋 파트너 목록 테이블 컴포넌트 (래퍼)
   ======================================== */

/**
 * 파트너 목록 테이블 컴포넌트 (래퍼)
 *
 * 목적: GA 관리자 파트너 목록 페이지에서 공통 PartnerTable을 사용합니다.
 *       스타일과 상세 페이지 경로를 전달하여 manager_ga에 맞게 렌더링합니다.
 *
 * 사용 위치:
 * - /manager_ga/member/partners (파트너 목록 페이지)
 *
 */

import PartnerTableCommon from '@/components/manager_common/member/table/PartnerTable';
import styles from '@/styles/manager_ga/member/partners/partner_table.module.css';

interface PartnerTableProps {
  search_query: string;
}

export default function PartnerTable({ search_query }: PartnerTableProps) {
  return (
    <PartnerTableCommon
      search_query={search_query}
      styles={
        styles as {
          table_container: string;
          table_header: string;
          table_body: string;
          table_row: string;
          table_cell_checkbox: string;
          table_cell_number: string;
          table_cell_business_name: string;
          table_cell_division: string;
          table_cell_last_access: string;
          table_cell_join_date: string;
          table_cell_campaign_in_progress: string;
          table_cell_campaign_completed: string;
          table_cell_current_points: string;
          table_cell_used_points: string;
          table_cell_status_type: string;
          table_cell_status: string;
          checkbox: string;
          sort_icon: string;
          business_name_wrapper: string;
          business_name_row: string;
          business_name_text: string;
          business_info_text: string;
          download_info_button: string;
          download_info_icon: string;
          division_tag: string;
          division_tag_corporate: string;
          division_tag_individual: string;
          status_tag: string;
          status_tag_normal: string;
          status_tag_suspended: string;
          status_tag_permanent: string;
          empty_message: string;
        }
      }
      detail_path="/manager_ga/member/partners"
    />
  );
}
