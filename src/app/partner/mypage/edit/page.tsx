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
import { useAuth } from "@/hooks/useAuth";
import { withPartnerAuth } from "@/components/auth/withAuth";
import { usePhoneVerification } from "@/hooks/usePhoneVerification/usePhoneVerification";
import { useWithdrawFlow } from "@/hooks/useWithdrawFlow";

interface PartnerAccount {
  id?: string;
  email?: string;
  name?: string;
  phone?: string;
  business_name?: string;
  business_number?: string;
  business_type?: string;
  representative_name?: string;
  postal_code?: string;
  address?: string;
  detail_address?: string;
  contact_phone?: string;
  division?: string;
  profile_image?: string;
  join_date?: string;
  business_document_file_name?: string;
}

/**
 * 파트너 내 정보 수정 페이지 컴포넌트
 */
function PartnerEditProfilePage() {
  // Next.js 라우터 훅
  const router = useRouter();
  const { user } = useAuth();

  // 폼 데이터 state - 로그인된 사용자 정보로 초기화
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    contactPhone: user?.phone || "",
    companyName: user?.business_name || "",
    ownerName: user?.name || "",
    businessNumber: user?.business_number || "",
    businessType: user?.business_type || "법인사업자",
    businessDocument: "사업자등록증.pdf", // 등록 완료 시 입력란에는 파일명 표시 (실제 파일명은 API 연동 시 user 등에서 로드)
    postalCode: "",
    address: "",
    detailAddress: "",
  });

  // 휴대폰 인증 훅
  const {
    phone,
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

  // 회원 탈퇴 플로우 훅
  const {
    isWithdrawConfirmModalOpen,
    isWithdrawCompleteModalOpen,
    isWithdrawBlockedModalOpen,
    setIsWithdrawConfirmModalOpen,
    setIsWithdrawCompleteModalOpen: _setIsWithdrawCompleteModalOpen,
    setIsWithdrawBlockedModalOpen,
    handleWithdraw,
    handleWithdrawConfirm,
    handleWithdrawComplete,
  } = useWithdrawFlow({
    redirectPath: "/partner",
    checkOngoingCampaigns: async () => {
      // TODO: 실제 API 연동 필요
      return false;
    },
  });

  const [isBusinessDocumentUploaded, setIsBusinessDocumentUploaded] = useState(false); // 사업자등록증 저장 완료 여부
  const [hasSelectedNewFileThisSession, setHasSelectedNewFileThisSession] = useState(false); // 이번 세션에서 파일 재선택 여부 (재선택 시 저장 전까지 파일명만 표시)
  const [profileImage, setProfileImage] = useState<string | null>(null); // 프로필 사진 미리보기 URL
  const [contactPhoneError, setContactPhoneError] = useState<string | undefined>(undefined); // 문의 담당자 휴대폰 번호 에러 메시지

  // Toast 상태
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 휴대폰 번호 입력 시: 훅의 핸들러 사용
    if (name === "phone") {
      handlePhoneChange(value);
      setFormData((prev) => ({ ...prev, phone: value }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * 우편번호 찾기 핸들러
   */
  const handlePostalCodeSearch = () => {
    // TODO: 다음/카카오 주소 API 연동
  };

  /**
   * 사업자등록증 파일 선택 핸들러
   * BusinessDocumentUpload 컴포넌트에서 호출됨
   * - 파일 선택 시 바로 partner_accounts에 파일명 반영 → 새로고침 후에도 등록한 파일명 유지
   */
  const handleBusinessDocumentSelect = (file: File | null) => {
    if (!file) {
      setIsBusinessDocumentUploaded(false);
      setHasSelectedNewFileThisSession(true);
      return;
    }
    const file_name = file.name;
    setFormData((prev) => ({
      ...prev,
      businessDocument: file_name,
    }));
    setIsBusinessDocumentUploaded(false);
    setHasSelectedNewFileThisSession(true); // 재선택했으므로 저장 전까지 파일명만 표시

    // 파일 선택 시점에 localStorage에 반영 (저장 버튼 없이 새로고침해도 파일명 유지)
    try {
      if (!user?.id) return;
      const storedAccounts = localStorage.getItem("partner_accounts");
      const accounts: PartnerAccount[] = storedAccounts ? JSON.parse(storedAccounts) : [];
      const accountIndex = accounts.findIndex(
        (a: { id?: string; email?: string }) => a.id === user.id || a.email === user.email
      );
      if (accountIndex >= 0) {
        accounts[accountIndex] = {
          ...accounts[accountIndex],
          business_document_file_name: file_name,
        };
        localStorage.setItem("partner_accounts", JSON.stringify(accounts));
      }
    } catch (_e) {
      // 사업자등록증 파일명 저장 실패 시 무시
    }
  };

  const isSaveEnabled = formData.phone.trim().length > 0;

  // 저장 핸들러
  const handleSave = () => {
    if (!user?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      // LocalStorage의 인증 사용자 정보 업데이트
      const authUser = localStorage.getItem("reviewx_auth_user");
      if (authUser) {
        const userData = JSON.parse(authUser);
        const updatedUser = {
          ...userData,
          name: formData.ownerName,
          phone: formData.phone,
          business_name: formData.companyName,
          business_number: formData.businessNumber,
          representative_name: formData.ownerName,
          contact_phone: formData.contactPhone,
          postal_code: formData.postalCode,
          address: formData.address,
          detail_address: formData.detailAddress,
          business_type: formData.businessType,
        };
        localStorage.setItem("reviewx_auth_user", JSON.stringify(updatedUser));
      }

      // 파트너 계정 목록도 업데이트
      const storedAccounts = localStorage.getItem("partner_accounts");
      const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];

      const accountIndex = (accounts as PartnerAccount[]).findIndex(
        (a) => a.id === user.id || a.email === user.email
      );

      const updatedAccount = {
        id: user.id || "partner_test_001",
        email: user.email || formData.email,
        name: formData.ownerName,
        phone: formData.phone,
        business_name: formData.companyName,
        business_number: formData.businessNumber,
        business_type: formData.businessType,
        representative_name: formData.ownerName,
        postal_code: formData.postalCode,
        address: formData.address,
        detail_address: formData.detailAddress,
        contact_phone: formData.contactPhone,
        division: formData.businessType === "개인사업자" ? "개인" : "법인",
        profile_image: profileImage, // 프로필 사진 저장
        join_date: new Date().toISOString().replace("T", " ").substring(0, 16),
        business_document_file_name: formData.businessDocument, // 사업자등록증 파일명 저장 (새로고침 후 복원)
      };

      // console.log('🖼️ [수정 페이지] 저장할 profileImage:', profileImage);
      // console.log('📝 [수정 페이지] updatedAccount:', updatedAccount);
      // console.log('📍 [수정 페이지] accountIndex:', accountIndex);

      if (accountIndex >= 0) {
        // 기존 계정 업데이트
        accounts[accountIndex] = {
          ...accounts[accountIndex],
          ...updatedAccount,
        };
        // console.log('🔄 [수정 페이지] 기존 계정 업데이트됨');
      } else {
        // 새 계정 추가
        accounts.push(updatedAccount);
        // console.log('➕ [수정 페이지] 새 계정 추가됨');
      }

      localStorage.setItem("partner_accounts", JSON.stringify(accounts));
      // console.log('✅ [수정 페이지] partner_accounts 저장 완료:', accounts);

      // 저장 성공 시 토스트 메시지 표시 및 등록 완료 배지 표시
      setShowToast(true);
      setIsBusinessDocumentUploaded(true);
      setHasSelectedNewFileThisSession(false); // 저장했으므로 다시 "등록 완료" 표시
    } catch (_error) {
      alert("정보 저장에 실패했습니다.");
    }
  };

  // partner_accounts에서 상세 정보 로드
  useEffect(() => {
    if (!user?.id) return;

    try {
      const storedAccounts = localStorage.getItem("partner_accounts");
      if (storedAccounts) {
        const accounts = JSON.parse(storedAccounts) as PartnerAccount[];
        const partnerAccount = accounts.find((a) => a.id === user.id || a.email === user.email);
        if (partnerAccount) {
          const savedFileName = partnerAccount.business_document_file_name;
          setFormData({
            name: partnerAccount.representative_name || partnerAccount.name || user.name || "",
            email: partnerAccount.email || user.email || "",
            phone: partnerAccount.phone || user.phone || "",
            contactPhone: partnerAccount.contact_phone || partnerAccount.phone || "",
            companyName: partnerAccount.business_name || user.business_name || "",
            ownerName: partnerAccount.representative_name || partnerAccount.name || user.name || "",
            businessNumber: partnerAccount.business_number || user.business_number || "",
            businessType: partnerAccount.business_type || "법인사업자",
            businessDocument: savedFileName || "사업자등록증.pdf",
            postalCode: partnerAccount.postal_code || "",
            address: partnerAccount.address || "",
            detailAddress: partnerAccount.detail_address || "",
          });
          // 저장된 파일이 있으면 등록 완료 배지 표시
          if (savedFileName) setIsBusinessDocumentUploaded(true);
          // 프로필 사진도 불러오기
          if (partnerAccount.profile_image) {
            setProfileImage(partnerAccount.profile_image);
          }
        }
      }
    } catch (_error) {
      // 파트너 계정 정보 로드 실패 시 무시
    }
  }, [user, user?.business_name]);

  return (
    <div className={layoutStyles.edit_profile_container}>
      <PartnerSubHeader />
      <main className={layoutStyles.main_content}>
        <PageTitle title="내 정보 수정" />

        <section className={layoutStyles.section_container}>
          {/* 기본 정보 섹션 */}
          <h2 className={layoutStyles.section_title}>기본 정보</h2>

          {/* 프로필 사진 */}
          <ProfilePhotoUpload profileImage={profileImage} onImageChange={setProfileImage} />

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

          {/* 사업자등록증 - 처음 진입 시 파일 있으면 등록 완료, 재선택 시 저장 전까지 파일명만 표시 */}
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
