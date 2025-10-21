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
import Image from "next/image";
import styles from "../../../../styles/user/mypage/edit_profile.module.css";
import SubHeader from "@/components/fragments/SubHeader";

export default function EditProfilePage() {
  const router = useRouter();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    nickname: "양치하는고양이123456",
    name: "홍길동",
    email: "gdhong@naver.com",
    phone: "",
    postalCode: "13561",
    address: "경기 성남시 분당구 정자일로 95",
    detailAddress: "",
    serviceName: "NAVER",
    accountHolder: "홍길동",
    bank: "우리은행",
    accountNumber: "000000000000",
    ssnFront: "801212",
    ssnBack: "",
  });

  const [isPhoneVerified, setIsPhoneVerified] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  // 휴대폰 번호 전용 핸들러
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // 숫자만 추출
    const numbersOnly = value.replace(/[^0-9]/g, "");

    // 11자리 제한
    const limitedNumbers = numbersOnly.slice(0, 11);

    // 하이픈 자동 추가
    let formattedPhone = "";
    if (limitedNumbers.length >= 1) {
      formattedPhone = limitedNumbers.slice(0, 3);
      if (limitedNumbers.length >= 4) {
        formattedPhone += "-" + limitedNumbers.slice(3, 7);
        if (limitedNumbers.length >= 8) {
          formattedPhone += "-" + limitedNumbers.slice(7, 11);
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      phone: formattedPhone,
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

  const handleProfilePhotoUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // 파일 크기 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
          alert("파일 크기는 5MB 이하여야 합니다.");
          return;
        }

        // 이미지 파일 타입 체크
        if (!file.type.startsWith("image/")) {
          alert("이미지 파일만 업로드 가능합니다.");
          return;
        }

        setIsUploading(true);

        // 파일을 미리보기용 URL로 변환
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target?.result as string);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleRemoveProfilePhoto = () => {
    setProfileImage(null);
  };

  // 메인 헤더 숨기기 (캠페인 상세와 동일 동작)
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

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

          <article className={styles.field_article}>
            <label className={styles.field_label}>프로필 사진</label>
            <div className={styles.profile_upload_container}>
              <div className={styles.profile_image_wrapper}>
                <div className={styles.profile_image}>
                  {profileImage ? (
                    <img src={profileImage} alt="프로필 사진" />
                  ) : (
                    <div className={styles.default_avatar}>
                      <div className={styles.emoji_dots}>
                        <div className={styles.emoji_dot} />
                        <div className={styles.emoji_dot} />
                      </div>
                      <div className={styles.emoji_mouth} />
                    </div>
                  )}
                  {isUploading && (
                    <div className={styles.upload_loading}>
                      <div className={styles.loading_spinner} />
                    </div>
                  )}
                </div>
                <div
                  className={styles.photo_upload_icon}
                  onClick={handleProfilePhotoUpload}
                  title="프로필 사진 변경"
                >
                  <Image
                    src="/images/icons/refresh_icon.svg"
                    alt="프로필 사진 업로드"
                    width={12}
                    height={12}
                  />
                </div>
                {profileImage && (
                  <div
                    className={styles.photo_remove_icon}
                    onClick={handleRemoveProfilePhoto}
                    title="프로필 사진 삭제"
                  >
                    <Image
                      src="/images/icons/close_x_small.svg"
                      alt="프로필 사진 삭제"
                      width={12}
                      height={12}
                    />
                  </div>
                )}
              </div>
            </div>
          </article>

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
            />
          </article>

          {/* 휴대폰 번호 */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="phone">
              휴대폰 번호<span className={styles.required_asterisk}>*</span>
            </label>
            <div className={styles.input_with_button}>
              <div className={styles.phone_input_container}>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className={styles.input_field}
                  value={formData.phone}
                  onChange={handlePhoneInputChange}
                  placeholder="010-0000-0000"
                />
                {isPhoneVerified && (
                  <div className={styles.phone_check_icon}>
                    <Image
                      src="/images/icons/phone_verified.svg"
                      alt="인증 완료"
                      width={16}
                      height={16}
                    />
                  </div>
                )}
              </div>
              <button
                className={styles.verification_button}
                onClick={handleVerificationRequest}
              >
                인증번호 받기
              </button>
            </div>
          </article>

          {/* 주소 */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="postalCode">
              주소<span className={styles.required_asterisk}>*</span>
            </label>
            <div className={styles.input_with_button}>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                className={styles.input_field}
                value={formData.postalCode}
                readOnly
              />
              <button
                className={styles.postal_button}
                onClick={handlePostalSearch}
              >
                우편번호 찾기
              </button>
            </div>
            <div className={styles.field_group}>
              <input
                type="text"
                id="address"
                name="address"
                className={styles.input_field}
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field_group}>
              <input
                type="text"
                id="detailAddress"
                name="detailAddress"
                className={styles.input_field}
                value={formData.detailAddress}
                onChange={handleInputChange}
                placeholder=""
              />
            </div>
          </article>

          {/* 본인 명의 계좌 정보 제목 !*/}
          <h3 className={styles.section_subtitle}>본인 명의 계좌 정보</h3>

          {/* 예금주 */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="accountHolder">
              예금주<span className={styles.required_asterisk}>*</span>
            </label>
            <input
              type="text"
              id="accountHolder"
              name="accountHolder"
              className={styles.input_field}
              value={formData.accountHolder}
              onChange={handleInputChange}
            />
          </article>

          {/* 은행 */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="bank">
              은행<span className={styles.required_asterisk}>*</span>
            </label>
            <input
              type="text"
              id="bank"
              name="bank"
              className={styles.input_field}
              value={formData.bank}
              onChange={handleInputChange}
            />
          </article>

          {/* 계좌번호 */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="accountNumber">
              계좌번호<span className={styles.required_asterisk}>*</span>
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              className={styles.input_field}
              value={formData.accountNumber}
              onChange={handleInputChange}
            />
          </article>

          {/* 주민등록번호 */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="ssnFront">
              주민등록번호<span className={styles.required_asterisk}>*</span>
            </label>
            <div className={styles.ssn_container}>
              <input
                type="text"
                id="ssnFront"
                name="ssnFront"
                className={styles.input_field}
                value={formData.ssnFront}
                onChange={handleInputChange}
                maxLength={6}
              />
              <span className={styles.ssn_separator}>-</span>
              <input
                type="password"
                id="ssnBack"
                name="ssnBack"
                className={styles.input_field}
                value={formData.ssnBack}
                onChange={handleInputChange}
                maxLength={7}
              />
            </div>
          </article>
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
