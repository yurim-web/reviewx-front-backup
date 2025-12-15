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

// 공통 필터 옵션에서 import
import type { BlacklistDivision, BlockCode } from '@/data/manager_ga/common/filterOptions';

// 타입 재export (기존 코드와의 호환성을 위해)
export type { BlacklistDivision, BlockCode };

// 차단 사유 타입 정의
export type BlockReason =
  | '반복 반려 누적'
  | '무단 이탈 · 노쇼 누적'
  | '콘텐츠 중복 · 도용'
  | '커뮤니티 가이드 위반'
  | '비정상 운영 행위'
  | '부적절 캠페인 게시'
  | '외부 결제 · 금전 요구'
  | '검수 조작'
  | '공정위 위반 게시 요청';

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
  B001: '반복 반려 누적',
  B002: '무단 이탈 · 노쇼 누적',
  B003: '콘텐츠 중복 · 도용',
  B004: '커뮤니티 가이드 위반',
  B005: '비정상 운영 행위',
  B006: '부적절 캠페인 게시',
  B007: '외부 결제 · 금전 요구',
  B008: '검수 조작',
  B009: '공정위 위반 게시 요청',
  B010: '반복 반려 누적', // 예시로 중복 사용
};

// 차단 내역 목록 데이터
export const blacklist_data: BlacklistItem[] = [
  {
    id: '1',
    name: '주식회사 재밌는걸참좋아하고하고싶은거하는노신사456455ㄴㅇㄹㄴㄹㅇㄴㄹㅇㅇ',
    user_id: 'nodjfj12',
    division: '파트너',
    current_points: 115000,
    ip_address: '123.123.12.3',
    block_code: 'B001',
    block_reason: '반복 반려 누적',
    registered_date: '2025-08-01 18:56',
    registered_by: '시스템',
  },
  {
    id: '2',
    name: '그리디센트',
    user_id: 'gredicent_flowershop',
    division: '파트너',
    current_points: 0,
    ip_address: '158.176.19.2',
    block_code: 'B001',
    block_reason: '무단 이탈 · 노쇼 누적',
    registered_date: '2025-08-01 18:56',
    registered_by: '시스템',
  },
  {
    id: '3',
    name: '홍길동',
    user_id: 'gdhong12345678910',
    division: '리뷰어',
    current_points: 12000,
    ip_address: '456.456.45.6',
    block_code: 'B001',
    block_reason: '콘텐츠 중복 · 도용',
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 A',
  },
  {
    id: '4',
    name: '에이바헤어 모래내시장역점',
    user_id: 'sillyfunction',
    division: '파트너',
    current_points: 0,
    ip_address: '789.789.78.9',
    block_code: 'B001',
    block_reason: '커뮤니티 가이드 위반',
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
  },
  {
    id: '5',
    name: '김유성',
    user_id: 'dongoddmgo234kdfo123',
    division: '관리자',
    current_points: 0,
    ip_address: '345.345.34.5',
    block_code: 'B001',
    block_reason: '비정상 운영 행위',
    registered_date: '2025-08-01 18:56',
    registered_by: 'admin',
  },
  {
    id: '6',
    name: '에이바헤어 모래내시장역점',
    user_id: 'sillyfunction',
    division: '리뷰어',
    current_points: 0,
    ip_address: '789.789.78.9',
    block_code: 'B001',
    block_reason: '부적절 캠페인 게시',
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
  },
  {
    id: '7',
    name: '에이바헤어 모래내시장역점',
    user_id: 'sillyfunction@hanmail.net',
    division: '파트너',
    current_points: 0,
    ip_address: '789.789.78.9',
    block_code: 'B001',
    block_reason: '외부 결제 · 금전 요구',
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
  },
  {
    id: '8',
    name: '김유성',
    user_id: 'dsfsdafasdfdasfdasfa@naver.com',
    division: '리뷰어',
    current_points: 999999999,
    ip_address: '345.345.34.5',
    block_code: 'B001',
    block_reason: '검수 조작',
    registered_date: '2025-08-01 18:56',
    registered_by: '시스템',
  },
  {
    id: '9',
    name: '에이바헤어 모래내시장역점',
    user_id: 'sillyfunction',
    division: '파트너',
    current_points: 800123,
    ip_address: '789.789.78.9',
    block_code: 'B001',
    block_reason: '공정위 위반 게시 요청',
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 B',
  },
  {
    id: '10',
    name: '김유성',
    user_id: 'mintdevelop0001@kakao.com',
    division: '리뷰어',
    current_points: 0,
    ip_address: '345.345.34.5',
    block_code: 'B001',
    block_reason: '외부 결제 · 금전 요구',
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
  },
  {
    id: '11',
    name: '에이바헤어 모래내시장역점',
    user_id: 'sillyfunction',
    division: '파트너',
    current_points: 0,
    ip_address: '789.789.78.9',
    block_code: 'B001',
    block_reason: '비정상 운영 행위',
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
  },
  {
    id: '12',
    name: '에이바헤어 모래내시장역점',
    user_id: 'sillyfunction',
    division: '파트너',
    current_points: 0,
    ip_address: '789.789.78.9',
    block_code: 'B001',
    block_reason: '콘텐츠 중복 · 도용',
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
  },
  {
    id: '13',
    name: '라움태닝 송파점',
    user_id: 'songpa_raum',
    division: '리뷰어',
    current_points: 0,
    ip_address: '647.158.26.3',
    block_code: 'B001',
    block_reason: '무단 이탈 · 노쇼 누적',
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
  },
  {
    id: '14',
    name: '라움태닝 송파점',
    user_id: 'songpa_raum',
    division: '파트너',
    current_points: 10258312,
    ip_address: '647.158.26.3',
    block_code: 'B001',
    block_reason: '무단 이탈 · 노쇼 누적',
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
  },
  {
    id: '15',
    name: '그리디센트',
    user_id: 'verificationcheck0@nate.com',
    division: '파트너',
    current_points: 0,
    ip_address: '158.176.19.2',
    block_code: 'B001',
    block_reason: '반복 반려 누적',
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
  },
  {
    id: '16',
    name: '홍길동',
    user_id: 'dsfsdafasdfdasfdasfa@hanmail.net',
    division: '파트너',
    current_points: 12000,
    ip_address: '456.456.45.6',
    block_code: 'B001',
    block_reason: '반복 반려 누적',
    registered_date: '2025-08-01 18:56',
    registered_by: '관리자 C',
  },
];
