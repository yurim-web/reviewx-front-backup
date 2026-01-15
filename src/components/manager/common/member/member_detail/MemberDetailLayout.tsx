/* ========================================
   🏗️ 회원 디테일 레이아웃 컴포넌트
   ======================================== */

/**
 * 회원 디테일 레이아웃 컴포넌트
 *
 * 목적: 리뷰어와 파트너 디테일 페이지에서 공통으로 사용되는 레이아웃입니다.
 * 로딩 상태와 에러 상태를 처리합니다.
 *
 * 사용 위치:
 * - 리뷰어 디테일 페이지
 * - 파트너 디테일 페이지
 *
 * 주요 기능:
 * - 로딩 상태 표시 (Loading 컴포넌트 사용)
 * - 에러 상태 표시 (BaseModal 사용)
 *   - 에러 발생 시 모달로 "오류가 발생했습니다. 잠시 후 다시 시도해주세요." 메시지 표시
 *   - 확인 버튼 클릭 시 이용제한 목록(차단 내역) 페이지로 이동
 *     - 현재 경로에서 manager_ga인지 manager_sa인지 자동 판단
 *     - /manager_ga/member/blacklist 또는 /manager_sa/member/blacklist로 이동
 * - 메인 콘텐츠 렌더링
 *
 */

"use client";

import { useRouter, usePathname } from "next/navigation";
import Loading from "@/app/loading";
import BaseModal from "@/components/common/modal/BaseModal";
import styles from "@/styles/manager/common/member/member_detail/member_detail_layout.module.css";

interface MemberDetailLayoutProps {
  // 로딩 상태
  is_loading: boolean;
  // 에러 상태 (데이터가 없을 때)
  is_error: boolean;
  // 에러 메시지
  error_message: string;
  // 목록으로 돌아가기 경로
  back_path: string;
  // 메인 콘텐츠 (children을 통해 전달)
  children: React.ReactNode;
}

export default function MemberDetailLayout({
  is_loading,
  is_error,
  error_message,
  back_path,
  children,
}: MemberDetailLayoutProps) {
  // Next.js의 useRouter 훅: 페이지 이동을 위해 사용
  // useRouter는 클라이언트 컴포넌트에서만 사용 가능합니다
  const router = useRouter();
  // Next.js의 usePathname 훅: 현재 경로를 가져옵니다
  // manager_ga인지 manager_sa인지 판단하기 위해 사용합니다
  const pathname = usePathname();

  // 로딩 상태일 때는 로딩 컴포넌트 표시
  if (is_loading) {
    return <Loading />;
  }

  // 에러 모달 닫기 핸들러
  // 확인 버튼을 클릭하거나 모달을 닫으면 이용제한 목록(차단 내역) 페이지로 이동합니다
  // 현재 경로에서 manager_ga인지 manager_sa인지 판단하여 적절한 경로로 이동합니다
  const handle_error_modal_close = () => {
    // pathname 예시: "/manager_ga/member/partners/[id]" 또는 "/manager_sa/member/reviewers/[id]"
    // 현재 경로에서 manager_ga인지 manager_sa인지 판단
    const is_manager_ga = pathname?.includes("/manager_ga");
    const manager_prefix = is_manager_ga ? "manager_ga" : "manager_sa";

    // 이용제한 목록(차단 내역) 페이지로 이동
    // 경로 예시: /manager_ga/member/blacklist 또는 /manager_sa/member/blacklist
    router.push(`/${manager_prefix}/member/blacklist`);
  };

  return (
    <>
      {/* 에러 상태일 때 모달 표시 */}
      <BaseModal
        is_open={is_error}
        on_close={handle_error_modal_close}
        message="오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."
        buttons={["확인"]}
        type="center"
      />

      {/* 정상 상태일 때 메인 콘텐츠 표시 */}
      {!is_error && <div className={styles.container}>{children}</div>}
    </>
  );
}
