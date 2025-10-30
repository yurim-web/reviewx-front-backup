/* ========================================
   🧩 미션형 전용 카드 타입
   - type1: 이미지 + 링크 (승인/반려)
   - type2: 이미지만 (승인/반려)
   - type3: 링크만 (승인/반려)
   - type4: 이미지 + 링크 (반려 처리)
   - type5: 이미지만 (반려 처리)
   - type6: 링크만 (반려 처리)
   - type7: 이미지 + 링크 (검수 완료)
   - type8: 이미지만 (검수 완료)
   - type9: 링크만 (검수 완료)
   ======================================== */

export type MissionCardType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

import type { ExperienceApplicant as BaseExperienceApplicant } from "../experience_card/ExperienceTypes";

export interface ExperienceApplicant extends BaseExperienceApplicant {
  /** 어떤 미션형 카드인지 구분 (1~9) */
  missionType: MissionCardType;
}
