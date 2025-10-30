/* ========================================
   🧩 액션형 카드 타입 (구매평/미션형)
   - type1: 구매 영수증 검증
   - type2: 링크 + 이미지 확인
   - type3: 이미지 확인
   - type4: 링크 확인
   - state: 검수 | 완료 | 반려
   ======================================== */

export type ActionCardType = 1 | 2 | 3 | 4;
export type ActionCardState = "검수" | "완료" | "반려";

import type { ExperienceApplicant as BaseExperienceApplicant } from "../experience_card/ExperienceTypes";

export interface ExperienceApplicant extends BaseExperienceApplicant {
  /** 어떤 액션 카드인지 구분 (1~4) */
  actionType: ActionCardType;
}
