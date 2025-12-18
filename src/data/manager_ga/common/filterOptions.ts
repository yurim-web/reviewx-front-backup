/* ========================================
   🔍 GA 관리자 전용 필터 옵션
   ======================================== */

/**
 * GA 관리자 전용 필터 옵션
 *
 * 목적: GA 관리자 페이지에서만 사용하는 필터 옵션들을 한 곳에 모아둔 파일입니다.
 *       manager_ga 전용 필터 옵션들을 관리합니다.
 *
 * 📍 사용 위치:
 * - 반려 내역 페이지 (반려 코드 필터)
 * - 신고 내역 페이지 (신고 코드 필터)
 * - 파트너 목록 페이지 (구분, 상태, 유형, 채널 필터)
 * - 리뷰어 목록 페이지 (유형, 상태, 등급, 채널 필터)
 * - 차단 내역 페이지 (구분, 차단 코드 필터)
 * - 게시글 목록 페이지 (구분 필터)
 *
 * ⚠️ 참고:
 * - Channel, CampaignStatus, CampaignType은 manager_ga와 manager_sa 공통이므로
 *   src/data/manager/common/filterOptions.ts에서 import하여 사용합니다.
 *
 * 주요 기능:
 * - GA 관리자 전용 필터 타입 정의
 * - 필터 옵션 배열 정의
 * - 필터 라벨 매핑 객체 정의
 *
 */

// 공통 필터 옵션에서 import (재export)
export type {
  Channel,
  CampaignStatus,
  CampaignType,
} from "@/data/manager/common/filterOptions";

export {
  channel_filter_options,
  channel_name_map,
  campaign_status_filter_options,
  campaign_type_filter_options,
} from "@/data/manager/common/filterOptions";

/* ========================================
   🚫 반려 코드 필터 옵션
   ======================================== */

/**
 * 반려 코드 타입 정의
 *
 * 설명:
 * - 반려 내역 페이지에서 사용하는 반려 코드입니다.
 */
export type RejectCode =
  | "R001"
  | "R002"
  | "R003"
  | "R004"
  | "R005"
  | "R006"
  | "R007"
  | "R008";

/**
 * 반려 코드 필터 옵션 배열
 */
export const reject_code_filter_options: RejectCode[] = [
  "R001",
  "R002",
  "R003",
  "R004",
  "R005",
  "R006",
  "R007",
  "R008",
];

/* ========================================
   ⚠️ 신고 코드 필터 옵션
   ======================================== */

/**
 * 신고 코드 타입 정의
 *
 * 설명:
 * - 신고 내역 페이지에서 사용하는 신고 코드입니다.
 */
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

/**
 * 신고 코드 필터 옵션 배열
 */
export const report_code_filter_options: ReportCode[] = [
  "W001",
  "W002",
  "W003",
  "W004",
  "W005",
  "W006",
  "W007",
  "W008",
  "W009",
  "W010",
  "W011",
  "W012",
  "W013",
];

/* ========================================
   👥 파트너 필터 옵션
   ======================================== */

/**
 * 파트너 구분 타입 정의
 *
 * 설명:
 * - 파트너 목록 페이지에서 사용하는 구분입니다.
 */
export type PartnerDivision = "법인" | "개인";

/**
 * 파트너 구분 필터 옵션 배열
 */
export const partner_division_filter_options: PartnerDivision[] = [
  "법인",
  "개인",
];

/**
 * 파트너 상태 타입 정의
 */
export type PartnerStatus = "정상" | "일시 정지" | "영구 정지" | "탈퇴";

/**
 * 파트너 상태 필터 옵션 배열
 */
export const partner_status_filter_options: PartnerStatus[] = [
  "정상",
  "일시 정지",
  "영구 정지",
  "탈퇴",
];

/**
 * 파트너 상태 유형 타입 정의
 */
export type PartnerStatusType =
  | "모범 회원"
  | "주의 회원"
  | "경고 회원"
  | "이용 제한 회원";

/**
 * 파트너 상태 유형 필터 옵션 배열
 */
export const partner_status_type_filter_options: PartnerStatusType[] = [
  "모범 회원",
  "주의 회원",
  "경고 회원",
  "이용 제한 회원",
];

/* ========================================
   ✍️ 리뷰어 필터 옵션
   ======================================== */

/**
 * 리뷰어 유형 타입 정의
 *
 * 설명:
 * - 리뷰어 목록 페이지에서 사용하는 유형입니다.
 */
export type ReviewerType = "서포터즈" | "일반" | "인플루언서";

/**
 * 리뷰어 유형 필터 옵션 배열
 */
export const reviewer_type_filter_options: ReviewerType[] = [
  "서포터즈",
  "일반",
  "인플루언서",
];

/**
 * 리뷰어 상태 타입 정의
 */
export type ReviewerStatus = "정상" | "일시 정지" | "영구 정지" | "탈퇴";

/**
 * 리뷰어 상태 필터 옵션 배열
 */
export const reviewer_status_filter_options: ReviewerStatus[] = [
  "정상",
  "일시 정지",
  "영구 정지",
  "탈퇴",
];

/**
 * 리뷰어 상태 유형 타입 정의
 */
export type ReviewerStatusType =
  | "모범 회원"
  | "주의 회원"
  | "경고 회원"
  | "이용 제한 회원";

/**
 * 리뷰어 상태 유형 필터 옵션 배열
 */
export const reviewer_status_type_filter_options: ReviewerStatusType[] = [
  "모범 회원",
  "주의 회원",
  "경고 회원",
  "이용 제한 회원",
];

/* ========================================
   🚫 차단 내역 필터 옵션
   ======================================== */

/**
 * 차단 구분 타입 정의
 *
 * 설명:
 * - 차단 내역 페이지에서 사용하는 구분입니다.
 */
export type BlacklistDivision = "파트너" | "리뷰어" | "관리자";

/**
 * 차단 구분 필터 옵션 배열
 */
export const blacklist_division_filter_options: BlacklistDivision[] = [
  "파트너",
  "리뷰어",
  "관리자",
];

/**
 * 차단 코드 타입 정의
 */
export type BlockCode =
  | "B001"
  | "B002"
  | "B003"
  | "B004"
  | "B005"
  | "B006"
  | "B007"
  | "B008"
  | "B009"
  | "B010";

/**
 * 차단 코드 필터 옵션 배열
 */
export const block_code_filter_options: BlockCode[] = [
  "B001",
  "B002",
  "B003",
  "B004",
  "B005",
  "B006",
  "B007",
  "B008",
  "B009",
  "B010",
];

/* ========================================
   📝 게시글 필터 옵션
   ======================================== */

/**
 * 게시글 구분 타입 정의
 *
 * 설명:
 * - 게시글 목록 페이지에서 사용하는 구분입니다.
 */
export type PostDivision = "공지사항" | "자주 묻는 질문" | "이벤트";

/**
 * 게시글 구분 필터 옵션 배열
 */
export const post_division_filter_options: PostDivision[] = [
  "공지사항",
  "자주 묻는 질문",
  "이벤트",
];
