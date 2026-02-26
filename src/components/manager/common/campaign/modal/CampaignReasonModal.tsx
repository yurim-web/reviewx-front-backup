/* ========================================
   📋 반려/신고 사유 모달 컴포넌트
   ======================================== */
/* eslint-disable @next/next/no-img-element */

/**
 * 반려/신고 사유 모달 컴포넌트
 *
 * 📝 사용처:
 * - src/components/manager/ga/campaign/rejected/section/RejectedCampaignTable.tsx
 * - src/components/manager/ga/campaign/reported/section/ReportedCampaignTable.tsx
 */

"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@/styles/manager_ga/campaign/common/modal/campaign_reason_modal.module.css";

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
  // 확인 클릭 시 선택된 사유 저장 콜백 (저장 후 다시 열면 해당 분류가 선택된 상태로 복원)
  on_confirm?: (reason_text: string) => void;
}

// Props 타입: 공통 Props + 모드별 Props
type CampaignReasonModalProps = CommonProps & (RejectModeProps | ReportModeProps);

export default function CampaignReasonModal({
  is_open,
  on_close,
  on_confirm,
  ...modeProps
}: CampaignReasonModalProps) {
  // 코드 정보 가져오기 (반려 코드 또는 신고 코드)
  const code_info = modeProps.code_info_list.find((info) => info.code === modeProps.code);

  // 모달이 열릴 때 표시할 초기 사유·선택 분류 (첫 페인트에서 바로 사용해 잔상 방지)
  const get_initial_reason = () =>
    modeProps.reason_text || code_info?.reason || get_default_message();
  const get_initial_selected = () => {
    const initial_reason = get_initial_reason();
    const same_category_reasons = modeProps.code_info_list
      .filter((info) => info.category === code_info?.category)
      .map((info) => info.reason);
    return same_category_reasons.includes(initial_reason) ? initial_reason : null;
  };

  const [selected_classification, set_selected_classification] = useState<string | null>(null);
  const [reason_text, set_reason_text] = useState<string>(get_default_message());

  // 모달이 열릴 때 한 번만 동기화했는지 (닫을 때 리셋)
  const synced_for_open_ref = useRef(false);

  // 모달이 열릴 때마다 사유 텍스트·선택된 분류를 초기값으로 동기화 (state에 반영)
  useEffect(() => {
    if (is_open) {
      const initial_reason = get_initial_reason();
      set_reason_text(initial_reason);
      set_selected_classification(get_initial_selected());
      synced_for_open_ref.current = true;
    } else {
      synced_for_open_ref.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    is_open,
    modeProps.reason_text,
    code_info?.reason,
    code_info?.category,
    modeProps.code_info_list,
  ]);

  // 모달이 열려 있는데 아직 state가 동기화되기 전 첫 렌더: 표시만 초기값으로 해서 잔상 방지
  const display_reason_text =
    is_open && !synced_for_open_ref.current ? get_initial_reason() : reason_text;
  const display_selection =
    is_open && !synced_for_open_ref.current ? get_initial_selected() : selected_classification;

  // 모드에 따른 기본 메시지 반환 함수
  function get_default_message(): string {
    return modeProps.mode === "reject" ? "반려 사유가 없습니다." : "신고 사유가 없습니다.";
  }

  // 모드에 따른 placeholder 텍스트 반환 함수
  function get_placeholder(): string {
    return modeProps.mode === "reject" ? "반려 사유를 입력하세요" : "신고 사유를 입력하세요";
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

  // AI 추천 분류 선택 핸들러 (라디오 버튼 방식, 다시 눌러도 해제되지 않음)
  const handle_classification_change = (classification: string) => {
    set_selected_classification(classification);
    set_reason_text(classification);
  };

  // 사유 텍스트 변경 핸들러
  // React.ChangeEvent<HTMLTextAreaElement>는 textarea의 change 이벤트 타입입니다
  const handle_reason_change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // e.target.value는 textarea에 입력된 현재 값을 가져옵니다
    set_reason_text(e.target.value);
  };

  // 확인 버튼 클릭 핸들러 (선택된 사유 저장 후 닫기)
  const handle_confirm = () => {
    on_confirm?.(reason_text);
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
  const modal_title = "반려 사유";

  // textarea의 rows 수 결정 (반려 모드: 5, 신고 모드: 6)
  const textarea_rows = modeProps.mode === "reject" ? 5 : 6;

  return (
    <div className={styles.modal_overlay} onClick={handle_overlay_click}>
      <div className={styles.modal_container} onClick={(e) => e.stopPropagation()}>
        {/* 모달 제목 */}
        <h2 className={styles.modal_title}>{modal_title}</h2>

        {/* 사유 텍스트 영역 (input 스타일) */}
        <div className={styles.reason_box}>
          <textarea
            className={styles.reason_text}
            value={display_reason_text}
            onChange={handle_reason_change}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            rows={textarea_rows}
            placeholder={get_placeholder()}
            readOnly
          />
        </div>

        {/* AI 추천 분류 섹션 */}
        <div className={styles.ai_recommended_section}>
          <p className={styles.ai_recommended_label}>AI 추천 분류</p>
          <div className={styles.classification_container}>
            {/* map 메서드를 사용하여 태그 목록을 렌더링합니다 */}
            {ai_recommended_tags.map((tag) => {
              // 현재 태그가 선택되었는지 확인 (첫 페인트는 display_selection으로 잔상 방지)
              const is_selected = display_selection === tag;
              return (
                <label
                  key={tag}
                  className={`${styles.classification_item} ${
                    is_selected ? styles.classification_item_selected : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`ai-classification-${modeProps.mode}`}
                    value={tag}
                    checked={is_selected}
                    onChange={() => handle_classification_change(tag)}
                    className={styles.classification_radio}
                  />
                  {/* 조건부 렌더링: 선택된 경우에만 체크 아이콘 표시 */}
                  {is_selected && (
                    <img
                      src="/images/icons/red_check_icon.svg"
                      alt="선택됨"
                      className={styles.classification_check_icon}
                    />
                  )}
                  <span className={styles.classification_label}>{tag}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 모달 하단 버튼 영역 */}
        <div className={styles.modal_footer}>
          <button className={styles.close_button} onClick={on_close}>
            닫기
          </button>
          <button className={styles.confirm_button} onClick={handle_confirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
