/* ========================================
   🔍 필터 섹션 컴포넌트 (래퍼)
   ======================================== */

/**
 * 필터 섹션 컴포넌트 (래퍼)
 *
 * 목적: GA 관리자 진행 현황 페이지에서 공통 FilterSection을 사용합니다.
 *       스타일을 전달하여 manager_ga에 맞게 렌더링합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/progress (진행 현황 페이지)
 *
 */

import FilterSectionCommon from '@/components/manager_common/campaign/progress/section/FilterSection';
import styles from '@/styles/manager_ga/campaign/progress/filter_section.module.css';

export default function FilterSection() {
  return (
    <FilterSectionCommon
      styles={
        styles as {
          filter_item: string;
          filter_icon: string;
          filter_text: string;
          checkbox_icon: string;
          dropdown_arrow: string;
          report_icon: string;
        }
      }
    />
  );
}
