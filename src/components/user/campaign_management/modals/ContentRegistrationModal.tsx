/* ========================================
   📄 콘텐츠 등록/수정 모달 컴포넌트 (유저용)
   ======================================== */

/**
 * 콘텐츠 등록/수정 모달 컴포넌트 (유저용)
 *
 * 목적: 배송형·방문형·기자단·미션형(링크) 캠페인의 콘텐츠 링크 등록/수정 모달
 *
 * 사용 페이지:
 * - /user/campaign_management (선정 탭 - 배송형·방문형·기자단·미션형 콘텐츠 등록/수정)
 * - /user/campaign_management (취소/반려 탭 - 콘텐츠 재등록)
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import BaseModal from "@/components/common/modal/BaseModal";
import ContentVerificationModal from "./content_verification/ContentVerificationModal";
import { useModalState } from "@/hooks/useModalState";
import styles from "../../../../styles/user/campaign_management/modals/campaign_modal_common.module.css";
import type { CampaignType } from "@/types/domain/user";

/**
 * 설명:
 * - styles: 통합된 캠페인 모달 스타일 (모든 모달이 공통으로 사용)
 * - 모든 모달 스타일이 campaign_modal_common.module.css에 통합되어 있습니다.
 */

interface ContentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
  /** 모달 모드: "register" (등록) 또는 "edit" (수정) */
  mode?: "register" | "edit";
  /** 수정 모드일 때 기존에 등록된 콘텐츠 링크 */
  existingLink?: string;
  /** 캠페인 ID (콘텐츠 확인 모달에서 requirements를 가져오기 위해 필요) */
  campaignId?: string;
  /** 캠페인 타입 (콘텐츠 확인 모달에서 requirements를 가져오기 위해 필요) */
  campaignType?: CampaignType;
  /** 콘텐츠 등록 성공 시 호출되는 콜백 (등록 모드일 때만 호출) */
  onContentRegistered?: (campaignId?: string) => void;
}

export default function ContentRegistrationModal({
  isOpen,
  onClose,
  campaignTitle,
  mode = "register",
  existingLink = "",
  campaignId,
  campaignType,
  onContentRegistered,
}: ContentRegistrationModalProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // 메인 모달은 조건부 렌더링으로 변경 (확인 모달은 항상 렌더링 가능하도록)

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
   * 등록/수정 버튼 클릭 핸들러
   *
   * 설명:
   * - 등록/수정 버튼을 누르면 먼저 입력값을 검증합니다.
   * - 검증이 통과하면 콘텐츠 확인 모달을 엽니다.
   * - 실제 등록/수정 처리는 콘텐츠 확인 모달에서 제출을 눌렀을 때 이루어집니다.
   */
  const handleSubmit = () => {
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
        // TODO: 실제 API 호출로 콘텐츠 수정
        // 예시: await updateContent(campaignId, linkUrl);
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
        // TODO: 실제 API 호출로 콘텐츠 등록
        // 예시: await registerContent(campaignId, linkUrl);
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
      alert(
        `콘텐츠 ${
          mode === "edit" ? "수정" : "등록"
        }에 실패했습니다. 다시 시도해주세요.`,
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
          setLinkUrl("");
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
                {/* 모달 제목: mode에 따라 다르게 표시 */}
                <h2 className={styles.modal_title}>
                  {mode === "edit" ? "콘텐츠 수정" : "콘텐츠 등록"}
                </h2>
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

              {/* 링크 섹션 */}
              <div className={styles.link_section}>
                <p className={styles.link_label}>링크</p>
                <input
                  type="url"
                  className={styles.link_input}
                  placeholder="콘텐츠 링크 입력"
                  value={linkUrl}
                  onChange={handleLinkChange}
                />
              </div>

              {/* 등록/수정 버튼: mode에 따라 버튼 텍스트 변경 */}
              <button
                className={styles.submit_button}
                onClick={handleSubmit}
                disabled={isSubmitting || !linkUrl.trim()}
              >
                {isSubmitting ? "확인 중..." : "확인"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
