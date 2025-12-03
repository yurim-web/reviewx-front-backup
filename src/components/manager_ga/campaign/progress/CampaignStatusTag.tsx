/* ========================================
   🏷️ 캠페인 상태 태그 컴포넌트
   ======================================== */

/**
 * 캠페인 상태 태그 컴포넌트
 *
 * 목적: 캠페인의 상태를 색상이 있는 태그로 표시합니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/progress (진행 현황 페이지)
 *
 * 주요 기능:
 * - 예정: 노란색 배경
 * - 신청: 분홍색 배경
 * - 진행: 파란색 배경
 * - 종료: 회색 배경
 * - 긴급: 빨간색 배경
 *
 */

import CampaignStatusTagCommon, {
  type CampaignStatus,
} from '@/components/manager_common/campaign/progress/tags/CampaignStatusTag';
import styles from '@/styles/manager_ga/campaign/progress/tags.module.css';

// 캠페인 상태 태그 props 타입 정의
interface CampaignStatusTagProps {
  status: CampaignStatus; // 캠페인 상태
}

// 타입 재export (하위 호환성을 위해)
export type { CampaignStatus };

/**
 * 캠페인 상태 태그 컴포넌트
 *
 * 목적: 공통 컴포넌트를 사용하여 중복 코드를 제거합니다.
 *
 * @param status - 캠페인 상태
 */
export default function CampaignStatusTag({ status }: CampaignStatusTagProps) {
  return <CampaignStatusTagCommon status={status} styles={styles} />;
}
