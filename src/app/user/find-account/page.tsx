/* ========================================
   유저 계정 찾기 페이지
   ======================================== */

/**
 * UserFindAccountPage
 *
 * 목적: 휴대폰 번호 인증으로 사용자 계정(아이디)을 찾는 페이지
 *
 * 사용 페이지:
 * - /user/find-account (계정 찾기)
 *
 * 호출 API:
 * - POST /api/v1/auth/phone/verify/request (인증번호 요청)
 * - POST /api/v1/auth/phone/verify/confirm (인증번호 확인)
 * - POST /api/v1/auth/find-account (계정 조회)
 */

"use client";

import Header from "@/components/fragments/Header";
import PageTitle from "@/components/fragments/PageTitle";
import PhoneVerification from "@/components/common/phone_verification/PhoneVerification";
import FindAccountModals from "@/components/common/find_account/modal/FindAccountModals";
import { usePhoneVerification } from "@/hooks/usePhoneVerification/usePhoneVerification";
import { useFindAccount } from "@/hooks/find_account/useFindAccount";
import { startSocialLogin } from "@/lib/api/userAuth";
import styles from "@/styles/common/find_account/find_account.module.css";

export default function UserFindAccountPage() {
  const phoneVerification = usePhoneVerification();

  const findAccount = useFindAccount({
    allowedAccountTypes: ["user"],
  });

  const handlePhoneChange = (phone: string) => {
    phoneVerification.handlePhoneChange(phone);
    if (phoneVerification.isPhoneVerified) {
      phoneVerification.resetVerification();
      findAccount.resetAccountState();
    }
  };

  const handleNext = async () => {
    if (!phoneVerification.isPhoneVerified) {
      phoneVerification.setPhoneError("휴대폰 인증을 완료해주세요.");
      return;
    }
    await findAccount.handleNext(phoneVerification.isPhoneVerified, "id", phoneVerification.phone);
  };

  return (
    <div className={`${styles.find_account_page_container} ${styles.user_page}`}>
      <Header />

      <div className={styles.mobile_page_title_wrapper}>
        <PageTitle title="계정 찾기" />
      </div>

      <main className={`${styles.find_account_main} ${styles.user_page}`}>
        <section className={styles.title_section}>
          <h1 className={styles.page_title}>계정 찾기</h1>
        </section>

        <section className={styles.form_section}>
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
            onVerificationRequest={() => phoneVerification.handleVerificationRequest()}
            onVerify={() => phoneVerification.handleVerifyCode()}
            onVerificationCodeChange={(code) =>
              phoneVerification.handleVerificationCodeChange(code)
            }
            onResend={() => phoneVerification.handleVerificationRequest()}
          />
        </section>

        <section className={styles.button_section}>
          <button
            type="button"
            className={`${styles.next_button} ${!phoneVerification.isPhoneVerified ? styles.next_button_disabled : ""}`}
            onClick={handleNext}
            disabled={!phoneVerification.isPhoneVerified}
            aria-label="다음 단계로 진행"
          >
            다음
          </button>
        </section>
      </main>

      <FindAccountModals
        activeTab="id"
        isResultModalOpen={findAccount.isResultModalOpen}
        isPhoneAccountModalOpen={findAccount.isPhoneAccountModalOpen}
        foundAccountInfo={findAccount.foundAccountInfo}
        onCloseResultModal={() => findAccount.setIsResultModalOpen(false)}
        onClosePhoneAccountModal={() => findAccount.setIsPhoneAccountModalOpen(false)}
        onLogin={() => startSocialLogin("naver")}
        onSwitchToPasswordTab={() => {}}
        onKakaoLogin={() => startSocialLogin("kakao")}
        onNaverLogin={() => startSocialLogin("naver")}
        socialType={findAccount.socialType}
      />
    </div>
  );
}
