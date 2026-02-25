/* ========================================
   📷 이미지 업로드 섹션 공통 컴포넌트
   ======================================== */

/**
 * 이미지 업로드 섹션 공통 컴포넌트
 *
 * 목적: 모든 캠페인 폼에서 사용되는 이미지 업로드 UI를 재사용 가능하게 만듭니다.
 *
 */

"use client";

import { useRef } from "react";
import Image from "next/image";
import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";

/**
 * 이미지 업로드 섹션 Props
 *
 * 설명:
 * - uploadedImages: 업로드된 이미지 파일 배열
 * - imagePreviews: 이미지 미리보기 URL 배열
 * - onImageSelect: 이미지 선택 시 호출되는 콜백 함수
 * - onImageRemove: 이미지 제거 시 호출되는 콜백 함수
 * - isEditMode: 수정 모드 여부
 * - isEditable: 이미지 편집 가능 여부
 */
interface ImageUploadSectionProps {
  /** 업로드된 이미지 파일 배열 */
  uploadedImages: File[];
  /** 이미지 미리보기 URL 배열 */
  imagePreviews: string[];
  /** 이미지 선택 시 호출되는 콜백 함수 */
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** 이미지 제거 시 호출되는 콜백 함수 */
  onImageRemove: (index: number) => void;
  /** 수정 모드 여부 */
  isEditMode?: boolean;
  /** 이미지 편집 가능 여부 */
  isEditable?: boolean;
}

/**
 * 이미지 업로드 섹션 컴포넌트
 *
 * 설명:
 * - React의 useRef 훅을 사용하여 숨겨진 파일 입력 요소에 접근합니다.
 * - 이미지 미리보기와 제거 버튼을 표시합니다.
 * - 최대 7개까지 이미지를 업로드할 수 있습니다.
 */
export function ImageUploadSection({
  uploadedImages,
  imagePreviews,
  onImageSelect,
  onImageRemove,
  isEditMode = false,
  isEditable = true,
}: ImageUploadSectionProps) {
  // 숨겨진 파일 입력 요소 참조
  // 설명: useRef를 사용하여 DOM 요소에 직접 접근할 수 있습니다.
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 이미지 업로드 버튼 클릭 핸들러
   *
   * 설명:
   * - 숨겨진 파일 입력 요소를 클릭하여 파일 선택 다이얼로그를 엽니다.
   */
  const handleUploadClick = () => {
    if (isEditMode && !isEditable) return;
    fileInputRef.current?.click();
  };

  return (
    <article className={infoStyles.form_group}>
      <label className={infoStyles.form_label}>
        썸네일/상세 이미지<span className={infoStyles.required}>*</span>
      </label>
      <div className={infoStyles.image_upload_area}>
        {/* 업로드된 이미지 미리보기 */}
        {imagePreviews.map((preview, index) => (
          <div key={index} className={infoStyles.image_preview_container}>
            <Image
              src={preview}
              alt={`업로드된 이미지 ${index + 1}`}
              className={infoStyles.image_preview}
              fill
            />
            <button
              type="button"
              className={infoStyles.image_remove_button}
              onClick={() => onImageRemove(index)}
              aria-label="이미지 제거"
              disabled={isEditMode && !isEditable}
            >
              ×
            </button>
          </div>
        ))}

        {/* 이미지 업로드 버튼 (최대 7개까지) */}
        {uploadedImages.length < 7 && (
          <div
            className={infoStyles.image_upload_placeholder}
            onClick={isEditMode && !isEditable ? undefined : handleUploadClick}
            style={isEditMode && !isEditable ? { pointerEvents: "none", opacity: 0.5 } : undefined}
          >
            <Image src="/images/icons/plus_icon.svg" alt="이미지 추가" width={56} height={56} />
          </div>
        )}
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        id="image-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={onImageSelect}
        style={{ display: "none" }}
        disabled={isEditMode && !isEditable}
      />
    </article>
  );
}
