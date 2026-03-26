/* ========================================
   파트너 내 정보 수정 페이지
   ======================================== */

/**
 * 파트너 내 정보 수정 페이지
 *
 * 목적: 파트너가 자신의 계정 정보를 수정하는 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/mypage/edit
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import layoutStyles from "@/styles/user/mypage/edit_profile/edit_profile_layout.module.css";
import inputStyles from "../../../../styles/user/mypage/edit_profile/inputs.module.css";
import buttonStyles from "../../../../styles/user/mypage/edit_profile/profile_buttons.module.css";
import ProfilePhotoUpload from "@/components/common/mypage/ProfilePhotoUpload";
import PhoneVerification from "@/components/common/phone_verification/PhoneVerification";
import BusinessDocumentUpload from "@/components/partner/mypage/BusinessDocumentUpload";
import AddressInput from "@/components/common/mypage/AddressInput";
import WithdrawModals from "@/components/common/mypage/WithdrawModals";
import Toast from "@/components/common/toast/Toast";
import BusinessNumberInput from "@/components/common/signup/BusinessNumberInput";
import ContactPhoneInput from "@/components/common/signup/ContactPhoneInput";
import Loading from "@/app/loading";
import { withPartnerAuth } from "@/components/auth/withAuth";
import { formatPhoneNumber } from "@/utils/formatting/phone";
import { usePhoneVerification } from "@/hooks/usePhoneVerification/usePhoneVerification";
import {
  usePartnerProfile,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useDeleteProfileImageMutation,
  useUploadBusinessDocumentMutation,
  useWithdrawMutation,
} from "@/hooks/partner/mypage/usePartnerMypage";

/**
 * 파트너 내 정보 수정 페이지 컴포넌트
 */
function PartnerEditProfilePage() {
  const router = useRouter();

  // API 훅
  const { data: profile, isLoading } = usePartnerProfile();
  const updateMutation = useUpdateProfileMutation();
  const uploadImageMutation = useUploadProfileImageMutation();
  const deleteImageMutation = useDeleteProfileImageMutation();
  const uploadDocMutation = useUploadBusinessDocumentMutation();
  const withdrawMutation = useWithdrawMutation();

  // 폼 데이터 state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    contactPhone: "",
    companyName: "",
    ownerName: "",
    businessNumber: "",
    businessType: "법인사업자",
    businessDocument: "사업자등록증.pdf",
    postalCode: "",
    address: "",
    detailAddress: "",
  });

  // 휴대폰 인증 훅
  const {
    phone,
    setPhone,
    verificationCode,
    isVerified: isPhoneVerified,
    isVerificationRequested,
    timer,
    phoneError,
    verificationCodeError,
    handlePhoneChange,
    handleVerificationCodeChange,
    handleVerificationRequest,
    handleVerifyCode,
  } = usePhoneVerification();

  // 회원 탈퇴 모달 상태
  const [isWithdrawConfirmModalOpen, setIsWithdrawConfirmModalOpen] = useState(false);
  const [isWithdrawCompleteModalOpen, setIsWithdrawCompleteModalOpen] = useState(false);
  const [isWithdrawBlockedModalOpen, setIsWithdrawBlockedModalOpen] = useState(false);

  const [isBusinessDocumentUploaded, setIsBusinessDocumentUploaded] = useState(false);
  const [hasSelectedNewFileThisSession, setHasSelectedNewFileThisSession] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [contactPhoneError, setContactPhoneError] = useState<string | undefined>(undefined);
  const [pendingBusinessDocFile, setPendingBusinessDocFile] = useState<File | null>(null);
  const [pendingProfileImageFile, setPendingProfileImageFile] = useState<File | null>(null);

  // Toast 상태
  const [showToast, setShowToast] = useState(false);

  // 프로필 데이터로 폼 초기화
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.representativeName || profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        contactPhone: formatPhoneNumber(profile.contactPhone || profile.phone || ""),
        companyName: profile.businessName || "",
        ownerName: profile.representativeName || profile.name || "",
        businessNumber: profile.businessNumber || "",
        businessType: profile.businessType || "법인사업자",
        businessDocument: profile.businessDocumentFileName || "사업자등록증.pdf",
        postalCode: profile.postalCode || "",
        address: profile.address || "",
        detailAddress: profile.detailAddress || "",
      });
      if (profile.businessDocumentFileName) {
        setIsBusinessDocumentUploaded(true);
      }
      if (profile.profileImage) {
        setProfileImage(profile.profileImage);
      }
      // 휴대폰 인증 훅에 기존 번호 설정
      if (profile.phone) {
        setPhone(formatPhoneNumber(profile.phone));
      }
    }
  }, [profile, setPhone]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      handlePhoneChange(value);
      setFormData((prev) => ({ ...prev, phone: value }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostalCodeSearch = () => {
    // TODO: 다음/카카오 주소 API 연동
  };

  const handleBusinessDocumentSelect = (file: File | null) => {
    if (!file) {
      setIsBusinessDocumentUploaded(false);
      setHasSelectedNewFileThisSession(true);
      setPendingBusinessDocFile(null);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      businessDocument: file.name,
    }));
    setIsBusinessDocumentUploaded(false);
    setHasSelectedNewFileThisSession(true);
    setPendingBusinessDocFile(file);
  };

  /** 프로필 사진 변경 핸들러 */
  const handleProfileImageChange = async (imageDataOrNull: string | null) => {
    if (imageDataOrNull === null) {
      // 사진 삭제
      try {
        await deleteImageMutation.mutateAsync();
        setProfileImage(null);
        setPendingProfileImageFile(null);
      } catch {
        // 삭제 실패 시 무시
      }
    } else {
      // 사진 변경 — 프리뷰 설정 + File 객체 생성 (저장 시 업로드)
      setProfileImage(imageDataOrNull);
      try {
        const res = await fetch(imageDataOrNull);
        const blob = await res.blob();
        const file = new File([blob], "profile-image.jpg", { type: blob.type });
        setPendingProfileImageFile(file);
      } catch {
        // data URL → File 변환 실패 시 무시
      }
    }
  };

  const isSaveEnabled = formData.phone.trim().length > 0;

  // 저장 핸들러 — API 호출
  const handleSave = async () => {
    try {
      // 1. 사업자등록증 파일이 있으면 먼저 업로드
      if (pendingBusinessDocFile) {
        await uploadDocMutation.mutateAsync(pendingBusinessDocFile);
        setPendingBusinessDocFile(null);
      }

      // 2. 프로필 사진이 변경되었으면 업로드
      if (pendingProfileImageFile) {
        await uploadImageMutation.mutateAsync(pendingProfileImageFile);
        setPendingProfileImageFile(null);
      }

      // 3. 내 정보 수정 API 호출
      await updateMutation.mutateAsync({
        phone: formData.phone,
        businessName: formData.companyName,
        representativeName: formData.ownerName,
        businessNumber: formData.businessNumber,
        businessType: formData.businessType as "법인사업자" | "개인사업자",
        postalCode: formData.postalCode,
        address: formData.address,
        detailAddress: formData.detailAddress,
        contactPhone: formData.contactPhone,
      });

      setShowToast(true);
      setIsBusinessDocumentUploaded(true);
      setHasSelectedNewFileThisSession(false);
    } catch {
      alert("정보 저장에 실패했습니다.");
    }
  };

  // 회원 탈퇴 핸들러
  const handleWithdraw = () => {
    setIsWithdrawConfirmModalOpen(true);
  };

  const handleWithdrawConfirm = async () => {
    setIsWithdrawConfirmModalOpen(false);
    try {
      await withdrawMutation.mutateAsync(undefined);
      setIsWithdrawCompleteModalOpen(true);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        setIsWithdrawBlockedModalOpen(true);
      }
    }
  };

  const handleWithdrawComplete = () => {
    setIsWithdrawCompleteModalOpen(false);
    router.push("/partner");
  };

  if (isLoading) return <Loading />;

  return (
    <div className={layoutStyles.edit_profile_container}>
      <PartnerSubHeader />
      <main className={layoutStyles.main_content}>
        <PageTitle title="내 정보 수정" />

        <section className={layoutStyles.section_container}>
          {/* 기본 정보 섹션 */}
          <h2 className={layoutStyles.section_title}>기본 정보</h2>

          {/* 프로필 사진 */}
          <ProfilePhotoUpload
            profileImage={profileImage}
            onImageChange={handleProfileImageChange}
          />

          {/* 이름 (읽기 전용) */}
          <article className={layoutStyles.field_article}>
            <label className={inputStyles.field_label} htmlFor="name">
              이름
            </label>
            <input
              id="name"
              name="name"
              className={inputStyles.input_field}
              value={formData.name}
              disabled
            />
          </article>

          {/* 이메일 (읽기 전용) */}
          <article className={layoutStyles.field_article}>
            <label className={inputStyles.field_label} htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={inputStyles.input_field}
              value={formData.email}
              disabled
            />
          </article>

          {/* 휴대폰 번호 (수정 가능) */}
          <PhoneVerification
            phone={phone}
            isPhoneVerified={isPhoneVerified}
            error={phoneError}
            onPhoneChange={(newPhone) => {
              handlePhoneChange(newPhone);
              setFormData((prev) => ({ ...prev, phone: newPhone }));
            }}
            verificationCode={verificationCode}
            isVerificationRequested={isVerificationRequested}
            timer={timer}
            verificationCodeError={verificationCodeError}
            onVerificationRequest={handleVerificationRequest}
            onVerify={handleVerifyCode}
            onVerificationCodeChange={handleVerificationCodeChange}
            useMyPageStyle={true}
            showVerificationCode={true}
          />

          {/* 사업자 정보 섹션 */}
          <h3 className={layoutStyles.section_subtitle}>사업자 정보</h3>

          {/* 상호명 (수정 가능) */}
          <article className={layoutStyles.field_article}>
            <label className={inputStyles.field_label} htmlFor="companyName">
              상호명
            </label>
            <input
              id="companyName"
              name="companyName"
              className={inputStyles.input_field}
              value={formData.companyName}
              onChange={handleInputChange}
            />
          </article>

          {/* 대표자명 (수정 가능) */}
          <article className={layoutStyles.field_article}>
            <label className={inputStyles.field_label} htmlFor="ownerName">
              대표자명
            </label>
            <input
              id="ownerName"
              name="ownerName"
              className={inputStyles.input_field}
              value={formData.ownerName}
              onChange={handleInputChange}
            />
          </article>

          {/* 사업자등록번호 (수정 가능) */}
          <BusinessNumberInput
            id="businessNumber"
            label="사업자등록번호"
            value={formData.businessNumber}
            onChange={(value) => setFormData((prev) => ({ ...prev, businessNumber: value }))}
            wrapperClassName={layoutStyles.field_article}
            labelClassName={inputStyles.field_label}
            inputClassName={inputStyles.input_field}
          />

          {/* 사업자등록증 */}
          <BusinessDocumentUpload
            fileName={formData.businessDocument}
            isUploaded={
              (isBusinessDocumentUploaded || !!formData.businessDocument?.trim()) &&
              !hasSelectedNewFileThisSession
            }
            onFileSelect={handleBusinessDocumentSelect}
            onSelectClick={() => setHasSelectedNewFileThisSession(true)}
          />

          {/* 주소 입력 */}
          <AddressInput
            postalCode={formData.postalCode}
            address={formData.address}
            detailAddress={formData.detailAddress}
            onPostalCodeChange={(value) => setFormData((prev) => ({ ...prev, postalCode: value }))}
            onAddressChange={(value) => setFormData((prev) => ({ ...prev, address: value }))}
            onDetailAddressChange={(value) =>
              setFormData((prev) => ({ ...prev, detailAddress: value }))
            }
            onPostalCodeSearch={handlePostalCodeSearch}
          />

          {/* 담당자 정보 섹션 */}
          <h3 className={layoutStyles.section_subtitle}>담당자 정보</h3>

          {/* 문의 담당자 휴대폰 번호 */}
          <ContactPhoneInput
            id="contactPhone"
            label="문의 담당자 휴대폰 번호"
            value={formData.contactPhone}
            error={contactPhoneError}
            onChange={(value) => setFormData((prev) => ({ ...prev, contactPhone: value }))}
            onErrorChange={setContactPhoneError}
            placeholder="- 제외 입력"
            wrapperClassName={layoutStyles.field_article}
            labelClassName={inputStyles.field_label}
            inputClassName={inputStyles.input_field}
          />

          {/* 회원탈퇴 버튼 */}
          <div className={buttonStyles.withdraw_button_container}>
            <button type="button" className={buttonStyles.withdraw_button} onClick={handleWithdraw}>
              회원 탈퇴
            </button>
          </div>
        </section>

        {/* 저장 버튼 */}
        <div className={buttonStyles.save_button_container}>
          <button
            className={`${buttonStyles.save_button} ${
              !isSaveEnabled ? buttonStyles.disabled_button : ""
            }`}
            disabled={!isSaveEnabled}
            onClick={handleSave}
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
      />

      {/* 저장 완료 토스트 메시지 */}
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

// 파트너 전용 페이지로 보호
export default withPartnerAuth(PartnerEditProfilePage);
