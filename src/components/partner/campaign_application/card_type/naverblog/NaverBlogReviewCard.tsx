/* ========================================
   🔍 검수카드 컴포넌트
   ======================================== */

/**
 * 검수카드 컴포넌트
 *
 * 목적: 콘텐츠 검수가 필요한 신청자의 정보를 표시하는 카드 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /partner/campaign_application/delivery (배송형 캠페인 검수 대기 목록)
 *
 * 검수카드 특징:
 * - 신청자 프로필 정보 표시 (닉네임, 사용자 타입, 프로필 이미지)
 * - 채널 정보 표시 (채널 아이콘, 채널 ID)
 * - 콘텐츠 확인하기 버튼 (콘텐츠 검수)
 * - 등록일 정보 표시
 * - 승인/반려 버튼 (검수 결과 처리)
 *
 * 📌 검수카드의 특징:
 * 1. 콘텐츠 검수가 필요한 상태
 * 2. 콘텐츠 확인하기 버튼으로 콘텐츠 검토
 * 3. 등록일 정보로 검수 우선순위 판단
 * 4. 승인/반려 버튼으로 검수 결과 처리
 */

"use client";

import Image from "next/image";
import { ReviewApplicant } from "@/data/partner/campaign_application/delivery_review_completed";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";

interface DeliveryReviewCardProps {
  /** 검수 대상 신청자 정보 객체 */
  applicant: ReviewApplicant;
  /** 콘텐츠 확인하기 버튼 클릭 핸들러 함수 */
  onContentCheck: (applicantId: string) => void;
  /** 승인 버튼 클릭 핸들러 함수 */
  onApprove: (applicantId: string) => void;
  /** 반려 버튼 클릭 핸들러 함수 */
  onReject: (applicantId: string) => void;
}

/**
 * 검수카드 컴포넌트
 *
 * 📌 React 함수형 컴포넌트:
 * - props를 매개변수로 받음
 * - 구조분해할당으로 필요한 속성만 추출
 * - JSX를 반환하여 UI 렌더링
 *
 * 📌 검수카드 특화 기능:
 * - 콘텐츠 확인하기 버튼으로 콘텐츠 검토
 * - 등록일 정보 표시로 검수 우선순위 판단
 * - 승인/반려 버튼으로 검수 결과 처리
 * - 검수 워크플로우에 최적화된 UI
 *
 * @param props - DeliveryReviewCardProps 타입의 props
 * @returns JSX 요소
 */
export default function NaverBlogReviewCard({
  applicant,
  onContentCheck,
  onApprove,
  onReject,
}: DeliveryReviewCardProps) {
  /**
   * 채널 아이콘 경로 가져오기
   *
   * 📌 channel_logo_map 사용:
   * - applicant.channel 값을 키로 사용하여 아이콘 경로 가져오기
   * - 모든 채널이 매핑되어 있으므로 항상 올바른 아이콘 표시
   *
   * 📌 예시:
   * - applicant.channel = "네이버" -> "/images/brand_logo/navershop.svg"
   * - applicant.channel = "쿠팡" -> "/images/brand_logo/coupang.svg"
   */
  const channel_icon_src = getChannelLogo(applicant.channel);

  return (
    <article className={baseStyles.applicant_card}>
      {/* 프로필 영역: 프로필 이미지, 닉네임, 사용자 타입 */}
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
          {/* 사용자 타입 표시 (리뷰어 / 인플루언서) */}
          <span className={contentStyles.user_type}>{applicant.userType}</span>
          {/* 닉네임 표시 */}
          <span className={contentStyles.nickname}>{applicant.nickname}</span>
        </div>
      </div>

      {/* 채널 정보 영역: 채널 아이콘, 채널 ID */}
      <div className={contentStyles.channel_section}>
        <Image
          src={channel_icon_src}
          alt={`${applicant.channel} 채널`}
          className={contentStyles.channel_icon}
          fill
        />

        <span className={contentStyles.applicant_id}>{applicant.Id}</span>
      </div>

      {/* 콘텐츠 확인하기 버튼 */}
      <button
        className={actionStyles.content_check_button}
        onClick={() => onContentCheck(applicant.id)}
        aria-label={`${applicant.nickname} 콘텐츠 확인하기`}
      >
        콘텐츠 확인하기
      </button>

      {/* 등록일 정보 표시 */}
      <div className={actionStyles.registration_info}>{applicant.registrationDate} 등록</div>

      {/* 액션 버튼 영역: 콘텐츠 확인하기, 승인/반려 */}
      <div className={actionStyles.action_button_section}>
        {/* 
          📌 승인/반려 버튼:
          - 검수 결과를 처리하는 버튼들
          - 승인: 초록색 버튼
          - 반려: 빨간색 버튼
          - 두 버튼이 나란히 배치
        */}
        <div className={actionStyles.approval_buttons}>
          <button
            className={`${actionStyles.action_button} ${actionStyles.approve_button}`}
            onClick={() => onApprove(applicant.id)}
            aria-label={`${applicant.nickname} 승인`}
          >
            승인
          </button>
          <button
            className={`${actionStyles.action_button} ${actionStyles.reject_button}`}
            onClick={() => onReject(applicant.id)}
            aria-label={`${applicant.nickname} 반려`}
          >
            반려
          </button>
        </div>
      </div>
    </article>
  );
}
