import { PointHistory, PointSummary } from "@/types/domain/user";

/**
 * 포인트 요약 정보 (김은지 계정 데이터)
 */
export const pointSummary: PointSummary = {
  total_points: 511200,
  available_points: 511200,
  pending_points: 0,
};

/**
 * 포인트 내역 (김은지 계정 데이터) - Figma 디자인에 맞춤
 */
export const pointHistoryData: PointHistory[] = [
  {
    id: "1",
    type: "earned",
    amount: 150000,
    description:
      "[풋필터] 트롯바비 홍지윤 pick! 아치까지 받쳐주는 발 편한 자세 교정 키높이 깔창 2set(1.5cm 1켤레 + 2.5cm 1켤레) 구매평",
    campaign_id: "camp_001",
    date: "2025-09-12",
    status: "earned",
    balance: 4311885,
  },
  {
    id: "2",
    type: "withdrawn",
    amount: -500000,
    description:
      "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지 멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지",
    date: "2025-09-10",
    status: "completed",
    balance: 4161885,
  },
  {
    id: "3",
    type: "earned",
    amount: 36000,
    description: "출금 완료",
    campaign_id: "camp_003",
    date: "2025-09-06",
    status: "earned",
    balance: 6161885,
  },
  {
    id: "4",
    type: "earned",
    amount: 27500,
    description:
      "[라운지엑스24h] 라운지엑스24h 원그로브점 성수샌드 2개(낱개) + 음료 2잔 체험권",
    campaign_id: "camp_004",
    date: "2025-09-01",
    status: "earned",
    balance: 6125885,
  },
  {
    id: "5",
    type: "withdrawn",
    amount: -2000000,
    description: "출금 신청 반려",
    date: "2025-09-01",
    status: "failed",
    balance: 7311885,
    rejection_reason: "예금주와 본인 명의 불일치",
  },
  {
    id: "6",
    type: "earned",
    amount: 2000000,
    description: "적립 취소",
    campaign_id: "camp_006",
    date: "2025-09-01",
    status: "failed",
    balance: 7311885,
    rejection_reason:
      "콘텐츠 내 키워드에 대한 정보를 넣어 달라고 말씀드렸음에도 불구하고 키워드가 없습니다.",
  },
];
