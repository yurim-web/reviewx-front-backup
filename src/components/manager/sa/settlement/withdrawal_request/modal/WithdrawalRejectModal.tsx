/* ========================================
   📋 출금 요청 반려 모달 컴포넌트
   ======================================== */

/**
 * 출금 요청 반려 모달 컴포넌트
 *
 * 목적: 출금 요청을 반려할 때 반려 사유를 입력하도록 하는 모달입니다.
 *
 * 📍 사용 위치:
 * - RequestTable 컴포넌트의 반려 버튼 클릭 시
 *
 * - 최종 사용 페이지:
 *   - /manager_sa/settlement/withdrawal_request (SA 관리자 출금 요청 페이지)
 *
 * 주요 기능:
 * - 반려 사유 텍스트 입력
 * - 모달 오버레이 클릭으로 닫기
 */

"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/manager_sa/settlement/withdrawal_request/modal/withdrawal_reject_modal.module.css";

/**
 * WithdrawalRejectModal 컴포넌트 Props 인터페이스
 */
interface WithdrawalRejectModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 반려 확정 함수
  on_confirm: (reason: string) => void;
}

export default function WithdrawalRejectModal({
  is_open,
  on_close,
  on_confirm,
}: WithdrawalRejectModalProps) {
  // 반려 사유 텍스트 상태 관리
  const [reason, set_reason] = useState<string>("");

  // 모달이 열릴 때마다 사유 텍스트 초기화
  useEffect(() => {
    if (is_open) {
      set_reason("");
    }
  }, [is_open]);

  // 사유 텍스트 변경 핸들러
  const handle_reason_change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    set_reason(e.target.value);
  };

  // 확인 버튼 클릭 핸들러
  const handle_confirm = () => {
    on_confirm(reason);
  };

  // 오버레이 클릭 핸들러
  const handle_overlay_click = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      on_close();
    }
  };

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!is_open) return null;

  return (
    <div className={styles.modal_overlay} onClick={handle_overlay_click}>
      <div
        className={styles.modal_container}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 제목 */}
        <h2 className={styles.modal_title}>출금 요청 반려</h2>

        {/* 사유 입력 영역 */}
        <div className={styles.reason_box}>
          <textarea
            className={styles.reason_text}
            value={reason}
            onChange={handle_reason_change}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            placeholder="반려 사유를 입력해 주세요."
            rows={5}
          />
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
