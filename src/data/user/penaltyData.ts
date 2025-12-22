/**
 * 유저 패널티 데이터
 *
 * 목적: 유저(리뷰어)의 패널티 내역과 상태를 관리하는 목업 데이터입니다.
 *
 * 사용 위치:
 * - /user/campaign_management/penalty (유저 패널티 페이지)
 *
 * 학습 포인트:
 * - 데이터 분리: 컴포넌트와 데이터를 분리하여 관리
 * - 타입 import: 공통 타입을 다른 파일에서 import하여 사용
 * - export: 다른 파일에서 import하여 사용 가능
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
    type: "정지",
    title: "캠페인 지각 제출",
    campaignTitle: "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
    date: "2025-09-12",
  },
  {
    id: "2",
    type: "주의",
    title: "캠페인 반복 반려",
    campaignTitle: "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
    date: "2025-09-10",
  },
  {
    id: "3",
    type: "주의",
    title: "캠페인 지각 제출",
    campaignTitle: "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
    date: "2025-09-12",
  },
  {
    id: "4",
    type: "주의",
    title: "캠페인 반복 반려",
    campaignTitle: "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
    date: "2025-09-10",
  },
  {
    id: "5",
    type: "주의",
    title: "캠페인 반복 반려",
    campaignTitle: "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
    date: "2025-09-10",
  },
  {
    id: "6",
    type: "주의",
    title: "캠페인 반복 반려",
    campaignTitle: "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
    date: "2025-09-10",
  },
  {
    id: "7",
    type: "제재",
    title: "이용 정지 3일",
    campaignTitle: "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
    date: "2025-09-10",
  },
  {
    id: "8",
    type: "경고",
    title: "캠페인 의무 노출 기간 불이행",
    campaignTitle: "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
    date: "2025-09-08",
  },
  {
    id: "9",
    type: "경고",
    title: "캠페인 지시 불이행",
    campaignTitle: "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
    date: "2025-09-06",
  },
  {
    id: "10",
    type: "경고",
    title: "캠페인 무단 이탈 (노쇼)",
    campaignTitle: "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
    date: "2025-09-10",
  },
  {
    id: "11",
    type: "경고",
    title: "캠페인 의무 노출 기간 불이행",
    campaignTitle: "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
    date: "2025-09-01",
  },
];

// 사용자 현재 상태 목업 데이터 - 유저(리뷰어)용
// as PenaltyStatus는 TypeScript 타입 단언(Type Assertion)
export const userPenaltyStatus = {
  currentStatus: "이용 정지 15일" as PenaltyStatus,
  penaltyCount: 12,
};
