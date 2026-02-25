/* ========================================
   GA
   ======================================== */

/**
 * GA 관리자 파트너 목록 목업 데이터
 *
 * 목적: GA 관리자 파트너 목록 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/partners (파트너 목록 페이지)
 *
 */

// GA 관리자 전용 필터 옵션에서 import
import type {
  PartnerDivision,
  PartnerStatus,
  PartnerStatusType,
} from "@/data/manager_ga/common/filterOptions";

// 공통 필터 옵션에서 import (manager_ga와 manager_sa 공통)
import type { Channel } from "@/data/manager/common/filterOptions";

// 파트너 포인트 데이터 가져오기
import { getPartnerPointSummary } from "@/data/partner/point/pointData";

// 타입 재export (기존 코드와의 호환성을 위해)
export type { PartnerDivision, PartnerStatus, PartnerStatusType, Channel };

// localStorage 파싱용 내부 타입
interface RawPartnerAccount {
  id?: string;
  email?: string;
  phone?: string;
  address?: string;
  detail_address?: string;
  contact_phone?: string;
  name?: string;
  representative_name?: string;
  business_name?: string;
  business_number?: string;
  companyName?: string;
  businessNumber?: string;
  division?: string;
  business_type?: string;
  join_date?: string;
  created_at?: string;
  last_access_date?: string;
  campaign_in_progress?: number;
  campaign_completed?: number;
  current_points?: number;
  used_points?: number;
  status_type?: string;
  status?: string;
  number?: string;
  [key: string]: unknown;
}
interface RawCampaign {
  id?: string;
  partner_id?: string;
  name?: string;
  title?: string;
  status?: string;
  type?: string;
  platform?: string;
  points?: number;
  totalPoints?: number;
  [key: string]: unknown;
}

// 파트너 통계 타입 정의
export interface PartnerStats {
  total_members: number; // 전체 가입자 수
  monthly_active: number; // 월간 활동 회원
  monthly_new: number; // 월간 신규 가입자 수
  dormant: number; // 휴면 회원
}

// 파트너 목록 아이템 타입 정의
export interface PartnerItem {
  id: string; // 파트너 ID
  number: string; // 번호
  business_name: string; // 상호명
  business_number: string; // 사업자등록번호
  representative_name: string; // 대표자명
  division: PartnerDivision; // 구분 (법인/개인)
  campaign_in_progress: number; // 캠페인 진행 횟수
  campaign_completed: number; // 캠페인 완료 횟수
  current_points: number; // 보유 포인트
  used_points: number; // 사용 포인트
  status_type: PartnerStatusType; // 상태 유형 (일반 회원, 주의 회원, 이용 제한 회원)
  status: PartnerStatus; // 상태
  last_access_date: string; // 접속일 (예: 2025-08-01 18:56)
  join_date: string; // 가입일 (예: 2025-08-01 18:56)
  profile_image?: string | null; // 프로필 이미지 URL (선택적)
}

// Channel 타입은 위에서 공통 필터 옵션에서 import됨

// 최근 캠페인 정보 타입 정의
export interface RecentCampaign {
  campaign_number: string; // 캠페인 번호
  campaign_name: string; // 캠페인명
  status: "진행" | "종료"; // 상태
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

// 파트너 디테일 정보 타입 정의
export interface PartnerDetail extends PartnerItem {
  email: string; // 이메일
  phone: string; // 전화번호
  address: string; // 주소
  contact_name: string; // 담당자 이름
  contact_phone: string; // 문의 담당자 휴대폰 번호
  penalty_count: number; // 패널티 횟수
  payment_points: number; // 결제 포인트
  recent_campaigns: RecentCampaign[]; // 최근 진행 캠페인 목록
  penalty_history: PenaltyHistoryItem[]; // 패널티 내역 목록
}

// 파트너 통계 데이터
export const partner_stats: PartnerStats = {
  total_members: 1251,
  monthly_active: 78,
  monthly_new: 2,
  dormant: 568,
};

// 파트너 목록 데이터
// 날짜는 최근 날짜로 설정하여 통계 계산이 정확하게 이루어지도록 합니다
export const partner_list: PartnerItem[] = [
  {
    id: "1",
    number: "000001",
    business_name: "주식회사 청명종합광고기획",
    business_number: "122-86-45790",
    representative_name: "김민회",
    division: "법인",
    campaign_in_progress: 1521,
    campaign_completed: 1521,
    current_points: 0,
    used_points: 11500000,
    status_type: "이용 제한 회원",
    status: "일시 정지",
    last_access_date: "2026-01-18 14:30",
    join_date: "2025-12-07 10:20",
  },
  {
    id: "2",
    number: "000002",
    business_name: "청불 천막집 방이점",
    business_number: "211-23-55991",
    representative_name: "장민석외 2명",
    division: "개인",
    campaign_in_progress: 12,
    campaign_completed: 10,
    current_points: 0,
    used_points: 32500000,
    status_type: "이용 제한 회원",
    status: "탈퇴",
    last_access_date: "2026-01-22 16:45",
    join_date: "2025-12-14 11:15",
  },
  {
    id: "3",
    number: "000003",
    business_name: "명륜진사갈비 수원광교점",
    business_number: "211-23-55991",
    representative_name: "도선애, 이종근",
    division: "개인",
    campaign_in_progress: 569,
    campaign_completed: 560,
    current_points: 100000,
    used_points: 999999999,
    status_type: "이용 제한 회원",
    status: "일시 정지",
    last_access_date: "2026-01-27 09:20",
    join_date: "2025-12-19 14:30",
  },
  {
    id: "4",
    number: "000004",
    business_name: "(주) 레인보우8",
    business_number: "110-86-08583",
    representative_name: "고광웅",
    division: "법인",
    campaign_in_progress: 5,
    campaign_completed: 5,
    current_points: 1200,
    used_points: 1580000,
    status_type: "주의 회원",
    status: "정상",
    last_access_date: "2026-01-29 18:30",
    join_date: "2025-12-23 15:45",
  },
  {
    id: "5",
    number: "000005",
    business_name: "(주)플레티어",
    business_number: "000-00-00000",
    representative_name: "이상훈",
    division: "개인",
    campaign_in_progress: 8,
    campaign_completed: 7,
    current_points: 0,
    used_points: 500000,
    status_type: "이용 제한 회원",
    status: "영구 정지",
    last_access_date: "2026-01-31 12:00",
    join_date: "2025-12-29 09:30",
  },
  {
    id: "6",
    number: "000006",
    business_name: "꽃초롱",
    business_number: "000-00-00000",
    representative_name: "김초롱",
    division: "개인",
    campaign_in_progress: 25,
    campaign_completed: 23,
    current_points: 5400,
    used_points: 1500000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-02-01 10:15",
    join_date: "2025-12-30 16:20",
  },
  {
    id: "7",
    number: "000007",
    business_name: "주식회사 와이디컴퍼니그룹",
    business_number: "000-00-00000",
    representative_name: "양동찬",
    division: "개인",
    campaign_in_progress: 18,
    campaign_completed: 16,
    current_points: 251450,
    used_points: 589000,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-02-02 14:50",
    join_date: "2026-01-04 10:30",
  },
  {
    id: "8",
    number: "000008",
    business_name: "(주)아이엠에스커뮤니케이션",
    business_number: "000-00-00000",
    representative_name: "정만수",
    division: "개인",
    campaign_in_progress: 32,
    campaign_completed: 30,
    current_points: 0,
    used_points: 0,
    status_type: "주의 회원",
    status: "정상",
    last_access_date: "2026-02-03 11:25",
    join_date: "2026-01-09 13:40",
  },
  {
    id: "9",
    number: "000009",
    business_name: "주식회사 청명미디어",
    business_number: "234-86-01377",
    representative_name: "유기수",
    division: "개인",
    campaign_in_progress: 15,
    campaign_completed: 14,
    current_points: 0,
    used_points: 0,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-02-04 15:10",
    join_date: "2026-01-16 09:15",
  },
  {
    id: "10",
    number: "000010",
    business_name: "(주)아이엠에스커뮤니케이션",
    business_number: "000-00-00000",
    representative_name: "정만수",
    division: "개인",
    campaign_in_progress: 42,
    campaign_completed: 40,
    current_points: 0,
    used_points: 0,
    status_type: "주의 회원",
    status: "정상",
    last_access_date: "2026-02-05 12:30",
    join_date: "2026-01-21 14:20",
  },
  {
    id: "11",
    number: "000011",
    business_name: "(주)아이엠에스커뮤니케이션",
    business_number: "000-00-00000",
    representative_name: "정만수",
    division: "개인",
    campaign_in_progress: 28,
    campaign_completed: 26,
    current_points: 0,
    used_points: 0,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-02-06 10:45",
    join_date: "2026-01-26 11:30",
  },
  {
    id: "12",
    number: "000012",
    business_name: "(주)아이엠에스커뮤니케이션",
    business_number: "000-00-00000",
    representative_name: "정만수",
    division: "개인",
    campaign_in_progress: 35,
    campaign_completed: 33,
    current_points: 0,
    used_points: 0,
    status_type: "주의 회원",
    status: "정상",
    last_access_date: "2026-02-07 13:20",
    join_date: "2026-01-30 16:10",
  },
  {
    id: "13",
    number: "000013",
    business_name: "(주)아이엠에스커뮤니케이션",
    business_number: "000-00-00000",
    representative_name: "정만수",
    division: "개인",
    campaign_in_progress: 22,
    campaign_completed: 20,
    current_points: 0,
    used_points: 0,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-02-08 09:30",
    join_date: "2026-02-01 10:45",
  },
  {
    id: "14",
    number: "000014",
    business_name: "주식회사 재밌는걸참좋아하고하고싶은거하는노신사",
    business_number: "000-00-00000",
    representative_name: "노홍철",
    division: "개인",
    campaign_in_progress: 19,
    campaign_completed: 17,
    current_points: 0,
    used_points: 0,
    status_type: "주의 회원",
    status: "정상",
    last_access_date: "2026-02-09 17:40",
    join_date: "2026-02-02 12:00",
  },
  {
    id: "15",
    number: "000015",
    business_name: "데이터없음테스트",
    business_number: "999-99-99999",
    representative_name: "테스트",
    division: "개인",
    campaign_in_progress: 0,
    campaign_completed: 0,
    current_points: 0,
    used_points: 0,
    status_type: "일반 회원",
    status: "정상",
    last_access_date: "2026-02-10 08:20",
    join_date: "2026-02-03 14:15",
  },
  {
    id: "16",
    number: "000016",
    business_name: "탈퇴회원테스트1",
    business_number: "888-88-88888",
    representative_name: "김탈퇴",
    division: "법인",
    campaign_in_progress: 15,
    campaign_completed: 12,
    current_points: 0,
    used_points: 2500000,
    status_type: "이용 제한 회원",
    status: "탈퇴",
    last_access_date: "2024-12-20 14:30",
    join_date: "2023-05-10 10:00",
  },
  {
    id: "17",
    number: "000017",
    business_name: "탈퇴회원테스트2",
    business_number: "777-77-77777",
    representative_name: "이탈퇴",
    division: "개인",
    campaign_in_progress: 8,
    campaign_completed: 6,
    current_points: 0,
    used_points: 1800000,
    status_type: "주의 회원",
    status: "탈퇴",
    last_access_date: "2024-11-15 16:20",
    join_date: "2023-08-20 11:30",
  },
];

// 파트너 ID로 디테일 정보를 가져오는 함수
// 실제 프로젝트에서는 API 호출로 대체됩니다
export function get_partner_detail_by_id(partner_id: string): PartnerDetail | null {
  // partner_test_001인 경우 직접 localStorage에서 읽기
  if (partner_id === "partner_test_001" && typeof window !== "undefined") {
    try {
      const storedAccounts = localStorage.getItem("partner_accounts");

      if (storedAccounts) {
        const accounts = JSON.parse(storedAccounts);
        const testAccount = (accounts as RawPartnerAccount[]).find(
          (a) => a.email === "test@test.com" || a.id === "partner_test_001"
        );

        if (testAccount) {
          // 캠페인 개수 계산
          let campaignCount = 0;
          try {
            const deliveryCampaigns = localStorage.getItem("deliveryCampaigns");
            const missionCampaigns = localStorage.getItem("missionCampaigns");
            const reviewCampaigns = localStorage.getItem("reviewCampaigns");
            const visitCampaigns = localStorage.getItem("visitCampaigns");
            const reporterCampaigns = localStorage.getItem("reporterCampaigns");

            const allCampaigns: RawCampaign[] = [
              ...(deliveryCampaigns ? JSON.parse(deliveryCampaigns) : []),
              ...(missionCampaigns ? JSON.parse(missionCampaigns) : []),
              ...(reviewCampaigns ? JSON.parse(reviewCampaigns) : []),
              ...(visitCampaigns ? JSON.parse(visitCampaigns) : []),
              ...(reporterCampaigns ? JSON.parse(reporterCampaigns) : []),
            ];

            campaignCount = allCampaigns.filter((c) => c.partner_id === "partner_test_001").length;
          } catch (error) {
            console.error("캠페인 개수 계산 중 오류:", error);
          }

          // 포인트 가져오기
          const testPartnerPoints = getPartnerPointSummary("partner_test_001");

          // PartnerItem 생성
          const partner: PartnerItem = {
            id: "partner_test_001",
            number: "999999",
            business_name: testAccount.business_name || "테스트 주식회사",
            business_number: testAccount.business_number || "123-45-67890",
            representative_name:
              testAccount.representative_name || testAccount.name || "테스트파트너",
            division: (testAccount.division ||
              (testAccount.business_type === "개인사업자" ? "개인" : "법인")) as PartnerDivision,
            campaign_in_progress: campaignCount,
            campaign_completed: 0,
            current_points: testPartnerPoints.available_points,
            used_points: 0,
            status_type: "일반 회원",
            status: "정상",
            last_access_date: new Date().toISOString().replace("T", " ").substring(0, 16),
            join_date: testAccount.join_date || testAccount.created_at || "2024-03-01 10:00",
          };

          // 여기서부터 기존 로직 계속 (패널티, 연락처 정보 등)
          const penalty_count = 0; // test 계정은 패널티 없음
          const penalty_history: PenaltyHistoryItem[] = [];

          // 연락처 정보
          const contact_info = {
            email: testAccount.email || "test@test.com",
            phone: testAccount.phone || "010-5555-5555",
            address: testAccount.address
              ? `${testAccount.address}${testAccount.detail_address ? " " + testAccount.detail_address : ""}`
              : "서울시 강남구 테헤란로 123",
            contact_name: testAccount.name || testAccount.representative_name || "테스트파트너",
            contact_phone: testAccount.contact_phone || testAccount.phone || "010-5555-5555",
          };

          // 캠페인 내역 생성
          const recent_campaigns: RecentCampaign[] = [];

          // 포인트 정보 (사용 포인트 = 총 보유 - 사용 가능)
          const payment_points =
            testPartnerPoints.total_points - testPartnerPoints.available_points;

          // PartnerDetail 반환
          return {
            ...partner,
            email: contact_info.email,
            phone: contact_info.phone,
            address: contact_info.address,
            contact_name: contact_info.contact_name,
            contact_phone: contact_info.contact_phone,
            penalty_count,
            payment_points,
            recent_campaigns,
            penalty_history,
          };
        }
      }
    } catch (error) {
      console.error("test 파트너 정보 직접 로드 중 오류:", error);
    }
  }

  // 기존 로직: 다른 파트너들은 get_partner_list 사용
  const allPartners = get_partner_list();
  const partner = allPartners.find((p) => p.id === partner_id);
  if (!partner) {
    return null;
  }

  // 패널티 횟수 계산: ID에 따라 다르게 설정
  // 실제 프로젝트에서는 API에서 받아온 데이터를 사용합니다
  const penalty_count_map: Record<string, number> = {
    "1": 3,
    "2": 1,
    "3": 2,
    "4": 0,
    "5": 1,
    "6": 0,
    "7": 0,
    "8": 0,
    "9": 0,
    "10": 0,
    "11": 0,
    "12": 0,
    "13": 0,
    "14": 0,
    "15": 0, // 데이터 없음 테스트용
    "16": 0, // 탈퇴 회원 테스트용
    "17": 0, // 탈퇴 회원 테스트용
    partner_test_001: 0, // 테스트 계정
  };
  const penalty_count = penalty_count_map[partner.id] || 0;

  // 패널티 내역 생성: penalty_count에 맞춰서 생성
  // 유형은 항상 "경고"로 표시되므로, 상태 값은 실제 상태(일시정지 또는 정상)만 저장합니다
  const penalty_history: PenaltyHistoryItem[] = [];
  if (penalty_count > 0) {
    for (let i = 0; i < penalty_count; i++) {
      // 첫 번째 항목이고 패널티가 3개 이상이면 일시정지, 그 외는 정상
      const actualStatus = i === 0 && penalty_count >= 3 ? "일시정지" : "정상";

      penalty_history.push({
        type: i === penalty_count - 1 && penalty_count > 1 ? "선정 후 취소" : "지각 제출",
        reason: i === penalty_count - 1 && penalty_count > 1 ? "선정 후 취소" : "지각 제출",
        processed_date: `2025-08-${String(i + 1).padStart(2, "0")} 18:56`,
        status: actualStatus,
      });
    }
  }

  // 각 파트너마다 다른 연락처 정보 매핑
  const contact_info_map: Record<
    string,
    {
      email: string;
      phone: string;
      address: string;
      contact_name: string;
      contact_phone: string;
    }
  > = {
    "1": {
      email: "contact@cmcm.co.kr",
      phone: "02-1234-5678",
      address: "서울시 강남구 테헤란로 123",
      contact_name: "홍길동",
      contact_phone: "010-1234-5678",
    },
    "2": {
      email: "cheongbul@example.com",
      phone: "010-2345-6789",
      address: "서울시 송파구 올림픽로 456",
      contact_name: "김철수",
      contact_phone: "010-2345-6789",
    },
    "3": {
      email: "myeongryunjinsa@example.com",
      phone: "031-3456-7890",
      address: "경기도 수원시 영통구 광교로 789",
      contact_name: "이영희",
      contact_phone: "010-3456-7890",
    },
    "4": {
      email: "rainbow8@example.com",
      phone: "02-4567-8901",
      address: "서울시 서초구 서초대로 321",
      contact_name: "박민수",
      contact_phone: "010-4567-8901",
    },
    "5": {
      email: "playtier@example.com",
      phone: "010-5678-9012",
      address: "서울시 마포구 홍대로 654",
      contact_name: "최지영",
      contact_phone: "010-5678-9012",
    },
    "6": {
      email: "flower@example.com",
      phone: "010-6789-0123",
      address: "서울시 강동구 천호대로 987",
      contact_name: "정수진",
      contact_phone: "010-6789-0123",
    },
    "7": {
      email: "ydcompany@example.com",
      phone: "02-7890-1234",
      address: "서울시 종로구 종로 147",
      contact_name: "강동욱",
      contact_phone: "010-7890-1234",
    },
    "8": {
      email: "ims@example.com",
      phone: "010-8901-2345",
      address: "서울시 용산구 한강대로 258",
      contact_name: "윤서연",
      contact_phone: "010-8901-2345",
    },
    "9": {
      email: "cheongmyeong@example.com",
      phone: "032-9012-3456",
      address: "인천시 연수구 송도과학로 369",
      contact_name: "임태호",
      contact_phone: "010-9012-3456",
    },
    "10": {
      email: "ims2@example.com",
      phone: "010-0123-4567",
      address: "서울시 노원구 상계로 741",
      contact_name: "한소희",
      contact_phone: "010-0123-4567",
    },
    "11": {
      email: "ims3@example.com",
      phone: "010-1234-5678",
      address: "서울시 양천구 목동로 852",
      contact_name: "오현우",
      contact_phone: "010-1234-5678",
    },
    "12": {
      email: "ims4@example.com",
      phone: "010-2345-6789",
      address: "서울시 강서구 공항대로 963",
      contact_name: "신미래",
      contact_phone: "010-2345-6789",
    },
    "13": {
      email: "ims5@example.com",
      phone: "010-3456-7890",
      address: "서울시 은평구 은평로 159",
      contact_name: "류성민",
      contact_phone: "010-3456-7890",
    },
    "14": {
      email: "nohongchul@example.com",
      phone: "010-4567-8901",
      address: "서울시 성동구 왕십리로 357",
      contact_name: "노홍철",
      contact_phone: "010-4567-8901",
    },
    "15": {
      email: "test@example.com",
      phone: "010-0000-0000",
      address: "인천 남동구 장자로 6번길 2",
      contact_name: "테스트",
      contact_phone: "010-1234-5678",
    },
    "16": {
      email: "withdrawn1@test.com",
      phone: "02-1111-1111",
      address: "서울시 강남구 테헤란로 111",
      contact_name: "김탈퇴",
      contact_phone: "010-1111-1111",
    },
    "17": {
      email: "withdrawn2@test.com",
      phone: "010-2222-2222",
      address: "서울시 마포구 홍대입구로 222",
      contact_name: "이탈퇴",
      contact_phone: "010-2222-2222",
    },
    partner_test_001: {
      email: "test@test.com",
      phone: "010-5555-5555",
      address: "서울시 강남구 테헤란로 123",
      contact_name: "테스트파트너",
      contact_phone: "010-5555-5555",
    },
  };

  // 파트너 ID에 해당하는 연락처 정보 가져오기
  let contact_info = contact_info_map[partner.id];

  // test@test.com 파트너인 경우 localStorage에서 실제 정보 가져오기
  if (partner.id === "partner_test_001" && typeof window !== "undefined") {
    try {
      const storedAccounts = localStorage.getItem("partner_accounts");
      if (storedAccounts) {
        const accounts = JSON.parse(storedAccounts);
        const testAccount = (accounts as RawPartnerAccount[]).find(
          (a) => a.email === "test@test.com" || a.id === "partner_test_001"
        );
        if (testAccount) {
          contact_info = {
            email: testAccount.email || "test@test.com",
            phone: testAccount.phone || "010-5555-5555",
            address: testAccount.address
              ? `${testAccount.address}${testAccount.detail_address ? " " + testAccount.detail_address : ""}`
              : "서울시 강남구 테헤란로 123",
            contact_name: testAccount.name || testAccount.representative_name || "테스트파트너",
            contact_phone: testAccount.contact_phone || testAccount.phone || "010-5555-5555",
          };
        }
      }
    } catch (error) {
      console.error("파트너 계정 정보 로드 중 오류:", error);
    }
  }

  // 연락처 정보가 없으면 기본값 사용
  if (!contact_info) {
    contact_info = {
      email: "contact@example.com",
      phone: "010-0000-0000",
      address: "서울시 중구 세종대로 123",
      contact_name: "담당자",
      contact_phone: "010-1234-5678",
    };
  }

  // 캠페인 진행 내역 생성: LocalStorage에서 실제 데이터 가져오기
  // 각 파트너마다 다른 캠페인 데이터를 가지도록 다양하게 설정
  let recent_campaigns: RecentCampaign[] = [];
  let actualCampaignCount = partner.campaign_in_progress;

  // LocalStorage에서 파트너의 실제 캠페인 가져오기
  if (typeof window !== "undefined") {
    try {
      const deliveryCampaigns = localStorage.getItem("deliveryCampaigns");
      const missionCampaigns = localStorage.getItem("missionCampaigns");
      const reviewCampaigns = localStorage.getItem("reviewCampaigns");
      const visitCampaigns = localStorage.getItem("visitCampaigns");
      const reporterCampaigns = localStorage.getItem("reporterCampaigns");

      const allCampaigns = [
        ...(deliveryCampaigns ? JSON.parse(deliveryCampaigns) : []),
        ...(missionCampaigns ? JSON.parse(missionCampaigns) : []),
        ...(reviewCampaigns ? JSON.parse(reviewCampaigns) : []),
        ...(visitCampaigns ? JSON.parse(visitCampaigns) : []),
        ...(reporterCampaigns ? JSON.parse(reporterCampaigns) : []),
      ];

      // 해당 파트너의 캠페인만 필터링
      const partnerCampaigns = (allCampaigns as RawCampaign[]).filter(
        (c) => c.partner_id === partner.id
      );

      // 캠페인 데이터를 RecentCampaign 형식으로 변환
      recent_campaigns = partnerCampaigns.slice(0, 100).map((c, index) => ({
        campaign_number: c.id || String(index + 1).padStart(6, "0"),
        campaign_name: c.name || c.title || "캠페인명 없음",
        status: (c.status === "예정" || c.status === "진행중"
          ? "진행"
          : "종료") as RecentCampaign["status"],
        type: (c.type === "delivery"
          ? "배송형"
          : c.type === "mission"
            ? "미션형"
            : c.type === "review"
              ? "구매평"
              : c.type === "visit"
                ? "방문형"
                : "기자단") as RecentCampaign["type"],
        channel: (c.platform || "Blog") as RecentCampaign["channel"],
        points: c.points || c.totalPoints || 0,
      }));

      // 실제 캠페인 개수 업데이트
      actualCampaignCount = partnerCampaigns.length;
    } catch (error) {
      console.error("캠페인 데이터 로드 중 오류:", error);
    }
  }

  // LocalStorage에 캠페인이 없으면 Mock 데이터 사용
  // 데이터 없음 테스트용: ID가 '15'인 경우 빈 배열로 유지
  if (recent_campaigns.length === 0 && partner.id !== "15") {
    const campaign_count = partner.campaign_in_progress;

    // 캠페인 데이터 템플릿 (파트너마다 다른 데이터를 생성하기 위한 배열)
    const campaign_templates: Omit<RecentCampaign, "campaign_number">[] = [
      {
        campaign_name: "푸러블 고농축 캡슐세제 플라워향, 1개, 110개입",
        status: "진행",
        type: "배송형",
        channel: "Blog",
        points: 115000,
      },
      {
        campaign_name: "나만의 향수만들기 체험 [그리디센트]",
        status: "진행",
        type: "구매평",
        channel: "Store",
        points: 50000,
      },
      {
        campaign_name: "스타벅스 리저브 원두 체험",
        status: "종료",
        type: "배송형",
        channel: "Blog",
        points: 80000,
      },
      {
        campaign_name: "나이키 에어맥스 운동화 리뷰",
        status: "종료",
        type: "구매평",
        channel: "Instagram",
        points: 120000,
      },
      {
        campaign_name: "갤럭시 버즈 프로 체험",
        status: "종료",
        type: "배송형",
        channel: "Youtube",
        points: 150000,
      },
      {
        campaign_name: "아이폰 15 프로 맥스 리뷰",
        status: "진행",
        type: "구매평",
        channel: "Blog",
        points: 200000,
      },
      {
        campaign_name: "코카콜라 제로 슈가 체험",
        status: "종료",
        type: "배송형",
        channel: "Clip",
        points: 30000,
      },
    ];

    // campaign_in_progress 값에 맞춰서 캠페인 내역 생성
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

  // 파트너 포인트 가져오기 (브라우저 환경에서만)
  let partnerPoints = 0;
  if (typeof window !== "undefined") {
    try {
      const points = getPartnerPointSummary(partner.id);
      partnerPoints = points.available_points;
    } catch (error) {
      console.error("파트너 포인트 로드 중 오류:", error);
    }
  }

  // 디테일 정보 생성 (목업 데이터)
  // 실제 프로젝트에서는 API에서 받아온 데이터를 사용합니다
  const detail: PartnerDetail = {
    ...partner,
    email: contact_info.email,
    phone: contact_info.phone,
    address: contact_info.address,
    contact_name: contact_info.contact_name,
    contact_phone: contact_info.contact_phone,
    penalty_count: penalty_count,
    payment_points: partnerPoints,
    penalty_history: penalty_history,
    recent_campaigns: recent_campaigns,
  };

  return detail;
}

// localStorage 키
const STORAGE_KEY_PARTNER_STATUS_UPDATES = "partner_status_type_updates";
const STORAGE_KEY_PARTNER_PREVIOUS_STATUS = "partner_previous_status_type";

// localStorage에서 상태 업데이트 정보 로드
function load_status_updates_from_storage(): Record<string, PartnerStatusType> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY_PARTNER_STATUS_UPDATES);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("localStorage에서 파트너 상태 업데이트 로드 실패:", error);
    return {};
  }
}

// localStorage에서 이전 상태 정보 로드 (해제 시 복원용)
function load_previous_status_from_storage(): Record<string, PartnerStatusType> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY_PARTNER_PREVIOUS_STATUS);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("localStorage에서 파트너 이전 상태 로드 실패:", error);
    return {};
  }
}

// 상태 업데이트 정보를 localStorage에 저장
function save_status_updates_to_storage(updates: Record<string, PartnerStatusType>): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY_PARTNER_STATUS_UPDATES, JSON.stringify(updates));
  } catch (error) {
    console.error("localStorage에 파트너 상태 업데이트 저장 실패:", error);
  }
}

// 이전 상태 정보를 localStorage에 저장
function save_previous_status_to_storage(previous_status: Record<string, PartnerStatusType>): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY_PARTNER_PREVIOUS_STATUS, JSON.stringify(previous_status));
  } catch (error) {
    console.error("localStorage에 파트너 이전 상태 저장 실패:", error);
  }
}

// 초기 상태 업데이트 로드
const status_type_updates = load_status_updates_from_storage();
const previous_status_types = load_previous_status_from_storage();

// 파트너 목록 가져오기 (상태 업데이트 반영 + LocalStorage 통합)
export function get_partner_list(): PartnerItem[] {
  // 기존 Mock 데이터 처리
  const mockPartners = partner_list.map((partner) => {
    // localStorage에 저장된 상태 업데이트가 있으면 적용
    if (status_type_updates[partner.id]) {
      return {
        ...partner,
        status_type: status_type_updates[partner.id],
      };
    }
    return partner;
  });

  // LocalStorage에서 파트너 계정 가져오기
  if (typeof window !== "undefined") {
    try {
      // 회원가입으로 추가된 파트너 계정
      const storedPartnerAccounts = localStorage.getItem("partner_accounts");
      const partnerAccounts = storedPartnerAccounts ? JSON.parse(storedPartnerAccounts) : [];

      // unifiedAccountData에서 test@test.com 파트너 정보 가져오기 (항상 추가)
      // 현재 시간을 YYYY-MM-DD HH:mm 형식으로 포맷
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

      // LocalStorage에서 test@test.com 파트너의 실제 캠페인 개수 계산
      let testPartnerCampaignCount = 0;
      try {
        const deliveryCampaigns = localStorage.getItem("deliveryCampaigns");
        const missionCampaigns = localStorage.getItem("missionCampaigns");
        const reviewCampaigns = localStorage.getItem("reviewCampaigns");
        const visitCampaigns = localStorage.getItem("visitCampaigns");
        const reporterCampaigns = localStorage.getItem("reporterCampaigns");

        const allCampaigns = [
          ...(deliveryCampaigns ? JSON.parse(deliveryCampaigns) : []),
          ...(missionCampaigns ? JSON.parse(missionCampaigns) : []),
          ...(reviewCampaigns ? JSON.parse(reviewCampaigns) : []),
          ...(visitCampaigns ? JSON.parse(visitCampaigns) : []),
          ...(reporterCampaigns ? JSON.parse(reporterCampaigns) : []),
        ];

        testPartnerCampaignCount = (allCampaigns as RawCampaign[]).filter(
          (c) => c.partner_id === "partner_test_001"
        ).length;
      } catch (error) {
        console.error("캠페인 개수 계산 중 오류:", error);
      }

      // 테스트 파트너의 실제 포인트 가져오기
      const testPartnerPoints = getPartnerPointSummary("partner_test_001");

      // test@test.com 파트너 정보를 partner_accounts에서 찾기
      const testPartnerAccount = (partnerAccounts as RawPartnerAccount[]).find(
        (account) => account.email === "test@test.com" || account.id === "partner_test_001"
      );

      const testPartner: PartnerItem = {
        id: "partner_test_001", // 고정 ID 사용
        number: "999999",
        business_name: testPartnerAccount?.business_name || "테스트 주식회사",
        business_number: testPartnerAccount?.business_number || "123-45-67890",
        representative_name:
          testPartnerAccount?.representative_name || testPartnerAccount?.name || "테스트파트너",
        division: (testPartnerAccount?.division ||
          (testPartnerAccount?.business_type === "개인사업자"
            ? "개인"
            : "법인")) as PartnerDivision,
        campaign_in_progress: testPartnerCampaignCount,
        campaign_completed: 0,
        current_points: testPartnerPoints.available_points,
        used_points: 0,
        status_type: "일반 회원",
        status: "정상",
        last_access_date: currentDateTime,
        join_date:
          testPartnerAccount?.join_date || testPartnerAccount?.created_at || "2024-03-01 10:00",
      };

      // 중복 확인 후 추가 (ID 기준으로 확인)
      const existsInMock = mockPartners.some((p) => p.id === "partner_test_001");
      if (!existsInMock) {
        mockPartners.push(testPartner);
      }

      // LocalStorage 파트너 계정들을 PartnerItem 형식으로 변환하여 추가
      // test@test.com 계정은 이미 위에서 추가했으므로 제외
      const localStoragePartners = (partnerAccounts as RawPartnerAccount[])
        .filter((account) => account.email !== "test@test.com" && account.id !== "partner_test_001")
        .map((account) => {
          // 날짜 포맷 함수 - YYYY-MM-DD HH:mm 형식으로 변환
          const formatDateTime = (dateStr?: string): string => {
            if (!dateStr) {
              const now = new Date();
              const year = now.getFullYear();
              const month = String(now.getMonth() + 1).padStart(2, "0");
              const day = String(now.getDate()).padStart(2, "0");
              const hours = String(now.getHours()).padStart(2, "0");
              const minutes = String(now.getMinutes()).padStart(2, "0");
              return `${year}-${month}-${day} ${hours}:${minutes}`;
            }
            // 이미 올바른 형식인지 확인 (YYYY-MM-DD HH:mm)
            if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateStr)) {
              return dateStr;
            }
            // ISO 형식이면 변환 (YYYY-MM-DDTHH:mm:ss.sssZ)
            if (dateStr.includes("T")) {
              const date = new Date(dateStr);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              const hours = String(date.getHours()).padStart(2, "0");
              const minutes = String(date.getMinutes()).padStart(2, "0");
              return `${year}-${month}-${day} ${hours}:${minutes}`;
            }
            return dateStr;
          };

          return {
            id: account.id ?? `partner_local_${Date.now()}`,
            number: account.number || String(mockPartners.length + 1).padStart(6, "0"),
            business_name: account.business_name || account.companyName || "상호명 미등록",
            business_number: account.business_number || account.businessNumber || "-",
            representative_name: account.representative_name || account.name || "대표자명 미등록",
            division: (account.division || "개인") as PartnerDivision,
            campaign_in_progress: account.campaign_in_progress || 0,
            campaign_completed: account.campaign_completed || 0,
            current_points: account.current_points || 0,
            used_points: account.used_points || 0,
            status_type: (account.status_type || "일반 회원") as PartnerStatusType,
            status: (account.status || "정상") as PartnerStatus,
            last_access_date: formatDateTime(account.last_access_date || account.join_date),
            join_date: formatDateTime(account.join_date),
          };
        });

      return [...mockPartners, ...localStoragePartners];
    } catch (error) {
      console.error("LocalStorage 파트너 데이터 로드 중 오류:", error);
      return mockPartners;
    }
  }

  return mockPartners;
}

// 파트너 상태 타입 업데이트
// 이용 제한 시 이전 상태를 저장하고, 해제 시 복원할 수 있도록 합니다
export function update_partner_status_type(
  partner_id: string,
  new_status_type: PartnerStatusType
): void {
  // 현재 상태 가져오기 (이전 상태 저장용)
  const current_partner = partner_list.find((p) => p.id === partner_id);
  const current_status_type =
    status_type_updates[partner_id] ||
    (current_partner ? current_partner.status_type : "일반 회원");

  // "이용 제한 회원"으로 변경하는 경우에만 이전 상태 저장
  if (new_status_type === "이용 제한 회원" && current_status_type !== "이용 제한 회원") {
    previous_status_types[partner_id] = current_status_type;
    save_previous_status_to_storage(previous_status_types);
  }

  // localStorage에 업데이트 저장
  status_type_updates[partner_id] = new_status_type;
  save_status_updates_to_storage(status_type_updates);
}

// 파트너 상태 타입 복원 (해제 시 이전 상태로 복원)
export function restore_partner_status_type(partner_id: string): void {
  // 이전 상태가 있으면 복원
  if (previous_status_types[partner_id]) {
    status_type_updates[partner_id] = previous_status_types[partner_id];
    delete previous_status_types[partner_id];
    save_status_updates_to_storage(status_type_updates);
    save_previous_status_to_storage(previous_status_types);
  } else {
    // 이전 상태가 없으면 기본값으로 복원 (localStorage에서 제거)
    delete status_type_updates[partner_id];
    save_status_updates_to_storage(status_type_updates);
  }
}
