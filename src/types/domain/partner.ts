/* ========================================
   📝 파트너 캠페인 관련 타입 정의
   ======================================== */

/**
 * 파트너 캠페인 관련 공통 타입들을 정의합니다.
 *
 * 목적: 파트너(광고주)가 사용하는 모든 캠페인 컴포넌트에서 공통으로 사용되는 타입들을 중앙 관리
 *
 * 사용 컴포넌트:
 * - 캠페인 관리 페이지 (/partner/campaign_management)
 * - 캠페인 신청내역 페이지 (/partner/campaign_application)
 * - 캠페인 콘텐츠 관리 페이지 (/partner/campaign_contents)
 * - 포인트 관리 페이지 (/partner/point)
 * - 배송형, 방문형, 구매평, 기자단, 미션형 캠페인 컴포넌트들
 *
 * 참고 파일:
 * - src/data/partner/delivery.ts
 * - src/data/partner/mission.ts
 * - src/data/partner/reporter.ts
 * - src/data/partner/review.ts
 * - src/data/partner/visit.ts
 * - src/data/partner/point/pointData.ts
 * - src/data/partner/sharedCampaigns.ts
 * - src/data/partner/campaign_application/delivery_applicants.ts
 * - src/components/partner/campaign_application/CampaignInfoBox.tsx
 */

/**
 * 파트너 캠페인 정보 인터페이스
 *
 * 설명:
 * - 실제 데이터 파일(delivery.ts, mission.ts, reporter.ts, review.ts, visit.ts)의
 *   campaignInfo 구조를 반영한 타입입니다.
 * - 모든 캠페인 타입(배송형, 방문형, 구매평, 기자단, 미션형)에서 공통으로 사용됩니다.
 */
export interface PartnerCampaign {
  // 기본 정보
  id: string; // 캠페인 고유 식별자
  title: string; // 캠페인 제목
  image: string; // 캠페인 대표 이미지 URL
  status: "대기 중" | "모집 중" | "진행 중" | "종료" | "취소"; // 캠페인 상태 - 실제 데이터에서 사용하는 상태 값들
  campaignType: "배송형" | "방문형" | "구매평" | "기자단" | "미션형"; // 캠페인 유형
  category: string; // 카테고리 - 식품, 뷰티, 가전, 유아동, 여가, 서비스, 생활, 패션, 가구, 디지털, 문화, 반려동물, 기타
  brandName: string; // 브랜드명 - 플랫폼명 (예: "네이버블로그", "인스타그램", "쿠팡") 또는 빈 문자열

  // 기간 정보
  recruitmentPeriod: string; // 모집 기간 - "2025-11-01 ~ 2025-11-15" 형식
  announcementDate: string; // 선정 날짜 - "2025-11-30" 형식
  registrationPeriod: string; // 등록 기간 - "2025-12-01 ~ 2025-12-10" 형식
  purchasePeriod?: string; // 구매 기간 - 구매평 캠페인에만 사용 (선택적)

  // 인원 정보
  recruitedCount: number; // 현재 모집된 인원 수
  totalCount: number; // 전체 모집 인원 수
  daysLeft: number; // 선정 날짜까지 남은 일수 (동적 계산된 값)

  // 파생 인원 정보 (선택적)
  applicants?: number; // 신청자 수 (applicantData.applicants 길이)
  recruits?: number; // 모집 정원 수 (totalCount와 동일하게 사용)
  selected?: number; // 선정자 수 (applicantData.selectedApplicants 길이)

  // 추가 정보 (선택적)
  statusText?: string; // 캠페인 상태 설명 텍스트 - 예: "캠페인 콘텐츠를 검수해 주세요."
  brandLogo?: string; // 브랜드 로고 URL - UI에서 자동 계산되거나 별도 제공
  subStatus?: string; // 서브 상태 - 버튼 종류 결정용
}

/**
 * 파트너 캠페인 통계 정보 인터페이스
 *
 * 설명:
 * - 파트너가 보유한 캠페인들의 상태별 통계를 나타냅니다.
 * - 캠페인 관리 페이지의 상단 통계 탭에서 사용됩니다.
 *
 * 사용 컴포넌트:
 * - PartnerCampaignManagementHeader (캠페인 관리 헤더)
 * - StatisticsTab (통계 탭 컴포넌트)
 */
export interface PartnerCampaignStats {
  전체: number; // 전체 캠페인 수
  예정: number; // 예정된 캠페인 수
  신청: number; // 신청 단계 캠페인 수
  진행: number; // 진행 중인 캠페인 수
  종료: number; // 종료된 캠페인 수
  취소: number; // 취소된 캠페인 수
  "연장 요청": number; // 연장 요청한 캠페인 수
  패널티: number; // 패널티가 부과된 캠페인 수
}

/**
 * 파트너 통계 탭 타입 정의
 *
 * 설명:
 * - 캠페인 관리 페이지에서 사용하는 통계 탭의 타입입니다.
 * - 각 탭을 클릭하면 해당 상태의 캠페인 목록을 필터링하여 보여줍니다.
 *
 * 사용 위치:
 * - /partner/campaign_management (캠페인 관리 페이지)
 * - 각 상태별 서브 페이지 (scheduled, applied, progress, completed, cancelled, penalty)
 */
export type PartnerStatTab =
  | "전체" // 모든 캠페인
  | "예정" // 예정된 캠페인
  | "신청" // 신청 단계 캠페인
  | "진행" // 진행 중인 캠페인
  | "종료" // 종료된 캠페인
  | "취소" // 취소된 캠페인
  | "연장 요청" // 연장 요청한 캠페인
  | "패널티"; // 패널티 캠페인

/**
 * 파트너 패널티 상태 타입 정의
 *
 * 설명:
 * - 파트너 계정의 패널티 상태를 나타냅니다.
 * - 패널티 레벨에 따라 활동 제한이 달라집니다.
 *
 * 사용 위치:
 * - /partner/campaign_management/penalty (패널티 관리 페이지)
 * - 파트너 마이페이지
 */
export type PartnerPenaltyStatus =
  | "활동 가능" // 패널티 없음, 정상 활동 가능
  | "경고 조치" // 경고 단계, 주의 필요
  | "이용 정지 7일" // 7일간 이용 정지
  | "이용 정지 15일" // 15일간 이용 정지
  | "이용 정지 30일" // 30일간 이용 정지
  | "영구 정지"; // 영구적으로 이용 정지

/**
 * 파트너 패널티 유형 타입 정의
 *
 * 설명:
 * - 패널티의 종류를 나타냅니다.
 * - 패널티 이력에서 사용됩니다.
 */
export type PartnerPenaltyType = "경고" | "주의" | "정지" | "제재";

/**
 * 파트너 패널티 이력 항목 인터페이스
 *
 * 설명:
 * - 개별 패널티 이력의 정보를 담는 타입입니다.
 * - 패널티 이력 목록에서 각 항목을 표시할 때 사용됩니다.
 */
export interface PartnerPenaltyHistoryItem {
  id: string; // 패널티 이력 고유 식별자
  type: PartnerPenaltyType; // 패널티 유형 (경고, 주의, 정지, 제재)
  reason: string; // 패널티 부과 사유
  date: string; // 패널티 부과 날짜 (YYYY-MM-DD 형식)
  status: string; // 패널티 상태 (활성화, 해제 등)
}

/**
 * 파트너 패널티 상태 설정 인터페이스
 *
 * 설명:
 * - 현재 패널티 상태를 UI에 표시하기 위한 설정 정보를 담는 타입입니다.
 * - 상태에 따른 스타일 클래스, 단계, 진행률 등을 포함합니다.
 *
 * 사용 위치:
 * - 패널티 상태 표시 컴포넌트
 * - 패널티 진행률 표시
 */
export interface PartnerPenaltyStatusConfig {
  currentStatus: PartnerPenaltyStatus; // 현재 패널티 상태
  className: string; // CSS 클래스명 - 상태에 따른 스타일 적용
  stage: number; // 패널티 단계 (0: 활동가능, 1: 경고, 2: 주의, 3: 정지)
  progress: number; // 진행률 (0-100) - 패널티 진행률 표시용
}

/* ========================================
   💰 포인트 관련 타입 정의
   ======================================== */

/**
 * 파트너 포인트 내역 인터페이스
 *
 * 설명:
 * - 개별 포인트 거래 내역의 정보를 담는 타입입니다.
 * - 파트너의 포인트 충전, 리뷰어 지급 등의 거래 기록을 표시할 때 사용됩니다.
 *
 * 사용 위치:
 * - /partner/point (포인트 관리 페이지)
 * - PartnerPointHistoryList (파트너 포인트 내역 목록 컴포넌트)
 */
export interface PartnerPointHistory {
  id: string; // 포인트 내역 고유 식별자
  type: "earned" | "withdrawn" | "returned"; // 거래 유형 (earned=충전, withdrawn=사용/지급, returned=반환)
  amount: number; // 포인트 금액 (양수=증가, 음수=감소)
  description: string; // 포인트 내역 설명 (예: "포인트 충전", "리뷰어 포인트 지급", "리뷰어 포인트 반환", "캠페인 포인트 반환")
  campaign_id?: string; // 관련 캠페인 ID (있는 경우)
  date: string; // 날짜 (YYYY-MM-DD)
  status: "earned" | "completed" | "pending" | "failed"; // 상태: 적립/완료/신청/취소
  balance: number; // 거래 후 잔액
  rejection_reason?: string; // 반려 사유 (status가 "failed"일 때 사용)
  return_reason?: string; // 반환 사유 (type이 "returned"일 때 사용, 반환 사유가 없으면 rejection_reason 사용)
  /** 충전 결제 수단 (earned일 때만). 없으면 카드 결제로 간주 */
  payment_method?: "card" | "bank";
}

/**
 * 파트너 포인트 요약 정보 인터페이스
 *
 * 설명:
 * - 파트너의 포인트 현황을 요약하여 보여주는 정보를 담는 타입입니다.
 * - 포인트 관리 페이지 상단에 표시됩니다.
 *
 * 사용 위치:
 * - /partner/point (포인트 관리 페이지)
 * - PartnerPointSummaryCard (파트너 포인트 요약 카드 컴포넌트)
 */
export interface PartnerPointSummary {
  total_points: number; // 총 보유 포인트
  available_points: number; // 사용 가능한 포인트
  pending_points: number; // 처리 대기 중인 포인트
}

/**
 * 파트너 포인트 충전 신청 데이터 인터페이스
 *
 * 설명:
 * - 파트너 포인트 충전 신청 시 필요한 정보를 담는 타입입니다.
 * - 충전 신청 폼에서 사용됩니다.
 *
 * 사용 위치:
 * - /partner/point/charge (포인트 충전 페이지)
 * - PartnerChargeForm (포인트 충전 신청 폼 컴포넌트)
 */
export interface PartnerChargeRequest {
  amount: number; // 충전 요청 금액
  payment_method: string; // 결제 수단 (예: "카드", "계좌이체", "가상계좌")
  payment_info?: {
    // 결제 정보 (선택적)
    card_number?: string; // 카드번호
    bank?: string; // 은행명
    account_number?: string; // 계좌번호
    account_holder?: string; // 예금주명
  };
}

/**
 * 파트너 포인트 탭 타입 정의
 *
 * 설명:
 * - 파트너 포인트 관리 페이지에서 사용하는 필터 탭의 타입입니다.
 * - 각 탭을 클릭하면 해당 유형의 포인트 내역만 필터링하여 보여줍니다.
 *
 * 사용 위치:
 * - /partner/point (포인트 관리 페이지)
 * - PartnerPointTabNavigation (파트너 포인트 탭 네비게이션 컴포넌트)
 */
export type PartnerPointTab = "all" | "earned" | "withdrawn";

/**
 * 메인 탭 타입 정의
 *
 * 설명:
 * - 파트너 마이페이지나 관리 페이지에서 사용하는 메인 탭의 타입입니다.
 * - 캠페인, 포인트, 계정 관리 탭을 나타냅니다.
 *
 * 사용 위치:
 * - /partner/campaign_management (캠페인 관리 페이지)
 * - /partner/point (포인트 관리 페이지)
 * - /partner/mypage (마이페이지)
 */
export type PartnerMainTab = "campaign" | "point" | "account";

/* ========================================
   📋 캠페인 신청 및 콘텐츠 관련 타입 정의
   ======================================== */

/**
 * 캠페인 정보 인터페이스
 *
 * 설명:
 * - 캠페인 신청내역 페이지에서 사용하는 캠페인 기본 정보를 담는 타입입니다.
 * - CampaignInfoBox 컴포넌트와 신청자 데이터에서 공통으로 사용됩니다.
 *
 * 사용 위치:
 * - /partner/campaign_application (캠페인 신청내역 페이지)
 * - CampaignInfoBox (캠페인 정보 배너 컴포넌트)
 */
export interface CampaignInfo {
  id: string; // 캠페인 고유 식별자
  title: string; // 캠페인 제목
  image: string; // 캠페인 대표 이미지 URL
  status:
    | "대기 중"
    | "모집 중"
    | "선정 중"
    | "구매 중"
    | "등록 중"
    | "마감"
    | "진행 중"
    | "종료"
    | "취소"
    | "긴급"; // 캠페인 상태
  campaignType: "배송형" | "방문형" | "구매평" | "기자단" | "미션형"; // 캠페인 유형
  category: string; // 카테고리
  brandName?: string; // 브랜드 이름 (선택적)
  recruitmentPeriod: string; // 모집 기간
  announcementDate: string; // 선정 발표일
  purchasePeriod?: string; // 구매 기간 (구매평 캠페인용, 선택적)
  registrationPeriod: string; // 등록 기간
  recruitedCount: number; // 현재 모집된 인원 수
  totalCount: number; // 전체 모집 인원 수
  daysLeft: number; // 선정 날짜까지 남은 일수
  statusText?: string; // 캠페인 상태 설명 텍스트
  region?: string; // 방문 지역 시/도 (방문형 캠페인용, 선택적)
  subRegion?: string; // 방문 지역 시/구/군 (방문형 캠페인용, 선택적)
}

/**
 * 콘텐츠 아이템 인터페이스
 *
 * 설명:
 * - 각 캠페인에 등록된 콘텐츠(리뷰)의 정보를 담는 타입입니다.
 * - 검수 중/완료된 콘텐츠 모두 이 타입을 사용합니다.
 *
 * 사용 위치:
 * - /partner/campaign_contents (캠페인 콘텐츠 관리 페이지)
 * - 콘텐츠 카드 컴포넌트들
 */
export interface ContentItem {
  id: string; // 콘텐츠 고유 식별자
  createdAt: string; // 콘텐츠 생성일시 (ISO 8601 형식)
  status: "검수" | "완료"; // 콘텐츠 상태
  userType: "리뷰어" | "인플루언서"; // 사용자 타입
  nickname: string; // 작성자 닉네임
  channelId: string; // 채널 식별자 (블로그 ID, 인스타그램 ID 등)
  channel: string; // 채널명 (예: "네이버블로그", "인스타그램")
  profileImage?: string; // 프로필 이미지 URL (선택적)
  thumbnailSrc?: string; // 썸네일 이미지 URL (선택적)
  updatedAt?: string; // 수정일시 (선택적)
  isRejected?: boolean; // 거절 여부
  isLate?: boolean; // 지연 여부
  actionType?: string | number; // 액션 타입 (구매평/미션형 전용)
  missionType?: string; // 미션 타입 (미션형 전용)
  receiptImages?: string[]; // 구매 영수증 이미지 목록 (구매평 전용)
}

/**
 * 탭별 콘텐츠 타입
 *
 * 설명:
 * - 캠페인 콘텐츠를 탭별로 분류한 구조입니다.
 * - "검수" 탭과 "완료" 탭으로 나뉩니다.
 *
 * 사용 위치:
 * - /partner/campaign_contents (캠페인 콘텐츠 관리 페이지)
 */
export type ContentByTab = {
  reviewing: ContentItem[]; // 검수 중인 콘텐츠 목록
  completed: ContentItem[]; // 완료된 콘텐츠 목록
};

/**
 * 캠페인과 신청자 데이터 통합 인터페이스
 *
 * 설명:
 * - 캠페인 정보와 신청자 데이터를 함께 담는 타입입니다.
 * - 신청내역 페이지에서 사용됩니다.
 *
 * 사용 위치:
 * - /partner/campaign_application (캠페인 신청내역 페이지)
 */
export interface CampaignWithApplicants {
  campaignInfo: CampaignInfo; // 캠페인 기본 정보
  applicantData: {
    applicants: AllApplicant[]; // 전체 신청자 목록
    selectedApplicants: AllApplicant[]; // 선정된 신청자 목록
  };
  contents?: ContentByTab; // 선택: 진행/검수 상세에서 바로 사용할 콘텐츠 데이터
}

/**
 * 캠페인과 콘텐츠 데이터 통합 인터페이스
 *
 * 설명:
 * - 캠페인 정보와 콘텐츠 데이터를 함께 담는 타입입니다.
 * - 종료/취소된 캠페인의 콘텐츠 관리에서 사용됩니다.
 *
 * 사용 위치:
 * - /partner/campaign_contents (캠페인 콘텐츠 관리 페이지)
 * - 종료/취소된 캠페인 데이터
 */
export interface CampaignWithContents {
  campaignInfo: {
    id: string;
    title: string;
    image: string;
    status: string;
    campaignType: "배송형" | "방문형" | "구매평" | "기자단" | "미션형";
    category: string;
    brandName: string;
    recruitmentPeriod: string;
    announcementDate: string;
    registrationPeriod: string;
    recruitedCount: number;
    totalCount: number;
    daysLeft: number;
    statusText?: string;
  };
  contents: ContentByTab; // 탭별 콘텐츠 데이터
}

/* ========================================
   👥 신청자 관련 타입 정의
   ======================================== */

/**
 * 기본 신청자 인터페이스 (네이버블로그)
 *
 * 설명:
 * - 네이버블로그 채널의 신청자 정보를 담는 타입입니다.
 * - 일일 방문자 수, 총 방문자 수, 이웃 수를 포함합니다.
 */
export interface Applicant {
  id: string; // 신청자 고유 식별자
  Id: string; // 신청자 ID (대문자)
  nickname: string; // 닉네임
  userType: "리뷰어" | "인플루언서"; // 사용자 타입
  profileImage: string; // 프로필 이미지 URL
  memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한"; // 회원 타입
  dailyVisits: number; // 일일 방문자 수
  totalVisits: number; // 총 방문자 수
  neighbors: number; // 이웃 수
  memo: string; // 메모
  selectionStatus: "미선택" | "선정하기" | "이용제한 계정" | "검수중" | "완료"; // 선정 상태
  channel: "네이버블로그"; // 채널 타입
  registrationDate?: string; // 등록 날짜
}

/**
 * 네이버 클립 신청자 인터페이스
 *
 * 설명:
 * - 네이버 클립 채널의 신청자 정보를 담는 타입입니다.
 * - 팔로워 수를 포함합니다.
 */
export interface NaverClipApplicant {
  id: string;
  Id: string;
  nickname: string;
  userType: "리뷰어" | "인플루언서";
  profileImage: string;
  memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한";
  followers: number; // 팔로워 수
  memo: string;
  selectionStatus: "미선택" | "선정하기" | "이용제한 계정" | "검수중" | "완료";
  channel: "네이버클립";
  registrationDate?: string;
}

/**
 * 인스타그램 신청자 인터페이스
 *
 * 설명:
 * - 인스타그램 채널의 신청자 정보를 담는 타입입니다.
 * - 팔로워 수를 포함합니다.
 */
export interface InstagramApplicant {
  id: string;
  Id: string;
  nickname: string;
  userType: "리뷰어" | "인플루언서";
  profileImage: string;
  memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한";
  followers: number; // 팔로워 수
  memo: string;
  selectionStatus: "미선택" | "선정하기" | "이용제한 계정" | "검수중" | "완료";
  channel: "인스타그램";
  registrationDate?: string;
}

/**
 * 유튜브 신청자 인터페이스
 *
 * 설명:
 * - 유튜브 채널의 신청자 정보를 담는 타입입니다.
 * - 구독자 수를 포함합니다.
 */
export interface YoutubeApplicant {
  id: string;
  Id: string;
  nickname: string;
  userType: "리뷰어" | "인플루언서";
  profileImage: string;
  memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한";
  subscribers: number; // 구독자 수
  memo: string;
  selectionStatus: "미선택" | "선정하기" | "이용제한 계정" | "검수중" | "완료";
  channel: "유튜브";
  registrationDate?: string;
}

/**
 * 기본 신청자 인터페이스 (미션형/구매평용)
 *
 * 설명:
 * - 미션형이나 구매평 캠페인에서 사용하는 기본 신청자 타입입니다.
 * - 채널별 특수 정보(팔로워, 구독자 등)가 없습니다.
 */
export interface BasicApplicant {
  id: string;
  Id: string;
  nickname: string;
  userType: "리뷰어" | "인플루언서";
  profileImage: string;
  memberType: "모범 회원" | "주의 회원" | "경고 회원" | "이용 제한";
  memo: string;
  selectionStatus: "미선택" | "선정하기" | "이용제한 계정" | "검수중" | "완료";
  channel: "기본";
  registrationDate?: string;
}

/**
 * 통합 신청자 타입
 *
 * 설명:
 * - 모든 채널별 신청자 타입을 통합한 유니온 타입입니다.
 * - 타입 가드를 통해 각 채널별 특성을 확인할 수 있습니다.
 *
 * 사용 위치:
 * - 신청자 목록 컴포넌트
 * - 신청자 필터링 및 정렬 기능
 */
export type AllApplicant =
  | Applicant
  | NaverClipApplicant
  | InstagramApplicant
  | YoutubeApplicant
  | BasicApplicant;
