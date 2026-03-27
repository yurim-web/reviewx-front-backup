/* ========================================
   이용 제한 안내 페이지
   ======================================== */

/**
 * BlacklistInfoPage
 *
 * 목적: 이용 제한(차단) 사용자에게 서비스 이용 제한 안내 및 회원 탈퇴 기능 제공
 *
 * 사용 페이지:
 * - /blacklist_info
 *
 * 호출 API:
 * - DELETE /api/v1/reviewer/withdraw (회원 탈퇴)
 *
 * 진입 흐름:
 * - /user/login → 소셜 로그인 → ACCOUNT_BLOCKED 에러 → /blacklist_info 이동
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlockedBasePage from "@/components/common/blocked/BlockedBasePage";
import BaseModal from "@/components/common/modal/BaseModal";
import { withdrawReviewer } from "@/lib/api/userAuth";
import { clearAuthStorage } from "@/lib/auth";

export default function BlacklistInfoPage() {
  const router = useRouter();

  const [is_withdraw_confirm_modal_open, set_is_withdraw_confirm_modal_open] = useState(false);
  const [is_withdraw_complete_modal_open, set_is_withdraw_complete_modal_open] = useState(false);
  const [is_loading, set_is_loading] = useState(false);

  // "회원 탈퇴" 버튼 클릭 → 확인 모달 열기
  const handle_withdraw_button_click = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    set_is_withdraw_confirm_modal_open(true);
  };

  // 확인 모달 "확인" 클릭 → 탈퇴 API 호출
  const handle_withdraw_confirm = async () => {
    set_is_withdraw_confirm_modal_open(false);
    set_is_loading(true);

    try {
      await withdrawReviewer();
      // 인증 정보 정리
      clearAuthStorage();
      // 완료 모달 표시
      set_is_withdraw_complete_modal_open(true);
    } catch (error: unknown) {
      const axiosErr = error as { response?: { data?: { code?: string } } };
      const errCode = axiosErr?.response?.data?.code;

      if (errCode === "CAMPAIGN_IN_PROGRESS") {
        // B_M6: 진행 중인 캠페인 존재 시 탈퇴 불가
        alert("진행 중인 캠페인이 있을 경우 탈퇴가 불가합니다.");
      } else {
        // E_M5: 서버 오류
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      set_is_loading(false);
    }
  };

  // 완료 모달 "닫기" 클릭 → 로그인 페이지로 이동
  const handle_withdraw_complete = () => {
    set_is_withdraw_complete_modal_open(false);
    router.push("/user/login");
  };

  return (
    <>
      <BlockedBasePage
        message="서비스 이용이 제한되었습니다."
        buttonLabel={is_loading ? "처리 중..." : "회원 탈퇴"}
        buttonHref="/user/login"
        buttonAriaLabel="회원 탈퇴"
        onClick={handle_withdraw_button_click}
      />

      {/* A_M16: 회원 탈퇴 확인 모달 */}
      <BaseModal
        is_open={is_withdraw_confirm_modal_open}
        on_close={() => set_is_withdraw_confirm_modal_open(false)}
        message="회원 탈퇴를 진행하시겠습니까?"
        buttons={["취소", "확인"]}
        on_confirm={handle_withdraw_confirm}
        type="center"
      />

      {/* C_M15: 회원 탈퇴 완료 모달 */}
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
