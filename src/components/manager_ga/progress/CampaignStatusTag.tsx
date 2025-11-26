/* ========================================
   🏷️ 캠페인 상태 태그 컴포넌트
   ======================================== */

/**
 * 캠페인 상태 태그 컴포넌트
 *
 * 목적: 캠페인의 상태를 색상이 있는 태그로 표시합니다.
 *
 * 사용 페이지:
 * - /manager_ga/progress (진행 현황 페이지)
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

import styles from '@/styles/manager_ga/progress.module.css';

// 캠페인 상태 타입 정의
export type CampaignStatus = '예정' | '신청' | '진행' | '종료' | '긴급';

// 캠페인 상태 태그 props 타입 정의
interface CampaignStatusTagProps {
  status: CampaignStatus; // 캠페인 상태
}

/**
 * 캠페인 상태 태그 컴포넌트
 *
 * @param status - 캠페인 상태
 */
export default function CampaignStatusTag({
  status,
}: CampaignStatusTagProps) {
  // 상태에 따라 다른 className을 반환하는 함수
  const getStatusClassName = () => {
    switch (status) {
      case '예정':
        return styles.status_tag_scheduled;
      case '신청':
        return styles.status_tag_applied;
      case '진행':
        return styles.status_tag_progress;
      case '종료':
        return styles.status_tag_ended;
      case '긴급':
        return styles.status_tag_urgent;
      default:
        return styles.status_tag_scheduled;
    }
  };

  return (
    <div className={`${styles.status_tag} ${getStatusClassName()}`}>
      <span>{status}</span>
    </div>
  );
}

