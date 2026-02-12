/* ========================================
   🔍 사용자 아이디/비밀번호 찾기 페이지
   ======================================== */

/**
 * 사용자 아이디/비밀번호 찾기 페이지
 *
 * 목적: 사용자가 아이디와 비밀번호를 찾을 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /find-account
 *
 * 주요 기능:
 * - 아이디 찾기
 * - 비밀번호 찾기
 * - 휴대폰 번호 인증
 */

import Header from "@/components/fragments/Header";
import FindAccountPage from "@/components/common/find_account/page/FindAccountPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 아이디·비밀번호 찾기",
};

/**
 * 사용자 아이디/비밀번호 찾기 페이지 컴포넌트
 *
 * @returns JSX.Element - 사용자 아이디/비밀번호 찾기 페이지 UI
 */
export default function UserFindAccountPage() {
  return (
    <div>
      {/* 메인 헤더 */}
      <Header />

      {/* 아이디/비밀번호 찾기 페이지 */}
      <FindAccountPage />
    </div>
  );
}
