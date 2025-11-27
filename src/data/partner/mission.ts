/* ========================================
   🎯 미션형 캠페인 데이터 타입 정의
   ======================================== */

/**
 * 미션형 캠페인 데이터 타입 정의
 *
 * 이 파일에서 사용하는 모든 미션형 캠페인 데이터의 타입을 정의합니다.
 * 공통 타입은 sharedCampaigns.ts에서 import하여 사용합니다.
 */

import type { CampaignWithApplicants } from './campaign_application/delivery_applicants';
import type { CampaignWithContents } from './sharedCampaigns';
import type { ContentByTab, ContentItem } from './sharedCampaigns';
import { CampaignFormData } from '@/types/user/user';
import { calculateCampaignStatus, calculateDaysLeft } from './delivery';

/**
 * 미션형 캠페인 통합 데이터 구조
 *
 * 미션형 캠페인의 모든 상태(종료/취소/진행/예정/신청)를 하나의 구조로 통일합니다.
 * - 종료/취소 캠페인: campaignInfo + contents (필수)
 * - 진행/예정/신청 캠페인: campaignInfo + applicantData (필수) + contents (선택)
 */
export interface MissionCampaignDataItem {
  campaignInfo: {
    id: string; // 캠페인 고유 식별자
    title: string; // 캠페인 제목
    image: string; // 메인 캠페인 이미지 경로
    status: '진행 중' | '대기 중' | '모집 중' | '종료' | '취소'; // 캠페인 상태 (모든 상태 포함)
    campaignType: '미션형'; // 캠페인 타입 (미션형 고정)
    category: string; // 캠페인 카테고리 (뷰티, 식품, 생활 등)
    brandName: string; // 브랜드명 (플랫폼명, 미션형은 보통 빈 문자열)
    recruitmentPeriod: string; // 모집 기간 (예: "2024-01-12 ~ 2024-01-20")
    announcementDate: string; // 선정 발표일 (예: "2024-01-20")
    registrationPeriod: string; // 등록 기간 (예: "2024-01-22 ~ 2024-01-30")
    recruitedCount: number; // 현재 모집된 인원 수 (자동 계산됨)
    totalCount: number; // 총 모집 인원 수
    daysLeft: number; // 남은 일수 (양수면 남은 일수, 음수면 지난 일수)
    statusText?: string; // 상태 텍스트 (예: "캠페인 콘텐츠를 검수해 주세요.", 선택사항)
    partnerName?: string; // 파트너명 (예: "(주)미션프로모션")
    point?: number; // 지급 포인트 (선택사항)
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
      memo: string; // 메모
      selectionStatus: '미선택' | '선정하기' | '이용제한 계정'; // 선정 상태
      channel: string; // 채널 정보 (기본)
    }>;
    selectedApplicants: Array<{
      id: string; // 선정된 신청자 고유 식별자
      Id: string; // 선정된 신청자 내부 ID
      nickname: string; // 신청자 닉네임
      userType: '리뷰어' | '인플루언서'; // 사용자 타입
      profileImage: string; // 프로필 이미지 경로
      memberType: '모범 회원' | '주의 회원' | '경고 회원' | '이용 제한'; // 회원 타입
      memo: string; // 메모
      selectionStatus: '선정하기'; // 선정 상태 (선정된 신청자는 "선정하기" 고정)
      channel: string; // 채널 정보 (기본)
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
      actionType?: string | number; // 액션 타입 (미션형은 "2" 고정)
      missionType?: string; // 미션 타입 ("1": 이미지+링크 확인, "4": 반려, "7": 완료)
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
      actionType?: string | number; // 액션 타입 (미션형은 "2" 고정)
      missionType?: string; // 미션 타입 ("7": 완료)
      updatedAt?: string; // 수정일시 (선택사항)
      isLate?: boolean; // 지연 여부 (선택사항)
    }>;
  };
}

/**
 * 미션형 캠페인 종료/취소 데이터 타입
 *
 * 종료되거나 취소된 미션형 캠페인의 데이터 구조입니다.
 * MissionCampaignDataItem[] 타입을 사용하여 통일된 구조로 관리합니다.
 */
export type MissionClosedCampaignData = MissionCampaignDataItem[];

/**
 * 미션형 캠페인 진행/예정/신청 데이터 타입
 *
 * 진행 중, 예정, 신청 중인 미션형 캠페인의 데이터 구조입니다.
 * MissionCampaignDataItem[] 타입을 사용하여 통일된 구조로 관리합니다.
 */
export type MissionCampaignData = MissionCampaignDataItem[];

/* ========================================
   🎯 미션형 캠페인 데이터 (캠페인 info + 신청 카드 + 콘텐츠)
   - sharedCampaigns.ts에서 타입별 데이터 분리
   - MissionCampaignDataItem 인터페이스로 통일된 구조 사용
   ======================================== */

export const missionCampaigns: MissionCampaignDataItem[] = [
  // 진행 탭(진행 중) - 기존 미션형 캠페인 (콘텐츠 있음)
  {
    campaignInfo: {
      id: '16',
      title: '화장품 브랜드 미션형 모집',
      image: '/images/main/campaign_img/eximg_4.png',
      status: '진행 중',
      campaignType: '미션형',
      category: '뷰티',
      brandName: '',
      partnerName: '(주)미션프로모션',
      recruitmentPeriod: '2024-01-12 ~ 2024-01-20',
      announcementDate: '2024-01-20',
      registrationPeriod: '2024-01-22 ~ 2024-01-30',
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 10,
      daysLeft: 5,
      statusText: '캠페인 콘텐츠를 검수해 주세요.',
      point: 12000, // 지급 포인트
    },
    applicantData: {
      applicants: [
        {
          id: 'app_16_1',
          Id: 'reviewer_16_001',
          nickname: '미션리뷰어1',
          userType: '리뷰어',
          profileImage: '',
          memberType: '모범 회원',
          memo: '화장품 미션에 관심이 많습니다.',
          selectionStatus: '미선택',
          channel: '기본',
        },
        {
          id: 'app_16_2',
          Id: 'reviewer_16_002',
          nickname: '뷰티미션러',
          userType: '리뷰어',
          profileImage: '',
          memberType: '모범 회원',
          memo: '뷰티 제품 미션을 자주 참여합니다.',
          selectionStatus: '미선택',
          channel: '기본',
        },
        {
          id: 'app_16_3',
          Id: 'reviewer_16_003',
          nickname: '스킨케어전문가',
          userType: '리뷰어',
          profileImage: '',
          memberType: '모범 회원',
          memo: '스킨케어 제품 미션 전문가입니다.',
          selectionStatus: '미선택',
          channel: '기본',
        },
        {
          id: 'app_16_4',
          Id: 'reviewer_16_004',
          nickname: '미션마스터',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          memo: '다양한 미션에 참여한 경험이 풍부합니다.',
          selectionStatus: '미선택',
          channel: '기본',
        },
        {
          id: 'app_16_5',
          Id: 'reviewer_16_005',
          nickname: '제한된계정',
          userType: '리뷰어',
          profileImage: '',
          memberType: '이용 제한',
          memo: '이용 제한 계정입니다.',
          selectionStatus: '이용제한 계정',
          channel: '기본',
        },
      ],
      selectedApplicants: [
        {
          id: 'sel_16_1',
          Id: 'selected_16_001',
          nickname: '선정된미션러1',
          userType: '리뷰어',
          profileImage: '',
          memberType: '모범 회원',
          memo: '이미 선정된 우수 미션 참여자입니다.',
          selectionStatus: '선정하기',
          channel: '기본',
        },
        {
          id: 'sel_16_2',
          Id: 'selected_16_002',
          nickname: '프로미션러',
          userType: '인플루언서',
          profileImage: '',
          memberType: '모범 회원',
          memo: '미션 수행 경험이 풍부한 전문가입니다.',
          selectionStatus: '선정하기',
          channel: '기본',
        },
      ],
    },
    // 콘텐츠 데이터: 각 캠페인 정보 아래에 콘텐츠 목록 포함
    // 설명: deliveryClosedCampaigns와 동일한 형태로, campaignInfo 아래에 contents를 포함합니다.
    // ID 16번 캠페인은 이미지+링크 확인 버튼 유형(actionType: 2)만 사용합니다.
    // - 검수 상태: missionType 1 (이미지+링크 확인)
    // - 반려 상태: missionType 4 (이미지+링크 확인, 반려됨)
    // - 완료 상태: missionType 7 (이미지+링크 확인, 완료됨)
    contents: {
      reviewing: [
        {
          id: 'm-r-1',
          createdAt: '2025-01-15T16:00:00.000Z',
          status: '검수',
          userType: '리뷰어',
          nickname: '미션리뷰어1',
          channelId: 'mission_user_001',
          channel: '',
          actionType: '2',
          missionType: '1',
        },
        {
          id: 'm-r-2',
          createdAt: '2025-01-15T16:30:00.000Z',
          status: '검수',
          userType: '인플루언서',
          nickname: '미션인플루언서1',
          channelId: 'mission_user_002',
          channel: '',
          actionType: '2',
          missionType: '1',
          updatedAt: '2025-01-15T17:00:00.000Z',
        },
        {
          id: 'm-r-3',
          createdAt: '2025-01-15T17:15:00.000Z',
          status: '검수',
          userType: '리뷰어',
          nickname: '미션리뷰어2',
          channelId: 'mission_user_003',
          channel: '',
          actionType: '2',
          missionType: '4',
          isRejected: true,
        },
        {
          id: 'm-r-4',
          createdAt: '2025-01-15T17:45:00.000Z',
          status: '검수',
          userType: '인플루언서',
          nickname: '미션인플루언서2',
          channelId: 'mission_user_004',
          channel: '',
          actionType: '2',
          missionType: '1',
          isLate: true,
        },
        {
          id: 'm-r-5',
          createdAt: '2025-01-15T18:10:00.000Z',
          status: '검수',
          userType: '리뷰어',
          nickname: '미션리뷰어3',
          channelId: 'mission_user_005',
          channel: '',
          actionType: '2',
          missionType: '4',
          isRejected: true,
        },
        {
          id: 'm-r-6',
          createdAt: '2025-01-15T18:30:00.000Z',
          status: '검수',
          userType: '인플루언서',
          nickname: '미션인플루언서3',
          channelId: 'mission_user_006',
          channel: '',
          actionType: '2',
          missionType: '4',
          isRejected: true,
        },
      ],
      completed: [
        {
          id: 'm-c-1',
          createdAt: '2025-01-13T09:00:00.000Z',
          status: '완료',
          userType: '리뷰어',
          nickname: '미션완료리뷰어1',
          channelId: 'mission_user_005',
          channel: '',
          actionType: '2',
          missionType: '7',
        },
        {
          id: 'm-c-2',
          createdAt: '2025-01-13T10:00:00.000Z',
          status: '완료',
          userType: '인플루언서',
          nickname: '미션완료인플루언서1',
          channelId: 'mission_user_006',
          channel: '',
          actionType: '2',
          missionType: '7',
          updatedAt: '2025-01-13T11:00:00.000Z',
        },
        {
          id: 'm-c-3',
          createdAt: '2025-01-13T11:30:00.000Z',
          status: '완료',
          userType: '리뷰어',
          nickname: '미션완료리뷰어2',
          channelId: 'mission_user_007',
          channel: '',
          actionType: '2',
          missionType: '7',
          isLate: true,
        },
      ],
    },
  },

  // 진행 탭(진행 중) - 콘텐츠 있음 (2버튼 표시)
  {
    campaignInfo: {
      id: '965',
      title: '[진행] 미션형 새 테스트 캠페인',
      image: '/images/main/campaign_img/eximg_4.png',
      status: '진행 중' as const,
      campaignType: '미션형',
      category: '뷰티',
      brandName: '',
      partnerName: '(주)미션프로모션',
      recruitmentPeriod: '2025-10-25 ~ 2025-11-05',
      announcementDate: '2025-11-05',
      registrationPeriod: '2025-11-06 ~ 2025-11-14',
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 12,
      daysLeft: 5,
      statusText: '캠페인 콘텐츠를 검수해 주세요.',
      point: 15000, // 지급 포인트
    },
    applicantData: { applicants: [], selectedApplicants: [] },
    // 콘텐츠 데이터: 각 캠페인 정보 아래에 콘텐츠 목록 포함
    // 설명: deliveryClosedCampaigns와 동일한 형태로, campaignInfo 아래에 contents를 포함합니다.
    // ID 965번 캠페인도 이미지+링크 확인 버튼 유형(actionType: 2)만 사용합니다.
    contents: {
      reviewing: [
        {
          id: '965-r-1',
          createdAt: '2025-11-03T10:00:00.000Z',
          status: '검수',
          userType: '리뷰어',
          nickname: '965-검수-이미지+링크',
          channelId: 'ms_965_r_1',
          channel: '',
          actionType: '2',
          missionType: '1',
        },
        {
          id: '965-r-2',
          createdAt: '2025-11-03T10:20:00.000Z',
          status: '검수',
          userType: '리뷰어',
          nickname: '965-검수-이미지+링크',
          channelId: 'ms_965_r_2',
          channel: '',
          actionType: '2',
          missionType: '1',
          updatedAt: '2025-11-03T10:40:00.000Z',
        },
        {
          id: '965-r-3',
          createdAt: '2025-11-03T10:35:00.000Z',
          status: '검수',
          userType: '인플루언서',
          nickname: '965-검수-이미지+링크',
          channelId: 'ms_965_r_3',
          channel: '',
          actionType: '2',
          missionType: '1',
        },
        {
          id: '965-r-4',
          createdAt: '2025-11-03T11:00:00.000Z',
          status: '검수',
          userType: '리뷰어',
          nickname: '965-반려처리-이미지+링크',
          channelId: 'ms_965_r_4',
          channel: '',
          actionType: '2',
          missionType: '4',
          isRejected: true,
        },
        {
          id: '965-r-5',
          createdAt: '2025-11-03T11:15:00.000Z',
          status: '검수',
          userType: '인플루언서',
          nickname: '965-반려처리-이미지+링크',
          channelId: 'ms_965_r_5',
          channel: '',
          actionType: '2',
          missionType: '4',
          isRejected: true,
        },
      ],
      completed: [
        {
          id: '965-c-1',
          createdAt: '2025-11-02T18:40:00.000Z',
          status: '완료',
          userType: '리뷰어',
          nickname: '965-완료-이미지+링크',
          channelId: 'ms_965_c_1',
          channel: '',
          actionType: '2',
          missionType: '7',
        },
        {
          id: '965-c-2',
          createdAt: '2025-11-02T19:00:00.000Z',
          status: '완료',
          userType: '리뷰어',
          nickname: '965-완료-이미지+링크',
          channelId: 'ms_965_c_2',
          channel: '',
          actionType: '2',
          missionType: '7',
          updatedAt: '2025-11-02T19:20:00.000Z',
        },
        {
          id: '965-c-3',
          createdAt: '2025-11-02T19:30:00.000Z',
          status: '완료',
          userType: '인플루언서',
          nickname: '965-완료-이미지+링크',
          channelId: 'ms_965_c_3',
          channel: '',
          actionType: '2',
          missionType: '7',
          isLate: true,
        },
      ],
    },
  },

  // 신청 탭(모집 중)
  {
    campaignInfo: {
      id: '975',
      title: '[신청] 미션형 샘플 캠페인',
      image: '/images/main/campaign_img/eximg_4.png',
      status: '모집 중' as const,
      campaignType: '미션형',
      category: '뷰티',
      brandName: '',
      partnerName: '(주)미션프로모션',
      recruitmentPeriod: '2025-11-05 ~ 2025-11-15',
      announcementDate: '2025-11-15',
      registrationPeriod: '2025-11-17 ~ 2025-11-25',
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 10,
      daysLeft: 13,
      point: 10000, // 지급 포인트
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },

  // 예정 탭(대기 중)
  {
    campaignInfo: {
      id: '954',
      title: '[예정] 미션형 샘플 캠페인',
      image: '/images/main/campaign_img/eximg_4.png',
      status: '대기 중' as const,
      campaignType: '미션형',
      category: '뷰티',
      brandName: '',
      partnerName: '(주)미션프로모션',
      recruitmentPeriod: '2025-11-06 ~ 2025-11-16',
      announcementDate: '2025-11-16',
      registrationPeriod: '2025-11-18 ~ 2025-11-26',
      recruitedCount: 0, // 자동 계산됨 (applicantData.applicants.length)
      totalCount: 10,
      daysLeft: 8,
      point: 11000, // 지급 포인트
    },
    applicantData: { applicants: [], selectedApplicants: [] },
  },
];

/* ========================================
   📊 신청자 수 자동 계산 로직
   - 각 캠페인의 recruitedCount를 applicantData.applicants 배열 길이로 자동 설정
   - 데이터 일관성을 유지하기 위해 배열 정의 직후 실행됩니다
   ======================================== */

/**
 * missionCampaigns 배열의 각 캠페인에 대해 recruitedCount를 자동 계산합니다
 *
 * 설명:
 * - 각 캠페인의 applicantData.applicants 배열의 길이를 계산하여
 *   campaignInfo.recruitedCount에 자동으로 설정합니다.
 * - 이렇게 하면 신청자 데이터를 추가/제거할 때마다 수동으로 숫자를 맞출 필요가 없습니다.
 */
missionCampaigns.forEach((campaign) => {
  // 각 캠페인의 신청자 배열 길이를 계산하여 recruitedCount에 설정
  // 설명: applicantData.applicants가 undefined일 수 있으므로 옵셔널 체이닝(?.)과 널 병합 연산자(??)를 사용
  // applicants가 없으면 빈 배열([])로 간주하고, 그 길이는 0이 됩니다
  campaign.campaignInfo.recruitedCount =
    campaign.applicantData?.applicants?.length ?? 0;
});

/* ========================================
   🎯 미션형 (종료/취소) 콘텐츠 데이터
   - closedCampaigns.ts 병합용
   - MissionCampaignDataItem 인터페이스로 통일된 구조 사용
   ======================================== */
export const missionClosedCampaigns: MissionCampaignDataItem[] = [
  {
    campaignInfo: {
      id: '904',
      title: '[취소] 미션형 캠페인 - 이미지/링크',
      image: '/images/main/campaign_img/eximg_4.png',
      status: '취소',
      campaignType: '미션형',
      category: '뷰티',
      brandName: '',
      partnerName: '(주)미션프로모션',
      recruitmentPeriod: '2024-04-10 ~ 2024-04-16',
      announcementDate: '2024-04-16',
      registrationPeriod: '2024-04-18 ~ 2024-04-24',
      recruitedCount: 0,
      totalCount: 10,
      daysLeft: -5,
      statusText: '캠페인을 취소하였습니다.',
      point: 0, // 취소된 캠페인은 포인트 0
    },
    contents: {
      reviewing: [
        {
          id: '904-r-1',
          createdAt: '2025-10-28T09:05:00.000Z',
          status: '검수',
          userType: '리뷰어',
          nickname: '미션-1',
          channelId: 'ms_904_r_1',
          channel: '',
          actionType: '2',
          missionType: '1',
          updatedAt: '2025-10-28T09:20:00.000Z',
        },
        {
          id: '904-r-2',
          createdAt: '2025-10-28T09:15:00.000Z',
          status: '검수',
          userType: '리뷰어',
          nickname: '미션-2',
          channelId: 'ms_904_r_2',
          channel: '',
          actionType: '2',
          missionType: '4',
          isRejected: true,
        },
        {
          id: '904-r-3',
          createdAt: '2025-10-28T09:25:00.000Z',
          status: '검수',
          userType: '리뷰어',
          nickname: '미션-3',
          channelId: 'ms_904_r_3',
          channel: '',
          actionType: '2',
          missionType: '1',
        },
        {
          id: '904-r-4',
          createdAt: '2025-10-28T09:35:00.000Z',
          status: '검수',
          userType: '리뷰어',
          nickname: '미션-4',
          channelId: 'ms_904_r_4',
          channel: '',
          actionType: '2',
          missionType: '1',
          isLate: true,
        },
      ],
      completed: [
        {
          id: '904-c-1',
          createdAt: '2025-10-27T17:30:00.000Z',
          status: '완료',
          userType: '리뷰어',
          nickname: '미션-4',
          channelId: 'ms_904_c_1',
          channel: '',
          actionType: '2',
          missionType: '7',
          updatedAt: '2025-10-27T17:50:00.000Z',
        },
        {
          id: '904-c-2',
          createdAt: '2025-10-27T17:45:00.000Z',
          status: '완료',
          userType: '리뷰어',
          nickname: '미션-5',
          channelId: 'ms_904_c_2',
          channel: '',
          actionType: '2',
          missionType: '7',
        },
        {
          id: '904-c-3',
          createdAt: '2025-10-27T18:00:00.000Z',
          status: '완료',
          userType: '리뷰어',
          nickname: '미션-6',
          channelId: 'ms_904_c_3',
          channel: '',
          actionType: '2',
          missionType: '7',
          isLate: true,
        },
        {
          id: '904-c-4',
          createdAt: '2025-10-27T18:15:00.000Z',
          status: '완료',
          userType: '리뷰어',
          nickname: '미션-7',
          channelId: 'ms_904_c_4',
          channel: '',
          actionType: '2',
          missionType: '7',
        },
        {
          id: '904-c-5',
          createdAt: '2025-10-27T18:30:00.000Z',
          status: '완료',
          userType: '리뷰어',
          nickname: '미션-8',
          channelId: 'ms_904_c_5',
          channel: '',
          actionType: '2',
          missionType: '7',
        },
      ],
    },
  },
];

/* ========================================
   🎯 미션형 콘텐츠 조회 함수
   - 진행 중인 캠페인의 콘텐츠 데이터를 조회합니다
   ======================================== */

/**
 * 미션형 캠페인의 콘텐츠 데이터를 조회하는 함수
 *
 * 설명:
 * - 캠페인 ID를 받아서 해당 캠페인의 콘텐츠(검수 중/완료)를 반환합니다.
 * - 종료/취소된 캠페인은 getClosedContentsById 함수를 사용합니다.
 * - 진행 중인 캠페인은 missionCampaigns 배열에서 해당 ID를 찾아 contents를 반환합니다.
 * - 각 캠페인 데이터가 campaignInfo 아래에 contents를 포함하는 구조입니다.
 *
 * 반환 타입: ContentByTab
 * - reviewing: 검수 중인 콘텐츠 배열
 * - completed: 완료된 콘텐츠 배열
 *
 * 학습 포인트:
 * - 함수 매개변수: campaignId (캠페인 ID)
 * - 조건부 반환: if 문으로 특정 ID에 대한 처리
 * - 배열 메서드: find() 메서드로 배열에서 특정 조건의 요소를 찾습니다.
 * - 옵셔널 체이닝: ?. 연산자로 안전하게 속성에 접근합니다.
 * - 널 병합 연산자: ?? 연산자로 기본값을 제공합니다.
 *
 * @param campaignId - 조회할 캠페인의 ID
 * @returns 검수 중/완료된 콘텐츠를 담은 객체
 */
export function getMissionContentsById(campaignId: string): ContentByTab {
  // 종료/취소 탭 데이터(미션형): 904 매핑
  // 설명: 종료/취소된 캠페인은 missionClosedCampaigns를 직접 참조 (순환 참조 방지)
  if (campaignId === '904') {
    const closedCampaign = missionClosedCampaigns.find(
      (c) => c.campaignInfo.id === campaignId,
    );
    if (closedCampaign?.contents) {
      return closedCampaign.contents;
    }
    return { reviewing: [], completed: [] };
  }

  // 진행 중인 캠페인의 콘텐츠 조회
  // 설명: missionCampaigns 배열에서 해당 ID의 캠페인을 찾아서 contents를 반환합니다.
  // find() 메서드: 배열에서 조건에 맞는 첫 번째 요소를 반환합니다.
  const campaign = missionCampaigns.find(
    (c) => c.campaignInfo.id === campaignId,
  );

  // 캠페인을 찾았고 contents가 있으면 반환
  // 옵셔널 체이닝(?.)과 널 병합 연산자(??)를 사용해 안전하게 값을 가져옵니다.
  if (campaign?.contents) {
    return campaign.contents;
  }

  // 콘텐츠가 없는 경우 빈 배열 반환
  // 설명: 진행 중이지만 아직 콘텐츠가 업로드되지 않은 경우입니다.
  return { reviewing: [], completed: [] };
}

/* ========================================
   🎯 미션형 캠페인 등록 함수
   - 폼 데이터를 CampaignWithApplicants 형태로 변환
   ======================================== */

/**
 * 새 미션형 캠페인 ID 생성
 *
 * @returns 새로운 캠페인 ID (기존 ID 중 최대값 + 1)
 */
function generateNewMissionCampaignId(): string {
  // 기존 캠페인 ID 중 최대값 찾기
  const existingIds = missionCampaigns
    .map((c) => parseInt(c.campaignInfo.id))
    .filter((id) => !isNaN(id));
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 15;

  return String(maxId + 1);
}

/**
 * 폼 데이터를 MissionCampaignDataItem 형태로 변환하여 새 미션형 캠페인 생성
 *
 * 설명:
 * - 미션형 캠페인 등록 폼에서 입력한 데이터를 missionCampaigns 구조에 맞게 변환합니다.
 * - 새 캠페인 ID를 자동 생성합니다.
 * - MissionCampaignDataItem 인터페이스를 사용하여 통일된 구조로 생성합니다.
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL (첫 번째 이미지 사용)
 * @returns 새로 생성된 MissionCampaignDataItem 객체 (CampaignWithApplicants와 호환됨)
 */
export function createMissionCampaign(
  formData: CampaignFormData,
  imageUrl: string = '/images/main/campaign_img/eximg_4.png',
): MissionCampaignDataItem {
  // 새 캠페인 ID 생성
  const newId = generateNewMissionCampaignId();

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

  // 미션형은 플랫폼이 없으므로 빈 문자열 사용
  const normalizedBrandName = '';

  return {
    campaignInfo: {
      id: newId,
      title: formData.title,
      image: imageUrl,
      status: campaignStatus,
      campaignType: '미션형',
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
 * 미션형 캠페인 수정
 *
 * 설명:
 * - 기존 미션형 캠페인을 수정합니다.
 * - 캠페인 ID는 유지하고, 나머지 정보만 업데이트합니다.
 * - 신청자 데이터는 유지합니다.
 * - MissionCampaignDataItem 인터페이스를 사용하여 통일된 구조로 반환합니다.
 *
 * @param campaignId - 수정할 캠페인 ID
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 수정된 MissionCampaignDataItem 객체 (CampaignWithApplicants와 호환됨)
 */
export function updateMissionCampaign(
  campaignId: string,
  formData: CampaignFormData,
  imageUrl: string = '/images/main/campaign_img/eximg_4.png',
): MissionCampaignDataItem {
  // 기존 캠페인 데이터 찾기
  const existingCampaign = missionCampaigns.find(
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

  // 미션형은 플랫폼이 없으므로 빈 문자열 사용
  const normalizedBrandName = '';

  return {
    campaignInfo: {
      id: campaignId, // 기존 ID 유지
      title: formData.title,
      image: imageUrl,
      status: campaignStatus,
      campaignType: '미션형',
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
 * 새 미션형 캠페인을 missionCampaigns 배열에 추가
 *
 * 설명:
 * - MissionCampaignDataItem 인터페이스를 사용하여 통일된 구조로 캠페인을 생성합니다.
 *
 * @param formData - 폼에서 입력받은 캠페인 데이터
 * @param imageUrl - 업로드된 이미지 URL
 * @returns 새로 생성된 MissionCampaignDataItem 객체 (CampaignWithApplicants와 호환됨)
 */
export function addMissionCampaign(
  formData: CampaignFormData,
  imageUrl: string = '/images/main/campaign_img/eximg_4.png',
): MissionCampaignDataItem {
  return createMissionCampaign(formData, imageUrl);
}
