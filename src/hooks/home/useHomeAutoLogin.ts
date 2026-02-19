/* ========================================
   홈 URL 기반 자동 로그인 (개발용)
   ======================================== */

import { useEffect } from "react";

/**
 * /user → 리뷰어, /partner → 파트너 계정으로 자동 로그인 (개발 환경만).
 * 로그아웃 상태(토큰 없음)에서는 실행하지 않음.
 */
export function useHomeAutoLogin(pathname: string) {
  useEffect(() => {
    if (typeof window === "undefined" || process.env.NODE_ENV !== "development")
      return;

    const currentToken = localStorage.getItem("reviewx_auth_token");
    const currentUser = localStorage.getItem("reviewx_auth_user");

    if (pathname === "/user") {
      if (!currentToken && !currentUser) return;
      let reviewerAuth = localStorage.getItem("reviewx_auth_user_reviewer");
      if (!reviewerAuth) {
        reviewerAuth = JSON.stringify({
          id: "user_naver_001",
          email: "kimeunji@gmail.com",
          name: "김은지",
          role: "user",
        });
        localStorage.setItem("reviewx_auth_user_reviewer", reviewerAuth);
        console.log("✅ 리뷰어 계정으로 자동 로그인");
      }
      localStorage.setItem("reviewx_auth_user", reviewerAuth);
      localStorage.setItem("reviewx_auth_token", "test_token_reviewer");
    }

    if (pathname === "/partner") {
      if (!currentToken && !currentUser) return;
      let partnerAuth = localStorage.getItem("reviewx_auth_user_partner");
      if (!partnerAuth) {
        partnerAuth = JSON.stringify({
          id: "partner_test_001",
          email: "partner@test.com",
          name: "테스트파트너",
          role: "partner",
        });
        localStorage.setItem("reviewx_auth_user_partner", partnerAuth);
        console.log("✅ 파트너 계정으로 자동 로그인");
      }
      localStorage.setItem("reviewx_auth_user", partnerAuth);
      localStorage.setItem("reviewx_auth_token", "test_token_partner");
    }
  }, [pathname]);
}
