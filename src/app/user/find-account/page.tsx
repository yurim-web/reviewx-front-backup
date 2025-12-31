/* ========================================
   🔍 사용자 계정찾기 페이지 (User Find Account)
   ======================================== */

/**
 * 사용자 계정찾기 페이지
 *
 * 목적: 사용자가 휴대폰 번호 인증을 통해 계정을 찾을 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /user/find-account
 *
 * 주요 기능:
 * - 휴대폰 번호 입력 및 인증
 * - 인증 완료 후 다음 단계로 진행
 *
 * React 핵심 개념:
 * - useState 훅: 컴포넌트 내부 상태 관리 (휴대폰 번호, 인증 상태 등)
 * - 조건부 렌더링: 인증 완료 상태에 따라 UI 변경
 * - 이벤트 핸들러: onClick, onChange로 사용자 입력 처리
 * - 커스텀 훅: usePhoneVerification으로 인증 로직 분리
 * - Next.js Link 컴포넌트: 클라이언트 사이드 네비게이션
 * - CSS 모듈: 스타일을 컴포넌트별로 격리하여 관리
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/fragments/Header";
import PhoneVerification from "@/components/common/phone_verification/PhoneVerification";
import FindAccountModals from "@/components/common/find_account/modal/FindAccountModals";
import { usePhoneVerification } from "@/hooks/usePhoneVerification/usePhoneVerification";
import { useFindAccount } from "@/hooks/find_account/useFindAccount";
import styles from "@/styles/common/find_account/find_account.module.css";

/**
 * 사용자 계정찾기 페이지 컴포넌트
 *
 * @returns JSX.Element - 계정찾기 페이지 UI
 */
export default function UserFindAccountPage() {
  // ========================================
  // Next.js 라우터 훅
  // ========================================

  /**
   * useRouter 훅: Next.js의 클라이언트 사이드 라우팅을 위한 훅
   *
   * - router.push(): 특정 경로로 이동
   * - router.back(): 이전 페이지로 돌아가기
   * - router.replace(): 현재 페이지를 다른 페이지로 교체 (히스토리 스택에 추가 안 됨)
   */
  const router = useRouter();

  // ========================================
  // 상태 관리 (State Management)
  // ========================================

  /**
   * 커스텀 훅 사용: 휴대폰 인증 로직 관리
   *
   * usePhoneVerification 훅은 다음을 제공합니다:
   * - phone: 현재 입력된 휴대폰 번호
   * - isPhoneVerified: 인증 완료 여부
   * - phoneError: 휴대폰 번호 관련 에러 (훅에서 자동 관리)
   * - verificationCodeError: 인증번호 관련 에러 (훅에서 자동 관리)
   * - handleVerificationRequest: 인증번호 요청 함수
   * - handleVerifyCode: 인증번호 확인 함수
   * - resetVerification: 인증 상태 초기화 함수
   * 등등...
   */
  const phoneVerification = usePhoneVerification();

  /**
   * 커스텀 훅 사용: 계정 찾기 로직 관리
   *
   * useFindAccount 훅은 다음을 제공합니다:
   * - foundAccountInfo: 찾은 계정 정보 (이메일, 가입일)
   * - isResultModalOpen: 아이디 찾기 결과 모달 표시 여부
   * - isPhoneAccountModalOpen: SNS 로그인 유도 모달 표시 여부
   * - accountNotFoundError: 계정 없음 인라인 에러 메시지
   * - blockedAccountError: 정지/탈퇴 계정 인라인 에러 메시지
   * - handleNext: 다음 버튼 클릭 시 계정 조회 및 모달 표시
   * - resetAccountState: 계정 관련 상태 초기화
   */
  const findAccount = useFindAccount();

  // ========================================
  // 이벤트 핸들러 (Event Handlers)
  // ========================================

  /**
   * 휴대폰 번호 변경 핸들러
   *
   * - PhoneVerification 컴포넌트에서 호출되는 콜백 함수
   * - 휴대폰 번호가 변경되면 인증 상태 및 계정 상태 초기화
   * - 입력 시 에러 메시지 자동 초기화 (훅 내부에서 처리)
   */
  const handlePhoneChange = (phone: string) => {
    // 훅의 handlePhoneChange를 사용하여 phoneError 자동 초기화
    phoneVerification.handlePhoneChange(phone);

    // 휴대폰 번호가 변경되면 인증 상태 및 계정 상태 초기화
    if (phoneVerification.isPhoneVerified) {
      phoneVerification.resetVerification();
      findAccount.resetAccountState();
    }
  };

  /**
   * 인증번호 요청 핸들러
   *
   * - handleVerificationRequest(): 커스텀 훅에서 제공하는 인증번호 요청 함수
   * - 에러는 훅 내부에서 phoneError로 자동 관리됨
   */
  const handleVerificationRequest = async () => {
    await phoneVerification.handleVerificationRequest();
  };

  /**
   * 인증번호 확인 핸들러
   *
   * - handleVerifyCode(): 커스텀 훅에서 제공하는 인증번호 확인 함수
   * - 인증 성공 시 isPhoneVerified가 true로 변경됨
   * - 에러는 훅 내부에서 verificationCodeError로 자동 관리됨
   */
  const handleVerify = () => {
    phoneVerification.handleVerifyCode();
  };

  /**
   * 인증번호 변경 핸들러
   *
   * - PhoneVerification 컴포넌트에서 호출되는 콜백 함수
   * - 인증번호 입력 시 에러 메시지 자동 초기화 (훅 내부에서 처리)
   */
  const handleVerificationCodeChange = (code: string) => {
    phoneVerification.handleVerificationCodeChange(code);
  };

  /**
   * 다음 버튼 클릭 핸들러
   *
   * - 인증이 완료된 경우에만 계정 찾기 진행
   * - useFindAccount 훅의 handleNext 함수를 호출하여 목업 데이터로 계정 조회
   * - 조회 결과에 따라 적절한 모달 표시 (계정 찾음, 계정 없음, 정지/탈퇴, SNS 전용 등)
   */
  const handleNext = async () => {
    if (!phoneVerification.isPhoneVerified) {
      phoneVerification.setPhoneError("휴대폰 인증을 완료해주세요.");
      return;
    }

    // useFindAccount 훅의 handleNext 함수 호출
    // 이 함수는 목업 데이터를 사용하여 계정을 조회하고 결과에 따라 모달을 표시합니다
    await findAccount.handleNext(
      phoneVerification.isPhoneVerified,
      "id", // 사용자 계정찾기 페이지는 아이디 찾기만 지원
      phoneVerification.phone
    );
  };

  // ========================================
  // 렌더링 (JSX)
  // ========================================

  return (
    <div
      className={`${styles.find_account_page_container} ${styles.user_page}`}
    >
      {/* 헤더 컴포넌트 */}
      <Header />

      {/* 메인 콘텐츠 영역 */}
      <main className={`${styles.find_account_main} ${styles.user_page}`}>
        {/* 타이틀 섹션 */}
        <section className={styles.title_section}>
          <h1 className={styles.page_title}>계정 찾기</h1>
        </section>

        {/* 폼 섹션 */}
        <section className={styles.form_section}>
          {/* 휴대폰 인증 컴포넌트
              
              PhoneVerification 컴포넌트 사용:
              - 공통 컴포넌트를 재사용하여 코드 중복을 줄임
              - 휴대폰 번호 입력, 인증번호 요청, 인증번호 입력, 타이머 표시 등 모든 기능 포함
              - props로 상태와 핸들러 함수를 전달하여 부모 컴포넌트에서 제어
              
              Props 설명:
              - phone: 현재 입력된 휴대폰 번호
              - verificationCode: 현재 입력된 인증번호
              - isVerificationRequested: 인증번호 요청 여부
              - isPhoneVerified: 인증 완료 여부
              - timer: 남은 시간(초)
              - error: 휴대폰 번호 입력 에러 메시지
              - verificationCodeError: 인증번호 입력 에러 메시지
              - onPhoneChange: 휴대폰 번호 변경 시 호출되는 콜백 함수
              - onVerificationRequest: 인증번호 요청 시 호출되는 콜백 함수
              - onVerify: 인증번호 확인 시 호출되는 콜백 함수
              - onVerificationCodeChange: 인증번호 변경 시 호출되는 콜백 함수
              - onResend: 재전송 버튼 클릭 시 호출되는 콜백 함수 (선택적)
          */}
          <PhoneVerification
            phone={phoneVerification.phone}
            verificationCode={phoneVerification.verificationCode}
            isVerificationRequested={phoneVerification.isVerificationRequested}
            isPhoneVerified={phoneVerification.isPhoneVerified}
            timer={phoneVerification.timer}
            error={phoneVerification.phoneError}
            verificationCodeError={phoneVerification.verificationCodeError}
            accountNotFoundError={findAccount.accountNotFoundError}
            blockedAccountError={findAccount.blockedAccountError}
            onPhoneChange={handlePhoneChange}
            onVerificationRequest={handleVerificationRequest}
            onVerify={handleVerify}
            onVerificationCodeChange={handleVerificationCodeChange}
            onResend={handleVerificationRequest}
          />
        </section>

        {/* 다음 버튼 섹션 */}
        <section className={styles.button_section}>
          <button
            type="button"
            className={`${styles.next_button} ${
              !phoneVerification.isPhoneVerified
                ? styles.next_button_disabled
                : ""
            }`}
            onClick={handleNext}
            disabled={!phoneVerification.isPhoneVerified}
            aria-label="다음 단계로 진행"
          >
            다음
          </button>
        </section>
      </main>

      {/* 계정 찾기 결과 모달들
          
          FindAccountModals 컴포넌트:
          - 계정 찾기 결과에 따라 다양한 모달을 표시
          - AccountFoundModal: 계정을 찾았을 때 (이메일, 가입일 표시)
          - SNSLoginModal: SNS로만 가입된 계정일 때
          
          Props 설명:
          - activeTab: "id"로 고정 (사용자 계정찾기 페이지는 아이디 찾기만 지원)
          - isResultModalOpen: 아이디 찾기 결과 모달 표시 여부
          - isPhoneAccountModalOpen: SNS 로그인 유도 모달 표시 여부
          - foundAccountInfo: 찾은 계정 정보
          - onCloseResultModal: 결과 모달 닫기 핸들러
          - onClosePhoneAccountModal: SNS 모달 닫기 핸들러
          - onLogin: 로그인 버튼 클릭 핸들러
          - onSwitchToPasswordTab: 비밀번호 찾기 버튼 클릭 핸들러 (사용 안 함)
          - onKakaoLogin: 카카오 로그인 버튼 클릭 핸들러
      */}
      <FindAccountModals
        activeTab="id"
        isResultModalOpen={findAccount.isResultModalOpen}
        isPhoneAccountModalOpen={findAccount.isPhoneAccountModalOpen}
        foundAccountInfo={findAccount.foundAccountInfo}
        onCloseResultModal={() => findAccount.setIsResultModalOpen(false)}
        onClosePhoneAccountModal={() =>
          findAccount.setIsPhoneAccountModalOpen(false)
        }
        onLogin={() => {
          // TODO: 실제 로그인 페이지로 이동
          router.push("/user/login");
        }}
        onSwitchToPasswordTab={() => {
          // 사용자 계정찾기 페이지는 비밀번호 찾기를 지원하지 않음
          // 필요시 /find-account 페이지로 이동
          router.push("/find-account");
        }}
        onKakaoLogin={() => {
          router.push("/user/login");
        }}
        onNaverLogin={() => {
          router.push("/user/login");
        }}
        socialType={findAccount.socialType}
      />
    </div>
  );
}
