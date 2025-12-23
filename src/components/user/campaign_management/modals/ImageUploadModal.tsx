/* ========================================
   📸 이미지 업로드 콘텐츠 등록 모달 컴포넌트 (유저용)
   ======================================== */

/**
 * 이미지 업로드 콘텐츠 등록 모달 컴포넌트 (유저용)
 *
 * 목적: 사용자가 이미지를 업로드하여 콘텐츠를 등록할 수 있는 모달입니다.
 *
 * 사용 위치:
 * 1. 선정 탭 > 구매평 캠페인
 *    - "콘텐츠 등록하기" 버튼 클릭 시 (등록 모드)
 *    - "콘텐츠 수정하기" 버튼 클릭 시 (수정 모드)
 *    - SelectedTabCard 컴포넌트에서 사용
 *
 * 2. 취소/반려 탭 > 구매평 캠페인
 *    - "콘텐츠 재등록하기" 버튼 클릭 시 (등록 모드)
 *    - RejectedTabCard 컴포넌트에서 사용
 *
 * 모달 구성:
 * 1. 이미지 업로드 섹션
 *    - 이미지 업로드 (최대 7장, 10MB 이하)
 *    - 등록 모드: 빈 상태에서 시작
 *    - 수정 모드: 기존 등록된 이미지가 미리 표시됨 (existingImages prop)
 *    - 업로드된 이미지 미리보기
 *    - 이미지 삭제 기능 (기존 이미지 및 새로 업로드한 이미지 모두 삭제 가능)
 *    - 이미지 개수 표시: "이미지 (현재 개수/7)"
 *
 * 2. 등록/수정 버튼
 *    - mode prop에 따라 버튼 텍스트 변경 ("등록" / "수정")
 *
 * 오류 처리:
 * - 이미지 개수 오류: BaseModal로 "이미지는 최대 7장까지 등록할 수 있습니다." 표시
 * - 이미지 확장자 오류: BaseModal로 "지정된 확장자(JPG, PNG, GIF)만\n업로드할 수 있습니다." 표시
 * - 이미지 크기 오류: BaseModal로 "10mb 이하의 파일만 업로드할 수 있습니다." 표시
 *
 * 다른 모달과의 차이점:
 * - ContentRegistrationModal: 링크만 입력 (배송형, 방문형, 기자단)
 * - ImageUploadModal: 이미지만 업로드 (구매평)
 * - CombinedContentModal: 링크 + 이미지 모두 지원 (미션형)
 * - ReceiptRegistrationModal: 구매 영수증 이미지 업로드 (미션형, 구매평)
 */

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BaseModal from "@/components/common/modal/BaseModal";
import styles from "../../../../styles/user/campaign_management/modals/image_upload_modal.module.css";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
  mode?: "register" | "edit";
  existingImages?: string[]; // 수정 모드일 때 기존 이미지 URL 배열
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

export default function ImageUploadModal({
  isOpen,
  onClose,
  campaignTitle,
  mode = "register",
  existingImages = [],
}: ImageUploadModalProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // 오류 모달 닫기 핸들러
  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, message: "" });
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 최대 7장 제한 확인 (기존 이미지 + 새로 업로드할 이미지 합산)
    const totalImages =
      existingImageUrls.length + uploadedImages.length + files.length;
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

    // 파일 형식 및 크기 검증
    const validFiles: File[] = [];
    let hasExtensionError = false;
    let hasSizeError = false;

    for (const file of files) {
      // 파일 형식 검증
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        hasExtensionError = true;
        continue;
      }

      // 파일 크기 검증 (10MB)
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

    setIsUploading(true);

    // 이미지 미리보기 생성
    const newImages: UploadedImage[] = [];
    let processedCount = 0;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: UploadedImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
        };
        newImages.push(newImage);

        processedCount++;
        if (processedCount === validFiles.length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 기존 이미지 삭제 핸들러
  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // 새로 업로드한 이미지 삭제 핸들러
  const handleRemoveUploadedImage = (imageId: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  // 이미지 업로드 버튼 클릭 핸들러
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 콘텐츠 등록/수정 완료
  const handleSubmit = async () => {
    const totalImages = existingImageUrls.length + uploadedImages.length;
    if (totalImages === 0) {
      alert("최소 1장 이상의 이미지를 업로드해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "edit") {
        // TODO: 실제 API 호출로 이미지 콘텐츠 수정
        console.log("이미지 콘텐츠 수정:", {
          existingImages: existingImageUrls,
          newImages: uploadedImages,
        });
        alert("이미지 콘텐츠가 성공적으로 수정되었습니다.");
      } else {
        // TODO: 실제 API 호출로 이미지 콘텐츠 등록
        console.log("이미지 콘텐츠 등록:", uploadedImages);
        alert("이미지 콘텐츠가 성공적으로 등록되었습니다.");
      }

      // 성공 시 모달 닫기
      onClose();
      setUploadedImages([]); // 이미지 목록 초기화
    } catch (error) {
      console.error(
        `이미지 콘텐츠 ${mode === "edit" ? "수정" : "등록"} 실패:`,
        error
      );
      alert(
        `이미지 콘텐츠 ${
          mode === "edit" ? "수정" : "등록"
        }에 실패했습니다. 다시 시도해주세요.`
      );
    } finally {
      setIsSubmitting(false);
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
            {mode === "edit" ? "콘텐츠 수정" : "콘텐츠 등록"}
          </h2>

          {/* 이미지 업로드 섹션 */}
          <div className={styles.image_section}>
            <p className={styles.image_label}>
              이미지 ({existingImageUrls.length + uploadedImages.length}/7)
            </p>

            {/* 이미지 그리드 */}
            <div className={styles.image_grid}>
              {/* 기존 이미지 표시 (수정 모드) */}
              {existingImageUrls.map((imageUrl, index) => (
                <div key={`existing-${index}`} className={styles.image_item}>
                  <img
                    src={imageUrl}
                    alt={`기존 이미지 ${index + 1}`}
                    className={styles.uploaded_image}
                  />
                  <button
                    className={styles.remove_button}
                    onClick={() => handleRemoveExistingImage(index)}
                    title="이미지 삭제"
                  >
                    <Image
                      src="/images/icons/close_x_small.svg"
                      alt="삭제"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              ))}

              {/* 새로 업로드한 이미지들 */}
              {uploadedImages.map((image) => (
                <div key={image.id} className={styles.image_item}>
                  <img
                    src={image.preview}
                    alt="업로드된 이미지"
                    className={styles.uploaded_image}
                  />
                  <button
                    className={styles.remove_button}
                    onClick={() => handleRemoveUploadedImage(image.id)}
                    title="이미지 삭제"
                  >
                    <Image
                      src="/images/icons/close_x_small.svg"
                      alt="삭제"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              ))}

              {/* 업로드 버튼 (최대 7장까지) */}
              {existingImageUrls.length + uploadedImages.length < 7 && (
                <div
                  className={styles.upload_button}
                  onClick={handleUploadClick}
                >
                  <div className={styles.upload_icon}>
                    <img
                      src="/images/icons/plus_icon.svg"
                      alt="이미지 추가"
                      className={styles.plus_icon}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 업로드 안내 텍스트 */}
            <p className={styles.upload_guide}>
              • 10mb 이하의 JPG, PNG, GIF 파일 최대 7장까지 등록 가능합니다.
            </p>
          </div>

          {/* 등록/수정 버튼 */}
          <button
            className={styles.submit_button}
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              existingImageUrls.length + uploadedImages.length === 0
            }
          >
            {isSubmitting
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
              width={28}
              height={28}
            />
          </button>

          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            multiple
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </>
  );
}
