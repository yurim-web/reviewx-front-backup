/* ========================================
   📋 캠페인 신고/차단 모달 컴포넌트 (공통)
   ======================================== */

/**
 * 캠페인 신고/차단 모달 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 진행 현황 페이지, 반려 내역 페이지, 신고 내역 페이지에서
 *       캠페인을 신고하거나 차단하는 모달입니다.
 *
 * 📍 사용 위치:
 * - 직접 사용 컴포넌트:
 *   - CampaignTable 컴포넌트의 신고 아이콘 클릭 시 (진행 현황 페이지)
 *   - RejectedCampaignTable 컴포넌트의 신고 아이콘 클릭 시 (반려 내역 페이지)
 *   - ReportedCampaignTable 컴포넌트의 차단 아이콘 클릭 시 (신고 내역 페이지)
 *
 * - 최종 사용 페이지:
 *   - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 *   - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 *   - /manager_ga/campaign/rejected (GA 관리자 반려 내역 페이지)
 *   - /manager_ga/campaign/reported (GA 관리자 신고 내역 페이지)
 *
 * 사용 흐름:
 * 진행 현황 페이지 (/manager_ga/campaign/progress, /manager_sa/campaign/progress)
 *   └─> ProgressPageCommon 컴포넌트
 *       └─> CampaignTable 컴포넌트
 *           └─> CampaignReportModal 컴포넌트 (신고 아이콘 클릭 시, mode="report")
 *
 * 반려 내역 페이지 (/manager_ga/campaign/rejected)
 *   └─> RejectedCampaignTable 컴포넌트
 *       └─> CampaignReportModal 컴포넌트 (신고 아이콘 클릭 시, mode="report")
 *
 * 신고 내역 페이지 (/manager_ga/campaign/reported)
 *   └─> ReportedCampaignTable 컴포넌트
 *       └─> CampaignReportModal 컴포넌트 (차단 아이콘 클릭 시, mode="block")
 *
 * 주요 기능:
 * - 라디오 버튼 방식의 단일 선택 사유 선택
 * - 신고 모드: 신고 코드 옵션 (W001 ~ W013) 사용
 * - 차단 모드: 차단 사유 문자열 배열 사용
 * - 신고/차단/닫기 기능
 * - 모달 오버레이 클릭으로 닫기
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

// 모달 모드 타입 정의
export type ModalMode = "report" | "block";

// 신고 모드용 Props 타입
interface ReportModeProps {
  mode: "report";
  on_report?: (report_code: ReportCode) => void; // 신고 완료 함수
  report_code_info: ReportCodeInfo[]; // 신고 코드 정보 데이터
  report_code_options: ReportCode[]; // 신고 코드 옵션 목록
  block_reason_options?: never; // 차단 모드에서는 사용하지 않음
  on_block?: never; // 차단 모드에서만 사용
}

// 차단 모드용 Props 타입
interface BlockModeProps {
  mode: "block";
  on_block?: (block_reason: string) => void; // 차단 완료 함수
  block_reason_options: string[]; // 차단 사유 옵션 목록
  on_report?: never; // 신고 모드에서만 사용
  report_code_info?: never; // 신고 모드에서만 사용
  report_code_options?: never; // 신고 모드에서만 사용
}

// 공통 Props 타입
interface CommonProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  campaign_id?: string; // 신고/차단할 캠페인 ID (옵션)
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
    block_button: string; // 차단 모드에서 사용
  };
}

// Props 타입: 공통 Props + 모드별 Props
type CampaignReportModalProps = CommonProps &
  (ReportModeProps | BlockModeProps);

export default function CampaignReportModal({
  is_open,
  on_close,
  campaign_id,
  styles: cssStyles,
  ...modeProps
}: CampaignReportModalProps) {
  // 모드에 따라 다른 타입의 선택 상태 관리
  // 신고 모드: ReportCode 타입
  // 차단 모드: string 타입
  const [selected_report_code, set_selected_report_code] =
    useState<ReportCode | null>(null);
  const [selected_block_reason, set_selected_block_reason] = useState<
    string | null
  >(null);

  // 모달이 열릴 때마다 선택 상태를 초기화
  useEffect(() => {
    if (is_open) {
      if (modeProps.mode === "report") {
        // 신고 모드: 첫 번째 신고 코드 옵션 선택
        set_selected_report_code(modeProps.report_code_options[0] || null);
      } else {
        // 차단 모드: 첫 번째 차단 사유 옵션 선택
        set_selected_block_reason(modeProps.block_reason_options[0] || null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is_open]);

  // 옵션 선택 핸들러 (신고 모드)
  const handle_report_option_change = (code: ReportCode) => {
    set_selected_report_code(code);
  };

  // 옵션 선택 핸들러 (차단 모드)
  const handle_block_option_change = (reason: string) => {
    set_selected_block_reason(reason);
  };

  // 신고 핸들러
  const handle_report = () => {
    if (modeProps.mode === "report" && selected_report_code) {
      modeProps.on_report?.(selected_report_code);
      on_close();
      // TODO: 실제 신고 로직 구현
    }
  };

  // 차단 핸들러
  const handle_block = () => {
    if (modeProps.mode === "block" && selected_block_reason) {
      modeProps.on_block?.(selected_block_reason);
      on_close();
      // TODO: 실제 차단 로직 구현
    }
  };

  // 모달 오버레이 클릭 핸들러
  const handle_backdrop_click = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      on_close();
    }
  };

  // 신고 코드 정보 가져오기 (신고 모드에서만 사용)
  const get_code_info = (code: ReportCode) => {
    if (modeProps.mode === "report") {
      return modeProps.report_code_info.find((info) => info.code === code);
    }
    return undefined;
  };

  // 모드에 따른 UI 텍스트 및 스타일 결정
  const modal_title =
    modeProps.mode === "report" ? "캠페인 신고" : "콘텐츠 차단";
  const submit_button_text = modeProps.mode === "report" ? "신고" : "차단";
  const submit_button_class =
    modeProps.mode === "report"
      ? cssStyles.report_button
      : cssStyles.block_button;
  const is_submit_disabled =
    modeProps.mode === "report"
      ? !selected_report_code
      : !selected_block_reason;
  const radio_name =
    modeProps.mode === "report" ? "report-reason" : "block-reason";

  if (!is_open) return null;

  return (
    <div className={cssStyles.modal_overlay} onClick={handle_backdrop_click}>
      <div
        className={cssStyles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 제목 */}
        <h3 className={cssStyles.modal_title}>{modal_title}</h3>

        {/* 옵션 리스트 (세로 레이아웃) */}
        <div className={cssStyles.options_list}>
          {modeProps.mode === "report"
            ? // 신고 모드: 신고 코드 옵션 렌더링
              modeProps.report_code_options.map((code) => {
                const code_info = get_code_info(code);
                return (
                  <label key={code} className={cssStyles.option_item}>
                    <input
                      type="radio"
                      name={radio_name}
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
              })
            : // 차단 모드: 차단 사유 옵션 렌더링
              modeProps.block_reason_options.map((reason) => {
                return (
                  <label key={reason} className={cssStyles.option_item}>
                    <input
                      type="radio"
                      name={radio_name}
                      value={reason}
                      checked={selected_block_reason === reason}
                      onChange={() => handle_block_option_change(reason)}
                      className={cssStyles.option_radio}
                    />
                    <span className={cssStyles.option_label}>{reason}</span>
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
            className={submit_button_class}
            onClick={modeProps.mode === "report" ? handle_report : handle_block}
            disabled={is_submit_disabled}
          >
            {submit_button_text}
          </button>
        </div>
      </div>
    </div>
  );
}
