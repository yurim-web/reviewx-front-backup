/* ========================================
   🔒 새 비밀번호 설정 페이지 레이아웃
   ======================================== */

/**
 * 새 비밀번호 설정 페이지 전용 레이아웃
 *
 * 목적: /reset-password 경로에만 적용되는 레이아웃과 메타데이터를 정의합니다.
 *
 * 주요 기능:
 * - 기본 레이아웃에 의존하면서, 페이지 전용 SEO 메타데이터(title, description) 설정
 * - children prop으로 실제 페이지 컴포넌트(`page.tsx`)를 렌더링
 *
 * 학습 포인트:
 * - Next.js App Router의 segment 레이아웃(`layout.tsx`) 개념
 * - Metadata 타입을 사용한 정적 메타데이터 정의
 * - React.FC 대신 익명 함수 + 타입 선언 방식
 */

import type { Metadata } from "next";

// 새 비밀번호 설정 페이지 메타데이터
export const metadata: Metadata = {
  title: "ReviewX | 새 비밀번호 설정",
  description: "ReviewX 계정의 새 비밀번호를 설정하는 페이지입니다.",
};

/**
 * 새 비밀번호 설정 페이지 레이아웃 컴포넌트
 *
 * @param children - /reset-password 하위에서 렌더링될 실제 페이지 컴포넌트
 */
export default function ResetPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 별도 레이아웃 구조가 필요 없으므로 children만 그대로 렌더링
  // 필요 시 여기에서 배경색, 공통 래퍼 등을 추가할 수 있습니다.
  return <>{children}</>;
}
