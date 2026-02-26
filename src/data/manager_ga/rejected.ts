/* ========================================
   GA 관리자 반려내역 데이터
   ======================================== */

/**
 * GA 관리자 반려내역 목업 데이터
 *
 * 목적: GA 관리자 반려내역 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/rejected (반려내역 페이지)
 *
 */

// 공통 필터 옵션에서 import
import type { RejectCode } from "@/data/manager_ga/common/filterOptions";

// 타입 재export (기존 코드와의 호환성을 위해)
export type { RejectCode };

// 반려 코드 카테고리 타입 정의
export type RejectCategory = "콘텐츠" | "리뷰어/파트너" | "캠페인" | "정산" | "기타";

// 반려 코드 안내 데이터 타입
export interface RejectCodeInfo {
  code: RejectCode; // 반려 코드 (예: R001)
  category: RejectCategory; // 카테고리 (예: 콘텐츠)
  reason: string; // 반려 사유 (예: 구매 정보 불일치)
}

// 반려 내역 통계 데이터 타입
export interface RejectStatsItem {
  code: RejectCode; // 반려 코드
  count: number; // 반려 횟수
}

// 반려 내역 목록 아이템 타입
export interface RejectedCampaignItem {
  id: string; // 반려 내역 ID
  campaign_number: string; // 캠페인 번호
  campaign_name: string; // 캠페인명
  reject_code: RejectCode; // 반려 코드
  reject_reason: string; // 반려 사유 (상세)
  inspector: string; // 검수자
  target: string; // 대상자
  processed_date: string; // 처리일 (예: 2025-08-01 18:56)
  reject_count: number; // 반려 횟수
}

// 반려 코드 안내 데이터
// 각 반려 코드의 카테고리와 사유를 정의합니다
export const reject_code_info: RejectCodeInfo[] = [
  {
    code: "R001",
    category: "콘텐츠",
    reason: "구매 정보 불일치",
  },
  {
    code: "R002",
    category: "콘텐츠",
    reason: "가이드 불이행",
  },
  {
    code: "R003",
    category: "콘텐츠",
    reason: "콘텐츠 오류",
  },
  {
    code: "R004",
    category: "콘텐츠",
    reason: "이미지 도용 의심",
  },
  {
    code: "R005",
    category: "리뷰어/파트너",
    reason: "반복 반려 의심",
  },
  {
    code: "R006",
    category: "캠페인",
    reason: "부적절한 콘텐츠 요청",
  },
  {
    code: "R007",
    category: "정산",
    reason: "출금 정보 불일치",
  },
  {
    code: "R008",
    category: "기타",
    reason: "그외 비매너 행위",
  },
];

// 반려 내역 통계 데이터
// 각 반려 코드별 반려 횟수를 집계한 데이터입니다
export const reject_stats: RejectStatsItem[] = [
  {
    code: "R001",
    count: 3,
  },
  {
    code: "R002",
    count: 3,
  },
  {
    code: "R003",
    count: 3,
  },
  {
    code: "R004",
    count: 3,
  },
  {
    code: "R005",
    count: 3,
  },
  {
    code: "R006",
    count: 19999,
  },
  {
    code: "R007",
    count: 100,
  },
  {
    code: "R008",
    count: 1100,
  },
];

// 반려 내역 목록 데이터
export const rejected_campaign_list: RejectedCampaignItem[] = [
  {
    id: "1",
    campaign_number: "000160",
    campaign_name:
      "푸러블 고농축 캡슐세제 플라워향, 1개, 110개입, 푸러블 고농축 캡슐세제 플라워향, 1개, 110개입, 푸러블 고농축 캡슐세제 플라워향, 1개, 110개입,",
    reject_code: "R001",
    reject_reason:
      "푸러블 고농축 캡슐세제 플라워향, 1개, 110개입, 푸러블 고농축 캡슐세제 플라워향, 1개, 110개입",
    inspector: "(주)청명종합광고기획",
    target: "홍길동",
    processed_date: "2026-02-01 14:23",
    reject_count: 1,
  },
  {
    id: "2",
    campaign_number: "000159",
    campaign_name:
      "어쩌구 미션일잉삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십",
    reject_code: "R002",
    reject_reason: "",
    inspector: "AI 자동 탐지",
    target: "일이삼사오육칠팔구십",
    processed_date: "2026-02-02 09:45",
    reject_count: 3,
  },
  {
    id: "3",
    campaign_number: "000099",
    campaign_name: "어쩌구 미션",
    reject_code: "R003",
    reject_reason: "",
    inspector: "AI 자동 탐지",
    target: "일이삼사오육칠팔구십",
    processed_date: "2026-02-03 16:12",
    reject_count: 7,
  },
  {
    id: "4",
    campaign_number: "000068",
    campaign_name: "어쩌구 미션",
    reject_code: "R004",
    reject_reason: "",
    inspector: "AI 자동 탐지",
    target: "일이삼사오육칠팔구십",
    processed_date: "2026-02-04 11:30",
    reject_count: 5,
  },
  {
    id: "5",
    campaign_number: "000062",
    campaign_name: "어쩌구 미션",
    reject_code: "R005",
    reject_reason: "",
    inspector: "일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육",
    target: "일이삼사오육칠팔구십일이삼사오",
    processed_date: "2026-02-05 13:55",
    reject_count: 3,
  },
  {
    id: "6",
    campaign_number: "000031",
    campaign_name: "어쩌구 미션",
    reject_code: "R006",
    reject_reason: "",
    inspector: "주식회사 아이엠에스커뮤니케이션",
    target: "(주)아이엠에스커뮤니케이션",
    processed_date: "2026-02-06 10:18",
    reject_count: 1,
  },
  {
    id: "7",
    campaign_number: "000016",
    campaign_name: "어쩌구 미션",
    reject_code: "R007",
    reject_reason: "",
    inspector: "네이버 주식회사",
    target: "(주)아이엠에스커뮤니케이션",
    processed_date: "2026-02-07 15:42",
    reject_count: 1,
  },
  {
    id: "8",
    campaign_number: "000005",
    campaign_name:
      "어쩌구 미션 어쩌구 미션 어쩌구 미션 어쩌구 미션 어쩌구 미션 어쩌구 미션 어쩌구 미션 어쩌구 미션 어쩌구 미션 어쩌구 미션 어쩌구 미션 어쩌구 미션",
    reject_code: "R007",
    reject_reason: "",
    inspector: "주식회사 청명미디어",
    target: "(주)아이엠에스커뮤니케이션",
    processed_date: "2026-02-08 08:30",
    reject_count: 1,
  },
  {
    id: "9",
    campaign_number: "000015",
    campaign_name: "어쩌구 미션",
    reject_code: "R007",
    reject_reason: "",
    inspector: "(주)청명종합광고기획",
    target: "(주)아이엠에스커뮤니케이션",
    processed_date: "2026-02-09 17:25",
    reject_count: 1,
  },
  {
    id: "10",
    campaign_number: "000200",
    campaign_name: "신제품 런칭 캠페인 - 프리미엄 세트",
    reject_code: "R001",
    reject_reason: "구매 영수증의 상품명과 캠페인 상품명이 일치하지 않습니다",
    inspector: "AI 자동 탐지",
    target: "김철수",
    processed_date: "2026-02-10 10:15",
    reject_count: 2,
  },
  {
    id: "11",
    campaign_number: "000201",
    campaign_name: "뷰티 제품 체험 후기 캠페인",
    reject_code: "R002",
    reject_reason: "가이드라인에 명시된 필수 사항을 누락했습니다",
    inspector: "(주)마케팅프로",
    target: "이영희",
    processed_date: "2026-02-11 14:32",
    reject_count: 1,
  },
  {
    id: "12",
    campaign_number: "000202",
    campaign_name: "홈데코 아이템 리뷰",
    reject_code: "R003",
    reject_reason: "",
    inspector: "AI 자동 탐지",
    target: "박민수",
    processed_date: "2026-02-12 09:20",
    reject_count: 3,
  },
  {
    id: "13",
    campaign_number: "000203",
    campaign_name: "식품 체험단 모집 캠페인",
    reject_code: "R004",
    reject_reason: "제공된 이미지가 타인의 작품과 유사도가 높습니다",
    inspector: "(주)콘텐츠리뷰",
    target: "최지영",
    processed_date: "2026-02-13 16:45",
    reject_count: 1,
  },
  {
    id: "14",
    campaign_number: "000204",
    campaign_name: "패션 아이템 스타일링 캠페인",
    reject_code: "R005",
    reject_reason: "동일한 패턴의 반려가 반복적으로 발생했습니다",
    inspector: "네이버 주식회사",
    target: "정수진",
    processed_date: "2026-02-14 11:30",
    reject_count: 5,
  },
  {
    id: "15",
    campaign_number: "000205",
    campaign_name: "전자제품 사용 후기",
    reject_code: "R006",
    reject_reason: "",
    inspector: "주식회사 아이엠에스커뮤니케이션",
    target: "강호영",
    processed_date: "2026-02-15 13:15",
    reject_count: 1,
  },
  {
    id: "16",
    campaign_number: "000206",
    campaign_name: "생활용품 리뷰 캠페인",
    reject_code: "R008",
    reject_reason: "부적절한 언어 사용 및 비매너 행위가 확인되었습니다",
    inspector: "(주)청명종합광고기획",
    target: "윤서연",
    processed_date: "2026-02-16 15:50",
    reject_count: 2,
  },
  {
    id: "17",
    campaign_number: "000207",
    campaign_name: "건강식품 체험단 모집",
    reject_code: "R001",
    reject_reason: "",
    inspector: "AI 자동 탐지",
    target: "장미래",
    processed_date: "2026-02-17 10:25",
    reject_count: 1,
  },
  {
    id: "18",
    campaign_number: "000208",
    campaign_name: "인테리어 소품 리뷰",
    reject_code: "R002",
    reject_reason: "필수 해시태그 및 링크가 누락되었습니다",
    inspector: "(주)마케팅프로",
    target: "오준호",
    processed_date: "2026-02-18 14:10",
    reject_count: 1,
  },
  {
    id: "19",
    campaign_number: "000209",
    campaign_name: "뷰티 브랜드 신제품 체험",
    reject_code: "R003",
    reject_reason: "",
    inspector: "AI 자동 탐지",
    target: "한소희",
    processed_date: "2026-02-19 09:40",
    reject_count: 2,
  },
  {
    id: "20",
    campaign_number: "000210",
    campaign_name: "패션 액세서리 스타일링",
    reject_code: "R004",
    reject_reason: "",
    inspector: "(주)콘텐츠리뷰",
    target: "신동욱",
    processed_date: "2026-02-20 16:20",
    reject_count: 1,
  },
  {
    id: "21",
    campaign_number: "000211",
    campaign_name: "식품 체험 후기 캠페인",
    reject_code: "R007",
    reject_reason: "출금 계좌 정보가 등록된 정보와 일치하지 않습니다",
    inspector: "네이버 주식회사",
    target: "조은지",
    processed_date: "2026-02-21 11:55",
    reject_count: 1,
  },
  {
    id: "22",
    campaign_number: "000212",
    campaign_name: "홈케어 제품 리뷰",
    reject_code: "R005",
    reject_reason: "",
    inspector: "주식회사 아이엠에스커뮤니케이션",
    target: "배성민",
    processed_date: "2026-02-22 13:30",
    reject_count: 4,
  },
  {
    id: "23",
    campaign_number: "000213",
    campaign_name: "전자제품 사용기 캠페인",
    reject_code: "R006",
    reject_reason: "",
    inspector: "(주)청명종합광고기획",
    target: "류현우",
    processed_date: "2026-02-23 10:05",
    reject_count: 1,
  },
  {
    id: "24",
    campaign_number: "000214",
    campaign_name: "뷰티 제품 체험단",
    reject_code: "R008",
    reject_reason: "",
    inspector: "AI 자동 탐지",
    target: "임태영",
    processed_date: "2026-02-24 15:25",
    reject_count: 1,
  },
  {
    id: "25",
    campaign_number: "000215",
    campaign_name: "인테리어 소품 스타일링",
    reject_code: "R001",
    reject_reason: "구매 정보가 캠페인 가이드와 일치하지 않습니다",
    inspector: "(주)마케팅프로",
    target: "송하늘",
    processed_date: "2026-02-25 12:40",
    reject_count: 1,
  },
  {
    id: "26",
    campaign_number: "000216",
    campaign_name: "생활용품 체험 후기",
    reject_code: "R002",
    reject_reason: "",
    inspector: "(주)콘텐츠리뷰",
    target: "문지훈",
    processed_date: "2026-02-26 09:15",
    reject_count: 2,
  },
  {
    id: "27",
    campaign_number: "000217",
    campaign_name: "패션 아이템 리뷰 캠페인",
    reject_code: "R003",
    reject_reason: "",
    inspector: "네이버 주식회사",
    target: "양지은",
    processed_date: "2026-02-27 14:50",
    reject_count: 1,
  },
  {
    id: "28",
    campaign_number: "000218",
    campaign_name: "건강식품 체험단 모집",
    reject_code: "R004",
    reject_reason: "",
    inspector: "AI 자동 탐지",
    target: "노승현",
    processed_date: "2026-02-28 11:20",
    reject_count: 1,
  },
  {
    id: "29",
    campaign_number: "000219",
    campaign_name: "뷰티 브랜드 신제품 리뷰",
    reject_code: "R007",
    reject_reason: "",
    inspector: "주식회사 아이엠에스커뮤니케이션",
    target: "도현수",
    processed_date: "2026-02-29 16:35",
    reject_count: 1,
  },
  {
    id: "30",
    campaign_number: "000220",
    campaign_name: "전자제품 사용 후기 캠페인",
    reject_code: "R008",
    reject_reason: "",
    inspector: "(주)청명종합광고기획",
    target: "구민재",
    processed_date: "2026-02-01 10:45",
    reject_count: 1,
  },
  {
    id: "31",
    campaign_number: "000221",
    campaign_name: "홈데코 아이템 체험단",
    reject_code: "R001",
    reject_reason: "",
    inspector: "(주)마케팅프로",
    target: "남지호",
    processed_date: "2026-02-02 13:10",
    reject_count: 1,
  },
  {
    id: "32",
    campaign_number: "000222",
    campaign_name: "식품 리뷰 캠페인",
    reject_code: "R005",
    reject_reason: "",
    inspector: "AI 자동 탐지",
    target: "백준영",
    processed_date: "2026-02-03 15:20",
    reject_count: 3,
  },
  {
    id: "33",
    campaign_number: "000223",
    campaign_name: "뷰티 제품 스타일링",
    reject_code: "R006",
    reject_reason: "",
    inspector: "(주)콘텐츠리뷰",
    target: "서유진",
    processed_date: "2026-02-04 09:30",
    reject_count: 1,
  },
  {
    id: "34",
    campaign_number: "000224",
    campaign_name: "패션 액세서리 체험 후기",
    reject_code: "R007",
    reject_reason: "",
    inspector: "네이버 주식회사",
    target: "유재석",
    processed_date: "2026-02-05 12:55",
    reject_count: 1,
  },
  {
    id: "35",
    campaign_number: "000225",
    campaign_name: "인테리어 소품 리뷰 캠페인",
    reject_code: "R002",
    reject_reason: "",
    inspector: "주식회사 아이엠에스커뮤니케이션",
    target: "강동원",
    processed_date: "2026-02-06 14:15",
    reject_count: 1,
  },
  {
    id: "36",
    campaign_number: "000226",
    campaign_name: "생활용품 사용기",
    reject_code: "R003",
    reject_reason: "",
    inspector: "(주)청명종합광고기획",
    target: "이병헌",
    processed_date: "2026-02-07 11:40",
    reject_count: 2,
  },
];

// ========================================
// localStorage를 통한 반려 내역 제거 관리
// ========================================

// localStorage 키
const STORAGE_KEY_REMOVED_REJECTED_IDS = "rejected_campaign_removed_ids";

// localStorage에서 제거된 반려 내역 ID 로드 함수
function load_removed_ids_from_storage(): Set<string> {
  if (typeof window === "undefined") {
    return new Set();
  }
  try {
    const stored_removed = localStorage.getItem(STORAGE_KEY_REMOVED_REJECTED_IDS);
    const removed_ids_array: string[] = stored_removed ? JSON.parse(stored_removed) : [];
    return new Set(removed_ids_array);
  } catch (_error) {
    return new Set();
  }
}

// localStorage에 제거된 반려 내역 ID 저장 함수
function save_removed_ids_to_storage(removed_ids: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    const removed_ids_array = Array.from(removed_ids);
    localStorage.setItem(STORAGE_KEY_REMOVED_REJECTED_IDS, JSON.stringify(removed_ids_array));
  } catch (_error) {}
}

// 제거된 반려 내역 ID를 저장하는 Set
let removed_rejected_campaign_ids: Set<string> = new Set();
let is_rejected_storage_loaded = false;

// 클라이언트에서만 localStorage에서 데이터 로드 (SSR Hydration 오류 방지)
function ensure_rejected_storage_loaded(): void {
  if (typeof window === "undefined" || is_rejected_storage_loaded) return;
  removed_rejected_campaign_ids = load_removed_ids_from_storage();
  is_rejected_storage_loaded = true;
}

// 반려 내역 제거 함수 (신고로 인해 반려 내역에서 제거됨)
export function remove_rejected_campaign(item_id: string): void {
  ensure_rejected_storage_loaded(); // Ensure loaded before modifying
  removed_rejected_campaign_ids.add(item_id);
  save_removed_ids_to_storage(removed_rejected_campaign_ids);
}

// 반려 내역 목록 데이터 가져오기 함수 (제거된 항목 필터링)
export function get_rejected_campaign_list(): RejectedCampaignItem[] {
  ensure_rejected_storage_loaded(); // Ensure loaded before filtering
  return rejected_campaign_list.filter((item) => !removed_rejected_campaign_ids.has(item.id));
}

// localStorage 초기화 함수 (개발/디버깅용)
export function reset_rejected_campaign_storage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_REMOVED_REJECTED_IDS);
    removed_rejected_campaign_ids = new Set();
    is_rejected_storage_loaded = false;
  } catch (_error) {}
}
