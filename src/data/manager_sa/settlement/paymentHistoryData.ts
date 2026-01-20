/* ========================================
   💳 SA 관리자 결제 내역 데이터
   ======================================== */

/**
 * 결제 내역 페이지의 모든 데이터를 관리하는 파일
 *
 * 목적: 결제 내역 페이지에 표시되는 모든 데이터를 한 곳에서 관리
 *
 */

/* ========================================
   📊 통계 카드 데이터
   ======================================== */

/**
 * 결제 내역 통계 인터페이스
 */
export interface PaymentHistoryStats {
  weekDeposit: {
    label: string;
    count: string;
    amount: string;
  };
  weekCardPayment: {
    label: string;
    amount: string;
    count: string;
  };
  monthTotal: {
    label: string;
    count: string;
    amount: string;
  };
}

export const paymentHistoryStats: PaymentHistoryStats = {
  weekDeposit: {
    label: '이번 주 입금 내역',
    count: '12건',
    amount: '120,000원',
  },
  weekCardPayment: {
    label: '이번 주 카드 결제 금액',
    amount: '10,000,000원',
    count: '20건',
  },
  monthTotal: {
    label: '이번 달 총 합계',
    count: '56건',
    amount: '28,000,000원',
  },
};

/* ========================================
   📋 결제 내역 테이블 데이터
   ======================================== */

/**
 * 결제 내역 항목 인터페이스
 * 
 * 각 속성 설명:
 * - id: 고유 식별자
 * - number: 결제 번호
 * - companyName: 상호명
 * - depositorName: 입금자명 (사업자등록번호 · 이름)
 * - businessType: 구분 (법인/개인)
 * - paymentMethod: 결제 수단 (카드 결제/무통장 입금)
 * - taxInvoice: 세금계산서 발행 여부 (O/X)
 * - chargedPoints: 충전 포인트
 * - heldPoints: 보유 포인트
 * - paymentStatus: 결제 상태 (완료/대기/취소)
 * - requestDate: 신청일
 * - approvalDate: 승인일
 * - memberType: 회원 유형
 * - accountStatus: 계정 상태 (정상/일시정지/영구정지/탈퇴)
 */
export interface PaymentHistoryItem {
  id: string;
  number: string;
  companyName: string;
  depositorName: {
    registrationNumber: string;
    name: string;
  };
  businessType: '법인' | '개인';
  paymentMethod: '카드 결제' | '무통장 입금';
  taxInvoice: 'O' | 'X';
  chargedPoints: string;
  heldPoints: string;
  paymentStatus: '완료' | '대기' | '취소';
  requestDate: string;
  approvalDate: string;
  memberType: string;
  accountStatus: '정상' | '일시정지' | '영구정지' | '탈퇴';
}

export const paymentHistoryList: PaymentHistoryItem[] = [
  {
    id: '1',
    number: '999999',
    companyName: '주식회사 청명종합광고기획',
    depositorName: {
      registrationNumber: '122-86-45790',
      name: '김민회',
    },
    businessType: '법인',
    paymentMethod: '카드 결제',
    taxInvoice: 'X',
    chargedPoints: '10,000',
    heldPoints: '0',
    paymentStatus: '완료',
    requestDate: '2025-12-01 14:32',
    approvalDate: '2025-12-01 14:35',
    memberType: '모범 회원',
    accountStatus: '정상',
  },
  {
    id: '2',
    number: '123456',
    companyName: '청불 천막집 방이점',
    depositorName: {
      registrationNumber: '211-23-55991',
      name: '장민석외 2명',
    },
    businessType: '개인',
    paymentMethod: '무통장 입금',
    taxInvoice: 'O',
    chargedPoints: '10,000',
    heldPoints: '0',
    paymentStatus: '대기',
    requestDate: '2025-12-05 09:15',
    approvalDate: '-',
    memberType: '모범 회원',
    accountStatus: '정상',
  },
  {
    id: '3',
    number: '008156',
    companyName: '명륜진사갈비 수원광교점',
    depositorName: {
      registrationNumber: '211-23-55991',
      name: '도선애, 이종근',
    },
    businessType: '개인',
    paymentMethod: '무통장 입금',
    taxInvoice: 'O',
    chargedPoints: '500,000',
    heldPoints: '2,000',
    paymentStatus: '대기',
    requestDate: '2025-12-10 16:42',
    approvalDate: '-',
    memberType: '모범 회원',
    accountStatus: '정상',
  },
  {
    id: '4',
    number: '000046',
    companyName: '(주) 레인보우8',
    depositorName: {
      registrationNumber: '110-86-08583',
      name: '고광웅',
    },
    businessType: '법인',
    paymentMethod: '무통장 입금',
    taxInvoice: 'O',
    chargedPoints: '10,000',
    heldPoints: '100',
    paymentStatus: '완료',
    requestDate: '2025-12-15 11:20',
    approvalDate: '2025-12-15 11:25',
    memberType: '모범 회원',
    accountStatus: '일시정지',
  },
  {
    id: '5',
    number: '000001',
    companyName: '(주)플레티어',
    depositorName: {
      registrationNumber: '000-00-00000',
      name: '이상훈',
    },
    businessType: '개인',
    paymentMethod: '카드 결제',
    taxInvoice: 'X',
    chargedPoints: '10,000',
    heldPoints: '0',
    paymentStatus: '취소',
    requestDate: '2025-12-18 13:55',
    approvalDate: '2025-12-18 13:58',
    memberType: '주의 회원',
    accountStatus: '일시정지',
  },
  {
    id: '6',
    number: '000001',
    companyName: '꽃초롱',
    depositorName: {
      registrationNumber: '000-00-00000',
      name: '김초롱',
    },
    businessType: '개인',
    paymentMethod: '카드 결제',
    taxInvoice: 'X',
    chargedPoints: '100,000',
    heldPoints: '280,000',
    paymentStatus: '완료',
    requestDate: '2025-12-22 10:30',
    approvalDate: '2025-12-22 10:32',
    memberType: '주의 회원',
    accountStatus: '일시정지',
  },
  {
    id: '7',
    number: '000001',
    companyName: '주식회사 와이디컴퍼니그룹',
    depositorName: {
      registrationNumber: '000-00-00000',
      name: '양동찬',
    },
    businessType: '개인',
    paymentMethod: '카드 결제',
    taxInvoice: 'X',
    chargedPoints: '10,000',
    heldPoints: '0',
    paymentStatus: '완료',
    requestDate: '2025-12-28 15:18',
    approvalDate: '2025-12-28 15:20',
    memberType: '이용 제한 회원',
    accountStatus: '영구정지',
  },
  {
    id: '8',
    number: '000001',
    companyName: '(주)아이엠에스커뮤니케이션',
    depositorName: {
      registrationNumber: '000-00-00000',
      name: '정만수',
    },
    businessType: '개인',
    paymentMethod: '카드 결제',
    taxInvoice: 'X',
    chargedPoints: '10,000',
    heldPoints: '0',
    paymentStatus: '완료',
    requestDate: '2025-12-31 17:45',
    approvalDate: '2025-12-31 17:47',
    memberType: '주의 회원',
    accountStatus: '영구정지',
  },
  {
    id: '9',
    number: '000001',
    companyName: '주식회사 청명미디어',
    depositorName: {
      registrationNumber: '234-86-01377',
      name: '유기수',
    },
    businessType: '개인',
    paymentMethod: '카드 결제',
    taxInvoice: 'X',
    chargedPoints: '10,000',
    heldPoints: '0',
    paymentStatus: '완료',
    requestDate: '2026-01-03 12:10',
    approvalDate: '2026-01-03 12:12',
    memberType: '주의 회원',
    accountStatus: '영구정지',
  },
  {
    id: '10',
    number: '000001',
    companyName: '(주)아이엠에스커뮤니케이션',
    depositorName: {
      registrationNumber: '000-00-00000',
      name: '정만수',
    },
    businessType: '개인',
    paymentMethod: '무통장 입금',
    taxInvoice: 'X',
    chargedPoints: '10,000',
    heldPoints: '0',
    paymentStatus: '완료',
    requestDate: '2026-01-08 09:25',
    approvalDate: '2026-01-08 09:30',
    memberType: '이용 제한 회원',
    accountStatus: '탈퇴',
  },
  {
    id: '11',
    number: '000001',
    companyName: '(주)아이엠에스커뮤니케이션',
    depositorName: {
      registrationNumber: '000-00-00000',
      name: '정만수',
    },
    businessType: '개인',
    paymentMethod: '무통장 입금',
    taxInvoice: 'O',
    chargedPoints: '10,000',
    heldPoints: '0',
    paymentStatus: '완료',
    requestDate: '2026-01-15 14:50',
    approvalDate: '2026-01-15 14:55',
    memberType: '이용 제한 회원',
    accountStatus: '탈퇴',
  },
  {
    id: '12',
    number: '000001',
    companyName: '주식회사 재밌는걸참좋아하고하고싶은거하는노신사',
    depositorName: {
      registrationNumber: '000-00-00000',
      name: '노홍철',
    },
    businessType: '개인',
    paymentMethod: '무통장 입금',
    taxInvoice: 'O',
    chargedPoints: '10,000',
    heldPoints: '0',
    paymentStatus: '완료',
    requestDate: '2026-01-20 16:33',
    approvalDate: '2026-01-20 16:38',
    memberType: '이용 제한 회원',
    accountStatus: '탈퇴',
  },
];

