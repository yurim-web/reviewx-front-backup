/* ========================================
   📊 GA 관리자 신고내역 목업 데이터
   ======================================== */

/**
 * GA 관리자 신고내역 목업 데이터
 *
 * 목적: GA 관리자 신고내역 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/reported (신고내역 페이지)
 *
 * 주요 기능:
 * - 신고 코드 안내 데이터
 * - 신고 내역 통계 데이터
 * - 신고 내역 목록 데이터
 *
 */

// 신고 코드 타입 정의
export type ReportCode =
  | "W001"
  | "W002"
  | "W003"
  | "W004"
  | "W005"
  | "W006"
  | "W007"
  | "W008"
  | "W009"
  | "W010"
  | "W011"
  | "W012"
  | "W013";

// 신고 코드 카테고리 타입 정의
export type ReportCategory = "리뷰어" | "파트너" | "시스템" | "기타";

// 신고 코드 안내 데이터 타입
export interface ReportCodeInfo {
  code: ReportCode; // 신고 코드 (예: W001)
  category: ReportCategory; // 카테고리 (예: 리뷰어)
  reason: string; // 신고 사유 (예: 선정 후 취소)
}

// 신고 내역 통계 데이터 타입
export interface ReportStatsItem {
  code: ReportCode; // 신고 코드
  count: number; // 신고 횟수
}

// 신고 내역 목록 아이템 타입
export interface ReportedCampaignItem {
  id: string; // 신고 내역 ID
  campaign_number: string; // 캠페인 번호
  campaign_name: string; // 캠페인명
  report_code: ReportCode; // 신고 코드
  report_reason: string; // 신고 사유 (상세)
  inspector: string; // 검수자
  target: string; // 대상자
  processed_date: string; // 처리일 (예: 2025-08-01 18:56)
  report_count: number; // 신고 횟수
}

// 신고 코드 안내 데이터
// 각 신고 코드의 카테고리와 사유를 정의합니다
export const report_code_info: ReportCodeInfo[] = [
  {
    code: "W001",
    category: "리뷰어",
    reason: "선정 후 취소",
  },
  {
    code: "W002",
    category: "리뷰어",
    reason: "지각 제출",
  },
  {
    code: "W003",
    category: "리뷰어",
    reason: "무단 이탈 · 노쇼",
  },
  {
    code: "W004",
    category: "리뷰어",
    reason: "노출 기간 불이행",
  },
  {
    code: "W005",
    category: "리뷰어",
    reason: "수정 요청 불이행",
  },
  {
    code: "W006",
    category: "파트너",
    reason: "게시 후 취소",
  },
  {
    code: "W007",
    category: "파트너",
    reason: "부적절한 캠페인 게시",
  },
  {
    code: "W008",
    category: "파트너",
    reason: "공정위 위반 요청",
  },
  {
    code: "W009",
    category: "시스템",
    reason: "비정상 요청 반복",
  },
  {
    code: "W010",
    category: "시스템",
    reason: "중복 계정 탐지",
  },
  {
    code: "W011",
    category: "시스템",
    reason: "콘텐츠 중복 탐지",
  },
  {
    code: "W012",
    category: "시스템",
    reason: "비정상 접근 기록",
  },
  {
    code: "W013",
    category: "기타",
    reason: "그외 비매너 행위",
  },
];

// 신고 내역 통계 데이터
// 각 신고 코드별 신고 횟수를 집계한 데이터입니다
export const report_stats: ReportStatsItem[] = [
  {
    code: "W001",
    count: 3,
  },
  {
    code: "W002",
    count: 3,
  },
  {
    code: "W003",
    count: 10,
  },
  {
    code: "W004",
    count: 1020,
  },
  {
    code: "W005",
    count: 0,
  },
  {
    code: "W006",
    count: 18,
  },
  {
    code: "W007",
    count: 8,
  },
  {
    code: "W008",
    count: 3,
  },
  {
    code: "W009",
    count: 0,
  },
  {
    code: "W010",
    count: 0,
  },
  {
    code: "W011",
    count: 10,
  },
  {
    code: "W012",
    count: 5369,
  },
  {
    code: "W013",
    count: 333,
  },
];

// 신고 내역 목록 데이터
export const reported_campaign_list: ReportedCampaignItem[] = [
  {
    id: "1",
    campaign_number: "000456",
    campaign_name:
      "푸러블 고농축 캡슐세제 플라워향, 1개, 110개입, 푸러블 고농축 캡슐세제 플라워향, 1개, 110개입, 푸러블 고농축 캡슐세제 플라워향, 1개, 110개입,",
    report_code: "W001",
    report_reason: "선정 후 취소",
    inspector: "(주)청명종합광고기획",
    target: "홍길동",
    processed_date: "2025-08-01 18:56",
    report_count: 1,
  },
  {
    id: "2",
    campaign_number: "000041",
    campaign_name: "어쩌구 미션",
    report_code: "W002",
    report_reason: "지각 제출",
    inspector: "관리자 A",
    target: "일이삼사오육칠팔구십",
    processed_date: "2025-08-01 18:56",
    report_count: 3,
  },
  {
    id: "3",
    campaign_number: "000451",
    campaign_name:
      "일이삼사오육칠팔구십일이삼사오육일이삼사오육칠팔구십일이삼사오육일이삼사오육칠팔구십일이삼사오육일이삼사오육칠팔구십일이삼사오육",
    report_code: "W003",
    report_reason: "무단 이탈 · 노쇼",
    inspector: "AI 자동 탐지",
    target: "일이삼사오육칠팔구십",
    processed_date: "2025-08-01 18:56",
    report_count: 1,
  },
  {
    id: "4",
    campaign_number: "008914",
    campaign_name: "어쩌구 미션",
    report_code: "W004",
    report_reason: "노출 기간 불이행",
    inspector: "AI 자동 탐지",
    target: "일이삼사오육칠팔구십",
    processed_date: "2025-08-01 18:59",
    report_count: 1,
  },
  {
    id: "5",
    campaign_number: "000001",
    campaign_name: "어쩌구 미션",
    report_code: "W005",
    report_reason: "수정 요청 불이행",
    inspector: "일이삼사오육칠팔구십일이삼사오육",
    target: "일이삼사오육칠팔구십일이삼사오",
    processed_date: "2025-08-28 18:56",
    report_count: 1,
  },
  {
    id: "6",
    campaign_number: "000001",
    campaign_name:
      "일이삼사오육칠팔구십일이삼사오육일이삼사오육칠팔구십일이삼사오육일이삼사오육칠팔구십일이삼사오육일이삼사오육칠팔구십일이삼사오육",
    report_code: "W006",
    report_reason: "게시 후 취소",
    inspector: "네이버 주식회사",
    target: "(주)아이엠에스커뮤니케이션",
    processed_date: "2024-02-01 18:56",
    report_count: 1,
  },
  {
    id: "7",
    campaign_number: "000001",
    campaign_name: "어쩌구 미션",
    report_code: "W007",
    report_reason: "부적절한 캠페인 게시",
    inspector: "관리자 A",
    target: "(주)아이엠에스커뮤니케이션",
    processed_date: "2025-08-01 18:56",
    report_count: 1,
  },
  {
    id: "8",
    campaign_number: "000001",
    campaign_name: "어쩌구 미션",
    report_code: "W008",
    report_reason: "공정위 위반 요청",
    inspector: "주식회사 청명미디어",
    target: "(주)아이엠에스커뮤니케이션",
    processed_date: "2025-08-01 18:56",
    report_count: 1,
  },
  {
    id: "9",
    campaign_number: "000001",
    campaign_name: "어쩌구 미션",
    report_code: "W009",
    report_reason: "비정상 요청 반복",
    inspector: "관리자 F",
    target: "(주)아이엠에스커뮤니케이션",
    processed_date: "2025-08-01 18:56",
    report_count: 1,
  },
  {
    id: "10",
    campaign_number: "000001",
    campaign_name: "어쩌구 미션",
    report_code: "W010",
    report_reason: "중복 계정 탐지",
    inspector: "관리자 A",
    target: "(주)아이엠에스커뮤니케이션",
    processed_date: "2025-08-01 18:56",
    report_count: 1,
  },
  {
    id: "11",
    campaign_number: "000001",
    campaign_name: "어쩌구 미션",
    report_code: "W011",
    report_reason: "콘텐츠 중복 탐지",
    inspector: "관리자 A",
    target: "(주)아이엠에스커뮤니케이션",
    processed_date: "2025-08-01 18:56",
    report_count: 1,
  },
];
