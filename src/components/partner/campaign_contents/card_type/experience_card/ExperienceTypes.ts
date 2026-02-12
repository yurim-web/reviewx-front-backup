/* ========================================
   📚 경험형 콘텐츠 카드 공통 타입
   ======================================== */

/**
 * ExperienceApplicant
 * - 경험형(배송형/방문형/기자단) 콘텐츠 카드에 표시될 신청자/참여자 정보
 * - 모든 필드는 UI 렌더링에 필요한 최소 집합으로 정의
 */
export interface ExperienceApplicant {
  /** 고유 식별자 (내부 식별용) */
  id: string;
  /** 사용자 타입 (리뷰어 | 인플루언서) */
  userType: "리뷰어" | "인플루언서";
  /** 닉네임 (UI에 그대로 노출) */
  nickname: string;
  /** 프로필 이미지 URL (없으면 빈 문자열) */
  profileImage?: string;
  /** 채널명 (예: 네이버블로그/인스타그램 등) */
  channel: string;
  /** 채널 아이디 혹은 식별 텍스트 (UI 좌측 아이콘 옆 표기) */
  channelId: string;
  /** 등록일 문자열 (예: 2025-11-02 17:37) */
  registrationDate: string;
  /** 수정일 문자열 (선택, 존재 시 등록일 대신 노출) */
  updatedAt?: string;
  /** 영수증 이미지 URL 배열 (이미지 확인 버튼용) */
  receiptImages?: string[];
}

/** 카드 변형 타입 */
export type ExperienceCardVariant = "inspection" | "completed" | "rejected";
