/* ========================================
   🎯 캠페인 진행현황 상세 페이지 레이아웃 래퍼 컴포넌트
   ======================================== */

/**
 * 캠페인 진행현황 상세 페이지 레이아웃 래퍼 컴포넌트
 *
 * 목적: GA(General Admin)와 SA(Super Admin) 두 가지 매니저 타입에 따라
 *       다른 CSS 스타일을 적용하는 래퍼 컴포넌트입니다.
 *       공통 레이아웃 컴포넌트를 재사용하면서 스타일만 분리합니다.
 *
 * 📍 사용 위치:
 * - src/app/manager_ga/campaign/progress/delivery/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/mission/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/reporter/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/review/[id]/page.tsx
 * - src/app/manager_ga/campaign/progress/visit/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/delivery/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/mission/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/reporter/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/review/[id]/page.tsx
 * - src/app/manager_sa/campaign/progress/visit/[id]/page.tsx
 *
 * 📦 내부 사용 컴포넌트:
 * - src/components/manager/common/campaign/progress/layout/CampaignProgressDetailLayout.tsx
 *   (공통 레이아웃 컴포넌트)
 *
 */

import CampaignProgressDetailLayoutCommon, {
  type RenderCardFunction,
} from "./layout/CampaignProgressDetailLayout";
import detailStylesGA from "@/styles/manager_ga/campaign_detail.module.css";
import detailStylesSA from "@/styles/manager_ga/campaign_detail.module.css";
import type {
  CampaignWithApplicants,
  AllApplicant,
} from "@/data/partner/sharedCampaigns";
import type {
  SortOption,
  TabType,
} from "@/hooks/manager/common/campaign/useCampaignProgressDetail";

/**
 * 매니저 타입 정의
 * - "ga": General Admin (일반 관리자)
 * - "sa": Super Admin (슈퍼 관리자)
 */
export type ManagerType = "ga" | "sa";

export type { RenderCardFunction };

/**
 * CampaignProgressDetailLayout 컴포넌트의 Props 인터페이스
 */
interface CampaignProgressDetailLayoutProps {
  // 캠페인 데이터 (신청자 정보 포함)
  campaign_data: CampaignWithApplicants;
  // 현재 활성화된 탭 ("applicants" 또는 "selected")
  active_tab: TabType;
  // 탭 변경 핸들러 함수
  set_active_tab: (tab: TabType) => void;
  // 현재 정렬 옵션
  sort_order: SortOption;
  // 정렬 옵션 변경 핸들러 함수
  set_sort_order: (order: SortOption) => void;
  // 정렬 옵션 목록 (드롭다운에 표시될 옵션들)
  sort_options: Array<{ value: SortOption; label: string }>;
  // 전체 신청자 수
  applicants_count: number;
  // 선정된 신청자 수
  selected_count: number;
  // 현재 탭에 표시할 신청자 목록
  current_applicants: AllApplicant[];
  // 신청자 선정 핸들러 함수 (id를 받아서 선정 처리)
  handle_select_applicant: (id: string) => void;
  // 신청자 선정 취소 핸들러 함수 (id를 받아서 선정 취소 처리)
  handle_cancel_applicant: (id: string) => void;
  // 전체 신청자 다운로드 핸들러 함수
  handle_download_applicants: () => void;
  // 선정된 신청자 다운로드 핸들러 함수
  handle_download_selected: () => void;
  // 카드 렌더링 함수 (각 캠페인 타입마다 다른 카드 컴포넌트를 렌더링)
  render_card: RenderCardFunction;
  // 캠페인 ID (URL 파라미터에서 가져온 값)
  campaign_id: string;
  // 매니저 타입 (선택적, 기본값은 "ga")
  manager_type?: ManagerType;
}

/**
 * CampaignProgressDetailLayout 컴포넌트
 *
 * 기능: manager_type에 따라 적절한 CSS 모듈을 선택하여
 *       공통 레이아웃 컴포넌트에 전달하는 래퍼 컴포넌트입니다.
 *
 * @param props - CampaignProgressDetailLayoutProps 타입의 props
 * @returns JSX.Element - 공통 레이아웃 컴포넌트를 감싼 래퍼
 */
export default function CampaignProgressDetailLayout(
  props: CampaignProgressDetailLayoutProps
) {
  const manager_type = props.manager_type || "ga";
  const detailStyles = manager_type === "ga" ? detailStylesGA : detailStylesSA;
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
