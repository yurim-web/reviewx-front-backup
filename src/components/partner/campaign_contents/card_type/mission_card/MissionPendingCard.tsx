/* ========================================
   ⏳ 미션형 - 대기 탭 카드
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 미션형 > "대기" 탭
   
   🎯 대기 탭 카드 유형 - 5가지:
   
   1️⃣ 콘텐츠 미등록 (pendingState: "content_not_registered")
      - 상단: 없음
      - 중간: "콘텐츠 미등록" 버튼 (회색, 비활성화)
      - 하단: 기한 날짜 (예: "2025-11-02 기한")
      - footer: 연장/신고 버튼
   
   2️⃣ 등록 기한 연장 요청 (pendingState: "extension_requested")
      - 상단: 없음
      - 중간: "등록 기한 연장 요청" 버튼 (흰색 배경, 검은 테두리, 클릭 시 연장 요청 사유 모달 표시)
      - 하단: 기한 날짜 (예: "2025-11-02 기한")
      - footer: 연장/신고 버튼
      → 버튼 클릭 시 리뷰어가 입력한 연장 요청 사유 모달 표시
   
   3️⃣ 연장 승인 후 아직 등록 안함 (pendingState: "content_not_registered", isExtensionApproved: true)
      - 상단: 없음
      - 중간: "콘텐츠 미등록" 버튼 (회색, 비활성화)
      - 하단: 연장된 기한 날짜 (예: "2025-11-05 기한 연장")
      - footer: 연장/신고 버튼
   
   4️⃣ 반려 처리 (pendingState: "rejected")
      - 상단: 없음
      - 중간: "콘텐츠 반려 처리" 버튼 (빨간색, 클릭 시 반려 사유 모달 표시)
      - 하단: 기한 날짜 (예: "2025-11-02 기한")
      - footer: 연장/신고 버튼
   
   5️⃣ 임시 참여 제한 (pendingState: "reported")
      - 상단: 없음
      - 중간: "임시 참여 제한" 버튼 (빨간색 배경, 빨간색 텍스트)
      - 하단: 신고 날짜/시간 (예: "2025-11-02 17:37 신고")
      - footer: 없음 (연장/신고 버튼 없음)
   
   🎯 주요 기능:
     - 연장: 등록 기한을 3일 연장 (최대 2회까지 가능)
     - 신고: 콘텐츠 신고 모달 (선정 후 취소, 무단 이탈, 노출 기간 불이행 등)
     - 반려 사유 확인: "콘텐츠 반려 처리" 버튼 클릭 시 파트너가 입력한 반려 사유 모달 표시
     - 연장 요청 사유 확인: "등록 기한 연장 요청" 버튼 클릭 시 리뷰어가 입력한 연장 요청 사유 모달 표시
   
   📝 참고:
     - 미션형 전용 대기 탭 카드입니다
     - 대기 탭에서는 승인/반려 버튼 없음 (확인 탭에서만 승인/반려 가능)
     - 대기 탭에서는 링크만, 이미지만, 이미지+링크 모두 동일한 UI를 사용합니다
     - pendingState prop으로 상태를 구분합니다
     - deadlineDate prop으로 캠페인 등록 기간의 마지막 날짜를 표시합니다
     - reject_reason prop으로 반려 사유를 전달받아 모달에 표시합니다
     - extension_request_reason prop으로 연장 요청 사유를 전달받아 모달에 표시합니다
     - reportedDate prop으로 신고 날짜/시간을 전달받아 표시합니다
     - 신고 처리된 카드의 article 요소에 min-height: 240px가 적용됩니다
   ======================================== */

"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { CampaignApplicant } from "../shared_card/CampaignTypes";
import ReportModal, {
  type ReportOption,
} from "@/components/common/modal/ReportModal";
import BaseModal from "@/components/common/modal/BaseModal";
import TextareaModal from "@/components/common/modal/TextareaModal";

type PendingState =
  | "content_not_registered" // 콘텐츠 미등록
  | "extension_requested" // 등록 기한 연장 요청
  | "rejected" // 반려 처리
  | "reported"; // 신고 처리

interface MissionPendingCardProps {
  applicant: CampaignApplicant;
  /** 대기 탭에서의 상태 유형 */
  pendingState?: PendingState;
  /** 연장 승인 여부 (true면 기한이 "기한 연장" 형태로 표시) */
  isExtensionApproved?: boolean;
  /** 연장된 기한 날짜 (예: "2025-11-05") */
  extendedDeadline?: string;
  /** 실제 기한 날짜 (등록일과 다를 수 있음, 선택적) */
  deadlineDate?: string;
  /** 반려 사유 (확인 탭에서 반려 처리 시 입력된 사유) */
  reject_reason?: string;
  /** 등록 기한 연장 요청 사유 (데이터에서 불러옴) */
  extension_request_reason?: string;
  /** 신고 처리된 날짜/시간 (예: "2025-11-02 17:37") */
  reportedDate?: string;
  /** 연장 버튼 클릭 */
  onExtend?: (applicantId: string) => void;
  /** 신고 버튼 클릭 */
  onReport?: (applicantId: string) => void;
}

export default function MissionPendingCard({
  applicant,
  pendingState = "content_not_registered",
  isExtensionApproved = false,
  extendedDeadline,
  deadlineDate,
  reject_reason = "",
  extension_request_reason = "",
  reportedDate,
  onExtend,
  onReport,
}: MissionPendingCardProps) {
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
  // 연장 요청 사유 모달 상태
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isExtendResultModalOpen, setIsExtendResultModalOpen] = useState(false);
  const [extendResultMessage, setExtendResultMessage] = useState<string>("");

  // 📌 로컬 상태 관리: 신고 시 카드 상태를 즉시 변경하기 위해 사용
  const [localPendingState, setLocalPendingState] =
    useState<PendingState>(pendingState);
  const [localIsExtensionApproved, setLocalIsExtensionApproved] =
    useState(isExtensionApproved);
  const [localExtendedDeadline, setLocalExtendedDeadline] =
    useState(extendedDeadline);
  // 📌 신고 날짜/시간 로컬 상태 (신고 버튼 클릭 시 즉시 표시하기 위해)
  const [localReportedDate, setLocalReportedDate] = useState(reportedDate);

  // 📌 prop이 변경되면 로컬 상태도 업데이트 (부모 컴포넌트에서 상태 변경 시)
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

  // 연장 버튼 클릭 핸들러 (footer 연장 버튼)
  const handleFooterExtendClick = () => {
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

  // 연장 완료 모달 닫기 핸들러 (footer 연장 버튼용)
  // 📌 footer 연장 버튼으로 연장 완료 후:
  // - 연장 완료 모달의 "닫기" 버튼을 클릭하면 이 함수가 실행됩니다
  // - 카드 상태를 3번째 상태(기한 연장)로 변경합니다
  // - pendingState: "content_not_registered" → "content_not_registered" (유지)
  // - isExtensionApproved: false → true
  // - extendedDeadline: 현재 기한 날짜 기준으로 3일 후 계산
  const handleExtensionCompleteClose = () => {
    // 📌 카드 상태를 3번째 상태로 변경
    // - isExtensionApproved: false → true
    setLocalIsExtensionApproved(true);

    // - extendedDeadline: 현재 기한 날짜 기준으로 3일 후 계산
    // 📌 날짜 계산 우선순위:
    // 1. 이미 연장된 날짜가 있으면 그것을 기준으로 +3일
    // 2. deadlineDate가 있으면 그것을 기준으로 +3일
    // 3. 둘 다 없으면 오늘 날짜 기준으로 +3일
    const baseDate = localExtendedDeadline || deadlineDate;

    if (baseDate) {
      // 현재 기한 날짜를 기준으로 3일 추가
      // baseDate 형식: "YYYY-MM-DD"
      const deadline = new Date(baseDate + "T00:00:00");
      deadline.setDate(deadline.getDate() + 3);
      const formattedDate = deadline.toISOString().split("T")[0];
      setLocalExtendedDeadline(formattedDate);
    } else {
      // 오늘 날짜 기준으로 3일 후
      const today = new Date();
      today.setDate(today.getDate() + 3);
      const formattedDate = today.toISOString().split("T")[0];
      setLocalExtendedDeadline(formattedDate);
    }

    setIsExtensionCompleteModalOpen(false);

    // 부모 컴포넌트에 연장 알림
    if (onExtend) {
      onExtend(applicant.id);
    }
  };

  // 연장 모달 열기 (상단 "등록 기한 연장 요청" 버튼용)
  const handleExtendClick = () => {
    setIsExtendModalOpen(true);
  };

  // 연장 모달 닫기
  const handleExtendModalClose = () => {
    setIsExtendModalOpen(false);
  };

  // 연장 거절 처리
  const handleExtendReject = () => {
    setIsExtendModalOpen(false);
    setExtendResultMessage("등록 기간 연장이 거절되었습니다.");
    setIsExtendResultModalOpen(true);
  };

  // 연장 승인 처리
  // 📌 "등록 기한 연장 요청" 모달에서 "승인" 버튼 클릭 시:
  // 1. onExtend 콜백을 호출하여 부모 컴포넌트에 승인 알림
  // 2. 완료 메시지 모달 표시
  // 3. 카드 상태 변경은 완료 모달의 "닫기" 버튼을 눌렀을 때 수행
  const handleExtendApprove = () => {
    // 부모 컴포넌트에 승인 알림
    if (onExtend) {
      onExtend(applicant.id);
    }

    setIsExtendModalOpen(false);
    setExtendResultMessage("등록 기간 연장이 완료되었습니다.");
    setIsExtendResultModalOpen(true);
  };

  // 연장 결과 모달 닫기
  // 📌 "등록 기간 연장이 완료되었습니다." 모달의 "닫기" 버튼 클릭 시:
  // 1. 카드 상태를 3번째 상태로 변경
  // 2. 모달 닫기
  const handleExtendResultModalClose = () => {
    // 📌 완료 메시지가 "등록 기간 연장이 완료되었습니다."인 경우에만 카드 상태 변경
    // (거절 메시지인 경우는 상태 변경하지 않음)
    if (extendResultMessage === "등록 기간 연장이 완료되었습니다.") {
      // 📌 카드 상태를 3번째 상태로 변경
      // - pendingState: "extension_requested" → "content_not_registered"
      setLocalPendingState("content_not_registered");

      // - isExtensionApproved: false → true
      setLocalIsExtensionApproved(true);

      // - extendedDeadline: 현재 날짜 기준으로 3일 후 계산 (또는 deadlineDate + 3일)
      // deadlineDate가 있으면 그것을 기준으로, 없으면 오늘 날짜 기준
      if (deadlineDate) {
        // deadlineDate를 기준으로 3일 추가
        // deadlineDate 형식: "YYYY-MM-DD"
        const deadline = new Date(deadlineDate + "T00:00:00");
        deadline.setDate(deadline.getDate() + 3);
        const formattedDate = deadline.toISOString().split("T")[0];
        setLocalExtendedDeadline(formattedDate);
      } else {
        // 오늘 날짜 기준으로 3일 후
        const today = new Date();
        today.setDate(today.getDate() + 3);
        const formattedDate = today.toISOString().split("T")[0];
        setLocalExtendedDeadline(formattedDate);
      }
    }

    setIsExtendResultModalOpen(false);
    setExtendResultMessage("");
  };

  // 반려 사유 모달 열기
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
            <img
              src={applicant.profileImage || "/images/mypage/profile.svg"}
              alt="프로필"
              className={styles.profile_image}
            />
          </div>
          <div className={styles.profile_info}>
            <span className={styles.user_type}>{applicant.userType}</span>
            <span className={styles.nickname}>{applicant.nickname}</span>
          </div>
        </div>

        {/* 상태별 버튼 표시 */}
        <div className={styles.action_button_section}>
          {localPendingState === "content_not_registered" && (
            <button
              className={`${styles.action_button} ${styles.disabled_button}`}
              disabled
            >
              콘텐츠 미등록
            </button>
          )}

          {localPendingState === "extension_requested" && (
            <button
              className={`${styles.action_button} ${styles.extension_request_button}`}
              onClick={handleExtendClick}
            >
              등록 기한 연장 요청
            </button>
          )}

          {localPendingState === "rejected" && (
            <button
              className={`${styles.action_button} ${styles.reject_process_button}`}
              onClick={handleRejectReasonClick}
              aria-label={`${applicant.nickname} 반려 사유 확인`}
            >
              콘텐츠 반려 처리
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
          (deadlineDate || localExtendedDeadline) && (
            <div className={styles.registration_info}>
              <span>
                {localIsExtensionApproved && localExtendedDeadline
                  ? `${localExtendedDeadline} 기한 연장`
                  : deadlineDate
                  ? `${deadlineDate} 기한`
                  : localExtendedDeadline
                  ? `${localExtendedDeadline} 기한`
                  : ""}
              </span>
            </div>
          )
        )}
      </article>

      {/* 연장/신고 버튼 footer (신고 처리된 경우 표시하지 않음) */}
      {localPendingState !== "reported" && (
        <div className={styles.extension_report_footer}>
          <button
            className={styles.extension_button}
            onClick={handleFooterExtendClick}
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

      {/* 등록 기한 연장 요청 사유 모달 */}
      {/* 📌 "등록 기한 연장 요청" 버튼 클릭 시 표시되는 모달:
          - 리뷰어가 입력한 등록 기한 연장 요청 사유를 표시합니다
          - "거절" 버튼: 연장 요청을 거절합니다
          - "승인" 버튼: 연장 요청을 승인하고 카드를 3번째 상태(기한 연장)로 변경합니다
      */}
      <TextareaModal
        is_open={isExtendModalOpen}
        on_close={handleExtendModalClose}
        title="등록 기한 연장 요청 사유"
        value={extension_request_reason}
        readOnly={true}
        placeholder=""
        buttons={["거절", "승인"]}
        on_cancel={handleExtendReject}
        on_confirm={handleExtendApprove}
        type="center"
        variant="extend"
      />

      {/* 연장 결과 모달 (승인/거절 후 표시) */}
      <BaseModal
        is_open={isExtendResultModalOpen}
        on_close={handleExtendResultModalClose}
        message={extendResultMessage}
        buttons={["닫기"]}
        type="center"
      />

      {/* 연장 확인 모달 (푸터 연장 버튼용) */}
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

      {/* 연장 완료 모달 (푸터 연장 버튼용) */}
      {/* 📌 footer 연장 버튼으로 연장 완료 후:
          - 연장 완료 모달의 "닫기" 버튼을 클릭하면 카드 상태가 변경됩니다
          - 카드가 "기한 연장" 상태로 변경되고 날짜가 3일 추가됩니다
      */}
      <BaseModal
        is_open={isExtensionCompleteModalOpen}
        on_close={handleExtensionCompleteClose}
        message="등록 기간 연장이 완료되었습니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 연장 제한 초과 모달 (푸터 연장 버튼용) */}
      <BaseModal
        is_open={isExtensionLimitModalOpen}
        on_close={() => setIsExtensionLimitModalOpen(false)}
        message="연장은 최대 두 번까지만 가능합니다."
        buttons={["닫기"]}
        type="center"
      />

      {/* 반려 사유 모달 (반려 처리된 카드에서 버튼 클릭 시 표시) */}
      {/* 📌 "콘텐츠 반려 처리" 버튼 클릭 시 파트너가 입력한 반려 사유를 표시합니다 */}
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
