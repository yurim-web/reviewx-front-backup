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
 *
 * 사용 위치:
 * - /partner/mypage/edit (파트너 내 정보 수정 페이지)
 */

"use client";

import Image from "next/image";
import styles from "@/styles/user/mypage/edit_profile.module.css";

interface BusinessDocumentUploadProps {
  /** 현재 업로드된 파일명 */
  fileName: string;
  /** 업로드 완료 여부 */
  isUploaded: boolean;
  /** 파일 선택 핸들러 */
  onFileSelect: (file: File) => void;
}

/**
 * 사업자등록증 업로드 컴포넌트
 */
export default function BusinessDocumentUpload({
  fileName,
  isUploaded,
  onFileSelect,
}: BusinessDocumentUploadProps) {
  /**
   * 사업자등록증 파일 선택 핸들러
   *
   * 기능 설명:
   * 1. 동적으로 숨겨진 파일 입력(input) 요소를 생성합니다.
   * 2. 사용자가 파일을 선택하면 파일 선택 다이얼로그가 열립니다.
   * 3. 선택한 파일의 크기와 타입을 검증합니다.
   * 4. 검증이 통과하면 파일을 state에 저장하고 파일명을 표시합니다.
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

        // 검증이 통과하면 파일을 전달
        onFileSelect(file);

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

  return (
    <article className={styles.field_article}>
      <label className={styles.field_label}>사업자등록증</label>
      <div className={styles.input_with_button}>
        <div className={styles.phone_input_container}>
          <input
            className={styles.input_field}
            value={fileName}
            readOnly
          />
          {/* 업로드 완료 시 체크 아이콘 표시 */}
          {isUploaded && (
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
  );
}

