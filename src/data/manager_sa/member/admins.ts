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
  report_count: number; // 신고 횟수
  block_count: number; // 차단 횟수
  last_access_date: string; // 접속일 (예: 2025-08-01 18:56)
  join_date: string; // 가입일 (예: 2025-08-01 18:56)
  status: AdminStatus; // 상태 (정상/일시 정지/영구 정지)
}

// 관리자 목록 데이터
export const admin_list: AdminItem[] = [
  {
    id: "1",
    number: "000025",
    name: "오은영",
    report_count: 1521,
    block_count: 1521,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "일시 정지",
  },
  {
    id: "2",
    number: "000024",
    name: "김은지",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "일시 정지",
  },
  {
    id: "3",
    number: "000023",
    name: "홍길동",
    report_count: 569,
    block_count: 560,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "일시 정지",
  },
  {
    id: "4",
    number: "000022",
    name: "유연희",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "일시 정지",
  },
  {
    id: "5",
    number: "000021",
    name: "김히어라",
    report_count: 5,
    block_count: 5,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "6",
    number: "000020",
    name: "일이삼사오육칠팔구십",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "영구 정지",
  },
  {
    id: "7",
    number: "000019",
    name: "이은",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "8",
    number: "000018",
    name: "김휘수",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "9",
    number: "000017",
    name: "황보선혜",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "10",
    number: "000016",
    name: "장세희",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "11",
    number: "000015",
    name: "김은빛",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "12",
    number: "000014",
    name: "김도토리",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "13",
    number: "000013",
    name: "박요셉",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "14",
    number: "000012",
    name: "황에스더",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
  {
    id: "15",
    number: "000011",
    name: "조로이스",
    report_count: 1,
    block_count: 1,
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
    status: "정상",
  },
];
