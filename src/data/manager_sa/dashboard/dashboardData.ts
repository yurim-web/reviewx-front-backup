/* ========================================
   📊 Manager SA 대시보드 데이터
   ======================================== */

/**
 * Manager SA 대시보드의 모든 통계 데이터를 관리하는 파일
 *
 * 목적: 대시보드에 표시되는 모든 정적 데이터를 한곳에서 관리
 *
 * 사용 방법:
 * import { settlementStats, paymentStats, ... } from '@/data/manager_sa/dashboard/dashboardData';
 */

/* ========================================
   💰 정산 요약 통계 데이터
   ======================================== */

// 정산 요약 통계 데이터 (title 제외 - title은 SettlementSummarySection 컴포넌트에서 고정값으로 정의됨)
// 사용 위치:
// - src/app/manager_sa/page.tsx (SA 관리자 대시보드 메인 페이지)
// - SettlementSummarySection 컴포넌트에 전달하여 정산 통계 카드를 표시
// 디자인 기준: 3개의 통계를 표시 (출금 요청 금액, 출금 완료 총액, 총 예치금 잔액)
// 주의: title은 SettlementSummarySection 컴포넌트에서 고정값으로 관리됩니다.
export const settlementStats = [
  {
    value: "25,025,470원",
    change: "↑ 50%",
    changeType: "positive" as const,
  },
  {
    value: "28,256,360원",
    change: "↑ 50%",
    changeType: "positive" as const,
  },
  {
    value: "78,256,360원",
    change: "↓ 0%",
    changeType: "neutral" as const,
  },
];

/* ========================================
   💳 결제 요약 통계 데이터
   ======================================== */

// 결제 요약 통계 데이터 (title 제외 - title은 PaymentSummarySection 컴포넌트에서 고정값으로 정의됨)
// 사용 위치:
// - src/app/manager_sa/page.tsx (SA 관리자 대시보드 메인 페이지)
// - PaymentSummarySection 컴포넌트에 전달하여 결제 통계 카드를 표시
// 디자인 기준: 4개의 통계를 표시 (총결제 금액, 입금 증액, 카드 결제 금액, 예상 수수료)
// 주의: title은 PaymentSummarySection 컴포넌트에서 고정값으로 관리됩니다.
export const paymentStats = [
  {
    value: "25,025,470원",
    change: "- 0%",
    changeType: "neutral" as const,
  },
  {
    value: "12,025,470원",
    change: "↑ 1,029%",
    changeType: "positive" as const,
  },
  {
    value: "13,000,000원",
    change: "↑ 1,029%",
    changeType: "negative" as const, // 빨간색으로 표시 (디자인 기준)
  },
  {
    value: "5,025,470원",
    change: "- 0%",
    changeType: "neutral" as const,
  },
];

/* ========================================
   📈 정산/결제 금액 통계 차트 데이터
   ======================================== */

// 차트 데이터 포인트 타입 정의
export interface ChartDataPoint {
  date: string; // 날짜 (예: "11/1")
  value: number; // 금액 값
}

// 정산 금액 통계 차트 데이터
// 사용 위치:
// - src/components/manager_sa/dashboard/chart/SettlementChart.tsx
// 디자인 기준: 왼쪽에서 높게 시작(90M), 11/2 하락(70M), 11/4 상승(95M), 11/5 급락(45M), 11/6 상승(90M), 11/9 하락(36.5M), 11/11 최저(10M 이하)
export const settlementChartData: ChartDataPoint[] = [
  { date: "11/1", value: 90000000 }, // 높게 시작 (9천만)
  { date: "11/2", value: 70000000 }, // 하락 (7천만)
  { date: "11/3", value: 65000000 }, // 하락
  { date: "11/4", value: 95000000 }, // 상승 (9.5천만)
  { date: "11/5", value: 45000000 }, // 급격한 하락 (4.5천만)
  { date: "11/6", value: 90000000 }, // 다시 상승 (9천만)
  { date: "11/7", value: 45000000 }, // 하락
  { date: "11/8", value: 90000000 }, // 계속 하락
  { date: "11/9", value: 36515000 }, // 하락 (11/9) - 디자인에서 이렇게 되어 있는 값
  { date: "11/10", value: 20000000 }, // 급격한 하락 (2천만)
  { date: "11/11", value: 8000000 }, // 계속 하락 (가장 낮음, 8백만)
];

// 결제 금액 통계 차트 데이터
// 사용 위치:
// - src/components/manager_sa/dashboard/chart/PaymentChart.tsx
// 오르락내리락 변동 패턴으로 조정
export const paymentChartData: ChartDataPoint[] = [
  { date: "11/1", value: 30000000 }, // 낮게 시작 (3천만)
  { date: "11/2", value: 50000000 }, // 급격한 상승 (5천만)
  { date: "11/3", value: 35000000 }, // 하락 (3.5천만)
  { date: "11/4", value: 60000000 }, // 급격한 상승 (6천만)
  { date: "11/5", value: 40000000 }, // 하락 (4천만)
  { date: "11/6", value: 75000000 }, // 급격한 상승 (7.5천만)
  { date: "11/7", value: 55000000 }, // 하락 (5.5천만)
  { date: "11/8", value: 80000000 }, // 급격한 상승 (8천만)
  { date: "11/9", value: 36515000 }, // 급격한 하락 (3.65천만) - 디자인에서 이렇게 되어 있는 값
  { date: "11/10", value: 50000000 }, // 상승 (5천만)
  { date: "11/11", value: 25000000 }, // 급격한 하락 (2.5천만)
];

/* ========================================
   👥 회원 통계 데이터
   ======================================== */

// 회원 활성화 도넛 차트 데이터 타입 정의
export interface DonutData {
  name: string; // 섹션 이름 (활성화 또는 비활성화)
  value: number; // 비율 값
}

// 전체 회원 활성화 도넛 차트 데이터
// 사용 위치:
// - src/components/manager_sa/dashboard/chart/MemberActivationDonutChart.tsx
export const memberActivationDonutData: DonutData[] = [
  { name: "활성화", value: 68 }, // 활성화 비율 68%
  { name: "비활성화", value: 32 }, // 비활성화 비율 32%
];

// 전체 회원 통계 데이터 타입 정의
export interface MemberActivationStats {
  totalMembers: {
    label: string;
    value: string;
    change: string;
    changeType: "positive" | "negative" | "neutral";
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

// 전체 회원 통계 데이터
// 사용 위치:
// - src/components/manager_sa/dashboard/section/MemberActivationSection.tsx
export const memberActivationStats: MemberActivationStats = {
  totalMembers: {
    label: "전체 회원 수",
    value: "12,589명",
    change: "↑ 50%",
    changeType: "positive",
  },
  activeMembers: {
    label: "활성 회원 수",
    value: "8,869명",
    percentage: "(68%)",
  },
  inactiveMembers: {
    label: "비활성 회원 수",
    value: "3,720명",
    percentage: "(32%)",
  },
};

/* ========================================
   👥 회원 유형 별 통계 데이터
   ======================================== */

// 회원 유형 막대 차트 데이터 타입 정의(Figma 디자인에 맞춰 막대 차트로 변경
export interface MemberTypeBarData {
  category: string; // 카테고리명(막대 이름)
  partner: number; // 파트너 비율
  reviewer: number; // 리뷰어 비율
}

// 회원 유형 막대 차트 데이터
// 사용 위치:
// - src/components/manager_sa/dashboard/chart/MemberTypeBarChart.tsx
// Figma 디자인에 맞춰 막대 차트로 표시
export const memberTypeBarData: MemberTypeBarData[] = [
  {
    category: "전체",
    partner: 5, // 파트너 비율 5%
    reviewer: 75, // 리뷰어 비율 75% (나머지는 일반 회원 20%)
  },
];

// 회원 유형 통계 데이터 타입 정의
export interface MemberTypeStats {
  totalPartners: {
    label: string;
    value: string;
    change: string;
    changeType: "positive" | "negative" | "neutral";
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
    changeType: "positive" | "negative" | "neutral";
  };
  activeReviewers: {
    label: string;
    value: string;
    percentage: string;
  };
}

// 회원 유형 통계 데이터
// 사용 위치:
// - src/components/manager_sa/dashboard/section/MemberTypeSection.tsx
export const memberTypeStats: MemberTypeStats = {
  totalPartners: {
    label: "전체 파트너 수",
    value: "566명",
    change: "↑ 50%",
    changeType: "positive",
  },
  activePartners: {
    label: "활성 파트너 수",
    value: "267명",
    percentage: "(49%)",
  },
  totalReviewers: {
    label: "전체 리뷰어 수",
    value: "9,589명",
    change: "↓ 0%",
    changeType: "neutral",
  },
  activeReviewers: {
    label: "활성 리뷰어 수",
    value: "7,589명",
    percentage: "(82%)",
  },
};

/* ========================================
   📱 채널별 회원 통계 데이터
   ======================================== */

// 채널별 회원 파이 차트 데이터 타입 정의
export interface ChannelData {
  name: string; // 채널명
  value: number; // 비율 값
  count: number; // 회원 수
}

// 채널별 회원 파이 차트 데이터
// 사용 위치:
// - src/components/manager_sa/dashboard/chart/ChannelMemberPieChart.tsx
export const channelData: ChannelData[] = [
  { name: "블로그", value: 50, count: 12589 }, // 블로그 가입 50%
  { name: "인스타그램", value: 25, count: 10124 }, // 인스타그램 가입 25%
  { name: "클립", value: 20, count: 8869 }, // 클립 가입 20%
  { name: "유튜브", value: 5, count: 569 }, // 유튜브 가입 5%
];

// 채널별 회원 섹션 통계 데이터 타입 정의
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

// 채널별 회원 섹션 통계 데이터
// 사용 위치:
// - src/components/manager_sa/dashboard/section/ChannelMemberSection.tsx
export const channelMemberStats: ChannelMemberStats = {
  blog: {
    label: "블로그 가입",
    value: "12,589명",
    percentage: "(50%)",
  },
  instagram: {
    label: "인스타그램 가입",
    value: "10,124명",
    percentage: "(25%)",
  },
  clip: {
    label: "클립 가입",
    value: "8,869명",
    percentage: "(20%)",
  },
  youtube: {
    label: "유튜브 가입",
    value: "569명",
    percentage: "(5%)",
  },
};
