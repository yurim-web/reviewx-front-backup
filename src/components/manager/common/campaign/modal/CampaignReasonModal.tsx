/* ========================================
   📋 캠페인 반려/신고 사유 모달 컴포넌트 (공통)
   ======================================== */

/**
 * 캠페인 반려/신고 사유 모달 컴포넌트 (공통)
 *
 * 목적: GA 관리자 반려내역 페이지와 신고내역 페이지에서
 *       반려 사유 또는 신고 사유를 확인하고 수정할 수 있는 모달입니다.
 *
 * 📍 사용 위치:
 * - 직접 사용 컴포넌트:
 *   - RejectedCampaignTable 컴포넌트의 사유 확인 버튼 클릭 시 (반려 내역 페이지)
 *   - ReportedCampaignTable 컴포넌트의 사유 확인 버튼 클릭 시 (신고 내역 페이지)
 *
 * - 최종 사용 페이지:
 *   - /manager_ga/campaign/rejected (GA 관리자 반려 내역 페이지)
 *   - /manager_ga/campaign/reported (GA 관리자 신고 내역 페이지)
 *
 * 사용 흐름:
 * 반려 내역 페이지 (/manager_ga/campaign/rejected)
 *   └─> RejectedCampaignTable 컴포넌트
 *       └─> CampaignReasonModal 컴포넌트 (사유 확인 버튼 클릭 시, mode="reject")
 *
 * 신고 내역 페이지 (/manager_ga/campaign/reported)
 *   └─> ReportedCampaignTable 컴포넌트
 *       └─> CampaignReasonModal 컴포넌트 (사유 확인 버튼 클릭 시, mode="report")
 *
 * 주요 기능:
 * - 반려/신고 사유 텍스트 표시 및 수정
 * - AI 추천 분류 태그 표시 및 선택 (라디오 버튼 방식)
 * - 반려/신고 사유 저장 기능
 * - 모달 오버레이 클릭으로 닫기
 *
 */

"use client";

import { useState, useEffect } from "react";

// 코드 정보 타입 정의 (반려/신고 공통)
export interface CodeInfo {
  code: string; // 반려 코드 또는 신고 코드
  category: string; // 카테고리
  reason: string; // 사유
}

// 모달 모드 타입 정의
export type ReasonModalMode = "reject" | "report";

// 반려 모드용 Props 타입
interface RejectModeProps {
  mode: "reject";
  // 반려 사유 텍스트
  reason_text: string;
  // 반려 코드
  code: string;
  // 반려 코드 정보 배열
  code_info_list: CodeInfo[];
  // 신고 모드에서는 사용하지 않음
  report_reason?: never;
  report_code?: never;
  report_code_info?: never;
}

// 신고 모드용 Props 타입
interface ReportModeProps {
  mode: "report";
  // 신고 사유 텍스트
  reason_text: string;
  // 신고 코드
  code: string;
  // 신고 코드 정보 배열
  code_info_list: CodeInfo[];
  // 반려 모드에서는 사용하지 않음
  reject_reason?: never;
  reject_code?: never;
  reject_code_info?: never;
}

// 공통 Props 타입
interface CommonProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // CSS 모듈 스타일 객체
  styles: Record<string, string> & {
    modal_overlay: string;
    modal_container: string;
    modal_title: string;
    reason_box: string; // reject_reason_box 또는 report_reason_box
    reason_text: string; // reject_reason_text 또는 report_reason_text
    ai_recommended_section: string;
    ai_recommended_label: string;
    classification_container: string;
    classification_item: string;
    classification_item_selected: string;
    classification_radio: string;
    classification_check_icon: string;
    classification_label: string;
    modal_footer: string;
    close_button: string;
    confirm_button: string;
  };
}

// Props 타입: 공통 Props + 모드별 Props
type CampaignReasonModalProps = CommonProps &
  (RejectModeProps | ReportModeProps);

export default function CampaignReasonModal({
  is_open,
  on_close,
  styles: cssStyles,
  ...modeProps
}: CampaignReasonModalProps) {
  // 선택된 AI 추천 분류 (라디오 버튼이므로 단일 값)
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // 컴포넌트가 리렌더링되어도 이 값이 유지됩니다
  const [selected_classification, set_selected_classification] = useState<
    string | null
  >(null);

  // 코드 정보 가져오기 (반려 코드 또는 신고 코드)
  // find 메서드는 배열에서 조건에 맞는 첫 번째 요소를 찾아 반환합니다
  const code_info = modeProps.code_info_list.find(
    (info) => info.code === modeProps.code
  );

  // 사유 텍스트 상태 관리
  // 초기값은 props로 받은 reason_text 또는 code_info의 reason을 사용
  // || 연산자는 왼쪽 값이 falsy이면 오른쪽 값을 사용합니다
  const [reason_text, set_reason_text] = useState<string>(
    modeProps.reason_text || code_info?.reason || get_default_message()
  );

  // 모달이 열릴 때마다 사유 텍스트 초기화
  // useEffect는 컴포넌트가 렌더링된 후에 실행되는 Hook입니다
  // 의존성 배열 [is_open, modeProps.reason_text, code_info?.reason]의 값이 변경될 때마다 실행됩니다
  useEffect(() => {
    if (is_open) {
      set_reason_text(
        modeProps.reason_text || code_info?.reason || get_default_message()
      );
      // 모달이 열릴 때 선택된 분류 초기화
      set_selected_classification(null);
    }
  }, [is_open, modeProps.reason_text, code_info?.reason]);

  // 모드에 따른 기본 메시지 반환 함수
  function get_default_message(): string {
    return modeProps.mode === "reject"
      ? "반려 사유가 없습니다."
      : "신고 사유가 없습니다.";
  }

  // 모드에 따른 placeholder 텍스트 반환 함수
  function get_placeholder(): string {
    return modeProps.mode === "reject"
      ? "반려 사유를 입력하세요"
      : "신고 사유를 입력하세요";
  }

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  // 조건부 렌더링: is_open이 false이면 null을 반환하여 아무것도 렌더링하지 않습니다
  if (!is_open) return null;

  // AI 추천 분류 태그 목록 (코드 정보에서 가져오기)
  // 같은 카테고리의 코드들을 태그로 표시
  // filter: 배열에서 조건에 맞는 요소만 필터링
  // map: 배열의 각 요소를 변환하여 새로운 배열 생성
  const ai_recommended_tags = modeProps.code_info_list
    .filter((info) => info.category === code_info?.category)
    .map((info) => info.reason);

  // AI 추천 분류 선택 핸들러 (라디오 버튼 방식)
  const handle_classification_change = (classification: string) => {
    set_selected_classification(classification);
    // 선택한 분류를 사유 텍스트에 자동으로 설정
    set_reason_text(classification);
  };

  // 사유 텍스트 변경 핸들러
  // React.ChangeEvent<HTMLTextAreaElement>는 textarea의 change 이벤트 타입입니다
  const handle_reason_change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // e.target.value는 textarea에 입력된 현재 값을 가져옵니다
    set_reason_text(e.target.value);
  };

  // 확인 버튼 클릭 핸들러
  const handle_confirm = () => {
    // TODO: 반려/신고 사유 확인 로직 구현
    // 여기에 실제 API 호출이나 상태 업데이트 로직을 추가할 수 있습니다
    on_close();
  };

  // 오버레이 클릭 핸들러
  // 모달 배경을 클릭하면 모달이 닫히도록 합니다
  const handle_overlay_click = (e: React.MouseEvent) => {
    // 이벤트가 발생한 요소가 오버레이 자체일 때만 닫기
    // e.target은 실제 클릭된 요소, e.currentTarget은 이벤트 핸들러가 등록된 요소입니다
    if (e.target === e.currentTarget) {
      on_close();
    }
  };

  // 모드에 따른 모달 제목 결정
  const modal_title = "콘텐츠 반려 사유";

  // textarea의 rows 수 결정 (반려 모드: 5, 신고 모드: 6)
  const textarea_rows = modeProps.mode === "reject" ? 5 : 6;

  return (
    <div className={cssStyles.modal_overlay} onClick={handle_overlay_click}>
      <div
        className={cssStyles.modal_container}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 제목 */}
        <h2 className={cssStyles.modal_title}>{modal_title}</h2>

        {/* 사유 텍스트 영역 (input 스타일) */}
        <div className={cssStyles.reason_box}>
          <textarea
            className={cssStyles.reason_text}
            value={reason_text}
            onChange={handle_reason_change}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            rows={textarea_rows}
            placeholder={get_placeholder()}
          />
        </div>

        {/* AI 추천 분류 섹션 */}
        <div className={cssStyles.ai_recommended_section}>
          <p className={cssStyles.ai_recommended_label}>AI 추천 분류</p>
          <div className={cssStyles.classification_container}>
            {/* map 메서드를 사용하여 태그 목록을 렌더링합니다 */}
            {ai_recommended_tags.map((tag) => {
              // 현재 태그가 선택되었는지 확인
              const is_selected = selected_classification === tag;
              return (
                <label
                  key={tag}
                  className={`${cssStyles.classification_item} ${
                    is_selected ? cssStyles.classification_item_selected : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`ai-classification-${modeProps.mode}`}
                    value={tag}
                    checked={is_selected}
                    onChange={() => handle_classification_change(tag)}
                    className={cssStyles.classification_radio}
                  />
                  {/* 조건부 렌더링: 선택된 경우에만 체크 아이콘 표시 */}
                  {is_selected && (
                    <img
                      src="/images/icons/red_check_icon.svg"
                      alt="선택됨"
                      className={cssStyles.classification_check_icon}
                    />
                  )}
                  <span className={cssStyles.classification_label}>{tag}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 모달 하단 버튼 영역 */}
        <div className={cssStyles.modal_footer}>
          <button className={cssStyles.close_button} onClick={on_close}>
            닫기
          </button>
          <button className={cssStyles.confirm_button} onClick={handle_confirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
