/* ========================================
   📋 캠페인 신고 모달 컴포넌트 (공통)
   ======================================== */

/**
 * 캠페인 신고 모달 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 진행 현황 페이지에서 캠페인을 신고하는 모달입니다.
 *
 * 📍 사용 위치:
 * - CampaignTable 컴포넌트의 신고 아이콘 클릭 시
 * - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 * - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 *
 * 주요 기능:
 * - 라디오 버튼 방식의 단일 선택 신고 사유 선택
 * - 신고 코드 옵션: W001 ~ W013
 * - 신고/닫기 기능
 * - 모달 오버레이 클릭으로 닫기
 *
 */

'use client';

import { useState, useEffect } from 'react';

// 신고 코드 타입 정의
export type ReportCode =
  | 'W001'
  | 'W002'
  | 'W003'
  | 'W004'
  | 'W005'
  | 'W006'
  | 'W007'
  | 'W008'
  | 'W009'
  | 'W010'
  | 'W011'
  | 'W012'
  | 'W013';

// 신고 코드 정보 타입 정의
export interface ReportCodeInfo {
  code: ReportCode;
  category: string;
  reason: string;
}

interface CampaignReportModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  campaign_id?: string; // 신고할 캠페인 ID (옵션)
  on_report?: (report_code: ReportCode) => void; // 신고 완료 함수
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
  // 신고 코드 정보 데이터
  report_code_info: ReportCodeInfo[];
  // 신고 코드 옵션 목록
  report_code_options: ReportCode[];
}

export default function CampaignReportModal({
  is_open,
  on_close,
  campaign_id,
  on_report,
  styles: cssStyles,
  report_code_info,
  report_code_options,
}: CampaignReportModalProps) {
  // 선택된 신고 코드 (라디오 버튼이므로 단일 값)
  const [selected_code, set_selected_code] = useState<ReportCode | null>(null);

  // 모달이 열릴 때마다 선택 상태를 초기화
  useEffect(() => {
    if (is_open) {
      // 기본값으로 첫 번째 옵션 선택
      set_selected_code(report_code_options[0] || null);
    }
  }, [is_open, report_code_options]);

  // 옵션 선택 핸들러
  const handle_option_change = (code: ReportCode) => {
    set_selected_code(code);
  };

  // 신고 핸들러
  const handle_report = () => {
    if (selected_code) {
      on_report?.(selected_code);
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
        <h3 className={cssStyles.modal_title}>콘텐츠 신고</h3>

        {/* 옵션 리스트 (세로 레이아웃) */}
        <div className={cssStyles.options_list}>
          {report_code_options.map((code) => {
            const code_info = get_code_info(code);
            return (
              <label key={code} className={cssStyles.option_item}>
                <input
                  type="radio"
                  name="report-reason"
                  value={code}
                  checked={selected_code === code}
                  onChange={() => handle_option_change(code)}
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
          <button className={cssStyles.close_button} onClick={on_close}>
            닫기
          </button>
          <button
            className={cssStyles.report_button}
            onClick={handle_report}
            disabled={!selected_code}
          >
            신고
          </button>
        </div>
      </div>
    </div>
  );
}
