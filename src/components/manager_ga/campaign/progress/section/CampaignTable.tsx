/* ========================================
   📋 캠페인 테이블 컴포넌트
   ======================================== */

/**
 * 캠페인 테이블 컴포넌트
 *
 * 목적: GA 관리자 진행 현황 페이지의 캠페인 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/progress (진행 현황 페이지)
 *
 * 주요 기능:
 * - 체크박스로 캠페인 선택/해제
 * - 전체 선택/해제 기능
 * - 캠페인 상세 페이지로 이동하는 링크
 * - 캠페인 정보 표시 (번호, 파트너명, 캠페인명, 유형, 채널, 상태, 모집 수, 신청 수, 지급 포인트)
 *
 * 학습 포인트:
 * - useState: 컴포넌트의 상태를 관리하는 React Hook입니다
 * - 이벤트 핸들러: 사용자 상호작용에 반응하는 함수입니다
 * - 조건부 렌더링: 조건에 따라 다른 내용을 렌더링합니다
 * - Link 컴포넌트: Next.js의 클라이언트 사이드 네비게이션 컴포넌트입니다
 * - map 함수: 배열을 순회하며 컴포넌트를 렌더링합니다
 * - flex 레이아웃: display: flex와 gap을 사용하여 요소들을 나란히 배치하고 간격을 조절합니다
 */

'use client';

import CampaignTableCommon, {
  type CampaignProgressItem,
} from '@/components/manager_common/campaign/progress/CampaignTable';
import CampaignReportModal from '../modal/CampaignReportModal';
import {
  campaign_list,
  type CampaignType,
} from '@/data/manager_ga/progress';
import type { ReportCode } from '@/data/manager_ga/reported';
import tableStyles from '@/styles/manager_ga/campaign/progress_table.module.css';
import tagStyles from '@/styles/manager_ga/campaign/progress/tags.module.css';
import channelIconStyles from '@/styles/manager_ga/campaign/progress/channel_icon.module.css';

interface CampaignTableProps {
  // Props는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 방법입니다
  // 현재는 props가 없지만, 추후 필터링된 데이터를 받을 수 있도록 구조를 유지합니다
  // 공통 컴포넌트를 사용하여 중복 코드를 제거했습니다
}

export default function CampaignTable({}: CampaignTableProps) {
  return (
    <CampaignTableCommon
      campaign_list={campaign_list}
      base_path="/manager_ga/campaign/progress"
      ReportModal={CampaignReportModal}
      styles={tableStyles}
      tagStyles={tagStyles}
      channelIconStyles={channelIconStyles}
    />
  );
}

