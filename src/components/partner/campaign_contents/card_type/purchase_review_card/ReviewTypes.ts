/* ========================================
   🧾 구매평 전용 카드 타입
   - type1: 리뷰 확인 (검수)
   - type2: 구매 영수증 확인 (검수)
   - type3: 리뷰 확인 (검수 완료)
   - type4: 구매 영수증 확인 (리뷰 대기 중)
   - type5: 리뷰 확인 (반려 처리)
   - type6: 구매 영수증 확인 (반려 처리)
   ======================================== */

export type ReviewCardType = 1 | 2 | 3 | 4 | 5 | 6;
export type ReviewCardState = "검수" | "완료" | "반려" | "대기";

import type { ExperienceApplicant as BaseExperienceApplicant } from "../experience_card/ExperienceTypes";

export interface ExperienceApplicant extends BaseExperienceApplicant {
  /** 어떤 구매평 카드인지 구분 (1~6) */
  reviewType: ReviewCardType;
}
