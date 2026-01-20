/* ========================================
   👤 SA 관리자 관리자 목록 목업 데이터
   ======================================== */

/**
 * SA 관리자 관리자 목록 목업 데이터
 *
 * 목적: SA 관리자 관리자 목록 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/admins (관리자 목록 페이지)
 *
 * 주요 기능:
 * - 관리자 목록 데이터
 *
 */

// SA 관리자 전용 필터 옵션에서 import
import type { AdminStatus } from "@/data/manager_sa/common/filterOptions";

// 타입 재export (기존 코드와의 호환성을 위해)
export type { AdminStatus };

// 관리자 아이템 타입 정의
export interface AdminItem {
  id: string; // 관리자 ID
  number: string; // 번호 (예: 000025)
  name: string; // 이름
  phone: string; // 휴대폰 번호 (예: 010-1234-5678)
  report_count: number; // 신고 횟수
  block_count: number; // 차단 횟수
  last_access_date: string; // 접속일 (예: 2025-08-01 18:56)
  join_date: string; // 가입일 (예: 2025-08-01 18:56)
  status: AdminStatus; // 상태 (정상/일시 정지/영구 정지)
}

// 관리자 목록 데이터 (초기 목업 데이터)
export const admin_list: AdminItem[] = [
  {
    id: "admin0001",
    number: "000025",
    name: "오은영",
    phone: "010-1234-5678",
    report_count: 1521,
    block_count: 1521,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "일시 정지",
  },
  {
    id: "admin0002",
    number: "000024",
    name: "김은지",
    phone: "010-2345-6789",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "일시 정지",
  },
  {
    id: "admin0003",
    number: "000023",
    name: "홍길동",
    phone: "010-3456-7890",
    report_count: 569,
    block_count: 560,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "일시 정지",
  },
  {
    id: "admin0004",
    number: "000022",
    name: "유연희",
    phone: "010-4567-8901",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "일시 정지",
  },
  {
    id: "admin0005",
    number: "000021",
    name: "김히어라",
    phone: "010-5678-9012",
    report_count: 5,
    block_count: 5,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "admin0006",
    number: "000020",
    name: "일이삼사오육칠팔구십",
    phone: "010-6789-0123",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "영구 정지",
  },
  {
    id: "admin0007",
    number: "000019",
    name: "이은",
    phone: "010-7890-1234",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "admin0008",
    number: "000018",
    name: "김휘수",
    phone: "010-8901-2345",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "admin0009",
    number: "000017",
    name: "황보선혜",
    phone: "010-9012-3456",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "admin0010",
    number: "000016",
    name: "장세희",
    phone: "010-0123-4567",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "admin0011",
    number: "000015",
    name: "김은빛",
    phone: "010-1111-2222",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "admin0012",
    number: "000014",
    name: "김도토리",
    phone: "010-2222-3333",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "admin0013",
    number: "000013",
    name: "박요셉",
    phone: "010-3333-4444",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "admin0014",
    number: "000012",
    name: "황에스더",
    phone: "010-4444-5555",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "admin0015",
    number: "000011",
    name: "조로이스",
    phone: "010-5555-6666",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
];

/* ========================================
   💾 localStorage 관리자 데이터 관리 함수
   ======================================== */

/**
 * localStorage에 저장할 관리자 데이터의 키
 * localStorage는 브라우저에 데이터를 저장하는 저장소입니다
 * 키-값 쌍으로 데이터를 저장하며, 페이지를 새로고침해도 데이터가 유지됩니다
 */
const STORAGE_KEY = "reviewx_admin_list";

/* ========================================
   🔄 localStorage 관리자 데이터 마이그레이션
   ======================================== */

/**
 * localStorage에 저장된 관리자 목록을 현재 스키마에 맞게 보정(마이그레이션)합니다.
 *
 * 문제 상황:
 * - 예전에 id가 "1", "2" 같은 숫자였는데, 지금은 "admin0001" 같은 8~16자 영문+숫자 아이디를 사용합니다.
 * - localStorage에 옛 데이터가 남아있으면 수정 페이지(/admins/[id]/edit)에서 매칭이 안 되거나,
 *   중복 체크가 의도와 다르게 동작할 수 있습니다.
 *
 * 처리 내용:
 * - id가 숫자만 있는 경우 → "admin" + 4자리 패딩으로 변환 (예: "2" → "admin0002")
 * - phone이 없는 경우 → 빈 문자열로 채움
 *
 * @param raw_list - localStorage에서 읽어온 원본 데이터
 * @returns 마이그레이션된 관리자 목록
 */
function migrate_admin_list(raw_list: any): AdminItem[] {
  // 배열이 아니면 기본 목업 데이터 반환
  if (!Array.isArray(raw_list)) {
    return admin_list;
  }

  /**
   * 중복 key 오류(React key 중복) 방지:
   * - 숫자 id "15" → "admin0015" 로 변환될 때,
   *   이미 "admin0015"가 존재하면 중복 id가 생길 수 있습니다.
   *
   * 해결:
   * - 동일 migrated_id가 2개 이상 생기면 "기존에 이미 admin 형태로 저장된 데이터"를 우선합니다.
   * - 그 외에는 먼저 나온 데이터를 유지합니다.
   */
  const by_id = new Map<string, { item: AdminItem; is_numeric_source: boolean }>();

  for (const raw_item of raw_list) {
    const raw_id = String(raw_item?.id ?? "");
    const is_numeric_id = /^[0-9]+$/.test(raw_id);

    // 숫자 id → admin0001 형태로 변환
    const migrated_id = is_numeric_id
      ? `admin${raw_id.padStart(4, "0")}`
      : raw_id;

    const normalized_item: AdminItem = {
      ...raw_item,
      id: migrated_id,
      phone: typeof raw_item?.phone === "string" ? raw_item.phone : "",
    } as AdminItem;

    const existing = by_id.get(migrated_id);

    // 최초 등록
    if (!existing) {
      by_id.set(migrated_id, { item: normalized_item, is_numeric_source: is_numeric_id });
      continue;
    }

    // 중복 발생: admin 형태(비숫자 source) 데이터를 우선
    if (existing.is_numeric_source && !is_numeric_id) {
      by_id.set(migrated_id, { item: normalized_item, is_numeric_source: false });
    }
    // 그 외(이미 비숫자 source가 있거나, 둘 다 숫자/둘 다 비숫자)면 기존 유지
  }

  return Array.from(by_id.values()).map((v) => v.item);
}

/**
 * 관리자 목록을 localStorage에서 가져오는 함수
 *
 * @returns {AdminItem[]} localStorage에 저장된 관리자 목록 (없으면 초기 목업 데이터 반환)
 *
 * React 학습 포인트:
 * - localStorage.getItem(): localStorage에서 데이터를 가져오는 메서드입니다
 * - JSON.parse(): JSON 문자열을 JavaScript 객체로 변환합니다
 * - typeof window === "undefined": Next.js SSR 환경 체크 (서버 사이드에서는 window 객체가 없음)
 */
export function get_admin_list_from_storage(): AdminItem[] {
  // Next.js SSR 환경 체크 (서버 사이드에서는 localStorage를 사용할 수 없음)
  if (typeof window === "undefined") {
    return admin_list;
  }

  try {
    // localStorage에서 데이터 가져오기
    const stored_data = localStorage.getItem(STORAGE_KEY);

    // 저장된 데이터가 없으면 초기 목업 데이터 반환
    if (!stored_data) {
      // 초기 데이터를 localStorage에 저장
      save_admin_list_to_storage(admin_list);
      return admin_list;
    }

    // JSON 문자열을 JavaScript 객체 배열로 변환
    const parsed_data = JSON.parse(stored_data);

    // 예전 localStorage 데이터(숫자 id 등) 마이그레이션
    const migrated_data = migrate_admin_list(parsed_data);

    // 마이그레이션 결과를 다시 localStorage에 저장 (항상 최신 스키마 유지)
    save_admin_list_to_storage(migrated_data);

    return migrated_data;
  } catch (error) {
    // 에러 발생 시 초기 목업 데이터 반환
    console.error("관리자 목록을 가져오는 중 오류 발생:", error);
    return admin_list;
  }
}

/**
 * 관리자 목록을 localStorage에 저장하는 함수
 *
 * @param {AdminItem[]} admin_list_data - 저장할 관리자 목록 데이터
 *
 * React 학습 포인트:
 * - localStorage.setItem(): localStorage에 데이터를 저장하는 메서드입니다
 * - JSON.stringify(): JavaScript 객체를 JSON 문자열로 변환합니다
 */
export function save_admin_list_to_storage(admin_list_data: AdminItem[]): void {
  // Next.js SSR 환경 체크
  if (typeof window === "undefined") {
    return;
  }

  try {
    // JavaScript 객체 배열을 JSON 문자열로 변환하여 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(admin_list_data));
  } catch (error) {
    console.error("관리자 목록을 저장하는 중 오류 발생:", error);
  }
}

/**
 * 새로운 관리자를 추가하는 함수
 *
 * @param {Omit<AdminItem, "id" | "number" | "join_date" | "report_count" | "block_count" | "last_access_date" | "status">} admin_data - 추가할 관리자 데이터 (id, number, join_date 등은 자동 생성)
 * @returns {AdminItem} 생성된 관리자 데이터
 *
 * React 학습 포인트:
 * - Omit: TypeScript 유틸리티 타입으로, 특정 속성을 제외한 타입을 만듭니다
 * - Date 객체: JavaScript의 날짜/시간을 다루는 객체입니다
 * - format 함수: date-fns 라이브러리의 함수로 날짜를 원하는 형식으로 포맷팅합니다
 */
export function add_admin(
  admin_data: Omit<
    AdminItem,
    | "number"
    | "join_date"
    | "report_count"
    | "block_count"
    | "last_access_date"
    | "status"
  >
): AdminItem {
  // 현재 저장된 관리자 목록 가져오기
  const current_list = get_admin_list_from_storage();

  // 사용자가 입력한 아이디를 사용 (admin_data.id)
  const new_id = admin_data.id;

  // 새로운 관리자 번호 생성 (기존 번호 중 가장 큰 값 + 1, 6자리로 포맷팅)
  const max_number = Math.max(
    ...current_list.map((admin) => parseInt(admin.number) || 0),
    0
  );
  const new_number = String(max_number + 1).padStart(6, "0");

  // 현재 날짜/시간 생성
  const current_date = new Date();
  const formatted_date = `${current_date.getFullYear()}-${String(
    current_date.getMonth() + 1
  ).padStart(2, "0")}-${String(current_date.getDate()).padStart(2, "0")} ${String(
    current_date.getHours()
  ).padStart(2, "0")}:${String(current_date.getMinutes()).padStart(2, "0")}`;

  // 새로운 관리자 객체 생성
  const new_admin: AdminItem = {
    id: new_id,
    number: new_number,
    name: admin_data.name,
    phone: admin_data.phone || "", // 휴대폰 번호 저장
    report_count: 0,
    block_count: 0,
    last_access_date: formatted_date,
    join_date: formatted_date,
    status: "정상",
  };

  // 관리자 목록에 추가
  const updated_list = [...current_list, new_admin];

  // localStorage에 저장
  save_admin_list_to_storage(updated_list);

  return new_admin;
}

/**
 * 관리자 정보를 수정하는 함수
 *
 * @param {string} admin_id - 수정할 관리자 ID
 * @param {Partial<Omit<AdminItem, "id" | "number" | "join_date" | "report_count" | "block_count">>} update_data - 수정할 데이터 (일부 필드만 수정 가능)
 * @returns {AdminItem | null} 수정된 관리자 데이터 (없으면 null)
 *
 * React 학습 포인트:
 * - Partial: TypeScript 유틸리티 타입으로, 모든 속성을 선택적(optional)으로 만듭니다
 * - map 메서드: 배열의 각 요소를 변환하여 새로운 배열을 만듭니다
 * - 스프레드 연산자(...): 객체나 배열을 복사하거나 병합할 때 사용합니다
 */
export function update_admin(
  admin_id: string,
  update_data: Partial<
    Omit<
      AdminItem,
      | "id"
      | "number"
      | "join_date"
      | "report_count"
      | "block_count"
      | "last_access_date"
    >
  >
): AdminItem | null {
  // 현재 저장된 관리자 목록 가져오기
  const current_list = get_admin_list_from_storage();

  // 수정할 관리자 찾기
  const admin_index = current_list.findIndex((admin) => admin.id === admin_id);

  // 관리자를 찾지 못한 경우
  if (admin_index === -1) {
    return null;
  }

  // 관리자 정보 업데이트 (기존 데이터에 수정할 데이터를 병합)
  const updated_admin: AdminItem = {
    ...current_list[admin_index],
    ...update_data,
  };

  // 관리자 목록 업데이트
  const updated_list = current_list.map((admin, index) =>
    index === admin_index ? updated_admin : admin
  );

  // localStorage에 저장
  save_admin_list_to_storage(updated_list);

  return updated_admin;
}

/**
 * 관리자 상태를 업데이트하는 함수 (이용제한 등)
 *
 * @param {string} admin_id - 상태를 변경할 관리자 ID
 * @param {AdminStatus} new_status - 새로운 상태 (정상/일시 정지/영구 정지)
 * @returns {AdminItem | null} 업데이트된 관리자 데이터 (없으면 null)
 */
export function update_admin_status(
  admin_id: string,
  new_status: AdminStatus
): AdminItem | null {
  return update_admin(admin_id, { status: new_status });
}

/**
 * 관리자를 삭제하는 함수
 *
 * @param {string} admin_id - 삭제할 관리자 ID
 * @returns {boolean} 삭제 성공 여부
 *
 * React 학습 포인트:
 * - filter 메서드: 배열에서 조건에 맞는 요소만 남기는 새로운 배열을 만듭니다
 */
export function delete_admin(admin_id: string): boolean {
  // 현재 저장된 관리자 목록 가져오기
  const current_list = get_admin_list_from_storage();

  // 삭제할 관리자가 있는지 확인
  const admin_exists = current_list.some((admin) => admin.id === admin_id);

  if (!admin_exists) {
    return false;
  }

  // 관리자 목록에서 해당 관리자 제거
  const updated_list = current_list.filter((admin) => admin.id !== admin_id);

  // localStorage에 저장
  save_admin_list_to_storage(updated_list);

  return true;
}

/**
 * 여러 관리자를 한 번에 삭제하는 함수
 *
 * @param {string[]} admin_ids - 삭제할 관리자 ID 배열
 * @returns {number} 삭제된 관리자 수
 *
 * React 학습 포인트:
 * - filter 메서드: 배열에서 조건에 맞는 요소만 남기는 새로운 배열을 만듭니다
 * - some 메서드: 배열에 조건에 맞는 요소가 하나라도 있으면 true를 반환합니다
 */
export function delete_multiple_admins(admin_ids: string[]): number {
  // 현재 저장된 관리자 목록 가져오기
  const current_list = get_admin_list_from_storage();

  // 삭제할 관리자 ID들을 Set으로 변환하여 빠른 조회 가능하게 함
  // Set: 중복을 제거하고 빠른 조회가 가능한 자료구조입니다
  const ids_to_delete = new Set(admin_ids);

  // 관리자 목록에서 삭제할 관리자들을 제외한 목록 생성
  const updated_list = current_list.filter(
    (admin) => !ids_to_delete.has(admin.id)
  );

  // 삭제된 관리자 수 계산
  const deleted_count = current_list.length - updated_list.length;

  // localStorage에 저장
  save_admin_list_to_storage(updated_list);

  return deleted_count;
}
