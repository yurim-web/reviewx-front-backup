/* ========================================
   📭 신청 내역 빈 상태 컴포넌트
   ======================================== */

/**
 * 신청 내역이 없을 때 표시되는 빈 상태 메시지 컴포넌트
 *
 * 목적: 신청자 목록이 비어있을 때 사용자에게 명확한 안내 메시지를 제공합니다.
 *
 * 📍 사용 위치:
 * - src/components/manager/common/campaign/progress/layout/CampaignProgressDetailLayout.tsx
 * - 캠페인 신청 내역 페이지에서 신청자 목록이 비어있을 때 표시
 *
 * 📌 React 컴포넌트 기본 구조:
 * - 함수형 컴포넌트: React에서 가장 일반적인 컴포넌트 작성 방식
 * - JSX 반환: JavaScript XML 문법으로 UI를 작성합니다
 */

"use client";

import React from "react";
import styles from "@/styles/partner/campaign_application/empty_applicants.module.css";

/**
 * EmptyApplicantsList 컴포넌트
 *
 * @returns JSX.Element - 빈 상태 메시지를 표시하는 컴포넌트
 *
 * 📌 컴포넌트 설명:
 * - props가 없는 순수한 프레젠테이션 컴포넌트입니다
 * - 항상 동일한 메시지를 표시합니다
 * - CSS 모듈을 사용하여 스타일을 적용합니다
 */
export default function EmptyApplicantsList() {
  /**
   * JSX 반환
   * - React 컴포넌트는 JSX(JavaScript XML)를 반환합니다
   * - className: CSS 모듈에서 가져온 스타일 클래스를 적용합니다
   * - div: 빈 상태 메시지를 감싸는 컨테이너
   * - p: 메시지 텍스트를 표시하는 문단 태그
   */
  return (
    <div className={styles.empty_container}>
      {/* 
        빈 상태 메시지
        - 사용자에게 신청 내역이 없음을 알려주는 텍스트
        - 시맨틱 HTML: p 태그는 문단을 나타내는 시맨틱 태그입니다
      */}
      <p className={styles.empty_message}>신청 내역이 없습니다.</p>
    </div>
  );
}








