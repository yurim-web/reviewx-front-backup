/* ========================================
   🎯 Status 관련 공통 타입
   ======================================== */

/**
 * 모듈 목적
 *
 * - 다양한 상태값(status)과 태그(tag) 관련 타입 정의
 * - UI에서 표시되는 상태 태그의 색상, 라벨 등 일관성 유지
 *
 * 📌 사용 위치:
 * - 캠페인 상태 태그
 * - 신청 상태 태그
 * - 포인트 거래 상태 태그
 * - 회원 상태 태그
 */

/**
 * 상태 태그 색상
 */
export type StatusColor =
  | 'primary'     // 파란색 (진행중, 활성)
  | 'success'     // 초록색 (완료, 승인)
  | 'warning'     // 주황색 (대기중, 검토중)
  | 'error'       // 빨간색 (거절, 취소, 실패)
  | 'gray';       // 회색 (비활성)

/**
 * 상태 태그 Props
 */
export interface StatusTagProps {
  label: string;
  color: StatusColor;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 캠페인 상태
 */
export type CampaignStatusType =
  | 'recruiting'      // 모집중
  | 'in_progress'     // 진행중
  | 'completed'       // 완료
  | 'cancelled'       // 취소됨
  | 'pending_approval'; // 승인대기

/**
 * 캠페인 상태 맵핑
 */
export interface CampaignStatusMap {
  recruiting: {
    label: '모집중';
    color: 'primary';
  };
  in_progress: {
    label: '진행중';
    color: 'primary';
  };
  completed: {
    label: '완료';
    color: 'success';
  };
  cancelled: {
    label: '취소됨';
    color: 'error';
  };
  pending_approval: {
    label: '승인대기';
    color: 'warning';
  };
}

/**
 * 신청 상태
 */
export type ApplicationStatusType =
  | 'pending'     // 대기중
  | 'approved'    // 승인됨
  | 'rejected'    // 거절됨
  | 'completed';  // 완료

/**
 * 신청 상태 맵핑
 */
export interface ApplicationStatusMap {
  pending: {
    label: '대기중';
    color: 'warning';
  };
  approved: {
    label: '승인됨';
    color: 'success';
  };
  rejected: {
    label: '거절됨';
    color: 'error';
  };
  completed: {
    label: '완료';
    color: 'success';
  };
}

/**
 * 포인트 거래 상태
 */
export type PointStatusType =
  | 'pending'     // 대기중
  | 'completed'   // 완료
  | 'cancelled'   // 취소
  | 'failed';     // 실패

/**
 * 포인트 상태 맵핑
 */
export interface PointStatusMap {
  pending: {
    label: '대기중';
    color: 'warning';
  };
  completed: {
    label: '완료';
    color: 'success';
  };
  cancelled: {
    label: '취소';
    color: 'gray';
  };
  failed: {
    label: '실패';
    color: 'error';
  };
}

/**
 * 회원 상태
 */
export type MemberStatusType =
  | 'active'      // 활성
  | 'inactive'    // 비활성
  | 'suspended'   // 정지
  | 'withdrawn';  // 탈퇴

/**
 * 회원 상태 맵핑
 */
export interface MemberStatusMap {
  active: {
    label: '활성';
    color: 'success';
  };
  inactive: {
    label: '비활성';
    color: 'gray';
  };
  suspended: {
    label: '정지';
    color: 'error';
  };
  withdrawn: {
    label: '탈퇴';
    color: 'gray';
  };
}

/**
 * 승인 상태
 */
export type ApprovalStatusType =
  | 'pending'   // 대기중
  | 'approved'  // 승인됨
  | 'rejected'; // 거절됨

/**
 * 승인 상태 맵핑
 */
export interface ApprovalStatusMap {
  pending: {
    label: '대기중';
    color: 'warning';
  };
  approved: {
    label: '승인됨';
    color: 'success';
  };
  rejected: {
    label: '거절됨';
    color: 'error';
  };
}

/**
 * 상태 변경 이력
 */
export interface StatusHistory {
  id: string;
  from_status: string;
  to_status: string;
  changed_at: string;
  changed_by?: string;
  reason?: string;
}

/**
 * 상태 필터 옵션
 */
export interface StatusFilterOption {
  value: string;
  label: string;
  color: StatusColor;
  count?: number;
}

/**
 * 배지 Props
 */
export interface BadgeProps {
  label: string | number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean; // 숫자 대신 점으로 표시
}
