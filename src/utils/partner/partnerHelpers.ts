/* ========================================
   파트너 헬퍼 함수
   ======================================== */

/**
 * 파트너 계정 관련 유틸리티 함수
 *
 * 목적: 파트너 계정 조회 로직을 캠페인 생성/수정 페이지에서 분리하여 중복 제거
 *
 * 사용처:
 * - /partner/campaign/create/* (캠페인 등록 페이지)
 * - /partner/campaign/edit/* (캠페인 수정 페이지)
 */

/**
 * localStorage의 partner_accounts에서 파트너명을 조회합니다.
 *
 * 우선순위: business_name > name
 * 조회 실패 시 빈 문자열을 반환하며, 오류는 콘솔에만 기록합니다.
 *
 * @param userId - 조회할 파트너의 사용자 ID
 * @returns 파트너명 (business_name 또는 name), 조회 실패 시 빈 문자열
 */
export const getPartnerName = (userId: string): string => {
  try {
    if (typeof window === "undefined") return "";

    const storedAccounts = localStorage.getItem("partner_accounts");
    if (!storedAccounts) return "";

    const accounts: { id: string; business_name?: string; name?: string }[] =
      JSON.parse(storedAccounts);
    const partnerAccount = accounts.find((a) => a.id === userId);

    if (!partnerAccount) return "";

    return partnerAccount.business_name || partnerAccount.name || "";
  } catch (_error) {
    return "";
  }
};
