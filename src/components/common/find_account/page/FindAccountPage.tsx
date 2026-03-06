/* ========================================
   아이디/비밀번호 찾기 공용 페이지 컴포넌트
   ======================================== */

/**
 * FindAccountPage
 *
 * 목적: 사용자와 파트너가 공통으로 사용하는 아이디/비밀번호 찾기 페이지
 *
 * 사용 페이지:
 * - /find-account (관리자 아이디/비밀번호 찾기)
 * - /partner/find-account (파트너 아이디/비밀번호 찾기)
 */

"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import PhoneVerification from "@/components/common/phone_verification/PhoneVerification";
import TabNavigation from "@/components/common/find_account/TabNavigation";
import EmailInput from "@/components/common/find_account/EmailInput";
import NextButton from "@/components/common/find_account/NextButton";
import FindAccountModals from "@/components/common/find_account/modal/FindAccountModals";
import { usePhoneVerification } from "@/hooks/usePhoneVerification/usePhoneVerification";
import { useFindAccount } from "@/hooks/find_account/useFindAccount";
import styles from "@/styles/common/find_account/find_account.module.css";

export default function FindAccountPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"id" | "password">("id");

  const phoneVerification = usePhoneVerification();
  const findAccount = useFindAccount({
    // /partner/find-account: partner만, 그 외(/find-account): user만
    allowedAccountTypes: pathname.startsWith("/partner") ? ["partner"] : ["user"],
  });

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
              isManager={pathname === "/find-account"}
              value={findAccount.email}
              onChange={(value) => {
                findAccount.setEmail(value);
                if (findAccount.emailError) {
                  findAccount.setEmailError(undefined);
                }
                // 이메일 변경 시 계정 없음 에러 및 정지/탈퇴 에러 초기화
                if (findAccount.accountNotFoundError) {
                  findAccount.setAccountNotFoundError(undefined);
                }
                if (findAccount.blockedAccountError) {
                  findAccount.setBlockedAccountError(undefined);
                }
              }}
              error={
                findAccount.emailError ||
                findAccount.accountNotFoundError ||
                findAccount.blockedAccountError
              }
            />
          )}
          <PhoneVerification
            phone={phoneVerification.phone}
            verificationCode={phoneVerification.verificationCode}
            isVerificationRequested={phoneVerification.isVerificationRequested}
            isPhoneVerified={phoneVerification.isPhoneVerified}
            timer={phoneVerification.timer}
            error={phoneVerification.phoneError}
            verificationCodeError={phoneVerification.verificationCodeError}
            accountNotFoundError={activeTab === "id" ? findAccount.accountNotFoundError : undefined}
            blockedAccountError={activeTab === "id" ? findAccount.blockedAccountError : undefined}
            onPhoneChange={(phone) => {
              phoneVerification.handlePhoneChange(phone);
              // 전화번호 변경 시 계정 없음 에러 및 정지/탈퇴 에러 초기화
              if (findAccount.accountNotFoundError) {
                findAccount.setAccountNotFoundError(undefined);
              }
              if (findAccount.blockedAccountError) {
                findAccount.setBlockedAccountError(undefined);
              }
            }}
            onVerificationRequest={phoneVerification.handleVerificationRequest}
            onResend={phoneVerification.handleVerificationRequest}
            onVerify={phoneVerification.handleVerifyCode}
            onVerificationCodeChange={phoneVerification.handleVerificationCodeChange}
          />
        </section>

        <NextButton
          disabled={
            !phoneVerification.isVerified ||
            !!findAccount.accountNotFoundError ||
            !!findAccount.blockedAccountError ||
            !!findAccount.emailError
          }
          onClick={async () => {
            const success = await findAccount.handleNext(
              phoneVerification.isVerified,
              activeTab,
              phoneVerification.phone
            );
            // 비밀번호 찾기 탭이고 성공했을 때만 새 비밀번호 설정 페이지로 이동
            // (에러가 하나라도 있으면 success가 false이므로 이동하지 않음)
            if (activeTab === "password" && success) {
              if (pathname.startsWith("/partner")) {
                if (typeof window !== "undefined" && findAccount.email) {
                  window.localStorage.setItem("partner_email", findAccount.email);
                }
                router.push("/partner/reset-password");
              } else {
                router.push("/reset-password");
              }
            }
          }}
        />
      </main>

      <FindAccountModals
        activeTab={activeTab}
        isResultModalOpen={findAccount.isResultModalOpen}
        isPhoneAccountModalOpen={false}
        foundAccountInfo={findAccount.foundAccountInfo}
        onCloseResultModal={() => findAccount.setIsResultModalOpen(false)}
        onClosePhoneAccountModal={() => findAccount.setIsPhoneAccountModalOpen(false)}
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
