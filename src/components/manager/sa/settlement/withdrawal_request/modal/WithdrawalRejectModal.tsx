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
import TextareaModal from "@/components/common/modal/TextareaModal";

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

  // 확인 버튼 클릭 핸들러
  const handle_confirm = () => {
    on_confirm(reason);
  };

  return (
    <TextareaModal
      is_open={is_open}
      on_close={on_close}
      title="출금 요청 반려"
      titleColor="#ff2626"
      value={reason}
      onChange={set_reason}
      placeholder="반려 사유를 입력해 주세요."
      buttons={["닫기", "확인"]}
      on_cancel={on_close}
      on_confirm={handle_confirm}
      variant="default"
      has_error={true}
    />
  );
}
