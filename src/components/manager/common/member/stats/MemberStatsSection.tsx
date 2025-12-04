/* ========================================
   📊 회원 통계 섹션 컴포넌트 (공통)
   ======================================== */

/**
 * 회원 통계 섹션 컴포넌트 (공통)
 *
 * 목적: 리뷰어/파트너 목록 페이지 상단에 표시되는 통계 카드들을 표시하는 섹션입니다.
 *
 * 📍 사용 위치:
 * - /manager_ga/member/reviewers (GA 관리자 리뷰어 목록 페이지)
 * - /manager_sa/member/reviewers (SA 관리자 리뷰어 목록 페이지)
 * - /manager_ga/member/partners (GA 관리자 파트너 목록 페이지)
 * - /manager_sa/member/partners (SA 관리자 파트너 목록 페이지)
 *
 * 주요 기능:
 * - 전체 가입자 수 통계
 * - 월간 활동 회원 통계
 * - 월간 신규 가입자 수 통계
 * - 휴면 회원 통계
 *
 */

// 통계 데이터 타입 정의
export interface MemberStats {
  total_members: number; // 전체 가입자 수
  monthly_active: number; // 월간 활동 회원
  monthly_new: number; // 월간 신규 가입자 수
  dormant: number; // 휴면 회원
}

interface MemberStatsSectionProps {
  // 통계 데이터
  stats: MemberStats;
  // CSS 모듈 스타일 객체
  styles: Record<string, string> & {
    stats_section: string;
    stat_card: string;
    stat_card_label: string;
    stat_card_value: string;
  };
}

/**
 * 통계 카드 컴포넌트
 *
 * @param title - 카드 제목
 * @param value - 통계 값
 * @param styles - CSS 모듈 스타일 객체
 */
function MemberStatCard({
  title,
  value,
  styles: cssStyles,
}: {
  title: string;
  value: string;
  styles: {
    stat_card: string;
    stat_card_label: string;
    stat_card_value: string;
  };
}) {
  return (
    <div className={cssStyles.stat_card}>
      <p className={cssStyles.stat_card_label}>{title}</p>
      <p className={cssStyles.stat_card_value}>{value}</p>
    </div>
  );
}

/**
 * 회원 통계 섹션 컴포넌트
 *
 * @param stats - 통계 데이터
 * @param styles - CSS 모듈 스타일 객체
 * @returns 회원 통계 섹션 JSX
 */
export default function MemberStatsSection({
  stats,
  styles: cssStyles,
}: MemberStatsSectionProps) {
  // 통계 데이터를 배열로 변환하여 map 함수로 렌더링
  const stats_items = [
    {
      title: '전체 가입자 수',
      value: `${stats.total_members.toLocaleString()}명`,
    },
    {
      title: '월간 활동 회원',
      value: `${stats.monthly_active.toLocaleString()}명`,
    },
    {
      title: '월간 신규 가입자 수',
      value: `${stats.monthly_new.toLocaleString()}명`,
    },
    {
      title: '휴면 회원',
      value: `${stats.dormant.toLocaleString()}명`,
    },
  ];

  return (
    <div className={cssStyles.stats_section}>
      {stats_items.map((item, index) => (
        <MemberStatCard
          key={index}
          title={item.title}
          value={item.value}
          styles={cssStyles}
        />
      ))}
    </div>
  );
}
