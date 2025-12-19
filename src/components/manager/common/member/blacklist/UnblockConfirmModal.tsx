/* ========================================
   🔓 차단 해제 확인 모달 컴포넌트 (공통)
   ======================================== */

/**
 * 차단 해제 확인 모달 컴포넌트 (공통)
 *
 * 목적: GA/SA 관리자 차단 내역 페이지에서 차단 해제 시 확인 모달을 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/member/blacklist (GA 관리자 차단 내역 페이지)
 * - /manager_sa/member/blacklist (SA 관리자 차단 내역 페이지)
 *
 * 주요 기능:
 * - A_M4 코드를 사용하여 모달 메시지 표시
 * - 취소/확인 버튼 제공
 * - 확인 시 차단 해제 처리
 *
 */

"use client";

import BaseModal from "@/components/common/modal/BaseModal";

interface UnblockConfirmModalProps {
  /** 모달 열림/닫힘 상태 */
  is_open: boolean;
  /** 모달 닫기 함수 */
  on_close: () => void;
  /** 차단 해제 확인 핸들러 */
  on_confirm: () => void;
}

/**
 * 차단 해제 확인 모달 컴포넌트
 */
export default function UnblockConfirmModal({
  is_open,
  on_close,
  on_confirm,
}: UnblockConfirmModalProps) {
  return (
    <BaseModal
      is_open={is_open}
      on_close={on_close}
      message="차단을 해제하시겠습니까?"
      buttons={["취소", "확인"]}
      on_confirm={on_confirm}
      type="center"
    />
  );
}
