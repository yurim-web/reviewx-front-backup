"use client";

/* ========================================
   ✏️ 파트너 내 정보 수정 페이지
   ======================================== */

/**
 * 목적: 파트너가 자신의 계정 정보를 수정하는 페이지입니다.
 * 경로: /partner/mypage/edit
 * 주요 기능: 프로필 사진, 기본 정보, 사업자 정보, 주소 정보 수정
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import SubHeader from "@/components/fragments/SubHeader";
import styles from "../../../../styles/user/mypage/edit_profile.module.css";

/**
 * 파트너 내 정보 수정 페이지 컴포넌트
 */
export default function PartnerEditProfilePage() {
  // 폼 데이터 state - 사용자가 입력한 모든 정보를 저장
  const [formData, setFormData] = useState({
    name: "아무개", // 이름
    email: "contact@cmcm.co.kr", // 이메일
    phone: "010-1234-5678", // 휴대폰 번호
    companyName: "주식회사 청명종합광고기획", // 상호명
    ownerName: "김민회", // 대표자명
    businessNumber: "122-86-125", // 사업자등록번호
    businessDocument: "등록 완료", // 사업자등록증 상태
    postalCode: "13561", // 우편번호
    address: "경기 성남시 분당구 정자일로 95", // 주소
    detailAddress: "NAVER", // 상세 주소
  });

  const [isPhoneVerified, setIsPhoneVerified] = useState(true); // 휴대폰 인증 완료 여부
  const [isBusinessDocumentUploaded, setIsBusinessDocumentUploaded] = useState(true); // 사업자등록증 업로드 여부
  const [selectedBusinessDocument, setSelectedBusinessDocument] = useState<File | null>(null); // 선택한 사업자등록증 파일
  const [profileImage, setProfileImage] = useState<string | null>(null); // 프로필 사진 미리보기 URL
  const [isUploading, setIsUploading] = useState(false); // 프로필 사진 업로드 중 여부

  /**
   * 일반 입력 필드 변경 핸들러
   * 구조분해할당으로 input의 name과 value를 가져옴
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * 휴대폰 번호 입력 핸들러
   * 숫자만 입력받고 자동으로 하이픈(-) 추가
   */
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbersOnly = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    let formatted = "";
    if (numbersOnly.length >= 1) {
      formatted = numbersOnly.slice(0, 3);
      if (numbersOnly.length >= 4) {
        formatted += "-" + numbersOnly.slice(3, 7);
        if (numbersOnly.length >= 8) {
          formatted += "-" + numbersOnly.slice(7, 11);
        }
      }
    }
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  /**
   * 휴대폰 번호 유효성 검사 함수
   * 정규식을 사용하여 010-XXXX-XXXX 형식인지 확인
   */
  const isValidPhoneNumber = (phone: string) => /^010-\d{4}-\d{4}$/.test(phone);

  /**
   * 인증번호 요청 핸들러
   * 휴대폰 번호가 올바른 형식인지 확인 후 인증번호 전송
   */
  const handleVerificationRequest = () => {
    if (!isValidPhoneNumber(formData.phone)) {
      alert("올바른 휴대폰 번호 형식을 입력해주세요. (예: 010-0000-0000)");
      return;
    }
    console.log("인증번호 요청");
  };

  /**
   * 우편번호 찾기 핸들러
   * 실제로는 다음/카카오 주소 API를 연동해야 함
   */
  const handlePostalCodeSearch = () => {
    console.log("우편번호 찾기");
    // TODO: 다음/카카오 주소 API 연동
  };

  /**
   * 사업자등록증 파일 선택 핸들러
   * 
   * 기능 설명:
   * 1. 동적으로 숨겨진 파일 입력(input) 요소를 생성합니다.
   * 2. 사용자가 파일을 선택하면 파일 선택 다이얼로그가 열립니다.
   * 3. 선택한 파일의 크기와 타입을 검증합니다.
   * 4. 검증이 통과하면 파일을 state에 저장하고 파일명을 표시합니다.
   * 
   * React 개념:
   * - document.createElement(): HTML 요소를 동적으로 생성하는 브라우저 API
   * - input.type = "file": 파일 선택 입력 필드로 설정
   * - input.accept: 허용할 파일 타입 지정 (예: "image/*", ".pdf")
   * - input.click(): 프로그래밍 방식으로 파일 선택 다이얼로그 열기
   * - FileReader API: 파일을 읽어서 미리보기나 업로드를 위한 데이터로 변환
   */
  const handleBusinessDocumentSelect = () => {
    // 숨겨진 파일 입력 요소를 동적으로 생성
    // 이렇게 하면 UI에 input 요소를 렌더링하지 않고도 파일 선택 기능을 사용할 수 있습니다.
    const input = document.createElement("input");
    input.type = "file"; // 파일 선택 입력 타입으로 설정
    // 허용할 파일 타입: 이미지 파일 (jpg, png, gif 등)과 PDF 파일
    input.accept = "image/*,.pdf";
    
    // 파일이 선택되었을 때 실행될 이벤트 핸들러
    input.onchange = (e) => {
      // 선택한 파일을 가져옵니다
      // files는 FileList 타입이므로, 첫 번째 파일을 가져오려면 [0] 인덱스를 사용합니다
      // Optional chaining(?.)을 사용하여 files가 없거나 비어있을 때를 안전하게 처리합니다
      const file = (e.target as HTMLInputElement).files?.[0];
      
      if (file) {
        // 파일 크기 검증: 10MB 제한
        // file.size는 바이트 단위이므로, 10MB = 10 * 1024 * 1024 바이트
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          alert("파일 크기는 10MB 이하여야 합니다.");
          return; // 함수 실행 중단
        }

        // 파일 타입 검증: 이미지 또는 PDF 파일만 허용
        // file.type은 MIME 타입을 반환합니다 (예: "image/jpeg", "application/pdf")
        const isValidType = 
          file.type.startsWith("image/") || // 이미지 파일 (image/jpeg, image/png 등)
          file.type === "application/pdf"; // PDF 파일
        
        if (!isValidType) {
          alert("이미지 파일 또는 PDF 파일만 업로드 가능합니다.");
          return; // 함수 실행 중단
        }

        // 검증이 통과하면 파일을 state에 저장
        setSelectedBusinessDocument(file);
        
        // 파일명을 표시하기 위해 formData 업데이트
        // file.name은 파일의 원본 이름입니다 (예: "사업자등록증.jpg")
        setFormData((prev) => ({
          ...prev,
          businessDocument: file.name, // 선택한 파일명으로 업데이트
        }));

        // 업로드 완료 상태로 변경
        setIsBusinessDocumentUploaded(true);

        // TODO: 실제 파일 업로드 API 호출
        // 여기서 FormData를 사용하여 서버로 파일을 전송할 수 있습니다:
        // const formData = new FormData();
        // formData.append("businessDocument", file);
        // await uploadBusinessDocument(formData);
        console.log("사업자등록증 파일 선택됨:", file.name);
      }
    };
    
    // 파일 선택 다이얼로그를 엽니다
    // 이 메서드를 호출하면 브라우저의 파일 선택 창이 나타납니다
    input.click();
  };

  /**
   * 프로필 사진 업로드 핸들러
   * 
   * 기능 설명:
   * 1. 동적으로 숨겨진 파일 입력(input) 요소를 생성합니다.
   * 2. 이미지 파일만 선택할 수 있도록 accept 속성을 설정합니다.
   * 3. 파일 크기와 타입을 검증합니다.
   * 4. 검증이 통과하면 FileReader API를 사용하여 이미지를 미리보기용 URL로 변환합니다.
   * 
   * React 개념:
   * - FileReader: 브라우저 API로 파일을 읽어서 데이터 URL이나 텍스트로 변환할 수 있습니다.
   * - readAsDataURL(): 파일을 Base64 인코딩된 데이터 URL로 변환합니다.
   * - 이렇게 하면 서버에 업로드하기 전에 클라이언트에서 이미지 미리보기를 할 수 있습니다.
   */
  const handleProfilePhotoUpload = () => {
    // 숨겨진 파일 입력 요소를 동적으로 생성
    const input = document.createElement("input");
    input.type = "file"; // 파일 선택 입력 타입으로 설정
    input.accept = "image/*"; // 이미지 파일만 허용 (*는 모든 이미지 타입을 의미)
    
    // 파일이 선택되었을 때 실행될 이벤트 핸들러
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      
      if (file) {
        // 파일 크기 검증: 5MB 제한
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          alert("파일 크기는 5MB 이하여야 합니다.");
          return;
        }

        // 이미지 파일 타입 검증
        if (!file.type.startsWith("image/")) {
          alert("이미지 파일만 업로드 가능합니다.");
          return;
        }

        // 업로드 중 상태로 변경
        setIsUploading(true);

        // FileReader API를 사용하여 파일을 데이터 URL로 변환
        // 이렇게 하면 이미지를 서버에 업로드하기 전에 미리보기를 할 수 있습니다.
        const reader = new FileReader();
        reader.onload = (e) => {
          // reader.result는 파일을 읽은 결과입니다 (Base64 인코딩된 데이터 URL)
          setProfileImage(e.target?.result as string);
          setIsUploading(false);
        };
        // 파일을 데이터 URL로 읽습니다
        reader.readAsDataURL(file);
      }
    };
    
    // 파일 선택 다이얼로그를 엽니다
    input.click();
  };

  /**
   * 프로필 사진 삭제 핸들러
   * 프로필 사진을 제거하고 기본 아바타로 되돌립니다.
   */
  const handleRemoveProfilePhoto = () => {
    setProfileImage(null);
  };

  /**
   * 저장 버튼 활성화 조건
   * 모든 필수 필드가 채워져 있는지 확인
   */
  const isSaveEnabled = formData.phone.trim().length > 0;

  /**
   * 메인 헤더 숨기기
   * useEffect 훅으로 컴포넌트 마운트 시 header 숨김
   */
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  return (
    <div className={styles.edit_profile_container}>
      <SubHeader />
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
                    unoptimized
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

          {/* 이름 (읽기 전용) */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="name">
              이름
            </label>
            <input
              id="name"
              name="name"
              className={styles.input_field}
              value={formData.name}
              disabled
            />
          </article>

          {/* 이메일 (읽기 전용) */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input_field}
              value={formData.email}
              disabled
            />
          </article>

          {/* 휴대폰 번호 (수정 가능) */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="phone">
              휴대폰 번호<span className={styles.required_asterisk}>*</span>
            </label>
            <div className={styles.input_with_button}>
              <div className={styles.phone_input_container}>
                <input
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

          {/* 사업자 정보 섹션 */}
          <h3 className={styles.section_subtitle}>사업자 정보</h3>

          {/* 상호명 (수정 가능) */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="companyName">
              상호명
            </label>
            <input
              id="companyName"
              name="companyName"
              className={styles.input_field}
              value={formData.companyName}
              onChange={handleInputChange}
            />
          </article>

          {/* 대표자명 (수정 가능) */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="ownerName">
              대표자명
            </label>
            <input
              id="ownerName"
              name="ownerName"
              className={styles.input_field}
              value={formData.ownerName}
              onChange={handleInputChange}
            />
          </article>

          {/* 사업자등록번호 (수정 가능) */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="businessNumber">
              사업자등록번호
            </label>
            <input
              id="businessNumber"
              name="businessNumber"
              className={styles.input_field}
              value={formData.businessNumber}
              onChange={handleInputChange}
            />
          </article>

          {/* 사업자등록증 */}
          <article className={styles.field_article}>
            <label className={styles.field_label}>사업자등록증</label>
            <div className={styles.input_with_button}>
              <div className={styles.phone_input_container}>
                <input
                  className={styles.input_field}
                  value={formData.businessDocument}
            
                />
                {isBusinessDocumentUploaded && (
                  <div className={styles.phone_check_icon}>
                    <Image
                      src="/images/icons/phone_verified.svg"
                      alt="업로드 완료"
                      width={16}
                      height={16}
                    />
                  </div>
                )}
              </div>
              <button
                className={styles.postal_button}
                onClick={handleBusinessDocumentSelect}
              >
                파일 선택
              </button>
            </div>
          </article>

          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="postalCode">
              주소
            </label>


            {/* 우편번호 */}
            <div className={styles.input_with_button}>
              <input
              id="postalCode"
              name="postalCode"
              type="text"
              className={styles.input_field}
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="우편번호"
            />
          </div>

          {/* 주소 */}
          <div className={styles.input_with_button}>
            <input
              id="address"
              name="address"
              type="text"
              className={styles.input_field}
              value={formData.address}  
              onChange={handleInputChange}
              placeholder="기본 주소"
            />
          </div>

          {/* 상세 주소 */}
          <div  className={styles.input_with_button}>
            <input
              id="detailAddress"
                name="detailAddress"
                type="text"
                className={styles.input_field}
                value={formData.detailAddress}
                onChange={handleInputChange}
                placeholder="상세 주소 입력"
              />
            </div>
             </article>

           


        </section>

        {/* 저장 버튼 */}
        <div className={styles.save_button_container}>
          <button
            className={`${styles.save_button} ${
              !isSaveEnabled ? styles.disabled_button : ""
            }`}
            disabled={!isSaveEnabled}
          >
            저장하기
          </button>
        </div>
      </main>
    </div>
  );
}
