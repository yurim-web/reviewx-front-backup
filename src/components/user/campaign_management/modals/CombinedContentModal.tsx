/* ========================================
   🔗📸 통합 콘텐츠 등록 모달 컴포넌트 (유저용)
   ======================================== */

/**
 * 통합 콘텐츠 등록/수정 모달 컴포넌트 (유저용)
 *
 * 목적: 사용자가 링크와 이미지를 모두 업로드하여 콘텐츠를 등록하거나 수정할 수 있는 모달입니다.
 *
 * 사용 위치:
 * - 유저 캠페인 관리 페이지 > 취소/반려 탭 > 미션형 캠페인
 *   - "콘텐츠 수정" 버튼 클릭 시 (수정 모드)
 *   - RejectedTabCard 컴포넌트에서 campaign.type === "미션형"일 때 사용
 *
 * 모달 구성:
 * 1. 링크 입력 섹션
 *    - URL 입력 필드 (선택 사항)
 *    - 등록 모드: 빈 입력창에서 새로 입력
 *    - 수정 모드: 기존 등록된 링크가 미리 입력되어 있음
 *    - 링크가 입력된 경우 URL 형식 검증
 *
 * 2. 이미지 업로드 섹션
 *    - 이미지 업로드 (최대 7장, 10MB 이하)
 *    - 등록 모드: 빈 상태에서 새로 업로드
 *    - 수정 모드: 기존 등록된 이미지가 미리 표시됨
 *    - 업로드된 이미지 미리보기
 *    - 이미지 삭제 기능
 *    - JPG, PNG, GIF 파일 형식 지원
 *
 * 3. 등록/수정 버튼
 *    - 링크 또는 이미지 중 최소 하나는 입력되어야 함
 *    - mode prop에 따라 버튼 텍스트 변경 ("등록하기" / "수정")
 *
 * 오류 처리:
 * - 링크 검증 오류: BaseModal로 "콘텐츠를 확인할 수 없습니다." 표시
 * - 이미지 오류: alert 사용 (향후 BaseModal로 변경 예정)
 *   - 이미지 개수 초과 (7장)
 *   - 파일 형식 오류 (JPG, PNG, GIF만 허용)
 *   - 파일 크기 오류 (10MB 이하)
 *
 * 다른 모달과의 차이점:
 * - ContentRegistrationModal: 링크만 입력 (배송형, 방문형, 기자단)
 * - ImageUploadModal: 이미지만 업로드 (구매평)
 * - CombinedContentModal: 링크 + 이미지 모두 지원 (미션형)
 */

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BaseModal from "@/components/common/modal/BaseModal";
import styles from "../../../../styles/user/campaign_management/modals/combined_content_modal.module.css";

interface CombinedContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
  /** 모달 모드: "register" (등록) 또는 "edit" (수정) */
  mode?: "register" | "edit";
  /** 수정 모드일 때 기존에 등록된 콘텐츠 링크 */
  existingLink?: string;
  /** 수정 모드일 때 기존에 등록된 이미지 URL 배열 */
  existingImages?: string[];
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

export default function CombinedContentModal({
  isOpen,
  onClose,
  campaignTitle,
  mode = "register",
  existingLink = "",
  existingImages = [],
}: CombinedContentModalProps) {
  const [linkUrl, setLinkUrl] = useState("");
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

  /**
   * 모달이 열릴 때 기존 데이터 설정
   *
   * 설명:
   * - useEffect: 컴포넌트가 렌더링된 후 실행되는 React 훅입니다.
   * - 의존성 배열 [isOpen, mode, existingLink, existingImages]: 이 값들이 변경될 때마다 실행됩니다.
   * - 수정 모드일 때 기존 링크와 이미지를 미리 채워넣습니다.
   */
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit") {
        // 수정 모드: 기존 링크와 이미지를 초기값으로 설정
        setLinkUrl(existingLink || "");
        setExistingImageUrls(existingImages || []);
      } else {
        // 등록 모드: 빈 값으로 초기화
        setLinkUrl("");
        setExistingImageUrls([]);
      }
      setUploadedImages([]);
    }
  }, [isOpen, mode, existingLink, existingImages]);

  if (!isOpen) return null;

  // 링크 입력 핸들러
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkUrl(e.target.value);
  };

  // 기존 이미지 삭제 핸들러
  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 최대 7장 제한 확인 (기존 이미지 + 업로드된 이미지 + 새로 선택한 파일)
    const totalImages =
      existingImageUrls.length + uploadedImages.length + files.length;
    if (totalImages > 7) {
      alert("최대 7장까지만 업로드 가능합니다.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

  // 오류 모달 닫기 핸들러
  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, message: "" });
  };

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 콘텐츠 등록/수정 완료
  const handleSubmit = async () => {
    // 링크와 이미지 중 최소 하나는 입력되어야 함
    const totalImages = existingImageUrls.length + uploadedImages.length;
    if (!linkUrl.trim() && totalImages === 0) {
      alert("링크 또는 이미지를 최소 하나 이상 입력해주세요.");
      return;
    }

    // 링크가 입력된 경우 URL 형식 검증
    if (linkUrl.trim()) {
      try {
        new URL(linkUrl);
      } catch {
        setErrorModal({
          isOpen: true,
          message: "콘텐츠를 확인할 수 없습니다.",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === "edit") {
        // TODO: 실제 API 호출로 통합 콘텐츠 수정
        console.log("통합 콘텐츠 수정:", {
          linkUrl: linkUrl.trim(),
          existingImages: existingImageUrls,
          newImages: uploadedImages,
        });
        alert("콘텐츠가 성공적으로 수정되었습니다.");
      } else {
        // TODO: 실제 API 호출로 통합 콘텐츠 등록
        console.log("통합 콘텐츠 등록:", {
          linkUrl: linkUrl.trim(),
          images: uploadedImages,
        });
        alert("콘텐츠가 성공적으로 등록되었습니다.");
      }

      // 성공 시 모달 닫기
      onClose();
      setLinkUrl(""); // 입력창 초기화
      setUploadedImages([]); // 이미지 목록 초기화
      setExistingImageUrls([]); // 기존 이미지 목록 초기화
    } catch (error) {
      console.error(`콘텐츠 ${mode === "edit" ? "수정" : "등록"} 실패:`, error);
      alert(
        `콘텐츠 ${
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

          {/* 링크 섹션 */}
          <div className={styles.link_section}>
            <p className={styles.link_label}>링크</p>
            <input
              type="url"
              className={styles.link_input}
              placeholder="https://example.com"
              value={linkUrl}
              onChange={handleLinkChange}
            />
          </div>

          {/* 이미지 업로드 섹션 */}
          <div className={styles.image_section}>
            <p className={styles.image_label}>이미지</p>

            {/* 이미지 그리드 */}
            <div className={styles.image_grid}>
              {/* 기존 이미지들 (수정 모드일 때 표시) */}
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
              (!linkUrl.trim() &&
                existingImageUrls.length + uploadedImages.length === 0)
            }
          >
            {isSubmitting
              ? mode === "edit"
                ? "수정 중..."
                : "등록 중..."
              : mode === "edit"
              ? "수정"
              : "등록하기"}
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
