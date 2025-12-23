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
 * 1. 모달 제목: "반려 사유"
 * 2. 반려 사유 텍스트 영역 (읽기 전용)
 * 3. 닫기 버튼
 *
 * 학습 포인트:
 * - TextareaModal 컴포넌트 재사용: 공통 모달 컴포넌트를 활용하여 코드 중복을 줄입니다.
 * - readOnly 모드: 읽기 전용 모달로 사용하여 사용자가 내용을 확인만 할 수 있도록 합니다.
 * - 상태 관리: useEffect를 사용하여 모달이 열릴 때 반려 사유 텍스트를 설정합니다.
 */

"use client";

import { useEffect, useState } from "react";
import { TextareaModal } from "@/components/common/modal";

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

  return (
    <TextareaModal
      is_open={isOpen}
      on_close={onClose}
      title="반려 사유"
      value={reasonText || "반려 사유가 없습니다."}
      onChange={() => {}} // 읽기 전용이므로 빈 함수
      readOnly={true}
      titleColor="#ff2626" // 반려 사유 모달은 빨간색 제목
      buttons={["닫기"]}
    />
  );
}
