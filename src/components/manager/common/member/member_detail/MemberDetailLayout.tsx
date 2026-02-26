/* ========================================
   회원 디테일 레이아웃 컴포넌트
   ======================================== */

/**
 * MemberDetailLayout
 *
 * 목적: 리뷰어·파트너 상세 페이지 공통 레이아웃 (로딩·에러 처리)
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers/[id], /manager_ga/member/partners/[id]
 * - /manager_sa/member/reviewers/[id], /manager_sa/member/partners/[id]
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
  error_message: _error_message,
  back_path: _back_path,
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
