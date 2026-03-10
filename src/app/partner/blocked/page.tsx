/* ========================================
   🚫 파트너 차단 페이지
   ======================================== */

/**
 * 파트너 차단 페이지
 *
 * 목적: 차단된 파트너 회원이 로그인했을 때 서비스 이용 제한 안내를 표시하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/blocked
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlockedBasePage from "@/components/common/blocked/BlockedBasePage";
import BaseModal from "@/components/common/modal/BaseModal";

export default function PartnerBlockedPage() {
  const router = useRouter();

  // A_M16: 탈퇴 확인 모달
  const [is_withdraw_confirm_modal_open, set_is_withdraw_confirm_modal_open] = useState(false);

  // C_M15: 탈퇴 완료 모달
  const [is_withdraw_complete_modal_open, set_is_withdraw_complete_modal_open] = useState(false);

  // "회원 탈퇴" 버튼 클릭 → A_M16 확인 모달 열기
  const handle_withdraw_button_click = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    set_is_withdraw_confirm_modal_open(true);
  };

  // A_M16 확인 → C_M15 완료 모달 열기
  const handle_withdraw_confirm = () => {
    set_is_withdraw_confirm_modal_open(false);
    set_is_withdraw_complete_modal_open(true);
  };

  // C_M15 닫기 → /partner/login 이동
  const handle_withdraw_complete = () => {
    set_is_withdraw_complete_modal_open(false);
    router.push("/partner/login");
  };

  return (
    <>
      <BlockedBasePage
        message="서비스 이용이 제한되었습니다."
        buttonLabel="회원 탈퇴"
        buttonHref="/partner/login"
        buttonAriaLabel="회원 탈퇴"
        onClick={handle_withdraw_button_click}
      />

      {/* A_M16: 탈퇴 확인 모달 */}
      <BaseModal
        is_open={is_withdraw_confirm_modal_open}
        on_close={() => set_is_withdraw_confirm_modal_open(false)}
        message="회원 탈퇴를 진행하시겠습니까?"
        buttons={["취소", "확인"]}
        on_confirm={handle_withdraw_confirm}
        type="center"
      />

      {/* C_M15: 탈퇴 완료 모달 */}
      <BaseModal
        is_open={is_withdraw_complete_modal_open}
        on_close={handle_withdraw_complete}
        message="탈퇴가 완료되었습니다.<br>그동안 리뷰엑스를 이용해 주셔서 감사합니다."
        buttons={["닫기"]}
        on_confirm={handle_withdraw_complete}
        type="center"
      />
    </>
  );
}
