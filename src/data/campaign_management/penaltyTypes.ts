/**
 * 패널티 공통 타입 정의
 *
 * 목적: 유저와 파트너의 패널티 데이터에서 공통으로 사용하는 타입을 정의합니다.
 *
 * 사용 위치:
 * - src/data/user/penaltyData.ts
 * - src/data/partner/penaltyData.ts
 * - src/components/common/campaign_management/PenaltyContent.tsx
 *
 */

// 패널티 상태 타입 - 6가지 가능한 상태를 정의
// union 타입: | (파이프) 기호로 여러 타입 중 하나를 의미
export type PenaltyStatus =
  | "활동 가능"
  | "경고 조치"
  | "이용 정지 7일"
  | "이용 정지 15일"
  | "이용 정지 30일"
  | "영구 정지";

// 패널티 종류 타입 - 4가지 패널티 분류
export type PenaltyType = "경고" | "주의" | "정지" | "제재";

// 개별 패널티 아이템의 구조를 정의하는 인터페이스
// interface는 객체의 형태를 정의하는 TypeScript 문법
export interface PenaltyItem {
  id: string; // 고유 식별자 (React key로도 사용)
  type: PenaltyType; // 패널티 분류
  title: string; // 패널티 제목/사유
  campaignTitle?: string; // 캠페인 제목 (캠페인으로 인한 패널티 발생 시에만 존재)
  date: string; // 발생 날짜 (YYYY-MM-DD 형식)
}

// 사용자 패널티 상태 데이터 타입
export interface PenaltyStatusData {
  currentStatus: PenaltyStatus;
  penaltyCount: number;
}
