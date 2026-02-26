/* ========================================
   📝 네이버블로그 카드 컴포넌트 (통합)
   ======================================== */

/**
 * 네이버블로그 카드 컴포넌트 (신청/선정 통합)
 *
 * 목적: 네이버블로그 채널 신청자/선정자 정보를 표시하는 통합 카드 컴포넌트
 *
 * 사용 페이지:
 * - /partner/campaign_application/delivery (배송형 캠페인 신청/선정자 목록)
 *
 * 통합된 기능:
 * - 신청자 프로필 정보 표시 (닉네임, 사용자 타입, 프로필 이미지)
 * - 채널 정보 표시 (네이버블로그 아이콘, 채널 ID)
 * - 회원 타입 표시 (모범 회원 / 주의 회원 / 경고 회원 / 이용 제한)
 * - 통계 정보 표시 (일방문, 총방문, 이웃수)
 * - 메모/자기소개 표시
 * - variant에 따른 버튼 표시 (선정하기 / 선택 취소)
 * - 인플루언서 전용 스타일 적용
 */

"use client";

import Image from "next/image";
import { Applicant } from "@/data/partner/campaign_application/delivery_applicants";
import baseStyles from "@/styles/partner/campaign_application/card/applicant_card_base.module.css";
import contentStyles from "@/styles/partner/campaign_application/card/applicant_card_content.module.css";
import actionStyles from "@/styles/partner/campaign_application/card/applicant_card_actions.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";
import { getChannelUrl } from "@/utils/helpers/url";

interface NaverBlogCardProps {
  /** 신청자 정보 객체 */
  applicant: Applicant;
  /** 카드 타입 (신청/선정) */
  variant: "applicant" | "selected";
  /** 선정하기 버튼 클릭 핸들러 함수 */
  onSelect?: (applicantId: string) => void;
  /** 선택 취소 버튼 클릭 핸들러 함수 */
  onCancel?: (applicantId: string) => void;
}

/**
 * 네이버블로그 카드 컴포넌트 (통합)
 *
 * 📌 React 함수형 컴포넌트:
 * - props를 매개변수로 받음
 * - 구조분해할당으로 필요한 속성만 추출
 * - JSX를 반환하여 UI 렌더링
 *
 * 📌 통합된 기능:
 * - variant prop으로 신청/선정 카드 구분
 * - 인플루언서 전용 스타일 적용
 * - 버튼 액션을 variant에 따라 분기
 *
 * @param props - NaverBlogCardProps 타입의 props
 * @returns JSX 요소
 */
export default function NaverBlogCard({
  applicant,
  variant,
  onSelect,
  onCancel,
}: NaverBlogCardProps) {
  /**
   * 채널 아이콘 경로 가져오기
   *
   * 📌 getChannelLogo 함수 사용:
   * - applicant.channel 값을 키로 사용하여 아이콘 경로 가져오기
   * - 네이버블로그 채널에 맞는 아이콘 표시
   * - 중앙 집중식 관리로 유지보수 용이
   */
  const channel_icon_src = getChannelLogo(applicant.channel);

  return (
    <article
      className={`${baseStyles.applicant_card} ${
        variant === "selected" ? baseStyles.selected_card : ""
      } ${
        variant === "selected" && applicant.userType === "인플루언서"
          ? baseStyles.selected_card_influencer
          : ""
      } ${applicant.selectionStatus === "이용제한 계정" ? baseStyles.restricted_card : ""}`}
    >
      {/* 프로필 영역: 프로필 이미지, 닉네임, 사용자 타입 */}
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
          {/* 사용자 타입 표시 (리뷰어 / 인플루언서) */}
          <span className={contentStyles.user_type}>{applicant.userType}</span>
          {/* 닉네임 표시 */}
          <span
            className={`${contentStyles.nickname} ${
              applicant.userType === "인플루언서" ? contentStyles.influencer_nickname : ""
            }`}
          >
            {applicant.nickname}
          </span>
        </div>
      </div>

      {/* 채널 정보 영역: 채널 아이콘, 신청자 ID */}
      <div className={contentStyles.channel_section}>
        {/* 채널이미지 로고 */}
        <Image
          src={channel_icon_src}
          alt="채널"
          className={contentStyles.channel_icon}
          width={14}
          height={14}
        />
        {/* 신청자 아이디 표시 - 클릭 시 해당 채널로 이동 */}
        <a
          href={getChannelUrl(applicant.channel, applicant.Id)}
          target="_blank"
          rel="noopener noreferrer"
          className={contentStyles.applicant_id}
          onClick={(e) => {
            // URL이 유효하지 않은 경우 클릭 방지
            const url = getChannelUrl(applicant.channel, applicant.Id);
            if (url === "#") {
              e.preventDefault();
            }
          }}
        >
          {applicant.Id}
        </a>
      </div>

      {/* 회원 타입 표시 */}
      <div className={contentStyles.member_type}>{applicant.memberType}</div>

      {/* 통계 정보 영역: 일방문, 총방문, 이웃수 */}
      <div className={contentStyles.stats_section}>
        {/* 
          📌 통계 아이템 1: 일방문
          - toLocaleString(): 숫자를 천 단위 콤마로 표시
          - 예: 135 -> "135", 1350 -> "1,350"
        */}
        <div className={contentStyles.stat_item}>
          <span className={contentStyles.stat_label}>일방문</span>
          <span className={contentStyles.stat_value}>
            {applicant.dailyVisits ? applicant.dailyVisits.toLocaleString() : "0"}
          </span>
        </div>

        {/* 통계 아이템 2: 총방문 */}
        <div className={contentStyles.stat_item}>
          <span className={contentStyles.stat_label}>총방문</span>
          <span className={contentStyles.stat_value}>
            {applicant.totalVisits ? applicant.totalVisits.toLocaleString() : "0"}
          </span>
        </div>

        {/* 통계 아이템 3: 이웃수 */}
        <div className={contentStyles.stat_item}>
          <span className={contentStyles.stat_label}>이웃수</span>
          <span className={contentStyles.stat_value}>
            {applicant.neighbors ? applicant.neighbors.toLocaleString() : "0"}
          </span>
        </div>
      </div>

      {/* 메모 영역 */}
      <div className={contentStyles.memo_section}>
        <div className={contentStyles.memo_text}>
          {applicant.memo && applicant.memo.trim() !== "" ? applicant.memo : "메모 미작성"}
        </div>
        {/* 선정된 카드일 때만 메모 구분선 표시 */}
        {variant === "selected" && <div className={contentStyles.memo_divider}></div>}
      </div>

      {/* 액션 버튼 영역: variant에 따라 다른 버튼 표시 */}
      <div className={actionStyles.action_button_section}>
        {/* 신청 카드: 선정하기 / 이용 제한 표시 */}
        {variant === "applicant" && (
          <>
            {applicant.selectionStatus === "미선택" && onSelect && (
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
          </>
        )}

        {/* 선정 카드: 선택 취소 버튼 */}
        {variant === "selected" && onCancel && (
          <button
            className={`${actionStyles.action_button} ${
              applicant.userType === "인플루언서"
                ? actionStyles.influencer_cancel_button
                : actionStyles.cancel_button
            }`}
            onClick={() => onCancel(applicant.id)}
            aria-label={`${applicant.nickname} 신청자 선택 취소`}
          >
            선택 취소
          </button>
        )}
      </div>
    </article>
  );
}
