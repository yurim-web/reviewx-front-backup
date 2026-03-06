/* ========================================
   내 정보 수정 폼 커스텀 훅
   ======================================== */

/**
 * useEditProfile
 *
 * 목적: 내 정보 수정 페이지의 폼 상태 로드, 저장, 유효성 검증 로직을 관리합니다.
 *
 * 사용 페이지:
 * - /user/mypage/edit (내 정보 수정)
 */

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePhoneVerification } from "@/hooks/usePhoneVerification/usePhoneVerification";
import { patchReviewerProfile } from "@/lib/api/reviewer";

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

export interface EditProfileFormData {
  nickname: string;
  name: string;
  email: string;
  postalCode: string;
  address: string;
  detailAddress: string;
  serviceName: string;
  accountHolder: string;
  bank: string;
  accountNumber: string;
  ssnFront: string;
  ssnBack: string;
}

export function useEditProfile() {
  const { user } = useAuth();

  const [formData, setFormData] = useState<EditProfileFormData>({
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

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isAccountHolderVerified, setIsAccountHolderVerified] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showVerifiedBadge, setShowVerifiedBadge] = useState(false);
  const expectingVerificationRef = useRef(false);

  // 유저 데이터 로드
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

  // 계좌 정보 변경 시 인증 상태 동기화
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

  // 전화번호 인증 완료 시 뱃지 표시
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
    setTimer(240);
  };

  const handleVerify = () => {
    expectingVerificationRef.current = true;
    handleVerifyCode();
  };

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
      const accountIndex = accounts.findIndex((a) => a.id === user?.id || a.email === user?.email);

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

      // mock API에 프로필 저장 (best-effort)
      if (user?.id) {
        const reviewerIdNum = user.id.includes("kakao") ? 1 : user.id.includes("naver") ? 2 : 1;
        patchReviewerProfile(reviewerIdNum, {
          name: formData.name,
          nickname: formData.nickname,
          phone,
          postal_code: formData.postalCode,
          address: formData.address,
          detail_address: formData.detailAddress,
          bank: formData.bank,
          account_number: formData.accountNumber,
          account_holder: formData.accountHolder,
          ssn_front: formData.ssnFront,
          ssn_back: formData.ssnBack,
        }).catch(() => {});
      }

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

  return {
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
    // 전화번호 인증
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
  };
}
