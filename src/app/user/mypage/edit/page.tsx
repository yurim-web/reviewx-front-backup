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

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { usePhoneVerification } from "@/hooks/usePhoneVerification/usePhoneVerification";
import { useAuth } from "@/hooks/useAuth";
import { useWithdrawFlow } from "@/hooks/useWithdrawFlow";

const BANK_OPTIONS = [
  "국민은행",
  "기업은행",
  "농협은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "한국씨티은행",
  "산업은행",
  "SC제일은행",
  "iM뱅크",
  "경남은행",
  "광주은행",
  "부산은행",
  "산림조합중앙회",
  "저축은행",
  "새마을금고",
  "수협은행",
  "신협중앙회",
  "우체국",
  "전북은행",
  "제주은행",
  "도이치은행",
  "뱅크오브아메리카",
  "중국건설은행",
  "중국공상은행",
  "중국은행",
  "BNP파리바은행",
  "HSBCX은행",
  "JP모간체이스은행",
  "카카오뱅크",
  "케이뱅크",
  "토스뱅크",
];

const ACCOUNT_STORAGE_KEY = "userAccountVerification";

interface UserAccount {
  id?: string;
  email?: string;
  nickname?: string;
  name?: string;
  phone?: string;
  postal_code?: string;
  address?: string;
  detail_address?: string;
  profile_image?: string;
  account_holder?: string;
  bank?: string;
  account_number?: string;
  ssn_front?: string;
  ssn_back?: string;
  daily_visits?: number;
  total_visits?: number;
  neighbors?: number;
  join_date?: string;
  last_access_date?: string;
}

interface CampaignApplicant {
  id?: string;
  userId?: string;
  nickname?: string;
  profileImage?: string;
  dailyVisits?: number;
  totalVisits?: number;
  neighbors?: number;
}

interface CampaignData {
  applicantData?: {
    applicants?: CampaignApplicant[];
    selectedApplicants?: CampaignApplicant[];
  };
}

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nickname: "",
    name: "",
    email: "",
    postalCode: "",
    address: "",
    detailAddress: "",
    serviceName: "",
    accountHolder: "",
    bank: "",
    accountNumber: "",
    ssnFront: "",
    ssnBack: "",
  });

  const {
    phone,
    verificationCode,
    isPhoneVerified,
    isVerificationRequested,
    timer,
    phoneError,
    verificationCodeError,
    handlePhoneChange: handlePhoneChangeHook,
    handleVerificationRequest: handleVerificationRequestHook,
    handleVerificationCodeChange,
    handleVerifyCode,
    resetVerification,
    setTimer,
    setIsVerified,
    setIsVerificationRequested,
  } = usePhoneVerification();

  // 회원 탈퇴 플로우 훅
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

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isAccountHolderVerified, setIsAccountHolderVerified] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showVerifiedBadge, setShowVerifiedBadge] = useState(false);
  const expectingVerificationRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      try {
        const storedAccounts = localStorage.getItem("user_accounts");
        let userAccount: UserAccount | null = null;

        if (storedAccounts) {
          const accounts: UserAccount[] = JSON.parse(storedAccounts);
          userAccount = accounts.find((a) => a.id === user.id || a.email === user.email) ?? null;
        }

        const accountHolderValue = userAccount?.account_holder ?? "";
        const bankValue = userAccount?.bank ?? "";
        const accountNumberValue = userAccount?.account_number ?? "";

        setFormData((prev) => ({
          ...prev,
          nickname: userAccount?.nickname ?? user.nickname ?? user.name ?? "",
          name: userAccount?.name ?? user.name ?? "",
          email: userAccount?.email ?? user.email ?? "",
          postalCode: userAccount?.postal_code ?? user.postal_code ?? "",
          address: userAccount?.address ?? user.address ?? "",
          detailAddress: userAccount?.detail_address ?? user.detail_address ?? "",
          accountHolder: accountHolderValue,
          bank: bankValue,
          accountNumber: accountNumberValue,
          ssnFront: userAccount?.ssn_front ?? "",
          ssnBack: userAccount?.ssn_back ?? "",
        }));

        if (accountHolderValue.trim() && bankValue.trim() && String(accountNumberValue).trim()) {
          setIsAccountHolderVerified(true);
        }

        const phoneNumber = userAccount?.phone ?? user.phone;
        if (phoneNumber) {
          handlePhoneChangeHook(phoneNumber);
          setIsVerified(true);
          setIsVerificationRequested(true);
        }

        const profileImg = userAccount?.profile_image ?? user.profile_image;
        if (profileImg) {
          setProfileImage(profileImg);
        }

        if (!userAccount) {
          const stored = localStorage.getItem(ACCOUNT_STORAGE_KEY);
          if (stored) {
            const verificationData = JSON.parse(stored);
            setFormData((prev) => ({
              ...prev,
              bank: verificationData.bank ?? "",
              accountNumber: verificationData.accountNumber ?? "",
              accountHolder: verificationData.accountHolder ?? "",
            }));
          }
        }
      } catch {
        // localStorage 읽기 실패 시 무시
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const accountHolderValue = formData.accountHolder?.trim() ?? "";
    const bankValue = formData.bank?.trim() ?? "";
    const accountNumberValue = String(formData.accountNumber ?? "").trim();

    if (!accountHolderValue || !bankValue || !accountNumberValue) return;

    try {
      const storedAccounts = localStorage.getItem("user_accounts");
      if (!storedAccounts) return;

      const accounts: UserAccount[] = JSON.parse(storedAccounts);
      const userAccount = accounts.find((a) => a.id === user?.id || a.email === user?.email);

      if (
        userAccount &&
        userAccount.account_holder === accountHolderValue &&
        userAccount.bank === bankValue &&
        userAccount.account_number === accountNumberValue
      ) {
        setIsAccountHolderVerified(true);
      }
    } catch {
      // 무시
    }
  }, [formData.accountHolder, formData.bank, formData.accountNumber, user?.id, user?.email]);

  useEffect(() => {
    if (isPhoneVerified && expectingVerificationRef.current) {
      expectingVerificationRef.current = false;
      setShowVerifiedBadge(true);
    }
  }, [isPhoneVerified]);

  const validateRequiredFields = () => {
    const accountHolderValue = formData.accountHolder.trim();
    const bankValue = formData.bank.trim();
    const accountNumberValue = formData.accountNumber.trim();

    const isAccountInfoEmpty = !accountHolderValue && !bankValue && !accountNumberValue;
    const isAccountInfoFilled =
      accountHolderValue.length > 0 && bankValue.length > 0 && accountNumberValue.length > 0;
    const isAccountInfoValid =
      isAccountInfoEmpty || (isAccountInfoFilled && isAccountHolderVerified);

    const areOtherFieldsValid =
      phone.trim().length > 0 &&
      formData.postalCode.trim().length > 0 &&
      formData.address.trim().length > 0 &&
      formData.ssnFront.trim().length > 0 &&
      formData.ssnBack.trim().length > 0;

    return isAccountInfoValid && areOtherFieldsValid;
  };

  const isSaveButtonEnabled = validateRequiredFields();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (newPhone: string) => {
    handlePhoneChangeHook(newPhone);
    if (newPhone === "" || isPhoneVerified || isVerificationRequested) {
      resetVerification();
    }
  };

  const handleVerificationRequest = async () => {
    await handleVerificationRequestHook();
    setTimer(180);
  };

  const handleVerify = () => {
    expectingVerificationRef.current = true;
    handleVerifyCode();
  };

  const handlePostalSearch = () => {};

  const updateApplicantInList = (
    list: CampaignApplicant[],
    userId: string,
    nickname: string,
    profileImg: string | null,
    userAccount: UserAccount | null
  ) => {
    list.forEach((applicant) => {
      if (applicant.id === userId || applicant.userId === userId) {
        applicant.nickname = nickname;
        if (profileImg) applicant.profileImage = profileImg;
        if (userAccount) {
          applicant.dailyVisits = userAccount.daily_visits ?? applicant.dailyVisits ?? 0;
          applicant.totalVisits = userAccount.total_visits ?? applicant.totalVisits ?? 0;
          applicant.neighbors = userAccount.neighbors ?? applicant.neighbors ?? 0;
        }
      }
    });
  };

  const handleSave = () => {
    if (!isSaveButtonEnabled) return;

    try {
      const authUser = localStorage.getItem("reviewx_auth_user");
      if (authUser) {
        const userData = JSON.parse(authUser);
        localStorage.setItem(
          "reviewx_auth_user",
          JSON.stringify({
            ...userData,
            name: formData.name,
            nickname: formData.nickname,
            email: formData.email,
            phone,
            postal_code: formData.postalCode,
            address: formData.address,
            detail_address: formData.detailAddress,
            profile_image: profileImage,
            account_holder: formData.accountHolder,
            bank: formData.bank,
            account_number: formData.accountNumber,
            ssn_front: formData.ssnFront,
            ssn_back: formData.ssnBack,
          })
        );
      }

      const storedAccounts = localStorage.getItem("user_accounts");
      const accounts: UserAccount[] = storedAccounts ? JSON.parse(storedAccounts) : [];
      const accountIndex = accounts.findIndex(
        (a) => a.id === user?.id || a.email === user?.email
      );

      const updatedAccount: UserAccount = {
        name: formData.name,
        nickname: formData.nickname,
        phone,
        postal_code: formData.postalCode,
        address: formData.address,
        detail_address: formData.detailAddress,
        profile_image: profileImage ?? undefined,
        account_holder: formData.accountHolder,
        bank: formData.bank,
        account_number: formData.accountNumber,
        ssn_front: formData.ssnFront,
        ssn_back: formData.ssnBack,
      };

      const now = new Date().toISOString().replace("T", " ").substring(0, 16);

      if (accountIndex >= 0) {
        accounts[accountIndex] = {
          ...accounts[accountIndex],
          ...updatedAccount,
          last_access_date: now,
        };
      } else {
        accounts.push({
          id: user?.id ?? "user_001",
          email: user?.email ?? formData.email,
          ...updatedAccount,
          join_date: now,
          last_access_date: now,
        });
      }

      localStorage.setItem("user_accounts", JSON.stringify(accounts));

      if (user?.id) {
        const freshAccounts: UserAccount[] = JSON.parse(
          localStorage.getItem("user_accounts") ?? "[]"
        );
        const freshUserAccount =
          freshAccounts.find((a) => a.id === user.id || a.email === user.email) ?? null;

        const campaignTypes = [
          "deliveryCampaigns",
          "visitCampaigns",
          "reviewCampaigns",
          "reporterCampaigns",
          "missionCampaigns",
        ];

        campaignTypes.forEach((campaignType) => {
          try {
            const stored = localStorage.getItem(campaignType);
            if (!stored) return;

            const campaigns: CampaignData[] = JSON.parse(stored);
            let updated = false;

            campaigns.forEach((campaign) => {
              if (campaign.applicantData?.applicants) {
                updateApplicantInList(
                  campaign.applicantData.applicants,
                  user.id,
                  formData.nickname,
                  profileImage,
                  freshUserAccount
                );
                updated = true;
              }
              if (campaign.applicantData?.selectedApplicants) {
                updateApplicantInList(
                  campaign.applicantData.selectedApplicants,
                  user.id,
                  formData.nickname,
                  profileImage,
                  freshUserAccount
                );
                updated = true;
              }
            });

            if (updated) {
              localStorage.setItem(campaignType, JSON.stringify(campaigns));
            }
          } catch {
            // 개별 캠페인 업데이트 실패 시 무시
          }
        });
      }

      setShowToast(true);
    } catch {
      alert("정보 저장에 실패했습니다.");
    }
  };

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
            onPostalCodeChange={(value) =>
              setFormData((prev) => ({ ...prev, postalCode: value }))
            }
            onAddressChange={(value) => setFormData((prev) => ({ ...prev, address: value }))}
            onDetailAddressChange={(value) =>
              setFormData((prev) => ({ ...prev, detailAddress: value }))
            }
            onPostalCodeSearch={handlePostalSearch}
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
            onSsnFrontChange={(value) => setFormData((prev) => ({ ...prev, ssnFront: value }))}
            onSsnBackChange={(value) => setFormData((prev) => ({ ...prev, ssnBack: value }))}
          />

          <div className={buttonStyles.withdraw_button_container}>
            <button
              type="button"
              className={buttonStyles.withdraw_button}
              onClick={handleWithdraw}
            >
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

      {/* 회원 탈퇴 모달 */}
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

      <Toast
        message="저장되었습니다."
        isOpen={showToast}
        onClose={() => {
          setShowToast(false);
          router.back();
        }}
        duration={2000}
      />
    </div>
  );
}
