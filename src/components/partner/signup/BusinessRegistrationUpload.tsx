/* ========================================
   📄 사업자등록증 업로드 컴포넌트
   ======================================== */

/**
 * 모듈 목적
 *
 * - 사업자등록증 파일 업로드 UI
 * - 파일 크기 및 확장자 검증
 * - 업로드된 파일명 표시
 */

'use client';

import { useRef } from 'react';
import styles from '@/styles/partner/signup/signup.module.css';

interface BusinessRegistrationUploadProps {
  fileName: string | null;
  error?: string;
  onFileSelect: (file: File | null) => void;
  onError: (error: string) => void;
}

export default function BusinessRegistrationUpload({
  fileName,
  error,
  onFileSelect,
  onError,
}: BusinessRegistrationUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onFileSelect(null);
      return;
    }

    // 파일 크기 검증 (10mb = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      onError('10mb 이하의 파일만 업로드할 수 있습니다.');
      e.target.value = '';
      onFileSelect(null);
      return;
    }

    // 파일 확장자 검증
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      onError('지정된 확장자(PDF, JPG, PNG)만\n업로드할 수 있습니다.');
      e.target.value = '';
      onFileSelect(null);
      return;
    }

    // 검증 통과 시 파일 선택 (에러 없음)
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.form_field}>
      <label className={styles.field_label} htmlFor="business-registration">
        사업자등록증
      </label>
      <div className={styles.file_upload_wrapper}>
        <input
          ref={fileInputRef}
          id="business-registration"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className={styles.file_input}
          onChange={handleFileChange}
          onInvalid={(e) => {
            e.preventDefault();
          }}
        />
        <div className={styles.file_upload_input_wrapper}>
          <input
            type="text"
            className={`${styles.input_field} ${styles.file_name_input} ${
              error !== undefined ? styles.input_error : ''
            }`}
            placeholder="PDF, JPG, PNG 확장자 파일 첨부"
            value={fileName || ''}
            readOnly
          />
        </div>
        <button
          type="button"
          className={styles.file_select_button}
          onClick={handleButtonClick}
        >
          파일 선택
        </button>
      </div>
    </div>
  );
}
