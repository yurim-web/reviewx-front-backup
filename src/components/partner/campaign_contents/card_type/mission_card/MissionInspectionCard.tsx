/* ========================================
   🧾 미션형 - 확인 탭 카드
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 미션형 > "확인" 탭
   
   🎯 확인 탭 카드 유형 - 3가지 (각 contentType별):
   
   【링크만 (contentType: "link")】
   1. 최초 등록: "링크 확인" 버튼 1개, 등록 날짜, 승인/반려 버튼
   2. 수정: "링크 확인" 버튼 1개, 수정 날짜, 승인/반려 버튼
   3. 지각 등록: "링크 확인" 버튼 1개, 지각 등록 날짜 (빨간색), 승인/반려 버튼
   
   【이미지만 (contentType: "image")】
   1. 최초 등록: "이미지 확인" 버튼 1개, 등록 날짜, 승인/반려 버튼
   2. 수정: "이미지 확인" 버튼 1개, 수정 날짜, 승인/반려 버튼
   3. 지각 등록: "이미지 확인" 버튼 1개, 지각 등록 날짜 (빨간색), 승인/반려 버튼
   
   【이미지+링크 (contentType: "both")】
   1. 최초 등록: "이미지 확인" + "링크 확인" 버튼 2개 (세로 배치), 등록 날짜, 승인/반려 버튼
   2. 수정: "이미지 확인" + "링크 확인" 버튼 2개 (세로 배치), 수정 날짜, 승인/반려 버튼
   3. 지각 등록: "이미지 확인" + "링크 확인" 버튼 2개 (세로 배치), 지각 등록 날짜 (빨간색), 승인/반려 버튼
   
   🎯 주요 기능:
     - 승인/반려: 콘텐츠 검수 후 승인 또는 반려 처리
     - 연장: 등록 기한을 3일 연장 (최대 2회까지 가능)
     - 신고: 콘텐츠 신고 모달 (선정 후 취소, 무단 이탈 등)
     - 반려: 반려 사유 입력 모달 표시
   
   📝 참고:
     - contentType prop으로 링크만/이미지만/이미지+링크 구분
     - dateLabel prop으로 최초 등록/수정/지각 등록 구분
     - 지각 등록일 때 날짜 텍스트가 빨간색으로 표시됩니다
     - 연장 완료 후 onExtend 콜백을 통해 대기 탭으로 이동합니다
   ======================================== */

"use client";

import { useState } from "react";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { CampaignApplicant } from "../shared_card/CampaignTypes";
import TextareaModal from "@/components/common/modal/TextareaModal";
import ReportModal, {
  type ReportOption,
} from "@/components/common/modal/ReportModal";
import BaseModal from "@/components/common/modal/BaseModal";

interface MissionInspectionCardProps {
  applicant: CampaignApplicant;
  /** 링크 확인 버튼 클릭 */
  onCheckLink?: (applicantId: string) => void;
  /** 이미지 확인 버튼 클릭 */
  onCheckImage?: (applicantId: string) => void;
  /** 승인 버튼 클릭 */
  onApprove: (applicantId: string) => void;
  /** 반려 버튼 클릭 */
  onReject: (applicantId: string, rejectReason?: string) => void;
  /** 연장 버튼 클릭 (연장 완료 후 대기 탭으로 이동) */
  onExtend?: (applicantId: string) => void;
  /** 신고 버튼 클릭 */
  onReport?: (applicantId: string) => void;
  /** 콘텐츠 타입 (링크만, 이미지만, 링크+이미지) */
  contentType: "link" | "image" | "both";
  /** 등록/수정/지각 등록 날짜 */
  registrationDate?: string;
  /** 등록/수정/지각 등록 라벨 */
  dateLabel?: string;
}

export default function MissionInspectionCard({
  applicant,
  onCheckLink,
  onCheckImage,
  onApprove,
  onReject,
  onExtend,
  onReport,
  contentType,
  registrationDate,
  dateLabel = "등록",
}: MissionInspectionCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");
  // 연장 관련 상태
  const [extensionCount, setExtensionCount] = useState(0); // 연장 횟수 추적
  const [isExtensionConfirmModalOpen, setIsExtensionConfirmModalOpen] =
    useState(false);
  const [isExtensionCompleteModalOpen, setIsExtensionCompleteModalOpen] =
    useState(false);
  const [isExtensionLimitModalOpen, setIsExtensionLimitModalOpen] =
    useState(false);

  // 신고 옵션 정의
  const reportOptions: ReportOption[] = [
    { value: "selection_cancelled", label: "선정 후 취소" },
    { value: "no_show", label: "무단 이탈 · 노쇼" },
    { value: "exposure_period", label: "노출 기간 불이행" },
    { value: "modification_request", label: "수정 요청 불이행" },
    { value: "other", label: "기타 비매너 행위", isOther: true },
  ];

  // 반려 모달 열기
  const handleRejectClick = () => {
    setIsRejectModalOpen(true);
  };

  // 반려 모달 닫기
  const handleRejectModalClose = () => {
    setIsRejectModalOpen(false);
    setRejectReason("");
  };

  // 반려 확인 처리
  // 📌 반려 사유를 입력하고 "반려" 버튼을 클릭하면:
  // 1. onReject 콜백에 반려 사유와 함께 호출
  // 2. 부모 컴포넌트에서 반려 사유를 저장하고 대기 탭으로 이동
  const handleRejectConfirm = () => {
    onReject(applicant.id, rejectReason);
    handleRejectModalClose();
  };

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
  const handleReportConfirm = (
    selectedOption: string,
    otherReason?: string
  ) => {
    if (onReport) {
      onReport(applicant.id);
    }
    console.log("신고 사유:", selectedOption, "기타 사유:", otherReason);
    handleReportModalClose();
  };

  // 연장 버튼 클릭 핸들러
  // 📌 연장 버튼 클릭 처리:
  // - 연장 버튼을 클릭하면 이 함수가 실행됩니다
  // - 연장 횟수가 2회 이상이면 제한 모달을 표시합니다
  // - 그렇지 않으면 연장 확인 모달을 표시합니다
  const handleExtendClick = () => {
    console.log("연장 버튼 클릭, 현재 연장 횟수:", extensionCount);
    // 연장 횟수가 2회 이상이면 제한 모달 표시
    if (extensionCount >= 2) {
      console.log("연장 제한 모달 표시");
      setIsExtensionLimitModalOpen(true);
      return;
    }
    // 연장 확인 모달 표시
    console.log("연장 확인 모달 표시");
    setIsExtensionConfirmModalOpen(true);
  };

  // 연장 확인 모달에서 연장 버튼 클릭
  // 📌 연장 확인 처리:
  // - 연장 완료 모달을 표시합니다
  // - 연장 완료 모달의 "닫기" 버튼을 눌렀을 때만 onExtend를 호출하여 탭 이동을 수행합니다
  const handleExtensionConfirm = () => {
    console.log("연장 확인 모달에서 연장 버튼 클릭");
    setExtensionCount((prev) => prev + 1);
    setIsExtensionConfirmModalOpen(false);
    setIsExtensionCompleteModalOpen(true);
    console.log("연장 완료 모달 표시");
  };

  // 연장 완료 모달 닫기 핸들러
  // 📌 연장 완료 후 처리:
  // - 연장 완료 모달의 "닫기" 버튼을 클릭하면 이 함수가 실행됩니다
  // - onExtend 콜백을 호출하여 부모 컴포넌트에 탭 이동을 요청합니다
  // - 부모 컴포넌트에서 대기 탭으로 이동하고 날짜를 업데이트합니다
  const handleExtensionCompleteClose = () => {
    console.log(
      "연장 완료 모달 닫기, onExtend 호출:",
      applicant.id,
      "onExtend 존재:",
      !!onExtend
    );
    setIsExtensionCompleteModalOpen(false);
    // 연장 완료 후 대기 탭으로 이동하기 위해 onExtend를 호출
    // 부모 컴포넌트에서 탭 이동과 날짜 업데이트를 처리합니다
    if (onExtend) {
      onExtend(applicant.id);
    } else {
      console.warn("onExtend가 전달되지 않았습니다!");
    }
  };

  // 지각 등록 상태인지 확인
  const isLate = dateLabel === "지각 등록";

  return (
    <div className={styles.card_wrapper}>
      <article className={styles.applicant_card}>
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

        {/* 상단 액션 버튼 */}
        {/* contentType에 따라 다른 버튼 표시 */}
        {contentType === "both" ? (
          // 이미지+링크: 두 개의 버튼 세로 배치
          <div className={styles.content_check_buttons_wrapper}>
            <button
              className={styles.content_check_button}
              onClick={() => {
                console.log("이미지 확인 클릭", applicant.id);
                onCheckImage?.(applicant.id);
              }}
            >
              이미지 확인
            </button>
            <button
              className={styles.content_check_button}
              onClick={() => {
                console.log("링크 확인 클릭", applicant.id);
                onCheckLink?.(applicant.id);
              }}
            >
              링크 확인
            </button>
          </div>
        ) : contentType === "image" ? (
          // 이미지만: 이미지 확인 버튼 하나만
          <button
            className={styles.content_check_button}
            onClick={() => {
              console.log("이미지 확인 클릭", applicant.id);
              onCheckImage?.(applicant.id);
            }}
          >
            이미지 확인
          </button>
        ) : (
          // 링크만: 링크 확인 버튼 하나만
          <button
            className={styles.content_check_button}
            onClick={() => {
              console.log("링크 확인 클릭", applicant.id);
              onCheckLink?.(applicant.id);
            }}
          >
            링크 확인
          </button>
        )}

        {/* 등록/수정/지각 등록 */}
        <div className={styles.registration_info}>
          <span className={isLate ? styles.late_label : undefined}>
            {registrationDate
              ? `${registrationDate} ${dateLabel}`
              : `${applicant.registrationDate} ${dateLabel}`}
          </span>
        </div>

        {/* 승인/반려 */}
        <div className={styles.approval_buttons}>
          <button
            className={`${styles.action_button} ${styles.approve_button}`}
            onClick={() => {
              console.log("승인 클릭", applicant.id);
              onApprove(applicant.id);
            }}
          >
            승인
          </button>
          <button
            className={`${styles.action_button} ${styles.reject_button}`}
            onClick={handleRejectClick}
          >
            반려
          </button>
        </div>
      </article>

      {/* 연장/신고 버튼 footer */}
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

      {/* 반려 사유 입력 모달 */}
      <TextareaModal
        is_open={isRejectModalOpen}
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
      {/* 📌 연장 버튼 클릭 시 표시되는 모달:
          - 연장 횟수에 따라 다른 메시지 표시
          - 첫 연장: "콘텐츠 등록 기간을 3일 연장하시겠습니까?"
          - 두 번째 연장 (중복 연장): "이미 연장한 내역이 있습니다. 추가 연장은 이번 요청이 마지막입니다. 계속하시겠습니까?"
      */}
      <BaseModal
        is_open={isExtensionConfirmModalOpen}
        on_close={() => setIsExtensionConfirmModalOpen(false)}
        message={
          extensionCount === 0
            ? '콘텐츠 등록 기간을<br><span style="color: #FF2626;">3일 연장</span>하시겠습니까?'
            : '이미 연장한 내역이 있습니다.<br>추가 연장은 이번 요청이 마지막입니다.<br>계속하시겠습니까?'
        }
        buttons={extensionCount === 0 ? ["취소", "연장"] : ["취소", "확인"]}
        on_confirm={handleExtensionConfirm}
        type="center"
      />

      {/* 연장 완료 모달 */}
      {/* 📌 연장 완료 모달:
          - 연장이 성공적으로 완료되었을 때 표시됩니다
          - "닫기" 버튼을 클릭하면 대기 탭으로 이동합니다
      */}
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
    </div>
  );
}
