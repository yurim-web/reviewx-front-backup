/* ========================================
   📌 캠페인 진행 이력 모달 컴포넌트 (래퍼)
   ======================================== */

/**
 * 캠페인 진행 이력 모달 컴포넌트 (래퍼)
 *
 * 목적: GA 관리자 리뷰어 상세 페이지에서 공통 CampaignHistoryModal을 사용합니다.
 *       스타일과 데이터를 전달하여 manager_ga에 맞게 렌더링합니다.
 *
 * 사용 위치:
 * - /manager_ga/member/reviewers/[id] (리뷰어 상세 페이지)
 *
 */

import CampaignHistoryModalCommon, {
  type CampaignHistoryItem,
} from '@/components/manager/common/member/modal/CampaignHistoryModal';
import styles from '@/styles/manager_ga/member/reviewers/modal/campaign_history_modal.module.css';
import { type RecentCampaign } from '@/data/manager_ga/member/reviewers';

interface CampaignHistoryModalProps {
  is_open: boolean;
  on_close: () => void;
  campaigns: RecentCampaign[];
}

// RecentCampaign을 CampaignHistoryItem으로 변환하는 함수
const convert_to_campaign_history_item = (
  campaign: RecentCampaign,
): CampaignHistoryItem => {
  return {
    campaign_number: campaign.campaign_number,
    campaign_name: campaign.campaign_name,
    status: campaign.status,
    type: campaign.type,
    channel: campaign.channel,
    points: campaign.points,
  };
};

export default function CampaignHistoryModal({
  is_open,
  on_close,
  campaigns,
}: CampaignHistoryModalProps) {
  // RecentCampaign 배열을 CampaignHistoryItem 배열로 변환
  const campaign_items: CampaignHistoryItem[] = campaigns.map(
    convert_to_campaign_history_item,
  );

  return (
    <CampaignHistoryModalCommon
      is_open={is_open}
      on_close={on_close}
      campaigns={campaign_items}
      styles={
        styles as {
          modal_overlay: string;
          modal_container: string;
          modal_content: string;
          modal_header: string;
          modal_title: string;
          close_button: string;
          close_icon: string;
          table_wrapper: string;
          table_header: string;
          table_body: string;
          table_row: string;
          table_cell: string;
          table_cell_campaign_name: string;
          status_tag: string;
          status_tag_progress: string;
          status_tag_completed: string;
          status_tag_cancelled: string;
          type_tag: string;
          channel_icon_wrapper: string;
          channel_icon: string;
          empty_state: string;
          empty_message: string;
        }
      }
    />
  );
}
