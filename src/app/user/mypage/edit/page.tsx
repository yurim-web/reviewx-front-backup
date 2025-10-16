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

export default function EditProfilePage() {
  const router = useRouter();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    nickname: "양치하는고양이123456",
    name: "홍길동",
    email: "gdhong@naver.com",
    phone: "010-1234-5678",
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

  const handleVerificationRequest = () => {
    // 인증번호 요청 로직
    console.log("인증번호 요청");
  };

  const handlePostalSearch = () => {
    // 우편번호 검색 로직
    console.log("우편번호 검색");
  };

  const handleSave = () => {
    // 저장 로직
    console.log("저장", formData);
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
        <div className={styles.divider} />
        <section className={styles.section_container}>
          {/* 기본 정보 섹션 */}
          <h2 className={styles.section_title}>기본 정보</h2>

          {/* 프로필 사진 */}
          <div className={styles.profile_photo_section}>
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
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1V11M1 6H11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                {profileImage && (
                  <div
                    className={styles.photo_remove_icon}
                    onClick={handleRemoveProfilePhoto}
                    title="프로필 사진 삭제"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M9 3L3 9M3 3L9 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 닉네임 */}
          <div className={styles.field_group}>
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
          </div>

          {/* 이름 (비활성화) */}
          <div className={styles.field_group}>
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
          </div>

          {/* 이메일 (비활성화) */}
          <div className={styles.field_group}>
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
          </div>

          {/* 휴대폰 번호 */}
          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="phone">
              휴대폰 번호
            </label>
            <div className={styles.input_with_button}>
              <div className={styles.phone_input_container}>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className={styles.input_field}
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {isPhoneVerified && (
                  <div className={styles.phone_check_icon}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_267_133)">
                        <path
                          d="M8 15C8.91942 15.0011 9.83 14.8206 10.6794 14.4687C11.5289 14.1169 12.3004 13.6006 12.9497 12.9497C13.6006 12.3004 14.1169 11.5289 14.4687 10.6794C14.8206 9.83 15.0011 8.91942 15 8C15.0011 7.08058 14.8206 6.17 14.4687 5.32057C14.1169 4.47115 13.6006 3.69961 12.9497 3.0503C12.3004 2.39936 11.5289 1.88313 10.6794 1.53128C9.83 1.17942 8.91942 0.998872 8 1.00001C7.08058 0.998872 6.17 1.17942 5.32057 1.53128C4.47115 1.88313 3.69961 2.39936 3.0503 3.0503C2.39936 3.69961 1.88313 4.47115 1.53128 5.32057C1.17942 6.17 0.998872 7.08058 1.00001 8C0.998872 8.91942 1.17942 9.83 1.53128 10.6794C1.88313 11.5289 2.39936 12.3004 3.0503 12.9497C3.69961 13.6006 4.47115 14.1169 5.32057 14.4687C6.17 14.8206 7.08058 15.0011 8 15Z"
                          stroke="#2DC469"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 8L7 10L11 6"
                          stroke="#2DC469"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_267_133">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
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
          </div>

          {/* 주소 */}
          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="postalCode">
              주소
            </label>
            <div className={styles.input_with_button}>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                className={styles.input_field}
                value={formData.postalCode}
                disabled
              />
              <button
                className={styles.postal_button}
                onClick={handlePostalSearch}
              >
                우편번호 찾기
              </button>
            </div>
          </div>

          {/* 주소 상세 */}
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

          {/* 상세 주소 */}
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

          {/* 본인 명의 계좌 정보 */}
          <h3 className={styles.section_subtitle}>본인 명의 계좌 정보</h3>

          {/* 예금주 */}
          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="accountHolder">
              예금주
            </label>
            <input
              type="text"
              id="accountHolder"
              name="accountHolder"
              className={styles.input_field}
              value={formData.accountHolder}
              onChange={handleInputChange}
            />
          </div>

          {/* 은행 */}
          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="bank">
              은행
            </label>
            <input
              type="text"
              id="bank"
              name="bank"
              className={styles.input_field}
              value={formData.bank}
              onChange={handleInputChange}
            />
          </div>

          {/* 계좌번호 */}
          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="accountNumber">
              계좌번호
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              className={styles.input_field}
              value={formData.accountNumber}
              onChange={handleInputChange}
            />
          </div>

          {/* 주민등록번호 */}
          <div className={styles.field_group}>
            <label className={styles.field_label} htmlFor="ssnFront">
              주민등록번호
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
          </div>
        </section>
        <div className={styles.save_button_container}>
          {/* 저장하기 버튼 */}
          <button className={styles.save_button} onClick={handleSave}>
            저장하기
          </button>
        </div>
      </main>
    </div>
  );
}
