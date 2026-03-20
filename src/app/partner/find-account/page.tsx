/* ========================================
   🔍 파트너 아이디/비밀번호 찾기 페이지
   ======================================== */

/**
 * 파트너 아이디/비밀번호 찾기 페이지
 *
 * 목적: 파트너 회원이 아이디와 비밀번호를 찾을 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/find-account
 */

import PartnerHeader from "@/components/fragments/PartnerHeader";
import PageTitle from "@/components/fragments/PageTitle";
import FindAccountPage from "@/components/common/find_account/page/FindAccountPage";
import styles from "@/styles/common/find_account/find_account.module.css";

/**
 * 파트너 아이디/비밀번호 찾기 페이지 컴포넌트
 *
 * @returns JSX.Element - 파트너 아이디/비밀번호 찾기 페이지 UI
 */
export default function PartnerFindAccountPage() {
  return (
    <div>
      {/* 메인 헤더 */}
      <PartnerHeader />

      {/* 페이지 타이틀 (모바일 전용) */}
      <div className={styles.mobile_page_title_wrapper}>
        <PageTitle title="계정 찾기" />
      </div>

      {/* 아이디/비밀번호 찾기 페이지 */}
      <FindAccountPage />
    </div>
  );
}
