/**
 * 아이디/비밀번호 찾기 페이지 컴포넌트
 *
 * 사용자와 파트너가 아이디와 비밀번호를 찾을 수 있는 공용 페이지입니다.
 *
 * 사용 페이지:
 * - /find-account (사용자 아이디/비밀번호 찾기)
 * - /partner/find-account (파트너 아이디/비밀번호 찾기)
 */

"use client";

import { useState } from "react";
import PhoneVerification from "@/components/common/signup/PhoneVerification";
import TabNavigation from "@/components/common/find_account/TabNavigation";
import EmailInput from "@/components/common/find_account/EmailInput";
import NextButton from "@/components/common/find_account/NextButton";
import FindAccountModals from "@/components/common/find_account/FindAccountModals";
import { usePhoneVerification } from "@/components/common/find_account/hooks/usePhoneVerification";
import { useFindAccount } from "@/components/common/find_account/hooks/useFindAccount";
import styles from "@/styles/common/find_account/find_account.module.css";

export default function FindAccountPage() {
  const [activeTab, setActiveTab] = useState<"id" | "password">("id");

  const phoneVerification = usePhoneVerification();
  const findAccount = useFindAccount();

  /** 탭 변경 핸들러 */
  const handleTabChange = (tab: "id" | "password") => {
    setActiveTab(tab);
    phoneVerification.resetVerification();
    findAccount.resetAccountState();
  };

  return (
    <div className={styles.find_account_page_container}>
      <main className={styles.find_account_main}>
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        <section className={styles.form_section}>
          {activeTab === "password" && (
            <EmailInput
              value={findAccount.email}
              onChange={(value) => {
                findAccount.setEmail(value);
                if (findAccount.emailError) {
                  findAccount.setEmailError(undefined);
                }
                // 이메일 변경 시 계정 없음 에러 초기화
                if (findAccount.accountNotFoundError) {
                  findAccount.setAccountNotFoundError(undefined);
                }
              }}
              error={findAccount.emailError || findAccount.accountNotFoundError}
            />
          )}
          <PhoneVerification
            phone={phoneVerification.phone}
            verificationCode={phoneVerification.verificationCode}
            isVerificationRequested={phoneVerification.isVerificationRequested}
            isPhoneVerified={phoneVerification.isVerified}
            timer={phoneVerification.timer}
            error={phoneVerification.phoneError}
            verificationCodeError={phoneVerification.verificationCodeError}
            accountNotFoundError={
              activeTab === "id" ? findAccount.accountNotFoundError : undefined
            }
            onPhoneChange={(phone) => {
              phoneVerification.handlePhoneChange(phone);
              // 전화번호 변경 시 계정 없음 에러 초기화
              if (findAccount.accountNotFoundError) {
                findAccount.setAccountNotFoundError(undefined);
              }
            }}
            onVerificationRequest={phoneVerification.handleVerificationRequest}
            onResend={phoneVerification.handleVerificationRequest}
            onVerify={phoneVerification.handleVerifyCode}
            onVerificationCodeChange={(code) => {
              phoneVerification.setVerificationCode(code);
              phoneVerification.setVerificationCodeError(undefined);
            }}
          />
        </section>

        <NextButton
          disabled={
            !phoneVerification.isVerified || !!findAccount.accountNotFoundError
          }
          onClick={() =>
            findAccount.handleNext(
              phoneVerification.isVerified,
              activeTab,
              phoneVerification.phone
            )
          }
        />
      </main>

      <FindAccountModals
        activeTab={activeTab}
        isResultModalOpen={findAccount.isResultModalOpen}
        isPhoneAccountModalOpen={findAccount.isPhoneAccountModalOpen}
        isAccountNotFoundModalOpen={findAccount.isAccountNotFoundModalOpen}
        isBlockedAccountModalOpen={findAccount.isBlockedAccountModalOpen}
        foundAccountInfo={findAccount.foundAccountInfo}
        onCloseResultModal={() => findAccount.setIsResultModalOpen(false)}
        onClosePhoneAccountModal={() =>
          findAccount.setIsPhoneAccountModalOpen(false)
        }
        onCloseAccountNotFoundModal={() =>
          findAccount.setIsAccountNotFoundModalOpen(false)
        }
        onCloseBlockedAccountModal={() =>
          findAccount.setIsBlockedAccountModalOpen(false)
        }
        onLogin={() => {
          // TODO: 실제 로그인 페이지로 이동 로직 추가 (user / partner 구분 필요)
        }}
        onSwitchToPasswordTab={() => setActiveTab("password")}
        onKakaoLogin={() => {
          // TODO: 실제 카카오 로그인으로 이동하는 로직 추가
        }}
      />
    </div>
  );
}
