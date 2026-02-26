/* ========================================
   📋 기본 신청자 카드 컴포넌트 (미션형/구매평용)
   ======================================== */

"use client";

import Image from "next/image";
import { BasicApplicant } from "@/data/partner/campaign_application/delivery_applicants";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";

/**
 * BasicCard 컴포넌트
 *
 * 목적: 미션형과 구매평 캠페인에서 사용되는 기본 신청자 카드
 *
 * 특징:
 * - 채널별 특화 정보 없이 기본 정보만 표시
 * - 프로필, 회원 타입, 메모, 액션 버튼 포함
 * - 다른 카드들과 동일한 레이아웃 구조 유지
 *
 * 사용 페이지:
 * - /partner/campaign_application/mission (미션형 캠페인)
 * - /partner/campaign_application/review (구매평 캠페인)
 */

interface BasicCardProps {
  /** 기본 신청자 데이터 */
  applicant: BasicApplicant;
  /** 신청자 선정 시 호출되는 콜백 함수 */
  onSelect: (applicantId: string) => void;
}

export default function BasicCard({ applicant, onSelect }: BasicCardProps) {
  return (
    <article
      className={`${baseStyles.applicant_card} ${
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
            width={40}
            height={40}
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

      {/* 액션 버튼 */}
      <div className={actionStyles.action_button_section}>
        {applicant.selectionStatus === "미선택" && (
          <button
            className={`${actionStyles.action_button} ${actionStyles.select_button}`}
            onClick={() => onSelect(applicant.id)}
            aria-label={`${applicant.nickname} 신청자 선정하기`}
          >
            선정하기
          </button>
        )}

        {applicant.selectionStatus === "이용제한 계정" && (
          <button
            className={`${actionStyles.action_button} ${actionStyles.restricted_button}`}
            disabled
            aria-label="이용 제한 계정"
          >
            이용 제한 계정
          </button>
        )}
      </div>
    </article>
  );
}
