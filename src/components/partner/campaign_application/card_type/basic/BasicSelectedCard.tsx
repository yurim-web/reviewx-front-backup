/* ========================================
   📋 기본 선정자 카드 컴포넌트 (미션형/구매평용)
   ======================================== */

"use client";

import Image from "next/image";
import { BasicApplicant } from "@/data/partner/campaign_application/delivery_applicants";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";

/**
 * BasicSelectedCard 컴포넌트
 *
 * 목적: 미션형과 구매평 캠페인에서 선정된 신청자를 표시하는 카드
 *
 * 특징:
 * - 채널별 특화 정보 없이 기본 정보만 표시
 * - 프로필, 회원 타입, 메모, 선택 취소 버튼 포함
 * - 선정된 상태를 시각적으로 구분
 *
 * 사용 페이지:
 * - /partner/campaign_application/mission (미션형 캠페인 선정 탭)
 * - /partner/campaign_application/review (구매평 캠페인 선정 탭)
 */

interface BasicSelectedCardProps {
  /** 기본 신청자 데이터 */
  applicant: BasicApplicant;
  /** 선택 취소 시 호출되는 콜백 함수 */
  onCancel: (applicantId: string) => void;
}

export default function BasicSelectedCard({ applicant, onCancel }: BasicSelectedCardProps) {
  return (
    <article
      className={`${baseStyles.applicant_card} ${baseStyles.selected_card} ${
        applicant.selectionStatus === "이용제한 계정" ? baseStyles.restricted_card : ""
      }`}
    >
      {/* 프로필 영역 */}
      <div className={contentStyles.profile_section}>
        <div className={contentStyles.profile_image_container}>
          <Image
            src={applicant.profileImage || "/images/mypage/profile.svg"}
            alt="프로필"
            className={contentStyles.profile_image}
            fill
          />
        </div>

        <div className={contentStyles.profile_info}>
          <span className={contentStyles.user_type}>{applicant.userType}</span>
          <span className={contentStyles.nickname}>{applicant.nickname}</span>
        </div>
      </div>

      {/* 회원 타입 */}
      <div className={contentStyles.member_type}>{applicant.memberType}</div>

      {/* 메모 */}
      <div className={contentStyles.memo_section}>
        <div className={contentStyles.memo_text}>
          {applicant.memo && applicant.memo.trim() !== "" ? applicant.memo : "메모 미작성"}
        </div>
      </div>

      {/* 액션 버튼 - 선택 취소 */}
      <div className={actionStyles.action_button_section}>
        <button
          className={`${actionStyles.action_button} ${actionStyles.cancel_button}`}
          onClick={() => onCancel(applicant.id)}
          aria-label={`${applicant.nickname} 선정 취소하기`}
        >
          선택 취소
        </button>
      </div>
    </article>
  );
}
