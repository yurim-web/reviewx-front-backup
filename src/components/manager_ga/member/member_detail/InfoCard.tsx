/* ========================================
   📋 정보 카드 컴포넌트
   ======================================== */

/**
 * 정보 카드 컴포넌트
 *
 * 목적: 디테일 페이지에서 라벨과 값을 표시하는 재사용 가능한 카드 컴포넌트입니다.
 *
 * 사용 위치:
 * - 리뷰어 디테일 페이지
 * - 파트너 디테일 페이지
 *
 * 주요 기능:
 * - 라벨과 값을 표시합니다
 * - 버튼이 있는 경우 버튼을 함께 표시할 수 있습니다
 * - 추가 배지나 요소를 표시할 수 있습니다
 *
 * 학습 포인트:
 * - Props: 부모 컴포넌트에서 데이터를 받아옵니다
 * - children: React의 특수 prop으로, 컴포넌트 내부에 다른 요소를 넣을 수 있습니다
 * - 조건부 렌더링: on_button_click이 있을 때만 버튼을 표시합니다
 * - React.ReactNode: 다양한 타입의 자식 요소를 받을 수 있는 타입입니다
 */

'use client';

import Image from 'next/image';
import styles from '@/styles/manager_ga/member/member_detail/info_card.module.css';

interface InfoCardProps {
  // 라벨 텍스트
  label: string;
  // 값 텍스트 또는 커스텀 요소
  value: React.ReactNode;
  // 버튼 클릭 핸들러 (선택적)
  on_button_click?: () => void;
  // 버튼 aria-label (선택적)
  button_aria_label?: string;
  // 추가 요소 (배지 등, 선택적)
  children?: React.ReactNode;
}

export default function InfoCard({
  label,
  value,
  on_button_click,
  button_aria_label,
  children,
}: InfoCardProps) {
  return (
    <div className={styles.info_card}>
      {/* 라벨: 정보의 종류를 나타냅니다 */}
      <div className={styles.info_label}>{label}</div>

      {/* 값 영역: 정보의 실제 값을 표시합니다 */}
      <div className={on_button_click ? styles.info_value_with_button : styles.info_value}>
        {/* value prop을 그대로 렌더링합니다 (문자열, 숫자, JSX 등 모두 가능) */}
        {value}

        {/* 조건부 렌더링: on_button_click이 있을 때만 버튼을 표시합니다 */}
        {on_button_click && (
          <button
            className={styles.arrow_button}
            onClick={on_button_click}
            aria-label={button_aria_label}
          >
            <img
              src="/images/icons/arronw_btn.svg"
              alt="화살표"
              className={styles.arrow_icon}
            />
          </button>
        )}
      </div>

      {/* 추가 요소: children prop을 통해 배지나 다른 요소를 추가할 수 있습니다 */}
      {children}
    </div>
  );
}

