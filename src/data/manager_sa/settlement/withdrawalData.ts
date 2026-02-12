/* ========================================
   💰 SA 관리자 출금 현황 데이터
   ======================================== */

/**
 * 출금 현황 페이지의 모든 데이터를 관리하는 파일
 *
 * 목적: 출금 현황 페이지에 표시되는 모든 수치 데이터를 한 곳에서 관리
 */

/* ========================================
   📊 통계 카드 데이터
   ======================================== */

export interface WithdrawalStats {
  monthTotal: {
    amount: string; // 출금 합계 금액
    count: string; // 출금 건수
  };
  weekScheduled: {
    amount: string; // 이번 주 출금 예정 금액
  };
  urgent: {
    amount: string; // 긴급 정산 금액
    count: string; // 긴급 정산 건수
  };
  totalDeposit: {
    amount: string; // 예치금 총 합계 금액
  };
}

export const withdrawalStats: WithdrawalStats = {
  monthTotal: {
    amount: "28,000,000원",
    count: "20건",
  },
  weekScheduled: {
    amount: "10,000,000원",
  },
  urgent: {
    amount: "120,000원",
    count: "12건",
  },
  totalDeposit: {
    amount: "128,000,000원",
  },
};

/* ========================================
   📋 출금 현황 테이블 데이터
   ======================================== */

export interface WithdrawalItem {
  id: string;
  number: string;
  round: string;
  name: string;
  account: string;
  ssn: string;
  amount: string; // 출금 포인트 금액
  remaining: string; // 잔여 금액
  requestDate: string;
  paymentDate: string;
  type: "일반 회원" | "주의 회원" | "이용 제한 회원"; // 회원 유형
  paymentStatus: "urgent" | "request" | "completed" | "rejected"; // 지급 처리 상태 (지급 열에 표시)
  status: "정상" | "일시 정지" | "영구 정지" | "탈퇴"; // 회원 상태 (상태 열에 표시)
}

export const withdrawalList: WithdrawalItem[] = [
  {
    id: "1",
    number: "000015",
    round: "-",
    name: "조로이스",
    account: "우리은행 1002254541773 조로이스",
    ssn: "861256-2******",
    amount: "18,500,000",
    remaining: "999,999,999",
    requestDate: "2026-02-01 14:30",
    paymentDate: "-",
    type: "주의 회원",
    paymentStatus: "urgent",
    status: "정상",
  },
  {
    id: "2",
    number: "000003",
    round: "45",
    name: "김은지",
    account: "카카오뱅크 3333057752425 김은지",
    ssn: "861256-2******",
    amount: "5,200,000",
    remaining: "120,000",
    requestDate: "2026-02-02 09:15",
    paymentDate: "-",
    type: "일반 회원",
    paymentStatus: "request",
    status: "일시 정지",
  },
  {
    id: "3",
    number: "000008",
    round: "45",
    name: "홍길동",
    account: "국민은행 65940101490957 홍길동",
    ssn: "861256-2******",
    amount: "7,800,000",
    remaining: "1,538,000",
    requestDate: "2026-02-03 11:20",
    paymentDate: "-",
    type: "일반 회원",
    paymentStatus: "request",
    status: "정상",
  },
  {
    id: "4",
    number: "000001",
    round: "-",
    name: "유연희",
    account: "국민은행 01140100009875 유연희",
    ssn: "861256-2******",
    amount: "1,200,000",
    remaining: "1,538,000",
    requestDate: "2026-02-04 08:00",
    paymentDate: "2026-02-04 18:56",
    type: "일반 회원",
    paymentStatus: "urgent",
    status: "영구 정지",
  },
  {
    id: "5",
    number: "000012",
    round: "44",
    name: "김히어라",
    account: "우체국은행 01372202077893 김히어라",
    ssn: "861256-2******",
    amount: "22,300,000",
    remaining: "1,538,000",
    requestDate: "2026-02-05 16:45",
    paymentDate: "-",
    type: "이용 제한 회원",
    paymentStatus: "rejected",
    status: "탈퇴",
  },
  {
    id: "6",
    number: "000005",
    round: "44",
    name: "일이삼사오육칠팔구십",
    account: "기업은행 28405876501018 일이삼사오육칠팔구십",
    ssn: "861256-2******",
    amount: "8,500,000",
    remaining: "1,538,000",
    requestDate: "2026-02-06 13:30",
    paymentDate: "2026-02-06 18:00",
    type: "일반 회원",
    paymentStatus: "completed",
    status: "정상",
  },
  {
    id: "7",
    number: "000020",
    round: "44",
    name: "이은",
    account: "한국씨티은행 1630339624201 이은",
    ssn: "861256-2******",
    amount: "12,200,000",
    remaining: "1,538,000",
    requestDate: "2026-02-07 10:10",
    paymentDate: "2026-02-07 15:30",
    type: "일반 회원",
    paymentStatus: "completed",
    status: "일시 정지",
  },
  {
    id: "8",
    number: "000002",
    round: "44",
    name: "김휘수",
    account: "산림조합중앙회 1002254541773 조로이스",
    ssn: "861256-2******",
    amount: "3,500,000",
    remaining: "1,538,000",
    requestDate: "2026-02-08 12:00",
    paymentDate: "2026-02-08 17:30",
    type: "일반 회원",
    paymentStatus: "completed",
    status: "정상",
  },
  {
    id: "9",
    number: "000018",
    round: "44",
    name: "황보선혜",
    account: "뱅크오브아메리카 1002254541773 조로이스",
    ssn: "861256-2******",
    amount: "9,500,000",
    remaining: "1,538,000",
    requestDate: "2026-02-09 15:20",
    paymentDate: "2026-02-09 20:00",
    type: "일반 회원",
    paymentStatus: "completed",
    status: "영구 정지",
  },
  {
    id: "10",
    number: "000007",
    round: "44",
    name: "장세희",
    account: "BNP파리바은행 1002254541773 조로이스",
    ssn: "861256-2******",
    amount: "6,200,000",
    remaining: "1,538,000",
    requestDate: "2026-02-10 09:45",
    paymentDate: "2026-02-10 14:15",
    type: "일반 회원",
    paymentStatus: "completed",
    status: "정상",
  },
  {
    id: "11",
    number: "000011",
    round: "44",
    name: "김은빛",
    account: "BNP파리바은행 1002254541773 조로이스김",
    ssn: "861256-2******",
    amount: "38,800,000",
    remaining: "1,538,000",
    requestDate: "2026-02-11 11:30",
    paymentDate: "2026-02-11 16:45",
    type: "일반 회원",
    paymentStatus: "completed",
    status: "탈퇴",
  },
  {
    id: "12",
    number: "000004",
    round: "43",
    name: "박민수",
    account: "신한은행 110123456789 박민수",
    ssn: "901234-1******",
    amount: "4,400,000",
    remaining: "800,000",
    requestDate: "2026-02-12 10:00",
    paymentDate: "-",
    type: "주의 회원",
    paymentStatus: "request",
    status: "일시 정지",
  },
  {
    id: "13",
    number: "000019",
    round: "42",
    name: "최지영",
    account: "하나은행 3560123456789 최지영",
    ssn: "880101-2******",
    amount: "55,500,000",
    remaining: "5,000,000",
    requestDate: "2026-02-13 08:30",
    paymentDate: "-",
    type: "주의 회원",
    paymentStatus: "urgent",
    status: "정상",
  },
  {
    id: "14",
    number: "000006",
    round: "41",
    name: "이현우",
    account: "SC제일은행 123456789012 이현우",
    ssn: "920505-1******",
    amount: "2,500,000",
    remaining: "450,000",
    requestDate: "2026-02-14 14:20",
    paymentDate: "2026-02-14 19:00",
    type: "일반 회원",
    paymentStatus: "completed",
    status: "영구 정지",
  },
  {
    id: "15",
    number: "000014",
    round: "-",
    name: "정수진",
    account: "토스뱅크 100012345678 정수진",
    ssn: "870808-2******",
    amount: "11,100,000",
    remaining: "2,200,000",
    requestDate: "2026-02-15 13:15",
    paymentDate: "-",
    type: "일반 회원",
    paymentStatus: "request",
    status: "탈퇴",
  },
];
