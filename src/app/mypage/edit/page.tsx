"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../styles/mypage/edit_profile.module.css";
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
    ssnBack: "●  ●  ●  ●  ●  ●  ●",
  });

  const [isPhoneVerified, setIsPhoneVerified] = useState(true);

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
    // 프로필 사진 업로드 로직
    console.log("프로필 사진 업로드");
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

        {/* 기본 정보 섹션 */}
        <h2 className={styles.section_title}>기본 정보</h2>

        {/* 프로필 사진 */}
        <div className={styles.profile_photo_section}>
          <label className={styles.field_label}>프로필 사진</label>
          <div className={styles.profile_upload_container}>
            <div className={styles.profile_image_wrapper}>
              <div className={styles.profile_image}>
                <div className={styles.emoji_dots}>
                  <div className={styles.emoji_dot} />
                  <div className={styles.emoji_dot} />
                </div>
                <div className={styles.emoji_mouth} />
              </div>
              <div
                className={styles.photo_upload_icon}
                onClick={handleProfilePhotoUpload}
              />
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
            <input
              type="text"
              id="phone"
              name="phone"
              className={styles.input_field}
              value={formData.phone}
              onChange={handleInputChange}
            />
            <button
              className={`${styles.verification_button} ${
                isPhoneVerified ? styles.verified : ""
              }`}
              onClick={handleVerificationRequest}
            >
              {isPhoneVerified ? (
                <>
                  인증번호 받기
                  <span className={styles.verification_icon}>✓</span>
                </>
              ) : (
                "인증번호 받기"
              )}
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
            placeholder="상세 주소"
          />
        </div>

        {/* 서비스 이름 */}
        <div className={styles.field_group}>
          <input
            type="text"
            id="serviceName"
            name="serviceName"
            className={styles.input_field}
            value={formData.serviceName}
            onChange={handleInputChange}
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
              type="text"
              id="ssnBack"
              name="ssnBack"
              className={styles.input_field}
              value={formData.ssnBack}
              disabled
            />
          </div>
        </div>

        {/* 저장하기 버튼 */}
        <button className={styles.save_button} onClick={handleSave}>
          저장하기
        </button>
      </main>
    </div>
  );
}
