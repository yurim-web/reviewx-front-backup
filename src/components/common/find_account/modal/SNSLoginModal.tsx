/* ========================================
   🔍 SNS 로그인 유도 모달 컴포넌트
   ======================================== */

/**
 * SNS 로그인 유도 모달 컴포넌트
 *
 * 목적: 휴대폰 번호로 가입된 계정이 SNS(카카오/네이버)로만 가입된 경우,
 *       SNS 로그인을 유도하는 모달입니다.
 *
 * 주요 기능:
 * - SNS 로그인 안내 메시지 표시
 * - 카카오 또는 네이버 로그인 버튼 (소셜 타입에 따라 동적 표시)
 * - 닫기 버튼
 *
 * 사용처:
 * - src/components/common/FindAccountPage.tsx
 *
 * React 핵심 개념:
 * - 조건부 렌더링: socialType prop에 따라 다른 버튼 표시
 * - Props: 부모 컴포넌트로부터 데이터를 받아 UI를 동적으로 구성
 */

"use client";

import styles from "@/styles/common/find_account/find_account.module.css";
import ModalButton from "./ModalButton";

/**
 * SNSLoginModal Props 타입
 *
 * TypeScript 인터페이스:
 * - 컴포넌트가 받을 수 있는 props의 타입을 정의
 * - ? 표시는 선택적(optional) 속성을 의미
 */
interface SNSLoginModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 소셜 로그인 타입 (카카오 또는 네이버) */
  socialType?: "kakao" | "naver";
  /** 카카오 로그인 버튼 클릭 핸들러 */
  onKakaoLogin?: () => void;
  /** 네이버 로그인 버튼 클릭 핸들러 */
  onNaverLogin?: () => void;
}

/**
 * SNS 로그인 유도 모달 컴포넌트
 *
 * @param props - SNSLoginModalProps 타입의 props 객체
 * @returns JSX.Element - SNS 로그인 유도 모달 UI
 */
export default function SNSLoginModal({
  isOpen,
  onClose,
  socialType = "kakao", // 기본값은 카카오
  onKakaoLogin,
  onNaverLogin,
}: SNSLoginModalProps) {
  // ========================================
  // 조건부 렌더링: 모달이 닫혀있으면 렌더링하지 않음
  // ========================================
  // if 문을 사용한 조건부 렌더링
  // - isOpen이 false이면 null을 반환하여 아무것도 렌더링하지 않음
  // - 이렇게 하면 DOM에 요소가 생성되지 않아 성능상 이점이 있음
  if (!isOpen) return null;

  // ========================================
  // JSX 반환: 모달 UI 구조
  // ========================================
  return (
    <div
      className={styles.sns_modal_overlay}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={styles.sns_modal_container}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.sns_modal_content}>
          {/* 모달 안내 메시지 */}
          <p className={styles.sns_modal_message}>
            <span className={styles.sns_modal_message_line1}>
              입력하신 휴대폰 번호로
            </span>
            <span className={styles.sns_modal_message_line2}>
              가입된 계정이 있습니다.
            </span>
            <span className={styles.sns_modal_message_line3}>
              아래 안내된 버튼을 통해 로그인해 주세요.
            </span>
          </p>

          {/* 버튼 그룹 */}
          <div className={styles.sns_modal_button_group}>
            {/* 조건부 렌더링: socialType에 따라 다른 버튼 표시 */}
            {/* 삼항 연산자 사용: 조건 ? 참일 때 : 거짓일 때 */}
            {socialType === "naver" ? (
              // 네이버 로그인 버튼
              <ModalButton
                variant="naver"
                onClick={() => {
                  // 옵셔널 체이닝(?.) 사용: onNaverLogin이 있으면 실행, 없으면 무시
                  onNaverLogin?.();
                  onClose();
                }}
              >
                네이버 로그인하기
              </ModalButton>
            ) : (
              // 카카오 로그인 버튼 (기본값)
              <ModalButton
                variant="kakao"
                onClick={() => {
                  onKakaoLogin?.();
                  onClose();
                }}
              >
                카카오 로그인하기
              </ModalButton>
            )}
            {/* 닫기 버튼 */}
            <ModalButton variant="sns-secondary" onClick={onClose}>
              닫기
            </ModalButton>
          </div>
        </div>
      </div>
    </div>
  );
}
