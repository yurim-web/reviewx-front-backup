/* ========================================
   📝 유저 캠페인 관련 타입 정의
   ======================================== */

/**
 * 유저(리뷰어) 캠페인 관련 공통 타입들을 정의합니다.
 *
 * 목적: 모든 유저 캠페인 컴포넌트에서 공통으로 사용되는 타입들을 중앙 관리
 *
 * 사용 컴포넌트:
 * - 배송형, 방문형, 구매평, 기자단, 미션형 캠페인 컴포넌트들
 * - 캠페인 관리 페이지 (/user/campaign_management)
 * - 포인트 관리 페이지 (/user/point)
 * - 마이페이지 (/user/mypage)
 *
 * 참고 파일:
 * - src/data/user/delivery/deliveryCampaigns.ts
 * - src/data/user/mission/missionCampaigns.ts
 * - src/data/user/reporter/reporterCampaigns.ts
 * - src/data/user/review/reviewCampaigns.ts
 * - src/data/user/visit/visitCampaigns.ts
 */

/* ========================================
   📋 캠페인 관련 타입 정의
   ======================================== */

/**
 * 캠페인 유형 타입 정의
 *
 * 설명:
 * - 지원하는 모든 캠페인 타입을 정의합니다.
 * - 각 캠페인 타입별로 다른 폼 필드와 요구사항이 있습니다.
 */
export type CampaignType = "배송형" | "방문형" | "구매평" | "기자단" | "미션형";

/**
 * 플랫폼 타입 정의
 *
 * 설명:
 * - 캠페인 콘텐츠를 게시할 수 있는 플랫폼 목록입니다.
 * - 미션형 캠페인에는 플랫폼이 없을 수 있습니다.
 */
export type PlatformType =
  | "네이버 블로그"
  | "네이버 클립"
  | "인스타그램"
  | "릴스"
  | "유튜브"
  | "쇼츠";

/**
 * 캠페인 폼 데이터 인터페이스
 *
 * 설명:
 * - 캠페인 생성/수정 시 사용하는 폼 데이터의 구조를 정의합니다.
 * - 캠페인 타입에 따라 일부 필드는 선택적(optional)입니다.
 *
 * 사용 위치:
 * - 캠페인 생성 폼 컴포넌트
 * - 캠페인 수정 폼 컴포넌트
 */
export interface CampaignFormData {
  // 기본 정보
  campaignType: CampaignType; // 캠페인 유형
  platform?: PlatformType | ""; // 플랫폼 (미션형에는 없음)
  title: string; // 캠페인 제목
  category: string; // 카테고리
  region?: string; // 방문 지역 시/도 (방문형에만 필요)
  subRegion?: string; // 방문 지역 시/구/군 (방문형에만 필요)
  thumbnailImage?: File; // 썸네일 이미지 파일
  thumbnailImageUrl?: string; // 업로드된 이미지의 미리보기 URL (Data URL)
  detailImages?: File[]; // 상세 이미지 파일 목록
  detailImagePreviews?: string[]; // 상세 이미지 미리보기 URL 배열 (Data URL) - localStorage 저장용

  // 상세 정보
  brandName: string; // 브랜드명
  providedItems: string; // 제공 품목
  promotionLink?: string; // 프로모션 링크
  visitLink?: string; // 방문 링크 (방문형에만 필요)
  visitAddress?: string; // 방문 주소 (방문형에만 필요)
  addressDetail?: string; // 상세 주소 (방문형에만 필요)
  currentPoints: string | number; // 현재 포인트
  purchasePoints?: string | number; // 구매 포인트 (구매평에만 필요)
  additionalPoints: string | number; // 추가 포인트
  recruitmentCount: string | number; // 모집 인원 수
  recruitmentPeriod: string; // 모집 기간
  purchasePeriod?: string; // 구매 기간 (구매평에만 필요)
  announcementDate: string; // 선정 발표일
  registrationPeriod: string; // 등록 기간
  keywords: string; // 키워드

  // 참여/제출 옵션
  adultOnly: boolean; // 성인 전용 여부
  allowReParticipation: boolean; // 재참여 허용 여부
  allowLateSubmission: boolean; // 지연 제출 허용 여부
  minTextLength: string | number; // 최소 텍스트 길이
  minImageCount: string | number; // 최소 이미지 개수
  videoCount?: string | number; // 비디오 개수
  videoDuration?: string | number; // 비디오 길이
  requireLinkAttachment: boolean; // 링크 첨부 필수 여부
  requireKeywordAttachment: boolean; // 키워드 첨부 필수 여부
  requireContentLink?: boolean; // 콘텐츠 링크 필수 여부 (미션형에만 필요)
  requireContentImage?: boolean; // 콘텐츠 이미지 필수 여부 (미션형에만 필요)

  // 안내 사항
  guidelines: string; // 캠페인 안내 사항

  // 문의 담당자 정보
  contactPhone?: string; // 문의 담당자 휴대폰 번호

  // 공정위 문구 동의
  fairTradeAgreement?: boolean; // 공정위 문구 동의 여부

  // 긴급 여부
  isUrgent: boolean; // 긴급 캠페인 여부
}

/**
 * 캠페인 생성 폼 베이스 Props 인터페이스
 *
 * 설명:
 * - 캠페인 생성 폼 컴포넌트의 기본 props 구조를 정의합니다.
 * - 각 캠페인 타입별 폼 컴포넌트가 상속받는 기본 인터페이스입니다.
 *
 * 사용 위치:
 * - CampaignCreateFormBase (기본 폼 컴포넌트)
 * - 각 캠페인 타입별 폼 컴포넌트
 */
export interface CampaignCreateFormBaseProps {
  campaignType: CampaignType; // 캠페인 유형
  onSubmit: (data: CampaignFormData) => void; // 폼 제출 핸들러
  isSubmitting: boolean; // 제출 중 상태
}

/* ========================================
   📊 캠페인 관리 관련 타입 정의
   ======================================== */

/**
 * 캠페인 신청/관리 정보 인터페이스
 *
 * 설명:
 * - 유저가 신청한 캠페인의 상태와 정보를 담는 타입입니다.
 * - 캠페인 관리 페이지에서 각 캠페인 카드를 표시할 때 사용됩니다.
 *
 * 사용 위치:
 * - /user/campaign_management (캠페인 관리 페이지)
 * - CampaignApplicationCard (캠페인 신청 카드 컴포넌트)
 */
export interface CampaignApplication {
  id: string; // 고유 ID
  title: string; // 캠페인 제목
  category: string; // 카테고리 (네이버블로그, 클립, 유튜브, 쇼츠, 릴스, 인스타그램) - 구매평/미션형은 빈 문자열
  categoryIcon?: string; // 카테고리 아이콘 경로 (선택적, 자동으로 결정됨)
  image: string; // 캠페인 대표 이미지
  status: "신청" | "선정" | "완료" | "취소/반려"; // 캠페인 진행 상태
  remainingDays: number; // 남은 일수
  statusMessage: string; // 상태별 메시지 (데이터에서 제공)
  type: "배송형" | "방문형" | "구매평" | "기자단" | "미션형"; // 캠페인 타입
  isUrgent: boolean; // 마감 임박 여부

  // 추가 상태 정보 (옵셔널)
  subStatus?:
    | "content_not_registered" // 콘텐츠 미등록 (선정 후 아직 등록 안함)
    | "content_registered" // 콘텐츠 등록 완료
    | "content_rejected,re_register" // 콘텐츠 반려 + 재등록 (두 개 버튼)
    | "receipt_not_registered" // 구매 영수증 미등록
    | "receipt_registered" // 구매 영수증 등록 완료
    | "receipt_rejected" // 구매 영수증 반려됨 (수정 필요)
    | "penalty" // 패널티 부과됨
    | "penalty,content_rejected"; // 패널티 + 콘텐츠 반려 (두 개 버튼)

  hasContent?: boolean; // 콘텐츠 보유 여부
  isPenalty?: boolean; // 패널티 여부
  extensionCount?: number; // 등록 기한 연장 신청 횟수
  contentType?: "link" | "image" | "both"; // 미션형 콘텐츠 타입 (링크만, 이미지만, 둘 다)
  /** 기본 미션 항목 목록 (콘텐츠 확인 모달에서 사용) */
  missionItems?: Array<{
    id: string; // 미션 항목 고유 식별자
    text: string; // 미션 항목 텍스트
    isCompleted: boolean; // 충족 여부 (true: 충족, false: 미충족)
  }>;
  /** 반려 사유 (취소/반려 상태일 때 사용) */
  rejectionReason?: string; // 콘텐츠 반려 사유 텍스트
}

/**
 * 캠페인 통계 정보 인터페이스
 *
 * 설명:
 * - 유저의 캠페인 신청 상태별 통계를 나타냅니다.
 * - 캠페인 관리 페이지의 상단 통계 탭에서 사용됩니다.
 *
 * 사용 위치:
 * - /user/campaign_management (캠페인 관리 페이지)
 * - StatisticsTab (통계 탭 컴포넌트)
 */
export interface CampaignStats {
  신청: number; // 신청 단계 캠페인 수
  선정: number; // 선정된 캠페인 수
  완료: number; // 완료된 캠페인 수
  "취소/반려": number; // 취소/반려된 캠페인 수
  패널티: number; // 패널티가 부과된 캠페인 수
}

/**
 * 메인 탭 타입 정의
 *
 * 설명:
 * - 유저 마이페이지나 관리 페이지에서 사용하는 메인 탭의 타입입니다.
 *
 * 사용 위치:
 * - /user/campaign_management (캠페인 관리 페이지)
 * - /user/mypage (마이페이지)
 */
export type MainTab = "campaign" | "point" | "account";

/**
 * 통계 탭 타입 정의
 *
 * 설명:
 * - 캠페인 관리 페이지에서 사용하는 통계 탭의 타입입니다.
 * - 각 탭을 클릭하면 해당 상태의 캠페인 목록을 필터링하여 보여줍니다.
 *
 * 사용 위치:
 * - /user/campaign_management (캠페인 관리 페이지)
 * - StatisticsTab (통계 탭 컴포넌트)
 */
export type StatTab =
  | "신청"
  | "예정"
  | "선정"
  | "완료"
  | "취소/반려"
  | "패널티";

/* ========================================
   💰 포인트 관련 타입 정의
   ======================================== */

/**
 * 포인트 내역 인터페이스
 *
 * 설명:
 * - 개별 포인트 거래 내역의 정보를 담는 타입입니다.
 * - 포인트 적립, 출금 등의 거래 기록을 표시할 때 사용됩니다.
 *
 * 사용 위치:
 * - /user/point (포인트 관리 페이지)
 * - PointHistoryList (포인트 내역 목록 컴포넌트)
 */
export interface PointHistory {
  id: string; // 포인트 내역 고유 식별자
  type: "earned" | "withdrawn"; // 거래 유형 (적립/출금)
  amount: number; // 포인트 금액
  description: string; // 포인트 내역 설명
  campaign_id?: string; // 관련 캠페인 ID (있는 경우)
  date: string; // 날짜 (YYYY-MM-DD)
  status: "earned" | "completed" | "pending" | "failed"; // 상태: 적립/완료/신청/취소
  balance: number; // 거래 후 잔액
  rejection_reason?: string; // 반려 사유 (status가 "failed"일 때 사용)
}

/**
 * 포인트 요약 정보 인터페이스
 *
 * 설명:
 * - 유저의 포인트 현황을 요약하여 보여주는 정보를 담는 타입입니다.
 * - 포인트 관리 페이지 상단에 표시됩니다.
 *
 * 사용 위치:
 * - /user/point (포인트 관리 페이지)
 * - PointSummaryCard (포인트 요약 카드 컴포넌트)
 */
export interface PointSummary {
  total_points: number; // 총 보유 포인트
  available_points: number; // 출금 가능 포인트
  pending_points: number; // 대기 중인 포인트
}

/**
 * 출금 신청 데이터 인터페이스
 *
 * 설명:
 * - 포인트 출금 신청 시 필요한 정보를 담는 타입입니다.
 * - 출금 신청 폼에서 사용됩니다.
 *
 * 사용 위치:
 * - /user/point (포인트 관리 페이지)
 * - WithdrawalForm (출금 신청 폼 컴포넌트)
 */
export interface WithdrawalRequest {
  amount: number; // 출금 요청 금액
  account_info: {
    bank: string; // 은행명
    account_number: string; // 계좌번호
    account_holder: string; // 예금주명
  };
}

/**
 * 포인트 탭 타입 정의
 *
 * 설명:
 * - 포인트 관리 페이지에서 사용하는 필터 탭의 타입입니다.
 * - 각 탭을 클릭하면 해당 유형의 포인트 내역만 필터링하여 보여줍니다.
 *
 * 사용 위치:
 * - /user/point (포인트 관리 페이지)
 * - PointTabNavigation (포인트 탭 네비게이션 컴포넌트)
 */
export type PointTab = "all" | "earned" | "withdrawn";
