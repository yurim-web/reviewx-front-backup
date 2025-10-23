/* ========================================
   📋 파트너 캠페인 생성 공통 레이아웃
   ======================================== */

/**
 * 파트너 캠페인 생성 페이지들의 공통 레이아웃
 *
 * 목적: 모든 캠페인 생성 페이지에서 공통으로 사용되는 요소들을 관리
 *
 * 공통 요소:
 * - SubHeader (뒤로가기, 가이드북, 마이페이지 버튼)
 * - 메인 헤더 숨기기 처리
 * - 페이지 컨테이너 스타일링
 *
 * 적용 페이지:
 * - /partner/campaign/create/delivery
 * - /partner/campaign/create/mission
 * - /partner/campaign/create/reporter
 * - /partner/campaign/create/review
 * - /partner/campaign/create/visit
 */

"use client";

import { useEffect } from "react";
import SubHeader from "@/components/fragments/SubHeader";

/**
 * 캠페인 생성 페이지들의 공통 레이아웃 컴포넌트
 *
 * @param children - 하위 페이지 컴포넌트들
 *
 * 주요 기능:
 * 1. 메인 헤더 숨기기/표시 관리
 * 2. SubHeader 렌더링
 * 3. 페이지 컨테이너 스타일링
 */
export default function CampaignCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useEffect: 컴포넌트가 마운트될 때 실행되는 훅
  // 의존성 배열이 빈 배열이므로 컴포넌트가 처음 렌더링될 때만 실행
  useEffect(() => {
    // 메인 헤더 숨기기 (SubHeader만 표시)
    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    // cleanup 함수: 컴포넌트가 언마운트될 때 실행
    // 메모리 누수 방지와 상태 정리를 위해 중요
    return () => {
      if (header) header.style.display = "block";
    };
  }, []); // 빈 의존성 배열: 컴포넌트 마운트/언마운트 시에만 실행

  return (
    <div>
      {/* 서브헤더 컴포넌트 - 모든 캠페인 생성 페이지에서 공통으로 사용 */}
      <SubHeader />

      {/* 하위 페이지 컨텐츠 */}
      {children}
    </div>
  );
}
