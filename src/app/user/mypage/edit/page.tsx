/* ========================================
   ✏️ 프로필 편집 페이지
   ======================================== */

/**
 * 프로필 편집 페이지
 *
 * 목적: 사용자의 개인정보를 수정할 수 있는 프로필 편집 페이지입니다.
 *
 * 페이지 경로:
 * - /user/mypage/edit
 *
 * 주요 기능:
 * - 프로필 사진 업로드/삭제
 * - 닉네임 수정
 * - 휴대폰 번호 인증
 * - 주소 정보 수정 (우편번호 검색)
 * - 본인 명의 계좌 정보 수정
 * - 주민등록번호 입력
 * - 폼 데이터 저장
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../../styles/user/mypage/edit_profile.module.css";
import SubHeader from "@/components/fragments/SubHeader";
// 공용 컴포넌트
import ProfilePhotoUpload from "@/components/common/mypage/ProfilePhotoUpload";
import PhoneVerificationInput from "@/components/common/mypage/PhoneVerificationInput";
import AddressInput from "@/components/common/mypage/AddressInput";
// 유저 전용 컴포넌트
import AccountInfoInput from "@/components/user/mypage/AccountInfoInput";
import SocialSecurityNumberInput from "@/components/user/mypage/SocialSecurityNumberInput";

export default function EditProfilePage() {
  const router = useRouter();

  // 은행 옵션 배열
  const bank_options = [
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

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    nickname: "",
    name: "",
    email: "",
    phone: "",
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

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 필수 입력 필드 검증 함수
  const validateRequiredFields = () => {
    const requiredFields = {
      phone: formData.phone.trim(),
      postalCode: formData.postalCode.trim(),
      address: formData.address.trim(),
      accountHolder: formData.accountHolder.trim(),
      bank: formData.bank.trim(),
      accountNumber: formData.accountNumber.trim(),
      ssnFront: formData.ssnFront.trim(),
      ssnBack: formData.ssnBack.trim(),
    };

    // 모든 필수 필드가 입력되었는지 확인
    return Object.values(requiredFields).every((value) => value.length > 0);
  };

  // 저장하기 버튼 활성화 상태
  const isSaveButtonEnabled = validateRequiredFields();

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // 휴대폰 번호 형식 검증
  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handleVerificationRequest = () => {
    // 휴대폰 번호 형식 검증
    if (!isValidPhoneNumber(formData.phone)) {
      alert("올바른 휴대폰 번호 형식을 입력해주세요. (예: 010-0000-0000)");
      return;
    }

    // 인증번호 요청 로직
    console.log("인증번호 요청");
  };

  const handlePostalSearch = () => {
    // 우편번호 검색 로직
    console.log("우편번호 검색");
  };

  const handleSave = () => {
    if (isSaveButtonEnabled) {
      // 저장 로직
      console.log("저장", formData);
    }
  };




  return (
    <div className={styles.edit_profile_container}>
      {/* 서브헤더 */}
      <SubHeader />
      {/* 메인 컨텐츠 */}
      <main className={styles.main_content}>
        <h1 className={styles.page_title}>내 정보 수정</h1>

        <section className={styles.section_container}>
          {/* 기본 정보 섹션 */}
          <h2 className={styles.section_title}>기본 정보</h2>

          {/* 프로필 사진 */}
          <ProfilePhotoUpload
            profileImage={profileImage}
            onImageChange={setProfileImage}
          />

          {/* 닉네임 */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="nickname">
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              className={styles.input_field}
              value={formData.nickname}
              onChange={handleInputChange}
              placeholder="{자동닉네임 혹은 네이버/카카오 닉네임}"
            />
          </article>

          {/* 이름 (비활성화) */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="name">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input_field}
              value={formData.name}
              disabled
              placeholder="{가입 시 등록한 이름}"
            />
          </article>

          {/* 이메일 (비활성화) */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="email">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input_field}
              value={formData.email}
              disabled
              placeholder="{가입 시 등록한 이메일}"
            />
          </article>

          {/* 휴대폰 번호 */}
          <PhoneVerificationInput
            phone={formData.phone}
            onPhoneChange={(phone) =>
              setFormData((prev) => ({ ...prev, phone }))
            }
            isVerified={isPhoneVerified}
            onVerificationRequest={handleVerificationRequest}
          />

          {/* 주소 */}
          <AddressInput
            postalCode={formData.postalCode}
            address={formData.address}
            detailAddress={formData.detailAddress}
            onPostalCodeChange={(value) =>
              setFormData((prev) => ({ ...prev, postalCode: value }))
            }
            onAddressChange={(value) =>
              setFormData((prev) => ({ ...prev, address: value }))
            }
            onDetailAddressChange={(value) =>
              setFormData((prev) => ({ ...prev, detailAddress: value }))
            }
            onPostalCodeSearch={handlePostalSearch}
            postalCodeReadOnly={true}
            showRequiredAsterisk={true}
          />

          {/* 본인 명의 계좌 정보 제목 */}
          <h3 className={styles.section_subtitle}>본인 명의 계좌 정보</h3>

          {/* 계좌 정보 */}
          <AccountInfoInput
            accountHolder={formData.accountHolder}
            bank={formData.bank}
            accountNumber={formData.accountNumber}
            onAccountHolderChange={(value) =>
              setFormData((prev) => ({ ...prev, accountHolder: value }))
            }
            onBankChange={(value) =>
              setFormData((prev) => ({ ...prev, bank: value }))
            }
            onAccountNumberChange={(value) =>
              setFormData((prev) => ({ ...prev, accountNumber: value }))
            }
            bankOptions={bank_options}
          />

          {/* 주민등록번호 */}
          <SocialSecurityNumberInput
            ssnFront={formData.ssnFront}
            ssnBack={formData.ssnBack}
            onSsnFrontChange={(value) =>
              setFormData((prev) => ({ ...prev, ssnFront: value }))
            }
            onSsnBackChange={(value) =>
              setFormData((prev) => ({ ...prev, ssnBack: value }))
            }
          />
        </section>
        <div className={styles.save_button_container}>
          {/* 저장하기 버튼 */}
          <button
            className={`${styles.save_button} ${
              !isSaveButtonEnabled ? styles.disabled_button : ""
            }`}
            onClick={handleSave}
            disabled={!isSaveButtonEnabled}
          >
            저장하기
          </button>
        </div>
      </main>
    </div>
  );
}
