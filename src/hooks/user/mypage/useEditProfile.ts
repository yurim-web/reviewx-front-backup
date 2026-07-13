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
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { usePhoneVerification } from "@/hooks/usePhoneVerification/usePhoneVerification";
import { patchReviewerProfile, fetchReviewerEdit } from "@/lib/api/reviewer";
import {
  useInvalidateReviewerProfile,
  getReviewerIdNum,
} from "@/hooks/user/mypage/useReviewerProfile";

const ACCOUNT_STORAGE_KEY = "userAccountVerification";

const STATIC_EDIT_FALLBACK = {
  postalCode: "06236",
  address: "서울특별시 강남구 테헤란로 152",
  detailAddress: "7층 701호",
  phone: "010-1234-5678",
  bank: "국민은행",
  accountNumber: "123456-78-901234",
};

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
  const { data: editData } = useQuery({
    queryKey: ["reviewerEdit"],
    queryFn: fetchReviewerEdit,
    enabled: !!user,
    staleTime: 30_000,
  });
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

    const accountHolderValue =
      editData?.bankAccount?.accountHolder ?? (editData ? "" : (user.name ?? ""));
    const bankValue =
      editData?.bankAccount?.bankName ?? (editData ? "" : STATIC_EDIT_FALLBACK.bank);
    const accountNumberValue =
      editData?.bankAccount?.accountNumber ?? (editData ? "" : STATIC_EDIT_FALLBACK.accountNumber);

    setFormData((prev) => ({
      ...prev,
      nickname: user.nickname ?? user.name ?? "",
      name: editData?.user?.name ?? user.name ?? "",
      email: editData?.user?.email ?? user.email ?? "",
      postalCode:
        editData?.address?.zipCode ??
        user.postal_code ??
        (editData ? "" : STATIC_EDIT_FALLBACK.postalCode),
      address:
        editData?.address?.address ??
        user.address ??
        (editData ? "" : STATIC_EDIT_FALLBACK.address),
      detailAddress:
        editData?.address?.addressDetail ??
        user.detail_address ??
        (editData ? "" : STATIC_EDIT_FALLBACK.detailAddress),
      accountHolder: accountHolderValue,
      bank: bankValue,
      accountNumber: accountNumberValue,
      ssnFront: "",
      ssnBack: "",
    }));

    if (accountHolderValue.trim() && bankValue.trim() && String(accountNumberValue).trim()) {
      setIsAccountHolderVerified(true);
    }

    const phoneNumber =
      editData?.user?.phoneNum ?? user.phone ?? (editData ? "" : STATIC_EDIT_FALLBACK.phone);
    if (phoneNumber) {
      handlePhoneChangeHook(phoneNumber);
      setIsVerified(true);
      setIsVerificationRequested(true);
    }

    const DEFAULT_PROFILE = "/images/mypage/profile.svg";
    const profileImg = editData?.user?.profileImageUrl ?? user.profile_image;
    if (profileImg && profileImg !== DEFAULT_PROFILE) {
      setProfileImage(profileImg);
    }

    // 서버 데이터가 없으면 로컬 계좌 인증 데이터 폴백
    if (!editData) {
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
  }, [user, editData]);

  // 계좌 정보 변경 시 인증 상태 동기화
  useEffect(() => {
    if (!editData) return;

    const accountHolderValue = formData.accountHolder?.trim() ?? "";
    const bankValue = formData.bank?.trim() ?? "";
    const accountNumberValue = String(formData.accountNumber ?? "").trim();

    if (!accountHolderValue || !bankValue || !accountNumberValue) return;

    if (
      editData.bankAccount?.accountHolder === accountHolderValue &&
      editData.bankAccount?.bankName === bankValue &&
      editData.bankAccount?.accountNumber === accountNumberValue
    ) {
      setIsAccountHolderVerified(true);
    }
  }, [formData.accountHolder, formData.bank, formData.accountNumber, editData]);

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

      // 서버에 프로필 저장 (R-32: POST /user/mypage/edit — camelCase)
      const reviewerIdNum = getReviewerIdNum(user?.id);
      if (reviewerIdNum) {
        await patchReviewerProfile(reviewerIdNum, {
          name: formData.name,
          nickname: formData.nickname,
          phone,
          postNumber: formData.postalCode,
          address: formData.address,
          addressDetail: formData.detailAddress,
          bankName: formData.bank,
          accountNumber: formData.accountNumber,
          accountHolder: formData.accountHolder,
          residentRegNo:
            formData.ssnFront && formData.ssnBack
              ? `${formData.ssnFront}-${formData.ssnBack}`
              : undefined,
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
