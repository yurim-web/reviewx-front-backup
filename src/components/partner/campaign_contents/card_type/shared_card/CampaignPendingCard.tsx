/* ========================================
   구매평/미션형 공통 - 대기 탭 카드
   ======================================== */

/**
 * CampaignPendingCard
 *
 * 목적: 구매평/미션형 공통 캠페인의 제출 대기 탭 콘텐츠 카드를 렌더링합니다.
 *
 * 사용 페이지:
 * - /partner/campaign/[id]/contents (구매평/미션형 > "대기" 탭)
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { useModalState } from "@/hooks/useModalState";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { getChannelUrl } from "@/utils/helpers/url";
import type { CampaignApplicant } from "./campaignTypes";
import TextareaModal from "@/components/common/modal/TextareaModal";
import ReportModal, { type ReportOption } from "@/components/common/modal/ReportModal";
import BaseModal from "@/components/common/modal/BaseModal";

/**
 * 대기 탭 상태 유형 (구매평만 해당)
 * - receipt_not_registered: 구매 영수증 미등록
 * - content_not_registered: 콘텐츠 미등록
 * - extension_requested: 등록 기한 연장 요청
 * - rejected: 반려 처리
 */
type PendingState =
  | "receipt_not_registered"
  | "content_not_registered"
  | "extension_requested"
  | "rejected";

interface CampaignPendingCardProps {
  applicant: CampaignApplicant;
  /** 대기 탭에서의 상태 유형 */
  pendingState?: PendingState;
  /** 연장 승인 여부 (true면 기한이 "기한 연장" 형태로 표시) */
  isExtensionApproved?: boolean;
  /** 연장된 기한 날짜 (예: "2025-11-05") */
  extendedDeadline?: string;
  /** 실제 기한 날짜 (등록일과 다를 수 있음, 선택적) */
  deadlineDate?: string;
  /** 구매 영수증 확인 버튼 클릭 (구매평, 영수증 흐름일 때) */
  onCheckReceipt?: (applicantId: string) => void;
  /** 리뷰 확인 버튼 클릭 (구매평, 콘텐츠 미등록 상태일 때) */
  onCheckReview?: (applicantId: string) => void;
  /** 이미지 확인 버튼 클릭 (미션형) */
  onCheckImage?: (applicantId: string) => void;
  /** 링크 확인 버튼 클릭 (미션형) */
  onCheckLink?: (applicantId: string) => void;
  /** 승인 버튼 클릭 (미션형) */
  onApprove?: (applicantId: string) => void;
  /** 반려 버튼 클릭 (미션형) */
  onReject?: (applicantId: string) => void;
  /** 연장 버튼 클릭 (구매평만) */
  onExtend?: (applicantId: string) => void;
  /** 신고 버튼 클릭 (구매평만) */
  onReport?: (applicantId: string) => void;
  /** 등록 기한 연장 요청 사유 (데이터에서 불러옴) */
  extension_request_reason?: string;
  /** 콘텐츠 타입 (미션형만, 링크만, 이미지만, 링크+이미지) */
  contentType?: "link" | "image" | "both";
  dateLabel?: string;
}

export default function CampaignPendingCard({
  applicant,
  pendingState = "content_not_registered",
  isExtensionApproved = false,
  extendedDeadline,
  deadlineDate,
  onCheckReceipt,
  onCheckReview,
  onCheckImage,
  onCheckLink,
  onApprove,
  onReject,
  onExtend,
  onReport,
  extension_request_reason: _extension_request_reason = "",
  contentType = "link",
  dateLabel: _dateLabel = "등록",
}: CampaignPendingCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);
  const isReview = applicant.campaignType === "review";

  const reportModal = useModalState();
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  const rejectModal = useModalState();
  const [rejectReason, setRejectReason] = useState("");
  // 연장 관련 상태
  const [extensionCount, setExtensionCount] = useState(0); // 연장 횟수 추적
  const extensionConfirmModal = useModalState();
  const extensionCompleteModal = useModalState();
  const extensionLimitModal = useModalState();

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
  const handleReportConfirm = (_selectedOption: string, _otherReason?: string) => {
    if (onReport) {
      onReport(applicant.id);
    }
    handleReportModalClose();
  };

  // 연장 버튼 클릭 핸들러
  // 📌 연장 버튼 클릭 처리:
  // - 연장 버튼을 클릭하면 이 함수가 실행됩니다
  // - 연장 횟수가 2회 이상이면 제한 모달을 표시합니다
  // - 그렇지 않으면 연장 확인 모달을 표시합니다
  const handleExtendClick = () => {
    // console.log("연장 버튼 클릭, 현재 연장 횟수:", extensionCount);
    // 연장 횟수가 2회 이상이면 제한 모달 표시
    if (extensionCount >= 2) {
      // console.log("연장 제한 모달 표시");
      extensionLimitModal.open();
      return;
    }
    // 연장 확인 모달 표시
    // console.log("연장 확인 모달 표시");
    extensionConfirmModal.open();
  };

  // 연장 확인 모달에서 연장 버튼 클릭
  // 📌 연장 확인 처리:
  // - 연장 완료 모달을 표시합니다
  // - 연장 완료 모달의 "닫기" 버튼을 눌렀을 때만 onExtend를 호출하여 탭 이동을 수행합니다
  const handleExtensionConfirm = () => {
    // console.log("연장 확인 모달에서 연장 버튼 클릭");
    setExtensionCount((prev) => prev + 1);
    extensionConfirmModal.close();
    extensionCompleteModal.open();
    // console.log("연장 완료 모달 표시");
  };

  // 연장 완료 모달 닫기 핸들러
  // 📌 연장 완료 후 처리:
  // - 연장 완료 모달의 "닫기" 버튼을 클릭하면 이 함수가 실행됩니다
  // - onExtend 콜백을 호출하여 부모 컴포넌트에 탭 이동을 요청합니다
  // - 부모 컴포넌트에서 대기 탭으로 이동하고 날짜를 업데이트합니다
  const handleExtensionCompleteClose = () => {
    // console.log(
    //   "연장 완료 모달 닫기, onExtend 호출:",
    //   applicant.id,
    //   "onExtend 존재:",
    //   !!onExtend
    // );
    extensionCompleteModal.close();
    // 연장 완료 후 대기 탭으로 이동하기 위해 onExtend를 호출
    // 부모 컴포넌트에서 탭 이동과 날짜 업데이트를 처리합니다
    if (onExtend) {
      onExtend(applicant.id);
    }
  };

  // 반려 모달 열기 (미션형만)
  const _handleRejectClick = () => {
    rejectModal.open();
  };

  // 반려 모달 닫기
  const handleRejectModalClose = () => {
    rejectModal.close();
    setRejectReason("");
  };

  // 반려 확인 처리 (미션형만)
  const handleRejectConfirm = () => {
    if (onReject) {
      onReject(applicant.id);
    }
    handleRejectModalClose();
  };

  // 미션형 버튼 생성 함수 (contentType 기준으로 버튼 결정)
  const getMissionButtons = () => {
    if (!isReview) {
      const buttons: Array<{ label: string; onClick: () => void }> = [];

      // contentType이 "both"인 경우: 이미지 확인 + 링크 확인 두 개
      if (contentType === "both") {
        buttons.push({
          label: "이미지 확인",
          onClick: () => {
            // console.log("이미지 확인 클릭", applicant.id);
            onCheckImage?.(applicant.id);
          },
        });
        buttons.push({
          label: "링크 확인",
          onClick: () => {
            // console.log("링크 확인 클릭", applicant.id);
            onCheckLink?.(applicant.id);
          },
        });
      }
      // contentType이 "image"인 경우: 이미지 확인 하나만
      else if (contentType === "image") {
        buttons.push({
          label: "이미지 확인",
          onClick: () => {
            // console.log("이미지 확인 클릭", applicant.id);
            onCheckImage?.(applicant.id);
          },
        });
      }
      // contentType이 "link"인 경우: 링크 확인 하나만
      else if (contentType === "link") {
        buttons.push({
          label: "링크 확인",
          onClick: () => {
            // console.log("링크 확인 클릭", applicant.id);
            onCheckLink?.(applicant.id);
          },
        });
      }

      return buttons;
    }
    return [];
  };

  const _missionButtons = getMissionButtons();

  return (
    <div className={baseStyles.card_wrapper}>
      <article className={baseStyles.applicant_card}>
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
            alt={applicant.channel}
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

        {/* 상단 액션 버튼 */}
        {/* 구매평: 영수증 확인 버튼 (영수증 흐름일 때만) */}
        {/* 구매평에서만 사용: 영수증 검증 흐름 (reviewType 2, 4, 6) */}
        {isReview &&
          (pendingState === "receipt_not_registered" ||
            (pendingState === "rejected" && applicant.reviewType === 4)) && (
            <button
              className={actionStyles.content_check_button}
              onClick={() => {
                // console.log("구매 영수증 확인 클릭", applicant.id);
                onCheckReceipt?.(applicant.id);
              }}
            >
              구매 영수증 확인
            </button>
          )}

        {/* 구매평: 반려 상태일 때 리뷰 확인 버튼 (상단에 표시) */}
        {isReview && pendingState === "rejected" && applicant.reviewType !== 4 && (
          <button
            className={actionStyles.content_check_button}
            onClick={() => {
              // console.log("리뷰 확인 클릭", applicant.id);
              onCheckReview?.(applicant.id);
            }}
          >
            리뷰 확인
          </button>
        )}

        {/* 대기 탭에서는 미션형도 이미지/링크 확인 버튼 없음 (확인 탭에서만 확인 가능) */}

        {/* 상태별 버튼 표시 */}
        <div className={actionStyles.action_button_section}>
          {/* 구매평 상태별 버튼 */}
          {isReview && pendingState === "receipt_not_registered" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.disabled_button} ${actionStyles.receipt_not_registered_button}`}
              disabled
            >
              구매 영수증 미등록
            </button>
          )}

          {isReview && pendingState === "content_not_registered" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.disabled_button}`}
              disabled
            >
              콘텐츠 미등록
            </button>
          )}

          {isReview && pendingState === "extension_requested" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.extension_request_button}`}
              disabled
            >
              <span className={actionStyles.extension_request_text_pc}>등록 기한 연장 요청</span>
              <span className={actionStyles.extension_request_text_mobile}>기간 연장 요청</span>
            </button>
          )}

          {isReview && pendingState === "rejected" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.reject_process_button}${applicant.reviewType === 4 ? ` ${actionStyles.receipt_reject_button}` : ""}`}
              disabled
            >
              {applicant.reviewType === 4 ? (
                <>
                  <span className={actionStyles.receipt_reject_text_pc}>구매 영수증 반려 처리</span>
                  <span className={actionStyles.receipt_reject_text_mobile}>구매 영수증 반려</span>
                </>
              ) : (
                "콘텐츠 반려 처리"
              )}
            </button>
          )}

          {/* 미션형 상태별 버튼 */}
          {!isReview && pendingState === "content_not_registered" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.disabled_button}`}
              disabled
            >
              콘텐츠 미등록
            </button>
          )}

          {!isReview && pendingState === "extension_requested" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.extension_request_button}`}
              disabled
            >
              <span className={actionStyles.extension_request_text_pc}>등록 기한 연장 요청</span>
              <span className={actionStyles.extension_request_text_mobile}>기간 연장 요청</span>
            </button>
          )}

          {!isReview && pendingState === "rejected" && (
            <button
              className={`${actionStyles.action_button} ${actionStyles.reject_process_button}`}
              disabled
            >
              콘텐츠 반려 처리
            </button>
          )}

          {/* 대기 탭에서는 미션형도 승인/반려 버튼 없음 (확인 탭에서만 승인/반려 가능) */}
        </div>

        {/* 기한 표시 (연장 승인 후에는 "기한 연장" 형태로 표시) */}
        {/* 대기 탭에서는 등록 날짜가 아니라 기한 날짜만 표시, 버튼 밑에 표시 */}
        {deadlineDate ? (
          <div className={actionStyles.registration_info}>
            <span>
              {isExtensionApproved && extendedDeadline
                ? `${extendedDeadline} 기한 연장`
                : `${deadlineDate} 기한`}
            </span>
          </div>
        ) : null}
      </article>

      {/* 연장/신고 버튼 footer */}
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
      {/* 📌 연장 완료 모달:
          - 연장이 성공적으로 완료되었을 때 표시됩니다
          - "닫기" 버튼을 클릭하면 대기 탭으로 이동합니다
      */}
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

      {/* 반려 사유 입력 모달 (미션형만, 승인/반려 버튼이 있을 때) */}
      {!isReview && onApprove && onReject && !pendingState && (
        <TextareaModal
          is_open={rejectModal.isOpen}
          on_close={handleRejectModalClose}
          title="반려 사유"
          titleColor="#ff2626"
          value={rejectReason}
          onChange={setRejectReason}
          placeholder="사유 입력"
          buttons={["취소", "반려"]}
          on_confirm={handleRejectConfirm}
          type="center"
          variant="reject"
        />
      )}
    </div>
  );
}
