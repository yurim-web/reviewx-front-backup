/**
 * 유저 패널티 데이터
 *
 * 목적: 유저(리뷰어)의 패널티 내역과 상태를 관리하는 목업 데이터입니다.
 *
 * 사용 위치:
 * - /user/campaign_management/penalty (유저 패널티 페이지)
 *
 */

// 공통 타입 import
import type {
  PenaltyItem,
  PenaltyStatus,
} from "../campaign_management/penaltyTypes";

// 패널티 내역 목업 데이터 - 유저(리뷰어)용
export const userPenaltyData: PenaltyItem[] = [
  {
    id: "1",
    type: "경고",
    title: "캠페인 지각 제출",
    campaignTitle: "아이디헤어 지축점 맨즈 시술 모집",
    date: "2025-09-01",
  },
  {
    id: "2",
    type: "주의",
    title: "캠페인 지시 불이행",
    campaignTitle: "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
    date: "2025-09-01",
  },
  {
    id: "3",
    type: "정지",
    title: "캠페인 의무 노출 기간 불이행",
    campaignTitle: "밀리빙 두유제조기",
    date: "2025-09-01",
  },
  {
    id: "4",
    type: "제재",
    title: "캠페인 무단 이탈 (노쇼)",
    campaignTitle: "[충북/충북대점] '픽스팟' 2분만에 완성하는 나만의 폰케이스",
    date: "2025-09-01",
  },
  {
    id: "5",
    type: "경고",
    title: "캠페인 무단 이탈 (노쇼)",
    campaignTitle: "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
    date: "2025-09-01",
  },
];

// 사용자 현재 상태 목업 데이터 - 유저(리뷰어)용
// as PenaltyStatus는 TypeScript 타입 단언(Type Assertion)
export const userPenaltyStatus = {
  currentStatus: "경고 조치" as PenaltyStatus,
  penaltyCount: 12,
};
