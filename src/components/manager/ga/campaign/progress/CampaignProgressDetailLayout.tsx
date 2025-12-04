/* ========================================
   📄 캠페인 진행상황 상세 페이지 공통 레이아웃 (래퍼)
   ======================================== */

/**
 * 캠페인 진행상황 상세 페이지 공통 레이아웃 컴포넌트 (래퍼)
 *
 * 목적: GA 관리자 진행 상황 페이지에서 공통 CampaignProgressDetailLayout을 사용합니다.
 *       스타일을 전달하여 manager_ga에 맞게 렌더링합니다.
 *
 * 사용 위치:
 * - src/app/manager_ga/campaign/progress/delivery/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/mission/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/reporter/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/review/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/visit/[id]/page.tsx
 *
 */

import CampaignProgressDetailLayoutCommon, {
  type RenderCardFunction,
} from '@/components/manager/common/campaign/progress/layout/CampaignProgressDetailLayout';
import detailStyles from '@/styles/manager_ga/campaign_detail.module.css';
import type {
  CampaignWithApplicants,
  AllApplicant,
} from '@/data/partner/sharedCampaigns';
import type {
  SortOption,
  TabType,
} from '@/hooks/manager/common/campaign/useCampaignProgressDetail';

// 타입도 내보내기 (재사용을 위해)
export type { RenderCardFunction };

interface CampaignProgressDetailLayoutProps {
  campaign_data: CampaignWithApplicants;
  active_tab: TabType;
  set_active_tab: (tab: TabType) => void;
  sort_order: SortOption;
  set_sort_order: (order: SortOption) => void;
  sort_options: Array<{ value: SortOption; label: string }>;
  applicants_count: number;
  selected_count: number;
  current_applicants: AllApplicant[];
  handle_select_applicant: (id: string) => void;
  handle_cancel_applicant: (id: string) => void;
  handle_download_applicants: () => void;
  handle_download_selected: () => void;
  render_card: RenderCardFunction;
  campaign_id: string;
}

export default function CampaignProgressDetailLayout(
  props: CampaignProgressDetailLayoutProps,
) {
  return (
    <CampaignProgressDetailLayoutCommon
      {...props}
      detailStyles={
        detailStyles as {
          detail_page_wrapper: string;
          content_container: string;
          content_inner: string;
        }
      }
    />
  );
}
