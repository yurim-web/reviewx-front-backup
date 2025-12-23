/* ========================================
   🎨 캠페인 카드 버튼 스타일 유틸리티
   ======================================== */

/**
 * 캠페인 카드 버튼 스타일 유틸리티 함수
 *
 * 목적: User와 Partner의 CampaignCard에서 공통으로 사용하는 버튼 스타일 로직을 추출
 *
 * 사용 위치:
 * - src/components/user/campaign_management/CampaignCard.tsx
 * - src/components/partner/campaign_management/CampaignCard.tsx
 *
 * 주요 기능:
 * - 버튼 텍스트에 따라 적절한 스타일 클래스 반환
 * - primary, danger, secondary, default 버튼 타입 지원
 */

/**
 * 버튼 스타일 타입 정의
 *
 * 설명:
 * - 버튼의 시각적 스타일을 나타내는 타입입니다.
 * - 각 스타일은 다른 의미를 가집니다:
 *   - primary: 주요 액션 (검은색 배경)
 *   - danger: 경고/위험 액션 (빨간색 테두리)
 *   - secondary: 보조 액션 (회색 테두리)
 *   - default: 일반 액션 (기본 검은색 테두리)
 */
export type ButtonStyleType = "primary" | "danger" | "secondary" | "default";

/**
 * 버튼 스타일 클래스 반환 함수
 *
 * 설명:
 * - 버튼 텍스트를 분석하여 적절한 스타일 타입을 반환합니다.
 * - User와 Partner의 버튼 텍스트 패턴을 모두 지원합니다.
 *
 * @param buttonText - 버튼에 표시될 텍스트
 * @returns 버튼 스타일 타입
 *
 * 사용 예시:
 * ```tsx
 * const styleType = getButtonStyleType("콘텐츠 등록하기");
 * // 반환: "primary"
 *
 * const styleType = getButtonStyleType("패널티 내역보기");
 * // 반환: "danger"
 * ```
 */
export function getButtonStyleType(buttonText: string): ButtonStyleType {
  // 주요 액션 버튼 - 검은색 배경 (중요 단계 전환)
  // User: "콘텐츠 등록하기", "콘텐츠 재등록하기", "구매 영수증 등록하기" 등
  // Partner: "캠페인 수정하기", "당첨자 선정", "콘텐츠 확인 완료" 등
  if (
    buttonText === "콘텐츠 등록하기" ||
    buttonText === "콘텐츠 재등록하기" ||
    buttonText === "구매 영수증 등록하기" ||
    buttonText === "구매 영수증 수정하기" ||
    buttonText === "구매 영수증 재등록하기" ||
    buttonText === "패널티 해제하기" ||
    buttonText === "캠페인 수정하기" ||
    buttonText === "당첨자 선정" ||
    buttonText.startsWith("콘텐츠 확인 완료") ||
    buttonText === "캠페인 수정" ||
    buttonText === "캠페인 관리"
  ) {
    return "primary";
  }

  // 경고 버튼 - 빨간색 테두리 (패널티 관련)
  // User: "패널티 내역보기", "콘텐츠 반려 사유보기"
  // Partner: "패널티 내역 확인", "콘텐츠 반려 사유보기", "캠페인 삭제"
  if (
    buttonText === "패널티 내역보기" ||
    buttonText === "패널티 내역 보기" ||
    buttonText === "패널티 내역 확인" ||
    buttonText === "콘텐츠 반려 사유보기" ||
    buttonText === "콘텐츠 반려 사유 보기" ||
    buttonText === "캠페인 삭제"
  ) {
    return "danger";
  }

  // 보조 버튼 - 회색 테두리 (확인하기)
  // User: "콘텐츠 확인하기"
  // Partner: "신청내역 확인", "콘텐츠 확인" 등
  if (
    buttonText === "콘텐츠 확인하기" ||
    buttonText.includes("확인하기") ||
    buttonText.startsWith("콘텐츠 확인")
  ) {
    return "secondary";
  }

  // 일반 버튼 - 기본 검은색 테두리
  // User: "신청 취소하기", "캠페인 진행하기" 등
  // Partner: 기타 버튼들
  return "default";
}

/**
 * 버튼 스타일 클래스 문자열 생성 함수
 *
 * 설명:
 * - 버튼 스타일 타입과 CSS 모듈 스타일 객체를 받아 최종 클래스 문자열을 반환합니다.
 * - action_button 클래스는 항상 포함되며, 추가로 스타일 타입에 맞는 클래스를 추가합니다.
 *
 * @param buttonText - 버튼에 표시될 텍스트
 * @param buttonStyles - CSS 모듈 스타일 객체 (action_button, primary_button 등 포함)
 * @returns 최종 버튼 클래스 문자열
 *
 * 사용 예시:
 * ```tsx
 * import buttonStyles from '@/styles/user/campaign_management/buttons.module.css';
 *
 * const className = getButtonClassName("콘텐츠 등록하기", buttonStyles);
 * // 반환: "action_button primary_button"
 * ```
 */
export function getButtonClassName(
  buttonText: string,
  buttonStyles: {
    action_button?: string;
    primary_button?: string;
    danger_button?: string;
    secondary_button?: string;
    default_button?: string;
    [key: string]: string | undefined;
  }
): string {
  const styleType = getButtonStyleType(buttonText);
  const baseClass = buttonStyles.action_button;

  switch (styleType) {
    case "primary":
      return `${baseClass} ${buttonStyles.primary_button}`;
    case "danger":
      return `${baseClass} ${buttonStyles.danger_button}`;
    case "secondary":
      return `${baseClass} ${buttonStyles.secondary_button}`;
    case "default":
      return `${baseClass} ${buttonStyles.default_button}`;
    default:
      return `${baseClass} ${buttonStyles.default_button}`;
  }
}
