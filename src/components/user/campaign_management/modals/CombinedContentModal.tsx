/* ========================================
   통합 콘텐츠 등록 모달 컴포넌트 (유저용)
   ======================================== */

/**
 * 통합 콘텐츠 등록/수정 모달 컴포넌트 (유저용)
 *
 * 목적: 미션형 캠페인의 링크+이미지 동시 업로드를 지원하는 콘텐츠 등록/수정 모달
 *
 * 사용 페이지:
 * - /user/campaign_management (선정 탭 - 미션형 콘텐츠 등록/수정)
 * - /user/campaign_management (취소/반려 탭 - 미션형 콘텐츠 재등록)
 */

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BaseModal from "@/components/common/modal/BaseModal";
import ContentVerificationModal from "./content_verification/ContentVerificationModal";
import { useModalState } from "@/hooks/useModalState";
import styles from "../../../../styles/user/campaign_management/modals/campaign_modal_common.module.css";
import type { CampaignType } from "@/types/domain/user";

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

export default function CombinedContentModal({
  isOpen,
  onClose,
  campaignTitle,
  mode = "register",
  existingLink = "",
  existingImages = [],
  campaignId,
  campaignType,
  onContentRegistered,
}: CombinedContentModalProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 콘텐츠 확인 모달 상태 관리
  const verificationModal = useModalState();

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

  /**
   * 모달이 열릴 때 기존 데이터 설정
   *
   * 설명:
   * - useEffect: 컴포넌트가 렌더링된 후 실행되는 React 훅입니다.
   * - 의존성 배열 [isOpen, mode]: 모달이 열릴 때와 모드가 변경될 때만 실행됩니다.
   * - existingLink와 existingImages는 의존성 배열에서 제외하여 무한 루프를 방지합니다.
   * - 수정 모드일 때 기존 링크와 이미지를 미리 채워넣습니다.
   *

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
    } else {
      // 모달이 닫힐 때도 초기화 (선택사항)
      setLinkUrl("");
      setExistingImageUrls([]);
      setUploadedImages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode]);

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
    const totalImages = existingImageUrls.length + uploadedImages.length + files.length;
    if (totalImages > 7) {
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setErrorModal({
        isOpen: true,
        message: "이미지는 최대 7장까지 등록할 수 있습니다.",
      });
      return;
    }

    // 파일 형식 및 크기 검증
    const validFiles: File[] = [];
    for (const file of files) {
      // 파일 형식 검증
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setErrorModal({
          isOpen: true,
          message: "지정된 확장자(JPG, PNG, GIF)만<br>업로드할 수 있습니다.",
        });
        return;
      }

      // 파일 크기 검증 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setErrorModal({
          isOpen: true,
          message: "10mb 이하의 파일만 업로드할 수 있습니다.",
        });
        return;
      }

      validFiles.push(file);
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
          // 성공적으로 업로드된 경우 파일 입력 초기화
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
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

  /**
   * 등록/수정 버튼 클릭 핸들러
   *
   * 설명:
   * - 등록/수정 버튼을 누르면 먼저 입력값을 검증합니다.
   * - 검증이 통과하면 콘텐츠 확인 모달을 엽니다.
   * - 실제 등록/수정 처리는 콘텐츠 확인 모달에서 제출을 눌렀을 때 이루어집니다.
   */
  const handleSubmit = () => {
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

    // 검증이 통과하면 콘텐츠 확인 모달 열기
    verificationModal.open();
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
        // TODO: 실제 API 호출로 통합 콘텐츠 수정
        // 콘텐츠 확인 모달 닫기
        verificationModal.close();
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
        // TODO: 실제 API 호출로 통합 콘텐츠 등록
        // 콘텐츠 확인 모달 닫기
        verificationModal.close();
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
    } catch (_error) {
      alert(`콘텐츠 ${mode === "edit" ? "수정" : "등록"}에 실패했습니다. 다시 시도해주세요.`);
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
          setLinkUrl("");
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
      {verificationModal.isOpen && (
        <ContentVerificationModal
          isOpen={verificationModal.isOpen}
          onClose={() => verificationModal.close()}
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
            <div className={styles.modal_container}>
              {/* 모달 헤더 (제목 + 닫기 버튼) */}
              <div className={styles.modal_header}>
                {/* 모달 제목 */}
                <h2 className={styles.modal_title}>
                  {mode === "edit" ? "콘텐츠 수정" : "콘텐츠 등록"}
                </h2>
                {/* 닫기 버튼 */}
                <button className={styles.close_button} onClick={onClose}>
                  <Image src="/images/filter/x_icon.svg" alt="닫기" width={28} height={28} />
                </button>
              </div>

              {/* 링크 섹션 */}
              <div className={`${styles.link_section} ${styles.link_section_mobile_pb}`}>
                <p className={styles.link_label}>링크</p>
                <input
                  type="url"
                  className={styles.link_input}
                  placeholder="콘텐츠 링크 입력"
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
                      <Image
                        src={imageUrl}
                        alt={`기존 이미지 ${index + 1}`}
                        fill
                        style={{ objectFit: "cover", borderRadius: "8px" }}
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

                  {/* 업로드된 이미지들 */}
                  {uploadedImages.map((image) => (
                    <div key={image.id} className={styles.image_item}>
                      <Image
                        src={image.preview}
                        alt="업로드된 이미지"
                        fill
                        unoptimized
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                      <button
                        className={styles.remove_button}
                        onClick={() => handleImageRemove(image.id)}
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
                    <div className={styles.upload_button} onClick={handleUploadClick}>
                      <div className={styles.upload_icon}>
                        <Image
                          src="/images/icons/plus_icon.svg"
                          alt="이미지 추가"
                          width={56}
                          height={56}
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
                  (!linkUrl.trim() && existingImageUrls.length + uploadedImages.length === 0)
                }
              >
                {isSubmitting ? "확인 중..." : "확인"}
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
