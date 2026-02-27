/* ========================================
   경험형 대기 탭 카드
   ======================================== */

/**
 * ExperiencePendingCard
 *
 * 목적: 배송형/방문형/기자단형 캠페인의 제출 대기 탭 콘텐츠 카드를 렌더링합니다.
 *
 * 사용 페이지:
 * - /partner/campaign/[id]/contents (배송형/방문형/기자단형 > "대기" 탭)
 */

"use client";

import Image from "next/image";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { getChannelUrl } from "@/utils/helpers/url";
import type { ExperienceApplicant } from "./experienceTypes";
import TextareaModal from "@/components/common/modal/TextareaModal";
import ReportModal from "@/components/common/modal/ReportModal";
import BaseModal from "@/components/common/modal/BaseModal";
import {
  usePendingCardState,
  REPORT_OPTIONS,
} from "@/hooks/partner/campaign_contents/usePendingCardState";

type PendingState = "content_not_registered" | "extension_requested" | "rejected" | "reported";

interface ExperiencePendingCardProps {
  applicant: ExperienceApplicant;
  pendingState?: PendingState;
  isExtensionApproved?: boolean;
  extendedDeadline?: string;
  deadlineDate?: string;
  onContentCheck: (applicantId: string) => void;
  onExtend?: (applicantId: string) => void;
  onReport?: (applicantId: string) => void;
  extension_request_reason?: string;
  reject_reason?: string;
  reportedDate?: string;
  dateLabel?: string;
}

export default function ExperiencePendingCard({
  applicant,
  pendingState = "content_not_registered",
  isExtensionApproved = false,
  extendedDeadline,
  deadlineDate,
  onContentCheck: _onContentCheck,
  onExtend,
  onReport,
  extension_request_reason = "",
  reject_reason = "",
  reportedDate,
  dateLabel: _dateLabel = "등록",
}: ExperiencePendingCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);

  const state = usePendingCardState<PendingState>({
    applicantId: applicant.id,
    pendingState,
    isExtensionApproved,
    extendedDeadline,
    deadlineDate,
    reportedDate,
    onExtend,
    onReport,
    updateLocalOnReport: true,
    calculateDateOnExtension: true,
    callOnExtendAt: "onConfirm",
    supportsExtensionRequest: true,
  });

  return (
    <div className={baseStyles.card_wrapper}>
      <article
        className={`${baseStyles.applicant_card} ${
          state.localPendingState === "reported"
            ? baseStyles.applicant_card_no_footer_experience
            : ""
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

        {/* 채널 정보 */}
        <div className={contentStyles.channel_section}>
          <Image
            src={channel_icon_src}
            alt={`${applicant.channel} 채널`}
            className={contentStyles.channel_icon}
            width={20}
            height={20}
          />
          <a
            href={getChannelUrl(applicant.channel, applicant.channelId)}
            target="_blank"
            rel="noopener noreferrer"
            className={contentStyles.applicant_id}
            onClick={(e) => {
              const url = getChannelUrl(applicant.channel, applicant.channelId);
              if (url === "#") {
                e.preventDefault();
              }
            }}
          >
            {applicant.channelId}
          </a>
        </div>

        {/* 상태별 버튼 표시 */}
        <div className={actionStyles.action_button_section}>
          {state.localPendingState === "content_not_registered" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.disabled_button}`}
              disabled
            >
              콘텐츠 미등록
            </button>
          )}

          {state.localPendingState === "extension_requested" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.extension_request_button}`}
              onClick={state.handleExtendRequestClick}
            >
              <span className={actionStyles.extension_request_text_pc}>등록 기한 연장 요청</span>
              <span className={actionStyles.extension_request_text_mobile}>기간 연장 요청</span>
            </button>
          )}

          {state.localPendingState === "rejected" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.reject_process_button}`}
              onClick={state.handleRejectReasonClick}
              aria-label={`${applicant.nickname} 반려 사유 확인`}
            >
              콘텐츠 반려 처리
            </button>
          )}

          {state.localPendingState === "reported" && (
            <button
              className={actionStyles.action_button}
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

        {/* 기한 표시 또는 신고 날짜/시간 표시 */}
        {state.localPendingState === "reported" && state.localReportedDate ? (
          <div className={actionStyles.registration_info}>
            <span>
              {state.localReportedDate.split(" ")[0]}
              <span className={actionStyles.reported_time_mobile_hide}>
                {state.localReportedDate.includes(" ")
                  ? ` ${state.localReportedDate.split(" ")[1]}`
                  : ""}
              </span>{" "}
              신고
            </span>
          </div>
        ) : (
          (deadlineDate || state.localExtendedDeadline) && (
            <div className={actionStyles.registration_info}>
              <span>
                {state.localIsExtensionApproved && state.localExtendedDeadline
                  ? `${state.localExtendedDeadline} 기한 연장`
                  : deadlineDate
                    ? `${deadlineDate} 기한`
                    : state.localExtendedDeadline
                      ? `${state.localExtendedDeadline} 기한`
                      : ""}
              </span>
            </div>
          )
        )}
      </article>

      {/* 연장/신고 버튼 footer */}
      {state.localPendingState !== "reported" && (
        <div className={actionStyles.extension_report_footer}>
          <button
            className={actionStyles.extension_button}
            onClick={state.handleFooterExtendClick}
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
            onClick={state.handleReportClick}
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
        is_open={state.reportModal.isOpen}
        on_close={state.handleReportModalClose}
        title="콘텐츠 신고"
        options={REPORT_OPTIONS}
        selectedOption={state.selectedReportOption}
        onOptionChange={state.setSelectedReportOption}
        otherReason={state.otherReportReason}
        onOtherReasonChange={state.setOtherReportReason}
        buttons={["취소", "신고"]}
        on_confirm={state.handleReportConfirm}
        type="center"
      />

      {/* 등록 기한 연장 요청 사유 모달 */}
      {state.extendModal && (
        <TextareaModal
          is_open={state.extendModal.isOpen}
          on_close={state.handleExtendRequestModalClose!}
          title="등록 기한 연장 요청 사유"
          value={extension_request_reason}
          readOnly={true}
          placeholder=""
          buttons={["거절", "승인"]}
          on_cancel={state.handleExtendReject!}
          on_confirm={state.handleExtendApprove!}
          type="center"
          variant="extend"
        />
      )}

      {/* 연장 결과 모달 */}
      {state.extendResultModal && (
        <BaseModal
          is_open={state.extendResultModal.isOpen}
          on_close={state.handleExtendResultModalClose!}
          message={state.extendResultMessage!}
          buttons={["닫기"]}
          type="center"
        />
      )}

      {/* 연장 확인 모달 (푸터 연장 버튼용) */}
      <BaseModal
        is_open={state.extensionConfirmModal.isOpen}
        on_close={() => state.extensionConfirmModal.close()}
        message={
          state.extensionCount === 0
            ? '콘텐츠 등록 기간을<br><span style="color: #FF2626;">3일 연장</span>하시겠습니까?'
            : '이미 연장한 내역이 있습니다.<br><span style="color: #FF2626;">3일 더 연장</span>하시겠습니까?'
        }
        buttons={["취소", "연장"]}
        on_confirm={state.handleExtensionConfirm}
        type="center"
        button_variant="red"
      />

      {/* 연장 완료 모달 */}
      <BaseModal
        is_open={state.extensionCompleteModal.isOpen}
        on_close={state.handleExtensionCompleteClose}
        message="등록 기간 연장이 완료되었습니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 연장 제한 초과 모달 */}
      <BaseModal
        is_open={state.extensionLimitModal.isOpen}
        on_close={() => state.extensionLimitModal.close()}
        message="연장은 최대 두 번까지만 가능합니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 반려 사유 모달 */}
      <TextareaModal
        is_open={state.rejectReasonModal.isOpen}
        on_close={state.handleRejectReasonModalClose}
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
