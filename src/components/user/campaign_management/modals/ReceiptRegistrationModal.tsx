/* ========================================
   📄 구매 영수증 등록 모달 컴포넌트 (유저용)
   ======================================== */

/**
 * 구매 영수증 등록 모달 컴포넌트 (유저용)
 *
 * 목적: 사용자가 구매 영수증 이미지를 등록하거나 수정할 수 있는 모달입니다.
 *
 * 사용 위치:
 * 1. 선정 탭 > 미션형, 구매평 캠페인
 *    - "구매 영수증 등록하기" 버튼 클릭 시 (등록 모드)
 *    - "구매 영수증 수정하기" 버튼 클릭 시 (수정 모드)
 *    - SelectedTabCard 컴포넌트에서 사용
 *
 * 2. 취소/반려 탭 > 모든 캠페인 타입
 *    - "구매 영수증 재등록하기" 버튼 클릭 시 (등록 모드)
 *    - RejectedTabCard 컴포넌트에서 사용
 *
 * 모달 구성:
 * 1. 이미지 업로드 섹션
 *    - 구매 영수증 이미지 업로드 (최대 7장, 10MB 이하)
 *    - 등록 모드: 빈 상태에서 시작
 *    - 수정 모드: 기존 등록된 영수증 이미지가 미리 표시됨 (existingImages prop)
 *    - 업로드된 이미지 미리보기
 *    - 이미지 삭제 기능 (기존 이미지 및 새로 업로드한 이미지 모두 삭제 가능)
 *    - 이미지 개수 표시: "이미지 (현재 개수/7)"
 *
 * 2. 안내 문구
 *    - 파일 형식 및 크기 제한 안내
 *    - 영수증에 포함되어야 할 정보 안내 (주문번호, 구매 상품, 주문 금액, 배송지)
 *
 * 3. 등록/수정 버튼
 *    - mode prop에 따라 버튼 텍스트 변경 ("등록" / "수정")
 *
 * 오류 처리:
 * - 이미지 개수 오류: BaseModal로 "이미지는 최대 7장까지 등록할 수 있습니다." 표시
 * - 이미지 확장자 오류: BaseModal로 "지정된 확장자(JPG, PNG, GIF)만\n업로드할 수 있습니다." 표시
 * - 이미지 크기 오류: BaseModal로 "10mb 이하의 파일만 업로드할 수 있습니다." 표시
 *
 * 다른 모달과의 차이점:
 * - ContentRegistrationModal: 링크만 입력 (배송형, 방문형, 기자단)
 * - ImageUploadModal: 콘텐츠 이미지 업로드 (구매평)
 * - CombinedContentModal: 링크 + 이미지 모두 지원 (미션형)
 * - ReceiptRegistrationModal: 구매 영수증 이미지 업로드 (미션형, 구매평)
 */

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BaseModal from "@/components/common/modal/BaseModal";
import styles from "../../../../styles/user/campaign_management/receipt_registration.module.css";

interface ReceiptRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
  mode?: "register" | "edit";
  existingImages?: string[]; // 수정 모드일 때 기존 이미지 URL 배열
}

export default function ReceiptRegistrationModal({
  isOpen,
  onClose,
  campaignTitle,
  mode = "register",
  existingImages = [],
}: ReceiptRegistrationModalProps) {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 오류 모달 상태 관리
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  // 모달이 열릴 때 기존 이미지 설정
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && existingImages.length > 0) {
        setExistingImageUrls(existingImages);
      } else {
        setExistingImageUrls([]);
      }
      setUploadedImages([]);
    }
  }, [isOpen, mode, existingImages]);

  if (!isOpen) return null;

  // 파일 업로드 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // 파일 개수 체크 (최대 7장) - 기존 이미지와 새로 업로드할 이미지 합산
    const totalImages =
      existingImageUrls.length + uploadedImages.length + newFiles.length;
    if (totalImages > 7) {
      setErrorModal({
        isOpen: true,
        message: "이미지는 최대 7장까지 등록할 수 있습니다.",
      });
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // 파일 크기 및 형식 체크
    const validFiles: File[] = [];
    let hasExtensionError = false;
    let hasSizeError = false;

    for (const file of newFiles) {
      // 파일 형식 체크
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/i)) {
        hasExtensionError = true;
        continue;
      }

      // 파일 크기 체크 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        hasSizeError = true;
        continue;
      }

      validFiles.push(file);
    }

    // 오류 모달 표시
    if (hasExtensionError) {
      setErrorModal({
        isOpen: true,
        message: "지정된 확장자(JPG, PNG, GIF)만\n업로드할 수 있습니다.",
      });
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (hasSizeError) {
      setErrorModal({
        isOpen: true,
        message: "10mb 이하의 파일만 업로드할 수 있습니다.",
      });
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (validFiles.length === 0) {
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setUploadedImages((prev) => [...prev, ...validFiles]);
  };

  // 기존 이미지 삭제 핸들러
  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // 새로 업로드한 이미지 삭제 핸들러
  const handleRemoveUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 오류 모달 닫기 핸들러
  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, message: "" });
  };

  // 파일 입력 열기
  const openFileInput = () => {
    fileInputRef.current?.click();
  };

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 영수증 등록/수정 완료
  const handleSubmit = async () => {
    const totalImages = existingImageUrls.length + uploadedImages.length;
    if (totalImages === 0) {
      alert("영수증 이미지를 최소 1장 이상 업로드해주세요.");
      return;
    }

    setIsUploading(true);

    try {
      if (mode === "edit") {
        // TODO: 실제 API 호출로 영수증 수정
        console.log("영수증 수정:", {
          existingImages: existingImageUrls,
          newImages: uploadedImages,
        });
        alert("영수증이 성공적으로 수정되었습니다.");
      } else {
        // TODO: 실제 API 호출로 영수증 등록
        console.log("영수증 등록:", uploadedImages);
        alert("영수증이 성공적으로 등록되었습니다.");
      }

      // 성공 시 모달 닫기
      onClose();
    } catch (error) {
      console.error(`영수증 ${mode === "edit" ? "수정" : "등록"} 실패:`, error);
      alert(
        `영수증 ${
          mode === "edit" ? "수정" : "등록"
        }에 실패했습니다. 다시 시도해주세요.`
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* 오류 모달 */}
      <BaseModal
        is_open={errorModal.isOpen}
        on_close={handleCloseErrorModal}
        message={errorModal.message}
        buttons={["확인"]}
        type="center"
      />

      <div className={styles.modal_overlay} onClick={handleOverlayClick}>
        <div className={styles.modal_container}>
          {/* 모달 제목 */}
          <h2 className={styles.modal_title}>
            {mode === "edit" ? "구매 영수증 수정" : "구매 영수증 등록"}
          </h2>

          {/* 이미지 라벨 */}
          <p className={styles.image_label}>
            이미지 ({existingImageUrls.length + uploadedImages.length}/7)
          </p>

          {/* 이미지 업로드 영역 */}
          <div className={styles.upload_section}>
            {existingImageUrls.length === 0 && uploadedImages.length === 0 ? (
              <div className={styles.image_upload_area} onClick={openFileInput}>
                <div className={styles.upload_placeholder}>
                  <Image
                    src="/images/icons/plus_icon.svg"
                    alt="이미지 추가"
                    width={56}
                    height={56}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.image_grid}>
                {/* 기존 이미지 표시 (수정 모드) */}
                {existingImageUrls.map((imageUrl, index) => (
                  <div
                    key={`existing-${index}`}
                    className={styles.image_preview}
                  >
                    <img
                      src={imageUrl}
                      alt={`기존 영수증 ${index + 1}`}
                      className={styles.preview_image}
                    />
                    <button
                      className={styles.remove_image_button}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveExistingImage(index);
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
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
                {/* 새로 업로드한 이미지 표시 */}
                {uploadedImages.map((file, index) => (
                  <div
                    key={`uploaded-${index}`}
                    className={styles.image_preview}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`영수증 ${index + 1}`}
                      className={styles.preview_image}
                    />
                    <button
                      className={styles.remove_image_button}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveUploadedImage(index);
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
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
                {/* 추가 버튼 (최대 7장까지) */}
                {existingImageUrls.length + uploadedImages.length < 7 && (
                  <div
                    className={styles.add_more_button}
                    onClick={openFileInput}
                  >
                    <Image
                      src="/images/icons/plus_icon.svg"
                      alt="이미지 추가"
                      width={56}
                      height={56}
                    />
                  </div>
                )}
              </div>
            )}

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
              <li>
                10mb 이하의 JPG, PNG, GIF 파일 최대 7장까지 등록 가능합니다.
              </li>
              <li>
                주문번호, 구매 상품, 주문 금액, 배송지가 모두 확인될 수 있도록
                캡처한 이미지를 업로드해 주세요.
              </li>
            </ul>
          </div>

          {/* 등록/수정 버튼 */}
          <button
            className={styles.submit_button}
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading
              ? mode === "edit"
                ? "수정 중..."
                : "등록 중..."
              : mode === "edit"
              ? "수정"
              : "등록"}
          </button>

          {/* 닫기 버튼 */}
          <button className={styles.close_button} onClick={onClose}>
            <Image
              src="/images/filter/x_icon.svg"
              alt="닫기"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </>
  );
}
