/* ========================================
   📄 콘텐츠 등록/수정 모달 컴포넌트 (유저용)
   ======================================== */

/**
 * 콘텐츠 등록/수정 모달 컴포넌트 (유저용)
 *
 * 목적: 사용자가 콘텐츠 링크를 등록하거나 수정할 수 있는 모달입니다.
 *
 * 사용 위치:
 * 1. 선정 탭 > 배송형, 방문형, 기자단 캠페인
 *    - "콘텐츠 등록하기" 버튼 클릭 시 (등록 모드)
 *    - "콘텐츠 수정하기" 버튼 클릭 시 (수정 모드)
 *    - SelectedTabCard 컴포넌트에서 사용
 *
 * 2. 취소/반려 탭 > 배송형, 방문형, 기자단 캠페인
 *    - "콘텐츠 재등록하기" 버튼 클릭 시 (등록 모드)
 *    - RejectedTabCard 컴포넌트에서 사용
 *
 * 모달 구성:
 * 1. 링크 입력 섹션
 *    - URL 입력 필드
 *    - 등록 모드: 빈 입력창에서 새로 입력
 *    - 수정 모드: 기존 등록된 링크가 미리 입력되어 있음 (existingLink prop)
 *
 * 2. 등록/수정 버튼
 *    - mode prop에 따라 버튼 텍스트 변경 ("등록" / "수정")
 *
 * 오류 처리:
 * - 링크 입력 오류: BaseModal로 "콘텐츠 링크를 입력해주세요." 표시
 * - 링크 검증 오류: BaseModal로 "콘텐츠를 확인할 수 없습니다." 표시
 *   (URL 형식이 올바르지 않을 때)
 *
 * 다른 모달과의 차이점:
 * - ContentRegistrationModal: 링크만 입력 (배송형, 방문형, 기자단)
 * - ImageUploadModal: 이미지만 업로드 (구매평)
 * - CombinedContentModal: 링크 + 이미지 모두 지원 (미션형)
 * - ReceiptRegistrationModal: 구매 영수증 이미지 업로드 (미션형, 구매평)
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import BaseModal from "@/components/common/modal/BaseModal";
import styles from "../../../../styles/user/campaign_management/modals/content_registration.module.css";

interface ContentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
  /** 모달 모드: "register" (등록) 또는 "edit" (수정) */
  mode?: "register" | "edit";
  /** 수정 모드일 때 기존에 등록된 콘텐츠 링크 */
  existingLink?: string;
}

export default function ContentRegistrationModal({
  isOpen,
  onClose,
  campaignTitle,
  mode = "register",
  existingLink = "",
}: ContentRegistrationModalProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 오류 모달 상태 관리
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  /**
   * 모달이 열릴 때 기존 링크 설정
   *
   * 설명:
   * - useEffect: 컴포넌트가 렌더링된 후 실행되는 React 훅입니다.
   * - 의존성 배열 [isOpen, mode, existingLink]: 이 값들이 변경될 때마다 실행됩니다.
   * - 수정 모드일 때 기존 링크를 input에 미리 채워넣습니다.
   */
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && existingLink) {
        // 수정 모드: 기존 링크를 초기값으로 설정
        setLinkUrl(existingLink);
      } else {
        // 등록 모드: 빈 값으로 초기화
        setLinkUrl("");
      }
    }
  }, [isOpen, mode, existingLink]);

  if (!isOpen) return null;

  // 링크 입력 핸들러
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkUrl(e.target.value);
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
   * 콘텐츠 등록/수정 완료
   *
   * 설명:
   * - mode에 따라 등록 또는 수정 API를 호출합니다.
   * - 등록 모드: 새로운 콘텐츠를 등록합니다.
   * - 수정 모드: 기존 콘텐츠를 수정합니다.
   */
  const handleSubmit = async () => {
    if (!linkUrl.trim()) {
      setErrorModal({
        isOpen: true,
        message: "콘텐츠 링크를 입력해주세요.",
      });
      return;
    }

    // URL 형식 검증
    try {
      new URL(linkUrl);
    } catch {
      setErrorModal({
        isOpen: true,
        message: "콘텐츠를 확인할 수 없습니다.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "edit") {
        // TODO: 실제 API 호출로 콘텐츠 수정
        // 예시: await updateContent(campaignId, linkUrl);
        console.log("콘텐츠 수정:", linkUrl);

        // 성공 시 모달 닫기
      } else {
        // TODO: 실제 API 호출로 콘텐츠 등록
        // 예시: await registerContent(campaignId, linkUrl);
        console.log("콘텐츠 등록:", linkUrl);

        // 성공 시 모달 닫기
      }

      onClose();
      setLinkUrl(""); // 입력창 초기화
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
          {/* 모달 제목: mode에 따라 다르게 표시 */}
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

          {/* 등록/수정 버튼: mode에 따라 버튼 텍스트 변경 */}
          <button
            className={styles.submit_button}
            onClick={handleSubmit}
            disabled={isSubmitting}
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
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </>
  );
}
