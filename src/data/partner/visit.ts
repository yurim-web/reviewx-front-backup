/* ========================================
   🏬 방문형 캠페인 데이터 타입 정의
   ======================================== */

/**
 * 방문형 캠페인 데이터 타입 정의
 *
 * 이 파일에서 사용하는 모든 방문형 캠페인 데이터의 타입을 정의합니다.
 * 공통 타입은 sharedCampaigns.ts에서 import하여 사용합니다.
 */

import type { CampaignWithContents } from './sharedCampaigns';
import type { CampaignWithApplicants } from './campaign_application/delivery_applicants';
import type { ContentByTab } from './sharedCampaigns';
import { CampaignFormData } from '@/types/user/user';
import { calculateCampaignStatus, calculateDaysLeft } from './delivery';

/**
 * 방문형 캠페인 통합 데이터 구조
 *
 * 방문형 캠페인의 모든 상태(종료/취소/진행/예정/신청)를 하나의 구조로 통일합니다.
 * - 종료/취소 캠페인: campaignInfo + contents (필수)
 * - 진행/예정/신청 캠페인: campaignInfo + applicantData (필수) + contents (선택)
 */
export interface VisitCampaignDataItem {
  campaignInfo: {
    id: string; // 캠페인 고유 식별자
    title: string; // 캠페인 제목
    image: string; // 메인 캠페인 이미지 경로
    status: '진행 중' | '대기 중' | '모집 중' | '종료' | '취소'; // 캠페인 상태 (모든 상태 포함)
    campaignType: '방문형'; // 캠페인 타입 (방문형 고정)
    category: string; // 캠페인 카테고리 (여가, 생활 등)
    brandName: string; // 브랜드명 (플랫폼명)
    recruitmentPeriod: string; // 모집 기간 (예: "2024-01-05 ~ 2024-01-10")
    announcementDate: string; // 선정 발표일 (예: "2024-01-10")
    registrationPeriod: string; // 등록 기간 (예: "2024-01-12 ~ 2024-01-18")
    recruitedCount: number; // 현재 모집된 인원 수 (자동 계산됨)
    totalCount: number; // 총 모집 인원 수
    daysLeft: number; // 남은 일수 (양수면 남은 일수, 음수면 지난 일수)
    statusText?: string; // 상태 텍스트 (예: "캠페인 콘텐츠를 검수해 주세요.", 선택사항)
  };
  // 신청자 데이터 (선택사항 - 진행/예정/신청 캠페인에만 있음)
  applicantData?: {
    applicants: Array<{
      id: string; // 신청자 고유 식별자
      Id: string; // 신청자 내부 ID
      nickname: string; // 신청자 닉네임
      userType: '리뷰어' | '인플루언서'; // 사용자 타입
      profileImage: string; // 프로필 이미지 경로
      memberType: '모범 회원' | '주의 회원' | '경고 회원' | '이용 제한'; // 회원 타입
      followers?: number; // 팔로워 수 (인스타그램, 네이버클립 등)
      subscribers?: number; // 구독자 수 (유튜브)
      memo: string; // 메모
      selectionStatus: '미선택' | '선정하기' | '이용제한 계정'; // 선정 상태
      channel: string; // 채널 정보 (인스타그램, 네이버블로그, 유튜브 등)
    }>;
    selectedApplicants: Array<{
      id: string; // 선정된 신청자 고유 식별자
      Id: string; // 선정된 신청자 내부 ID
      nickname: string; // 신청자 닉네임
      userType: '리뷰어' | '인플루언서'; // 사용자 타입
      profileImage: string; // 프로필 이미지 경로
      memberType: '모범 회원' | '주의 회원' | '경고 회원' | '이용 제한'; // 회원 타입
      followers?: number; // 팔로워 수 (인스타그램, 네이버클립 등)
      subscribers?: number; // 구독자 수 (유튜브)
      memo: string; // 메모
      selectionStatus: '선정하기'; // 선정 상태 (선정된 신청자는 "선정하기" 고정)
      channel: string; // 채널 정보 (인스타그램, 네이버블로그, 유튜브 등)
    }>;
  };
  // 콘텐츠 데이터 (선택사항 - 종료/취소 캠페인에는 필수, 진행/예정/신청 캠페인에는 선택)
  contents?: {
    reviewing: Array<{
      id: string; // 콘텐츠 고유 식별자
      createdAt: string; // 생성일시 (ISO 8601 형식)
      status: '검수'; // 콘텐츠 상태
      userType: '리뷰어' | '인플루언서'; // 사용자 타입
      nickname: string; // 작성자 닉네임
      channelId: string; // 채널 식별자
      channel: string; // 채널명
      updatedAt?: string; // 수정일시 (선택사항)
      isRejected?: boolean; // 거절 여부 (선택사항)
      isLate?: boolean; // 지연 여부 (선택사항)
    }>;
    completed: Array<{
      id: string; // 콘텐츠 고유 식별자
      createdAt: string; // 생성일시 (ISO 8601 형식)
      status: '완료'; // 콘텐츠 상태
      userType: '리뷰어' | '인플루언서'; // 사용자 타입
      nickname: string; // 작성자 닉네임
      channelId: string; // 채널 식별자
      channel: string; // 채널명
      updatedAt?: string; // 수정일시 (선택사항)
      isLate?: boolean; // 지연 여부 (선택사항)
    }>;
  };
}

/**
 * 방문형 캠페인 종료/취소 데이터 타입
 *
 * 종료되거나 취소된 방문형 캠페인의 데이터 구조입니다.
 * VisitCampaignDataItem[] 타입을 사용하여 통일된 구조로 관리합니다.
 */
export type VisitClosedCampaignData = VisitCampaignDataItem[];

/**
 * 방문형 캠페인 진행/예정/신청 데이터 타입
 *
 * 진행 중, 예정, 신청 중인 방문형 캠페인의 데이터 구조입니다.
 * VisitCampaignDataItem[] 타입을 사용하여 통일된 구조로 관리합니다.
 */
export type VisitCampaignData = VisitCampaignDataItem[];

/* ========================================
   🏬 방문형 캠페인 (종료/취소) 데이터 - contents 포함
   - 카테고리별 분리: campaignInfo + contents 함께 보관
   - VisitCampaignDataItem 인터페이스로 통일된 구조 사용
   ======================================== */

export const visitClosedCampaigns: VisitCampaignDataItem[] = [
  {
    campaignInfo: {
      id: '901',
      title: '[종료] 카페 체험 방문 캠페인',
      image: '/images/main/campaign_img/eximg_2.png',
      status: '종료',
      campaignType: '방문형',
      category: '여가',
      brandName: '네이버블로그',
      recruitmentPeriod: '2024-01-05 ~ 2024-01-10',
      announcementDate: '2024-01-10',
      registrationPeriod: '2024-01-12 ~ 2024-01-18',
      recruitedCount: 10,
      totalCount: 10,
      daysLeft: -10,
      statusText: '캠페인 콘텐츠를 검수해 주세요.',
    },
    contents: {
      reviewing: [
        {
          id: '901-r-1',
          createdAt: '2025-11-02T12:30:00.000Z',
          status: '검수',
          channel: '네이버블로그',
          userType: '리뷰어',
          nickname: '참여자-1',
          channelId: '901-r-1',
          updatedAt: '2025-11-02T13:00:00.000Z',
        },
        {
          id: '901-r-2',
          createdAt: '2025-11-02T13:10:00.000Z',
          status: '검수',
          channel: '네이버블로그',
          userType: '리뷰어',
          nickname: '참여자-2',
          channelId: '901-r-2',
          isLate: true,
        },
        {
          id: '901-r-3',
          createdAt: '2025-11-02T14:05:00.000Z',
          status: '검수',
          channel: '네이버블로그',
          userType: '리뷰어',
          nickname: '참여자-3',
          channelId: 'visit_user_003',
          isRejected: true,
        },
        {
          id: '901-r-4',
          createdAt: '2025-11-02T15:20:00.000Z',
          status: '검수',
          channel: '네이버블로그',
          userType: '리뷰어',
          nickname: '참여자-4',
          channelId: 'visit_user_004',
          isRejected: true,
        },
      ],
      completed: [
        {
          id: '901-c-1',
          createdAt: '2025-11-02T09:00:00.000Z',
          status: '완료',
          channel: '네이버블로그',
          userType: '리뷰어',
          nickname: '참여자-3',
          channelId: '901-c-1',
          updatedAt: '2025-11-02T10:00:00.000Z',
        },
        {
          id: '901-c-2',
          createdAt: '2025-11-01T20:40:00.000Z',
          status: '완료',
          channel: '네이버블로그',
          userType: '리뷰어',
          nickname: '참여자-5',
          channelId: 'visit_user_005',
          isLate: true,
        },
      ],
    },
  },
];

/* ========================================
   🏬 방문형 (예정/신청/진행) info+신청자 데이터
   - 기존 visit_campaigns.ts 내용을 통합
   - VisitCampaignDataItem 인터페이스로 통일된 구조 사용
   ======================================== */
export const visitCampaigns: VisitCampaignDataItem[] = [
  // 예정(대기 중) - 예정 탭에 표시
  {
    campaignInfo: {
      id: '1',
      title: '카페 체험 방문 캠페인 [스타벅스]',
      image: '/images/main/campaign_img/eximg_2.png',
      status: '대기 중',
      campaignType: '방문형',
      category: '여가',
      brandName: '인스타그램',
      recruitmentPeriod: '2025-11-26 ~ 2025-12-06',
      announcementDate: '2025-12-06',
      registrationPeriod: '2025-12-08 ~ 2025-12-16',
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 10,
      daysLeft: 12,
    },
    applicantData: {
      applicants: [
        {
          id: 'visit_blog_001',
          Id: 'visit_blog_user_001',
          nickname: '김블로거',
          userType: '리뷰어',
          profileImage: '',
          memberType: '모범 회원',
          followers: 1500,
          memo: '블로그 포스팅 경험 풍부',
          selectionStatus: '미선택',
          channel: '인스타그램',
        },
        {
          id: 'visit_clip_001',
          Id: 'visit_clip_user_001',
          nickname: '박클리퍼',
          userType: '리뷰어',
          profileImage: '',
          memberType: '모범 회원',
          followers: 15600,
          memo: '클립 제작 전문가',
          selectionStatus: '미선택',
          channel: '인스타그램',
        },
        {
          id: 'visit_insta_001',
          Id: 'visit_insta_user_001',
          nickname: '정인플루언서',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          followers: 45200,
          memo: '인스타그램 협찬 경험 다수',
          selectionStatus: '미선택',
          channel: '인스타그램',
        },
        {
          id: 'visit_youtube_001',
          Id: 'visit_youtube_user_001',
          nickname: '송유튜버',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          followers: 67800,
          memo: '유튜브 리뷰 콘텐츠 제작',
          selectionStatus: '미선택',
          channel: '인스타그램',
        },
      ],
      selectedApplicants: [
        {
          id: 'visit_blog_sel_001',
          Id: 'visit_blog_user_002',
          nickname: '선정된블로거',
          userType: '리뷰어',
          profileImage: '',
          memberType: '모범 회원',
          followers: 2200,
          memo: '콘텐츠 퀄리티 우수',
          selectionStatus: '선정하기',
          channel: '인스타그램',
        },
        {
          id: 'visit_insta_sel_001',
          Id: 'visit_insta_user_002',
          nickname: '인스타선정자',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          followers: 30000,
          memo: '브랜드 톤 앤 매너 적합',
          selectionStatus: '선정하기',
          channel: '인스타그램',
        },
      ],
    },
  },
  // 예정(대기 중) - 예정 탭에 표시
  {
    campaignInfo: {
      id: '104',
      title: '릴스 협찬 방문 캠페인',
      image: '/images/main/campaign_img/eximg_5.png',
      status: '대기 중',
      campaignType: '방문형',
      category: '여가',
      brandName: '릴스',
      recruitmentPeriod: '2025-11-28 ~ 2025-12-08',
      announcementDate: '2025-12-08',
      registrationPeriod: '2025-12-10 ~ 2025-12-18',
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 10,
      daysLeft: 14,
    },
    applicantData: {
      applicants: [
        {
          id: 'r_app_001',
          Id: 'reels_user_001',
          nickname: '릴스인플루언서',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          followers: 28000,
          memo: '릴스 숏폼 제작 경험 풍부',
          selectionStatus: '미선택',
          channel: '인스타그램',
        },
      ],
      selectedApplicants: [
        {
          id: 'r_sel_001',
          Id: 'reels_user_sel_001',
          nickname: '릴스선정자',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          followers: 35000,
          memo: '브랜드 톤 적합',
          selectionStatus: '선정하기',
          channel: '인스타그램',
        },
      ],
    },
  },
  // 신청(모집 중) - 신청 탭에 표시
  {
    campaignInfo: {
      id: '105',
      title: '네이버클립 숏폼 체험단',
      image: '/images/main/campaign_img/eximg_6.png',
      status: '모집 중',
      campaignType: '방문형',
      category: '여가',
      brandName: '네이버클립',
      recruitmentPeriod: '2025-11-20 ~ 2025-12-03',
      announcementDate: '2025-12-05',
      registrationPeriod: '2025-12-07 ~ 2025-12-15',
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 12,
      daysLeft: 11,
    },
    applicantData: {
      applicants: [
        {
          id: 'nc_app_001',
          Id: 'naverclip_user_001',
          nickname: '클립마스터',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          followers: 21000,
          memo: '네이버클립 숏폼 제작 고수',
          selectionStatus: '미선택',
          channel: '네이버클립',
        },
        {
          id: 'nc_app_002',
          Id: 'naverclip_user_002',
          nickname: '패션클립',
          userType: '리뷰어',
          profileImage: '',
          memberType: '모범 회원',
          followers: 14500,
          memo: '패션/잡화 숏폼 전문',
          selectionStatus: '미선택',
          channel: '네이버클립',
        },
      ],
      selectedApplicants: [
        {
          id: 'nc_sel_001',
          Id: 'naverclip_sel_001',
          nickname: '선정된클리퍼',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          followers: 32000,
          memo: '브랜드 톤 적합',
          selectionStatus: '선정하기',
          channel: '네이버클립',
        },
      ],
    },
  },
  // 진행 중 (콘텐츠 별도, 여기서는 info/applicants만)
  {
    campaignInfo: {
      id: '106',
      title: '쇼츠 영상 체험 캠페인',
      image: '/images/main/campaign_img/eximg_7.png',
      status: '진행 중',
      campaignType: '방문형',
      category: '여가',
      brandName: '쇼츠',
      recruitmentPeriod: '2025-01-05 ~ 2025-01-15',
      announcementDate: '2025-01-15',
      registrationPeriod: '2025-01-17 ~ 2025-01-25',
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 15,
      daysLeft: 2,
      statusText: '캠페인 콘텐츠를 검수해 주세요~~~~~',
    },
    applicantData: {
      applicants: [
        {
          id: 's_app_001',
          Id: 'shorts_user_001',
          nickname: '숏츠크리에이터',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          subscribers: 62000,
          memo: '숏츠 영상 리뷰 다수',
          selectionStatus: '미선택',
          channel: '유튜브',
        },
      ],
      selectedApplicants: [
        {
          id: 's_sel_001',
          Id: 'shorts_user_sel_001',
          nickname: '숏츠선정자',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          subscribers: 80000,
          memo: '브랜드 톤 적합',
          selectionStatus: '선정하기',
          channel: '유튜브',
        },
      ],
    },
  },
  // 예정(대기 중) - 예정 탭에 표시
  {
    campaignInfo: {
      id: '952',
      title: '[예정] 방문형 샘플 캠페인',
      image: '/images/main/campaign_img/eximg_2.png',
      status: '대기 중' as const,
      campaignType: '방문형',
      category: '여가',
      brandName: '네이버클립',
      recruitmentPeriod: '2025-12-01 ~ 2025-12-11',
      announcementDate: '2025-12-11',
      registrationPeriod: '2025-12-13 ~ 2025-12-21',
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 8,
      daysLeft: 17,
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
  // 진행(콘텐츠 없음 표시용)
  {
    campaignInfo: {
      id: '963',
      title: '[진행] 방문형 체험단 진행',
      image: '/images/main/campaign_img/eximg_2.png',
      status: '진행 중' as const,
      campaignType: '방문형',
      category: '여가',
      brandName: '인스타그램',
      recruitmentPeriod: '2025-10-25 ~ 2025-11-05',
      announcementDate: '2025-11-05',
      registrationPeriod: '2025-11-07 ~ 2025-11-14',
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 8,
      daysLeft: 1,
      statusText: '캠페인 당첨자를 선정해 주세요.',
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
  // 신청(모집 중) - 신청 탭에 표시
  {
    campaignInfo: {
      id: '972',
      title: '[신청] 방문형 샘플 캠페인',
      image: '/images/main/campaign_img/eximg_2.png',
      status: '모집 중' as const,
      campaignType: '방문형',
      category: '여가',
      brandName: '인스타그램',
      recruitmentPeriod: '2025-11-22 ~ 2025-12-02',
      announcementDate: '2025-12-04',
      registrationPeriod: '2025-12-06 ~ 2025-12-14',
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 10,
      daysLeft: 10,
    },
    applicantData: {
      applicants: [
        {
          id: 'app_972_insta_001',
          Id: 'insta_972_001',
          nickname: '인스타크리에이터A',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          followers: 28500,
          memo: '브랜디드 컨텐츠 경험 다수',
          selectionStatus: '미선택',
          channel: '인스타그램',
        },
        {
          id: 'app_972_insta_002',
          Id: 'insta_972_002',
          nickname: '리뷰그램B',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          followers: 15800,
          memo: '사진/릴스 균형형',
          selectionStatus: '미선택',
          channel: '인스타그램',
        },
        {
          id: 'app_972_insta_003',
          Id: 'insta_972_003',
          nickname: '무드샷C',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          followers: 40300,
          memo: '무드 촬영 강점',
          selectionStatus: '미선택',
          channel: '인스타그램',
        },
      ],
      selectedApplicants: [
        {
          id: 'sel_972_insta_001',
          Id: 'insta_sel_972_001',
          nickname: '선정그램D',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          followers: 32000,
          memo: '브랜드 톤 적합',
          selectionStatus: '선정하기',
          channel: '인스타그램',
        },
      ],
    },
  },
];

/* ========================================
   📊 신청자 수 자동 계산 로직
   - 각 캠페인의 recruitedCount를 applicantData.applicants 배열 길이로 자동 설정
   - 데이터 일관성을 유지하기 위해 배열 정의 직후 실행됩니다
   ======================================== */

/**
 * visitCampaigns 배열의 각 캠페인에 대해 recruitedCount를 자동 계산합니다
 *
 * 설명:
 * - 각 캠페인의 applicantData.applicants 배열의 길이를 계산하여
 *   campaignInfo.recruitedCount에 자동으로 설정합니다.
 * - 이렇게 하면 신청자 데이터를 추가/제거할 때마다 수동으로 숫자를 맞출 필요가 없습니다.
 */
visitCampaigns.forEach((campaign) => {
  // 각 캠페인의 신청자 배열 길이를 계산하여 recruitedCount에 설정
  // 설명: applicantData.applicants가 undefined일 수 있으므로 옵셔널 체이닝(?.)과 널 병합 연산자(??)를 사용
  // applicants가 없으면 빈 배열([])로 간주하고, 그 길이는 0이 됩니다
  campaign.campaignInfo.recruitedCount =
    campaign.applicantData?.applicants?.length ?? 0;
});

/* ========================================
   🏬 방문형 콘텐츠 조회 함수
   - 진행 중인 캠페인의 콘텐츠 데이터를 조회합니다
   ======================================== */

/**
 * 방문형 캠페인의 콘텐츠 데이터를 조회하는 함수
 * @param campaignId - 조회할 캠페인의 ID
 * @returns 검수 중/완료된 콘텐츠를 담은 객체
 */
export function getVisitContentsById(campaignId: string): ContentByTab {
  // 종료/취소 탭 데이터(방문형): 901 매핑
  // 순환 참조를 피하기 위해 visitClosedCampaigns를 직접 참조
  if (campaignId === '901') {
    const closedCampaign = visitClosedCampaigns.find(
      (c) => c.campaignInfo.id === campaignId,
    );
    if (closedCampaign?.contents) {
      return closedCampaign.contents;
    }
    return { reviewing: [], completed: [] };
  }

  // 진행 중인 캠페인의 콘텐츠 조회
  const campaign = visitCampaigns.find((c) => c.campaignInfo.id === campaignId);

  // 캠페인을 찾았고 contents가 있으면 반환
  if ((campaign as any)?.contents) {
    return (campaign as any).contents as ContentByTab;
  }

  // 콘텐츠가 없는 경우 빈 배열 반환
  return { reviewing: [], completed: [] };
}

/* ========================================
   🛒 구매평 (예정/신청/진행) info+신청자 데이터
   - 기존 review_campaigns.ts 내용을 통합
   ======================================== */
/* 방문형 파일에는 구매평 캠페인 데이터 포함하지 않음 */
/* export const reviewCampaigns: CampaignWithApplicants[] = [
  // 진행 중
  {
    campaignInfo: {
      id: "18",
      title: "프리미엄 화장품 구매평 작성 캠페인",
      image: "/images/main/campaign_img/eximg_5.png",
      status: "진행 중",
      campaignType: "구매평",
      category: "식품",
      brandName: "기본",
      recruitmentPeriod: "2024-01-15 ~ 2024-01-22",
      announcementDate: "2024-01-22",
      purchasePeriod: "2024-01-23 ~ 2024-01-25",
      registrationPeriod: "2024-01-24 ~ 2024-02-01",
      recruitedCount: 12,
      totalCount: 15,
      daysLeft: 3,
      statusText: "캠페인 콘텐츠를 검수해 주세요.",
    },
    applicantData: {
      applicants: [
        {
          id: "app_18_1",
          Id: "reviewer_18_001",
          nickname: "구매평전문가1",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "화장품 구매평 작성에 특화된 리뷰어입니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_18_2",
          Id: "reviewer_18_002",
          nickname: "뷰티구매평러",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "뷰티 제품 구매평을 자주 작성합니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_18_3",
          Id: "reviewer_18_003",
          nickname: "스킨케어구매평전문가",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "스킨케어 제품 구매평 전문가입니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_18_4",
          Id: "reviewer_18_004",
          nickname: "구매평마스터",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          memo: "다양한 제품의 구매평 작성 경험이 풍부합니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_18_5",
          Id: "reviewer_18_005",
          nickname: "제한된구매평계정",
          userType: "리뷰어",
          profileImage: "",
          memberType: "이용 제한",
          memo: "이용 제한 계정입니다.",
          selectionStatus: "이용제한 계정",
          channel: "기본",
        },
        {
          id: "app_18_6",
          Id: "reviewer_18_006",
          nickname: "신규구매평러",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "구매평 작성이 처음이지만 열정이 넘칩니다.",
          selectionStatus: "미선택",
          channel: "기본",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_18_1",
          Id: "selected_18_001",
          nickname: "선정된구매평전문가1",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "이미 선정된 우수 구매평 작성자입니다.",
          selectionStatus: "선정하기",
          channel: "기본",
        },
        {
          id: "sel_18_2",
          Id: "selected_18_002",
          nickname: "프로구매평러",
          userType: "인플루언서",
          profileImage: "",
          memberType: "모범 회원",
          memo: "구매평 작성 경험이 풍부한 전문가입니다.",
          selectionStatus: "선정하기",
          channel: "기본",
        },
      ],
    },
  },
  // 진행(콘텐츠 없음 표시용)
  {
    campaignInfo: {
      id: "964",
      title: "[진행] 구매평 캠페인 진행",
      image: "/images/main/campaign_img/eximg_5.png",
      status: "진행 중" as const,
      campaignType: "구매평",
      category: "식품",
      brandName: "기본",
      recruitmentPeriod: "2025-10-22 ~ 2025-11-02",
      announcementDate: "2025-11-02",
      purchasePeriod: "2025-11-03 ~ 2025-11-05",
      registrationPeriod: "2025-11-04 ~ 2025-11-12",
      recruitedCount: 6,
      totalCount: 10,
      daysLeft: 4,
      statusText: "캠페인 당첨자를 선정해 주세요.",
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
  // 예정(대기 중)
  {
    campaignInfo: {
      id: "953",
      title: "[예정] 구매평 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_5.png",
      status: "대기 중" as const,
      campaignType: "구매평",
      category: "식품",
      brandName: "기본",
      recruitmentPeriod: "2025-11-05 ~ 2025-11-12",
      announcementDate: "2025-11-12",
      purchasePeriod: "2025-11-13 ~ 2025-11-15",
      registrationPeriod: "2025-11-14 ~ 2025-11-22",
      recruitedCount: 0,
      totalCount: 6,
      daysLeft: 7,
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
  // 신청(모집 중)
  {
    campaignInfo: {
      id: "973",
      title: "[신청] 구매평 샘플 캠페인",
      image: "/images/main/campaign_img/eximg_5.png",
      status: "모집 중" as const,
      campaignType: "구매평",
      category: "식품",
      brandName: "기본",
      recruitmentPeriod: "2025-11-03 ~ 2025-11-13",
      announcementDate: "2025-11-13",
      purchasePeriod: "2025-11-14 ~ 2025-11-16",
      registrationPeriod: "2025-11-15 ~ 2025-11-23",
      recruitedCount: 1,
      totalCount: 8,
      daysLeft: 11,
    },
    applicantData: {
      applicants: [
        {
          id: "app_973_basic_001",
          Id: "basic_973_001",
          nickname: "구매평러A",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "구매 후기 경험 다수",
          selectionStatus: "미선택",
          channel: "기본",
        },
        {
          id: "app_973_basic_002",
          Id: "basic_973_002",
          nickname: "성실리뷰B",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "사진 포함 상세 후기",
          selectionStatus: "미선택",
          channel: "기본",
        },
      ],
      selectedApplicants: [
        {
          id: "sel_973_basic_001",
          Id: "basic_sel_973_001",
          nickname: "선정구매평C",
          userType: "리뷰어",
          profileImage: "",
          memberType: "모범 회원",
          memo: "브랜드 톤 적합",
          selectionStatus: "선정하기",
          channel: "기본",
        },
      ],
    },
  },
]; */

/* ========================================
   🏬 방문형 캠페인 등록 함수
   - 폼 데이터를 CampaignWithApplicants 형태로 변환
   ======================================== */

/**
 * 새 방문형 캠페인 ID 생성
 *
 * @returns 새로운 캠페인 ID (기존 ID 중 최대값 + 1)
 */
function generateNewVisitCampaignId(): string {
  // 기존 캠페인 ID 중 최대값 찾기
  const existingIds = visitCampaigns
    .map((c) => parseInt(c.campaignInfo.id))
    .filter((id) => !isNaN(id));
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 900;

  return String(maxId + 1);
}

/**
 * 폼 데이터를 VisitCampaignDataItem 형태로 변환하여 새 방문형 캠페인 생성
 *
 * 설명:
 * - 방문형 캠페인 등록 폼에서 입력한 데이터를 visitCampaigns 구조에 맞게 변환합니다.
 * - 새 캠페인 ID를 자동 생성합니다.
 * - VisitCampaignDataItem 인터페이스를 사용하여 통일된 구조로 생성합니다.
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL (첫 번째 이미지 사용)
 * @returns 새로 생성된 VisitCampaignDataItem 객체 (CampaignWithApplicants와 호환됨)
 */
export function createVisitCampaign(
  formData: CampaignFormData,
  imageUrl: string = '/images/main/campaign_img/eximg_2.png',
): VisitCampaignDataItem {
  // 새 캠페인 ID 생성
  const newId = generateNewVisitCampaignId();

  // 선정 날짜까지 남은 일수 계산
  const daysLeft = formData.announcementDate
    ? calculateDaysLeft(formData.announcementDate.split(' ')[0])
    : 0;

  // 모집 인원을 숫자로 변환
  const totalCount = Number(formData.recruitmentCount) || 0;

  // 캠페인 상태 결정 함수 호출
  const campaignStatus = calculateCampaignStatus(
    formData.recruitmentPeriod,
    formData.announcementDate,
  );

  // 플랫폼명 정규화 (공백 제거하여 로고 매핑 일치시키기)
  const normalizedBrandName = formData.platform
    ? formData.platform.replace(/\s+/g, '')
    : '기본';

  return {
    campaignInfo: {
      id: newId,
      title: formData.title,
      image: imageUrl,
      status: campaignStatus,
      campaignType: '방문형',
      category: formData.category || '기타',
      brandName: normalizedBrandName,
      recruitmentPeriod: formData.recruitmentPeriod,
      announcementDate: formData.announcementDate,
      registrationPeriod: formData.registrationPeriod,
      recruitedCount: 0,
      totalCount: totalCount,
      daysLeft: daysLeft,
    },
    applicantData: {
      applicants: [],
      selectedApplicants: [],
    },
  };
}

/**
 * 방문형 캠페인 수정
 *
 * 설명:
 * - 기존 방문형 캠페인을 수정합니다.
 * - 캠페인 ID는 유지하고, 나머지 정보만 업데이트합니다.
 * - 신청자 데이터는 유지합니다.
 * - VisitCampaignDataItem 인터페이스를 사용하여 통일된 구조로 반환합니다.
 *
 * @param campaignId - 수정할 캠페인 ID
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 수정된 VisitCampaignDataItem 객체 (CampaignWithApplicants와 호환됨)
 */
export function updateVisitCampaign(
  campaignId: string,
  formData: CampaignFormData,
  imageUrl: string = '/images/main/campaign_img/eximg_2.png',
): VisitCampaignDataItem {
  // 기존 캠페인 데이터 찾기
  const existingCampaign = visitCampaigns.find(
    (c) => c.campaignInfo.id === campaignId,
  );

  // 기존 신청자 데이터 유지
  const existingApplicantData = existingCampaign?.applicantData || {
    applicants: [],
    selectedApplicants: [],
  };

  // 선정 날짜까지 남은 일수 계산
  const daysLeft = formData.announcementDate
    ? calculateDaysLeft(formData.announcementDate.split(' ')[0])
    : 0;

  // 모집 인원을 숫자로 변환
  const totalCount = Number(formData.recruitmentCount) || 0;

  // 캠페인 상태 결정 함수 호출
  const campaignStatus = calculateCampaignStatus(
    formData.recruitmentPeriod,
    formData.announcementDate,
  );

  // 플랫폼명 정규화 (공백 제거하여 로고 매핑 일치시키기)
  const normalizedBrandName = formData.platform
    ? formData.platform.replace(/\s+/g, '')
    : '기본';

  return {
    campaignInfo: {
      id: campaignId, // 기존 ID 유지
      title: formData.title,
      image: imageUrl,
      status: campaignStatus,
      campaignType: '방문형',
      category: formData.category || '기타',
      brandName: normalizedBrandName,
      recruitmentPeriod: formData.recruitmentPeriod,
      announcementDate: formData.announcementDate,
      registrationPeriod: formData.registrationPeriod,
      recruitedCount: existingApplicantData?.applicants?.length ?? 0, // 자동 계산 (applicantData.applicants.length)
      totalCount: totalCount,
      daysLeft: daysLeft,
    },
    applicantData: existingApplicantData, // 기존 신청자 데이터 유지
  };
}

/**
 * 새 방문형 캠페인을 visitCampaigns 배열에 추가
 *
 * 설명:
 * - VisitCampaignDataItem 인터페이스를 사용하여 통일된 구조로 캠페인을 생성합니다.
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 VisitCampaignDataItem 객체 (CampaignWithApplicants와 호환됨)
 */
export function addVisitCampaign(
  formData: CampaignFormData,
  imageUrl: string = '/images/main/campaign_img/eximg_2.png',
): VisitCampaignDataItem {
  return createVisitCampaign(formData, imageUrl);
}
