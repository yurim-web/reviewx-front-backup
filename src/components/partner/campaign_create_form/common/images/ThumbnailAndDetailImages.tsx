/* ========================================
   🖼️ 썸네일 및 상세 이미지 업로드 컴포넌트
   ======================================== */

/**
 * 썸네일 및 상세 이미지 업로드 컴포넌트
 *
 * 목적: 썸네일(1개)과 상세 이미지(최대 7개)를 분리하여 업로드하는 UI를 제공합니다.
 *
 */

"use client";

import { useRef } from "react";
import infoStyles from "@/styles/partner/campaign_create/campaign_info.module.css";

/**
 * 썸네일 및 상세 이미지 Props
 *
 * 설명:
 * - thumbnailImage: 썸네일 이미지 파일
 * - thumbnailPreview: 썸네일 미리보기 URL
 * - detailImages: 상세 이미지 파일 배열
 * - detailPreviews: 상세 이미지 미리보기 URL 배열
 * - onThumbnailSelect: 썸네일 선택 시 호출되는 콜백 함수
 * - onThumbnailRemove: 썸네일 제거 시 호출되는 콜백 함수
 * - onDetailImagesSelect: 상세 이미지 선택 시 호출되는 콜백 함수
 * - onDetailImageRemove: 상세 이미지 제거 시 호출되는 콜백 함수
 * - isEditMode: 수정 모드 여부
 * - isEditable: 이미지 편집 가능 여부
 */
interface ThumbnailAndDetailImagesProps {
  /** 썸네일 이미지 파일 */
  thumbnailImage: File | null;
  /** 썸네일 미리보기 URL */
  thumbnailPreview: string | null;
  /** 상세 이미지 파일 배열 */
  detailImages: File[];
  /** 상세 이미지 미리보기 URL 배열 */
  detailPreviews: string[];
  /** 썸네일 선택 시 호출되는 콜백 함수 */
  onThumbnailSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** 썸네일 제거 시 호출되는 콜백 함수 */
  onThumbnailRemove: () => void;
  /** 상세 이미지 선택 시 호출되는 콜백 함수 */
  onDetailImagesSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** 상세 이미지 제거 시 호출되는 콜백 함수 */
  onDetailImageRemove: (index: number) => void;
  /** 수정 모드 여부 */
  isEditMode?: boolean;
  /** 이미지 편집 가능 여부 */
  isEditable?: boolean;
}

/**
 * 썸네일 및 상세 이미지 컴포넌트
 *
 * 설명:
 * - 썸네일은 1개만 업로드 가능합니다.
 * - 상세 이미지는 최대 7개까지 업로드 가능합니다.
 * - 각 이미지는 미리보기와 제거 버튼을 제공합니다.
 */
export function ThumbnailAndDetailImages({
  thumbnailImage,
  thumbnailPreview,
  detailImages,
  detailPreviews,
  onThumbnailSelect,
  onThumbnailRemove,
  onDetailImagesSelect,
  onDetailImageRemove,
  isEditMode = false,
  isEditable = true,
}: ThumbnailAndDetailImagesProps) {
  // 파일 입력 요소 참조
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const detailImagesInputRef = useRef<HTMLInputElement>(null);

  /**
   * 썸네일 업로드 버튼 클릭 핸들러
   */
  const handleThumbnailUploadClick = () => {
    if (isEditMode && !isEditable) return;
    thumbnailInputRef.current?.click();
  };

  /**
   * 상세 이미지 업로드 버튼 클릭 핸들러
   */
  const handleDetailImagesUploadClick = () => {
    if (isEditMode && !isEditable) return;
    detailImagesInputRef.current?.click();
  };

  return (
    <>
      {/* 썸네일 업로드 */}
      <article className={infoStyles.form_group}>
        <label className={infoStyles.form_label}>
          썸네일 (1/1)<span className={infoStyles.required}>*</span>
        </label>
        <div className={infoStyles.image_upload_area}>
          {/* 썸네일 미리보기 */}
          {thumbnailPreview && (
            <div className={infoStyles.image_preview_container}>
              <img
                src={thumbnailPreview}
                alt="썸네일 이미지"
                className={infoStyles.image_preview}
              />
              {!(isEditMode && !isEditable) && (
                <button
                  type="button"
                  className={infoStyles.image_remove_button}
                  onClick={onThumbnailRemove}
                  aria-label="썸네일 제거"
                >
                  <img src="/images/icons/img_delete_btn.svg" alt="제거" />
                </button>
              )}
            </div>
          )}

          {/* 썸네일 업로드 버튼 */}
          {!thumbnailPreview && (
            <div
              className={infoStyles.image_upload_placeholder}
              onClick={isEditMode && !isEditable ? undefined : handleThumbnailUploadClick}
              style={
                isEditMode && !isEditable ? { pointerEvents: "none", opacity: 0.5 } : undefined
              }
            >
              <img src="/images/icons/plus_icon.svg" alt="썸네일 추가" />
            </div>
          )}

          {/* 숨겨진 썸네일 파일 입력 */}
          <input
            ref={thumbnailInputRef}
            id="thumbnail-upload"
            type="file"
            accept="image/*"
            onChange={onThumbnailSelect}
            style={{ display: "none" }}
            disabled={isEditMode && !isEditable}
          />
        </div>
      </article>

      {/* 상세 이미지 업로드 */}
      <article className={infoStyles.form_group}>
        <label className={infoStyles.form_label}>
          상세 이미지 ({detailImages.length}/7)
          <span className={infoStyles.required}>*</span>
        </label>
        <div className={infoStyles.image_upload_area}>
          {/* 상세 이미지 미리보기 */}
          {detailPreviews.map((preview, index) => (
            <div key={index} className={infoStyles.image_preview_container}>
              <img
                src={preview}
                alt={`상세 이미지 ${index + 1}`}
                className={infoStyles.image_preview}
              />
              {!(isEditMode && !isEditable) && (
                <button
                  type="button"
                  className={infoStyles.image_remove_button}
                  onClick={() => onDetailImageRemove(index)}
                  aria-label={`상세 이미지 ${index + 1} 제거`}
                >
                  <img src="/images/icons/img_delete_btn.svg" alt="제거" />
                </button>
              )}
            </div>
          ))}

          {/* 상세 이미지 업로드 버튼 (최대 7개까지) - 캠페인 오픈 후에는 숨김 */}
          {detailImages.length < 7 && !(isEditMode && !isEditable) && (
            <div
              className={infoStyles.image_upload_placeholder}
              onClick={isEditMode && !isEditable ? undefined : handleDetailImagesUploadClick}
              style={
                isEditMode && !isEditable ? { pointerEvents: "none", opacity: 0.5 } : undefined
              }
            >
              <img src="/images/icons/plus_icon.svg" alt="상세 이미지 추가" />
            </div>
          )}

          {/* 숨겨진 상세 이미지 파일 입력 */}
          <input
            ref={detailImagesInputRef}
            id="detail-images-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={onDetailImagesSelect}
            style={{ display: "none" }}
            disabled={isEditMode && !isEditable}
          />
        </div>
        {/* 이미지 업로드 안내 문구 */}
        <ul className={infoStyles.image_upload_info}>
          <li>썸네일 및 상세 이미지는 10mb 이하의 JPG, PNG, GIF 파일만 등록할 수 있습니다.</li>
          <li>
            업로드 가능 개수는 화면에 표시된 개수까지 업로드할 수 있습니다. (썸네일 1개, 상세 이미지
            최대 7개)
          </li>
        </ul>
      </article>
    </>
  );
}
