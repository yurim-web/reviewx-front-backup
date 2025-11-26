/* ========================================
   📊 Manager GA 대시보드 데이터
   ======================================== */

/**
 * Manager GA 대시보드의 모든 통계 데이터를 관리하는 파일
 *
 * 목적: 대시보드에 표시되는 모든 수치 데이터를 한 곳에서 관리
 *
 * 사용 방법:
 * import { campaignStats, memberTypeData, ... } from '@/data/manager_ga/dashboard/dashboardData';
 */

/* ========================================
   📈 캠페인 통계 데이터
   ======================================== */

import { StatCardData } from '@/components/manager_ga/dashboard/StatCard';

// 캠페인 관리 요약 통계 데이터
export const campaignStats: StatCardData[] = [
  {
    title: '캠페인 모집률',
    value: '97%',
    change: '- 0%',
    changeType: 'neutral',
    progress: 97,
  },
  {
    title: '캠페인 달성률',
    value: '92%',
    change: '↑ 50%',
    changeType: 'positive',
    progress: 92,
  },
  {
    title: '캠페인 반려율',
    value: '10%',
    change: '↑ 50%',
    changeType: 'negative',
    progress: 10,
  },
  {
    title: '캠페인 신고율',
    value: '5%',
    change: '↓ 50%',
    changeType: 'negative',
    progress: 5,
    progressColor: 'red',
  },
];

/* ========================================
   👥 회원 유형 통계 데이터
   ======================================== */

// 회원 유형 막대 차트 데이터 타입
export interface MemberTypeBarData {
  category: string; // 카테고리명 (막대 이름)
  partner: number; // 파트너 비율
  reviewer: number; // 리뷰어 비율
  dormant: number; // 휴면 회원 비율
}

// 회원 유형 막대 차트 데이터
export const memberTypeBarData: MemberTypeBarData[] = [
  {
    category: '전체',
    partner: 5.6, // 파트너 비율 (566/10155)
    reviewer: 94.4, // 리뷰어 비율 (9589/10155)
    dormant: 0.1, // 휴면 회원 비율 (10/10155)
  },
  {
    category: '활성',
    partner: 2.6, // 활성 파트너 비율 (267/10155)
    reviewer: 74.7, // 활성 리뷰어 비율 (7589/10155)
    dormant: 22.7, // 나머지
  },
];

// 회원 유형 섹션 통계 데이터
export interface MemberTypeStats {
  totalMembers: {
    label: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
  activePartners: {
    label: string;
    value: string;
    percentage: string;
  };
  totalReviewers: {
    label: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
  activeReviewers: {
    label: string;
    value: string;
    percentage: string;
  };
}

export const memberTypeStats: MemberTypeStats = {
  totalMembers: {
    label: '전체 회원 수',
    value: '10,155명',
    change: '↑ 50%',
    changeType: 'positive',
  },
  activePartners: {
    label: '활성 파트너 수',
    value: '566명',
    percentage: '(49%)',
  },
  totalReviewers: {
    label: '전체 리뷰어 수',
    value: '9,589명',
    change: '-0%',
    changeType: 'neutral',
  },
  activeReviewers: {
    label: '활성 리뷰어 수',
    value: '10명',
    percentage: '(82%)',
  },
};

/* ========================================
   📱 채널별 회원 통계 데이터
   ======================================== */

// 채널별 회원 파이 차트 데이터 타입
export interface ChannelData {
  name: string; // 채널명
  value: number; // 비율 값
  count: number; // 회원 수
}

// 채널별 회원 파이 차트 데이터
export const channelData: ChannelData[] = [
  { name: '블로그', value: 50, count: 12589 }, // 블로그 등록 50%
  { name: '인스타그램', value: 25, count: 10124 }, // 인스타그램 등록 25%
  { name: '클립', value: 20, count: 8869 }, // 클립 등록 20%
  { name: '유튜브', value: 5, count: 569 }, // 유튜브 등록 5%
];

// 채널별 회원 섹션 통계 데이터
export interface ChannelMemberStats {
  blog: {
    label: string;
    value: string;
    percentage: string;
  };
  instagram: {
    label: string;
    value: string;
    percentage: string;
  };
  clip: {
    label: string;
    value: string;
    percentage: string;
  };
  youtube: {
    label: string;
    value: string;
    percentage: string;
  };
}

export const channelMemberStats: ChannelMemberStats = {
  blog: {
    label: '블로그 등록',
    value: '12,589명',
    percentage: '(50%)',
  },
  instagram: {
    label: '인스타그램 등록',
    value: '10,124명',
    percentage: '(25%)',
  },
  clip: {
    label: '클립 등록',
    value: '8,869명',
    percentage: '(20%)',
  },
  youtube: {
    label: '유튜브 등록',
    value: '569명',
    percentage: '(5%)',
  },
};

/* ========================================
   📊 접속 통계 데이터
   ======================================== */

// 접속 통계 데이터
export interface AccessStats {
  visits: {
    label: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
  referrals: {
    label: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
}

export const accessStats: AccessStats = {
  visits: {
    label: '방문 수',
    value: '11,150회',
    change: '↑ 50%',
    changeType: 'positive',
  },
  referrals: {
    label: '유입 수',
    value: '150회',
    change: '↓ 50%',
    changeType: 'negative',
  },
};

/* ========================================
   💻 디바이스 통계 데이터
   ======================================== */

// 디바이스 색상 키 타입
export type DeviceColorKey = 'pc' | 'tablet' | 'mobile' | 'app';

// 진행 바 세그먼트 타입 (All 막대에서 사용)
export interface DeviceSegment {
  id: string;
  percentage: number;
  colorKey: DeviceColorKey;
  description: string;
}

// 진행 바에 사용할 데이터 타입
export interface DeviceProgress {
  label: string; // 화면에 보여줄 디바이스명
  percentage?: number; // 진행률 (0~100) - 단일 막대용
  colorKey?: DeviceColorKey; // 색상 구분용 키
  description: string; // 접근성 설명 (스크린리더용)
  segments?: DeviceSegment[]; // All 막대처럼 여러 세그먼트를 표시할 때 사용
}

// 기본 디바이스 진행률 데이터
const baseDeviceProgressData: DeviceProgress[] = [
  {
    label: 'PC',
    percentage: 70,
    colorKey: 'pc',
    description: 'PC 접속 비율 70%',
  },
  {
    label: 'Tablet',
    percentage: 25,
    colorKey: 'tablet',
    description: '태블릿 접속 비율 25%',
  },
  {
    label: 'Mobile',
    percentage: 55,
    colorKey: 'mobile',
    description: '모바일 접속 비율 55%',
  },
  {
    label: 'App',
    percentage: 60,
    colorKey: 'app',
    description: '앱 접속 비율 60%',
  },
];

// All 막대용 세그먼트 계산 (각 디바이스 비율을 전체 합계 대비 백분율로 환산)
const totalPercentage = baseDeviceProgressData.reduce(
  (sum, device) => sum + (device.percentage || 0),
  0,
);

const allDeviceSegments: DeviceSegment[] = baseDeviceProgressData.map(
  (device) => ({
    id: device.label,
    percentage: Number(
      (((device.percentage || 0) / totalPercentage) * 100).toFixed(2),
    ),
    colorKey: device.colorKey || 'pc',
    description: device.description,
  }),
);

// All 막대를 포함한 최종 디바이스 진행률 데이터
export const deviceProgressData: DeviceProgress[] = [
  {
    label: 'All',
    description: '전체 디바이스 접속 비율',
    segments: allDeviceSegments,
  },
  ...baseDeviceProgressData,
];

/* ========================================
   🍩 회원 활성화 통계 데이터
   ======================================== */

// 회원 활성화 도넛 차트 데이터 타입
export interface DonutData {
  name: string; // 섹션 이름 (활성화, 비활성화)
  value: number; // 비율 값
}

// 회원 활성화 도넛 차트 데이터
export const memberActivationDonutData: DonutData[] = [
  { name: '활성화', value: 70 }, // 활성화 비율 68%
  { name: '비활성화', value: 30 }, // 비활성화 비율 32%
];

// 회원 활성화 섹션 통계 데이터
export interface MemberActivationStats {
  totalMembers: {
    label: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
  activeMembers: {
    label: string;
    value: string;
    percentage: string;
  };
  inactiveMembers: {
    label: string;
    value: string;
    percentage: string;
  };
}

export const memberActivationStats: MemberActivationStats = {
  totalMembers: {
    label: '전체 회원 수',
    value: '12,589명',
    change: '↑ 50%',
    changeType: 'positive',
  },
  activeMembers: {
    label: '활성 회원 수',
    value: '8,869명',
    percentage: '(68%)',
  },
  inactiveMembers: {
    label: '비활성 회원 수',
    value: '3,720명',
    percentage: '(32%)',
  },
};
