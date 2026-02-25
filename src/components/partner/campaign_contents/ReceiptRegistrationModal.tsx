/* ========================================
   📄 구매 영수증 등록 모달 컴포넌트
   ======================================== */

/**
 * 구매 영수증 등록 모달 컴포넌트
 *
 * 목적: 파트너가 구매 영수증을 등록할 수 있는 모달입니다.
 *
 * 사용 페이지:
 * - 파트너 캠페인 관리 페이지에서 "구매 영수증 등록하기" 버튼 클릭 시
 *
 */

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { validateImageFiles, IMAGE_UPLOAD_CONSTRAINTS } from "@/utils/validation/imageUpload";
import styles from "../../../styles/partner/receipt_registration.module.css";

interface ReceiptRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle: string;
}

export default function ReceiptRegistrationModal({
  isOpen,
  onClose,
  campaignTitle: _campaignTitle,
}: ReceiptRegistrationModalProps) {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 파일 업로드 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const { validFiles, isOverLimit, hasExtensionError, hasSizeError } = validateImageFiles(
      Array.from(files),
      uploadedImages.length
    );

    if (isOverLimit) {
      alert(`최대 ${IMAGE_UPLOAD_CONSTRAINTS.MAX_COUNT}장까지만 업로드 가능합니다.`);
      return;
    }
    if (hasExtensionError) {
      alert("JPG, PNG, GIF 파일만 업로드 가능합니다.");
      return;
    }
    if (hasSizeError) {
      alert("10MB 이하의 파일만 업로드할 수 있습니다.");
      return;
    }

    setUploadedImages((prev) => [...prev, ...validFiles]);
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 파일 입력 열기
  const openFileInput = () => {
    fileInputRef.current?.click();
  };

  // 영수증 등록 완료
  const handleSubmit = async () => {
    if (uploadedImages.length === 0) {
      alert("영수증 이미지를 최소 1장 이상 업로드해주세요.");
      return;
    }

    setIsUploading(true);

    try {
      // TODO: 실제 API 호출로 영수증 등록
      // console.log("영수증 등록:", uploadedImages);

      // 성공 시 모달 닫기
      alert("영수증이 성공적으로 등록되었습니다.");
      onClose();
    } catch (_error) {
      alert("영수증 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_container}>
        {/* 모달 헤더 */}
        <div className={styles.modal_header}>
          <h2 className={styles.modal_title}>구매 영수증 등록</h2>
          <button className={styles.close_button} onClick={onClose}>
            <Image
              src="/images/icons/close_x_large.svg"
              alt="닫기"
              width={24}
              height={24}
              priority
              unoptimized
            />
          </button>
        </div>

        {/* 모달 내용 */}
        <div className={styles.modal_content}>
          {/* 이미지 업로드 영역 */}
          <div className={styles.upload_section}>
            <div className={styles.image_upload_area} onClick={openFileInput}>
              {uploadedImages.length === 0 ? (
                <div className={styles.upload_placeholder}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              ) : (
                <div className={styles.image_grid}>
                  {uploadedImages.map((file, index) => (
                    <div key={index} className={styles.image_preview}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`영수증 ${index + 1}`}
                        className={styles.preview_image}
                      />
                      <button
                        className={styles.remove_image_button}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M12 4L4 12M4 4L12 12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {uploadedImages.length < 7 && (
                    <div className={styles.add_more_button} onClick={openFileInput}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 5V19M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              multiple
              onChange={handleFileUpload}
              className={styles.hidden_file_input}
            />
          </div>

          {/* 안내 문구 */}
          <div className={styles.guidelines}>
            <ul className={styles.guidelines_list}>
              <li>10mb 이하의 JPG, PNG, GIF 파일 최대 7장까지 등록 가능합니다.</li>
              <li>
                주문번호, 구매 상품, 주문 금액, 배송지가 모두 확인될 수 있도록 캡처한 이미지를
                업로드해 주세요.
              </li>
            </ul>
          </div>

          {/* 등록 버튼 */}
          <button className={styles.submit_button} onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
