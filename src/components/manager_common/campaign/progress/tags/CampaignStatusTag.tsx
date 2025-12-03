/* ========================================
   🏷️ 캠페인 상태 태그 컴포넌트 (공통)
   ======================================== */

/**
 * 캠페인 상태 태그 컴포넌트 (공통)
 *
 * 목적: manager_ga와 manager_sa에서 공통으로 사용하는 캠페인 상태 태그 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/progress (GA 관리자 진행 현황 페이지)
 * - /manager_sa/campaign/progress (SA 관리자 진행 현황 페이지)
 *
 * 주요 기능:
 * - 예정: 노란색 배경
 * - 신청: 분홍색 배경
 * - 진행: 파란색 배경
 * - 종료: 회색 배경
 * - 긴급: 빨간색 배경
 *
 */

// 캠페인 상태 타입 정의
export type CampaignStatus =
  | '예정'
  | '신청'
  | '진행'
  | '종료'
  | '취소'
  | '긴급';

// 캠페인 상태 태그 props 타입 정의
interface CampaignStatusTagProps {
  status: CampaignStatus; // 캠페인 상태
  styles: Record<string, string>; // CSS 모듈 스타일 객체 (유연한 타입)
}

/**
 * 캠페인 상태 태그 컴포넌트
 *
 * @param status - 캠페인 상태
 * @param styles - CSS 모듈 스타일 객체
 */
export default function CampaignStatusTag({
  status,
  styles: cssStyles,
}: CampaignStatusTagProps) {
  // 상태에 따라 다른 className을 반환하는 함수
  const getStatusClassName = () => {
    switch (status) {
      case '예정':
        return cssStyles.status_tag_scheduled;
      case '신청':
        return cssStyles.status_tag_applied;
      case '진행':
        return cssStyles.status_tag_progress;
      case '종료':
        return cssStyles.status_tag_ended;
      case '취소':
        return cssStyles.status_tag_cancelled;
      case '긴급':
        return cssStyles.status_tag_urgent;
      default:
        return cssStyles.status_tag_scheduled;
    }
  };

  return (
    <div className={`${cssStyles.status_tag} ${getStatusClassName()}`}>
      <span>{status}</span>
    </div>
  );
}

