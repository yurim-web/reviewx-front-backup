/* ========================================
   🚫 GA 관리자 차단 내역 목업 데이터
   ======================================== */

/**
 * GA 관리자 차단 내역 목업 데이터
 *
 * 목적: GA 관리자 차단 내역 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/blacklist (차단 내역 페이지)
 *
 * 주요 기능:
 * - 차단 내역 목록 데이터
 *
 */

// 공통 필터 옵션에서 import (타입만 사용, 재export는 하지 않음)
import type {
  BlacklistDivision,
  BlockCode,
} from "@/data/manager_ga/common/filterOptions";

// 차단 사유 타입 정의
export type BlockReason =
  | "반복 반려 누적"
  | "무단 이탈 · 노쇼 누적"
  | "콘텐츠 중복 · 도용"
  | "커뮤니티 가이드 위반"
  | "비정상 운영 행위"
  | "부적절 캠페인 게시"
  | "외부 결제 · 금전 요구"
  | "검수 조작"
  | "공정위 위반 게시 요청";

// 차단 내역 아이템 타입 정의
export interface BlacklistItem {
  id: string; // 차단 내역 ID
  name: string; // 이름/상호명
  user_id: string; // 아이디
  division: BlacklistDivision; // 구분 (파트너/리뷰어/관리자)
  current_points: number; // 보유 포인트
  ip_address: string; // 아이피
  block_code: BlockCode; // 차단 코드
  block_reason: BlockReason; // 차단 사유
  registered_date: string; // 등록일 (예: 2025-08-01 18:56)
  registered_by: string; // 등록자 (예: 시스템, 관리자 A, admin 등)
}

// 차단 코드와 차단 사유 매핑
export const block_code_reason_map: Record<BlockCode, BlockReason> = {
  B001: "반복 반려 누적",
  B002: "무단 이탈 · 노쇼 누적",
  B003: "콘텐츠 중복 · 도용",
  B004: "커뮤니티 가이드 위반",
  B005: "비정상 운영 행위",
  B006: "부적절 캠페인 게시",
  B007: "외부 결제 · 금전 요구",
  B008: "검수 조작",
  B009: "공정위 위반 게시 요청",
  B010: "반복 반려 누적", // 예시로 중복 사용
};

// localStorage 키
const STORAGE_KEY_ADDITIONAL_ITEMS = "blacklist_additional_items";
const STORAGE_KEY_REMOVED_IDS = "blacklist_removed_ids";

// localStorage에서 데이터 로드 함수
function load_from_storage(): {
  additional_items: BlacklistItem[];
  removed_ids: Set<string>;
} {
  if (typeof window === "undefined") {
    // 서버 사이드에서는 빈 데이터 반환
    return { additional_items: [], removed_ids: new Set() };
  }

  try {
    // 추가된 항목 로드
    const stored_additional = localStorage.getItem(
      STORAGE_KEY_ADDITIONAL_ITEMS
    );
    const additional_items: BlacklistItem[] = stored_additional
      ? JSON.parse(stored_additional)
      : [];

    // 제거된 ID 로드
    const stored_removed = localStorage.getItem(STORAGE_KEY_REMOVED_IDS);
    const removed_ids_array: string[] = stored_removed
      ? JSON.parse(stored_removed)
      : [];
    const removed_ids = new Set(removed_ids_array);

    return { additional_items, removed_ids };
  } catch (error) {
    console.error("localStorage에서 블랙리스트 데이터 로드 실패:", error);
    return { additional_items: [], removed_ids: new Set() };
  }
}

// localStorage에 데이터 저장 함수
function save_to_storage(
  additional_items: BlacklistItem[],
  removed_ids: Set<string>
): void {
  if (typeof window === "undefined") return;

  try {
    // 추가된 항목 저장
    localStorage.setItem(
      STORAGE_KEY_ADDITIONAL_ITEMS,
      JSON.stringify(additional_items)
    );

    // 제거된 ID 저장
    const removed_ids_array = Array.from(removed_ids);
    localStorage.setItem(
      STORAGE_KEY_REMOVED_IDS,
      JSON.stringify(removed_ids_array)
    );
  } catch (error) {
    console.error("localStorage에 블랙리스트 데이터 저장 실패:", error);
  }
}

// 동적으로 추가된 블랙리스트 항목을 저장하는 배열
// 실제 구현 시에는 서버 API를 통해 관리해야 합니다
let additional_blacklist_items: BlacklistItem[] = [];

// 제거된 블랙리스트 항목 ID를 저장하는 Set
// 기본 데이터와 추가된 데이터 모두에서 제거된 항목을 추적
let removed_blacklist_item_ids: Set<string> = new Set();

// 클라이언트에서만 localStorage에서 데이터 로드 (SSR Hydration 오류 방지)
let is_storage_loaded = false;
function ensure_storage_loaded(): void {
  if (typeof window === "undefined" || is_storage_loaded) return;

  const { additional_items, removed_ids } = load_from_storage();
  additional_blacklist_items = additional_items;
  removed_blacklist_item_ids = removed_ids;
  is_storage_loaded = true;
}

// 블랙리스트 항목 추가 함수
export function add_blacklist_item(item: BlacklistItem): void {
  additional_blacklist_items.push(item);
  // 추가된 항목이 제거 목록에 있다면 제거 목록에서도 삭제
  removed_blacklist_item_ids.delete(item.id);
  // localStorage에 저장
  save_to_storage(additional_blacklist_items, removed_blacklist_item_ids);
}

// 블랙리스트 항목 제거 함수
export function remove_blacklist_item(item_id: string): void {
  // 추가된 항목에서 제거
  additional_blacklist_items = additional_blacklist_items.filter(
    (item) => item.id !== item_id
  );
  // 제거된 항목 ID를 Set에 추가 (기본 데이터에서도 필터링하기 위해)
  removed_blacklist_item_ids.add(item_id);
  // localStorage에 저장
  save_to_storage(additional_blacklist_items, removed_blacklist_item_ids);
  // 실제 구현 시에는 서버 API를 통해 관리해야 합니다
}

// 블랙리스트 데이터 가져오기 함수 (추가된 데이터 + 기본 데이터)
// 최신순으로 정렬하기 위해 추가된 항목을 앞에 배치
// 등록일 기준으로 내림차순 정렬하여 최신 항목이 맨 위에 오도록 함
export function get_blacklist_data(): BlacklistItem[] {
  // 클라이언트에서만 localStorage에서 데이터 로드 (SSR Hydration 오류 방지)
  ensure_storage_loaded();

  // 제거된 항목을 제외한 기본 데이터
  const filtered_base_data = blacklist_data.filter(
    (item) => !removed_blacklist_item_ids.has(item.id)
  );

  // 제거된 항목을 제외한 추가 데이터
  const filtered_additional_data = additional_blacklist_items.filter(
    (item) => !removed_blacklist_item_ids.has(item.id)
  );

  const all_data = [...filtered_additional_data, ...filtered_base_data];

  // 등록일 기준 내림차순 정렬 (최신순)
  // registered_date 형식: "yyyy-MM-dd HH:mm"
  return all_data.sort((a, b) => {
    const date_a = new Date(a.registered_date.replace(" ", "T"));
    const date_b = new Date(b.registered_date.replace(" ", "T"));
    return date_b.getTime() - date_a.getTime(); // 내림차순 (최신순)
  });
}

// 차단 내역 목록 데이터
export const blacklist_data: BlacklistItem[] = [
  // 2025년 11월 (3개)
  {
    id: "1",
    name: "주식회사 재밌는걸참좋아하고하고싶은거하는노신사456455ㄴㅇㄹㄴㄹㅇㄴㄹㅇㅇ",
    user_id: "nodjfj12",
    division: "파트너",
    current_points: 115000,
    ip_address: "123.123.12.3",
    block_code: "B001",
    block_reason: "반복 반려 누적",
    registered_date: "2026-01-01 14:23",
    registered_by: "시스템",
  },
  {
    id: "2",
    name: "그리디센트",
    user_id: "gredicent_flowershop",
    division: "파트너",
    current_points: 0,
    ip_address: "158.176.19.2",
    block_code: "B002",
    block_reason: "무단 이탈 · 노쇼 누적",
    registered_date: "2026-01-02 09:45",
    registered_by: "시스템",
  },
  {
    id: "3",
    name: "홍길동",
    user_id: "gdhong12345678910",
    division: "리뷰어",
    current_points: 12000,
    ip_address: "456.456.45.6",
    block_code: "B003",
    block_reason: "콘텐츠 중복 · 도용",
    registered_date: "2026-01-03 16:12",
    registered_by: "관리자 A",
  },
  // 2025년 12월 (5개)
  {
    id: "4",
    name: "에이바헤어 모래내시장역점",
    user_id: "sillyfunction",
    division: "파트너",
    current_points: 0,
    ip_address: "789.789.78.9",
    block_code: "B004",
    block_reason: "커뮤니티 가이드 위반",
    registered_date: "2026-01-04 11:30",
    registered_by: "관리자 C",
  },
  {
    id: "5",
    name: "김유성",
    user_id: "dongoddmgo234kdfo123",
    division: "관리자",
    current_points: 0,
    ip_address: "345.345.34.5",
    block_code: "B005",
    block_reason: "비정상 운영 행위",
    registered_date: "2026-01-05 15:42",
    registered_by: "admin",
  },
  {
    id: "6",
    name: "에이바헤어 모래내시장역점",
    user_id: "sillyfunction",
    division: "리뷰어",
    current_points: 0,
    ip_address: "789.789.78.9",
    block_code: "B006",
    block_reason: "부적절 캠페인 게시",
    registered_date: "2026-01-06 13:55",
    registered_by: "관리자 C",
  },
  {
    id: "7",
    name: "에이바헤어 모래내시장역점",
    user_id: "sillyfunction@hanmail.net",
    division: "파트너",
    current_points: 0,
    ip_address: "789.789.78.9",
    block_code: "B007",
    block_reason: "외부 결제 · 금전 요구",
    registered_date: "2026-01-07 10:18",
    registered_by: "관리자 C",
  },
  {
    id: "8",
    name: "김유성",
    user_id: "dsfsdafasdfdasfdasfa@naver.com",
    division: "리뷰어",
    current_points: 999999999,
    ip_address: "345.345.34.5",
    block_code: "B008",
    block_reason: "검수 조작",
    registered_date: "2026-01-08 17:25",
    registered_by: "시스템",
  },
  // 2026년 1월 (8개 - 가장 많음)
  {
    id: "9",
    name: "에이바헤어 모래내시장역점",
    user_id: "sillyfunction",
    division: "파트너",
    current_points: 800123,
    ip_address: "789.789.78.9",
    block_code: "B009",
    block_reason: "공정위 위반 게시 요청",
    registered_date: "2026-01-09 09:15",
    registered_by: "관리자 B",
  },
  {
    id: "10",
    name: "김유성",
    user_id: "mintdevelop0001@kakao.com",
    division: "리뷰어",
    current_points: 0,
    ip_address: "345.345.34.5",
    block_code: "B007",
    block_reason: "외부 결제 · 금전 요구",
    registered_date: "2026-01-10 14:32",
    registered_by: "관리자 C",
  },
  {
    id: "11",
    name: "에이바헤어 모래내시장역점",
    user_id: "sillyfunction",
    division: "파트너",
    current_points: 0,
    ip_address: "789.789.78.9",
    block_code: "B005",
    block_reason: "비정상 운영 행위",
    registered_date: "2026-01-11 11:20",
    registered_by: "관리자 C",
  },
  {
    id: "12",
    name: "에이바헤어 모래내시장역점",
    user_id: "sillyfunction",
    division: "파트너",
    current_points: 0,
    ip_address: "789.789.78.9",
    block_code: "B003",
    block_reason: "콘텐츠 중복 · 도용",
    registered_date: "2026-01-12 16:45",
    registered_by: "관리자 C",
  },
  {
    id: "13",
    name: "라움태닝 송파점",
    user_id: "songpa_raum",
    division: "리뷰어",
    current_points: 0,
    ip_address: "647.158.26.3",
    block_code: "B002",
    block_reason: "무단 이탈 · 노쇼 누적",
    registered_date: "2026-01-12 10:30",
    registered_by: "관리자 C",
  },
  {
    id: "14",
    name: "라움태닝 송파점",
    user_id: "songpa_raum",
    division: "파트너",
    current_points: 10258312,
    ip_address: "647.158.26.3",
    block_code: "B002",
    block_reason: "무단 이탈 · 노쇼 누적",
    registered_date: "2026-01-12 13:15",
    registered_by: "관리자 C",
  },
  {
    id: "15",
    name: "그리디센트",
    user_id: "verificationcheck0@nate.com",
    division: "파트너",
    current_points: 0,
    ip_address: "158.176.19.2",
    block_code: "B010",
    block_reason: "반복 반려 누적",
    registered_date: "2026-01-12 15:50",
    registered_by: "관리자 C",
  },
  {
    id: "16",
    name: "홍길동",
    user_id: "dsfsdafasdfdasfdasfa@hanmail.net",
    division: "파트너",
    current_points: 12000,
    ip_address: "456.456.45.6",
    block_code: "B001",
    block_reason: "반복 반려 누적",
    registered_date: "2026-01-13 09:40",
    registered_by: "관리자 C",
  },
];
