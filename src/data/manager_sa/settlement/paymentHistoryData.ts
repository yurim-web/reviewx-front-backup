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
 * - businessInfo: 사업자 정보 (상호명 아래에 표시될 정보)
 *   - registrationNumber: 사업자등록번호
 *   - representativeName: 사업자명 (대표자명)
 * - depositorName: 입금자명 (단순 문자열)
 * - businessType: 구분 (법인/개인)
 * - paymentMethod: 결제 수단 (카드 결제/무통장 입금)
 * - taxInvoiceType: 세금계산서 발행 유형
 *   - "세금계산서": 세금계산서 발행
 *   - "현금영수증 (소득공제)": 현금영수증 발행 (소득공제용)
 *   - "현금영수증 (지출증빙)": 현금영수증 발행 (지출증빙용)
 *   - "미발행": 미발행
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
  businessInfo: {
    registrationNumber: string;
    representativeName: string;
  };
  depositorName: string;
  businessType: '법인' | '개인';
  paymentMethod: '카드 결제' | '무통장 입금';
  taxInvoiceType: '세금계산서' | '현금영수증 (소득공제)' | '현금영수증 (지출증빙)' | '미발행';
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
    businessInfo: {
      registrationNumber: '122-86-45790',
      representativeName: '김민회',
    },
    depositorName: '(주)청명종합광고기',
    businessType: '법인',
    paymentMethod: '카드 결제',
    taxInvoiceType: '',
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
    businessInfo: {
      registrationNumber: '211-23-55991',
      representativeName: '장민석외 2명',
    },
    depositorName: '최대 열글자입니다',
    businessType: '개인',
    paymentMethod: '무통장 입금',
    taxInvoiceType: '현금영수증 (소득공제)',
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
    businessInfo: {
      registrationNumber: '211-23-55991',
      representativeName: '도선애, 이종근',
    },
    depositorName: '명륜수원광교점',
    businessType: '개인',
    paymentMethod: '무통장 입금',
    taxInvoiceType: '현금영수증 (지출증빙)',
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
    businessInfo: {
      registrationNumber: '110-86-08583',
      representativeName: '고광웅',
    },
    depositorName: '(주) 레인보우8',
    businessType: '법인',
    paymentMethod: '무통장 입금',
    taxInvoiceType: '미발행',
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
    businessInfo: {
      registrationNumber: '000-00-00000',
      representativeName: '이상훈',
    },
    depositorName: '(주)플레티어',
    businessType: '개인',
    paymentMethod: '카드 결제',
    taxInvoiceType: '미발행',
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
    businessInfo: {
      registrationNumber: '000-00-00000',
      representativeName: '김초롱',
    },
    depositorName: '꽃초롱',
    businessType: '개인',
    paymentMethod: '카드 결제',
    taxInvoiceType: '미발행',
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
    businessInfo: {
      registrationNumber: '000-00-00000',
      representativeName: '양동찬',
    },
    depositorName: '주식회사 와이디컴퍼',
    businessType: '개인',
    paymentMethod: '카드 결제',
    taxInvoiceType: '미발행',
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
    businessInfo: {
      registrationNumber: '000-00-00000',
      representativeName: '정만수',
    },
    depositorName: '(주)아이엠에스',
    businessType: '개인',
    paymentMethod: '카드 결제',
    taxInvoiceType: '미발행',
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
    businessInfo: {
      registrationNumber: '234-86-01377',
      representativeName: '유기수',
    },
    depositorName: '주식회사 청명미디어',
    businessType: '개인',
    paymentMethod: '카드 결제',
    taxInvoiceType: '미발행',
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
    businessInfo: {
      registrationNumber: '000-00-00000',
      representativeName: '정만수',
    },
    depositorName: '(주)아이엠에스',
    businessType: '개인',
    paymentMethod: '무통장 입금',
    taxInvoiceType: '미발행',
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
    businessInfo: {
      registrationNumber: '000-00-00000',
      representativeName: '정만수',
    },
    depositorName: '최대 열글자입니다',
    businessType: '개인',
    paymentMethod: '무통장 입금',
    taxInvoiceType: '세금계산서',
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
    businessInfo: {
      registrationNumber: '000-00-00000',
      representativeName: '노홍철',
    },
    depositorName: '노홍철',
    businessType: '개인',
    paymentMethod: '무통장 입금',
    taxInvoiceType: '세금계산서',
    chargedPoints: '10,000',
    heldPoints: '0',
    paymentStatus: '완료',
    requestDate: '2026-01-20 16:33',
    approvalDate: '2026-01-20 16:38',
    memberType: '이용 제한 회원',
    accountStatus: '탈퇴',
  },
];

/**
 * 결제 내역 가져오기 (LocalStorage 통합)
 */
export function getPaymentHistoryList(): PaymentHistoryItem[] {
  if (typeof window === 'undefined') {
    return paymentHistoryList;
  }

  try {
    // LocalStorage에서 파트너 포인트 충전 내역 가져오기
    const storedPayments = localStorage.getItem('partner_payment_history');
    const localPayments = storedPayments ? JSON.parse(storedPayments) : [];

    // LocalStorage 데이터와 Mock 데이터 통합
    return [...localPayments, ...paymentHistoryList];
  } catch (error) {
    console.error('결제 내역 로드 중 오류:', error);
    return paymentHistoryList;
  }
}

/**
 * 포인트 충전 시 결제 내역 추가
 */
export function addPaymentHistory(
  userId: string,
  amount: number,
  paymentMethod: '카드 결제' | '무통장 입금',
  depositorName?: string,
  taxInvoiceType?: '미발행' | '세금계산서' | '현금영수증 (소득공제)' | '현금영수증 (지출증빙)'
): void {
  if (typeof window === 'undefined') return;

  try {
    // 사용자 정보 가져오기
    const authUser = localStorage.getItem('reviewx_auth_user');
    const user = authUser ? JSON.parse(authUser) : null;

    if (!user) return;

    // 현재 날짜/시간
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateTime = `${year}-${month}-${day} ${hours}:${minutes}`;

    // 기존 결제 내역 가져오기
    const storedPayments = localStorage.getItem('partner_payment_history');
    const payments = storedPayments ? JSON.parse(storedPayments) : [];

    // 충전 후 보유 포인트 가져오기 (이미 addPointCharge로 업데이트된 상태)
    const pointsKey = `partner_points_${userId}`;
    const storedPoints = localStorage.getItem(pointsKey);
    const currentPoints = storedPoints ? JSON.parse(storedPoints) : { available_points: 0 };
    const heldPointsAfterCharge = currentPoints.available_points;

    // 새 결제 내역 생성
    const newPayment: PaymentHistoryItem = {
      id: `payment_${Date.now()}`,
      number: String(payments.length + 1).padStart(6, '0'),
      companyName: user.business_name || '상호명 없음',
      businessInfo: {
        registrationNumber: user.business_number || '000-00-00000',
        representativeName: user.name || '대표자명 없음',
      },
      depositorName: depositorName || user.business_name || user.name || '입금자명 없음',
      businessType: '법인',
      paymentMethod,
      taxInvoiceType: taxInvoiceType || '미발행',
      chargedPoints: amount.toLocaleString(),
      heldPoints: heldPointsAfterCharge.toLocaleString(),
      paymentStatus: paymentMethod === '카드 결제' ? '완료' : '대기',
      requestDate: dateTime,
      approvalDate: paymentMethod === '카드 결제' ? dateTime : '-',
      memberType: '일반 회원',
      accountStatus: '정상',
    };

    // 목록에 추가
    payments.unshift(newPayment); // 최신 내역을 맨 앞에 추가

    // LocalStorage에 저장
    localStorage.setItem('partner_payment_history', JSON.stringify(payments));

    console.log('결제 내역 추가 완료:', newPayment);
  } catch (error) {
    console.error('결제 내역 추가 중 오류:', error);
  }
}
