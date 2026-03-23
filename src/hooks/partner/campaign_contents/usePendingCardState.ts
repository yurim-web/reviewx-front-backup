/* ========================================
   대기 탭 카드 공통 상태 관리 훅
   ======================================== */

/**
 * usePendingCardState
 *
 * 목적: PendingCard 컴포넌트들의 공통 상태(신고·연장·반려 모달, 로컬 상태 동기화)를 관리합니다.
 *
 * 사용 페이지:
 * - /partner/campaign/[id]/contents (대기 탭 카드 4종)
 */

import { useState, useEffect } from "react";
import { useModalState } from "@/hooks/useModalState";
import type { ReportOption } from "@/components/common/modal/ReportModal";

/** 신고 옵션 (전 카드 공통) */
export const REPORT_OPTIONS: ReportOption[] = [
  { value: "selection_cancelled", label: "선정 후 취소" },
  { value: "no_show", label: "무단 이탈 · 노쇼" },
  { value: "exposure_period", label: "노출 기간 불이행" },
  { value: "modification_request", label: "수정 요청 불이행" },
  { value: "other", label: "기타 비매너 행위", isOther: true },
];

/** +3일 날짜 계산 유틸 */
export function calculateExtendedDate(baseDate?: string): string {
  const date = baseDate ? new Date(baseDate + "T00:00:00") : new Date();
  date.setDate(date.getDate() + 3);
  return date.toISOString().split("T")[0];
}

/** 현재 시간 YYYY-MM-DD HH:mm 형식 */
function formatNowDateTime(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}`;
}

interface UsePendingCardStateConfig<T extends string> {
  applicantId: string;
  pendingState: T;
  isExtensionApproved?: boolean;
  extendedDeadline?: string;
  deadlineDate?: string;
  reportedDate?: string;
  onExtend?: (id: string) => void;
  onReport?: (id: string, reportOption?: string, otherReason?: string) => void;
  /** 신고 시 로컬 상태를 reported로 변경할지 여부 (기본: true) */
  updateLocalOnReport?: boolean;
  /** footer 연장 완료 시 날짜 계산 수행 여부 (기본: true) */
  calculateDateOnExtension?: boolean;
  /** onExtend 호출 시점: 'onConfirm'(확인 모달에서) 또는 'onComplete'(완료 모달 닫을 때) */
  callOnExtendAt?: "onConfirm" | "onComplete";
  /** 등록 기한 연장 요청(승인/거절) 지원 여부 (기본: false) */
  supportsExtensionRequest?: boolean;
}

export function usePendingCardState<T extends string>({
  applicantId,
  pendingState,
  isExtensionApproved = false,
  extendedDeadline,
  deadlineDate,
  reportedDate,
  onExtend,
  onReport,
  updateLocalOnReport = true,
  calculateDateOnExtension = true,
  callOnExtendAt = "onComplete",
  supportsExtensionRequest = false,
}: UsePendingCardStateConfig<T>) {
  // ── 로컬 상태 (prop 동기화) ──
  const [localPendingState, setLocalPendingState] = useState<T>(pendingState);
  const [localIsExtensionApproved, setLocalIsExtensionApproved] = useState(isExtensionApproved);
  const [localExtendedDeadline, setLocalExtendedDeadline] = useState(extendedDeadline);
  const [localReportedDate, setLocalReportedDate] = useState(reportedDate);

  useEffect(() => {
    setLocalPendingState(pendingState);
  }, [pendingState]);
  useEffect(() => {
    setLocalIsExtensionApproved(isExtensionApproved);
  }, [isExtensionApproved]);
  useEffect(() => {
    setLocalExtendedDeadline(extendedDeadline);
  }, [extendedDeadline]);
  useEffect(() => {
    setLocalReportedDate(reportedDate);
  }, [reportedDate]);

  // ── 신고 모달 ──
  const reportModal = useModalState();
  const [selectedReportOption, setSelectedReportOption] = useState("");
  const [otherReportReason, setOtherReportReason] = useState("");

  const handleReportClick = () => {
    reportModal.open();
    if (!selectedReportOption && REPORT_OPTIONS.length > 0) {
      setSelectedReportOption(REPORT_OPTIONS[0].value);
    }
  };

  const handleReportModalClose = () => {
    reportModal.close();
    setSelectedReportOption("");
    setOtherReportReason("");
  };

  const handleReportConfirm = (selectedOption: string, otherReason?: string) => {
    onReport?.(applicantId, selectedOption, otherReason);
    if (updateLocalOnReport) {
      setLocalPendingState("reported" as T);
      setLocalReportedDate(formatNowDateTime());
    } else {
      handleReportModalClose();
    }
  };

  // ── 연장 (footer 버튼) ──
  const [extensionCount, setExtensionCount] = useState(0);
  const extensionConfirmModal = useModalState();
  const extensionCompleteModal = useModalState();
  const extensionLimitModal = useModalState();

  const handleFooterExtendClick = () => {
    if (extensionCount >= 2) {
      extensionLimitModal.open();
      return;
    }
    extensionConfirmModal.open();
  };

  const handleExtensionConfirm = () => {
    if (callOnExtendAt === "onConfirm") {
      onExtend?.(applicantId);
    }
    setExtensionCount((prev) => prev + 1);
    extensionConfirmModal.close();
    extensionCompleteModal.open();
  };

  const handleExtensionCompleteClose = () => {
    if (calculateDateOnExtension) {
      setLocalIsExtensionApproved(true);
      const base = localExtendedDeadline || deadlineDate;
      setLocalExtendedDeadline(calculateExtendedDate(base));
    }
    extensionCompleteModal.close();
    if (callOnExtendAt === "onComplete") {
      onExtend?.(applicantId);
    }
  };

  // ── 등록 기한 연장 요청 (승인/거절 모달) ──
  const extendModal = useModalState();
  const extendResultModal = useModalState();
  const [extendResultMessage, setExtendResultMessage] = useState("");

  const handleExtendRequestClick = () => {
    extendModal.open();
  };
  const handleExtendRequestModalClose = () => {
    extendModal.close();
  };

  const handleExtendReject = () => {
    extendModal.close();
    setExtendResultMessage("등록 기간 연장이 거절되었습니다.");
    extendResultModal.open();
  };

  const handleExtendApprove = () => {
    onExtend?.(applicantId);
    extendModal.close();
    setExtendResultMessage("등록 기간 연장이 완료되었습니다.");
    extendResultModal.open();
  };

  const handleExtendResultModalClose = () => {
    if (extendResultMessage === "등록 기간 연장이 완료되었습니다.") {
      setLocalPendingState("content_not_registered" as T);
      setLocalIsExtensionApproved(true);
      setLocalExtendedDeadline(calculateExtendedDate(deadlineDate));
    }
    extendResultModal.close();
    setExtendResultMessage("");
  };

  // ── 반려 사유 모달 ──
  const rejectReasonModal = useModalState();
  const handleRejectReasonClick = () => {
    rejectReasonModal.open();
  };
  const handleRejectReasonModalClose = () => {
    rejectReasonModal.close();
  };

  return {
    // 로컬 상태
    localPendingState,
    localIsExtensionApproved,
    localExtendedDeadline,
    localReportedDate,
    // 신고
    reportModal,
    selectedReportOption,
    setSelectedReportOption,
    otherReportReason,
    setOtherReportReason,
    handleReportClick,
    handleReportModalClose,
    handleReportConfirm,
    // 연장 (footer)
    extensionCount,
    extensionConfirmModal,
    extensionCompleteModal,
    extensionLimitModal,
    handleFooterExtendClick,
    handleExtensionConfirm,
    handleExtensionCompleteClose,
    // 연장 요청 (승인/거절) — supportsExtensionRequest일 때만 사용
    ...(supportsExtensionRequest
      ? {
          extendModal,
          extendResultModal,
          extendResultMessage,
          handleExtendRequestClick,
          handleExtendRequestModalClose,
          handleExtendReject,
          handleExtendApprove,
          handleExtendResultModalClose,
        }
      : {}),
    // 반려 사유
    rejectReasonModal,
    handleRejectReasonClick,
    handleRejectReasonModalClose,
  };
}
