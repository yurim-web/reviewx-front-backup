/* ========================================
   📊 GA 관리자 반려내역 목업 데이터
   ======================================== */

/**
 * GA 관리자 반려내역 목업 데이터
 *
 * 목적: GA 관리자 반려내역 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/campaign/rejected (반려내역 페이지)
 *
 * 주요 기능:
 * - 반려 코드 안내 데이터
 * - 반려 내역 통계 데이터
 * - 반려 내역 목록 데이터
 *
 * 학습 포인트:
 * - TypeScript 인터페이스: 데이터 구조를 타입으로 정의합니다
 * - 배열 타입: 여러 개의 데이터를 배열로 관리합니다
 * - export: 다른 파일에서 이 데이터를 import하여 사용할 수 있습니다
 */

// 반려 코드 타입 정의
export type RejectCode =
  | 'R001'
  | 'R002'
  | 'R003'
  | 'R004'
  | 'R005'
  | 'R006'
  | 'R007'
  | 'R008';

// 반려 코드 카테고리 타입 정의
export type RejectCategory = '콘텐츠' | '리뷰어/파트너' | '캠페인' | '정산' | '기타';

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
    code: 'R001',
    category: '콘텐츠',
    reason: '구매 정보 불일치',
  },
  {
    code: 'R002',
    category: '콘텐츠',
    reason: '가이드 불이행',
  },
  {
    code: 'R003',
    category: '콘텐츠',
    reason: '콘텐츠 오류',
  },
  {
    code: 'R004',
    category: '콘텐츠',
    reason: '이미지 도용 의심',
  },
  {
    code: 'R005',
    category: '리뷰어/파트너',
    reason: '반복 반려 의심',
  },
  {
    code: 'R006',
    category: '캠페인',
    reason: '부적절한 콘텐츠 요청',
  },
  {
    code: 'R007',
    category: '정산',
    reason: '출금 정보 불일치',
  },
  {
    code: 'R008',
    category: '기타',
    reason: '그외 비매너 행위',
  },
];

// 반려 내역 통계 데이터
// 각 반려 코드별 반려 횟수를 집계한 데이터입니다
export const reject_stats: RejectStatsItem[] = [
  {
    code: 'R001',
    count: 3,
  },
  {
    code: 'R002',
    count: 3,
  },
  {
    code: 'R003',
    count: 3,
  },
  {
    code: 'R004',
    count: 3,
  },
  {
    code: 'R005',
    count: 3,
  },
  {
    code: 'R006',
    count: 19999,
  },
  {
    code: 'R007',
    count: 100,
  },
  {
    code: 'R008',
    count: 1100,
  },
];

// 반려 내역 목록 데이터
export const rejected_campaign_list: RejectedCampaignItem[] = [
  {
    id: '1',
    campaign_number: '000160',
    campaign_name:
      '푸러블 고농축 캡슐세제 플라워향, 1개, 110개입, 푸러블 고농축 캡슐세제 플라워향, 1개, 110개입, 푸러블 고농축 캡슐세제 플라워향, 1개, 110개입,',
    reject_code: 'R001',
    reject_reason:
      '푸러블 고농축 캡슐세제 플라워향, 1개, 110개입, 푸러블 고농축 캡슐세제 플라워향, 1개, 110개입',
    inspector: '(주)청명종합광고기획',
    target: '홍길동',
    processed_date: '2025-08-01 18:56',
    reject_count: 1,
  },
  {
    id: '2',
    campaign_number: '000159',
    campaign_name: '어쩌구 미션',
    reject_code: 'R002',
    reject_reason: '',
    inspector: 'AI 자동 탐지',
    target: '일이삼사오육칠팔구십',
    processed_date: '2025-08-01 18:56',
    reject_count: 3,
  },
  {
    id: '3',
    campaign_number: '000099',
    campaign_name: '어쩌구 미션',
    reject_code: 'R003',
    reject_reason: '',
    inspector: 'AI 자동 탐지',
    target: '일이삼사오육칠팔구십',
    processed_date: '2025-08-01 18:56',
    reject_count: 1,
  },
  {
    id: '4',
    campaign_number: '000068',
    campaign_name: '어쩌구 미션',
    reject_code: 'R004',
    reject_reason: '',
    inspector: 'AI 자동 탐지',
    target: '일이삼사오육칠팔구십',
    processed_date: '2025-08-01 18:56',
    reject_count: 1,
  },
  {
    id: '5',
    campaign_number: '000062',
    campaign_name: '어쩌구 미션',
    reject_code: 'R005',
    reject_reason: '',
    inspector: '일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육',
    target: '일이삼사오육칠팔구십일이삼사오',
    processed_date: '2025-08-01 18:56',
    reject_count: 1,
  },
  {
    id: '6',
    campaign_number: '000031',
    campaign_name: '어쩌구 미션',
    reject_code: 'R006',
    reject_reason: '',
    inspector: '주식회사 아이엠에스커뮤니케이션',
    target: '(주)아이엠에스커뮤니케이션',
    processed_date: '2025-08-01 18:56',
    reject_count: 1,
  },
  {
    id: '7',
    campaign_number: '000016',
    campaign_name: '어쩌구 미션',
    reject_code: 'R007',
    reject_reason: '',
    inspector: '네이버 주식회사',
    target: '(주)아이엠에스커뮤니케이션',
    processed_date: '2025-08-01 18:56',
    reject_count: 1,
  },
  {
    id: '8',
    campaign_number: '000015',
    campaign_name: '어쩌구 미션',
    reject_code: 'R007',
    reject_reason: '',
    inspector: '주식회사 청명미디어',
    target: '(주)아이엠에스커뮤니케이션',
    processed_date: '2025-08-01 18:56',
    reject_count: 1,
  },
  {
    id: '9',
    campaign_number: '000015',
    campaign_name: '어쩌구 미션',
    reject_code: 'R007',
    reject_reason: '',
    inspector: '(주)청명종합광고기획',
    target: '(주)아이엠에스커뮤니케이션',
    processed_date: '2025-08-01 18:56',
    reject_count: 1,
  },
];

