/* ========================================
   마이페이지 - 내 정보 수정 페이지
   ======================================== */

/**
 * EditProfilePage
 *
 * 목적: 사용자의 개인정보(닉네임, 연락처, 주소, 계좌, 주민등록번호)를 수정하는 페이지
 *
 * 사용 페이지:
 * - /user/mypage/edit (내 정보 수정)
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useReviewerProfile } from "@/hooks/user/mypage/useReviewerProfile";
import layoutStyles from "@/styles/user/mypage/edit_profile/edit_profile_layout.module.css";
import inputStyles from "../../../../styles/user/mypage/edit_profile/inputs.module.css";
import buttonStyles from "../../../../styles/user/mypage/edit_profile/profile_buttons.module.css";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import ProfilePhotoUpload from "@/components/common/mypage/ProfilePhotoUpload";
import PhoneVerification from "@/components/common/phone_verification/PhoneVerification";
import AddressInput from "@/components/common/mypage/AddressInput";
import AccountInfoInput from "@/components/user/mypage/AccountInfoInput";
import SocialSecurityNumberInput from "@/components/user/mypage/SocialSecurityNumberInput";
import WithdrawModals from "@/components/common/mypage/WithdrawModals";
import Toast from "@/components/common/toast/Toast";
import BaseModal from "@/components/common/modal/BaseModal";
import { useWithdrawFlow } from "@/hooks/useWithdrawFlow";
import { useEditProfile } from "@/hooks/user/mypage/useEditProfile";
import { BANK_OPTIONS } from "@/utils/constants/bank";
import Loading from "@/app/loading";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { isLoading, error } = useReviewerProfile(user?.id);

  const [showServerErrorModal, setShowServerErrorModal] = useState(false);
  const [ssnError, setSsnError] = useState("");

  // 비로그인 시 리디렉트 (로딩 완료 후에만)
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/user/login");
    }
  }, [isAuthLoading, user, router]);

  // 서버 오류 처리
  useEffect(() => {
    if (error) {
      setShowServerErrorModal(true);
    }
  }, [error]);

  const {
    formData,
    setFormData,
    profileImage,
    setProfileImage,
    isAccountHolderVerified,
    setIsAccountHolderVerified,
    showToast,
    setShowToast,
    showVerifiedBadge,
    isSaveButtonEnabled,
    handleInputChange,
    handleSave,
    phone,
    verificationCode,
    isPhoneVerified,
    isVerificationRequested,
    timer,
    phoneError,
    verificationCodeError,
    handlePhoneChange,
    handleVerificationRequest,
    handleVerificationCodeChange,
    handleVerify,
  } = useEditProfile();

  const {
    isWithdrawConfirmModalOpen,
    isWithdrawCompleteModalOpen,
    isWithdrawBlockedModalOpen,
    setIsWithdrawConfirmModalOpen,
    setIsWithdrawBlockedModalOpen,
    handleWithdraw,
    handleWithdrawConfirm,
    handleWithdrawComplete,
  } = useWithdrawFlow({
    redirectPath: "/",
    checkOngoingCampaigns: async () => {
      // TODO: 실제 API 연동 필요
      return false;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className={layoutStyles.edit_profile_container}>
      <SubHeader />
      <main className={layoutStyles.main_content}>
        <PageTitle title="내 정보 수정" />

        <section className={layoutStyles.section_container}>
          <h2 className={layoutStyles.section_title}>기본 정보</h2>

          <ProfilePhotoUpload profileImage={profileImage} onImageChange={setProfileImage} />

          <article className={layoutStyles.field_article}>
            <label className={inputStyles.field_label} htmlFor="nickname">
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              className={inputStyles.input_field}
              value={formData.nickname}
              onChange={handleInputChange}
              placeholder="{자동닉네임 혹은 네이버/카카오 닉네임}"
            />
          </article>

          <article className={layoutStyles.field_article}>
            <label className={inputStyles.field_label} htmlFor="name">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={inputStyles.input_field}
              value={formData.name}
              disabled
              placeholder="{가입 시 등록한 이름}"
            />
          </article>

          <article className={layoutStyles.field_article}>
            <label className={inputStyles.field_label} htmlFor="email">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={inputStyles.input_field}
              value={formData.email}
              disabled
              placeholder="{가입 시 등록한 이메일}"
            />
          </article>

          <PhoneVerification
            phone={phone}
            isPhoneVerified={isPhoneVerified}
            error={phoneError}
            onPhoneChange={handlePhoneChange}
            verificationCode={verificationCode}
            isVerificationRequested={isVerificationRequested}
            timer={timer}
            verificationCodeError={verificationCodeError}
            onVerificationRequest={handleVerificationRequest}
            onVerify={handleVerify}
            onVerificationCodeChange={handleVerificationCodeChange}
            useMyPageStyle={true}
            showVerificationCode={true}
            showVerifiedBadge={showVerifiedBadge}
          />

          <AddressInput
            postalCode={formData.postalCode}
            address={formData.address}
            detailAddress={formData.detailAddress}
            onPostalCodeChange={(value) => setFormData((prev) => ({ ...prev, postalCode: value }))}
            onAddressChange={(value) => setFormData((prev) => ({ ...prev, address: value }))}
            onDetailAddressChange={(value) =>
              setFormData((prev) => ({ ...prev, detailAddress: value }))
            }
            onPostalCodeSearch={() => {}}
            postalCodeReadOnly={false}
          />

          <h3 className={layoutStyles.section_subtitle}>본인 명의 계좌 정보</h3>

          <AccountInfoInput
            accountHolder={formData.accountHolder}
            bank={formData.bank}
            accountNumber={formData.accountNumber}
            onAccountHolderChange={(value) =>
              setFormData((prev) => ({ ...prev, accountHolder: value }))
            }
            onBankChange={(value) => setFormData((prev) => ({ ...prev, bank: value }))}
            onAccountNumberChange={(value) =>
              setFormData((prev) => ({ ...prev, accountNumber: value }))
            }
            bankOptions={BANK_OPTIONS}
            onVerificationStatusChange={setIsAccountHolderVerified}
            initialVerified={isAccountHolderVerified}
          />

          <SocialSecurityNumberInput
            ssnFront={formData.ssnFront}
            ssnBack={formData.ssnBack}
            onSsnFrontChange={(value) => {
              setFormData((prev) => ({ ...prev, ssnFront: value }));
              setSsnError("");
            }}
            onSsnBackChange={(value) => {
              setFormData((prev) => ({ ...prev, ssnBack: value }));
              setSsnError("");
            }}
            error={ssnError}
          />

          <div className={buttonStyles.withdraw_button_container}>
            <button type="button" className={buttonStyles.withdraw_button} onClick={handleWithdraw}>
              회원 탈퇴
            </button>
          </div>
        </section>

        <div className={buttonStyles.save_button_container}>
          <button
            className={`${buttonStyles.save_button} ${!isSaveButtonEnabled ? buttonStyles.disabled_button : ""}`}
            onClick={handleSave}
            disabled={!isSaveButtonEnabled}
          >
            저장
          </button>
        </div>
      </main>

      <WithdrawModals
        isWithdrawBlockedModalOpen={isWithdrawBlockedModalOpen}
        isWithdrawConfirmModalOpen={isWithdrawConfirmModalOpen}
        isWithdrawCompleteModalOpen={isWithdrawCompleteModalOpen}
        onBlockedClose={() => setIsWithdrawBlockedModalOpen(false)}
        onConfirmClose={() => setIsWithdrawConfirmModalOpen(false)}
        onWithdrawConfirm={handleWithdrawConfirm}
        onWithdrawComplete={handleWithdrawComplete}
        buttonVariant="red"
      />

      {/* T_M3: 저장 완료 토스트 */}
      <Toast
        message="저장되었습니다."
        isOpen={showToast}
        onClose={() => {
          setShowToast(false);
          router.back();
        }}
        duration={2000}
      />

      {/* E_M5: 서버 오류 모달 */}
      <BaseModal
        is_open={showServerErrorModal}
        on_close={() => setShowServerErrorModal(false)}
        message="일시적인 오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
        buttons={["닫기", "재시도"]}
        on_cancel={() => setShowServerErrorModal(false)}
        on_confirm={() => {
          setShowServerErrorModal(false);
          router.refresh();
        }}
        type="center"
      />
    </div>
  );
}
