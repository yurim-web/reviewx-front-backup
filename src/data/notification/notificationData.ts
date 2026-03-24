/* ========================================
   🔔 알림 목업 데이터
   ======================================== */

/**
 * 알림 목업 데이터 및 타입 정의
 *
 * 목적: 알림 페이지에서 사용되는 임시 목업 데이터와 타입 정의입니다.
 *       실제 프로젝트에서는 API를 통해 서버에서 알림 데이터를 가져옵니다.
 *       현재는 개발 및 디자인 확인을 위한 샘플 데이터입니다.
 *
 * 사용 컴포넌트:
 * - NotificationList: 알림 목록을 표시하는 공통 컴포넌트
 *
 * 사용 페이지:
 * - /user/notification (유저 알림 페이지)
 * - /partner/notification (파트너 알림 페이지)
 * - /manager_ga/notification (GA 관리자 알림 페이지)
 * - /manager_sa/notification (SA 관리자 알림 페이지)
 *
 * 알림 카테고리 구조:
 * - 각 알림은 카테고리 코드로 구분됩니다 (예: A_R1, A_R2)
 * - 각 카테고리별로 고정된 라벨과 메시지 템플릿이 있습니다
 * - 메시지 템플릿의 {변수} 부분만 동적으로 치환됩니다
 */

/**
 * 알림 색상 타입
 */
export type NotificationColor = "blue" | "red" | "green" | "orange";

/**
 * 리뷰어 알림 카테고리 코드
 */
export type ReviewerNotificationCategory =
  | "A_R1" // 캠페인 선정
  | "A_R2" // 캠페인 수정
  | "A_R3" // 콘텐츠 등록
  | "A_R4" // 콘텐츠 등록 요청
  | "A_R5" // 콘텐츠 승인
  | "A_R6" // 콘텐츠 반려
  | "A_R7" // 지각 제출 기간
  | "A_R8" // 콘텐츠 등록 기간 연장
  | "A_R9" // 포인트 적립
  | "A_R10" // 포인트 출금 신청
  | "A_R11" // 출금 승인
  | "A_R12" // 출금 반려
  | "A_R13" // 패널티 부여
  | "A_R14" // 패널티 해제
  | "A_R15" // 계정 정지
  | "A_R16" // 계정 차단
  | "A_R17"; // 채널 연결 오류

/**
 * 파트너 알림 카테고리 코드
 */
export type PartnerNotificationCategory =
  | "A_P1" // 캠페인 진행 상태 변경
  | "A_P2" // 캠페인 완료
  | "A_P3" // 캠페인 중지
  | "A_P4" // 콘텐츠 등록
  | "A_P5" // 리뷰어 기한 연장 요청
  | "A_P6" // 무통장입금 확인 신청
  | "A_P7" // 무통장입금 확인 완료
  | "A_P8" // 무통장입금 미확인
  | "A_P9" // 신용카드 결제 완료
  | "A_P10" // 콘텐츠 미확인 요청
  | "A_P11" // 계정 정지
  | "A_P12"; // 계정 차단

/**
 * 관리자(GA/SA 공통) 알림 카테고리 코드
 */
export type AdminNotificationCategory =
  | "A_A1" // 반려 발생
  | "A_A2" // 신고 발생
  | "A_A3" // 차단 발생
  | "A_A4" // 카카오톡 문의
  | "A_A5" // 출금 요청
  | "A_A6"; // 긴급 출금 요청

/**
 * 알림 카테고리 코드 (모든 유형 통합)
 */
export type NotificationCategory =
  | ReviewerNotificationCategory
  | PartnerNotificationCategory
  | AdminNotificationCategory;

/**
 * 알림 카테고리별 메시지 템플릿 정의
 */
export interface NotificationTemplate {
  /** 카테고리 코드 */
  category: NotificationCategory;
  /** 알림 라벨 */
  label: string;
  /** 메시지 템플릿 ({변수} 형식으로 변수 포함 가능) */
  message_template: string;
  /** 알림 색상 */
  color: NotificationColor;
  /** 하단 캠페인 안내 링크 표시 여부 (리뷰어 알림의 경우 캠페인 관련 알림에만 true) */
  has_campaign_link?: boolean;
}

/**
 * 리뷰어 알림 카테고리별 메시지 템플릿 정의
 * @deprecated NotificationTemplate을 사용하세요
 */
export interface ReviewerNotificationTemplate extends NotificationTemplate {
  category: ReviewerNotificationCategory;
}

/**
 * 리뷰어 알림 카테고리별 메시지 템플릿 맵
 */
export const reviewer_notification_templates: Record<
  ReviewerNotificationCategory,
  ReviewerNotificationTemplate
> = {
  A_R1: {
    category: "A_R1",
    label: "캠페인 선정",
    message_template: "축하드립니다! 캠페인에 선정되셨습니다.",
    color: "blue",
    has_campaign_link: true,
  },
  A_R2: {
    category: "A_R2",
    label: "캠페인 수정",
    message_template: "참여 중인 캠페인 정보가 수정되었습니다.",
    color: "blue",
    has_campaign_link: true,
  },
  A_R3: {
    category: "A_R3",
    label: "콘텐츠 등록",
    message_template: "콘텐츠 등록 기간입니다. 콘텐츠를 등록해 주세요.",
    color: "blue",
    has_campaign_link: true,
  },
  A_R4: {
    category: "A_R4",
    label: "콘텐츠 등록 요청",
    message_template: "콘텐츠 등록 기간이 {남은기간}일 남았습니다. 콘텐츠를 등록해 주세요.",
    color: "red",
    has_campaign_link: true,
  },
  A_R5: {
    category: "A_R5",
    label: "콘텐츠 승인",
    message_template: "등록한 콘텐츠가 승인되었습니다.",
    color: "green",
    has_campaign_link: true,
  },
  A_R6: {
    category: "A_R6",
    label: "콘텐츠 반려",
    message_template: "등록한 콘텐츠가 반려되었습니다. 반려 사유를 확인해 주세요.",
    color: "red",
    has_campaign_link: true,
  },
  A_R7: {
    category: "A_R7",
    label: "지각 제출 기간",
    message_template: "지각 제출 기간입니다. {남은기간}일 안에 콘텐츠를 등록해 주세요.",
    color: "red",
    has_campaign_link: true,
  },
  A_R8: {
    category: "A_R8",
    label: "콘텐츠 등록 기간 연장",
    message_template: "콘텐츠 등록 기간이 3일 연장되었습니다.",
    color: "blue",
    has_campaign_link: true,
  },
  A_R9: {
    category: "A_R9",
    label: "포인트 적립",
    message_template: "캠페인이 완료되어 {포인트} P가 적립되었습니다.",
    color: "green",
    has_campaign_link: true,
  },
  A_R10: {
    category: "A_R10",
    label: "포인트 출금 신청",
    message_template: "포인트 출금 신청이 접수되었습니다.",
    color: "blue",
  },
  A_R11: {
    category: "A_R11",
    label: "출금 승인",
    message_template: "출금 요청이 승인되었습니다.",
    color: "green",
  },
  A_R12: {
    category: "A_R12",
    label: "출금 반려",
    message_template: "출금 요청이 반려되었습니다. 반려 사유를 확인해 주세요.",
    color: "red",
  },
  A_R13: {
    category: "A_R13",
    label: "패널티 부여",
    message_template: "패널티가 부여되었습니다.",
    color: "orange",
  },
  A_R14: {
    category: "A_R14",
    label: "패널티 해제",
    message_template: "부여된 패널티가 해제되었습니다.",
    color: "orange",
  },
  A_R15: {
    category: "A_R15",
    label: "계정 일시 정지",
    message_template: "운영 정책 위반으로 인해 {정지기간}일 동안 캠페인에 참여할 수 없습니다.",
    color: "orange",
  },
  A_R16: {
    category: "A_R16",
    label: "계정 이용 제한",
    message_template: "운영 정책 위반으로 인해 이용 제한되었습니다.",
    color: "orange",
  },
  A_R17: {
    category: "A_R17",
    label: "채널 연결 오류",
    message_template: "등록된 채널에 문제가 발생했습니다. 다시 연결해 주세요.",
    color: "red",
  },
};

/**
 * 파트너 알림 카테고리별 메시지 템플릿 맵
 */
export const partner_notification_templates: Record<
  PartnerNotificationCategory,
  NotificationTemplate
> = {
  A_P1: {
    category: "A_P1",
    label: "캠페인 진행 상태 변경",
    message_template: "캠페인 진행 상태가 변경되었습니다.",
    color: "blue",
    has_campaign_link: true,
  },
  A_P2: {
    category: "A_P2",
    label: "캠페인 완료",
    message_template: "캠페인이 완료되었습니다.",
    color: "blue",
    has_campaign_link: true,
  },
  A_P3: {
    category: "A_P3",
    label: "캠페인 중지",
    message_template: "운영 정책 위반으로 인해 캠페인이 게시 중지되었습니다.",
    color: "red",
    has_campaign_link: true,
  },
  A_P4: {
    category: "A_P4",
    label: "콘텐츠 등록",
    message_template: "리뷰어가 콘텐츠를 등록했습니다.",
    color: "blue",
    has_campaign_link: true,
  },
  A_P5: {
    category: "A_P5",
    label: "기한 연장 요청",
    message_template: "리뷰어가 콘텐츠 등록 기한 연장을 요청했습니다.",
    color: "red",
    has_campaign_link: true,
  },
  A_P6: {
    category: "A_P6",
    label: "무통장입금 확인 신청",
    message_template: "무통장입금 확인이 신청되었습니다.",
    color: "blue",
  },
  A_P7: {
    category: "A_P7",
    label: "무통장입금 확인 완료",
    message_template: "무통장입금 확인이 완료되었습니다.",
    color: "blue",
  },
  A_P8: {
    category: "A_P8",
    label: "무통장입금 미확인",
    message_template: "무통장입금이 확인되지 않았습니다.",
    color: "orange",
  },
  A_P9: {
    category: "A_P9",
    label: "신용카드 결제 완료",
    message_template: "신용카드 결제가 완료되었습니다.",
    color: "blue",
  },
  A_P10: {
    category: "A_P10",
    label: "콘텐츠 미확인 요청",
    message_template: "콘텐츠 확인을 요청합니다.",
    color: "orange",
    has_campaign_link: true,
  },
  A_P11: {
    category: "A_P11",
    label: "계정 일시 정지",
    message_template: "운영 정책 위반으로 인해 캠페인을 등록할 수 없습니다.",
    color: "orange",
  },
  A_P12: {
    category: "A_P12",
    label: "계정 이용 제한",
    message_template: "운영 정책 위반으로 인해 이용 제한되었습니다.",
    color: "orange",
  },
};

/**
 * 관리자(GA/SA 공통) 알림 카테고리별 메시지 템플릿 맵
 */
export const admin_notification_templates: Record<AdminNotificationCategory, NotificationTemplate> =
  {
    A_A1: {
      category: "A_A1",
      label: "반려 발생",
      message_template: "캠페인/콘텐츠 반려가 {개수}건 발생했습니다. 반려 내역을 확인해 주세요.",
      color: "red",
    },
    A_A2: {
      category: "A_A2",
      label: "신고 발생",
      message_template:
        "캠페인/콘텐츠 신고 또는 정책 위반 요소가 {개수}건 발생했습니다. 신고 내역을 확인해 주세요.",
      color: "red",
    },
    A_A3: {
      category: "A_A3",
      label: "이용 제한 발생",
      message_template:
        "운영 정책 위반으로 이용 제한된 계정이 {개수}건 발생했습니다. 이용 제한 내역을 확인해 주세요.",
      color: "red",
    },
    A_A4: {
      category: "A_A4",
      label: "카카오톡 문의",
      message_template: "신규 채팅 문의가 {개수}건 있습니다.",
      color: "orange",
    },
    A_A5: {
      category: "A_A5",
      label: "출금 요청",
      message_template: "출금 요청이 {개수}건 접수되었습니다.",
      color: "blue",
    },
    A_A6: {
      category: "A_A6",
      label: "긴급 출금 요청",
      message_template: "긴급 출금 요청이 {개수}건 접수되었습니다.",
      color: "orange",
    },
  };

/**
 * 알림 카테고리로 템플릿을 가져오는 함수
 */
export function get_notification_template(category: NotificationCategory): NotificationTemplate {
  if (category.startsWith("A_R")) {
    return reviewer_notification_templates[category as ReviewerNotificationCategory];
  } else if (category.startsWith("A_P")) {
    return partner_notification_templates[category as PartnerNotificationCategory];
  } else if (category.startsWith("A_A")) {
    return admin_notification_templates[category as AdminNotificationCategory];
  }
  throw new Error(`Unknown notification category: ${category}`);
}

/**
 * 알림 아이템 타입 정의
 *
 * @property {number} id - 알림 고유 식별자
 * @property {NotificationCategory} category - 알림 카테고리 코드 (리뷰어: A_R*, 파트너: A_P*, 관리자: A_A*)
 * @property {Record<string, string | number>} message_params - 메시지 템플릿의 변수 값들 (예: {남은기간: "3", 포인트: 1000})
 * @property {string} time - 알림 발생 시간 (YYYY-MM-DD HH:mm 형식)
 * @property {number} campaign_id - 캠페인 ID (하단 캠페인 안내 링크가 있는 경우 필요, 선택적)
 * @property {string} campaign_name - 캠페인 이름 (하단 캠페인 안내에 표시될 실제 캠페인명, 선택적)
 */
export interface NotificationItem {
  id: number;
  category: NotificationCategory;
  message_params?: Record<string, string | number>;
  time: string;
  campaign_id?: number;
  campaign_name?: string;
}

/**
 * 메시지 템플릿에서 변수를 치환하는 함수
 *
 * @param template - 메시지 템플릿 (예: "콘텐츠 등록 기간이 {남은기간}일 남았습니다.")
 * @param params - 변수 값들 (예: {남은기간: "3"})
 * @returns 치환된 메시지 (예: "콘텐츠 등록 기간이 3일 남았습니다.")
 */
export function format_notification_message(
  template: string,
  params?: Record<string, string | number>
): string {
  if (!params) return template;

  // 한글을 포함한 모든 문자를 매칭하도록 정규식 수정
  // \{([^}]+)\} 패턴: {와 } 사이의 모든 문자를 캡처
  return template.replace(/\{([^}]+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });
}

/**
 * 임시 목업 데이터
 *
 * 실제 프로젝트에서는 API를 통해 서버에서 알림 데이터를 가져옵니다.
 * 현재는 개발 및 디자인 확인을 위한 샘플 데이터입니다.
 *
 * 사용처:
 * - 각 알림 페이지(page.tsx)에서 임시 데이터로 사용
 * - 향후 API 연동 시 이 데이터는 제거되고 실제 API 호출로 대체됩니다.
 */

/**
 * 리뷰어(유저) 알림 목업 데이터
 */
export const mockReviewerNotifications: NotificationItem[] = [
  {
    id: 1,
    category: "A_R1",
    time: "2025-09-01 18:35",
    campaign_id: 1,
    campaign_name: "[인천/서구] 맛집 캠페인",
  },
  {
    id: 2,
    category: "A_R2",
    time: "2025-09-01 17:20",
    campaign_id: 2,
    campaign_name: "[쿠팡/바울리] 판도로 크리스마스 빵 이탈리아 케이크 디저트 500g, 1개",
  },
  {
    id: 3,
    category: "A_R3",
    time: "2025-09-01 16:15",
    campaign_id: 3,
    campaign_name: "[서울/강남구] 카페 리뷰 캠페인",
  },
  {
    id: 4,
    category: "A_R4",
    message_params: { 남은기간: "3" },
    time: "2025-09-01 15:10",
    campaign_id: 4,
    campaign_name: "[부산/해운대구] 해변 맛집 캠페인",
  },
  {
    id: 5,
    category: "A_R5",
    time: "2025-09-01 14:05",
    campaign_id: 5,
    campaign_name: "[경기/성남시] 신상품 체험 캠페인",
  },
  {
    id: 6,
    category: "A_R6",
    time: "2025-09-01 13:00",
    campaign_id: 6,
    campaign_name: "[인천/연수구] 생활용품 리뷰 캠페인",
  },
  {
    id: 7,
    category: "A_R7",
    message_params: { 남은기간: "2" },
    time: "2025-09-01 11:55",
    campaign_id: 7,
    campaign_name: "[서울/홍대] 패션 브랜드 캠페인",
  },
  {
    id: 8,
    category: "A_R8",
    time: "2025-09-01 10:50",
    campaign_id: 8,
    campaign_name: "[대전/유성구] 테크 리뷰 캠페인",
  },
  {
    id: 9,
    category: "A_R9",
    message_params: { 포인트: 5000 },
    time: "2025-09-01 09:45",
    campaign_id: 9,
    campaign_name: "[광주/북구] 뷰티 제품 캠페인",
  },
  {
    id: 10,
    category: "A_R10",
    time: "2025-08-31 20:30",
  },
  {
    id: 11,
    category: "A_R11",
    time: "2025-08-31 19:25",
  },
  {
    id: 12,
    category: "A_R12",
    time: "2025-08-31 18:20",
  },
  {
    id: 13,
    category: "A_R13",
    time: "2025-08-31 17:15",
  },
  {
    id: 14,
    category: "A_R14",
    time: "2025-08-31 16:10",
  },
  {
    id: 15,
    category: "A_R15",
    message_params: { 정지기간: "7" },
    time: "2025-08-31 15:05",
  },
  {
    id: 16,
    category: "A_R16",
    time: "2025-08-31 14:00",
  },
  {
    id: 17,
    category: "A_R17",
    time: "2025-08-31 12:55",
  },
];

/**
 * 파트너 알림 목업 데이터
 */
export const mockPartnerNotifications: NotificationItem[] = [
  {
    id: 1,
    category: "A_P1",
    time: "2025-09-01 18:35",
    campaign_id: 1,
    campaign_name: "[인천/서구] 맛집 캠페인",
  },
  {
    id: 2,
    category: "A_P2",
    time: "2025-09-01 17:20",
    campaign_id: 2,
    campaign_name: "[쿠팡/바울리] 판도로 크리스마스 빵 이탈리아 케이크 디저트 500g, 1개",
  },
  {
    id: 3,
    category: "A_P3",
    time: "2025-09-01 16:15",
    campaign_id: 3,
    campaign_name: "[서울/강남구] 카페 리뷰 캠페인",
  },
  {
    id: 4,
    category: "A_P4",
    time: "2025-09-01 15:10",
    campaign_id: 4,
    campaign_name: "[부산/해운대구] 해변 맛집 캠페인",
  },
  {
    id: 5,
    category: "A_P5",
    time: "2025-09-01 14:05",
    campaign_id: 5,
    campaign_name: "[경기/성남시] 신상품 체험 캠페인",
  },
  {
    id: 6,
    category: "A_P6",
    message_params: { 정지기간: "7" },
    time: "2025-09-01 13:00",
  },
  {
    id: 7,
    category: "A_P7",
    time: "2025-08-31 20:30",
  },
];

/**
 * 관리자 SA 알림 목업 데이터
 */
export const mockManagerSANotifications: NotificationItem[] = [
  {
    id: 1,
    category: "A_A1",
    message_params: { 개수: "3" },
    time: "2025-09-01 18:35",
  },
  {
    id: 2,
    category: "A_A2",
    message_params: { 개수: "5" },
    time: "2025-09-01 17:20",
  },
  {
    id: 3,
    category: "A_A3",
    message_params: { 개수: "2" },
    time: "2025-09-01 16:15",
  },
  {
    id: 4,
    category: "A_A4",
    message_params: { 개수: "1" },
    time: "2025-09-01 15:10",
  },
  {
    id: 5,
    category: "A_A5",
    message_params: { 개수: "7" },
    time: "2025-09-01 14:05",
  },
  {
    id: 6,
    category: "A_A6",
    message_params: { 개수: "1" },
    time: "2025-09-01 13:00",
  },
];

/**
 * 관리자 GA 알림 목업 데이터
 */
export const mockManagerGANotifications: NotificationItem[] = [
  {
    id: 1,
    category: "A_A1",
    message_params: { 개수: "2" },
    time: "2025-09-01 18:35",
  },
  {
    id: 2,
    category: "A_A2",
    message_params: { 개수: "4" },
    time: "2025-09-01 17:20",
  },
  {
    id: 3,
    category: "A_A3",
    message_params: { 개수: "1" },
    time: "2025-09-01 16:15",
  },
  {
    id: 4,
    category: "A_A4",
    message_params: { 개수: "3" },
    time: "2025-09-01 15:10",
  },
  {
    id: 5,
    category: "A_A5",
    message_params: { 개수: "6" },
    time: "2025-09-01 14:05",
  },
  {
    id: 6,
    category: "A_A6",
    message_params: { 개수: "2" },
    time: "2025-09-01 13:00",
  },
];

/**
 * @deprecated 각 사용자 유형별 목업 데이터를 사용하세요.
 * - mockReviewerNotifications: 리뷰어(유저) 알림
 * - mockPartnerNotifications: 파트너 알림
 * - mockManagerSANotifications: 관리자 SA 알림
 * - mockManagerGANotifications: 관리자 GA 알림
 */
export const mockNotifications = mockReviewerNotifications;
