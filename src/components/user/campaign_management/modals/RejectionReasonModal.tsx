/* ========================================
   📋 콘텐츠 반려 사유 모달 컴포넌트 (유저용)
   ======================================== */

/**
 * 콘텐츠 반려 사유 모달 컴포넌트 (유저용)
 *
 * 목적: 사용자가 콘텐츠 반려 사유를 확인할 수 있는 모달입니다.
 *
 * 사용 위치:
 * - 유저 캠페인 관리 페이지 > 취소/반려 탭
 *   - "콘텐츠 반려 사유 확인" 버튼 클릭 시
 *   - RejectedTabCard 컴포넌트에서 사용
 *
 * 모달 구성:
 * 1. 모달 제목: "콘텐츠 반려 사유"
 * 2. 반려 사유 텍스트 영역 (읽기 전용)
 * 3. 닫기 버튼
 *
 * 학습 포인트:
 * - 읽기 전용 텍스트 영역: textarea에 readOnly 속성 사용
 * - 모달 오버레이 클릭으로 닫기
 * - 조건부 렌더링: 반려 사유가 없을 때 기본 메시지 표시
 */

"use client";

import { useEffect, useState } from "react";
import styles from "../../../../styles/user/campaign_management/modals/rejection_reason_modal.module.css";

interface RejectionReasonModalProps {
  /** 모달 열림/닫힘 상태 */
  isOpen: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 반려 사유 텍스트 */
  rejectionReason?: string;
  /** 캠페인 제목 (선택 사항) */
  campaignTitle?: string;
}

export default function RejectionReasonModal({
  isOpen,
  onClose,
  rejectionReason,
  campaignTitle,
}: RejectionReasonModalProps) {
  // 반려 사유 텍스트 상태 관리
  const [reasonText, setReasonText] = useState<string>("");

  /**
   * 모달이 열릴 때 반려 사유 텍스트 설정
   *
   * 설명:
   * - useEffect: 컴포넌트가 렌더링된 후 실행되는 React 훅입니다.
   * - 의존성 배열 [isOpen, rejectionReason]: 이 값들이 변경될 때마다 실행됩니다.
   * - 반려 사유가 없으면 기본 메시지를 표시합니다.
   */
  useEffect(() => {
    if (isOpen) {
      setReasonText(rejectionReason || "반려 사유가 등록되지 않았습니다.");
    }
  }, [isOpen, rejectionReason]);

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  /**
   * 오버레이 클릭 핸들러
   *
   * 설명:
   * - 모달 배경(오버레이)을 클릭하면 모달을 닫습니다.
   * - e.target === e.currentTarget: 클릭한 요소가 오버레이 자체일 때만 닫기
   *   (모달 내부를 클릭했을 때는 닫히지 않음)
   */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modal_overlay} onClick={handleOverlayClick}>
      <div
        className={styles.modal_container}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 제목 */}
        <h2 className={styles.modal_title}>반려 사유</h2>

        {/* 반려 사유 텍스트 영역 */}
        <div className={styles.reason_box}>
          <textarea
            className={styles.reason_text}
            value={reasonText}
            readOnly
            rows={10}
            placeholder="반려 사유가 없습니다."
          />
        </div>

        {/* 닫기 버튼 (하단) */}
        <div className={styles.modal_footer}>
          <button className={styles.close_button_bottom} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
