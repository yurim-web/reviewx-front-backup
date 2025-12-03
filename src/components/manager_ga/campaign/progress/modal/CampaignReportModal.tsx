/* ========================================
   📋 캠페인 신고 모달 컴포넌트 (래퍼)
   ======================================== */

/**
 * 캠페인 신고 모달 컴포넌트 (래퍼)
 *
 * 목적: GA 관리자 진행 현황 페이지에서 공통 CampaignReportModal을 사용합니다.
 *       스타일과 데이터를 전달하여 manager_ga에 맞게 렌더링합니다.
 *
 * 사용 위치:
 * - CampaignTable 컴포넌트의 신고 아이콘 클릭 시
 * - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 *
 */

import CampaignReportModalCommon, {
  type ReportCode,
} from '@/components/manager_common/campaign/progress/modal/CampaignReportModal';
import styles from '@/styles/manager_ga/campaign/progress/campaign_report_modal.module.css';
import {
  report_code_info,
  type ReportCode as ReportCodeType,
} from '@/data/manager_ga/reported';

// 타입 재내보내기 (하위 호환성)
export type { ReportCode };

interface CampaignReportModalProps {
  is_open: boolean;
  on_close: () => void;
  campaign_id?: string;
  on_report?: (report_code: ReportCodeType) => void;
}

// 신고 코드 필터 옵션 (이미지에 표시된 옵션만)
const report_code_options: ReportCodeType[] = [
  'W001', // 선정 후 취소
  'W002', // 지각 제출
  'W003', // 무단 이탈 · 노쇼
  'W004', // 노출 기간 불이행
  'W005', // 수정 요청 불이행
  'W006', // 게시 후 취소
  'W007', // 부적절한 캠페인 게시
  'W009', // 비정상 요청 반복
  'W010', // 중복 계정 탐지
  'W011', // 콘텐츠 중복 탐지
  'W013', // 기타 비매너 행위
];

export default function CampaignReportModal({
  is_open,
  on_close,
  campaign_id,
  on_report,
}: CampaignReportModalProps) {
  return (
    <CampaignReportModalCommon
      is_open={is_open}
      on_close={on_close}
      campaign_id={campaign_id}
      on_report={on_report}
      styles={
        styles as {
          modal_overlay: string;
          modal_content: string;
          modal_title: string;
          options_list: string;
          option_item: string;
          option_radio: string;
          option_label: string;
          modal_footer: string;
          close_button: string;
          report_button: string;
        }
      }
      report_code_info={report_code_info}
      report_code_options={report_code_options}
    />
  );
}
