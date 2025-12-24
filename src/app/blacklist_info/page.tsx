/* ========================================
   🚫 이용 제한 안내 페이지
   ======================================== */

/**
 * 이용 제한 안내 페이지
 *
 * 페이지 경로:
 * - /blacklist_info
 *
 * 주요 기능:
 * - 서비스 이용 제한 안내 메시지 표시
 * - 회원 탈퇴 버튼 클릭 시 확인 모달 표시
 * - 탈퇴 확인 후 완료 모달 표시
 *
 * 학습 포인트:
 * - React useState: 컴포넌트의 상태를 관리하는 훅
 * - 이벤트 핸들러: 버튼 클릭 등의 사용자 인터랙션 처리
 * - 조건부 렌더링: 모달의 열림/닫힘 상태에 따라 다른 UI 표시
 * - BaseModal 컴포넌트 활용: 재사용 가능한 모달 컴포넌트 사용
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlockedBasePage from "@/components/common/blocked/BlockedBasePage";
import BaseModal from "@/components/common/modal/BaseModal";

export default function BlacklistInfoPage() {
  // Next.js의 useRouter 훅: 페이지 이동을 위한 라우터 객체
  // 클라이언트 컴포넌트에서 페이지 이동 시 사용합니다.
  const router = useRouter();

  // useState 훅: 컴포넌트의 상태(state)를 관리합니다.
  // 상태란? 컴포넌트가 기억하고 있어야 하는 데이터입니다.
  // 상태가 변경되면 React가 자동으로 컴포넌트를 다시 렌더링합니다.

  // 첫 번째 모달 상태: 회원 탈퇴 확인 모달
  // is_withdraw_confirm_modal_open: 확인 모달이 열려있는지 여부 (true/false)
  // set_is_withdraw_confirm_modal_open: 확인 모달 상태를 변경하는 함수
  const [is_withdraw_confirm_modal_open, set_is_withdraw_confirm_modal_open] =
    useState(false);

  // 두 번째 모달 상태: 탈퇴 완료 모달
  // is_withdraw_complete_modal_open: 완료 모달이 열려있는지 여부 (true/false)
  // set_is_withdraw_complete_modal_open: 완료 모달 상태를 변경하는 함수
  const [is_withdraw_complete_modal_open, set_is_withdraw_complete_modal_open] =
    useState(false);

  /**
   * 회원 탈퇴 버튼 클릭 핸들러
   *
   * 기능:
   * - "회원 탈퇴" 버튼을 클릭하면 첫 번째 확인 모달을 엽니다.
   *
   * 이벤트 핸들러란?
   * - 사용자의 행동(버튼 클릭, 입력 등)에 반응하는 함수입니다.
   * - React에서는 보통 handle로 시작하는 이름을 사용합니다.
   *
   * preventDefault()란?
   * - 기본 동작을 막는 함수입니다.
   * - 여기서는 <a> 태그의 기본 동작(페이지 이동)을 막기 위해 사용합니다.
   */
  const handle_withdraw_button_click = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    // 기본 동작 막기: <a> 태그의 href로 인한 페이지 이동을 막습니다.
    e.preventDefault();
    // 첫 번째 확인 모달 열기
    set_is_withdraw_confirm_modal_open(true);
  };

  /**
   * 탈퇴 확인 모달에서 "확인" 버튼 클릭 핸들러
   *
   * 기능:
   * 1. 첫 번째 확인 모달을 닫습니다.
   * 2. 두 번째 완료 모달을 엽니다.
   * 3. 실제 탈퇴 API 호출 로직이 필요하면 여기에 추가합니다.
   *
   * 비동기 처리:
   * - 실제 서비스에서는 탈퇴 API를 호출해야 합니다.
   * - 예: await withdrawUser();
   * - API 호출이 성공하면 완료 모달을 열고, 실패하면 에러 모달을 표시합니다.
   */
  const handle_withdraw_confirm = () => {
    // 첫 번째 확인 모달 닫기
    set_is_withdraw_confirm_modal_open(false);
    // TODO: 실제 탈퇴 API 호출 로직이 필요하면 여기에 추가
    // 예: await withdrawUser();
    // 두 번째 완료 모달 열기
    set_is_withdraw_complete_modal_open(true);
  };

  /**
   * 탈퇴 완료 모달에서 "닫기" 버튼 클릭 핸들러
   *
   * 기능:
   * 1. 완료 모달을 닫습니다.
   * 2. 로그인 페이지로 이동합니다.
   *
   * router.push()란?
   * - Next.js에서 프로그래밍 방식으로 페이지를 이동하는 함수입니다.
   * - 브라우저의 뒤로 가기 기능도 정상적으로 작동합니다.
   */
  const handle_withdraw_complete = () => {
    // 완료 모달 닫기
    set_is_withdraw_complete_modal_open(false);
    // 로그인 페이지로 이동
    router.push("/user/login");
  };

  return (
    <>
      {/* 이용 제한 안내 페이지 메인 컨텐츠 */}
      <BlockedBasePage
        message="서비스 이용이 제한되었습니다."
        buttonLabel="회원 탈퇴"
        buttonHref="/user/login"
        buttonAriaLabel="회원 탈퇴"
        onClick={handle_withdraw_button_click}
      />

      {/* 회원 탈퇴 확인 모달 (첫 번째 모달) */}
      {/* 조건부 렌더링: is_withdraw_confirm_modal_open이 true일 때만 모달을 표시합니다. */}
      <BaseModal
        is_open={is_withdraw_confirm_modal_open}
        on_close={() => set_is_withdraw_confirm_modal_open(false)}
        message="회원 탈퇴를 진행하시겠습니까?"
        buttons={["취소", "확인"]}
        on_confirm={handle_withdraw_confirm}
        type="center"
      />

      {/* 회원 탈퇴 완료 모달 (두 번째 모달) */}
      {/* 조건부 렌더링: is_withdraw_complete_modal_open이 true일 때만 모달을 표시합니다. */}
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
