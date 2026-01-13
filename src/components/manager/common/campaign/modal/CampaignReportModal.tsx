/* ========================================
   📋 캠페인 신고 모달 컴포넌트
   ======================================== */

/**
 * 캠페인 신고 모달 컴포넌트
 *
 * 목적: GA/SA 관리자 진행 현황 페이지, 반려 내역 페이지에서
 *       캠페인을 신고하는 모달입니다.
 *
 * 📍 사용 위치:
 * - 직접 사용 컴포넌트:
 *   - CampaignTable 컴포넌트의 신고 아이콘 클릭 시 (진행 현황 페이지)
 *   - RejectedCampaignTable 컴포넌트의 신고 아이콘 클릭 시 (반려 내역 페이지)
 *
 * - 최종 사용 페이지:
 *   - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 *   - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 *   - /manager_ga/campaign/rejected (GA 관리자 반려 내역 페이지)
 *
 * 사용 흐름:
 * 진행 현황 페이지 (/manager_ga/campaign/progress, /manager_sa/campaign/progress)
 *   └─> ProgressPageCommon 컴포넌트
 *       └─> CampaignTable 컴포넌트
 *           └─> CampaignReportModal 컴포넌트 (신고 아이콘 클릭 시)
 *
 * 반려 내역 페이지 (/manager_ga/campaign/rejected)
 *   └─> RejectedCampaignTable 컴포넌트
 *       └─> CampaignReportModal 컴포넌트 (신고 아이콘 클릭 시)
 *
 * 주요 기능:
 * - 라디오 버튼 방식의 단일 선택 사유 선택
 * - 신고 코드 옵션 (W001 ~ W013) 사용
 * - 신고/닫기 기능
 * - 모달 오버레이 클릭으로 닫기
 *
 * 📝 사용처:
 * - src/components/manager/common/campaign/progress/ProgressPageCommon.tsx
 *   (진행 현황 페이지 공통 컴포넌트에서 신고 모달로 사용)
 * - src/components/manager/ga/campaign/rejected/section/RejectedCampaignTable.tsx
 *   (반려 내역 테이블 컴포넌트에서 신고 모달로 사용)
 *
 */

"use client";

import { useState, useEffect } from "react";

// 신고 코드 타입 정의
export type ReportCode =
  | "W001"
  | "W002"
  | "W003"
  | "W004"
  | "W005"
  | "W006"
  | "W007"
  | "W008"
  | "W009"
  | "W010"
  | "W011"
  | "W012"
  | "W013";

// 신고 코드 정보 타입 정의
export interface ReportCodeInfo {
  code: ReportCode;
  category: string;
  reason: string;
}

// CampaignReportModal 컴포넌트의 props 타입 정의
export interface CampaignReportModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  campaign_id?: string; // 신고할 캠페인 ID (옵션)
  on_report?: (report_code: ReportCode) => void; // 신고 완료 함수
  report_code_info: ReportCodeInfo[]; // 신고 코드 정보 데이터
  report_code_options: ReportCode[]; // 신고 코드 옵션 목록
  // CSS 모듈 스타일 객체
  styles: Record<string, string> & {
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
  };
}

export default function CampaignReportModal({
  is_open,
  on_close,
  campaign_id,
  on_report,
  report_code_info,
  report_code_options,
  styles: cssStyles,
}: CampaignReportModalProps) {
  // useState: 선택된 신고 코드를 관리하는 React Hook
  // [상태값, 상태를 변경하는 함수] = useState(초기값)
  const [selected_report_code, set_selected_report_code] =
    useState<ReportCode | null>(null);

  // useEffect: 모달이 열릴 때마다 선택 상태를 초기화
  // useEffect는 컴포넌트가 렌더링된 후에 실행됩니다
  useEffect(() => {
    if (is_open) {
      // 모달이 열릴 때 첫 번째 신고 코드 옵션을 자동으로 선택합니다
      set_selected_report_code(report_code_options[0] || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is_open]);

  // 옵션 선택 핸들러
  // 라디오 버튼을 클릭했을 때 선택된 신고 코드를 업데이트합니다
  const handle_report_option_change = (code: ReportCode) => {
    set_selected_report_code(code);
  };

  // 신고 핸들러
  // "신고" 버튼을 클릭했을 때 선택된 신고 코드로 신고를 실행합니다
  const handle_report = () => {
    if (selected_report_code) {
      // on_report 함수가 전달되었으면 실행합니다
      // ?. (옵셔널 체이닝): 함수가 존재할 때만 호출합니다
      on_report?.(selected_report_code);
      on_close();
      // TODO: 실제 신고 로직 구현
    }
  };

  // 모달 오버레이 클릭 핸들러
  const handle_backdrop_click = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      on_close();
    }
  };

  // 신고 코드 정보 가져오기
  // 신고 코드에 해당하는 정보(카테고리, 사유)를 찾아 반환합니다
  const get_code_info = (code: ReportCode) => {
    return report_code_info.find((info) => info.code === code);
  };

  if (!is_open) return null;

  return (
    <div className={cssStyles.modal_overlay} onClick={handle_backdrop_click}>
      <div
        className={cssStyles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 제목 */}
        <h3 className={cssStyles.modal_title}>캠페인 신고</h3>

        {/* 옵션 리스트 (세로 레이아웃) */}
        <div className={cssStyles.options_list}>
          {/* 신고 코드 옵션 렌더링 */}
          {/* map(): 배열의 각 요소를 순회하며 JSX 요소를 생성합니다 */}
          {report_code_options.map((code) => {
            const code_info = get_code_info(code);
            return (
              <label key={code} className={cssStyles.option_item}>
                {/* 라디오 버튼: 단일 선택만 가능 */}
                <input
                  type="radio"
                  name="report-reason"
                  value={code}
                  checked={selected_report_code === code}
                  onChange={() => handle_report_option_change(code)}
                  className={cssStyles.option_radio}
                />
                <span className={cssStyles.option_label}>
                  {code_info?.reason || code}
                </span>
              </label>
            );
          })}
        </div>

        {/* 모달 푸터 */}
        <div className={cssStyles.modal_footer}>
          {/* 닫기 버튼 */}
          <button className={cssStyles.close_button} onClick={on_close}>
            닫기
          </button>
          {/* 신고 버튼 */}
          <button
            className={cssStyles.report_button}
            onClick={handle_report}
            disabled={!selected_report_code}
          >
            신고
          </button>
        </div>
      </div>
    </div>
  );
}
