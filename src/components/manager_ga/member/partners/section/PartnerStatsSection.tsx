/* ========================================
   📊 파트너 통계 섹션 컴포넌트
   ======================================== */

/**
 * 파트너 통계 섹션 컴포넌트
 *
 * 목적: 파트너 목록 페이지 상단에 표시되는 통계 카드들을 표시하는 섹션입니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/partners (파트너 목록 페이지)
 *
 * 주요 기능:
 * - 전체 가입자 수 통계
 * - 월간 활동 회원 통계
 * - 월간 신규 가입자 수 통계
 * - 휴면 회원 통계
 *
 * 학습 포인트:
 * - 컴포넌트 분리: 통계 카드를 별도 컴포넌트로 분리하여 재사용성을 높입니다
 * - 배열 메서드: map 함수를 사용하여 통계 카드 목록을 렌더링합니다
 * - 구조분해할당: props에서 필요한 데이터를 추출합니다
 */

import styles from '@/styles/manager_ga/member/partners/partner_stats_section.module.css';
import { partner_stats, type PartnerStats } from '@/data/manager_ga/member/partners';

/**
 * 통계 카드 컴포넌트
 *
 * @param title - 카드 제목
 * @param value - 통계 값
 */
function PartnerStatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className={styles.stat_card}>
      <p className={styles.stat_card_label}>{title}</p>
      <p className={styles.stat_card_value}>{value}</p>
    </div>
  );
}

/**
 * 파트너 통계 섹션 컴포넌트
 *
 * @returns 파트너 통계 섹션 JSX
 */
export default function PartnerStatsSection() {
  // 통계 데이터를 배열로 변환하여 map 함수로 렌더링
  const stats_items = [
    {
      title: '전체 가입자 수',
      value: `${partner_stats.total_members.toLocaleString()}명`,
    },
    {
      title: '월간 활동 회원',
      value: `${partner_stats.monthly_active.toLocaleString()}명`,
    },
    {
      title: '월간 신규 가입자 수',
      value: `${partner_stats.monthly_new.toLocaleString()}명`,
    },
    {
      title: '휴면 회원',
      value: `${partner_stats.dormant.toLocaleString()}명`,
    },
  ];

  return (
    <div className={styles.stats_section}>
      {stats_items.map((item, index) => (
        <PartnerStatCard key={index} title={item.title} value={item.value} />
      ))}
    </div>
  );
}


