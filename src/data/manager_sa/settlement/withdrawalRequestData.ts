/* ========================================
   💰 SA 관리자 출금 요청 데이터
   ======================================== */

/**
 * 출금 요청 페이지의 모든 데이터를 관리하는 파일
 *
 * 목적: 출금 요청 페이지에 표시되는 모든 데이터를 한 곳에서 관리
 *
 */

/* ========================================
   📋 출금 요청 테이블 데이터
   ======================================== */

/**
 * 출금 요청 항목 인터페이스
 *
 * 각 속성 설명:
 * - id: 고유 식별자 (문자열)
 * - number: 출금 요청 번호
 * - round: 회차 정보 (정산 회차, "-"는 긴급 요청)
 * - name: 신청자 이름
 * - account: 계좌 정보 (은행명 계좌번호 예금주명)
 * - ssn: 주민등록번호 (마스킹 처리된 형태)
 * - amount: 출금 포인트 금액
 * - remaining: 잔여 포인트
 * - requestDate: 신청일 (날짜와 시간)
 * - type: 회원 유형 (모범 회원, 이용 제한 회원 등)
 * - status: 상태 (정상 등)
 * - isSelected: 체크박스 선택 여부
 */
export interface WithdrawalRequestItem {
  id: string;
  number: string;
  round: string;
  name: string;
  account: string;
  ssn: string;
  amount: string;
  remaining: string;
  requestDate: string;
  type: string;
  status: string;
  isSelected?: boolean;
}

/**
 * 긴급 출금 요청 목록
 *
 * 긴급 정산이 필요한 출금 요청들을 담고 있습니다.
 * 회차가 "-"인 경우 긴급 요청으로 분류됩니다.
 */
export const urgentRequestList: WithdrawalRequestItem[] = [
  {
    id: "urgent-1",
    number: "000001",
    round: "-",
    name: "조로이스",
    account: "우리은행 1002254541773 조로이스",
    ssn: "861256-2******",
    amount: "12,530",
    remaining: "999,999,999",
    requestDate: "2025-08-01 18:56",
    type: "이용 제한 회원",
    status: "정상",
    isSelected: false,
  },
  {
    id: "urgent-2",
    number: "000001",
    round: "45",
    name: "김은지",
    account: "카카오뱅크 3333057752425 김은지",
    ssn: "861256-2******",
    amount: "36,570",
    remaining: "120,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "일시정지",
    isSelected: false,
  },
  {
    id: "urgent-3",
    number: "000001",
    round: "45",
    name: "홍길동",
    account: "국민은행 65940101490957 홍길동",
    ssn: "861256-2******",
    amount: "120,140",
    remaining: "1,538,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "영구정지",
    isSelected: false,
  },
  {
    id: "urgent-4",
    number: "000001",
    round: "-",
    name: "유연희",
    account: "국민은행 01140100009875 유연희",
    ssn: "861256-2******",
    amount: "115,200",
    remaining: "1,538,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "탈퇴",
    isSelected: false,
  },
  {
    id: "urgent-5",
    number: "000001",
    round: "44",
    name: "김히어라",
    account: "우체국은행 01372202077893 김히어라",
    ssn: "861256-2******",
    amount: "1,100",
    remaining: "1,538,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: false,
  },
  {
    id: "urgent-6",
    number: "000002",
    round: "-",
    name: "박민수",
    account: "신한은행 110123456789 박민수",
    ssn: "861256-2******",
    amount: "85,300",
    remaining: "2,450,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: false,
  },
  {
    id: "urgent-7",
    number: "000003",
    round: "45",
    name: "이지은",
    account: "하나은행 123456789012 이지은",
    ssn: "861256-2******",
    amount: "245,800",
    remaining: "850,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: false,
  },
  {
    id: "urgent-8",
    number: "000004",
    round: "-",
    name: "최영희",
    account: "NH농협은행 3011234567890 최영희",
    ssn: "861256-2******",
    amount: "67,900",
    remaining: "3,200,000",
    requestDate: "2025-08-01 18:56",
    type: "이용 제한 회원",
    status: "정상",
    isSelected: false,
  },
  {
    id: "urgent-9",
    number: "000005",
    round: "44",
    name: "정수진",
    account: "KB국민은행 12345678901234 정수진",
    ssn: "861256-2******",
    amount: "189,500",
    remaining: "1,200,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: false,
  },
  {
    id: "urgent-10",
    number: "000006",
    round: "-",
    name: "강동원",
    account: "SC제일은행 123456789012 강동원",
    ssn: "861256-2******",
    amount: "156,700",
    remaining: "950,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: false,
  },
];

/**
 * 이번 회차 정산 출금 요청 목록
 *
 * 정기 정산 회차에 해당하는 출금 요청들을 담고 있습니다.
 * 대부분의 요청이 여기에 포함됩니다.
 */
export const currentRoundRequestList: WithdrawalRequestItem[] = [
  {
    id: "round-1",
    number: "000001",
    round: "44",
    name: "이은",
    account: "한국씨티은행 1630339624201 이은",
    ssn: "861256-2******",
    amount: "483,500",
    remaining: "1,538,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: true,
  },
  {
    id: "round-2",
    number: "000001",
    round: "44",
    name: "김휘수",
    account: "산림조합중앙회 1002254541773 김휘수",
    ssn: "861256-2******",
    amount: "483,500",
    remaining: "1,538,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "일시정지",
    isSelected: true,
  },
  {
    id: "round-3",
    number: "000001",
    round: "44",
    name: "황보선혜",
    account: "뱅크오브아메리카 1002254541773 조로이스",
    ssn: "861256-2******",
    amount: "483,500",
    remaining: "999,999,999",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "영구정지",
    isSelected: true,
  },
  {
    id: "round-4",
    number: "000001",
    round: "44",
    name: "장세희",
    account: "BNP파리바은행 1002254541773 장세희",
    ssn: "861256-2******",
    amount: "483,500",
    remaining: "1,538,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "탈퇴",
    isSelected: true,
  },
  {
    id: "round-5",
    number: "000001",
    round: "44",
    name: "일이삼사오육칠팔구십",
    account: "JP모간체이스은행 1002254541773 일이삼사오육칠팔구십",
    ssn: "861256-2******",
    amount: "483,500",
    remaining: "1,538,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: true,
  },
  {
    id: "round-6",
    number: "000001",
    round: "44",
    name: "이은",
    account: "한국씨티은행 1630339624201 이은",
    ssn: "861256-2******",
    amount: "483,500",
    remaining: "1,538,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: false,
  },
  {
    id: "round-7",
    number: "000001",
    round: "-",
    name: "김휘수",
    account: "산림조합중앙회 1002254541773 김휘수",
    ssn: "861256-2******",
    amount: "483,500",
    remaining: "1,538,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: true,
  },
  {
    id: "round-8",
    number: "000001",
    round: "44",
    name: "황보선혜",
    account: "뱅크오브아메리카 1002254541773 조로이스",
    ssn: "861256-2******",
    amount: "483,500",
    remaining: "999,999,999",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: true,
  },
  {
    id: "round-9",
    number: "000001",
    round: "-",
    name: "장세희",
    account: "BNP파리바은행 1002254541773 장세희",
    ssn: "861256-2******",
    amount: "483,500",
    remaining: "1,538,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: true,
  },
  {
    id: "round-10",
    number: "000001",
    round: "44",
    name: "일이삼사오육칠팔구십",
    account: "JP모간체이스은행 1002254541773 일이삼사오육칠팔구십",
    ssn: "861256-2******",
    amount: "483,500",
    remaining: "1,538,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: true,
  },
  {
    id: "round-11",
    number: "000002",
    round: "45",
    name: "송민준",
    account: "토스뱅크 1000123456789 송민준",
    ssn: "861256-2******",
    amount: "325,800",
    remaining: "2,100,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: false,
  },
  {
    id: "round-12",
    number: "000003",
    round: "45",
    name: "윤서연",
    account: "카카오뱅크 3333123456789 윤서연",
    ssn: "861256-2******",
    amount: "567,200",
    remaining: "1,850,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: true,
  },
  {
    id: "round-13",
    number: "000004",
    round: "44",
    name: "임도현",
    account: "우리은행 1002987654321 임도현",
    ssn: "861256-2******",
    amount: "198,600",
    remaining: "3,500,000",
    requestDate: "2025-08-01 18:56",
    type: "이용 제한 회원",
    status: "정상",
    isSelected: false,
  },
  {
    id: "round-14",
    number: "000005",
    round: "45",
    name: "한소희",
    account: "하나은행 1234987654321 한소희",
    ssn: "861256-2******",
    amount: "742,300",
    remaining: "1,200,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: true,
  },
  {
    id: "round-15",
    number: "000006",
    round: "44",
    name: "오준혁",
    account: "신한은행 1109876543210 오준혁",
    ssn: "861256-2******",
    amount: "412,500",
    remaining: "2,800,000",
    requestDate: "2025-08-01 18:56",
    type: "일반 회원",
    status: "정상",
    isSelected: false,
  },
];

/**
 * 금액 합계 계산 함수
 *
 * 출금 요청 목록의 금액 합계를 계산합니다.
 * 숫자 문자열에서 쉼표를 제거하고 숫자로 변환하여 합산합니다.
 *
 * @param list - 출금 요청 목록
 * @returns 합계 금액 (숫자)
 */
export function calculate_total_amount(list: WithdrawalRequestItem[]): number {
  return list.reduce((sum, item) => {
    // 쉼표 제거 후 숫자로 변환
    const amount = parseInt(item.amount.replace(/,/g, ""), 10);
    return sum + amount;
  }, 0);
}

/**
 * 긴급 요청 합계 금액
 */
export const urgent_total_amount = calculate_total_amount(urgentRequestList);

/**
 * 이번 회차 정산 합계 금액
 */
export const current_round_total_amount = calculate_total_amount(
  currentRoundRequestList
);

/**
 * 전체 출금 요청 목록 (긴급 + 이번 회차)
 *
 * 두 섹션의 데이터를 합친 전체 목록입니다.
 */
export const withdrawalRequestList: WithdrawalRequestItem[] = [
  ...urgentRequestList,
  ...currentRoundRequestList,
];
