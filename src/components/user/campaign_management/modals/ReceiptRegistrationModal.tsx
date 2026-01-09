/* ========================================
   📄 구매 영수증 등록 모달 컴포넌트 (유저용)
   ======================================== */

/**
 * 구매 영수증 등록 모달 컴포넌트 (유저용)
 *
 * 목적: 사용자가 구매 영수증 이미지를 등록하거나 수정할 수 있는 모달입니다.
 *
 * 사용 위치:
 * 1. 선정 탭 > 구매평 캠페인 (구매기간일 때 - 1차)
 *    - "구매 영수증 등록" 버튼 클릭 시 (등록 모드)
 *    - "구매 영수증 수정" 버튼 클릭 시 (수정 모드)
 *    - SelectedTabModals 컴포넌트에서 isPurchasePeriod === true일 때 사용
 *    - 구매평의 구매기간(1차)에만 사용되며, 등록기간(2차)에는 ImageUploadModal 사용
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
 * - ContentRegistrationModal: 링크만 입력 (배송형, 방문형, 기자단, 미션형-링크만)
 * - ImageUploadModal: 콘텐츠 이미지 업로드 (구매평-등록기간, 미션형-이미지만)
 * - CombinedContentModal: 링크 + 이미지 모두 지원 (미션형-링크+이미지)
 * - ReceiptRegistrationModal: 구매 영수증 이미지 업로드 (구매평-구매기간)
 */

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BaseModal from "@/components/common/modal/BaseModal";
import ErrorText from "@/components/common/error_text/ErrorText";
import styles from "../../../../styles/user/campaign_management/modals/campaign_modal_common.module.css";

/**
 * 설명:
 * - styles: 통합된 캠페인 모달 스타일 (모든 모달이 공통으로 사용)
 * - 모든 모달 스타일이 campaign_modal_common.module.css에 통합되어 있습니다.
 */

/**
 * 검수 실패 항목 타입
 */
export type ValidationFailureType =
  | "order_number"
  | "delivery_address"
  | "order_amount"
  | "purchase_item";

interface ReceiptRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
  mode?: "register" | "edit";
  existingImages?: string[]; // 수정 모드일 때 기존 이미지 URL 배열
}

/**
 * 검수 실패 항목별 에러 메시지 맵
 *
 * 설명:
 * - 각 검수 실패 항목에 대한 안내 메시지를 정의합니다.
 * - <br> 태그를 공백으로 변환하여 ErrorText에서 사용합니다.
 */
const VALIDATION_MESSAGES: Record<ValidationFailureType, string> = {
  order_number:
    "영수증에 주문번호가 확인되지 않습니다. 주문번호가 포함된 영수증을 추가 등록해 주세요.",
  delivery_address:
    "영수증에 배송지가 확인되지 않습니다. 배송지가 포함된 영수증을 추가 등록해 주세요.",
  order_amount:
    "영수증에 주문 금액이 확인되지 않습니다. 주문 금액이 포함된 영수증을 추가 등록해 주세요.",
  purchase_item:
    "영수증에 구매 상품이 확인되지 않습니다. 구매 상품이 포함된 영수증으로 추가 등록해 주세요.",
} as const;

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

  // 구매 영수증 검수 실패 항목 상태
  const [validationError, setValidationError] =
    useState<ValidationFailureType | null>(null);

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

  // 모달이 열릴 때 기존 이미지 설정 및 검수 에러 초기화
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && existingImages.length > 0) {
        setExistingImageUrls(existingImages);
      } else {
        setExistingImageUrls([]);
      }
      setUploadedImages([]);
      setValidationError(null); // 모달이 열릴 때 검수 에러 초기화
    }
  }, [isOpen, mode, existingImages]);

  // 메인 모달이 닫혀있고, 성공 모달도 닫혀있을 때만 렌더링하지 않음
  if (!isOpen && !successModal.isOpen) return null;

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
    // 새로운 이미지가 추가되면 검수 에러 초기화
    setValidationError(null);
  };

  // 기존 이미지 삭제 핸들러
  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // 새로 업로드한 이미지 삭제 핸들러
  const handleRemoveUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    // 이미지가 변경되면 검수 에러 초기화
    setValidationError(null);
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

  /**
   * 구매 영수증 검수 함수
   *
   * 설명:
   * - 업로드된 영수증 이미지를 검수하여 필수 항목이 모두 포함되어 있는지 확인합니다.
   * - 검수 항목: 주문번호, 배송지, 주문 금액, 구매 상품
   * - TODO: 실제 API를 통한 이미지 인식 및 검수 로직으로 대체 예정
   *
   * @returns 검수 실패 항목 (모두 통과하면 null)
   */
  const validateReceipt = (): ValidationFailureType | null => {
    // TODO: 실제 API 호출로 영수증 이미지 검수
    // 실제 구현 시 업로드된 이미지를 분석하여 검수 결과 반환

    // 테스트용: 항상 주문번호 검수 실패로 설정 (나중에 실제 검수 로직으로 변경)
    // 실제 검수 통과 시: return null;
    // 각각 구매영수증 마다 다를 것 `구매영수증 이미지 검수` 함수 사용
    return "order_number"; // 임시로 주문번호 검수 실패 반환
  };

  /**
   * 제출 버튼 클릭 핸들러
   *
   * 설명:
   * - 제출 버튼을 누르면 먼저 입력값을 검증합니다.
   * - 구매 영수증 검수 수행 (주문번호, 배송지, 주문금액, 구매상품 확인)
   * - 검수 실패 시: VALIDATION_MESSAGES의 에러 메시지 표시 (ErrorText 컴포넌트로 표시)
   * - 검수 통과 시: 바로 등록/수정 처리를 진행 (콘텐츠 확인 모달 없이)
   * - 등록/수정이 완료되면 성공 모달을 표시하고 모든 모달을 닫고 입력값을 초기화합니다.
   *
   * 다른 모달과의 차이점:
   * - 다른 모달들(ContentRegistrationModal, ImageUploadModal, CombinedContentModal):
   *   검증 통과 → 콘텐츠 확인 모달 표시 → 제출 → 성공 모달
   * - ReceiptRegistrationModal:
   *   검증 통과 → 바로 등록/수정 처리 → 성공 모달 (콘텐츠 확인 모달 없음)
   */
  const handleSubmit = async () => {
    const totalImages = existingImageUrls.length + uploadedImages.length;
    if (totalImages === 0) {
      alert("영수증 이미지를 최소 1장 이상 업로드해주세요.");
      return;
    }

    // 구매 영수증 검수 수행 (주문번호, 배송지, 주문금액, 구매상품 확인)
    const failureType = validateReceipt();
    if (failureType) {
      // 검수 실패 시: VALIDATION_MESSAGES의 에러 메시지를 ErrorText로 표시
      setValidationError(failureType);
      return;
    }

    // 검수 통과 시: 검수 에러 초기화하고 바로 등록/수정 처리 진행
    setValidationError(null);

    setIsUploading(true);

    try {
      if (mode === "edit") {
        // TODO: 실제 API 호출로 영수증 수정
        console.log("영수증 수정:", {
          existingImages: existingImageUrls,
          newImages: uploadedImages,
        });
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
        // TODO: 실제 API 호출로 영수증 등록
        console.log("영수증 등록:", uploadedImages);
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
      {/* 성공 모달 */}
      <BaseModal
        is_open={successModal.isOpen}
        on_close={() => {
          setSuccessModal({ isOpen: false, message: "" });
          // 입력값 초기화
          setUploadedImages([]);
          setExistingImageUrls([]);
        }}
        message={successModal.message}
        buttons={["닫기"]}
        type="center"
      />

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
                {existingImageUrls.length === 0 &&
                uploadedImages.length === 0 ? (
                  <div
                    className={styles.image_upload_area}
                    onClick={openFileInput}
                  >
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
                  <div className={styles.image_grid_grid}>
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
                            // 이미지가 변경되면 검수 에러 초기화
                            setValidationError(null);
                          }}
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
                          <Image
                            src="/images/icons/img_delete_btn.svg"
                            alt="이미지 삭제"
                            width={24}
                            height={24}
                          />
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
                    주문번호, 구매 상품, 주문 금액, 배송지가 모두 확인될 수
                    있도록 캡처한 이미지를 업로드해 주세요.
                  </li>
                </ul>
              </div>

              {/* 검수 에러 메시지 */}
              {validationError && (
                <ErrorText message={VALIDATION_MESSAGES[validationError]} />
              )}

              {/* 등록/수정 버튼 */}
              {/* 
            설명:
            - 이미지가 한 개 이상 올라가 있어야 버튼이 활성화됩니다.
            - 검수 에러가 있거나 업로드 중이면 버튼이 비활성화됩니다.
            - disabled 조건:
              1. isUploading: 업로드/수정 진행 중
              2. !!validationError: 검수 실패 항목이 있을 때
              3. totalImages === 0: 이미지가 한 개도 없을 때
          */}
              <button
                className={styles.submit_button}
                onClick={handleSubmit}
                disabled={
                  isUploading ||
                  !!validationError ||
                  existingImageUrls.length + uploadedImages.length === 0
                }
              >
                {isUploading ? "제출 중..." : "제출"}
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
      )}
    </>
  );
}
