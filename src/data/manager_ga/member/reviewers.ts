/* ========================================
   GA 관리자 리뷰어 데이터
   ======================================== */

/**
 * GA 관리자 리뷰어 목록 목업 데이터
 *
 * 목적: GA 관리자 리뷰어 목록 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers (리뷰어 목록 페이지)
 *
 */

// GA 관리자 전용 필터 옵션에서 import
import type {
  ReviewerType,
  ReviewerStatus,
  ReviewerStatusType,
} from "@/data/manager_ga/common/filterOptions";

// 공통 필터 옵션에서 import (manager_ga와 manager_sa 공통)
import type { Channel } from "@/data/manager/common/filterOptions";

// 타입 재export (기존 코드와의 호환성을 위해)
export type { Channel, ReviewerType, ReviewerStatus, ReviewerStatusType };

// localStorage 파싱용 내부 타입
interface RawUserAccount {
  id: string;
  current_points?: number;
  withdrawn_points?: number;
  channel_details?: RawChannelDetail[];
  last_access_date?: string;
  join_date?: string;
  [key: string]: unknown;
}
interface RawAppliedCampaign {
  userId: string;
  campaigns?: Array<{ status: string }>;
}
interface RawChannelDetail {
  status: string;
  name: string;
  platform?: string;
}

// 리뷰어 통계 타입 정의
export interface ReviewerStats {
  total_members: number; // 전체 가입자 수
  monthly_active: number; // 월간 활동 회원
  monthly_new: number; // 월간 신규 가입자 수
  dormant: number; // 휴면 회원
}

// 리뷰어 목록 아이템 타입 정의
export interface ReviewerItem {
  id: string; // 리뷰어 ID
  number: string; // 번호
  name: string; // 이름
  channels: Channel[]; // 보유 채널 목록
  type: ReviewerType; // 유형
  campaign_participated: number; // 캠페인 참여 횟수
  campaign_completed: number; // 캠페인 완료 횟수
  current_points: number; // 보유 포인트
  withdrawn_points: number; // 출금 포인트
  status_type: ReviewerStatusType; // 상태 유형 (일반 회원, 주의 회원, 이용 제한 회원)
  status: ReviewerStatus; // 상태
  last_access_date: string; // 접속일 (예: 2025-08-01 18:56)
  join_date: string; // 가입일 (예: 2025-08-01 18:56)
}

// 채널 상세 정보 타입 정의
export interface ChannelDetail {
  channel: Channel; // 채널 타입
  daily_visits?: number; // 일방문 (네이버 블로그)
  total_visits?: number; // 총방문 (네이버 블로그)
  neighbors?: number; // 이웃수 (네이버 블로그)
  followers?: number; // 팔로워 (네이버 클립, 인스타그램)
  subscribers?: number; // 구독자 (유튜브)
  is_connected: boolean; // 연결 여부
  channel_url?: string; // 채널 URL (연결 시 해당 SNS로 이동)
}

// 계좌 정보 타입 정의
export interface AccountInfo {
  account_holder: string; // 예금주
  bank: string; // 은행
  account_number: string; // 계좌번호
  resident_number: string; // 주민등록번호 (마스킹된 형태)
}

// 최근 캠페인 정보 타입 정의
export interface RecentCampaign {
  campaign_number: string; // 캠페인 번호
  partner_name: string; // 파트너명
  campaign_name: string; // 캠페인명
  status: "진행" | "종료" | "취소"; // 상태
  type: "배송형" | "구매평"; // 유형
  channel: Channel; // 채널
  points: number; // 지급 포인트
}

// 패널티 유형 타입 정의
export type PenaltyType = "지각 제출" | "선정 후 취소" | "기타";

// 패널티 상태 타입 정의
export type PenaltyStatus = "경고" | "정상" | "일시정지";

// 패널티 내역 아이템 타입 정의
export interface PenaltyHistoryItem {
  type: PenaltyType; // 유형
  reason: string; // 사유
  processed_date: string; // 처리일 (예: 2025-08-01 18:56)
  status: PenaltyStatus; // 상태
}

// 리뷰어 디테일 정보 타입 정의
export interface ReviewerDetail extends ReviewerItem {
  nickname: string; // 닉네임
  gender: "남성" | "여성"; // 성별
  age: number; // 나이
  email: string; // 이메일
  phone: string; // 전화번호
  address: string; // 주소
  profile_image?: string | null; // 프로필 이미지 URL (선택적, 없으면 기본 이미지 사용)
  penalty_count: number; // 패널티 횟수
  channel_details: ChannelDetail[]; // 채널 상세 정보
  account_info: AccountInfo; // 계좌 정보
  recent_campaigns: RecentCampaign[]; // 최근 진행 캠페인 목록
  penalty_history: PenaltyHistoryItem[]; // 패널티 내역 목록
}

// 리뷰어 통계 데이터
export const reviewer_stats: ReviewerStats = {
  total_members: 5120,
  monthly_active: 1523,
  monthly_new: 120,
  dormant: 125,
};

// 리뷰어 목록 데이터
export const reviewer_list: ReviewerItem[] = [
  {
    id: "1",
    number: "000001",
    name: "오은영",
    channels: ["Blog", "Clip", "Instagram", "Youtube"],
    type: "일반",
    campaign_participated: 85,
    campaign_completed: 80,
    current_points: 1500000,
    withdrawn_points: 11500000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-01-15 14:30",
    join_date: "2025-12-05 10:20",
  },
  {
    id: "2",
    number: "000002",
    name: "김은지",
    channels: ["Blog", "Clip"],
    type: "일반",
    campaign_participated: 12,
    campaign_completed: 10,
    current_points: 1500000,
    withdrawn_points: 132500000,
    status_type: "이용 제한 회원",
    status: "일시 정지",
    last_access_date: "2026-01-20 16:45",
    join_date: "2025-12-12 14:30",
  },
  {
    id: "3",
    number: "000003",
    name: "홍길동",
    channels: ["Blog", "Instagram"],
    type: "서포터즈",
    campaign_participated: 569,
    campaign_completed: 560,
    current_points: 999999999,
    withdrawn_points: 999999999,
    status_type: "이용 제한 회원",
    status: "일시 정지",
    last_access_date: "2026-01-25 09:20",
    join_date: "2025-12-18 16:45",
  },
  {
    id: "4",
    number: "000004",
    name: "유연희",
    channels: ["Blog"],
    type: "인플루언서",
    campaign_participated: 8,
    campaign_completed: 7,
    current_points: 1500000,
    withdrawn_points: 900000000,
    status_type: "이용 제한 회원",
    status: "영구 정지",
    last_access_date: "2026-01-28 11:15",
    join_date: "2025-12-22 11:15",
  },
  {
    id: "5",
    number: "000005",
    name: "김히어라가나다라마바사아자자자자자자",
    channels: ["Blog", "Instagram"],
    type: "일반",
    campaign_participated: 5,
    campaign_completed: 5,
    current_points: 1500000,
    withdrawn_points: 500000,
    status_type: "주의 회원",
    status: "정상",
    last_access_date: "2026-01-30 18:30",
    join_date: "2025-12-28 09:30",
  },
  {
    id: "6",
    number: "000006",
    name: "일이삼사오육칠팔구십",
    channels: ["Blog"],
    type: "일반",
    campaign_participated: 25,
    campaign_completed: 23,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-01-31 15:20",
    join_date: "2025-12-31 15:20",
  },
  {
    id: "7",
    number: "000007",
    name: "이은",
    channels: ["Blog"],
    type: "일반",
    campaign_participated: 18,
    campaign_completed: 16,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-03-01 10:45",
    join_date: "2026-01-03 10:45",
  },
  {
    id: "8",
    number: "000008",
    name: "김휘수",
    channels: ["Blog"],
    type: "일반",
    campaign_participated: 32,
    campaign_completed: 30,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-03-02 14:20",
    join_date: "2026-01-08 14:20",
  },
  {
    id: "9",
    number: "000009",
    name: "황보선혜",
    channels: ["Blog"],
    type: "일반",
    campaign_participated: 15,
    campaign_completed: 14,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-03-03 16:30",
    join_date: "2026-01-15 16:30",
  },
  {
    id: "10",
    number: "000010",
    name: "장세희",
    channels: ["Blog", "Instagram"],
    type: "일반",
    campaign_participated: 42,
    campaign_completed: 40,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-03-04 11:10",
    join_date: "2026-01-20 11:10",
  },
  {
    id: "11",
    number: "000011",
    name: "김은빛",
    channels: ["Blog", "Instagram"],
    type: "일반",
    campaign_participated: 28,
    campaign_completed: 26,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-03-05 13:40",
    join_date: "2026-01-25 13:40",
  },
  {
    id: "12",
    number: "000012",
    name: "김도토리",
    channels: ["Blog", "Instagram"],
    type: "일반",
    campaign_participated: 35,
    campaign_completed: 33,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-03-06 17:50",
    join_date: "2026-01-31 17:50",
  },
  {
    id: "13",
    number: "000013",
    name: "박요셉",
    channels: ["Blog", "Instagram"],
    type: "일반",
    campaign_participated: 22,
    campaign_completed: 20,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-03-07 09:15",
    join_date: "2026-03-01 09:15",
  },
  {
    id: "14",
    number: "000014",
    name: "황에스더",
    channels: ["Blog", "Instagram"],
    type: "일반",
    campaign_participated: 19,
    campaign_completed: 17,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-03-08 14:25",
    join_date: "2026-03-02 14:25",
  },
  {
    id: "15",
    number: "000015",
    name: "조로이스",
    channels: ["Blog", "Instagram"],
    type: "일반",
    campaign_participated: 38,
    campaign_completed: 36,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-03-09 10:35",
    join_date: "2026-03-03 10:35",
  },
  {
    id: "16",
    number: "000016",
    name: "데이터없음테스트",
    channels: ["Blog"],
    type: "일반",
    campaign_participated: 0,
    campaign_completed: 0,
    current_points: 0,
    withdrawn_points: 0,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-03-10 16:45",
    join_date: "2026-03-04 16:45",
  },
  {
    id: "17",
    number: "000017",
    name: "탈퇴회원테스트",
    channels: ["Blog", "Instagram"],
    type: "일반",
    campaign_participated: 10,
    campaign_completed: 8,
    current_points: 0,
    withdrawn_points: 500000,
    status_type: "이용 제한 회원",
    status: "탈퇴",
    last_access_date: "2025-07-15 10:30",
    join_date: "2024-01-15 14:20",
  },
  {
    id: "18",
    number: "000018",
    name: "이클립",
    channels: ["Blog", "Clip"],
    type: "일반",
    campaign_participated: 5,
    campaign_completed: 4,
    current_points: 500000,
    withdrawn_points: 1000000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-03-11 12:00",
    join_date: "2026-03-05 12:00",
  },
  {
    id: "19",
    number: "000019",
    name: "김유튜브",
    channels: ["Blog", "Youtube"],
    type: "일반",
    campaign_participated: 8,
    campaign_completed: 7,
    current_points: 800000,
    withdrawn_points: 1200000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-03-12 15:30",
    join_date: "2026-03-06 15:30",
  },
  {
    id: "20",
    number: "000020",
    name: "박클립유튜브가나다다라라라라라라ㅏ라라라라라라라라",
    channels: ["Clip", "Youtube"],
    type: "서포터즈",
    campaign_participated: 12,
    campaign_completed: 11,
    current_points: 1000000,
    withdrawn_points: 2000000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-03-13 09:20",
    join_date: "2026-03-07 09:20",
  },
];

// 리뷰어 ID로 디테일 정보를 가져오는 함수
// 실제 프로젝트에서는 API 호출로 대체됩니다
export function get_reviewer_detail_by_id(reviewer_id: string): ReviewerDetail | null {
  // 목록에서 해당 리뷰어 찾기
  const reviewer = reviewer_list.find((r) => r.id === reviewer_id);
  if (!reviewer) {
    return null;
  }

  // 패널티 횟수 계산: ID에 따라 다르게 설정
  // 실제 프로젝트에서는 API에서 받아온 데이터를 사용합니다
  const penalty_count_map: Record<string, number> = {
    "1": 5,
    "2": 0,
    "3": 0,
    "4": 1,
    "5": 2,
    "6": 0,
    "7": 0,
    "8": 0,
    "9": 0,
    "10": 0,
    "11": 0,
    "12": 0,
    "13": 0,
    "14": 0,
    "15": 0,
    "16": 0, // 데이터 없음 테스트용
    "17": 0, // 탈퇴 회원 테스트용
  };
  const penalty_count = penalty_count_map[reviewer.id] || 0;

  // 패널티 내역 생성: penalty_count에 맞춰서 생성
  // 패널티 내역 생성: penalty_count에 맞춰서 생성
  // 유형은 항상 "경고"로 표시되므로, 상태 값은 실제 상태(일시정지 또는 정상)만 저장합니다
  const penalty_history: PenaltyHistoryItem[] = [];
  if (penalty_count > 0) {
    for (let i = 0; i < penalty_count; i++) {
      // 첫 번째 항목이고 패널티가 5개 이상이면 일시정지, 그 외는 정상
      const actualStatus = i === 0 && penalty_count >= 5 ? "일시정지" : "정상";

      penalty_history.push({
        type: i === penalty_count - 1 && penalty_count > 1 ? "선정 후 취소" : "지각 제출",
        reason: i === penalty_count - 1 && penalty_count > 1 ? "선정 후 취소" : "지각 제출",
        processed_date: `2025-08-${String(i + 1).padStart(2, "0")} 18:56`,
        status: actualStatus,
      });
    }
  }

  // 캠페인 진행 내역 생성: campaign_participated에 맞춰서 생성
  // 각 리뷰어마다 다른 캠페인 데이터를 가지도록 다양하게 설정
  const recent_campaigns: RecentCampaign[] = [];

  // 데이터 없음 테스트용: ID가 '16'인 경우 빈 배열로 유지
  if (reviewer.id !== "16") {
    const campaign_count = reviewer.campaign_participated;

    // 캠페인 데이터 템플릿 (리뷰어마다 다른 데이터를 생성하기 위한 배열)
    const campaign_templates: Omit<RecentCampaign, "campaign_number">[] = [
      {
        partner_name: "주식회사 재밌는걸참좋아하고하고싶은거하는노신사",
        campaign_name: "푸러블 고농축 캡슐세제 플라워향, 1개, 110개입",
        status: "진행",
        type: "배송형",
        channel: "Blog",
        points: 115000,
      },
      {
        partner_name: "그리디센트",
        campaign_name: "나만의 향수만들기 체험 [그리디센트]",
        status: "진행",
        type: "구매평",
        channel: "Store",
        points: 50000,
      },
      {
        partner_name: "스타벅스",
        campaign_name: "스타벅스 리저브 원두 체험",
        status: "종료",
        type: "배송형",
        channel: "Blog",
        points: 80000,
      },
      {
        partner_name: "나이키",
        campaign_name: "나이키 에어맥스 운동화 리뷰",
        status: "종료",
        type: "구매평",
        channel: "Instagram",
        points: 120000,
      },
      {
        partner_name: "삼성전자",
        campaign_name: "갤럭시 버즈 프로 체험",
        status: "종료",
        type: "배송형",
        channel: "Youtube",
        points: 150000,
      },
      {
        partner_name: "아이폰",
        campaign_name: "아이폰 15 프로 맥스 리뷰",
        status: "진행",
        type: "구매평",
        channel: "Blog",
        points: 200000,
      },
      {
        partner_name: "코카콜라",
        campaign_name: "코카콜라 제로 슈가 체험",
        status: "종료",
        type: "배송형",
        channel: "Clip",
        points: 30000,
      },
    ];

    // campaign_participated 값에 맞춰서 캠페인 내역 생성
    // 최대 100개까지만 표시 (성능을 위해 제한)
    const max_campaigns_to_show = Math.min(campaign_count, 100);

    for (let i = 0; i < max_campaigns_to_show; i++) {
      // 템플릿을 순환하면서 사용 (i % campaign_templates.length로 인덱스 계산)
      const template_index = i % campaign_templates.length;
      const template = campaign_templates[template_index];

      recent_campaigns.push({
        campaign_number: String(i + 1).padStart(6, "0"),
        ...template,
        // 진행/종료 상태를 다양하게 설정
        status: i % 3 === 0 ? "진행" : "종료",
        // 포인트도 다양하게 설정
        points: template.points + (i % 5) * 10000,
      });
    }
  }

  // 각 리뷰어마다 다른 개인 정보 생성
  const personal_info_map: Record<
    string,
    {
      nickname: string;
      gender: "남성" | "여성";
      age: number;
      email: string;
      phone: string;
      address: string;
    }
  > = {
    "1": {
      nickname: "양치하는고양이",
      gender: "남성",
      age: 37,
      email: "oheunyoung@naver.com",
      phone: "010-1111-1111",
      address: "서울시 강남구 테헤란로 123",
    },
    "2": {
      nickname: "은지블로그",
      gender: "여성",
      age: 28,
      email: "kimeunji@gmail.com",
      phone: "010-2222-2222",
      address: "서울시 서초구 서초대로 456",
    },
    "3": {
      nickname: "홍길동의리뷰",
      gender: "남성",
      age: 45,
      email: "honggildong@daum.net",
      phone: "010-3333-3333",
      address: "부산시 해운대구 해운대해변로 789",
    },
    "4": {
      nickname: "연희의일상",
      gender: "여성",
      age: 32,
      email: "yuyeonhee@naver.com",
      phone: "010-4444-4444",
      address: "인천시 남동구 장자로 14",
    },
    "5": {
      nickname: "히어라리뷰",
      gender: "여성",
      age: 26,
      email: "kimheera@naver.com",
      phone: "010-5555-5555",
      address: "대전시 유성구 대학로 321",
    },
    "6": {
      nickname: "일이삼사오",
      gender: "남성",
      age: 35,
      email: "ilsamsa@naver.com",
      phone: "010-6666-6666",
      address: "광주시 북구 첨단과기로 654",
    },
    "7": {
      nickname: "이은의블로그",
      gender: "여성",
      age: 29,
      email: "leeun@naver.com",
      phone: "010-7777-7777",
      address: "대구시 수성구 범어천로 987",
    },
    "8": {
      nickname: "휘수의리뷰",
      gender: "남성",
      age: 41,
      email: "kimhwisu@naver.com",
      phone: "010-8888-8888",
      address: "울산시 남구 삼산로 147",
    },
    "9": {
      nickname: "황보선혜",
      gender: "여성",
      age: 33,
      email: "hwangboseonhye@naver.com",
      phone: "010-9999-9999",
      address: "경기도 성남시 분당구 정자로 258",
    },
    "10": {
      nickname: "장세희블로그",
      gender: "여성",
      age: 27,
      email: "jangsehee@naver.com",
      phone: "010-1010-1010",
      address: "경기도 수원시 영통구 광교로 369",
    },
    "11": {
      nickname: "은빛의일상",
      gender: "여성",
      age: 30,
      email: "kimeunbit@naver.com",
      phone: "010-2020-2020",
      address: "경기도 고양시 일산동구 정발산로 741",
    },
    "12": {
      nickname: "도토리리뷰",
      gender: "남성",
      age: 38,
      email: "kimdotori@naver.com",
      phone: "010-3030-3030",
      address: "경기도 부천시 원미구 상동로 852",
    },
    "13": {
      nickname: "요셉의블로그",
      gender: "남성",
      age: 36,
      email: "parkyoseb@naver.com",
      phone: "010-4040-4040",
      address: "경기도 안양시 만안구 안양로 963",
    },
    "14": {
      nickname: "에스더리뷰",
      gender: "여성",
      age: 31,
      email: "hwangesder@naver.com",
      phone: "010-5050-5050",
      address: "경기도 용인시 기흥구 신갈로 159",
    },
    "15": {
      nickname: "로이스의일상",
      gender: "여성",
      age: 34,
      email: "jorois@naver.com",
      phone: "010-6060-6060",
      address: "경기도 화성시 동탄대로 357",
    },
    "16": {
      nickname: "데이터없음테스트",
      gender: "남성",
      age: 30,
      email: "nodata@test.com",
      phone: "010-9999-9999",
      address: "서울시 강남구 테헤란로 999",
    },
    "17": {
      nickname: "탈퇴회원테스트",
      gender: "여성",
      age: 28,
      email: "withdrawn@test.com",
      phone: "010-7070-7070",
      address: "서울시 마포구 홍대입구로 123",
    },
  };

  const personal_info = personal_info_map[reviewer.id] || personal_info_map["1"];

  // 채널 정보 4개 칸은 무조건 모두 표시 (Blog, Clip, Instagram, Youtube)
  // 리뷰어가 보유한 채널인지 여부에 따라 연결 상태를 결정
  const all_channels: Channel[] = ["Blog", "Clip", "Instagram", "Youtube"];
  const channel_details: ChannelDetail[] = [];

  // 각 채널마다 데이터 생성 (리뷰어 ID 기반으로 일관된 랜덤 값 생성)
  const seed = parseInt(reviewer.id);
  const channel_data_map: Record<Channel, Partial<ChannelDetail>> = {
    Blog: {
      daily_visits: ((seed * 123) % 1000) + 100,
      total_visits: ((seed * 456) % 1000000) + 10000,
      neighbors: ((seed * 789) % 2000) + 100,
      is_connected: reviewer.channels.includes("Blog"),
    },
    Clip: {
      followers: ((seed * 234) % 5000) + 500,
      is_connected: reviewer.channels.includes("Clip"),
    },
    Instagram: {
      followers: ((seed * 567) % 10000) + 1000,
      is_connected: reviewer.channels.includes("Instagram"),
    },
    Youtube: {
      subscribers: ((seed * 890) % 100000) + 5000,
      is_connected: reviewer.channels.includes("Youtube"),
    },
    Store: {
      is_connected: reviewer.channels.includes("Store"),
    },
    Mission: {
      is_connected: reviewer.channels.includes("Mission"),
    },
    Reels: {
      followers: ((seed * 345) % 10000) + 1000,
      is_connected: reviewer.channels.includes("Reels"),
    },
    Review: {
      is_connected: reviewer.channels.includes("Review"),
    },
    Shorts: {
      subscribers: ((seed * 678) % 100000) + 5000,
      is_connected: reviewer.channels.includes("Shorts"),
    },
  };

  // 연결된 채널별 목업 URL (클릭 시 이동용, 리뷰어 ID 기반)
  const reviewer_slug = `reviewer_${reviewer.id}`;
  const channel_url_map: Record<Channel, string> = {
    Blog: `https://blog.naver.com/${reviewer_slug}`,
    Clip: `https://clip.naver.com/${reviewer_slug}`,
    Instagram: `https://instagram.com/${reviewer_slug}`,
    Youtube: `https://youtube.com/@${reviewer_slug}`,
    Store: `https://smartstore.naver.com/${reviewer_slug}`,
    Mission: "#",
    Reels: `https://instagram.com/${reviewer_slug}`,
    Review: "#",
    Shorts: `https://youtube.com/@${reviewer_slug}`,
  };

  // 4개 채널 모두 생성 (Blog, Clip, Instagram, Youtube)
  all_channels.forEach((channel) => {
    const base_data = channel_data_map[channel];
    const is_connected = base_data.is_connected ?? false;
    channel_details.push({
      channel: channel,
      ...base_data,
      is_connected,
      channel_url: is_connected ? channel_url_map[channel] : undefined,
    } as ChannelDetail);
  });

  // 각 리뷰어마다 다른 계좌 정보 생성
  const bank_list = [
    "우리은행",
    "KB국민은행",
    "신한은행",
    "하나은행",
    "NH농협은행",
    "카카오뱅크",
    "토스뱅크",
  ];
  const bank_index = parseInt(reviewer.id) % bank_list.length;
  const selected_bank = bank_list[bank_index];

  // 계좌번호 생성 (각 리뷰어마다 다르게)
  const account_number_base = String(parseInt(reviewer.id) * 1234567);
  const account_number = account_number_base.padStart(14, "0").slice(0, 14);

  // 주민등록번호 생성 (각 리뷰어마다 다르게)
  const birth_year = 1980 + (parseInt(reviewer.id) % 30);
  const birth_month = String((parseInt(reviewer.id) % 12) + 1).padStart(2, "0");
  const birth_day = String((parseInt(reviewer.id) % 28) + 1).padStart(2, "0");
  const gender_code = personal_info.gender === "남성" ? "1" : "2";
  const resident_number = `${birth_year
    .toString()
    .slice(2)}${birth_month}${birth_day}-${gender_code}******`;

  // 디테일 정보 생성 (목업 데이터)
  // 실제 프로젝트에서는 API에서 받아온 데이터를 사용합니다
  const detail: ReviewerDetail = {
    ...reviewer,
    nickname: personal_info.nickname,
    gender: personal_info.gender,
    age: personal_info.age,
    email: personal_info.email,
    phone: personal_info.phone,
    address: personal_info.address,
    penalty_count: penalty_count,
    penalty_history: penalty_history,
    channel_details: channel_details,
    account_info: {
      account_holder: reviewer.name,
      bank: selected_bank,
      account_number: account_number,
      resident_number: resident_number,
    },
    recent_campaigns: recent_campaigns,
  };

  return detail;
}

// localStorage 키
const STORAGE_KEY_REVIEWER_STATUS_UPDATES = "reviewer_status_type_updates";
const STORAGE_KEY_REVIEWER_PREVIOUS_STATUS = "reviewer_previous_status_type";

// localStorage에서 상태 업데이트 정보 로드
function load_status_updates_from_storage(): Record<string, ReviewerStatusType> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY_REVIEWER_STATUS_UPDATES);
    return stored ? JSON.parse(stored) : {};
  } catch (_error) {
    return {};
  }
}

// localStorage에서 이전 상태 정보 로드 (해제 시 복원용)
function load_previous_status_from_storage(): Record<string, ReviewerStatusType> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY_REVIEWER_PREVIOUS_STATUS);
    return stored ? JSON.parse(stored) : {};
  } catch (_error) {
    return {};
  }
}

// 상태 업데이트 정보를 localStorage에 저장
function save_status_updates_to_storage(updates: Record<string, ReviewerStatusType>): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY_REVIEWER_STATUS_UPDATES, JSON.stringify(updates));
  } catch (_error) {}
}

// 이전 상태 정보를 localStorage에 저장
function save_previous_status_to_storage(
  previous_status: Record<string, ReviewerStatusType>
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY_REVIEWER_PREVIOUS_STATUS, JSON.stringify(previous_status));
  } catch (_error) {}
}

// 리뷰어 목록 가져오기 (상태 업데이트 반영)
// 매번 호출 시 localStorage에서 최신 상태를 가져와서 반영합니다
export function get_reviewer_list(): ReviewerItem[] {
  // 매번 최신 상태를 localStorage에서 로드
  const status_type_updates = load_status_updates_from_storage();

  // user_accounts와 user_applied_campaigns에서 최신 정보 가져오기
  const userAccountsMap: Record<string, RawUserAccount> = {};
  const userCampaignsMap: Record<string, { participated: number; completed: number }> = {};

  if (typeof window !== "undefined") {
    try {
      // user_accounts에서 포인트 정보 가져오기
      const storedAccounts = localStorage.getItem("user_accounts");
      if (storedAccounts) {
        const accounts = JSON.parse(storedAccounts);
        (accounts as RawUserAccount[]).forEach((account) => {
          userAccountsMap[account.id] = account;
        });
      }

      // user_applied_campaigns에서 캠페인 통계 가져오기
      const userAppliedCampaigns = localStorage.getItem("user_applied_campaigns");
      if (userAppliedCampaigns) {
        const allAppliedCampaigns = JSON.parse(userAppliedCampaigns);
        (allAppliedCampaigns as RawAppliedCampaign[]).forEach((uc) => {
          if (uc.campaigns) {
            const campaigns = uc.campaigns;
            // 캠페인 진행 = 대기 + 선정 상태인 캠페인 수
            const participated = campaigns.filter(
              (c) => c.status === "대기" || c.status === "선정"
            ).length;
            // 캠페인 완료 = 완료 상태인 캠페인 수
            const completed = campaigns.filter((c) => c.status === "완료").length;
            userCampaignsMap[uc.userId] = { participated, completed };
          }
        });
      }
    } catch (_error) {}
  }

  return reviewer_list.map((reviewer) => {
    // 기본값은 목업 데이터 사용
    const updatedReviewer: ReviewerItem = { ...reviewer };

    // localStorage에 저장된 상태 업데이트가 있으면 적용
    if (status_type_updates[reviewer.id] !== undefined) {
      updatedReviewer.status_type = status_type_updates[reviewer.id];
    }

    // ID 매핑: 1 -> user_kakao_001, 2 -> user_naver_001
    const mappedId =
      reviewer.id === "1" ? "user_kakao_001" : reviewer.id === "2" ? "user_naver_001" : reviewer.id;

    // user_accounts에서 최신 정보 가져오기
    const userAccount = userAccountsMap[mappedId] || userAccountsMap[reviewer.id];
    if (userAccount) {
      // 포인트 정보 업데이트
      updatedReviewer.current_points = userAccount.current_points ?? updatedReviewer.current_points;
      // 출금 포인트는 user_accounts에서 가져오되, 없으면 0으로 설정
      updatedReviewer.withdrawn_points =
        userAccount.withdrawn_points !== undefined && userAccount.withdrawn_points !== null
          ? userAccount.withdrawn_points
          : 0;

      // 채널 정보 업데이트 (channel_details에서 연결된 채널만)
      if (userAccount.channel_details) {
        const connectedChannels: Channel[] = [];
        userAccount.channel_details.forEach((ch) => {
          if (ch.status === "connected") {
            // 채널 이름을 Channel 타입으로 변환
            const channelMap: Record<string, Channel> = {
              "네이버 블로그": "Blog",
              블로그: "Blog",
              Blog: "Blog",
              "네이버 클립": "Clip",
              클립: "Clip",
              Clip: "Clip",
              인스타그램: "Instagram",
              Instagram: "Instagram",
              유튜브: "Youtube",
              Youtube: "Youtube",
            };
            const normalizedChannel = ch.name.replace(/\s+/g, "");
            const channel = channelMap[normalizedChannel] || channelMap[ch.name];
            if (channel) {
              connectedChannels.push(channel);
            }
          }
        });
        if (connectedChannels.length > 0) {
          updatedReviewer.channels = connectedChannels;
        }
      }

      // 접속일, 가입일 업데이트
      if (userAccount.last_access_date) {
        updatedReviewer.last_access_date = userAccount.last_access_date;
      }
      if (userAccount.join_date) {
        updatedReviewer.join_date = userAccount.join_date;
      }
    }

    // user_applied_campaigns에서 캠페인 통계 가져오기
    const userCampaigns = userCampaignsMap[mappedId] || userCampaignsMap[reviewer.id];
    if (userCampaigns) {
      updatedReviewer.campaign_participated = userCampaigns.participated;
      updatedReviewer.campaign_completed = userCampaigns.completed;
    }

    return updatedReviewer;
  });
}

// localStorage 초기화 함수 (개발/테스트용)
// 초기 데이터로 localStorage를 리셋합니다
export function reset_reviewer_status_storage(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY_REVIEWER_STATUS_UPDATES);
    localStorage.removeItem(STORAGE_KEY_REVIEWER_PREVIOUS_STATUS);
  } catch (_error) {}
}

// 초기 데이터와 localStorage 동기화 함수
// 초기 데이터의 status_type을 기준으로 localStorage를 업데이트합니다
// 초기 데이터를 우선시하여 localStorage에 반영합니다
export function sync_reviewer_status_with_initial_data(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const status_type_updates = load_status_updates_from_storage();
    const updated_status: Record<string, ReviewerStatusType> = {};

    // 초기 데이터를 기준으로 localStorage 업데이트
    reviewer_list.forEach((reviewer) => {
      // localStorage에 저장된 값이 있으면 유지 (사용자가 변경한 값)
      // 없으면 초기 데이터의 status_type을 localStorage에 저장
      if (status_type_updates[reviewer.id] !== undefined) {
        // localStorage에 저장된 값이 있으면 유지 (사용자가 변경한 값)
        updated_status[reviewer.id] = status_type_updates[reviewer.id];
      } else {
        // 초기 데이터의 status_type을 localStorage에 저장
        updated_status[reviewer.id] = reviewer.status_type;
      }
    });

    save_status_updates_to_storage(updated_status);
  } catch (_error) {}
}

// 리뷰어 상태 타입 업데이트
// 이용 제한 시 이전 상태를 저장하고, 해제 시 복원할 수 있도록 합니다
export function update_reviewer_status_type(
  reviewer_id: string,
  new_status_type: ReviewerStatusType
): void {
  // 매번 최신 상태를 localStorage에서 로드
  const status_type_updates = load_status_updates_from_storage();
  const previous_status_types = load_previous_status_from_storage();

  // 현재 상태 가져오기 (이전 상태 저장용)
  const current_reviewer = reviewer_list.find((r) => r.id === reviewer_id);
  const current_status_type =
    status_type_updates[reviewer_id] ||
    (current_reviewer ? current_reviewer.status_type : "일반 회원");

  // "이용 제한 회원"으로 변경하는 경우에만 이전 상태 저장
  if (new_status_type === "이용 제한 회원" && current_status_type !== "이용 제한 회원") {
    const updated_previous_status = {
      ...previous_status_types,
      [reviewer_id]: current_status_type,
    };
    save_previous_status_to_storage(updated_previous_status);
  }

  // localStorage에 업데이트 저장
  const updated_status_updates = {
    ...status_type_updates,
    [reviewer_id]: new_status_type,
  };
  save_status_updates_to_storage(updated_status_updates);
}

// 리뷰어 상태 타입 복원 (해제 시 이전 상태로 복원)
export function restore_reviewer_status_type(reviewer_id: string): void {
  // 매번 최신 상태를 localStorage에서 로드
  const status_type_updates = load_status_updates_from_storage();
  const previous_status_types = load_previous_status_from_storage();

  // 이전 상태가 있으면 복원
  if (previous_status_types[reviewer_id]) {
    const updated_status_updates = {
      ...status_type_updates,
      [reviewer_id]: previous_status_types[reviewer_id],
    };
    const updated_previous_status = { ...previous_status_types };
    delete updated_previous_status[reviewer_id];
    save_status_updates_to_storage(updated_status_updates);
    save_previous_status_to_storage(updated_previous_status);
  } else {
    // 이전 상태가 없으면 기본값으로 복원 (localStorage에서 제거)
    const updated_status_updates = { ...status_type_updates };
    delete updated_status_updates[reviewer_id];
    save_status_updates_to_storage(updated_status_updates);
  }
}
