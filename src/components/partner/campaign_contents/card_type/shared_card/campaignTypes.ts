/* ========================================
   구매평/미션형 공통 카드 타입
   ======================================== */

/**
 * CampaignTypes
 *
 * 목적: 구매평/미션형 콘텐츠 카드에서 공통으로 사용하는 타입을 정의합니다.
 *
 * 사용 페이지:
 * - /partner/campaign/[id]/contents (구매평/미션형 > 대기·확인·완료 탭)
 */

import type { ExperienceApplicant as BaseExperienceApplicant } from "../experience_card/experienceTypes";

/**
 * 구매평 카드 타입
 * - type1: 리뷰 확인 (검수)
 * - type2: 구매 영수증 확인 (검수)
 * - type3: 리뷰 확인 (검수 완료)
 * - type4: 구매 영수증 확인 (리뷰 대기 중)
 * - type5: 리뷰 확인 (반려 처리)
 * - type6: 구매 영수증 확인 (반려 처리)
 */
export type ReviewCardType = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * 미션형 카드 타입
 * - type1: 이미지 + 링크 (승인/반려)
 * - type2: 이미지만 (승인/반려)
 * - type3: 링크만 (승인/반려)
 * - type4: 이미지 + 링크 (반려 처리)
 * - type5: 이미지만 (반려 처리)
 * - type6: 링크만 (반려 처리)
 * - type7: 이미지 + 링크 (검수 완료)
 * - type8: 이미지만 (검수 완료)
 * - type9: 링크만 (검수 완료)
 */
export type MissionCardType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * 캠페인 타입 (구매평 또는 미션형)
 */
export type CampaignType = "review" | "mission";

/**
 * 구매평/미션형 공통 신청자 타입
 * - BaseExperienceApplicant를 확장하여 구매평/미션형 특화 필드 추가
 */
export interface CampaignApplicant extends BaseExperienceApplicant {
  /**
   * 캠페인 타입 (구매평 또는 미션형)
   * - "review": 구매평 캠페인
   * - "mission": 미션형 캠페인
   */
  campaignType: CampaignType;

  /**
   * 구매평 카드 타입 (campaignType이 "review"일 때 사용)
   * - 1~6: 리뷰 확인, 영수증 확인 등 다양한 상태
   */
  reviewType?: ReviewCardType;

  /**
   * 미션형 카드 타입 (campaignType이 "mission"일 때 사용)
   * - 1~9: 이미지/링크 조합 및 상태에 따른 타입
   */
  missionType?: MissionCardType;
}
