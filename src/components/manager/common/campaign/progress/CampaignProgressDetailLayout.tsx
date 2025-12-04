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

export type ManagerType = "ga" | "sa";
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
  manager_type?: ManagerType;
}

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
