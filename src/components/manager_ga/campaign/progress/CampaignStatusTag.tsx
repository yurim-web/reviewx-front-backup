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
 * 학습 포인트:
 * - 조건부 렌더링: 상태에 따라 다른 스타일을 적용합니다
 * - 삼항 연산자: 조건에 따라 다른 className을 적용합니다
 * - CSS Modules: className으로 스타일을 적용합니다
 */

import CampaignStatusTagCommon from '@/components/manager_common/campaign/progress/CampaignStatusTag';
import styles from '@/styles/manager_ga/campaign/progress/tags.module.css';

// 캠페인 상태 타입 정의 (공통 컴포넌트에서 export한 타입 재사용)
export type CampaignStatus = '예정' | '신청' | '진행' | '종료' | '긴급';

// 캠페인 상태 태그 props 타입 정의
interface CampaignStatusTagProps {
  status: CampaignStatus; // 캠페인 상태
}

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
