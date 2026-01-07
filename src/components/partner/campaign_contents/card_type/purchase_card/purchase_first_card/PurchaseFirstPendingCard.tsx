/* ========================================
   ⏳ 구매평 1차 - 대기 탭 카드
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 구매평 > "대기" 탭 (구매 기간)
   
   🎯 대기 탭 카드 유형 - 3가지:
   
   1️⃣ 구매 영수증 미등록 (pendingState: "receipt_not_registered")
      - 상단: 없음
      - 중간: "구매 영수증 미등록" 버튼 (회색, 비활성화)
      - 하단: 기한 날짜 (예: "2025-11-02 기한")
      - footer: 연장/신고 버튼
   
   2️⃣ 구매 영수증 반려 처리 (pendingState: "rejected")
      - 상단: 없음
      - 중간: "구매 영수증 반려 처리" 버튼 (빨간색, 클릭 시 반려 사유 모달 표시)
      - 하단: 기한 날짜 (예: "2025-11-02 기한")
      - footer: 연장/신고 버튼
   
   3️⃣ 임시 참여 제한 (pendingState: "reported")
      - 상단: 없음
      - 중간: "임시 참여 제한" 버튼 (빨간색 배경, 빨간색 텍스트)
      - 하단: 신고 날짜/시간 (예: "2025-11-02 17:37 신고")
      - footer: 없음 (연장/신고 버튼 없음)
   
   🎯 주요 기능:
     - 연장: 등록 기한을 3일 연장 (최대 2회까지 가능)
     - 신고: 콘텐츠 신고 모달 (선정 후 취소, 무단 이탈, 노출 기간 불이행 등)
     - 반려 사유 확인: "구매 영수증 반려 처리" 버튼 클릭 시 파트너가 입력한 반려 사유 모달 표시
   
   📝 참고:
     - 구매 기간에 해당하는 구매평 1차 카드입니다
     - 대기 탭에서는 승인/반려 버튼 없음 (확인 탭에서만 승인/반려 가능)
     - pendingState prop으로 상태를 구분합니다
     - deadlineDate prop으로 캠페인 등록 기간의 마지막 날짜를 표시합니다
     - reject_reason prop으로 반려 사유를 전달받아 모달에 표시합니다
   ======================================== */

"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { CampaignApplicant } from "../../shared_card/CampaignTypes";
import ReportModal, {
  type ReportOption,
} from "@/components/common/modal/ReportModal";
import BaseModal from "@/components/common/modal/BaseModal";
import TextareaModal from "@/components/common/modal/TextareaModal";

type PendingState = "receipt_not_registered" | "rejected" | "reported";

interface PurchaseFirstPendingCardProps {
  applicant: CampaignApplicant;
  /** 대기 탭에서의 상태 유형 */
  pendingState?: PendingState;
  /** 실제 기한 날짜 (등록일과 다를 수 있음, 선택적) */
  deadlineDate?: string;
  /** 반려 사유 (확인 탭에서 반려 처리 시 입력된 사유) */
  reject_reason?: string;
  /** 신고 처리된 날짜/시간 (예: "2025-11-02 17:37") */
  reportedDate?: string;
  /** 구매 영수증 확인 버튼 클릭 (반려 처리일 때) */
  onCheckReceipt?: (applicantId: string) => void;
  /** 연장 버튼 클릭 */
  onExtend?: (applicantId: string) => void;
  /** 신고 버튼 클릭 */
  onReport?: (applicantId: string) => void;
}

export default function PurchaseFirstPendingCard({
  applicant,
  pendingState = "receipt_not_registered",
  deadlineDate,
  reject_reason = "",
  reportedDate,
  onCheckReceipt,
  onExtend,
  onReport,
}: PurchaseFirstPendingCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  // 연장 관련 상태
  const [extensionCount, setExtensionCount] = useState(0);
  const [isExtensionConfirmModalOpen, setIsExtensionConfirmModalOpen] =
    useState(false);
  const [isExtensionCompleteModalOpen, setIsExtensionCompleteModalOpen] =
    useState(false);
  const [isExtensionLimitModalOpen, setIsExtensionLimitModalOpen] =
    useState(false);
  // 반려 사유 모달 상태
  const [isRejectReasonModalOpen, setIsRejectReasonModalOpen] = useState(false);

  // 📌 로컬 상태 관리: 신고 시 카드 상태를 즉시 변경하기 위해 사용
  const [localPendingState, setLocalPendingState] =
    useState<PendingState>(pendingState);
  // 📌 신고 날짜/시간 로컬 상태 (신고 버튼 클릭 시 즉시 표시하기 위해)
  const [localReportedDate, setLocalReportedDate] = useState(reportedDate);

  // 📌 prop이 변경되면 로컬 상태도 업데이트 (부모 컴포넌트에서 상태 변경 시)
  useEffect(() => {
    setLocalPendingState(pendingState);
  }, [pendingState]);

  useEffect(() => {
    setLocalReportedDate(reportedDate);
  }, [reportedDate]);

  // 신고 옵션 정의
  const reportOptions: ReportOption[] = [
    { value: "selection_cancelled", label: "선정 후 취소" },
    { value: "no_show", label: "무단 이탈 · 노쇼" },
    { value: "exposure_period", label: "노출 기간 불이행" },
    { value: "modification_request", label: "수정 요청 불이행" },
    { value: "other", label: "기타 비매너 행위", isOther: true },
  ];

  // 신고 모달 열기
  const handleReportClick = () => {
    setIsReportModalOpen(true);
    if (!selectedReportOption && reportOptions.length > 0) {
      setSelectedReportOption(reportOptions[0].value);
    }
  };

  // 신고 모달 닫기
  const handleReportModalClose = () => {
    setIsReportModalOpen(false);
    setSelectedReportOption("");
    setOtherReportReason("");
  };

  // 신고 확인 처리
  // 📌 신고 버튼 클릭 시:
  // 1. onReport 콜백을 호출하여 부모 컴포넌트에 신고 알림
  // 2. 카드 상태를 "reported"로 변경
  // 3. 신고 날짜/시간을 현재 시간으로 설정
  const handleReportConfirm = (
    selectedOption: string,
    otherReason?: string
  ) => {
    if (onReport) {
      onReport(applicant.id);
    }

    // 📌 카드 상태를 신고 처리 상태로 변경
    setLocalPendingState("reported");

    // 📌 신고 날짜/시간을 현재 시간으로 설정 (YYYY-MM-DD HH:mm 형식)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    setLocalReportedDate(formattedDate);

    console.log("신고 사유:", selectedOption, "기타 사유:", otherReason);
    handleReportModalClose();
  };

  // 연장 버튼 클릭 핸들러
  const handleExtendClick = () => {
    if (extensionCount >= 2) {
      setIsExtensionLimitModalOpen(true);
      return;
    }
    setIsExtensionConfirmModalOpen(true);
  };

  // 연장 확인 모달에서 연장 버튼 클릭
  const handleExtensionConfirm = () => {
    setExtensionCount((prev) => prev + 1);
    setIsExtensionConfirmModalOpen(false);
    setIsExtensionCompleteModalOpen(true);
  };

  // 연장 완료 모달 닫기 핸들러
  const handleExtensionCompleteClose = () => {
    setIsExtensionCompleteModalOpen(false);
    if (onExtend) {
      onExtend(applicant.id);
    }
  };

  // 반려 사유 모달 열기
  // 📌 "구매 영수증 반려 처리" 버튼 클릭 시 파트너가 입력한 반려 사유를 표시합니다
  const handleRejectReasonClick = () => {
    setIsRejectReasonModalOpen(true);
  };

  // 반려 사유 모달 닫기
  const handleRejectReasonModalClose = () => {
    setIsRejectReasonModalOpen(false);
  };

  return (
    <div className={styles.card_wrapper}>
      <article
        className={styles.applicant_card}
        style={
          localPendingState === "reported" ? { minHeight: "190px" } : undefined
        }
      >
        {/* 프로필 영역 */}
        <div className={styles.profile_section}>
          <div className={styles.profile_image_container}>
            {applicant.profileImage ? (
              <img
                src={applicant.profileImage}
                alt="프로필"
                className={styles.profile_image}
              />
            ) : (
              <div className={styles.profile_placeholder}></div>
            )}
          </div>
          <div className={styles.profile_info}>
            <span className={styles.user_type}>{applicant.userType}</span>
            <span className={styles.nickname}>{applicant.nickname}</span>
          </div>
        </div>

        {/* 상태별 버튼 표시 */}
        <div className={styles.action_button_section}>
          {localPendingState === "receipt_not_registered" && (
            <button
              className={`${styles.action_button} ${styles.disabled_button}`}
              disabled
            >
              구매 영수증 미등록
            </button>
          )}

          {localPendingState === "rejected" && (
            <button
              className={`${styles.action_button} ${styles.reject_process_button}`}
              onClick={handleRejectReasonClick}
              aria-label={`${applicant.nickname} 반려 사유 확인`}
            >
              구매 영수증 반려 처리
            </button>
          )}

          {localPendingState === "reported" && (
            <button
              className={`${styles.action_button}`}
              disabled
              style={{
                backgroundColor: "rgba(255, 38, 38, 0.1)",
                color: "#ff2626",
                border: "1px solid transparent",
                cursor: "auto",
              }}
            >
              임시 참여 제한
            </button>
          )}
        </div>

        {/* 기한 표시 (미등록, 반려 처리) 또는 신고 날짜/시간 표시 (신고 처리) */}
        {localPendingState === "reported" && localReportedDate ? (
          <div className={styles.registration_info}>
            <span>{localReportedDate} 신고</span>
          </div>
        ) : (
          deadlineDate && (
            <div className={styles.registration_info}>
              <span>{deadlineDate} 기한</span>
            </div>
          )
        )}
      </article>

      {/* 연장/신고 버튼 footer (신고 처리된 경우 표시하지 않음) */}
      {localPendingState !== "reported" && (
        <div className={styles.extension_report_footer}>
          <button
            className={styles.extension_button}
            onClick={handleExtendClick}
            aria-label={`${applicant.nickname} 연장`}
          >
            <img
              src="/images/management_page/clock_icon.svg"
              alt="연장 아이콘"
              className={styles.extension_icon}
            />
            <span>연장</span>
          </button>
          <div className={styles.vertical_divider}></div>
          <button
            className={styles.report_button}
            onClick={handleReportClick}
            aria-label={`${applicant.nickname} 신고`}
          >
            <img
              src="/images/management_page/report_icon.svg"
              alt="신고 아이콘"
              className={styles.report_icon}
            />
            <span>신고</span>
          </button>
        </div>
      )}

      {/* 신고 모달 */}
      <ReportModal
        is_open={isReportModalOpen}
        on_close={handleReportModalClose}
        title="콘텐츠 신고"
        options={reportOptions}
        selectedOption={selectedReportOption}
        onOptionChange={setSelectedReportOption}
        otherReason={otherReportReason}
        onOtherReasonChange={setOtherReportReason}
        buttons={["취소", "신고"]}
        on_confirm={handleReportConfirm}
        type="center"
      />

      {/* 연장 확인 모달 */}
      <BaseModal
        is_open={isExtensionConfirmModalOpen}
        on_close={() => setIsExtensionConfirmModalOpen(false)}
        message={
          extensionCount === 0
            ? '콘텐츠 등록 기간을<br><span style="color: #FF2626;">3일 연장</span>하시겠습니까?'
            : '이미 연장한 내역이 있습니다.<br><span style="color: #FF2626;">3일 더 연장</span>하시겠습니까?'
        }
        buttons={["취소", "연장"]}
        on_confirm={handleExtensionConfirm}
        type="center"
      />

      {/* 연장 완료 모달 */}
      <BaseModal
        is_open={isExtensionCompleteModalOpen}
        on_close={handleExtensionCompleteClose}
        message="등록 기간 연장이 완료되었습니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 연장 제한 초과 모달 */}
      <BaseModal
        is_open={isExtensionLimitModalOpen}
        on_close={() => setIsExtensionLimitModalOpen(false)}
        message="연장은 최대 두 번까지만 가능합니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 반려 사유 모달 (반려 처리된 카드에서 버튼 클릭 시 표시) */}
      {/* 📌 "구매 영수증 반려 처리" 버튼 클릭 시 파트너가 입력한 반려 사유를 표시합니다 */}
      <TextareaModal
        is_open={isRejectReasonModalOpen}
        on_close={handleRejectReasonModalClose}
        title="반려 사유"
        titleColor="#ff2626"
        value={reject_reason || "반려 사유가 등록되지 않았습니다."}
        readOnly={true}
        placeholder=""
        buttons={["닫기"]}
        type="center"
        variant="reject"
      />
    </div>
  );
}
