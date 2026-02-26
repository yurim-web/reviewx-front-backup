/* ========================================
   이용 제한 사유 모달 컴포넌트
   ======================================== */

/**
 * ManagerRestrictionModal
 *
 * 목적: 관리자가 회원 이용 제한 사유를 확인·처리하는 모달
 *
 * 사용 페이지:
 * - /manager_ga/campaign/reported (신고 내역)
 * - /manager_ga/member, /manager_sa/member (회원 관리)
 */

"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@/styles/manager_ga/campaign/common/modal/campaign_report_modal.module.css";
import BaseModal from "@/components/common/modal/BaseModal";

// 이용 제한 사유 옵션 목록 (컴포넌트 내부에 직접 정의)
const block_reason_options: string[] = [
  "반복 반려 누적",
  "반복 취소 누적",
  "무단 이탈 · 노쇼 누적",
  "공정위 위반 게시 요청 누적",
  "콘텐츠 도용 · 중복",
  "부적절 캠페인 게시",
  "비정상 요청 · 접근",
  "외부 결제 · 금전 요구",
  "비매너 행위",
];

// ManagerRestrictionModal 컴포넌트의 props 타입 정의
export interface ManagerRestrictionModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  campaign_id?: string; // 이용 제한할 캠페인 ID (옵션)
  on_block?: (restriction_reason: string) => void; // 이용 제한 완료 함수
}

export default function ManagerRestrictionModal({
  is_open,
  on_close,
  campaign_id: _campaign_id,
  on_block,
}: ManagerRestrictionModalProps) {
  const [selected_block_reason, set_selected_block_reason] = useState<string | null>(null);
  const [show_completion_modal, set_show_completion_modal] = useState(false);
  const pending_restriction_reason_ref = useRef<string | null>(null);

  useEffect(() => {
    if (is_open) {
      set_selected_block_reason(null);
      set_show_completion_modal(false);
    }
  }, [is_open]);

  // 옵션 선택 핸들러
  // 라디오 버튼을 클릭했을 때 선택된 이용 제한 사유를 업데이트합니다
  const handle_block_option_change = (reason: string) => {
    set_selected_block_reason(reason);
  };

  // 확인 클릭: 완료 모달만 표시 (실제 적용은 닫기 시)
  const handle_block = () => {
    if (!selected_block_reason) return;
    pending_restriction_reason_ref.current = selected_block_reason;
    set_show_completion_modal(true);
  };

  // 완료 모달 "닫기" 클릭 시: 이용 제한 적용(on_block) 후 모달 닫기
  const handle_completion_close = () => {
    const reason = pending_restriction_reason_ref.current;
    if (reason) {
      on_block?.(reason);
      pending_restriction_reason_ref.current = null;
    }
    set_show_completion_modal(false);
    on_close();
  };

  // 모달 오버레이 클릭 핸들러
  // 모달 배경(오버레이)을 클릭했을 때 모달을 닫습니다
  const handle_backdrop_click = (e: React.MouseEvent) => {
    // e.target: 클릭한 요소
    // e.currentTarget: 이벤트 핸들러가 등록된 요소 (오버레이)
    // 오버레이를 직접 클릭했을 때만 닫기 (내부 콘텐츠 클릭 시에는 닫지 않음)
    if (e.target === e.currentTarget) {
      on_close();
    }
  };

  if (!is_open) return null;

  // 이용 제한 완료 시: 이용 제한 사유 모달은 숨기고 완료 안내 모달만 표시 (중첩 방지)
  if (show_completion_modal) {
    return (
      <BaseModal
        is_open={true}
        on_close={handle_completion_close}
        message="이용 제한이 완료되었습니다."
        buttons={["닫기"]}
      />
    );
  }

  return (
    <div className={styles.modal_overlay} onClick={handle_backdrop_click}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        {/* 모달 제목 */}
        <h3 className={styles.modal_title}>이용 제한 사유</h3>

        {/* 옵션 리스트 (세로 레이아웃) */}
        <div className={styles.options_list}>
          {/* 이용 제한 사유 옵션 렌더링 */}
          {/* map(): 배열의 각 요소를 순회하며 JSX 요소를 생성합니다 */}
          {block_reason_options.map((reason) => {
            return (
              <label key={reason} className={styles.option_item}>
                {/* 라디오 버튼: 단일 선택만 가능 */}
                <input
                  type="radio"
                  name="block-reason"
                  value={reason}
                  checked={selected_block_reason === reason}
                  onChange={() => handle_block_option_change(reason)}
                  className={styles.option_radio}
                />
                <span className={styles.option_label}>{reason}</span>
              </label>
            );
          })}
        </div>

        {/* 모달 푸터 */}
        <div className={styles.modal_footer}>
          {/* 취소 버튼 */}
          <button className={styles.close_button} onClick={on_close}>
            취소
          </button>
          {/* 확인 버튼 */}
          <button
            className={styles.block_button}
            onClick={handle_block}
            disabled={!selected_block_reason}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
