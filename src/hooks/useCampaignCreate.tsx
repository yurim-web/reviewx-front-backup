/* ========================================
🔧 캠페인 등록 커스텀 훅
======================================== */

/**
 * 캠페인 등록 커스텀 훅
 *
 * 목적: 5개 캠페인 등록 페이지의 공통 로직(state, 모달, handler)을 통합 관리
 *
 * 사용처:
 * - /partner/campaign/create/delivery
 * - /partner/campaign/create/visit
 * - /partner/campaign/create/review
 * - /partner/campaign/create/reporter
 * - /partner/campaign/create/mission
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { CampaignFormData } from "@/types/domain/user";
import BaseModal from "@/components/common/modal/BaseModal";

interface UseCampaignCreateOptions {
  /**
   * 캠페인 등록 처리 함수
   * @param formData - 폼 데이터
   * @param isUrgent - 긴급 여부
   * @returns 성공 여부
   */
  onRegister: (formData: CampaignFormData, isUrgent: boolean) => Promise<boolean>;

  /**
   * 확인 모달 사용 여부
   * - true: 페이지에서 확인 모달 표시 (visit, review, reporter, mission)
   * - false: 폼에서 확인 모달 표시 (delivery)
   * @default true
   */
  useConfirmModal?: boolean;
}

/**
 * 캠페인 등록 공통 로직 훅
 */
export function useCampaignCreate({ onRegister, useConfirmModal = true }: UseCampaignCreateOptions) {
  const router = useRouter();
  const { user } = useAuth();

  // 공통 State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // 확인 모달용 State (useConfirmModal이 true일 때만 사용)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<CampaignFormData | null>(null);
  const [pendingIsUrgent, setPendingIsUrgent] = useState(false);

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = async (formData: CampaignFormData) => {
    if (useConfirmModal) {
      // 확인 모달 표시
      setPendingFormData(formData);
      setPendingIsUrgent(isUrgent);
      setIsConfirmModalOpen(true);
    } else {
      // 바로 등록 처리
      await handleRegister(formData, isUrgent);
    }
  };

  /**
   * 확인 모달에서 확인 버튼 클릭 시 실제 등록 처리
   */
  const handleConfirm = async () => {
    if (!pendingFormData || isSubmitting) return;

    setIsConfirmModalOpen(false);
    await handleRegister(pendingFormData, pendingIsUrgent);

    // Cleanup
    setPendingFormData(null);
    setPendingIsUrgent(false);
  };

  /**
   * 실제 등록 처리 (공통 로직)
   */
  const handleRegister = async (formData: CampaignFormData, urgentValue: boolean) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const success = await onRegister(formData, urgentValue);

      if (success) {
        // 등록 성공 시 캠페인 관리 페이지로 이동
        router.replace("/partner/campaign_management");
      } else {
        // 저장 실패 (QuotaExceeded 등)
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("캠페인 등록 실패:", error);
      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 모달 JSX 렌더링 헬퍼
   */
  const renderModals = () => (
    <>
      {/* 확인 모달 (useConfirmModal이 true일 때만) */}
      {useConfirmModal && (
        <BaseModal
          is_open={isConfirmModalOpen}
          on_close={() => {
            setIsConfirmModalOpen(false);
            setPendingFormData(null);
          }}
          message="캠페인 진행 시에는 삭제/수정이 불가합니다.<br>캠페인을 등록하시겠습니까?"
          buttons={["취소", "확인"]}
          on_confirm={handleConfirm}
        />
      )}

      {/* 오류 모달 */}
      <BaseModal
        is_open={isErrorModalOpen}
        on_close={() => setIsErrorModalOpen(false)}
        message="오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
        buttons={["확인"]}
      />
    </>
  );

  return {
    // State
    user,
    isSubmitting,
    isUrgent,
    setIsUrgent,

    // Handlers
    handleSubmit,

    // JSX Helper
    renderModals,
  };
}
