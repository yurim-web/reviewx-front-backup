// 임의로 만들어 둔 모달!
// 캠페인 관리 버튼 눌렀을때 수정 +삭제 모달 나옴!!

/* ========================================
   🛠️ 캠페인 관리 모달 컴포넌트 (파트너)
   ======================================== */

/**
 * 캠페인 관리 모달 컴포넌트
 *
 * 목적: 캠페인 카드에서 "캠페인 관리" 버튼을 클릭했을 때 표시되는 모달입니다.
 *       캠페인을 수정하거나 삭제할 수 있는 옵션을 제공합니다.
 *
 * 사용 위치:
 * - CampaignCard 컴포넌트에서 "캠페인 관리" 버튼 클릭 시
 *
 * 주요 기능:
 * - 캠페인 수정 버튼 (수정 페이지로 이동)
 * - 캠페인 삭제 버튼 (삭제 확인 및 처리)
 * - 모달 닫기 기능
 * - 오버레이 클릭 시 모달 닫기
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../../../../styles/partner/campaign_management/campaign_management_modal.module.css";
import { deleteCampaign, cancelCampaign } from "@/data/partner/sharedCampaigns";
import BaseModal from "@/components/common/modal/BaseModal";
import type { PartnerStatTab } from "@/types/domain/partner";

/**
 * CampaignManagementModal 컴포넌트의 Props 타입 정의
 *
 * @interface CampaignManagementModalProps
 * @property {boolean} isOpen - 모달이 열려있는지 여부를 나타내는 boolean 값
 * @property {() => void} onClose - 모달을 닫을 때 호출되는 함수
 * @property {string} campaignTitle - 모달에 표시할 캠페인 제목 (선택적)
 * @property {string} campaignType - 캠페인 타입 (수정 페이지로 이동하기 위해 필요)
 * @property {string | number} campaignId - 캠페인 ID (수정/삭제하기 위해 필요)
 * @property {PartnerStatTab} activeTab - 현재 활성화된 탭 (신청 탭일 때만 취소 버튼 표시)
 */
interface CampaignManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
  campaignType?: string;
  campaignId?: string | number;
  activeTab?: PartnerStatTab;
}

/**
 * 캠페인 관리 모달 컴포넌트
 *
 * React 컴포넌트 구조:
 * - 조건부 렌더링: isOpen이 false이면 null 반환하여 아무것도 렌더링하지 않음
 * - 이벤트 핸들러: 수정/삭제 버튼 클릭 및 오버레이 클릭 처리
 * - JSX: 모달 오버레이, 모달 컨테이너, 버튼들로 구성
 */
export default function CampaignManagementModal({
  isOpen,
  onClose,
  campaignTitle,
  campaignType,
  campaignId,
  activeTab,
}: CampaignManagementModalProps) {
  // 오류 모달 상태 관리
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isAlreadyCancelledModalOpen, setIsAlreadyCancelledModalOpen] =
    useState(false);

  // 조건부 렌더링: 모달이 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  // 신청 탭인지 확인
  const isAppliedTab = activeTab === "신청";

  /**
   * 캠페인 타입에 따라 수정 페이지 경로를 반환하는 함수
   */
  const getCampaignTypePath = (type?: string) => {
    switch (type) {
      case "배송형":
        return "delivery";
      case "방문형":
        return "visit";
      case "구매평":
        return "review";
      case "기자단":
        return "reporter";
      case "미션형":
        return "mission";
      default:
        return "delivery"; // 기본값
    }
  };

  /**
   * 캠페인 수정 버튼 클릭 핸들러
   *
   * 캠페인 타입에 따라 다른 수정 페이지로 이동합니다.
   */
  const handleEditClick = () => {
    if (campaignType && campaignId) {
      const campaignTypePath = getCampaignTypePath(campaignType);
      window.location.href = `/partner/campaign/edit/${campaignTypePath}/${campaignId}`;
    } else {
      alert("캠페인 수정 기능은 준비 중입니다.");
    }
    onClose(); // 모달 닫기
  };

  /**
   * 캠페인 취소 버튼 클릭 핸들러
   *
   * 설명:
   * - 신청 탭에서만 표시되는 취소 버튼입니다.
   * - 캠페인을 완전히 삭제하지 않고 상태를 "취소"로 변경합니다.
   * - 취소 성공 시 페이지를 새로고침하여 목록을 업데이트합니다.
   * - 오류 발생 시 적절한 모달을 표시합니다.
   */
  const handleCancelClick = async () => {
    if (!campaignId || !campaignType) return;

    const campaignIdString = String(campaignId);
    const campaignTypeStr = campaignType as
      | "배송형"
      | "방문형"
      | "구매평"
      | "기자단"
      | "미션형";

    console.log(
      `[CampaignManagementModal] 캠페인 취소 시도: ID=${campaignIdString}, 타입=${campaignTypeStr}, 제목=${campaignTitle}`
    );

    try {
      // 캠페인 취소 함수 호출
      const result = cancelCampaign(campaignIdString, campaignTypeStr);

      console.log(
        `[CampaignManagementModal] 취소 결과: ${
          result.success ? "성공" : "실패"
        }, 오류=${result.error || "없음"}`
      );

      if (result.success) {
        // 취소 성공: 모달 닫기 및 페이지 새로고침
        onClose();
        window.location.reload();
      } else if (result.error === "ALREADY_CANCELLED") {
        // 이미 취소된 캠페인: 이미 취소된 상태 모달 표시
        setIsAlreadyCancelledModalOpen(true);
      } else {
        // 서버 오류: 서버 오류 모달 표시
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      // 예상치 못한 오류: 서버 오류 모달 표시
      console.error(
        "[CampaignManagementModal] 캠페인 취소 중 예외 발생:",
        error
      );
      setIsErrorModalOpen(true);
    }
  };

  /**
   * 캠페인 삭제 버튼 클릭 핸들러
   *
   * 설명:
   * - 예정 탭에서 삭제할 때: 취소 탭으로 이동 (cancelCampaign 호출)
   * - 그 외 탭에서 삭제할 때: 완전 삭제 (deleteCampaign 호출)
   * - 사용자에게 삭제 확인을 받은 후 삭제를 진행합니다.
   * - confirm() 함수는 브라우저의 기본 확인 다이얼로그를 표시합니다.
   */
  const handleDeleteClick = () => {
    // 예정 탭인지 확인
    const isScheduledTab = activeTab === "예정";

    // 사용자에게 삭제 확인 받기
    const confirmMessage = isScheduledTab
      ? "정말로 이 캠페인을 취소하시겠습니까?\n취소된 캠페인은 취소 탭으로 이동합니다."
      : "정말로 이 캠페인을 삭제하시겠습니까?\n삭제된 캠페인은 복구할 수 없습니다.";

    const isConfirmed = confirm(confirmMessage);

    if (isConfirmed && campaignId && campaignType) {
      const campaignIdString = String(campaignId);
      const campaignTypeStr = campaignType as
        | "배송형"
        | "방문형"
        | "구매평"
        | "기자단"
        | "미션형";

      // 예정 탭이면 취소 처리, 그 외는 삭제 처리
      if (isScheduledTab) {
        // 예정 탭: 취소 탭으로 이동
        console.log(
          `[CampaignManagementModal] 캠페인 취소 시도 (예정 탭): ID=${campaignIdString}, 타입=${campaignTypeStr}, 제목=${campaignTitle}`
        );

        try {
          const result = cancelCampaign(campaignIdString, campaignTypeStr);

          console.log(
            `[CampaignManagementModal] 취소 결과: ${
              result.success ? "성공" : "실패"
            }, 오류=${result.error || "없음"}`
          );

          if (result.success) {
            onClose(); // 모달 닫기
            // 페이지 새로고침하여 업데이트된 캠페인 목록 표시
            window.location.reload();
          } else if (result.error === "ALREADY_CANCELLED") {
            // 이미 취소된 캠페인: 이미 취소된 상태 모달 표시
            setIsAlreadyCancelledModalOpen(true);
          } else {
            // 서버 오류: 서버 오류 모달 표시
            setIsErrorModalOpen(true);
          }
        } catch (error) {
          // 예상치 못한 오류: 서버 오류 모달 표시
          console.error(
            "[CampaignManagementModal] 캠페인 취소 중 예외 발생:",
            error
          );
          setIsErrorModalOpen(true);
        }
      } else {
        // 그 외 탭: 완전 삭제
        console.log(
          `[CampaignManagementModal] 캠페인 삭제 시도: ID=${campaignIdString}, 타입=${campaignTypeStr}, 제목=${campaignTitle}`
        );

        const deleteSuccess = deleteCampaign(campaignIdString, campaignTypeStr);

        console.log(
          `[CampaignManagementModal] 삭제 결과: ${
            deleteSuccess ? "성공" : "실패"
          }`
        );

        if (deleteSuccess) {
          alert("캠페인이 삭제되었습니다.");
          onClose(); // 모달 닫기
          // 페이지 새로고침하여 업데이트된 캠페인 목록 표시
          window.location.reload();
        } else {
          alert("캠페인 삭제에 실패했습니다. 다시 시도해주세요.");
        }
      }
    }
    // 취소를 선택한 경우에는 아무 동작도 하지 않음 (모달 유지)
  };

  /**
   * 모달 오버레이 클릭 핸들러
   *
   * 사용자가 모달 배경(오버레이)을 클릭하면 모달을 닫습니다.
   * e.target === e.currentTarget을 확인하여 실제로 오버레이를 클릭했는지 확인합니다.
   */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modal_overlay} onClick={handleOverlayClick}>
      <div className={styles.modal_container}>
        {/* 모달 제목 */}
        <h2 className={styles.modal_title}>캠페인 관리</h2>

        {/* 캠페인 제목 표시 (있는 경우) */}
        {campaignTitle && (
          <p className={styles.campaign_title_text}>{campaignTitle}</p>
        )}

        {/* 액션 버튼 영역 */}
        <div className={styles.action_buttons}>
          {/* 캠페인 수정 버튼 */}
          <button
            className={`${styles.action_button} ${styles.edit_button}`}
            onClick={handleEditClick}
          >
            수정하기
          </button>

          {/* 신청 탭일 때만 취소 버튼 표시, 그 외에는 삭제 버튼 표시 */}
          {isAppliedTab ? (
            <button
              className={`${styles.action_button} ${styles.delete_button}`}
              onClick={handleCancelClick}
            >
              취소하기
            </button>
          ) : (
            <button
              className={`${styles.action_button} ${styles.delete_button}`}
              onClick={handleDeleteClick}
            >
              삭제하기
            </button>
          )}
        </div>

        {/* 모달 닫기 버튼 */}
        <button className={styles.close_button} onClick={onClose}>
          <Image
            src="/images/filter/x_icon.svg"
            alt="닫기"
            width={20}
            height={20}
          />
        </button>
      </div>

      {/* 서버 오류 모달 */}
      <BaseModal
        is_open={isErrorModalOpen}
        on_close={() => setIsErrorModalOpen(false)}
        message="오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
        buttons={["확인"]}
      />

      {/* 이미 취소된 캠페인 모달 */}
      <BaseModal
        is_open={isAlreadyCancelledModalOpen}
        on_close={() => setIsAlreadyCancelledModalOpen(false)}
        message="이미 취소된 캠페인입니다."
        buttons={["확인"]}
      />
    </div>
  );
}
