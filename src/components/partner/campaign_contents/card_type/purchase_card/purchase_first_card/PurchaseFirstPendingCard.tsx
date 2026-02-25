/* ========================================
   구매평 1차 - 대기 탭 카드
   ======================================== */

/**
 * PurchaseFirstPendingCard
 *
 * 목적: 구매평 1단계 캠페인의 제출 대기 탭 콘텐츠 카드를 렌더링합니다.
 *
 * 사용 페이지:
 * - /partner/campaign/[id]/contents (구매평 > "대기" 탭 (구매 기간))
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useModalState } from "@/hooks/useModalState";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { CampaignApplicant } from "../../shared_card/campaignTypes";
import ReportModal, { type ReportOption } from "@/components/common/modal/ReportModal";
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
  onCheckReceipt: _onCheckReceipt,
  onExtend,
  onReport,
}: PurchaseFirstPendingCardProps) {
  const _channel_icon_src = getChannelLogo(applicant.channel);

  const reportModal = useModalState();
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  // 연장 관련 상태
  const [extensionCount, setExtensionCount] = useState(0);
  const extensionConfirmModal = useModalState();
  const extensionCompleteModal = useModalState();
  const extensionLimitModal = useModalState();
  // 반려 사유 모달 상태
  const rejectReasonModal = useModalState();

  // 📌 로컬 상태 관리: 신고 시 카드 상태를 즉시 변경하기 위해 사용
  const [localPendingState, setLocalPendingState] = useState<PendingState>(pendingState);
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
    reportModal.open();
    if (!selectedReportOption && reportOptions.length > 0) {
      setSelectedReportOption(reportOptions[0].value);
    }
  };

  // 신고 모달 닫기
  const handleReportModalClose = () => {
    reportModal.close();
    setSelectedReportOption("");
    setOtherReportReason("");
  };

  // 신고 확인 처리
  // 📌 신고 버튼 클릭 시:
  // 1. onReport 콜백을 호출하여 부모 컴포넌트에 신고 알림
  // 2. 카드 상태를 "reported"로 변경
  // 3. 신고 날짜/시간을 현재 시간으로 설정
  const handleReportConfirm = (_selectedOption: string, _otherReason?: string) => {
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

    // console.log("신고 사유:", selectedOption, "기타 사유:", otherReason);
    handleReportModalClose();
  };

  // 연장 버튼 클릭 핸들러
  const handleExtendClick = () => {
    if (extensionCount >= 2) {
      extensionLimitModal.open();
      return;
    }
    extensionConfirmModal.open();
  };

  // 연장 확인 모달에서 연장 버튼 클릭
  const handleExtensionConfirm = () => {
    setExtensionCount((prev) => prev + 1);
    extensionConfirmModal.close();
    extensionCompleteModal.open();
  };

  // 연장 완료 모달 닫기 핸들러
  const handleExtensionCompleteClose = () => {
    extensionCompleteModal.close();
    if (onExtend) {
      onExtend(applicant.id);
    }
  };

  // 반려 사유 모달 열기
  // 📌 "구매 영수증 반려 처리" 버튼 클릭 시 파트너가 입력한 반려 사유를 표시합니다
  const handleRejectReasonClick = () => {
    rejectReasonModal.open();
  };

  // 반려 사유 모달 닫기
  const handleRejectReasonModalClose = () => {
    rejectReasonModal.close();
  };

  return (
    <div className={baseStyles.card_wrapper}>
      <article
        className={`${baseStyles.applicant_card} ${
          localPendingState === "reported" ? baseStyles.applicant_card_no_footer : ""
        }`.trim()}
      >
        {/* 프로필 영역 */}
        <div className={contentStyles.profile_section}>
          <div className={contentStyles.profile_image_container}>
            <Image
              src={applicant.profileImage || "/images/mypage/profile.svg"}
              alt="프로필"
              className={contentStyles.profile_image}
              width={40}
              height={40}
            />
          </div>
          <div className={contentStyles.profile_info}>
            <span className={contentStyles.user_type}>{applicant.userType}</span>
            <span className={contentStyles.nickname}>{applicant.nickname}</span>
          </div>
        </div>

        {/* 상태별 버튼 표시 */}
        <div className={actionStyles.action_button_section}>
          {localPendingState === "receipt_not_registered" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.disabled_button} ${actionStyles.receipt_not_registered_button}`}
              disabled
            >
              구매 영수증 미등록
            </button>
          )}

          {localPendingState === "rejected" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.reject_process_button} ${actionStyles.receipt_reject_button}`}
              onClick={handleRejectReasonClick}
              aria-label={`${applicant.nickname} 반려 사유 확인`}
            >
              <span className={actionStyles.receipt_reject_text_pc}>구매 영수증 반려 처리</span>
              <span className={actionStyles.receipt_reject_text_mobile}>구매 영수증 반려</span>
            </button>
          )}

          {localPendingState === "reported" && (
            <button
              className={`${actionStyles.action_button}`}
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
          <div className={actionStyles.registration_info}>
            <span>
              {localReportedDate.split(" ")[0]}
              <span className={actionStyles.reported_time_mobile_hide}>
                {localReportedDate.includes(" ") ? ` ${localReportedDate.split(" ")[1]}` : ""}
              </span>{" "}
              신고
            </span>
          </div>
        ) : (
          deadlineDate && (
            <div className={actionStyles.registration_info}>
              <span>{deadlineDate} 기한</span>
            </div>
          )
        )}
      </article>

      {/* 연장/신고 버튼 footer (신고 처리된 경우 표시하지 않음) */}
      {localPendingState !== "reported" && (
        <div className={actionStyles.extension_report_footer}>
          <button
            className={actionStyles.extension_button}
            onClick={handleExtendClick}
            aria-label={`${applicant.nickname} 연장`}
          >
            <Image
              src="/images/management_page/clock_icon.svg"
              alt="연장 아이콘"
              className={actionStyles.extension_icon}
              width={16}
              height={16}
            />
            <span>연장</span>
          </button>
          <div className={actionStyles.vertical_divider}></div>
          <button
            className={actionStyles.report_button}
            onClick={handleReportClick}
            aria-label={`${applicant.nickname} 신고`}
          >
            <Image
              src="/images/management_page/report_icon.svg"
              alt="신고 아이콘"
              className={actionStyles.report_icon}
              width={16}
              height={16}
            />
            <span>신고</span>
          </button>
        </div>
      )}

      {/* 신고 모달 */}
      <ReportModal
        is_open={reportModal.isOpen}
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
        is_open={extensionConfirmModal.isOpen}
        on_close={() => extensionConfirmModal.close()}
        message={
          extensionCount === 0
            ? '콘텐츠 등록 기간을<br><span style="color: #FF2626;">3일 연장</span>하시겠습니까?'
            : '이미 연장한 내역이 있습니다.<br><span style="color: #FF2626;">3일 더 연장</span>하시겠습니까?'
        }
        buttons={["취소", "연장"]}
        on_confirm={handleExtensionConfirm}
        type="center"
        button_variant="red"
      />

      {/* 연장 완료 모달 */}
      <BaseModal
        is_open={extensionCompleteModal.isOpen}
        on_close={handleExtensionCompleteClose}
        message="등록 기간 연장이 완료되었습니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 연장 제한 초과 모달 */}
      <BaseModal
        is_open={extensionLimitModal.isOpen}
        on_close={() => extensionLimitModal.close()}
        message="연장은 최대 두 번까지만 가능합니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 반려 사유 모달 (반려 처리된 카드에서 버튼 클릭 시 표시) */}
      {/* 📌 "구매 영수증 반려 처리" 버튼 클릭 시 파트너가 입력한 반려 사유를 표시합니다 */}
      <TextareaModal
        is_open={rejectReasonModal.isOpen}
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
