/* ========================================
   🔍 검수/완료 타입 (배송형)
   ======================================== */

/**
 * 사용 위치 요약
 *
 * - `NaverBlogReviewCard.tsx`: 배송형 검수 카드에서 `ReviewApplicant` 타입으로 신청자 정보를 타입 안전하게 관리
 * - `NaverBlogCompletedCard.tsx`: 배송형 완료 카드에서 `CompletedApplicant` 타입으로 완료된 신청자 정보를 처리
 * - 두 카드 모두 같은 타입 정의를 공유하므로, 중복을 피하기 위해 공용 타입 파일로 분리해 둡니다.
 */

// 검수 전용 타입
export interface ReviewApplicant {
  id: string;
  Id: string;
  nickname: string;
  userType: "리뷰어" | "인플루언서";
  profileImage: string;
  selectionStatus: "검수중";
  channel: "네이버블로그" | "네이버클립" | "인스타그램" | "유튜브" | "기본";
  registrationDate: string;
}

// 완료 전용 타입
export interface CompletedApplicant {
  id: string;
  Id: string;
  nickname: string;
  userType: "리뷰어" | "인플루언서";
  profileImage: string;
  selectionStatus: "완료";
  channel: "네이버블로그" | "네이버클립" | "인스타그램" | "유튜브" | "기본";
  completionDate: string;
}


