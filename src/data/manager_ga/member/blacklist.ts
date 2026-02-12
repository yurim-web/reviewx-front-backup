/* ========================================
   🚫 이용제한 내역 목업 데이터
   ======================================== */

/**
 * 이용제한 내역 목업 데이터
 *
 * 목적: 이용제한 내역 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/blacklist (이용제한 내역 페이지)
 *
 * 주요 기능:
 * - 이용제한 내역 목록 데이터
 * - 파트너, 리뷰어, 관리자의 이용 제한 항목을 표시
 * - 구분(division)을 "파트너", "리뷰어", "관리자"로 설정
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
  // 해제할 항목 찾기 (user_id와 division을 확인하여 이전 상태 복원)
  const item_to_remove = [
    ...additional_blacklist_items,
    ...blacklist_data,
  ].find((item) => item.id === item_id);

  // 추가된 항목에서 제거
  additional_blacklist_items = additional_blacklist_items.filter(
    (item) => item.id !== item_id
  );
  // 제거된 항목 ID를 Set에 추가 (기본 데이터에서도 필터링하기 위해)
  removed_blacklist_item_ids.add(item_id);
  // localStorage에 저장
  save_to_storage(additional_blacklist_items, removed_blacklist_item_ids);

  // 리뷰어 또는 파트너의 status_type을 이전 상태로 복원
  // 동적 import를 사용하여 순환 참조 방지
  if (item_to_remove) {
    if (item_to_remove.division === "리뷰어") {
      // 리뷰어 상태 복원 함수 import 및 호출
      import("@/data/manager_ga/member/reviewers").then((module) => {
        // 타입 단언을 사용하여 함수 존재 여부 확인
        if ("restore_reviewer_status_type" in module) {
          (module as any).restore_reviewer_status_type(item_to_remove.user_id);
        }
      });
    } else if (item_to_remove.division === "파트너") {
      // 파트너 상태 복원 함수 import 및 호출
      import("@/data/manager_ga/member/partners").then((module) => {
        // 타입 단언을 사용하여 함수 존재 여부 확인
        if ("restore_partner_status_type" in module) {
          (module as any).restore_partner_status_type(item_to_remove.user_id);
        }
      });
    }
  }

  // 실제 구현 시에는 서버 API를 통해 관리해야 합니다
}

// 블랙리스트 데이터 가져오기 함수 (기본 데이터 + 추가된 데이터)
// FIXED: Mock data FIRST, then localStorage data
// Mock data should always be displayed, localStorage data appended after
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

  // FIXED: Mock data FIRST, then localStorage data (기본 데이터 + 추가된 데이터)
  const all_data = [...filtered_base_data, ...filtered_additional_data];

  // 등록일 기준 내림차순 정렬 (최신순)
  // registered_date 형식: "yyyy-MM-dd HH:mm"
  return all_data.sort((a, b) => {
    const date_a = new Date(a.registered_date.replace(" ", "T"));
    const date_b = new Date(b.registered_date.replace(" ", "T"));
    return date_b.getTime() - date_a.getTime(); // 내림차순 (최신순)
  });
}

// 차단 내역 목록 데이터
// 파트너와 리뷰어 목록에서 "이용 제한 회원"인 항목을 BlacklistItem 형식으로 변환한 데이터
export const blacklist_data: BlacklistItem[] = [
  // 파트너: 주식회사 청명종합광고기획 (id: "1")
  {
    id: "partner_1",
    name: "주식회사 청명종합광고기획",
    user_id: "1",
    division: "파트너",
    current_points: 0,
    ip_address: "123.123.12.3",
    block_code: "B002",
    block_reason: "무단 이탈 · 노쇼 누적",
    registered_date: "2026-02-01 10:20",
    registered_by: "시스템",
  },
  // 파트너: 청불 천막집 방이점 (id: "2")
  {
    id: "partner_2",
    name: "청불 천막집 방이점",
    user_id: "2",
    division: "파트너",
    current_points: 0,
    ip_address: "158.176.19.2",
    block_code: "B002",
    block_reason: "무단 이탈 · 노쇼 누적",
    registered_date: "2026-02-02 11:15",
    registered_by: "시스템",
  },
  // 파트너: 명륜진사갈비 수원광교점 (id: "3")
  {
    id: "partner_3",
    name: "명륜진사갈비 수원광교점",
    user_id: "3",
    division: "파트너",
    current_points: 100000,
    ip_address: "789.789.78.9",
    block_code: "B002",
    block_reason: "무단 이탈 · 노쇼 누적",
    registered_date: "2026-02-03 14:30",
    registered_by: "시스템",
  },
  // 파트너: (주)플레티어 (id: "5")
  {
    id: "partner_5",
    name: "(주)플레티어",
    user_id: "5",
    division: "파트너",
    current_points: 0,
    ip_address: "345.345.34.5",
    block_code: "B005",
    block_reason: "비정상 운영 행위",
    registered_date: "2026-02-04 09:30",
    registered_by: "시스템",
  },
  // 파트너: 탈퇴회원테스트1 (id: "16")
  {
    id: "partner_16",
    name: "탈퇴회원테스트1",
    user_id: "16",
    division: "파트너",
    current_points: 0,
    ip_address: "456.456.45.6",
    block_code: "B001",
    block_reason: "반복 반려 누적",
    registered_date: "2026-02-05 10:00",
    registered_by: "시스템",
  },
  // 파트너: 탈퇴회원테스트2 (id: "17")
  {
    id: "partner_17",
    name: "탈퇴회원테스트2",
    user_id: "17",
    division: "파트너",
    current_points: 0,
    ip_address: "567.567.56.7",
    block_code: "B001",
    block_reason: "반복 반려 누적",
    registered_date: "2026-02-06 11:30",
    registered_by: "시스템",
  },
  // 리뷰어: 김은지 (id: "2")
  {
    id: "reviewer_2",
    name: "김은지",
    user_id: "2",
    division: "리뷰어",
    current_points: 1500000,
    ip_address: "234.234.23.4",
    block_code: "B002",
    block_reason: "무단 이탈 · 노쇼 누적",
    registered_date: "2026-02-07 18:56",
    registered_by: "시스템",
  },
  // 리뷰어: 홍길동 (id: "3")
  {
    id: "reviewer_3",
    name: "홍길동",
    user_id: "3",
    division: "리뷰어",
    current_points: 999999999,
    ip_address: "345.345.34.5",
    block_code: "B002",
    block_reason: "무단 이탈 · 노쇼 누적",
    registered_date: "2026-02-07 18:56",
    registered_by: "시스템",
  },
  // 리뷰어: 유연희 (id: "4")
  {
    id: "reviewer_4",
    name: "유연희",
    user_id: "4",
    division: "리뷰어",
    current_points: 1500000,
    ip_address: "456.456.45.6",
    block_code: "B005",
    block_reason: "비정상 운영 행위",
    registered_date: "2026-02-07 18:56",
    registered_by: "시스템",
  },
  // 리뷰어: 탈퇴회원테스트 (id: "17")
  {
    id: "reviewer_17",
    name: "탈퇴회원테스트",
    user_id: "17",
    division: "리뷰어",
    current_points: 0,
    ip_address: "567.567.56.7",
    block_code: "B001",
    block_reason: "반복 반려 누적",
    registered_date: "2026-02-08 14:20",
    registered_by: "시스템",
  },
  // 관리자: 관리자 테스트 (id: "admin_1")
  {
    id: "admin_1",
    name: "관리자 테스트",
    user_id: "admin_1",
    division: "관리자",
    current_points: 0,
    ip_address: "192.168.1.1",
    block_code: "B004",
    block_reason: "커뮤니티 가이드 위반",
    registered_date: "2026-02-09 15:30",
    registered_by: "시스템",
  },
];
