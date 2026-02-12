/* ========================================
   📭 빈 테이블 상태 컴포넌트
   ======================================== */

/**
 * 빈 테이블 상태 컴포넌트
 *
 * 목적: 테이블에 데이터가 없을 때 표시되는 빈 상태 메시지 컴포넌트입니다.
 *       모든 테이블에서 일관된 스타일을 제공합니다.
 *
 * 📍 사용 위치:
 * - CommonTable 컴포넌트 내부에서 사용
 * - 모든 테이블 컴포넌트에서 데이터가 없을 때 자동으로 표시
 *
 * 주요 기능:
 * - 일관된 빈 상태 메시지 스타일
 * - 그리드 레이아웃에서 전체 컬럼 영역 사용
 * - 커스터마이징 가능한 메시지
 */

"use client";

import styles from "./EmptyTableState.module.css";

interface EmptyTableStateProps {
  message: string; // 표시할 메시지
  className?: string; // 추가 CSS 클래스명 (선택적)
}

export default function EmptyTableState({
  message,
  className,
}: EmptyTableStateProps) {
  // className이 undefined일 때 빈 문자열로 처리하여 Hydration 오류 방지
  const class_name = className || "";
  return (
    <div className={`${styles.empty_message} ${class_name}`.trim()}>
      {message}
    </div>
  );
}
