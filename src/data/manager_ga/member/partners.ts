/* ========================================
   📊 GA 관리자 파트너 목록 목업 데이터
   ======================================== */

/**
 * GA 관리자 파트너 목록 목업 데이터
 *
 * 목적: GA 관리자 파트너 목록 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/partners (파트너 목록 페이지)
 *
 * 주요 기능:
 * - 파트너 통계 데이터
 * - 파트너 목록 데이터
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

// 타입 재export (기존 코드와의 호환성을 위해)
export type { PartnerDivision, PartnerStatus, PartnerStatusType, Channel };

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
  status_type: PartnerStatusType; // 상태 유형 (모범 회원, 주의 회원, 경고 회원, 이용 제한 회원)
  status: PartnerStatus; // 상태
  last_access_date: string; // 접속일 (예: 2025-08-01 18:56)
  join_date: string; // 가입일 (예: 2025-08-01 18:56)
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
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
  },
  {
    id: "2",
    number: "123456",
    business_name: "청불 천막집 방이점",
    business_number: "211-23-55991",
    representative_name: "장민석외 2명",
    division: "개인",
    campaign_in_progress: 1,
    campaign_completed: 1,
    current_points: 0,
    used_points: 32500000,
    status_type: "이용 제한 회원",
    status: "일시 정지",
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
  },
  {
    id: "3",
    number: "008156",
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
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
  },
  {
    id: "4",
    number: "000046",
    business_name: "(주) 레인보우8",
    business_number: "110-86-08583",
    representative_name: "고광웅",
    division: "법인",
    campaign_in_progress: 5,
    campaign_completed: 5,
    current_points: 1200,
    used_points: 1580000,
    status_type: "경고 회원",
    status: "정상",
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
  },
  {
    id: "5",
    number: "000001",
    business_name: "(주)플레티어",
    business_number: "000-00-00000",
    representative_name: "이상훈",
    division: "개인",
    campaign_in_progress: 1,
    campaign_completed: 1,
    current_points: 0,
    used_points: 500000,
    status_type: "이용 제한 회원",
    status: "영구 정지",
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
  },
  {
    id: "6",
    number: "000001",
    business_name: "꽃초롱",
    business_number: "000-00-00000",
    representative_name: "김초롱",
    division: "개인",
    campaign_in_progress: 1,
    campaign_completed: 1,
    current_points: 5400,
    used_points: 1500000,
    status_type: "모범 회원",
    status: "정상",
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
  },
  {
    id: "7",
    number: "000001",
    business_name: "주식회사 와이디컴퍼니그룹",
    business_number: "000-00-00000",
    representative_name: "양동찬",
    division: "개인",
    campaign_in_progress: 1,
    campaign_completed: 1,
    current_points: 251450,
    used_points: 589000,
    status_type: "모범 회원",
    status: "정상",
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
  },
  {
    id: "8",
    number: "000001",
    business_name: "(주)아이엠에스커뮤니케이션",
    business_number: "000-00-00000",
    representative_name: "정만수",
    division: "개인",
    campaign_in_progress: 1,
    campaign_completed: 1,
    current_points: 0,
    used_points: 0,
    status_type: "모범 회원",
    status: "정상",
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
  },
  {
    id: "9",
    number: "000001",
    business_name: "주식회사 청명미디어",
    business_number: "234-86-01377",
    representative_name: "유기수",
    division: "개인",
    campaign_in_progress: 1,
    campaign_completed: 1,
    current_points: 0,
    used_points: 0,
    status_type: "모범 회원",
    status: "정상",
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
  },
  {
    id: "10",
    number: "000001",
    business_name: "(주)아이엠에스커뮤니케이션",
    business_number: "000-00-00000",
    representative_name: "정만수",
    division: "개인",
    campaign_in_progress: 1,
    campaign_completed: 1,
    current_points: 0,
    used_points: 0,
    status_type: "모범 회원",
    status: "정상",
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
  },
  {
    id: "11",
    number: "000001",
    business_name: "(주)아이엠에스커뮤니케이션",
    business_number: "000-00-00000",
    representative_name: "정만수",
    division: "개인",
    campaign_in_progress: 1,
    campaign_completed: 1,
    current_points: 0,
    used_points: 0,
    status_type: "모범 회원",
    status: "정상",
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
  },
  {
    id: "12",
    number: "000001",
    business_name: "(주)아이엠에스커뮤니케이션",
    business_number: "000-00-00000",
    representative_name: "정만수",
    division: "개인",
    campaign_in_progress: 1,
    campaign_completed: 1,
    current_points: 0,
    used_points: 0,
    status_type: "모범 회원",
    status: "정상",
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
  },
  {
    id: "13",
    number: "000001",
    business_name: "(주)아이엠에스커뮤니케이션",
    business_number: "000-00-00000",
    representative_name: "정만수",
    division: "개인",
    campaign_in_progress: 1,
    campaign_completed: 1,
    current_points: 0,
    used_points: 0,
    status_type: "모범 회원",
    status: "정상",
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
  },
  {
    id: "14",
    number: "000001",
    business_name: "주식회사 재밌는걸참좋아하고하고싶은거하는노신사",
    business_number: "000-00-00000",
    representative_name: "노홍철",
    division: "개인",
    campaign_in_progress: 1,
    campaign_completed: 1,
    current_points: 0,
    used_points: 0,
    status_type: "모범 회원",
    status: "정상",
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
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
    status_type: "모범 회원",
    status: "정상",
    last_access_date: "2025-08-01 18:56",
    join_date: "2025-08-01 18:56",
  },
];

// 파트너 ID로 디테일 정보를 가져오는 함수
// 실제 프로젝트에서는 API 호출로 대체됩니다
export function get_partner_detail_by_id(
  partner_id: string
): PartnerDetail | null {
  // 목록에서 해당 파트너 찾기
  const partner = partner_list.find((p) => p.id === partner_id);
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
        type:
          i === penalty_count - 1 && penalty_count > 1
            ? "선정 후 취소"
            : "지각 제출",
        reason:
          i === penalty_count - 1 && penalty_count > 1
            ? "선정 후 취소"
            : "지각 제출",
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
      contact_phone: string;
    }
  > = {
    "1": {
      email: "contact@cmcm.co.kr",
      phone: "02-1234-5678",
      address: "서울시 강남구 테헤란로 123",
      contact_phone: "010-1234-5678",
    },
    "2": {
      email: "cheongbul@example.com",
      phone: "010-2345-6789",
      address: "서울시 송파구 올림픽로 456",
      contact_phone: "010-2345-6789",
    },
    "3": {
      email: "myeongryunjinsa@example.com",
      phone: "031-3456-7890",
      address: "경기도 수원시 영통구 광교로 789",
      contact_phone: "010-3456-7890",
    },
    "4": {
      email: "rainbow8@example.com",
      phone: "02-4567-8901",
      address: "서울시 서초구 서초대로 321",
      contact_phone: "010-4567-8901",
    },
    "5": {
      email: "playtier@example.com",
      phone: "010-5678-9012",
      address: "서울시 마포구 홍대로 654",
      contact_phone: "010-5678-9012",
    },
    "6": {
      email: "flower@example.com",
      phone: "010-6789-0123",
      address: "서울시 강동구 천호대로 987",
      contact_phone: "010-6789-0123",
    },
    "7": {
      email: "ydcompany@example.com",
      phone: "02-7890-1234",
      address: "서울시 종로구 종로 147",
      contact_phone: "010-7890-1234",
    },
    "8": {
      email: "ims@example.com",
      phone: "010-8901-2345",
      address: "서울시 용산구 한강대로 258",
      contact_phone: "010-8901-2345",
    },
    "9": {
      email: "cheongmyeong@example.com",
      phone: "032-9012-3456",
      address: "인천시 연수구 송도과학로 369",
      contact_phone: "010-9012-3456",
    },
    "10": {
      email: "ims2@example.com",
      phone: "010-0123-4567",
      address: "서울시 노원구 상계로 741",
      contact_phone: "010-0123-4567",
    },
    "11": {
      email: "ims3@example.com",
      phone: "010-1234-5678",
      address: "서울시 양천구 목동로 852",
      contact_phone: "010-1234-5678",
    },
    "12": {
      email: "ims4@example.com",
      phone: "010-2345-6789",
      address: "서울시 강서구 공항대로 963",
      contact_phone: "010-2345-6789",
    },
    "13": {
      email: "ims5@example.com",
      phone: "010-3456-7890",
      address: "서울시 은평구 은평로 159",
      contact_phone: "010-3456-7890",
    },
    "14": {
      email: "nohongchul@example.com",
      phone: "010-4567-8901",
      address: "서울시 성동구 왕십리로 357",
      contact_phone: "010-4567-8901",
    },
    "15": {
      email: "test@example.com",
      phone: "010-0000-0000",
      address: "인천 남동구 장자로 6번길 2",
      contact_phone: "010-1234-5678",
    },
  };

  // 파트너 ID에 해당하는 연락처 정보 가져오기 (없으면 기본값 사용)
  const contact_info = contact_info_map[partner.id] || {
    email: "contact@example.com",
    phone: "010-0000-0000",
    address: "서울시 중구 세종대로 123",
    contact_phone: "010-1234-5678",
  };

  // 디테일 정보 생성 (목업 데이터)
  // 실제 프로젝트에서는 API에서 받아온 데이터를 사용합니다
  const detail: PartnerDetail = {
    ...partner,
    email: contact_info.email,
    phone: contact_info.phone,
    address: contact_info.address,
    contact_phone: contact_info.contact_phone,
    penalty_count: penalty_count,
    payment_points: 12580000,
    penalty_history: penalty_history,
    // 데이터 없음 테스트용: ID가 '15'인 경우 빈 배열 반환
    recent_campaigns:
      partner.id === "15"
        ? []
        : [
            {
              campaign_number: "000001",
              campaign_name:
                "푸러블 고농축 캡슐세제 플라워향, 1개, 110개입, 푸러블 고농축 캡슐세제 플라워향, 1개, 110개입, 푸러블 고농축 캡슐세제 플라워향, 1개, 110개입",
              status: "진행",
              type: "배송형",
              channel: "Blog",
              points: 115000,
            },
            {
              campaign_number: "000001",
              campaign_name: "나만의 향수만들기 체험 [그리디센트]",
              status: "진행",
              type: "구매평",
              channel: "Store",
              points: 0,
            },
            {
              campaign_number: "000001",
              campaign_name: "나만의 향수만들기 체험 [그리디센트]",
              status: "종료",
              type: "구매평",
              channel: "Store",
              points: 0,
            },
            {
              campaign_number: "000001",
              campaign_name: "나만의 향수만들기 체험 [그리디센트]",
              status: "종료",
              type: "구매평",
              channel: "Store",
              points: 0,
            },
            {
              campaign_number: "000001",
              campaign_name: "나만의 향수만들기 체험 [그리디센트]",
              status: "종료",
              type: "구매평",
              channel: "Store",
              points: 0,
            },
          ],
  };

  return detail;
}
