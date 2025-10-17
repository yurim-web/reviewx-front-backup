/* ========================================
   📝 콘텐츠 등록 모달 컴포넌트
   ======================================== */

/**
 * 콘텐츠 등록 모달 컴포넌트
 *
 * 목적: 사용자가 캠페인에 참여하기 위해 작성한 콘텐츠를 등록하는 모달입니다.
 *
 * 사용 페이지:
 * - /user/campaign_management (캠페인 관리 페이지)
 *
 * 주요 기능:
 * - 콘텐츠 파일 업로드
 * - 콘텐츠 등록 및 검증
 * - 모달 열기/닫기 기능
 */

"use client";

import { useState } from "react";
import modalStyles from "../../../styles/user/campaign_management/receipt_modal.module.css";

interface ContentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContentRegistrationModal({
  isOpen,
  onClose,
}: ContentRegistrationModalProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
    }
  };

  const handleSubmit = () => {
    // TODO: 실제 API 호출로 콘텐츠 등록 처리
    console.log("콘텐츠 등록:", {
      selectedFile,
    });
    alert("콘텐츠가 등록되었습니다!");
    onClose();
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={modalStyles.modal_overlay} onClick={handleBackdropClick}>
      <div
        className={modalStyles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className={modalStyles.modal_header}>
          <h3 className={modalStyles.modal_title}>콘텐츠 등록</h3>
          <button className={modalStyles.modal_close_button} onClick={onClose}>
            <img src="/images/filter/x_icon.svg" alt="닫기" />
          </button>
        </div>

        {/* 모달 바디 */}
        <div className={modalStyles.modal_body}>
          {/* 파일 업로드 영역 */}
          <div className={modalStyles.file_upload_area}>
            <label className={modalStyles.file_label}>링크</label>
            <div className={modalStyles.file_input_container}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className={modalStyles.hidden_file_input}
                id="content-file"
              />
              <label
                htmlFor="content-file"
                className={modalStyles.file_input_button}
              >
                {selectedFile ? (
                  <span className={modalStyles.selected_file_name}>
                    {selectedFile}
                  </span>
                ) : (
                  <span>KakaoTalk_20240125_141232557.jpg</span>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className={modalStyles.modal_footer}>
          <button className={modalStyles.apply_button} onClick={handleSubmit}>
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}
