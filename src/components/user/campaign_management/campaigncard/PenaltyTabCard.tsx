/* ========================================
   📋 패널티 탭 캠페인 카드 컴포넌트
   ======================================== */

/**
 * 패널티 탭 캠페인 카드 컴포넌트
 *
 * 목적: "패널티" 탭에 표시되는 캠페인 카드를 렌더링합니다.
 *
 * 경우의 수: 1가지
 * - 버튼: "패널티 해제하기" (1개)
 *

 */

import type { CampaignApplication } from "@/types/user/user";
import buttonStyles from "../../../../styles/user/campaign_management/buttons.module.css";
import { getButtonClassName } from "@/components/common/campaign_management/utils/button_style_utils";
import CampaignCardBase from "./CampaignCardBase";

interface PenaltyTabCardProps {
  campaign: CampaignApplication;
}

/**
 * 패널티 탭 캠페인 카드
 *
 * 설명:
 * - 패널티가 부과된 상태를 표시합니다.
 * - "패널티 해제하기" 버튼을 통해 패널티 해제를 요청할 수 있습니다.
 */
export default function PenaltyTabCard({ campaign }: PenaltyTabCardProps) {
  // 상태 텍스트
  const statusText = "패널티가 부과되었습니다.";

  // 버튼 텍스트
  const buttonText = "패널티 해제하기";

  // 버튼 스타일 클래스 가져오기
  const buttonStyle = getButtonClassName(buttonText, buttonStyles);

  /**
   * 버튼 클릭 핸들러
   *
   * 설명:
   * - 패널티 해제 요청을 처리합니다.
   * - 현재는 콘솔에 로그만 출력하지만, 실제로는 API 호출을 통해 패널티 해제를 처리합니다.
   */
  const handleButtonClick = () => {
    console.log(`${buttonText} 버튼 클릭됨`);
    // TODO: 패널티 해제 API 호출
  };

  return (
    <CampaignCardBase campaign={campaign} statusText={statusText}>
      <div className={buttonStyles.campaign_actions}>
        <button className={buttonStyle} onClick={handleButtonClick}>
          {buttonText}
        </button>
      </div>
    </CampaignCardBase>
  );
}
