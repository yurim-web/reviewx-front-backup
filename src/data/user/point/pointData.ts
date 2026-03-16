import { PointHistory, PointSummary, PendingPointItem } from "@/types/domain/user";

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
    description: "[라운지엑스24h] 라운지엑스24h 원그로브점 성수샌드 2개(낱개) + 음료 2잔 체험권",
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

/**
 * 적립 예정 포인트 목록 (캠페인 참여 후 검수 대기 등으로 아직 적립되지 않은 포인트)
 * - Figma 기획: 적립 예정 포인트 확인 모달 목록용
 */
export const pendingPointListData: PendingPointItem[] = [
  {
    id: "p1",
    description:
      "[풋필터] 트롯바비 홍지윤 pick! 아치까지 받쳐주는 발 편한 자세 교정 키높이 깔창 2set ㅇㄹㅇㅇㅇㅇㅇㅇㅇㅇㅇ",
    date: "2025-09-12",
    amount: 150000,
  },
  {
    id: "p2",
    description:
      "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지 멜킨 엘프리 마사지 멜킨 엘...",
    date: "2025-09-10",
    amount: 12100000,
  },
  {
    id: "p3",
    description:
      "멜킨 엘프리 마사지 멜킨 엘프리 마사지멜킨 엘프리 마사지 멜킨 엘프리 마사지 멜킨 엘...",
    date: "2025-09-06",
    amount: 36000,
  },
  {
    id: "p4",
    description: "[라운지엑스24h] 라운지엑스24h 원그로브점 성수샌드 2개(날개)+음료 2잔 체험권",
    date: "2025-09-01",
    amount: 27500,
  },
  {
    id: "p5",
    description: "[쿠팡 구매평] 작심닭 귀리현미 주먹밥 작심통밥 체험단 모집",
    date: "2025-09-01",
    amount: 2000000,
  },
  {
    id: "p6",
    description: "[스마트스토어 구매평] 피부과 재생크림 펩타이더마 크림 75ml 보습 미백 주름개선",
    date: "2025-09-01",
    amount: 2000000,
  },
  {
    id: "p7",
    description: "헬씨허그 올인원 멀티비타민 이륜샷 10개입",
    date: "2025-09-06",
    amount: 36000,
  },
  {
    id: "p8",
    description: "화품닭 숯불치킨 체험단 모집(배달 리뷰)",
    date: "2025-09-06",
    amount: 36000,
  },
  {
    id: "p9",
    description: "[스마트스토어 구매평] 피부과 재생크림 펩타이더마 크림 75ml 보습 미백 주름개선",
    date: "2026-03-19",
    amount: 2000000,
  },
];
