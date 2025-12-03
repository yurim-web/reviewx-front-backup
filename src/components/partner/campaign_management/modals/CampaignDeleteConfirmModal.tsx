// 임의로 만들어 둔 모달!
// 캠페인 삭제하기 버튼 눌렀을때 삭제 확인 모달 나옴!!

/* ========================================
   ⚠️ 캠페인 삭제 확인 모달 컴포넌트 (파트너)
   ======================================== */

/**
 * 캠페인 삭제 확인 모달 컴포넌트
 *
 * 목적: 캠페인 카드에서 "캠페인 삭제" 버튼을 클릭했을 때 표시되는 확인 모달입니다.
 *       사용자에게 삭제 작업의 확실성을 확인받기 위해 사용됩니다.
 *
 * 사용 위치:
 * - CampaignCard 컴포넌트에서 "캠페인 삭제" 버튼 클릭 시
 *
 * 주요 기능:
 * - 삭제 확인 메시지 표시
 * - 취소 버튼 (모달 닫기)
 * - 삭제하기 버튼 (실제 삭제 처리)
 * - 모달 닫기 기능 (오버레이 클릭, X 버튼)
 *
 * - 조건부 렌더링: isOpen prop에 따라 모달 표시/숨김
 * - 이벤트 핸들러: 버튼 클릭 및 오버레이 클릭 처리
 * - Props 타입 정의: TypeScript 인터페이스를 통한 타입 안정성
 * - 모달 패턴: 오버레이와 컨텐츠 영역으로 구성된 모달 UI
 */

"use client";

import Image from "next/image";
import styles from "../../../../styles/partner/campaign_management/campaign_delete_confirm_modal.module.css";

/**
 * CampaignDeleteConfirmModal 컴포넌트의 Props 타입 정의
 * 
 * @interface CampaignDeleteConfirmModalProps
 * @property {boolean} isOpen - 모달이 열려있는지 여부를 나타내는 boolean 값
 *                              true일 때 모달이 표시되고, false일 때는 아무것도 렌더링하지 않음
 * @property {() => void} onClose - 모달을 닫을 때 호출되는 함수
 *                                   취소 버튼, X 버튼, 오버레이 클릭 시 호출됨
 * @property {string} campaignTitle - 삭제할 캠페인의 제목 (선택적)
 *                                    모달에 표시하여 사용자가 어떤 캠페인을 삭제하는지 명확히 인지할 수 있도록 함
 * @property {string | number} campaignId - 삭제할 캠페인의 ID (선택적)
 *                                          삭제 API 호출 시 사용됨
 * @property {() => void} onConfirm - 삭제 확인 버튼 클릭 시 호출되는 함수 (선택적)
 *                                    실제 삭제 로직을 처리하는 함수
 */
interface CampaignDeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
  campaignId?: string | number;
  onConfirm?: () => void;
}

/**
 * 캠페인 삭제 확인 모달 컴포넌트
 * 
 * React 컴포넌트 구조:
 * - 조건부 렌더링: isOpen이 false이면 null 반환하여 아무것도 렌더링하지 않음
 * - 이벤트 핸들러: 삭제 확인/취소 버튼 클릭 및 오버레이 클릭 처리
 * - JSX: 모달 오버레이, 모달 컨테이너, 메시지, 버튼들로 구성
 * 
 * - 조건부 렌더링은 특정 조건에 따라 다른 내용을 렌더링하는 React의 기능입니다
 * - 여기서는 isOpen이 false일 때 null을 반환하여 모달을 완전히 숨깁니다
 * - 이를 통해 DOM에 불필요한 요소가 추가되지 않습니다
 */
export default function CampaignDeleteConfirmModal({
  isOpen,
  onClose,
  campaignTitle,
  campaignId,
  onConfirm,
}: CampaignDeleteConfirmModalProps) {
  // 조건부 렌더링: 모달이 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  /**
   * 삭제 확인 버튼 클릭 핸들러
   * 
   * - onConfirm prop이 제공되면 해당 함수를 호출
   * - prop이 없으면 기본 삭제 로직을 실행 (콘솔 로그 및 alert)
   * - 실제 프로덕션에서는 API 호출을 통해 서버에서 캠페인을 삭제함
   */
  const handleConfirmClick = () => {
    if (onConfirm) {
      // 부모 컴포넌트에서 전달받은 삭제 로직 실행
      onConfirm();
    } else {
      // 기본 삭제 로직 (개발/테스트용)
      // TODO: 실제 캠페인 삭제 API 호출 로직 추가
      console.log("캠페인 삭제:", campaignTitle, campaignId);
      alert("캠페인이 삭제되었습니다.");
    }
    onClose(); // 삭제 처리 후 모달 닫기
  };

  /**
   * 취소 버튼 클릭 핸들러
   * 
   * - 사용자가 취소를 선택하면 모달만 닫고 삭제 작업은 수행하지 않음
   */
  const handleCancelClick = () => {
    onClose();
  };

  /**
   * 모달 오버레이 클릭 핸들러
   * 
   * - e.target: 실제로 클릭된 요소 (자식 요소일 수 있음)
   * - e.currentTarget: 이벤트 핸들러가 등록된 요소 (항상 오버레이)
   * - e.target === e.currentTarget을 확인하여 실제로 오버레이를 클릭했는지 확인
   * - 이를 통해 모달 컨텐츠 영역을 클릭했을 때는 모달이 닫히지 않도록 함
   */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 오버레이 자체를 클릭했을 때만 모달 닫기
    // (모달 컨텐츠 영역을 클릭했을 때는 닫히지 않음)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // 모달 오버레이 - 배경 어두운 레이어
    <div className={styles.modal_overlay} onClick={handleOverlayClick}>
      {/* 모달 컨테이너 - 실제 모달 내용 */}
      <div className={styles.modal_container}>
        {/* 모달 제목 */}
        <h2 className={styles.modal_title}>캠페인 삭제</h2>

        {/* 삭제 확인 메시지 */}
        <div className={styles.message_container}>
          <p className={styles.message_text}>
            정말로 이 캠페인을 삭제하시겠습니까?
          </p>
          {campaignTitle && (
            <p className={styles.campaign_title_text}>{campaignTitle}</p>
          )}
          <p className={styles.warning_text}>
            삭제된 캠페인은 복구할 수 없습니다.
          </p>
        </div>

        {/* 액션 버튼 영역 */}
        <div className={styles.action_buttons}>
          {/* 취소 버튼 - 회색 테두리 */}
          <button
            className={`${styles.action_button} ${styles.cancel_button}`}
            onClick={handleCancelClick}
          >
            취소
          </button>

          {/* 삭제 확인 버튼 - 빨간색 배경 */}
          <button
            className={`${styles.action_button} ${styles.confirm_button}`}
            onClick={handleConfirmClick}
          >
            삭제
          </button>
        </div>

        {/* 모달 닫기 버튼 - 우측 상단 X 아이콘 */}
        <button className={styles.close_button} onClick={onClose}>
              - Next.js의 Image 컴포넌트는 이미지 최적화 기능을 제공
              - width와 height를 명시적으로 지정하여 레이아웃 시프트 방지
              - alt 속성은 접근성을 위해 필수 */}
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

