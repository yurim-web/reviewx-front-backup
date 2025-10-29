/* ========================================
   📸 인스타그램 선정된 카드 컴포넌트
   ======================================== */

/**
 * 인스타그램 선정된 카드 컴포넌트
 *
 * 목적: 이미 선정된 인스타그램 신청자의 정보를 표시하는 카드 컴포넌트입니다.
 *
 * 사용 위치:
 * - /partner/campaign_application/delivery (배송형 캠페인 선정자 목록)
 * - 인스타그램 채널 선정자들만 표시
 *
 * 인스타그램 선정된 카드 특징:
 * - 신청자 프로필 정보 표시 (닉네임, 사용자 타입, 프로필 이미지)
 * - 인스타그램 채널 정보 표시 (인스타그램 아이콘, 채널 ID)
 * - 회원 타입 표시 (모범 회원 / 이용 제한)
 * - 인스타그램 특화 통계 정보 표시 (팔로워 수)
 * - 메모/자기소개 표시
 * - 선택 취소 버튼 (선정 해제 가능)
 * - 점선 테두리로 선정된 상태 표시
 *
 * 📌 인스타그램 선정된 카드의 특징:
 * 1. 이미 선정된 상태임을 시각적으로 표시
 * 2. 점선 파란색 테두리로 강조
 * 3. 선택 취소 버튼으로 선정 해제 가능
 * 4. 인스타그램 브랜드 컬러 활용
 */

"use client";

import { InstagramApplicant } from "@/data/partner/campaign_application/delivery_applicants";
import styles from "@/styles/partner/campaign_application/delivery/delivery_card_shared.module.css";
import { getChannelLogo } from "@/utils/channelLogoMap";

interface InstagramSelectedCardProps {
  /** 선정된 인스타그램 신청자 정보 객체 */
  applicant: InstagramApplicant;
  /** 선택 취소 버튼 클릭 핸들러 함수 */
  onCancel: (applicantId: string) => void;
}

/**
 * 인스타그램 선정된 카드 컴포넌트
 *
 * 📌 React 함수형 컴포넌트:
 * - props를 매개변수로 받음
 * - 구조분해할당으로 필요한 속성만 추출
 * - JSX를 반환하여 UI 렌더링
 *
 * 📌 인스타그램 선정된 카드 특화 기능:
 * - 점선 테두리로 선정된 상태 표시
 * - 배경색 변경으로 구분
 * - 선택 취소 버튼으로 선정 해제 가능
 * - 인스타그램 브랜드 컬러 활용
 *
 * @param props - InstagramSelectedCardProps 타입의 props
 * @returns JSX 요소
 */
export default function InstagramSelectedCard({
  applicant,
  onCancel,
}: InstagramSelectedCardProps) {
  /**
   * 인스타그램 아이콘 경로 가져오기
   *
   * 📌 getChannelLogo 함수 사용:
   * - applicant.channel 값을 키로 사용하여 아이콘 경로 가져오기
   * - 인스타그램 채널에 맞는 아이콘 표시
   * - 모든 채널이 매핑되어 있으므로 항상 올바른 아이콘 표시
   */
  const channel_icon_src = getChannelLogo("인스타그램");

  return (
    <article className={`${styles.applicant_card} ${styles.selected_card}`}>
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

      {/* 채널 정보 영역: 인스타그램 아이콘, 채널 ID */}
      <div className={styles.channel_section}>
        <img
          src={channel_icon_src}
          alt="인스타그램"
          className={styles.channel_icon}
        />

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
      {/* 메모 영역: 신청자가 작성한 자기소개 */}
      <div className={styles.memo_section}>
        <div className={styles.memo_text}>
          {applicant.memo && applicant.memo.trim() !== ""
            ? applicant.memo
            : "메모 미작성"}
        </div>
        <div className={styles.memo_divider}></div>
      </div>
      {/* 액션 버튼 영역: 선택 취소 버튼 */}
      <div className={styles.action_button_section}>
        {/* 
          📌 선택 취소 버튼:
          - 선정된 상태를 해제할 수 있는 버튼
          - 회색 배경으로 취소 액션임을 표시
          - 클릭 시 onCancel 핸들러 호출
        */}
        <button
          className={`${styles.action_button} ${styles.cancel_button}`}
          onClick={() => onCancel(applicant.id)}
          aria-label={`${applicant.nickname} 신청자 선택 취소`}
        >
          선택 취소
        </button>
      </div>
    </article>
  );
}
