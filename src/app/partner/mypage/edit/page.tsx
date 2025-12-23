"use client";

/* ========================================
   ✏️ 파트너 내 정보 수정 페이지
   ======================================== */

/**
 * 목적: 파트너가 자신의 계정 정보를 수정하는 페이지입니다.
 * 경로: /partner/mypage/edit
 * 주요 기능: 프로필 사진, 기본 정보, 사업자 정보, 담당자 정보, 주소 정보 수정 + 회원 탈퇴
 *
 * 학습 포인트:
 * - useState, useEffect 훅 사용법
 * - 입력 폼 상태 관리와 이벤트 핸들러
 * - 공통 컴포넌트 재사용 (프로필, 주소, 휴대폰 인증 등)
 * - 모달 컴포넌트를 활용한 회원 탈퇴 플로우 구현
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
// 유저단 이랑 스타일 똑같아서 공통으로 쓰는중
import styles from "../../../../styles/user/mypage/edit_profile.module.css";
// 분리된 컴포넌트들 import
import ProfilePhotoUpload from "@/components/common/mypage/ProfilePhotoUpload";
import PhoneVerificationInput from "@/components/common/mypage/PhoneVerificationInput";
import BusinessDocumentUpload from "@/components/partner/mypage/BusinessDocumentUpload";
import AddressInput from "@/components/common/mypage/AddressInput";
import BaseModal from "@/components/common/modal/BaseModal";

/**
 * 파트너 내 정보 수정 페이지 컴포넌트
 */
export default function PartnerEditProfilePage() {
  // Next.js 라우터 훅
  const router = useRouter();

  // 폼 데이터 state - 사용자가 입력한 모든 정보를 저장
  const [formData, setFormData] = useState({
    name: "아무개", // 이름
    email: "contact@cmcm.co.kr", // 이메일
    phone: "010-1234-5678", // 휴대폰 번호
    contactPhone: "010-1234-5678", // 문의 담당자 휴대폰 번호
    companyName: "주식회사 청명종합광고기획", // 상호명
    ownerName: "김민회", // 대표자명
    businessNumber: "122-86-125", // 사업자등록번호
    businessDocument: "등록 완료", // 사업자등록증 상태
    postalCode: "13561", // 우편번호
    address: "경기 성남시 분당구 정자일로 95", // 주소
    detailAddress: "NAVER", // 상세 주소
  });

  const [isPhoneVerified, setIsPhoneVerified] = useState(true); // 휴대폰 인증 완료 여부
  const [isBusinessDocumentUploaded, setIsBusinessDocumentUploaded] =
    useState(true); // 사업자등록증 업로드 여부
  const [selectedBusinessDocument, setSelectedBusinessDocument] =
    useState<File | null>(null); // 선택한 사업자등록증 파일
  const [profileImage, setProfileImage] = useState<string | null>(null); // 프로필 사진 미리보기 URL

  /**
   * 회원 탈퇴 관련 모달 상태
   *
   * - isWithdrawConfirmModalOpen: 탈퇴 확인 모달 표시 여부
   * - isWithdrawCompleteModalOpen: 탈퇴 완료 모달 표시 여부
   * - isWithdrawBlockedModalOpen: 진행 중인 캠페인으로 인한 탈퇴 불가 안내 모달 표시 여부
   */
  const [isWithdrawConfirmModalOpen, setIsWithdrawConfirmModalOpen] =
    useState(false);
  const [isWithdrawCompleteModalOpen, setIsWithdrawCompleteModalOpen] =
    useState(false);
  const [isWithdrawBlockedModalOpen, setIsWithdrawBlockedModalOpen] =
    useState(false);

  /**
   * 일반 입력 필드 변경 핸들러
   * 구조분해할당으로 input의 name과 value를 가져옴
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
   * BusinessDocumentUpload 컴포넌트에서 호출됨
   */
  const handleBusinessDocumentSelect = (file: File) => {
    setSelectedBusinessDocument(file);
    setFormData((prev) => ({
      ...prev,
      businessDocument: file.name, // 선택한 파일명으로 업데이트
    }));
    setIsBusinessDocumentUploaded(true);
  };

  /**
   * 저장 버튼 활성화 조건
   * 모든 필수 필드가 채워져 있는지 확인
   */
  const isSaveEnabled = formData.phone.trim().length > 0;

  /**
   * 진행 중인 캠페인 확인 함수 (파트너 전용)
   *
   * 기능: 파트너가 운영 중인 캠페인이 있는지 확인합니다.
   *
   * 반환값:
   * - true: 진행 중인 캠페인이 있음
   * - false: 진행 중인 캠페인이 없음
   *
   * 학습 포인트:
   * - 비동기 함수: async/await를 사용하여 API 호출
   * - 조건부 반환: 조건에 따라 다른 값을 반환
   * - 실제 구현 시: API를 호출하여 "진행 중" 상태의 캠페인이 있는지 확인
   *
   * TODO: 실제 API 연동 필요
   * 예: const response = await fetch('/api/partner/campaigns?status=진행중');
   *     const campaigns = await response.json();
   *     return campaigns.length > 0;
   */
  const checkOngoingCampaigns = async (): Promise<boolean> => {
    // TODO: 실제 API 호출로 진행 중인 캠페인 확인
    // 현재는 임시로 false 반환 (진행 중인 캠페인 없음)
    return false;
  };

  /**
   * 회원 탈퇴 버튼 클릭 핸들러
   *
   * 기능:
   * 1. 진행 중인 캠페인이 있는지 확인합니다.
   * 2. 진행 중인 캠페인이 있으면 탈퇴 불가 안내 모달을 표시합니다.
   * 3. 진행 중인 캠페인이 없으면 탈퇴 확인 모달을 표시합니다.
   *
   * 학습 포인트:
   * - 비동기 함수: async/await를 사용하여 비동기 작업 처리
   * - 조건부 분기: if-else를 사용하여 상황에 따라 다른 동작 수행
   * - 상태 업데이트: useState로 관리하는 상태를 변경하여 모달 표시/숨김 제어
   * - 이벤트 핸들러: 버튼 클릭 시 실행되는 함수
   */
  const handleWithdraw = async () => {
    const hasOngoingCampaigns = await checkOngoingCampaigns();

    if (hasOngoingCampaigns) {
      setIsWithdrawBlockedModalOpen(true);
    } else {
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
    // TODO: 파트너 탈퇴 API 호출 추가
    setIsWithdrawCompleteModalOpen(true);
  };

  /**
   * 탈퇴 완료 모달에서 "닫기" 버튼 클릭 핸들러
   *
   * 기능:
   * 1. 완료 모달을 닫습니다.
   * 2. 파트너 메인 페이지로 이동합니다.
   */
  const handleWithdrawComplete = () => {
    setIsWithdrawCompleteModalOpen(false);
    router.push("/partner");
  };

  /**
   * 파트너 헤더 숨기기
   * SubHeader가 표시될 때는 PartnerHeader를 숨김
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
        <PageTitle title="내 정보 수정" />

        <section className={styles.section_container}>
          {/* 기본 정보 섹션 */}
          <h2 className={styles.section_title}>기본 정보</h2>

          {/* 프로필 사진 */}
          <ProfilePhotoUpload
            profileImage={profileImage}
            onImageChange={setProfileImage}
          />

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
          <PhoneVerificationInput
            phone={formData.phone}
            onPhoneChange={(phone) =>
              setFormData((prev) => ({ ...prev, phone }))
            }
            isVerified={isPhoneVerified}
            onVerificationRequest={handleVerificationRequest}
          />

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
          <BusinessDocumentUpload
            fileName={formData.businessDocument}
            isUploaded={isBusinessDocumentUploaded}
            onFileSelect={handleBusinessDocumentSelect}
          />

          {/* 주소 입력 */}
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
            onPostalCodeSearch={handlePostalCodeSearch}
          />

          {/* 담당자 정보 섹션 */}
          <h3 className={styles.section_subtitle}>담당자 정보</h3>

          {/* 문의 담당자 휴대폰 번호 */}
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="contactPhone">
              문의 담당자 휴대폰 번호
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              className={styles.input_field}
              value={formData.contactPhone}
              onChange={handleInputChange}
              placeholder="010-0000-0000"
            />
          </article>

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
        message="탈퇴 시 진행한 캠페인 기록과<br>포인트가 모두 삭제되며, 재가입이 불가합니다.<br>정말 탈퇴하시겠습니까?"
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
