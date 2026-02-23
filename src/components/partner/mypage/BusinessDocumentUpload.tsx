/* ========================================
   📄 사업자등록증 업로드 컴포넌트
   ======================================== */

/**
 * 사업자등록증 업로드 컴포넌트
 *
 * 목적: 사업자등록증 파일을 업로드하고 상태를 표시하는 컴포넌트입니다.
 *
 * 주요 기능:
 * - 사업자등록증 파일 선택 (이미지 또는 PDF, 10MB 제한)
 * - 업로드 완료 상태 표시
 * - 파일명 표시
 * - 내부에서 에러 모달 관리
 *
 * 사용 위치:
 * - /partner/mypage/edit (파트너 내 정보 수정 페이지)
 * - /partner/signup (파트너 회원가입 페이지)
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import BaseModal from "@/components/common/modal/BaseModal";
import layoutStyles from "@/styles/user/mypage/edit_profile/edit_profile_layout.module.css";
import inputStyles from "@/styles/user/mypage/edit_profile/inputs.module.css";
import verificationStyles from "@/styles/user/mypage/edit_profile/verification.module.css";
import commonStyles from "@/styles/common/signup/signup.module.css";

interface BusinessDocumentUploadProps {
  /** 현재 업로드된 파일명 */
  fileName: string | null;
  /** 업로드 완료 여부 (선택적, 체크 아이콘 표시용) */
  isUploaded?: boolean;
  /** 파일 선택 핸들러 */
  onFileSelect: (file: File | null) => void;
  /** 파일 선택 버튼 클릭 시 호출 (새로 등록 시 완료 배지 숨김용) */
  onSelectClick?: () => void;
  /** 커스텀 스타일 모듈 (선택적, 기본값: edit_profile.module.css) */
  customStyles?: typeof styles;
}

/**
 * 사업자등록증 업로드 컴포넌트
 */
export default function BusinessDocumentUpload({
  fileName,
  isUploaded = false,
  onFileSelect,
  onSelectClick,
  customStyles,
}: BusinessDocumentUploadProps) {
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  // For backward compatibility, use customStyles if provided, otherwise use the new split styles
  const componentStyles = customStyles || {
    field_article: layoutStyles.field_article,
    field_label: inputStyles.field_label,
    input_field: inputStyles.input_field,
    input_with_button: verificationStyles.input_with_button,
    phone_input_container: verificationStyles.phone_input_container,
    phone_check_icon: verificationStyles.phone_check_icon,
    postal_button: verificationStyles.postal_button,
  };
  /**
   * 사업자등록증 파일 선택 핸들러
   *
   * 오류 모달이 표시되는 경우:
   * 1. 파일 크기 오류: 10MB를 초과하는 경우
   *    - 메시지: "10mb 이하의 파일만 업로드할 수 있습니다."
   * 2. 파일 확장자 오류: 지정된 확장자(PDF, JPG, PNG)가 아닌 경우
   *    - 메시지: "지정된 확장자(PDF, JPG, PNG)만\n업로드할 수 있습니다."
   *
   * 검증 순서:
   * 1. 파일 선택 여부 확인
   * 2. 파일 크기 검증 (10MB 이하) - 최우선 검증
   * 3. 파일 확장자 검증 (PDF, JPG, PNG) - 크기 검증 통과 후
   * 4. 모든 검증 통과 시 파일 선택
   */
  const handleBusinessDocumentSelect = () => {
    // 새로 등록 시 상위에서 완료 배지 숨기기 (파일 선택 버튼 클릭 시점)
    onSelectClick?.();
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

      if (!file) {
        onFileSelect(null);
        return;
      }

      if (file) {
        // (1) 파일 크기 검증 (우선순위 1: 최상위 에러)
        const maxSize = 10 * 1024 * 1024; // 10MB = 10 * 1024 * 1024 bytes
        if (file.size > maxSize) {
          setModalMessage("10mb 이하의 파일만 업로드할 수 있습니다.");
          return; // 크기 에러 발생 시 확장자 검증은 진행하지 않음
        }

        // (2) 파일 확장자 검증 (우선순위 2: 크기 검증 통과 후)
        const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
          setModalMessage(
            "지정된 확장자(PDF, JPG, PNG)만<br>업로드할 수 있습니다."
          );
          return; // 확장자 에러 발생 시 파일 선택 취소
        }

        // 모든 검증 통과 시 파일 선택 (에러 없음)
        onFileSelect(file);

        // TODO: 실제 파일 업로드 API 호출
        // 여기서 FormData를 사용하여 서버로 파일을 전송할 수 있습니다:
        // const formData = new FormData();
        // formData.append("businessDocument", file);
        // await uploadBusinessDocument(formData);
        // console.log("사업자등록증 파일 선택됨:", file.name);
      }
    };

    // 파일 선택 다이얼로그를 엽니다
    // 이 메서드를 호출하면 브라우저의 파일 선택 창이 나타납니다
    input.click();
  };

  const handleCloseModal = () => {
    setModalMessage(null);
  };

  // signup 스타일인지 확인 (file_upload_wrapper가 있으면 signup 스타일)
  const isSignupStyle = "file_upload_wrapper" in componentStyles;

  // 스타일에 따라 다른 클래스명 사용
  // signup 스타일일 때는 공통 스타일(commonStyles) 사용, mypage 스타일일 때는 componentStyles 사용
  const containerClass = isSignupStyle
    ? commonStyles.form_field
    : componentStyles.field_article;
  const wrapperClass = isSignupStyle
    ? componentStyles.file_upload_wrapper
    : componentStyles.input_with_button;
  const inputWrapperClass = isSignupStyle
    ? componentStyles.file_upload_input_wrapper
    : componentStyles.phone_input_container;
  const inputClass = isSignupStyle
    ? `${commonStyles.input_field} ${componentStyles.file_name_input}`
    : componentStyles.input_field;
  const buttonClass = isSignupStyle
    ? componentStyles.file_select_button
    : componentStyles.postal_button;
  const labelClass = isSignupStyle
    ? commonStyles.field_label
    : componentStyles.field_label;

  return (
    <>
      <div className={containerClass}>
        <label className={labelClass}>사업자등록증</label>
        <div className={wrapperClass}>
          <div className={inputWrapperClass}>
            <input
              className={inputClass}
              value={!isSignupStyle && isUploaded ? "등록 완료" : fileName || ""}
              readOnly
            />
            {/* 업로드 완료 시 체크 아이콘 표시 (mypage 스타일만) */}
            {!isSignupStyle && isUploaded && (
              <div className={componentStyles.phone_check_icon}>
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
            type="button"
            className={buttonClass}
            onClick={handleBusinessDocumentSelect}
          >
            파일 선택
          </button>
        </div>
      </div>

      <BaseModal
        is_open={modalMessage !== null}
        on_close={handleCloseModal}
        message={modalMessage || ""}
        buttons={["닫기"]}
        type="center"
      />
    </>
  );
}
