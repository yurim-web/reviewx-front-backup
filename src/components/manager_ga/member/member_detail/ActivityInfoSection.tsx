/* ========================================
   📊 활동 정보 섹션 컴포넌트
   ======================================== */

/**
 * 활동 정보 섹션 컴포넌트
 *
 * 목적: 리뷰어와 파트너 디테일 페이지에서 공통으로 사용되는 활동 정보 섹션입니다.
 *
 * 사용 위치:
 * - 리뷰어 디테일 페이지
 * - 파트너 디테일 페이지
 *
 * 주요 기능:
 * - 캠페인 진행/완료 정보
 * - 패널티 정보
 * - 접속일, 가입일
 * - 포인트 정보
 * - 추가 정보 카드 (채널 정보 등)
 *
 */

'use client';

import InfoCard from './InfoCard';
import Section from './Section';
import styles from '@/styles/manager_ga/member/member_detail/section.module.css';

// 활동 정보 아이템 타입 정의
export interface ActivityInfoItem {
  // 라벨
  label: string;
  // 값 (문자열 또는 커스텀 JSX)
  value: React.ReactNode;
  // 버튼 클릭 핸들러 (선택적)
  on_button_click?: () => void;
  // 버튼 aria-label (선택적)
  button_aria_label?: string;
  // 추가 요소 (배지 등, 선택적)
  additional_content?: React.ReactNode;
}

interface ActivityInfoSectionProps {
  // 활동 정보 아이템 배열
  items: ActivityInfoItem[];
}

export default function ActivityInfoSection({
  items,
}: ActivityInfoSectionProps) {
  return (
    <Section title="활동 정보">
      <div className={styles.member_detail_info_grid}>
        {/* 배열을 순회하며 정보 카드를 렌더링합니다 */}
        {items.map((item, index) => (
          <InfoCard
            key={index}
            label={item.label}
            value={item.value}
            on_button_click={item.on_button_click}
            button_aria_label={item.button_aria_label}
          >
            {/* 추가 요소가 있으면 표시합니다 */}
            {item.additional_content}
          </InfoCard>
        ))}
      </div>
    </Section>
  );
}
