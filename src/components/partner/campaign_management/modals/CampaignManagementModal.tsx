/* ========================================
   🛠️ 캠페인 관리 모달 컴포넌트 (파트너)
   ======================================== */

/**
 * 캠페인 관리 모달 컴포넌트
 *
 * 목적: 캠페인 카드에서 "캠페인 관리하기" 버튼을 클릭했을 때 표시되는 모달입니다.
 *       캠페인을 수정하거나 삭제할 수 있는 옵션을 제공합니다.
 *
 * 사용 위치:
 * - CampaignCard 컴포넌트에서 "캠페인 관리하기" 버튼 클릭 시
 *
 * 주요 기능:
 * - 캠페인 수정 버튼 (수정 페이지로 이동)
 * - 캠페인 삭제 버튼 (삭제 확인 및 처리)
 * - 모달 닫기 기능
 * - 오버레이 클릭 시 모달 닫기
 */

"use client";

import Image from "next/image";
import styles from "../../../../styles/partner/campaign_management/campaign_management_modal.module.css";
import { deleteCampaign } from "@/data/partner/sharedCampaigns";

/**
 * CampaignManagementModal 컴포넌트의 Props 타입 정의
 * 
 * @interface CampaignManagementModalProps
 * @property {boolean} isOpen - 모달이 열려있는지 여부를 나타내는 boolean 값
 * @property {() => void} onClose - 모달을 닫을 때 호출되는 함수
 * @property {string} campaignTitle - 모달에 표시할 캠페인 제목 (선택적)
 * @property {string} campaignType - 캠페인 타입 (수정 페이지로 이동하기 위해 필요)
 * @property {string | number} campaignId - 캠페인 ID (수정/삭제하기 위해 필요)
 */
interface CampaignManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
  campaignType?: string;
  campaignId?: string | number;
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
}: CampaignManagementModalProps) {
  // 조건부 렌더링: 모달이 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

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
   * 캠페인 삭제 버튼 클릭 핸들러
   * 
   * 사용자에게 삭제 확인을 받은 후 삭제를 진행합니다.
   * confirm() 함수는 브라우저의 기본 확인 다이얼로그를 표시합니다.
   */
  const handleDeleteClick = () => {
    // 사용자에게 삭제 확인 받기
    const isConfirmed = confirm(
      "정말로 이 캠페인을 삭제하시겠습니까?\n삭제된 캠페인은 복구할 수 없습니다."
    );

    if (isConfirmed && campaignId && campaignType) {
      // 캠페인 삭제 함수 호출
      const campaignIdString = String(campaignId);
      const campaignTypeStr = campaignType as
        | "배송형"
        | "방문형"
        | "구매평"
        | "기자단"
        | "미션형";

      console.log(`[CampaignManagementModal] 캠페인 삭제 시도: ID=${campaignIdString}, 타입=${campaignTypeStr}, 제목=${campaignTitle}`);

      const deleteSuccess = deleteCampaign(campaignIdString, campaignTypeStr);

      console.log(`[CampaignManagementModal] 삭제 결과: ${deleteSuccess ? "성공" : "실패"}`);

      if (deleteSuccess) {
        alert("캠페인이 삭제되었습니다.");
        onClose(); // 모달 닫기
        // 페이지 새로고침하여 업데이트된 캠페인 목록 표시
        window.location.reload();
      } else {
        alert("캠페인 삭제에 실패했습니다. 다시 시도해주세요.");
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

          {/* 캠페인 삭제 버튼 */}
          <button
            className={`${styles.action_button} ${styles.delete_button}`}
            onClick={handleDeleteClick}
          >
            삭제하기
          </button>
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
    </div>
  );
}
