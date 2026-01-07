/**
 * 파트너 패널티 데이터
 *
 * 목적: 파트너(광고주)의 패널티 내역과 상태를 관리하는 목업 데이터입니다.
 *
 * 사용 위치:
 * - /partner/campaign_management/penalty (파트너 패널티 페이지)
 *

 */

// 공통 타입 import
import type {
  PenaltyItem,
  PenaltyStatus,
} from "../campaign_management/penaltyTypes";

// 패널티 내역 목업 데이터 - 파트너(광고주)용
export const partnerPenaltyData: PenaltyItem[] = [
  {
    id: "1",
    type: "경고",
    title: "캠페인 지시 불이행",
    campaignTitle: "파트너 캠페인 A - 제품 리뷰 요청",
    date: "2025-09-15",
  },
  {
    id: "2",
    type: "경고",
    title: "캠페인 의무 노출 기간 불이행",
    campaignTitle: "파트너 캠페인 B - 브랜드 소개",
    date: "2025-09-13",
  },
  {
    id: "3",
    type: "주의",
    title: "캠페인 반복 반려",
    campaignTitle: "파트너 캠페인 C - 이벤트 홍보",
    date: "2025-09-11",
  },
  {
    id: "4",
    type: "주의",
    title: "캠페인 지각 제출",
    campaignTitle: "파트너 캠페인 D - 신제품 런칭",
    date: "2025-09-09",
  },
  {
    id: "5",
    type: "정지",
    title: "캠페인 무단 취소",
    campaignTitle: "파트너 캠페인 E - 시즌 프로모션",
    date: "2025-09-07",
  },
];

// 사용자 현재 상태 목업 데이터 - 파트너(광고주)용
// as PenaltyStatus는 TypeScript 타입 단언(Type Assertion)
export const partnerPenaltyStatus = {
  currentStatus: "경고 조치" as PenaltyStatus,
  penaltyCount: 5,
};
