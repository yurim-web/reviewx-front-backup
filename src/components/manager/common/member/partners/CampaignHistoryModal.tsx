/* ========================================
   📌 캠페인 진행 이력 모달 컴포넌트 (공통 래퍼)
   ======================================== */

/**
 * 캠페인 진행 이력 모달 컴포넌트 (공통 래퍼)
 *
 * 목적: GA/SA 관리자 파트너 상세 페이지에서 공통 CampaignHistoryModal을 사용합니다.
 *       스타일과 데이터를 전달하여 렌더링합니다.
 *
 * 사용 위치:
 * - /manager_ga/member/partners/[id] (GA 관리자 파트너 상세 페이지)
 * - /manager_sa/member/partners/[id] (SA 관리자 파트너 상세 페이지)
 */

import CampaignHistoryModalCommon, {
  type CampaignHistoryItem,
} from '@/components/manager/common/member/modal/CampaignHistoryModal';
import styles from '@/styles/manager_ga/member/reviewers/modal/campaign_history_modal.module.css';
import { type RecentCampaign } from '@/data/manager_ga/member/partners';

interface CampaignHistoryModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 핸들러 함수
  on_close: () => void;
  // 최근 캠페인 배열
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

