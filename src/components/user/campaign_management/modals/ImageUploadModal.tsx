/* ========================================
   📸 이미지 업로드 콘텐츠 등록 모달 컴포넌트 (유저용)
   ======================================== */

/**
 * 이미지 업로드 콘텐츠 등록 모달 컴포넌트 (유저용)
 *
 * 목적: 사용자가 이미지를 업로드하여 콘텐츠를 등록할 수 있는 모달입니다.
 *
 * 사용 위치:
 * - 유저 캠페인 관리 페이지에서 "이미지 콘텐츠 등록하기" 버튼 클릭 시
 *
 * 주요 기능:
 * - 이미지 파일 업로드 (최대 7장, 10MB 이하)
 * - 업로드된 이미지 미리보기
 * - 이미지 삭제 기능
 * - JPG, PNG, GIF 파일 형식 지원
 * - 콘텐츠 등록 완료
 */

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import styles from "../../../../styles/user/campaign_management/modals/image_upload_modal.module.css";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
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
}: ImageUploadModalProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 최대 7장 제한 확인
    if (uploadedImages.length + files.length > 7) {
      alert("최대 7장까지만 업로드 가능합니다.");
      return;
    }

    // 파일 형식 및 크기 검증
    const validFiles: File[] = [];
    for (const file of files) {
      // 파일 형식 검증
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        alert(`${file.name}: JPG, PNG, GIF 파일만 업로드 가능합니다.`);
        continue;
      }

      // 파일 크기 검증 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name}: 파일 크기는 10MB 이하여야 합니다.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

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

  // 이미지 삭제 핸들러
  const handleImageRemove = (imageId: string) => {
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

  // 콘텐츠 등록 완료
  const handleSubmit = async () => {
    if (uploadedImages.length === 0) {
      alert("최소 1장 이상의 이미지를 업로드해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 실제 API 호출로 이미지 콘텐츠 등록
      console.log("이미지 콘텐츠 등록:", uploadedImages);

      // 성공 시 모달 닫기
      alert("이미지 콘텐츠가 성공적으로 등록되었습니다.");
      onClose();
      setUploadedImages([]); // 이미지 목록 초기화
    } catch (error) {
      console.error("이미지 콘텐츠 등록 실패:", error);
      alert("이미지 콘텐츠 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modal_overlay} onClick={handleOverlayClick}>
      <div className={styles.modal_container}>
        {/* 모달 제목 */}
        <h2 className={styles.modal_title}>콘텐츠 등록</h2>

        {/* 이미지 업로드 섹션 */}
        <div className={styles.image_section}>
          <p className={styles.image_label}>이미지</p>

          {/* 이미지 그리드 */}
          <div className={styles.image_grid}>
            {/* 업로드된 이미지들 */}
            {uploadedImages.map((image) => (
              <div key={image.id} className={styles.image_item}>
                <img
                  src={image.preview}
                  alt="업로드된 이미지"
                  className={styles.uploaded_image}
                />
                <button
                  className={styles.remove_button}
                  onClick={() => handleImageRemove(image.id)}
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
            {uploadedImages.length < 7 && (
              <div className={styles.upload_button} onClick={handleUploadClick}>
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

        {/* 등록 버튼 */}
        <button
          className={styles.submit_button}
          onClick={handleSubmit}
          disabled={isSubmitting || uploadedImages.length === 0}
        >
          {isSubmitting ? "등록 중..." : "등록하기"}
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
  );
}
