/* ========================================
   📊 캠페인 테이블 컴포넌트
   ======================================== */

/**
 * 캠페인 테이블 컴포넌트
 *
 * 목적: GA 관리자 진행 상황 페이지에서 캠페인 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/progress (진행 상황 페이지)
 *
 * 주요 기능:
 * - 체크박스로 캠페인 선택/해제
 * - 전체 선택/해제 기능
 * - 캠페인 상세 페이지로 이동하는 링크
 * - 캠페인 정보 표시 (번호, 파트너명, 캠페인명, 유형, 채널, 상태, 모집 수, 신청 수, 지급 포인트)
 *
 */

'use client';

import CampaignTableCommon, {
  type CampaignProgressItem,
} from '@/components/manager/common/campaign/progress/table/CampaignTable';
import CampaignReportModal from '../modal/CampaignReportModal';
import { campaign_list, type CampaignType } from '@/data/manager_ga/progress';
import type { ReportCode } from '@/data/manager_ga/reported';
import tableStyles from '@/styles/manager_ga/campaign/progress_table.module.css';
import tagStyles from '@/styles/manager_ga/campaign/progress/tags.module.css';
import channelIconStyles from '@/styles/manager_ga/campaign/progress/channel_icon.module.css';

interface CampaignTableProps {
  // Props는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 방법입니다.
  // 현재는 props가 없지만, 추후 필터링된 데이터를 받을 수도 있으므로 구조를 유지합니다.
  // 공통 컴포넌트를 사용하여 중복 코드를 제거합니다.
}

export default function CampaignTable({}: CampaignTableProps) {
  return (
    <CampaignTableCommon
      campaign_list={campaign_list}
      base_path="/manager_ga/campaign/progress"
      ReportModal={CampaignReportModal}
      styles={tableStyles}
      tagStyles={tagStyles as Record<string, string> & { type_tag: string }}
      channelIconStyles={
        channelIconStyles as Record<string, string> & {
          channel_icon: string;
          channel_icon_image: string;
        }
      }
    />
  );
}
