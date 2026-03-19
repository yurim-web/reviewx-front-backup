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
import {
  useReviewerProfile,
  useInvalidateReviewerProfile,
  getReviewerIdNum,
} from "@/hooks/user/mypage/useReviewerProfile";

const ACCOUNT_STORAGE_KEY = "userAccountVerification";

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
  const { data: profile } = useReviewerProfile(user?.id);
  const invalidateProfile = useInvalidateReviewerProfile();

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

  // 서버 프로필 데이터로 폼 초기화
  useEffect(() => {
    if (!user) return;

    const accountHolderValue = profile?.account_holder ?? "";
    const bankValue = profile?.bank ?? "";
    const accountNumberValue = profile?.account_number ?? "";

    setFormData((prev) => ({
      ...prev,
      nickname: profile?.nickname ?? user.nickname ?? user.name ?? "",
      name: profile?.name ?? user.name ?? "",
      email: profile?.email ?? user.email ?? "",
      postalCode: profile?.postal_code ?? user.postal_code ?? "",
      address: profile?.address ?? user.address ?? "",
      detailAddress: profile?.detail_address ?? user.detail_address ?? "",
      accountHolder: accountHolderValue,
      bank: bankValue,
      accountNumber: accountNumberValue,
      ssnFront: profile?.ssn_front ?? "",
      ssnBack: profile?.ssn_back ?? "",
    }));

    if (accountHolderValue.trim() && bankValue.trim() && String(accountNumberValue).trim()) {
      setIsAccountHolderVerified(true);
    }

    const phoneNumber = profile?.phone ?? user.phone;
    if (phoneNumber) {
      handlePhoneChangeHook(phoneNumber);
      setIsVerified(true);
      setIsVerificationRequested(true);
    }

    const DEFAULT_PROFILE = "/images/mypage/profile.svg";
    const profileImg = profile?.profile_image ?? user.profile_image;
    if (profileImg && profileImg !== DEFAULT_PROFILE) {
      setProfileImage(profileImg);
    }

    // 서버 프로필이 없으면 로컬 계좌 인증 데이터 폴백
    if (!profile) {
      try {
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
      } catch {
        // 무시
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile]);

  // 계좌 정보 변경 시 인증 상태 동기화
  useEffect(() => {
    if (!profile) return;

    const accountHolderValue = formData.accountHolder?.trim() ?? "";
    const bankValue = formData.bank?.trim() ?? "";
    const accountNumberValue = String(formData.accountNumber ?? "").trim();

    if (!accountHolderValue || !bankValue || !accountNumberValue) return;

    if (
      profile.account_holder === accountHolderValue &&
      profile.bank === bankValue &&
      profile.account_number === accountNumberValue
    ) {
      setIsAccountHolderVerified(true);
    }
  }, [formData.accountHolder, formData.bank, formData.accountNumber, profile]);

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

  const handleSave = async () => {
    if (!isSaveButtonEnabled) return;

    try {
      // auth 토큰 데이터 업데이트 (로컬 인증 정보)
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

      // 서버에 프로필 저장
      const reviewerIdNum = getReviewerIdNum(user?.id);
      if (reviewerIdNum) {
        await patchReviewerProfile(reviewerIdNum, {
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
        });
        invalidateProfile(user?.id);
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
