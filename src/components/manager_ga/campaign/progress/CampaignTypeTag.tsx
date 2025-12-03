/* ========================================
   🏷️ 캠페인 유형 태그 컴포넌트
   ======================================== */

/**
 * 캠페인 유형 태그 컴포넌트
 *
 * 목적: 캠페인의 유형을 태그로 표시합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/progress (진행 현황 페이지)
 *
 * 주요 기능:
 * - 배송형, 방문형, 구매평, 기자단, 미션형을 표시합니다
 * - 모든 유형은 동일한 스타일을 사용합니다
 *
 */

import CampaignTypeTagCommon, {
  type CampaignType,
} from '@/components/manager_common/campaign/progress/tags/CampaignTypeTag';
import styles from '@/styles/manager_ga/campaign/progress/tags.module.css';

// 캠페인 유형 태그 props 타입 정의
interface CampaignTypeTagProps {
  type: CampaignType; // 캠페인 유형
}

// 타입 재export (하위 호환성을 위해)
export type { CampaignType };

/**
 * 캠페인 유형 태그 컴포넌트
 *
 * 목적: 공통 컴포넌트를 사용하여 중복 코드를 제거합니다.
 *
 * @param type - 캠페인 유형
 */
export default function CampaignTypeTag({ type }: CampaignTypeTagProps) {
  return <CampaignTypeTagCommon type={type} styles={styles} />;
}




