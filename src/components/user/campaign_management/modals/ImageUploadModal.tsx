/* ========================================
   📸 이미지 업로드 콘텐츠 등록 모달 컴포넌트 (유저용)
   ======================================== */

/**
 * 이미지 업로드 콘텐츠 등록 모달 컴포넌트 (유저용)
 *
 * 목적: 사용자가 이미지를 업로드하여 콘텐츠를 등록할 수 있는 모달입니다.
 *
 * 사용 위치:
 * 1. 선정 탭
 *    - 미션형 캠페인 (contentType === "image"인 경우)
 *      - "콘텐츠 등록" 버튼 클릭 시 (등록 모드)
 *      - "콘텐츠 수정" 버튼 클릭 시 (수정 모드)
 *    - 구매평 캠페인 (등록기간일 때)
 *      - "콘텐츠 등록하기" 버튼 클릭 시 (등록 모드)
 *      - "콘텐츠 수정하기" 버튼 클릭 시 (수정 모드)
 *    - SelectedTabModals 컴포넌트에서 사용
 *
 * 2. 취소/반려 탭
 *    - 구매평 캠페인
 *      - "콘텐츠 재등록하기" 버튼 클릭 시 (등록 모드)
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
 * - ContentRegistrationModal: 링크만 입력 (배송형, 방문형, 기자단, 미션형-링크만)
 * - ImageUploadModal: 이미지만 업로드 (구매평, 미션형-이미지만)
 * - CombinedContentModal: 링크 + 이미지 모두 지원 (미션형-링크+이미지)
 * - ReceiptRegistrationModal: 구매 영수증 이미지 업로드 (미션형, 구매평)
 */

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BaseModal from "@/components/common/modal/BaseModal";
import ContentVerificationModal from "./content_verification/ContentVerificationModal";
import styles from "../../../../styles/user/campaign_management/modals/campaign_modal_common.module.css";
import type { CampaignType } from "@/types/domain/user";

/**
 * 설명:
 * - styles: 통합된 캠페인 모달 스타일 (모든 모달이 공통으로 사용)
 * - 모든 모달 스타일이 campaign_modal_common.module.css에 통합되어 있습니다.
 */

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
  mode?: "register" | "edit";
  existingImages?: string[]; // 수정 모드일 때 기존 이미지 URL 배열
  /** 캠페인 ID (콘텐츠 확인 모달에서 requirements를 가져오기 위해 필요) */
  campaignId?: string;
  /** 캠페인 타입 (콘텐츠 확인 모달에서 requirements를 가져오기 위해 필요) */
  campaignType?: CampaignType;
  /** 콘텐츠 등록 성공 시 호출되는 콜백 (등록 모드일 때만 호출) */
  onContentRegistered?: (campaignId?: string) => void;
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
  campaignId,
  campaignType,
  onContentRegistered,
}: ImageUploadModalProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달 초기화 플래그 - useRef로 관리하여 리렌더링 트리거 방지
  const isInitializedRef = useRef(false);

  // 콘텐츠 확인 모달 상태 관리
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // 성공 모달 상태 관리
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  // 오류 모달 상태 관리
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  // 모달이 열릴 때 기존 이미지 설정
  // isOpen만 의존성으로 하여 모달이 열릴 때만 초기화
  useEffect(() => {
    if (isOpen && !isInitializedRef.current) {
      // 모달이 처음 열릴 때만 초기화
      console.log("[ImageUploadModal] Modal opening - initializing state");
      console.log("[ImageUploadModal] Mode:", mode, "Existing images:", existingImages.length);

      if (mode === "edit" && existingImages.length > 0) {
        setExistingImageUrls(existingImages);
      } else {
        setExistingImageUrls([]);
      }
      setUploadedImages([]);
      isInitializedRef.current = true;
    }

    if (!isOpen && isInitializedRef.current) {
      // 모달이 닫힐 때 플래그 리셋
      console.log("[ImageUploadModal] Modal closing - resetting initialization flag");
      isInitializedRef.current = false;
    }
  }, [isOpen]); // isOpen만 의존성으로 설정

  // 메인 모달이 닫혀있고, 성공 모달이나 콘텐츠 확인 모달도 닫혀있을 때만 렌더링하지 않음
  if (!isOpen && !successModal.isOpen && !isVerificationModalOpen) return null;

  // 오류 모달 닫기 핸들러
  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, message: "" });
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[ImageUploadModal] handleFileSelect called");
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      console.log("[ImageUploadModal] No files selected");
      return;
    }

    console.log("[ImageUploadModal] Files selected:", files.length);
    console.log("[ImageUploadModal] Current uploadedImages count:", uploadedImages.length);
    console.log("[ImageUploadModal] Current existingImageUrls count:", existingImageUrls.length);

    // 최대 7장 제한 확인 (기존 이미지 + 새로 업로드할 이미지 합산)
    const totalImages =
      existingImageUrls.length + uploadedImages.length + files.length;
    console.log("[ImageUploadModal] Total images after upload:", totalImages);

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

    console.log("[ImageUploadModal] Valid files to process:", validFiles.length);
    setIsUploading(true);

    // 이미지 미리보기 생성
    const newImages: UploadedImage[] = [];
    let processedCount = 0;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("[ImageUploadModal] File loaded:", file.name);
        const newImage: UploadedImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
        };
        newImages.push(newImage);

        processedCount++;
        console.log("[ImageUploadModal] Processed count:", processedCount, "Total:", validFiles.length);

        if (processedCount === validFiles.length) {
          console.log("[ImageUploadModal] All files processed. New images count:", newImages.length);
          console.log("[ImageUploadModal] Before setState - uploadedImages:", uploadedImages.length);

          setUploadedImages((prev) => {
            console.log("[ImageUploadModal] Inside setState - prev length:", prev.length);
            console.log("[ImageUploadModal] Inside setState - newImages length:", newImages.length);
            const updated = [...prev, ...newImages];
            console.log("[ImageUploadModal] Inside setState - updated length:", updated.length);
            return updated;
          });

          setIsUploading(false);

          // 파일 입력 초기화 - 모든 처리가 완료된 후에 초기화
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          console.log("[ImageUploadModal] Upload process completed");
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

  /**
   * 등록/수정 버튼 클릭 핸들러
   *
   * 설명:
   * - 등록/수정 버튼을 누르면 먼저 입력값을 검증합니다.
   * - 검증이 통과하면 콘텐츠 확인 모달을 엽니다.
   * - 실제 등록/수정 처리는 콘텐츠 확인 모달에서 제출을 눌렀을 때 이루어집니다.
   */
  const handleSubmit = () => {
    const totalImages = existingImageUrls.length + uploadedImages.length;
    if (totalImages === 0) {
      alert("최소 1장 이상의 이미지를 업로드해주세요.");
      return;
    }

    // 검증이 통과하면 콘텐츠 확인 모달 열기
    setIsVerificationModalOpen(true);
  };

  /**
   * 콘텐츠 확인 모달에서 제출 버튼을 눌렀을 때 실행되는 함수
   *
   * 설명:
   * - 콘텐츠 확인 모달에서 제출을 누르면 실제 등록/수정 처리를 진행합니다.
   * - 등록/수정이 완료되면 성공 모달을 표시하고 모든 모달을 닫고 입력값을 초기화합니다.
   */
  const handleConfirmVerification = async () => {
    setIsSubmitting(true);

    try {
      if (mode === "edit") {
        // TODO: 실제 API 호출로 이미지 콘텐츠 수정
        console.log("이미지 콘텐츠 수정:", {
          existingImages: existingImageUrls,
          newImages: uploadedImages,
        });
        // 콘텐츠 확인 모달 닫기
        setIsVerificationModalOpen(false);
        // 성공 모달 먼저 표시
        setSuccessModal({
          isOpen: true,
          message: "콘텐츠가 수정되었습니다.",
        });
        // 메인 모달 닫기 (약간의 딜레이를 주어 성공 모달이 먼저 렌더링되도록)
        setTimeout(() => {
          onClose();
        }, 0);
      } else {
        // TODO: 실제 API 호출로 이미지 콘텐츠 등록
        console.log("이미지 콘텐츠 등록:", uploadedImages);
        // 콘텐츠 확인 모달 닫기
        setIsVerificationModalOpen(false);
        // 성공 모달 먼저 표시
        setSuccessModal({
          isOpen: true,
          message: "콘텐츠가 등록되었습니다.",
        });
        // 메인 모달 닫기 (약간의 딜레이를 주어 성공 모달이 먼저 렌더링되도록)
        setTimeout(() => {
          onClose();
        }, 0);
      }

      // 입력값 초기화는 성공 모달을 닫을 때 수행
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
      {/* 성공 모달 */}
      <BaseModal
        is_open={successModal.isOpen}
        on_close={() => {
          setSuccessModal({ isOpen: false, message: "" });
          // 입력값 초기화
          setUploadedImages([]);
          setExistingImageUrls([]);
          // 콘텐츠 등록 성공 콜백 호출 (등록 모드일 때만)
          if (mode === "register" && onContentRegistered) {
            onContentRegistered(campaignId);
          }
        }}
        message={successModal.message}
        buttons={["닫기"]}
        type="center"
      />

      {/* 콘텐츠 확인 모달 - 항상 렌더링 (메인 모달이 닫혀있어도 확인 모달은 표시될 수 있음) */}
      {isVerificationModalOpen && (
        <ContentVerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          campaignTitle={campaignTitle}
          campaignId={campaignId}
          campaignType={campaignType}
          onConfirm={handleConfirmVerification}
        />
      )}

      {/* 메인 모달은 isOpen일 때만 렌더링 */}
      {isOpen && (
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
            <div
              className={`${styles.modal_container} ${styles.modal_container_scroll}`}
            >
              {/* 모달 헤더 (제목 + 닫기 버튼) */}
              <div className={styles.modal_header}>
                {/* 모달 제목 */}
                <h2 className={styles.modal_title}>
                  {mode === "edit" ? "콘텐츠 수정" : "콘텐츠 등록"}
                </h2>
                {/* 닫기 버튼 */}
                <button className={styles.close_button} onClick={onClose}>
                  <Image
                    src="/images/filter/x_icon.svg"
                    alt="닫기"
                    width={28}
                    height={28}
                  />
                </button>
              </div>

              {/* 이미지 업로드 섹션 */}
              <div className={styles.image_section}>
                <p className={styles.image_label}>
                  이미지 ({existingImageUrls.length + uploadedImages.length}/7)
                </p>

                {/* 이미지 그리드 */}
                <div className={styles.image_grid}>
                  {/* 기존 이미지 표시 (수정 모드) */}
                  {existingImageUrls.map((imageUrl, index) => (
                    <div
                      key={`existing-${index}`}
                      className={styles.image_item}
                    >
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
                          src="/images/icons/img_delete_btn.svg"
                          alt="이미지 삭제"
                          width={24}
                          height={24}
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
                          src="/images/icons/img_delete_btn.svg"
                          alt="이미지 삭제"
                          width={24}
                          height={24}
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
                {isSubmitting ? "등록 중..." : "등록"}
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
      )}
    </>
  );
}
