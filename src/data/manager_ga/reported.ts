/* ========================================
   GA 관리자 신고내역 데이터
   ======================================== */

/**
 * GA 관리자 신고내역 목업 데이터
 *
 * 목적: GA 관리자 신고내역 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/reported (신고내역 페이지)
 *
 */

// 공통 필터 옵션에서 import
import type { ReportCode } from "@/data/manager_ga/common/filterOptions";

// 타입 재export (기존 코드와의 호환성을 위해)
export type { ReportCode };

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
  target_user_id?: number; // 대상자 유저 ID (차단/해제 API용)
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

// localStorage 키
const STORAGE_KEY_REMOVED_REPORTED_IDS = "reported_campaign_removed_ids";

// localStorage에서 제거된 ID 로드 함수
function load_removed_ids_from_storage(): Set<string> {
  if (typeof window === "undefined") {
    return new Set();
  }

  try {
    const stored_removed = localStorage.getItem(STORAGE_KEY_REMOVED_REPORTED_IDS);
    const removed_ids_array: string[] = stored_removed ? JSON.parse(stored_removed) : [];
    return new Set(removed_ids_array);
  } catch (_error) {
    return new Set();
  }
}

// localStorage에 제거된 ID 저장 함수
function save_removed_ids_to_storage(removed_ids: Set<string>): void {
  if (typeof window === "undefined") return;

  try {
    const removed_ids_array = Array.from(removed_ids);
    localStorage.setItem(STORAGE_KEY_REMOVED_REPORTED_IDS, JSON.stringify(removed_ids_array));
  } catch (_error) {}
}

// 제거된 신고 내역 ID를 저장하는 Set
let removed_reported_campaign_ids: Set<string> = new Set();

// 클라이언트에서만 localStorage에서 데이터 로드 (SSR Hydration 오류 방지)
let is_reported_storage_loaded = false;
function ensure_reported_storage_loaded(): void {
  if (typeof window === "undefined" || is_reported_storage_loaded) return;

  removed_reported_campaign_ids = load_removed_ids_from_storage();
  is_reported_storage_loaded = true;
}

// 신고 내역 제거 함수
export function remove_reported_campaign(item_id: string): void {
  removed_reported_campaign_ids.add(item_id);
  save_removed_ids_to_storage(removed_reported_campaign_ids);
}

// localStorage 키 (추가된 신고 내역)
const STORAGE_KEY_ADDITIONAL_REPORTED_ITEMS = "reported_campaign_additional_items";

// localStorage에서 추가된 신고 내역 로드 함수
function load_additional_items_from_storage(): ReportedCampaignItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored_additional = localStorage.getItem(STORAGE_KEY_ADDITIONAL_REPORTED_ITEMS);
    const additional_items: ReportedCampaignItem[] = stored_additional
      ? JSON.parse(stored_additional)
      : [];
    return additional_items;
  } catch (_error) {
    return [];
  }
}

// localStorage에 추가된 신고 내역 저장 함수
function save_additional_items_to_storage(additional_items: ReportedCampaignItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY_ADDITIONAL_REPORTED_ITEMS, JSON.stringify(additional_items));
  } catch (_error) {}
}

// 동적으로 추가된 신고 내역 항목을 저장하는 배열
let additional_reported_campaign_items: ReportedCampaignItem[] = [];

// 클라이언트에서만 localStorage에서 데이터 로드 (SSR Hydration 오류 방지)
let is_additional_reported_storage_loaded = false;
function ensure_additional_reported_storage_loaded(): void {
  if (typeof window === "undefined" || is_additional_reported_storage_loaded) return;

  additional_reported_campaign_items = load_additional_items_from_storage();
  is_additional_reported_storage_loaded = true;
}

// 신고 내역 추가 함수 (저장 전 기존 localStorage 로드하여 덮어쓰기 방지)
export function add_reported_campaign(item: ReportedCampaignItem): void {
  if (typeof window === "undefined") return;
  ensure_additional_reported_storage_loaded();
  additional_reported_campaign_items.push(item);
  save_additional_items_to_storage(additional_reported_campaign_items);
}

// 신고 내역 목록 데이터 가져오기 함수 (제거된 항목 필터링, 추가된 항목 포함)
export function get_reported_campaign_list(): ReportedCampaignItem[] {
  // 클라이언트에서만 localStorage에서 데이터 로드 (SSR Hydration 오류 방지)
  ensure_reported_storage_loaded();
  ensure_additional_reported_storage_loaded();

  // 제거된 항목을 제외한 기본 목록
  const filtered_base_list = reported_campaign_list.filter(
    (item) => !removed_reported_campaign_ids.has(item.id)
  );

  // 추가된 항목 (제거되지 않은 것만)
  const filtered_additional_items = additional_reported_campaign_items.filter(
    (item) => !removed_reported_campaign_ids.has(item.id)
  );

  // FIXED: Mock data FIRST, then localStorage data (기본 목록 + 추가된 항목)
  // Mock data should always be displayed first, localStorage data appended after
  const all_data = [...filtered_base_list, ...filtered_additional_items];

  // 처리일 기준 내림차순 정렬 (최신순)
  return all_data.sort((a, b) => {
    const date_a = new Date(a.processed_date.replace(" ", "T"));
    const date_b = new Date(b.processed_date.replace(" ", "T"));
    return date_b.getTime() - date_a.getTime(); // 내림차순 (최신순)
  });
}

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
    processed_date: "2026-03-01 18:56",
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
    processed_date: "2026-03-01 18:56",
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
    processed_date: "2026-03-01 18:56",
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
    processed_date: "2026-03-02 18:59",
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
    processed_date: "2026-03-03 18:56",
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
    processed_date: "2026-03-04 18:56",
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
    processed_date: "2026-03-01 18:56",
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
    processed_date: "2026-03-01 18:56",
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
    processed_date: "2026-03-01 18:56",
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
    processed_date: "2026-03-01 18:56",
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
    processed_date: "2026-03-01 18:56",
    report_count: 1,
  },
  {
    id: "12",
    campaign_number: "000300",
    campaign_name: "프리미엄 뷰티 세트 체험 캠페인",
    report_code: "W001",
    report_reason: "선정 후 무단 취소",
    inspector: "AI 자동 탐지",
    target: "김민지",
    processed_date: "2026-03-05 09:15",
    report_count: 1,
  },
  {
    id: "13",
    campaign_number: "000301",
    campaign_name: "홈데코 아이템 리뷰 캠페인",
    report_code: "W002",
    report_reason: "제출 기한을 초과하여 제출했습니다",
    inspector: "(주)마케팅프로",
    target: "이수진",
    processed_date: "2026-03-06 14:30",
    report_count: 2,
  },
  {
    id: "14",
    campaign_number: "000302",
    campaign_name: "식품 체험단 모집",
    report_code: "W003",
    report_reason: "약속된 일정에 무단 이탈했습니다",
    inspector: "AI 자동 탐지",
    target: "박준호",
    processed_date: "2026-03-07 11:20",
    report_count: 1,
  },
  {
    id: "15",
    campaign_number: "000303",
    campaign_name: "패션 아이템 스타일링 캠페인",
    report_code: "W004",
    report_reason: "노출 기간을 준수하지 않았습니다",
    inspector: "(주)콘텐츠리뷰",
    target: "최영희",
    processed_date: "2026-03-08 16:45",
    report_count: 1,
  },
  {
    id: "16",
    campaign_number: "000304",
    campaign_name: "전자제품 사용 후기",
    report_code: "W005",
    report_reason: "수정 요청을 반복적으로 무시했습니다",
    inspector: "네이버 주식회사",
    target: "정민수",
    processed_date: "2026-03-09 10:10",
    report_count: 3,
  },
  {
    id: "17",
    campaign_number: "000305",
    campaign_name: "뷰티 제품 체험 후기 캠페인",
    report_code: "W006",
    report_reason: "게시 후 일방적으로 취소했습니다",
    inspector: "주식회사 아이엠에스커뮤니케이션",
    target: "강지영",
    processed_date: "2026-03-10 13:25",
    report_count: 1,
  },
  {
    id: "18",
    campaign_number: "000306",
    campaign_name: "생활용품 리뷰 캠페인",
    report_code: "W007",
    report_reason: "부적절한 콘텐츠로 게시했습니다",
    inspector: "(주)청명종합광고기획",
    target: "윤서연",
    processed_date: "2026-03-11 15:50",
    report_count: 1,
  },
  {
    id: "19",
    campaign_number: "000307",
    campaign_name: "인테리어 소품 체험단",
    report_code: "W008",
    report_reason: "공정거래위원회 위반 요청을 했습니다",
    inspector: "AI 자동 탐지",
    target: "장미래",
    processed_date: "2026-03-12 09:40",
    report_count: 1,
  },
  {
    id: "20",
    campaign_number: "000308",
    campaign_name: "건강식품 체험 후기",
    report_code: "W009",
    report_reason: "비정상적인 요청이 반복적으로 발생했습니다",
    inspector: "(주)마케팅프로",
    target: "오준호",
    processed_date: "2026-03-13 12:15",
    report_count: 2,
  },
  {
    id: "21",
    campaign_number: "000309",
    campaign_name: "뷰티 브랜드 신제품 리뷰",
    report_code: "W010",
    report_reason: "중복 계정 사용이 탐지되었습니다",
    inspector: "(주)콘텐츠리뷰",
    target: "한소희",
    processed_date: "2026-03-14 14:30",
    report_count: 1,
  },
  {
    id: "22",
    campaign_number: "000310",
    campaign_name: "패션 액세서리 스타일링",
    report_code: "W011",
    report_reason: "콘텐츠 중복 사용이 확인되었습니다",
    inspector: "네이버 주식회사",
    target: "신동욱",
    processed_date: "2026-03-15 10:55",
    report_count: 1,
  },
  {
    id: "23",
    campaign_number: "000311",
    campaign_name: "식품 체험 후기 캠페인",
    report_code: "W012",
    report_reason: "비정상적인 접근 패턴이 기록되었습니다",
    inspector: "AI 자동 탐지",
    target: "조은지",
    processed_date: "2026-03-16 16:20",
    report_count: 1,
  },
  {
    id: "24",
    campaign_number: "000312",
    campaign_name: "홈케어 제품 리뷰",
    report_code: "W013",
    report_reason:
      "비매너 행위가 확인되었습니다가나닫런ㄹ아ㅓㄹㄴ이너라앙런ㅇ리ㅏㄴㅇ러ㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅓㅇㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹㄴㄹ",
    inspector: "주식회사 아이엠에스커뮤니케이션",
    target: "배성민",
    processed_date: "2026-03-17 11:35",
    report_count: 1,
  },
  {
    id: "25",
    campaign_number: "000313",
    campaign_name: "전자제품 사용기 캠페인",
    report_code: "W001",
    report_reason: "",
    inspector: "(주)청명종합광고기획",
    target: "류현우",
    processed_date: "2026-03-18 13:10",
    report_count: 1,
  },
  {
    id: "26",
    campaign_number: "000314",
    campaign_name: "뷰티 제품 체험단",
    report_code: "W002",
    report_reason: "",
    inspector: "AI 자동 탐지",
    target: "임태영",
    processed_date: "2026-03-19 09:25",
    report_count: 2,
  },
  {
    id: "27",
    campaign_number: "000315",
    campaign_name: "인테리어 소품 스타일링",
    report_code: "W003",
    report_reason: "",
    inspector: "(주)마케팅프로",
    target: "송하늘",
    processed_date: "2026-03-20 15:40",
    report_count: 1,
  },
  {
    id: "28",
    campaign_number: "000316",
    campaign_name: "생활용품 체험 후기",
    report_code: "W004",
    report_reason: "",
    inspector: "(주)콘텐츠리뷰",
    target: "문지훈",
    processed_date: "2026-03-21 10:50",
    report_count: 1,
  },
  {
    id: "29",
    campaign_number: "000317",
    campaign_name: "패션 아이템 리뷰 캠페인",
    report_code: "W005",
    report_reason: "",
    inspector: "네이버 주식회사",
    target: "양지은",
    processed_date: "2026-03-22 14:15",
    report_count: 1,
  },
  {
    id: "30",
    campaign_number: "000318",
    campaign_name: "건강식품 체험단 모집",
    report_code: "W006",
    report_reason: "",
    inspector: "AI 자동 탐지",
    target: "노승현",
    processed_date: "2026-03-23 11:30",
    report_count: 1,
  },
  {
    id: "31",
    campaign_number: "000319",
    campaign_name: "뷰티 브랜드 신제품 리뷰",
    report_code: "W007",
    report_reason: "",
    inspector: "주식회사 아이엠에스커뮤니케이션",
    target: "도현수",
    processed_date: "2026-03-24 16:45",
    report_count: 1,
  },
  {
    id: "32",
    campaign_number: "000320",
    campaign_name: "전자제품 사용 후기 캠페인",
    report_code: "W008",
    report_reason: "",
    inspector: "(주)청명종합광고기획",
    target: "구민재",
    processed_date: "2026-03-25 09:20",
    report_count: 1,
  },
  {
    id: "33",
    campaign_number: "000321",
    campaign_name: "홈데코 아이템 체험단",
    report_code: "W009",
    report_reason: "",
    inspector: "(주)마케팅프로",
    target: "남지호",
    processed_date: "2026-03-26 13:55",
    report_count: 1,
  },
  {
    id: "34",
    campaign_number: "000322",
    campaign_name: "식품 리뷰 캠페인",
    report_code: "W010",
    report_reason: "",
    inspector: "AI 자동 탐지",
    target: "백준영",
    processed_date: "2026-03-27 10:10",
    report_count: 1,
  },
  {
    id: "35",
    campaign_number: "000323",
    campaign_name: "뷰티 제품 스타일링",
    report_code: "W011",
    report_reason: "",
    inspector: "(주)콘텐츠리뷰",
    target: "서유진",
    processed_date: "2026-03-28 15:25",
    report_count: 1,
  },
  {
    id: "36",
    campaign_number: "000324",
    campaign_name: "패션 액세서리 체험 후기",
    report_code: "W012",
    report_reason: "",
    inspector: "네이버 주식회사",
    target: "유재석",
    processed_date: "2026-03-29 12:40",
    report_count: 1,
  },
  {
    id: "37",
    campaign_number: "000325",
    campaign_name: "인테리어 소품 리뷰 캠페인",
    report_code: "W013",
    report_reason:
      "타인에 대한 모욕적인 발언 및 비매너 행위가 확인되었습니다타인에 대한 모욕적인 발언 및 비매너 행위가 확인되었습니다타인에 대한 모욕적인 발언 및 비매너 행위가 확인되었습니다타인에 대한 모욕적인 발언 및 비매너 행위가 확인되었습니다타인에 대한 모욕적인 발언 및 비매너 행위가 확인되었습니다타인에 대한 모욕적인 발언 및 비매너 행위가 확인되었습니다",
    inspector: "주식회사 아이엠에스커뮤니케이션",
    target: "강동원",
    processed_date: "2026-03-01 14:50",
    report_count: 1,
  },
  {
    id: "38",
    campaign_number: "000326",
    campaign_name: "생활용품 사용기",
    report_code: "W001",
    report_reason: "",
    inspector: "(주)청명종합광고기획",
    target: "이병헌",
    processed_date: "2026-03-02 11:15",
    report_count: 2,
  },
  {
    id: "39",
    campaign_number: "000327",
    campaign_name: "뷰티 제품 체험 후기",
    report_code: "W002",
    report_reason: "",
    inspector: "AI 자동 탐지",
    target: "김태희",
    processed_date: "2026-03-03 09:30",
    report_count: 1,
  },
  {
    id: "40",
    campaign_number: "000328",
    campaign_name: "전자제품 리뷰 캠페인",
    report_code: "W003",
    report_reason: "",
    inspector: "(주)마케팅프로",
    target: "전지현",
    processed_date: "2026-03-04 16:20",
    report_count: 1,
  },
  {
    id: "41",
    campaign_number: "000329",
    campaign_name: "홈케어 제품 체험단",
    report_code: "W004",
    report_reason: "",
    inspector: "(주)콘텐츠리뷰",
    target: "송혜교",
    processed_date: "2026-03-05 13:45",
    report_count: 1,
  },
  {
    id: "42",
    campaign_number: "000330",
    campaign_name: "프리미엄 스킨케어 세트 체험",
    report_code: "W013",
    report_reason: "부적절한 언어 사용 및 비매너 행위가 확인되었습니다",
    inspector: "AI 자동 탐지",
    target: "이영희",
    processed_date: "2026-03-06 10:20",
    report_count: 1,
  },
  {
    id: "43",
    campaign_number: "000331",
    campaign_name: "스포츠웨어 리뷰 캠페인",
    report_code: "W013",
    report_reason: "타인에 대한 비방 및 비매너 행위",
    inspector: "(주)마케팅프로",
    target: "박민수",
    processed_date: "2026-03-07 14:35",
    report_count: 2,
  },
  {
    id: "44",
    campaign_number: "000332",
    campaign_name: "건강식품 체험 후기",
    report_code: "W013",
    report_reason: "부적절한 행동 및 커뮤니티 규칙 위반으로 인한 신고",
    inspector: "네이버 주식회사",
    target: "최지영",
    processed_date: "2026-03-08 09:15",
    report_count: 1,
  },
  {
    id: "45",
    campaign_number: "000333",
    campaign_name: "뷰티 제품 신제품 리뷰",
    report_code: "W013",
    report_reason: "욕설 및 비방 댓글 작성으로 인한 신고",
    inspector: "주식회사 아이엠에스커뮤니케이션",
    target: "김수진",
    processed_date: "2026-03-09 16:50",
    report_count: 3,
  },
];
