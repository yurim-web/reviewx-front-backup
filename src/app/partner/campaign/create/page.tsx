/* ========================================
   🆕 파트너 새 캠페인 등록 페이지
   ======================================== */

/**
 * 파트너 새 캠페인 등록 페이지
 *
 * 목적: 파트너가 새로운 캠페인을 등록하는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/campaign/create
 *
 * 주요 기능:
 * - 캠페인 기본 정보 입력 (제목, 유형, 플랫폼)
 * - 썸네일/상세 이미지 업로드
 * - 캠페인 상세 정보 입력 (모집 인원, 기간 등)
 * - 참여/제출 옵션 설정
 * - 안내 사항 및 유의 사항
 * - 캠페인 등록 처리
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 파트너 캠페인 생성 메인 페이지
 * 배송형 캠페인 생성 페이지로 리다이렉트
 */
export default function PartnerCampaignCreatePage() {
  const router = useRouter();

  useEffect(() => {
    // 메인 캠페인 생성 페이지 접근 시 배송형 캠페인 생성 페이지로 리다이렉트
    router.replace("/partner/campaign/create/delivery");
  }, [router]);

  // 리다이렉트 중에는 아무것도 렌더링하지 않음
  return null;
}
