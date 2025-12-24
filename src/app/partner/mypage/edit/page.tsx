"use client";

/* ========================================
   ✏️ 파트너 내 정보 수정 페이지
   ======================================== */

/**
 * 목적: 파트너가 자신의 계정 정보를 수정하는 페이지입니다.
 * 경로: /partner/mypage/edit
 * 주요 기능: 프로필 사진, 기본 정보, 사업자 정보, 담당자 정보, 주소 정보 수정 + 회원 탈퇴

 */

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import styles from "../../../../styles/user/mypage/edit_profile.module.css";
import ProfilePhotoUpload from "@/components/common/mypage/ProfilePhotoUpload";
import PhoneVerification from "@/components/common/phone_verification/PhoneVerification";
import BusinessDocumentUpload from "@/components/partner/mypage/BusinessDocumentUpload";
import AddressInput from "@/components/common/mypage/AddressInput";
import BaseModal from "@/components/common/modal/BaseModal";
import ErrorText from "@/components/common/error_text/ErrorText";
import { formatPhoneNumber } from "@/utils/signup/phoneUtils";

/**
 * 파트너 내 정보 수정 페이지 컴포넌트
 */
export default function PartnerEditProfilePage() {
  // Next.js 라우터 훅
  const router = useRouter();

  // 폼 데이터 state
  const [formData, setFormData] = useState({
    name: "아무개",
    email: "contact@cmcm.co.kr",
    phone: "010-1234-5678",
    contactPhone: "010-1234-5678",
    companyName: "주식회사 청명종합광고기획",
    ownerName: "김민회",
    businessNumber: "122-86-125",
    businessDocument: "등록 완료",
    postalCode: "13561",
    address: "경기 성남시 분당구 정자일로 95",
    detailAddress: "NAVER",
  });

  const [isPhoneVerified, setIsPhoneVerified] = useState(true); // 휴대폰 인증 완료 여부
  const [isVerificationRequested, setIsVerificationRequested] = useState(false); // 인증번호 요청 여부
  const [verificationCode, setVerificationCode] = useState(""); // 인증번호
  const [timer, setTimer] = useState(0); // 타이머
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null); // 타이머 ID 저장
  const [verificationCodeError, setVerificationCodeError] = useState<
    string | undefined
  >(undefined); // 인증번호 에러 메시지
  const [isBusinessDocumentUploaded, setIsBusinessDocumentUploaded] =
    useState(true); // 사업자등록증 업로드 여부
  const [profileImage, setProfileImage] = useState<string | null>(null); // 프로필 사진 미리보기 URL
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined); // 휴대폰 번호 에러 메시지
  const [contactPhoneError, setContactPhoneError] = useState<
    string | undefined
  >(undefined); // 문의 담당자 휴대폰 번호 에러 메시지

  // 회원 탈퇴 관련 모달 상태
  const [isWithdrawConfirmModalOpen, setIsWithdrawConfirmModalOpen] =
    useState(false);
  const [isWithdrawCompleteModalOpen, setIsWithdrawCompleteModalOpen] =
    useState(false);
  const [isWithdrawBlockedModalOpen, setIsWithdrawBlockedModalOpen] =
    useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidPhoneNumber = (phone: string) => /^010-\d{4}-\d{4}$/.test(phone);

  /**
   * 인증번호 요청 핸들러
   * 휴대폰 번호가 올바른 형식인지 확인 후 인증번호 전송
   */
  const handleVerificationRequest = () => {
    if (!isValidPhoneNumber(formData.phone)) {
      setPhoneError("올바른 휴대폰 번호 형식을 입력해주세요.");
      return;
    }
    // 에러 초기화
    setPhoneError(undefined);
    // 인증번호 요청 상태 설정
    setIsVerificationRequested(true);
    setIsPhoneVerified(false);
    setVerificationCode("");
    setVerificationCodeError(undefined);
    // 타이머 시작 (3분 = 180초)
    setTimer(180);
    // TODO: 인증번호 전송 API 호출
  };

  /**
   * 인증번호 확인 핸들러
   */
  const handleVerify = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationCodeError("인증번호 6자리를 입력해주세요.");
      return;
    }
    // TODO: 인증번호 확인 API 호출
    // 임시로 인증 완료 처리
    setIsPhoneVerified(true);
    setIsVerificationRequested(false);
    setTimer(0);
    setVerificationCodeError(undefined);
  };

  /**
   * 인증번호 변경 핸들러
   */
  const handleVerificationCodeChange = (code: string) => {
    setVerificationCode(code);
    setVerificationCodeError(undefined);
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
   */
  const handleBusinessDocumentSelect = (file: File | null) => {
    if (!file) {
      setIsBusinessDocumentUploaded(false);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      businessDocument: file.name,
    }));
    setIsBusinessDocumentUploaded(true);
  };

  const isSaveEnabled = formData.phone.trim().length > 0;

  /**
   * 진행 중인 캠페인 확인 함수
   * TODO: 실제 API 연동 필요
   */
  const checkOngoingCampaigns = async (): Promise<boolean> => {
    // TODO: API 호출로 진행 중인 캠페인 확인
    return false;
  };

  const handleWithdraw = async () => {
    const hasOngoingCampaigns = await checkOngoingCampaigns();

    if (hasOngoingCampaigns) {
      setIsWithdrawBlockedModalOpen(true);
    } else {
      setIsWithdrawConfirmModalOpen(true);
    }
  };

  const handleWithdrawConfirm = () => {
    setIsWithdrawConfirmModalOpen(false);
    // TODO: 파트너 탈퇴 API 호출
    setIsWithdrawCompleteModalOpen(true);
  };

  const handleWithdrawComplete = () => {
    setIsWithdrawCompleteModalOpen(false);
    router.push("/partner");
  };

  // 타이머 효과: timer가 0보다 크면 1초마다 감소
  useEffect(() => {
    if (timer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            setIsVerificationRequested(false);
            // 타이머가 0이 되고 인증이 완료되지 않았으면 에러 메시지 설정
            if (!isPhoneVerified) {
              setVerificationCodeError("인증번호 입력 시간을 초과했습니다.");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timer, isPhoneVerified]);

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
          <PhoneVerification
            phone={formData.phone}
            isPhoneVerified={isPhoneVerified}
            error={phoneError}
            onPhoneChange={(phone) => {
              const prevPhone = formData.phone;
              setFormData((prev) => ({ ...prev, phone }));
              // 휴대폰 번호 변경 시 에러 초기화 및 인증 상태 초기화
              setPhoneError(undefined);
              // 휴대폰 번호가 비어지거나 변경되면 인증 상태 초기화 (회원가입과 동일)
              if (phone === "" || phone !== prevPhone) {
                setIsPhoneVerified(false);
                setIsVerificationRequested(false);
                setVerificationCode("");
                setTimer(0);
                setVerificationCodeError(undefined);
              }
            }}
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
              type="tel"
              className={styles.input_field}
              value={formData.contactPhone}
              onChange={(e) => {
                // 휴대폰 번호 포맷팅 유틸리티 사용
                const formatted = formatPhoneNumber(e.target.value);
                setFormData((prev) => ({ ...prev, contactPhone: formatted }));

                // 실시간 휴대폰 번호 형식 검증
                if (formatted.trim() === "") {
                  // 빈 필드: 에러 초기화
                  setContactPhoneError(undefined);
                } else {
                  // 휴대폰 번호 형식 검증 (010-1234-5678 형식)
                  const phoneRegex = /^010-\d{4}-\d{4}$/;
                  if (!phoneRegex.test(formatted)) {
                    // 형식 오류: 실시간으로 에러 메시지 표시
                    setContactPhoneError(
                      "올바른 휴대폰 번호 형식을 입력해주세요."
                    );
                  } else {
                    // 형식이 유효한 경우: 에러 초기화
                    setContactPhoneError(undefined);
                  }
                }
              }}
              placeholder="010-0000-0000"
              maxLength={13}
              onInvalid={(e) => {
                e.preventDefault();
              }}
            />
            <ErrorText message={contactPhoneError} />
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
