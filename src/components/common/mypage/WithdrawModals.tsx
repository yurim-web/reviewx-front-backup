/* ========================================
   🚪 회원 탈퇴 모달 그룹 컴포넌트
   ======================================== */

/**
 * 회원 탈퇴 모달 그룹 컴포넌트
 *
 * 목적: 회원 탈퇴 관련 3가지 모달을 하나의 컴포넌트로 통합
 *
 * 사용 페이지:
 * - /user/mypage/edit
 * - /partner/mypage/edit
 */

import BaseModal from "@/components/common/modal/BaseModal";

interface WithdrawModalsProps {
  /** 탈퇴 차단 모달 열림 상태 */
  isWithdrawBlockedModalOpen: boolean;
  /** 탈퇴 확인 모달 열림 상태 */
  isWithdrawConfirmModalOpen: boolean;
  /** 탈퇴 완료 모달 열림 상태 */
  isWithdrawCompleteModalOpen: boolean;
  /** 탈퇴 차단 모달 닫기 */
  onBlockedClose: () => void;
  /** 탈퇴 확인 모달 닫기 */
  onConfirmClose: () => void;
  /** 탈퇴 확인 */
  onWithdrawConfirm: () => void;
  /** 탈퇴 완료 */
  onWithdrawComplete: () => void;
  /** 탈퇴 버튼 variant (선택적, 기본값: undefined) */
  buttonVariant?: "red";
}

/**
 * 회원 탈퇴 모달 그룹 컴포넌트
 *
 * 3가지 모달을 포함:
 * 1. 탈퇴 차단 모달: 진행 중인 캠페인이 있을 때
 * 2. 탈퇴 확인 모달: 탈퇴 의사 재확인
 * 3. 탈퇴 완료 모달: 탈퇴 완료 안내
 */
export default function WithdrawModals({
  isWithdrawBlockedModalOpen,
  isWithdrawConfirmModalOpen,
  isWithdrawCompleteModalOpen,
  onBlockedClose,
  onConfirmClose,
  onWithdrawConfirm,
  onWithdrawComplete,
  buttonVariant,
}: WithdrawModalsProps) {
  return (
    <>
      {/* 탈퇴 차단 모달 */}
      <BaseModal
        is_open={isWithdrawBlockedModalOpen}
        on_close={onBlockedClose}
        message="진행 중인 캠페인이 있을 경우<br>탈퇴가 불가합니다.<br>먼저 캠페인을 완료해 주세요."
        buttons={["닫기"]}
        type="center"
      />

      {/* 회원 탈퇴 확인 모달 */}
      <BaseModal
        is_open={isWithdrawConfirmModalOpen}
        on_close={onConfirmClose}
        message='탈퇴 시 진행한 캠페인 기록과<br>포인트가 모두 삭제되며, 재가입이 불가합니다.<br><span style="color: #FF2626;">정말 탈퇴하시겠습니까?</span>'
        buttons={["취소", "탈퇴"]}
        on_confirm={onWithdrawConfirm}
        type="center"
        button_variant={buttonVariant}
      />

      {/* 회원 탈퇴 완료 모달 */}
      <BaseModal
        is_open={isWithdrawCompleteModalOpen}
        on_close={onWithdrawComplete}
        message="탈퇴가 완료되었습니다.<br>그동안 리뷰엑스를 이용해 주셔서 감사합니다."
        buttons={["닫기"]}
        on_confirm={onWithdrawComplete}
        type="center"
      />
    </>
  );
}
