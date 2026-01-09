/* ========================================
   ✅ 미션형 - 완료 탭 카드
   
   📍 사용 위치: 캠페인 콘텐츠 내역 > 미션형 > "완료" 탭
   
   🎯 완료 탭 카드 유형 - 1가지 (각 contentType별):
   
   【링크만 (contentType: "link")】
   - 상단: "링크 확인" 버튼 1개
   - 중간: 등록/수정 날짜 표시
   - 하단: "확인 완료" 버튼 (비활성화, 핑크 배경)
   - footer: "신고" 버튼만 (연장 버튼 없음)
   
   【이미지만 (contentType: "image")】
   - 상단: "이미지 확인" 버튼 1개
   - 중간: 등록/수정 날짜 표시
   - 하단: "확인 완료" 버튼 (비활성화, 핑크 배경)
   - footer: "신고" 버튼만 (연장 버튼 없음)
   
   【이미지+링크 (contentType: "both")】
   - 상단: "이미지 확인" + "링크 확인" 버튼 2개 (세로 배치)
   - 중간: 등록/수정 날짜 표시
   - 하단: "확인 완료" 버튼 (비활성화, 핑크 배경)
   - footer: "신고" 버튼만 (연장 버튼 없음)
   
   🎯 주요 기능:
     - 확인 완료: 검수가 완료되어 더 이상 승인/반려 불가능한 상태
     - 신고: 콘텐츠 신고 모달 (선정 후 취소, 무단 이탈, 노출 기간 불이행 등)
   
   📝 참고:
     - contentType prop으로 링크만/이미지만/이미지+링크 구분
     - "확인 완료" 버튼은 비활성화 상태이며 핑크 배경(rgba(255,86,148,0.1))과 핑크 텍스트(#ff5694)로 표시됩니다
     - 완료 탭에서는 연장 버튼이 없고 신고 버튼만 표시됩니다
   ======================================== */

"use client";

import { useState } from "react";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import type { CampaignApplicant } from "../shared_card/CampaignTypes";
import ReportModal, {
  type ReportOption,
} from "@/components/common/modal/ReportModal";

interface MissionCompletedCardProps {
  applicant: CampaignApplicant;
  /** 링크 확인 버튼 클릭 */
  onCheckLink?: (applicantId: string) => void;
  /** 이미지 확인 버튼 클릭 */
  onCheckImage?: (applicantId: string) => void;
  /** 신고 버튼 클릭 */
  onReport?: (applicantId: string) => void;
  /** 콘텐츠 타입 (링크만, 이미지만, 링크+이미지) */
  contentType: "link" | "image" | "both";
  /** 등록/수정 날짜 */
  registrationDate?: string;
  /** 등록/수정 라벨 */
  dateLabel?: string;
}

export default function MissionCompletedCard({
  applicant,
  onCheckLink,
  onCheckImage,
  onReport,
  contentType,
  registrationDate,
  dateLabel = "등록",
}: MissionCompletedCardProps) {
  const channel_icon_src = getChannelLogo(applicant.channel);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState<string>("");
  const [otherReportReason, setOtherReportReason] = useState<string>("");

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

        {/* 등록/수정 날짜 */}
        <div className={styles.registration_info}>
          <span>
            {registrationDate
              ? `${registrationDate} ${dateLabel}`
              : `${applicant.registrationDate} ${dateLabel}`}
          </span>
        </div>

        {/* 확인 완료 버튼 (비활성화, 핑크 배경) */}
        <div className={styles.action_button_section}>
          <button
            className={`${styles.action_button} ${styles.disabled_button}`}
            disabled
            style={{
              backgroundColor: "rgba(255, 86, 148, 0.1)",
              color: "#ff5694",
              border: "1px solid transparent",
              cursor: "auto",
            }}
          >
            확인 완료
          </button>
        </div>
      </article>

      {/* 신고 버튼 footer (연장 버튼 없음) */}
      <div className={styles.extension_report_footer}>
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
    </div>
  );
}
