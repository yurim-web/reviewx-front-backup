/* ========================================
   📸 인스타그램 신청자 카드 컴포넌트
   ======================================== */

/**
 * 인스타그램 신청자 카드 컴포넌트
 *
 * 목적: 인스타그램 캠페인에 신청한 사용자의 정보를 카드 형태로 표시하는 전용 컴포넌트입니다.
 *
 * 사용 위치:
 * - /partner/campaign_application/delivery (배송형 캠페인 신청자 목록)
 * - 인스타그램 채널 신청자들만 표시
 *
 * 인스타그램 캠페인 특화 기능:
 * - 신청자 프로필 정보 표시 (닉네임, 사용자 타입, 프로필 이미지)
 * - 인스타그램 채널 정보 표시 (인스타그램 아이콘, 채널 ID)
 * - 회원 타입 표시 (모범 회원 / 이용 제한)
 * - 인스타그램 특화 통계 정보 표시 (팔로워 수)
 * - 메모/자기소개 표시
 * - 선정하기 버튼 (미선택 상태)
 * - 이용 제한 표시 (이용제한 계정 상태)
 *
 * 📌 인스타그램 캠페인의 특징:
 * 1. 팔로워 수 기반 영향력 평가
 * 2. 시각적 콘텐츠 중심의 리뷰
 * 3. 스토리/피드 게시물 활용
 * 4. 해시태그 및 멘션 기능
 */

"use client";

import { InstagramApplicant } from "@/data/partner/campaign_application/delivery_applicants";
import styles from "@/styles/partner/campaign_application/card/applicant_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";

interface InstagramCardProps {
  /** 인스타그램 신청자 정보 객체 */
  applicant: InstagramApplicant;
  /** 선정하기 버튼 클릭 핸들러 함수 */
  onSelect: (applicantId: string) => void;
}

/**
 * 인스타그램 신청자 카드 컴포넌트
 *
 * 📌 React 함수형 컴포넌트:
 * - props를 매개변수로 받음
 * - 구조분해할당으로 필요한 속성만 추출
 * - JSX를 반환하여 UI 렌더링
 *
 * 📌 인스타그램 특화 기능:
 * - 팔로워 수 중심의 통계 표시
 * - 인스타그램 브랜드 컬러 활용
 * - 시각적 콘텐츠에 최적화된 디자인
 *
 * @param props - InstagramCardProps 타입의 props
 * @returns JSX 요소
 */
export default function InstagramCard({
  applicant,
  onSelect,
}: InstagramCardProps) {
  /**
   * 인스타그램 아이콘 경로 가져오기
   *
   * 📌 getChannelLogo 함수 사용:
   * - 유틸리티 함수를 통해 채널 로고 경로 가져오기
   * - 인스타그램 채널에 맞는 아이콘 표시
   * - 중앙 집중식 관리로 유지보수 용이
   */
  const channel_icon_src = getChannelLogo("인스타그램");

  return (
    <article
      className={`${styles.applicant_card} ${
        applicant.selectionStatus === "이용제한 계정"
          ? styles.restricted_card
          : ""
      }`}
    >
      {/* 프로필 영역: 프로필 이미지, 닉네임, 사용자 타입 */}
      <div className={styles.profile_section}>
        <div className={styles.profile_image_container}>
          {applicant.profileImage ? (
            <img
              src={applicant.profileImage}
              alt="프로필"
              className={styles.profile_image}
            />
          ) : (
            // 이미지사진 없을 때 대체
            <div className={styles.profile_placeholder}></div>
          )}
        </div>

        <div className={styles.profile_info}>
          {/* 사용자 타입 표시 (리뷰어 / 인플루언서) */}
          <span className={styles.user_type}>{applicant.userType}</span>
          {/* 닉네임 표시 */}
          <span className={styles.nickname}>{applicant.nickname}</span>
        </div>
      </div>

      {/* 채널 정보 영역: 인스타그램 아이콘, 신청자 ID */}
      <div className={styles.channel_section}>
        {/* 인스타그램 로고 */}
        <img
          src={channel_icon_src}
          alt="인스타그램"
          className={styles.channel_icon}
        />
        {/* 신청자 아이디 표시 */}
        <span className={styles.applicant_id}>{applicant.Id}</span>
      </div>

      {/* 회원 타입 표시 */}
      <div className={styles.member_type}>{applicant.memberType}</div>

      {/* 통계 정보 영역: 팔로워 수 (인스타그램 특화) */}
      <div className={styles.stats_section}>
        {/* 
          📌 통계 아이템: 팔로워 수
          - 인스타그램에서는 팔로워 수가 가장 중요한 지표
          - toLocaleString(): 숫자를 천 단위 콤마로 표시
          - 예: 122838 -> "122,838"
        */}
        <div className={styles.stat_item}>
          <span className={styles.stat_label}>팔로워</span>
          <span className={styles.stat_value}>
            {applicant.followers ? applicant.followers.toLocaleString() : "0"}
          </span>
        </div>
      </div>

      {/* 메모 영역 */}
      <div className={styles.memo_section}>
        <div className={styles.memo_text}>
          {applicant.memo && applicant.memo.trim() !== ""
            ? applicant.memo
            : "메모 미작성"}
        </div>
      </div>

      {/* 액션 버튼 영역: 선정하기 / 이용 제한 표시 */}
      <div className={styles.action_button_section}>
        {applicant.selectionStatus === "미선택" && (
          <button
            className={`${styles.action_button} ${styles.select_button}`}
            onClick={() => onSelect(applicant.id)}
            aria-label={`${applicant.nickname} 신청자 선정하기`}
          >
            선정하기
          </button>
        )}

        {/* 
          📌 이용 제한 계정 표시:
          - disabled 속성: 버튼 비활성화
          - 클릭 불가능한 상태
        */}
        {applicant.selectionStatus === "이용제한 계정" && (
          <button
            className={`${styles.action_button} ${styles.restricted_button}`}
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
