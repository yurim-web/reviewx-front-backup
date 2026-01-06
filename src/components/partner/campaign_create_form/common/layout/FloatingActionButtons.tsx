/* ========================================
   🔘 플로팅 액션 버튼 컴포넌트
   ======================================== */

/**
 * 플로팅 액션 버튼 컴포넌트
 *
 * 목적: 우측 하단에 고정되는 임시 저장/불러오기 플로팅 버튼을 제공합니다.
 *
 * 주요 기능:
 * - 임시 저장 버튼
 * - 불러오기 버튼
 * - 우측 하단 고정 위치
 * - 스크롤 시에도 항상 보이는 플로팅 UI
 *
 * 참고: 기획이 보여줄 예정이므로 현재는 기본 구조만 제공합니다.
 */

"use client";

import styles from "./floating_action_buttons.module.css";

/**
 * 플로팅 액션 버튼 Props
 *
 * 설명:
 * - onSave: 임시 저장 버튼 클릭 시 호출되는 콜백 함수
 * - onLoad: 불러오기 버튼 클릭 시 호출되는 콜백 함수
 * - isSaveDisabled: 임시 저장 버튼 비활성화 여부
 * - isLoadDisabled: 불러오기 버튼 비활성화 여부
 */
interface FloatingActionButtonsProps {
  /** 임시 저장 버튼 클릭 시 호출되는 콜백 함수 */
  onSave: () => void;
  /** 불러오기 버튼 클릭 시 호출되는 콜백 함수 */
  onLoad: () => void;
  /** 임시 저장 버튼 비활성화 여부 */
  isSaveDisabled?: boolean;
  /** 불러오기 버튼 비활성화 여부 */
  isLoadDisabled?: boolean;
}

/**
 * 플로팅 액션 버튼 컴포넌트
 *
 * 설명:
 * - 우측 하단에 고정되는 플로팅 버튼입니다.
 * - position: fixed를 사용하여 스크롤 시에도 항상 보입니다.
 * - 임시 저장과 불러오기 버튼을 세로로 배치합니다.
 */
export function FloatingActionButtons({
  onSave,
  onLoad,
  isSaveDisabled = false,
  isLoadDisabled = false,
}: FloatingActionButtonsProps) {
  return (
    <div className={styles.container}>
      {/* 임시 저장 버튼 */}
      <button
        type="button"
        onClick={onSave}
        disabled={!!isSaveDisabled}
        className={styles.save_button}
      >
        임시 저장
      </button>

      {/* 불러오기 버튼 */}
      <button
        type="button"
        onClick={onLoad}
        disabled={!!isLoadDisabled}
        className={styles.load_button}
      >
        불러오기
      </button>
    </div>
  );
}
