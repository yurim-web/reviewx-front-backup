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
 * - 휴대폰 번호 인증 (usePhoneVerification 훅 사용)
 * - 주소 정보 수정 (우편번호 검색)
 * - 본인 명의 계좌 정보 수정
 * - 주민등록번호 입력
 * - 폼 데이터 저장
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../../styles/user/mypage/edit_profile.module.css";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
// 공용 컴포넌트
import ProfilePhotoUpload from "@/components/common/mypage/ProfilePhotoUpload";
import PhoneVerification from "@/components/common/phone_verification/PhoneVerification";
import AddressInput from "@/components/common/mypage/AddressInput";
// 유저 전용 컴포넌트
import AccountInfoInput from "@/components/user/mypage/AccountInfoInput";
import SocialSecurityNumberInput from "@/components/user/mypage/SocialSecurityNumberInput";
// 모달 컴포넌트
import BaseModal from "@/components/common/modal/BaseModal";
import ErrorText from "@/components/common/error_text/ErrorText";
// 휴대폰 인증 훅
import { usePhoneVerification } from "@/hooks/usePhoneVerification/usePhoneVerification";

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

  // 휴대폰 인증 훅 사용
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
  } = usePhoneVerification();

  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 회원 탈퇴 모달 상태 관리
  // 첫 번째 모달: 탈퇴 확인 모달
  const [isWithdrawConfirmModalOpen, setIsWithdrawConfirmModalOpen] =
    useState(false);
  // 두 번째 모달: 탈퇴 완료 모달
  const [isWithdrawCompleteModalOpen, setIsWithdrawCompleteModalOpen] =
    useState(false);
  // 탈퇴 불가 안내 모달 (진행 중인 캠페인이 있을 때)
  const [isWithdrawBlockedModalOpen, setIsWithdrawBlockedModalOpen] =
    useState(false);

  // 필수 입력 필드 검증 함수
  const validateRequiredFields = () => {
    const requiredFields = {
      phone: phone.trim(), // usePhoneVerification 훅에서 관리하는 phone 사용
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

  /**
   * 휴대폰 번호 변경 핸들러
   *
   * 기능: 휴대폰 번호 변경 시 인증 상태 초기화
   */
  const handlePhoneChange = (newPhone: string) => {
    // 훅의 handlePhoneChange를 사용하여 phoneError 자동 초기화
    handlePhoneChangeHook(newPhone);

    // 휴대폰 번호 변경 시 인증 상태 초기화
    if (newPhone === "" || isPhoneVerified || isVerificationRequested) {
      resetVerification();
    }
  };

  /**
   * 인증번호 받기 핸들러
   *
   * 기능: 휴대폰 번호 인증번호 요청
   */
  const handleVerificationRequest = async () => {
    // 훅의 handleVerificationRequest 호출 (검증 로직 포함)
    await handleVerificationRequestHook();
    // 마이페이지는 3분(180초) 타이머 사용
    setTimer(180);
  };

  /**
   * 인증번호 확인 핸들러
   *
   * 기능: 인증번호 확인 및 인증 완료 처리
   */
  const handleVerify = () => {
    handleVerifyCode();
  };

  const handlePostalSearch = () => {
    // 우편번호 검색 로직
    console.log("우편번호 검색");
  };

  const handleSave = () => {
    if (isSaveButtonEnabled) {
      // 저장 로직
      console.log("저장", { ...formData, phone });
    }
  };

  /**
   * 진행 중인 캠페인 확인 함수
   *
   * 기능: 사용자가 진행 중인 캠페인이 있는지 확인합니다.
   *
   * 반환값:
   * - true: 진행 중인 캠페인이 있음
   * - false: 진행 중인 캠페인이 없음
   *
   * TODO: 실제 API 연동 필요
   * 예: const response = await fetch('/api/user/campaigns?status=신청,선정');
   *     const campaigns = await response.json();
   *     return campaigns.length > 0;
   */
  const checkOngoingCampaigns = async (): Promise<boolean> => {
    // TODO: 실제 API 호출로 진행 중인 캠페인 확인
    // 현재는 임시로 false 반환 (진행 중인 캠페인 없음)
    // 실제 구현 시 아래와 같이 API 호출:
    // try {
    //   const response = await fetch('/api/user/campaigns?status=신청,선정');
    //   const campaigns = await response.json();
    //   return campaigns.length > 0;
    // } catch (error) {
    //   console.error('진행 중인 캠페인 확인 실패:', error);
    //   return false;
    // }
    return false; // 임시: 진행 중인 캠페인 없음
  };

  /**
   * 회원 탈퇴 버튼 클릭 핸들러
   *
   * 기능:
   * 1. 진행 중인 캠페인이 있는지 확인합니다.
   * 2. 진행 중인 캠페인이 있으면 탈퇴 불가 안내 모달을 표시합니다.
   * 3. 진행 중인 캠페인이 없으면 탈퇴 확인 모달을 표시합니다.
   */
  const handleWithdraw = async () => {
    // 진행 중인 캠페인 확인
    const hasOngoingCampaigns = await checkOngoingCampaigns();

    if (hasOngoingCampaigns) {
      // 진행 중인 캠페인이 있으면 탈퇴 불가 안내 모달 표시
      setIsWithdrawBlockedModalOpen(true);
    } else {
      // 진행 중인 캠페인이 없으면 탈퇴 확인 모달 표시
      setIsWithdrawConfirmModalOpen(true);
    }
  };

  /**
   * 탈퇴 확인 모달에서 "탈퇴" 버튼 클릭 핸들러
   *
   * 기능:
   * 1. 첫 번째 확인 모달을 닫습니다.
   * 2. 두 번째 완료 모달을 엽니다.
   * 3. 실제 탈퇴 API 호출 로직이 필요하면 여기에 추가합니다.
   */
  const handleWithdrawConfirm = () => {
    setIsWithdrawConfirmModalOpen(false);
    // 실제 탈퇴 API 호출 로직이 필요하면 여기에 추가
    // 예: await withdrawUser();
    setIsWithdrawCompleteModalOpen(true);
  };

  /**
   * 탈퇴 완료 모달에서 "닫기" 버튼 클릭 핸들러
   *
   * 기능:
   * 1. 완료 모달을 닫습니다.
   * 2. 메인 페이지로 이동합니다.
   */
  const handleWithdrawComplete = () => {
    setIsWithdrawCompleteModalOpen(false);
    router.push("/");
  };

  return (
    <div className={styles.edit_profile_container}>
      {/* 서브헤더 */}
      <SubHeader />
      {/* 메인 컨텐츠 */}
      <main className={styles.main_content}>
        <PageTitle title="내 정보 수정" />

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
          <PhoneVerification
            phone={phone}
            isPhoneVerified={isPhoneVerified}
            error={phoneError}
            onPhoneChange={handlePhoneChange}
            verificationCode={verificationCode}
            isVerificationRequested={isVerificationRequested}
            timer={timer}
            verificationCodeError={verificationCodeError}
            onVerificationRequest={handleVerificationRequest}
            onVerify={handleVerify}
            onVerificationCodeChange={handleVerificationCodeChange}
            useMyPageStyle={true}
            showVerificationCode={true}
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

          {/* 회원탈퇴 버튼 */}
          <div className={styles.withdraw_button_container}>
            <button
              type="button"
              className={styles.withdraw_button}
              onClick={handleWithdraw}
            >
              회원 탈퇴
            </button>
          </div>
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

      {/* 탈퇴 불가 안내 모달 (진행 중인 캠페인이 있을 때) */}
      <BaseModal
        is_open={isWithdrawBlockedModalOpen}
        on_close={() => setIsWithdrawBlockedModalOpen(false)}
        message="진행 중인 캠페인이 있을 경우<br>탈퇴가 불가합니다.<br>먼저 캠페인을 완료해 주세요."
        buttons={["닫기"]}
        type="center"
      />

      {/* 회원 탈퇴 확인 모달 (첫 번째 모달) */}
      <BaseModal
        is_open={isWithdrawConfirmModalOpen}
        on_close={() => setIsWithdrawConfirmModalOpen(false)}
        message='탈퇴 시 진행한 캠페인 기록과<br>포인트가 모두 삭제되며, 재가입이 불가합니다.<br><span style="color: #FF2626;">정말 탈퇴하시겠습니까?</span>'
        buttons={["취소", "탈퇴"]}
        on_confirm={handleWithdrawConfirm}
        type="center"
      />

      {/* 회원 탈퇴 완료 모달 (두 번째 모달) */}
      <BaseModal
        is_open={isWithdrawCompleteModalOpen}
        on_close={handleWithdrawComplete}
        message="탈퇴가 완료되었습니다.<br>그동안 리뷰엑스를 이용해 주셔서 감사합니다."
        buttons={["닫기"]}
        on_confirm={handleWithdrawComplete}
        type="center"
      />
    </div>
  );
}
