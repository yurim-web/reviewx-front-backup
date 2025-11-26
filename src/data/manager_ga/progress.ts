/* ========================================
   📊 GA 관리자 진행 현황 목업 데이터
   ======================================== */

/**
 * GA 관리자 진행 현황 목업 데이터
 *
 * 목적: GA 관리자 진행 현황 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/progress (진행 현황 페이지)
 *
 * 주요 기능:
 * - 캠페인 통계 데이터
 * - 캠페인 목록 데이터
 *
 * 학습 포인트:
 * - TypeScript 인터페이스: 데이터 구조를 타입으로 정의합니다
 * - 배열 타입: 여러 개의 데이터를 배열로 관리합니다
 * - export: 다른 파일에서 이 데이터를 import하여 사용할 수 있습니다
 */

// 캠페인 상태 타입 정의
export type CampaignStatus = '예정' | '신청' | '진행' | '종료' | '긴급';

// 캠페인 유형 타입 정의
export type CampaignType = '배송형' | '방문형' | '구매평' | '기자단' | '미션형';

// 채널 타입 정의
export type Channel =
  | 'Blog'
  | 'Clip'
  | 'Instagram'
  | 'Mission'
  | 'Reels'
  | 'Shorts'
  | 'Store'
  | 'Youtube';

// 통계 카드 데이터 타입
export interface StatCard {
  title: string; // 카드 제목
  value: string; // 통계 값
  color?: string; // 값 색상 (기본: #444444, 빨간색: #ff2626)
}

// 캠페인 목록 아이템 타입
export interface CampaignProgressItem {
  id: string; // 캠페인 ID
  campaign_number: string; // 캠페인 번호
  partner_name: string; // 파트너명
  campaign_name: string; // 캠페인명
  type: CampaignType; // 캠페인 유형
  channel: Channel; // 채널
  status: CampaignStatus; // 상태
  recruit_count: number; // 모집 수
  apply_count: number; // 신청 수
  point: number; // 지급 포인트
  detail_campaign_id?: string; // 상세 페이지에서 사용할 공용 캠페인 ID (옵션)
}

// 통계 카드 데이터
export const stat_cards: StatCard[] = [
  {
    title: '오픈 예정 캠페인',
    value: '859건',
  },
  {
    title: '진행 중인 캠페인',
    value: '1,853건',
  },
  {
    title: '신청 중인 캠페인',
    value: '5,203건',
  },
  {
    title: '전체 캠페인',
    value: '12,589건',
  },
  {
    title: '종료된 캠페인',
    value: '23,547건',
  },
  {
    title: '취소된 캠페인',
    value: '189건',
    color: '#ff2626', // 빨간색
  },
];

// 캠페인 목록 데이터
export const campaign_list: CampaignProgressItem[] = [
  {
    id: '1',
    campaign_number: '000001',
    partner_name: '주식회사 재밌는걸참좋아하고하고싶은거하는노신사',
    campaign_name:
      '푸러블 고농축 캡슐세제 플라워향, 1개, 110개입, 푸러블 고농축 캡슐세제 플라워향, 1개, 110개입, 푸러블 고농축 캡슐세제 플라워향, 1개, 110개입,',
    type: '배송형',
    channel: 'Blog',
    status: '예정',
    recruit_count: 12,
    apply_count: 5,
    point: 115000,
  },
  {
    id: '2',
    campaign_number: '000001',
    partner_name: '그리디센트',
    campaign_name: '나만의 향수만들기 체험 [그리디센트]',
    type: '구매평',
    channel: 'Store',
    status: '예정',
    recruit_count: 50,
    apply_count: 1023,
    point: 0,
  },
  {
    id: '3',
    campaign_number: '000001',
    partner_name: '주식회사 프리즘앤씨',
    campaign_name:
      '테라랩 제노스퍼 남성용 임신준비 영양제 아르기닌/아연/코큐텐 등 8중기능성 체험단 모집',
    type: '배송형',
    channel: 'Clip',
    status: '신청',
    recruit_count: 6,
    apply_count: 658,
    point: 12000,
  },
  {
    id: '4',
    campaign_number: '000001',
    partner_name: '에이바헤어 모래내시장역점',
    campaign_name:
      '[삼전동]하엔크헤어에서 원하는 시술 무료로 시술 후 리뷰 예쁘게 써주실 블로거 / 인플루언서 모십니다',
    type: '구매평',
    channel: 'Store',
    status: '진행',
    recruit_count: 300,
    apply_count: 1,
    point: 0,
  },
  {
    id: '5',
    campaign_number: '000001',
    partner_name: '(주)청명종합광고기획',
    campaign_name: '200만원 울써마지 시술 지원! 인플루언서 체험단 모집✨',
    type: '배송형',
    channel: 'Instagram',
    status: '진행',
    recruit_count: 1000,
    apply_count: 27,
    point: 0,
  },
  {
    id: '6',
    campaign_number: '000001',
    partner_name: '라움태닝 송파점',
    campaign_name: '라움태닝 송파점 체험단모집',
    type: '방문형',
    channel: 'Reels',
    status: '종료',
    recruit_count: 2,
    apply_count: 363,
    point: 0,
  },
  {
    id: '7',
    campaign_number: '000001',
    partner_name: '탄츠스튜디오',
    campaign_name: '[클래스 참여] 현대무용 탄츠 스튜디오 - 탄츠림 TANZREEM',
    type: '방문형',
    channel: 'Shorts',
    status: '긴급',
    recruit_count: 5,
    apply_count: 28,
    point: 0,
  },
  {
    id: '8',
    campaign_number: '000001',
    partner_name: '캠프빌리지 김천지례점',
    campaign_name: '[김천] 캠프빌리지 김천지례점',
    type: '미션형',
    channel: 'Mission',
    status: '진행',
    recruit_count: 10,
    apply_count: 56,
    point: 10000,
  },
  {
    id: '9',
    campaign_number: '000001',
    partner_name: '노원조개창고',
    campaign_name: '노원조개창고 체험단 모집',
    type: '미션형',
    channel: 'Mission',
    status: '진행',
    recruit_count: 10,
    apply_count: 56,
    point: 10000,
  },
  {
    id: '10',
    campaign_number: '000001',
    partner_name: '(주)청명종합광고기획',
    campaign_name: '푸러블 고농축 캡슐세제 플라워향, 1개, 110개입',
    type: '미션형',
    channel: 'Mission',
    status: '진행',
    recruit_count: 10,
    apply_count: 56,
    point: 10000,
  },
  {
    id: '11',
    campaign_number: '000001',
    partner_name: '(주)청명종합광고기획',
    campaign_name: '푸러블 고농축 캡슐세제 플라워향, 1개, 110개입',
    type: '기자단',
    channel: 'Youtube',
    status: '종료',
    recruit_count: 10,
    apply_count: 56,
    point: 10000,
  },
  {
    id: '12',
    campaign_number: '000001',
    partner_name: '(주)청명종합광고기획',
    campaign_name: '푸러블 고농축 캡슐세제 플라워향, 1개, 110개입',
    type: '기자단',
    channel: 'Shorts',
    status: '종료',
    recruit_count: 10,
    apply_count: 56,
    point: 10000,
  },
  {
    id: '13',
    campaign_number: '000001',
    partner_name: '(주)청명종합광고기획',
    campaign_name: '푸러블 고농축 캡슐세제 플라워향, 1개, 110개입',
    type: '미션형',
    channel: 'Mission',
    status: '종료',
    recruit_count: 10,
    apply_count: 56,
    point: 10000,
  },
  {
    id: '14',
    campaign_number: '000001',
    partner_name: '(주)청명종합광고기획',
    campaign_name: '푸러블 고농축 캡슐세제 플라워향, 1개, 110개입',
    type: '미션형',
    channel: 'Mission',
    status: '종료',
    recruit_count: 10,
    apply_count: 56,
    point: 10000,
  },
  {
    id: '15',
    campaign_number: '000001',
    partner_name: '(주)청명종합광고기획',
    campaign_name: '푸러블 고농축 캡슐세제 플라워향, 1개, 110개입',
    type: '미션형',
    channel: 'Mission',
    status: '종료',
    recruit_count: 10,
    apply_count: 56,
    point: 10000,
  },
  {
    id: '16',
    campaign_number: '000001',
    partner_name: '(주)청명종합광고기획',
    campaign_name: '푸러블 고농축 캡슐세제 플라워향, 1개, 110개입',
    type: '미션형',
    channel: 'Mission',
    status: '종료',
    recruit_count: 10,
    apply_count: 56,
    point: 10000,
  },
  {
    id: '17',
    campaign_number: '000001',
    partner_name: '(주)청명종합광고기획',
    campaign_name: '푸러블 고농축 캡슐세제 플라워향, 1개, 110개입',
    type: '미션형',
    channel: 'Mission',
    status: '종료',
    recruit_count: 10,
    apply_count: 56,
    point: 10000,
  },
  {
    id: '18',
    campaign_number: '000001',
    partner_name: '(주)청명종합광고기획',
    campaign_name: '푸러블 고농축 캡슐세제 플라워향, 1개, 110개입',
    type: '미션형',
    channel: 'Mission',
    status: '종료',
    recruit_count: 10,
    apply_count: 56,
    point: 10000,
  },
];

