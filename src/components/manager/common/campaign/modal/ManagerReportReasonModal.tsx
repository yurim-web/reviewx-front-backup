/* ========================================
   📋 신고 사유 모달 컴포넌트
   ======================================== */

/**
 * 신고 사유 모달 컴포넌트
 *
 * 📝 사용처:
 * - src/components/manager/common/campaign/progress/ProgressPageCommon.tsx
 * - src/components/manager/ga/campaign/rejected/section/RejectedCampaignTable.tsx
 */

"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@/styles/manager_ga/campaign/common/modal/campaign_report_modal.module.css";
import CommonTextarea from "@/components/common/textarea/CommonTextarea";

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

// 신고 코드 정보 데이터 (컴포넌트 내부에 직접 정의)
const report_code_info: ReportCodeInfo[] = [
  {
    code: "W001",
    category: "리뷰어",
    reason: "선정 후 취소",
  },
  {
    code: "W002",
    category: "리뷰어",
    reason: "지각 제출",
  },
  {
    code: "W003",
    category: "리뷰어",
    reason: "무단 이탈 · 노쇼",
  },
  {
    code: "W004",
    category: "리뷰어",
    reason: "노출 기간 불이행",
  },
  {
    code: "W005",
    category: "리뷰어",
    reason: "수정 요청 불이행",
  },
  {
    code: "W006",
    category: "파트너",
    reason: "게시 후 취소",
  },
  {
    code: "W007",
    category: "파트너",
    reason: "부적절한 캠페인 게시",
  },
  {
    code: "W008",
    category: "파트너",
    reason: "공정위 위반 요청",
  },
  {
    code: "W009",
    category: "시스템",
    reason: "비정상 요청 반복",
  },
  {
    code: "W010",
    category: "시스템",
    reason: "중복 계정 탐지",
  },
  {
    code: "W011",
    category: "시스템",
    reason: "콘텐츠 중복 탐지",
  },
  {
    code: "W012",
    category: "시스템",
    reason: "비정상 접근 기록",
  },
  {
    code: "W013",
    category: "기타",
    reason: "그외 비매너 행위",
  },
];

// ManagerReportReasonModal 컴포넌트의 props 타입 정의
export interface ManagerReportReasonModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  campaign_id?: string; // 신고할 캠페인 ID (옵션)
  on_report?: (report_code: ReportCode) => void; // 신고 완료 함수
  report_code_options: ReportCode[]; // 신고 코드 옵션 목록
}

export default function ManagerReportReasonModal({
  is_open,
  on_close,
  campaign_id,
  on_report,
  report_code_options,
}: ManagerReportReasonModalProps) {
  // useState: 선택된 신고 코드를 관리하는 React Hook
  // [상태값, 상태를 변경하는 함수] = useState(초기값)
  const [selected_report_code, set_selected_report_code] =
    useState<ReportCode | null>(null);

  // useState: 기타 비매너 행위 선택 시 입력할 텍스트를 관리하는 React Hook
  // W013 코드(그외 비매너 행위) 선택 시 textarea에 입력한 내용을 저장합니다
  const [textarea_value, set_textarea_value] = useState<string>("");

  // useState: textarea 에러 상태 관리
  // 확인 버튼을 클릭했을 때만 에러 상태가 true가 되고, 사용자가 입력을 시작하면 false로 리셋됩니다
  const [has_error, set_has_error] = useState<boolean>(false);

  // useRef: textarea 요소에 대한 참조
  // DOM 요소에 직접 접근하기 위해 사용합니다
  const textarea_ref = useRef<HTMLTextAreaElement>(null);

  // useEffect: 모달이 열릴 때마다 선택 상태를 초기화
  // useEffect는 컴포넌트가 렌더링된 후에 실행됩니다
  useEffect(() => {
    if (is_open) {
      // 모달이 열릴 때 첫 번째 신고 코드 옵션을 자동으로 선택합니다
      set_selected_report_code(report_code_options[0] || null);
      // textarea 입력값도 초기화합니다
      set_textarea_value("");
      // 에러 상태도 초기화합니다
      set_has_error(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is_open]);

  // 옵션 선택 핸들러
  // 라디오 버튼을 클릭했을 때 선택된 신고 코드를 업데이트합니다
  const handle_report_option_change = (code: ReportCode) => {
    set_selected_report_code(code);
  };

  // 신고 핸들러
  // "확인" 버튼을 클릭했을 때 선택된 신고 코드로 신고를 실행합니다
  const handle_report = () => {
    if (!selected_report_code) {
      return;
    }

    // 📌 W013(기타 비매너 행위) 선택 시 사유 입력 필수 검증
    if (selected_report_code === "W013" && !textarea_value.trim()) {
      // 사유가 입력되지 않았으면 에러 상태를 true로 설정하고 처리하지 않음
      set_has_error(true);
      return;
    }

    // 검증 통과 시 에러 상태를 false로 설정하고 처리 진행
    set_has_error(false);
    // on_report 함수가 전달되었으면 실행합니다
    // ?. (옵셔널 체이닝): 함수가 존재할 때만 호출합니다
    on_report?.(selected_report_code);
    on_close();
  };

  // textarea 변경 핸들러
  // 사용자가 입력을 시작하면 에러 상태를 false로 리셋합니다
  const handle_textarea_change = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    // 입력을 시작하면 에러 상태를 해제합니다
    if (has_error) {
      set_has_error(false);
    }
    set_textarea_value(value);
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
    <div className={styles.modal_overlay} onClick={handle_backdrop_click}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 제목 */}
        <h3 className={styles.modal_title}>신고 사유</h3>

        {/* 옵션 리스트 (세로 레이아웃) */}
        <div className={styles.options_list}>
          {/* 신고 코드 옵션 렌더링 */}
          {/* map(): 배열의 각 요소를 순회하며 JSX 요소를 생성합니다 */}
          {report_code_options.map((code) => {
            const code_info = get_code_info(code);
            return (
              <label key={code} className={styles.option_item}>
                {/* 라디오 버튼: 단일 선택만 가능 */}
                <input
                  type="radio"
                  name="report-reason"
                  value={code}
                  checked={selected_report_code === code}
                  onChange={() => handle_report_option_change(code)}
                  className={styles.option_radio}
                />
                <span className={styles.option_label}>
                  {code_info?.reason || code}
                </span>
              </label>
            );
          })}
        </div>

        {/* 기타 비매너 행위(W013) 선택 시 표시되는 textarea */}
        {/* 조건부 렌더링: selected_report_code가 "W013"일 때만 textarea를 표시합니다 */}
        {selected_report_code === "W013" && (
          <div style={{ marginTop: "16px" }}>
            <CommonTextarea
              ref={textarea_ref}
              value={textarea_value}
              onChange={handle_textarea_change}
              placeholder="신고 사유를 입력해주세요"
              rows={5}
              has_error={has_error && !textarea_value.trim()}
              stop_propagation={true}
            />
          </div>
        )}

        {/* 모달 푸터 */}
        <div className={styles.modal_footer}>
          {/* 취소 버튼 */}
          <button className={styles.close_button} onClick={on_close}>
            취소
          </button>
          {/* 확인 버튼 */}
          {/* 📌 에러 표시를 위해 버튼을 비활성화하지 않고, handle_report 내에서 검증합니다 */}
          <button className={styles.report_button} onClick={handle_report}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
