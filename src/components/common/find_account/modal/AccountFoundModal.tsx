/* ========================================
   🔍 아이디 찾기 결과 모달 컴포넌트
   ======================================== */

/**
 * 아이디 찾기 결과 모달 컴포넌트
 *
 * 목적: 휴대폰 인증으로 찾은 아이디(이메일)와 가입일을 표시하는 모달입니다.
 *
 * 사용 페이지:
 * - src/components/common/FindAccountPage.tsx
 */

"use client";

import type { AccountInfo } from "../types";
import styles from "@/styles/common/find_account/find_account_modal.module.css";
import ModalButton from "./ModalButton";

/**
 * AccountFoundModal Props 타입
 */
interface AccountFoundModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 조회한 계정 정보 */
  accountInfo: AccountInfo | null;
  /** 로그인 버튼 클릭 핸들러 */
  onLogin?: () => void;
  /** 비밀번호 찾기 버튼 클릭 핸들러 */
  onFindPassword?: () => void;
}

/**
 * 아이디 찾기 결과 모달 컴포넌트
 *
 * @param props - AccountFoundModalProps
 * @returns JSX.Element | null - 모달이 열려있으면 JSX, 아니면 null
 */
export default function AccountFoundModal({
  isOpen,
  onClose,
  accountInfo,
  onLogin,
  onFindPassword,
}: AccountFoundModalProps) {
  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen || !accountInfo) return null;

  return (
    <div className={styles.result_modal_overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={styles.result_modal_container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.result_modal_content}>
          {/* 제목 */}
          <p className={styles.result_modal_title}>아이디 조회</p>

          {/* 조회한 계정 정보 표시 */}
          <div className={styles.result_modal_info_box}>
            <p className={styles.result_modal_id_text}>{accountInfo.email}</p>
            <p className={styles.result_modal_id_text}>가입일: {accountInfo.signupDate}</p>
          </div>

          {/* 버튼 영역: 로그인 / 비밀번호 찾기 */}
          <div className={styles.result_modal_button_group}>
            <ModalButton
              variant="primary"
              onClick={() => {
                onLogin?.();
                onClose();
              }}
            >
              로그인
            </ModalButton>
            <ModalButton
              variant="secondary"
              onClick={() => {
                onClose();
                onFindPassword?.();
              }}
            >
              비밀번호 찾기
            </ModalButton>
          </div>
        </div>
      </div>
    </div>
  );
}
