/* ========================================
   📋 캠페인 신고 모달 컴포넌트 (래퍼)
   ======================================== */

/**
 * 캠페인 신고 모달 컴포넌트 (래퍼)
 *
 * 목적: GA 관리자 진행 상황 페이지에서 공통 CampaignReportModal을 사용합니다.
 *       스타일과 데이터를 전달하여 manager_ga에 맞게 렌더링합니다.
 *
 * 사용 위치:
 * - CampaignTable 컴포넌트에서 신고 버튼 클릭 시
 * - /manager_ga/campaign/progress (GA 관리자 진행 상황 페이지)
 *
 */

import CampaignReportModalCommon, {
  type ReportCode,
} from '@/components/manager/common/campaign/progress/modal/CampaignReportModal';
import styles from '@/styles/manager_ga/campaign/progress/campaign_report_modal.module.css';
import {
  report_code_info,
  type ReportCode as ReportCodeType,
} from '@/data/manager_ga/reported';

// 타입 재내보내기 (재사용을 위해)
export type { ReportCode };

interface CampaignReportModalProps {
  is_open: boolean;
  on_close: () => void;
  campaign_id?: string;
  on_report?: (report_code: ReportCodeType) => void;
}

// 신고 코드 옵션 섹션 (드롭다지에서 표시할 섹션)
const report_code_options: ReportCodeType[] = [
  'W001', // 예정 취소
  'W002', // 지급 출출
  'W003', // 무단 탈퇴 · 차단
  'W004', // 출출 기간 불이행
  'W005', // 예정 신청 불이행
  'W006', // 게시 취소
  'W007', // 부적절한 캠페인 게시
  'W009', // 비정상적 신청 반복
  'W010', // 중복 계정 사용
  'W011', // 콘텐츠 중복 사용
  'W013', // 기타 비매너 위반
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
