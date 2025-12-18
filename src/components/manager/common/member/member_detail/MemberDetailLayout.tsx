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
 * - 로딩 상태 표시
 * - 에러 상태 표시
 * - 메인 콘텐츠 렌더링
 *
 */

'use client';

import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import styles from '@/styles/manager_ga/member/member_detail/member_detail_layout.module.css';

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
  const router = useRouter();

  if (is_loading) {
    return <Loading />;
  }

  if (is_error) {
    return (
      <div className={styles.container}>
        <div className={styles.error_message}>
          <p>{error_message}</p>
          <button
            onClick={() => router.push(back_path)}
            className={styles.back_button}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return <div className={styles.container}>{children}</div>;
}

