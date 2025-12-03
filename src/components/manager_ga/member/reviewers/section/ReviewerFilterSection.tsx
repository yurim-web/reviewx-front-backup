/* ========================================
   🔍 리뷰어 필터 섹션 컴포넌트 (래퍼)
   ======================================== */

/**
 * 리뷰어 필터 섹션 컴포넌트 (래퍼)
 *
 * 목적: GA 관리자 리뷰어 목록 페이지에서 공통 MemberFilterSection을 사용합니다.
 *       스타일과 필터 모달 컴포넌트를 전달하여 manager_ga에 맞게 렌더링합니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers (리뷰어 목록 페이지)
 *
 */

import MemberFilterSectionCommon from '@/components/manager_common/member/filter/MemberFilterSection';
import styles from '@/styles/manager_ga/member/reviewers/reviewer_filter_section.module.css';
import ChannelFilterModal from '@/components/manager_ga/member/reviewers/filter/ChannelFilterModal';
import GradeFilterModal from '@/components/manager_ga/member/reviewers/filter/GradeFilterModal';
import TypeFilterModal from '@/components/manager_ga/member/reviewers/filter/TypeFilterModal';
import StatusFilterModal from '@/components/manager_ga/member/reviewers/filter/StatusFilterModal';
import type { Channel } from '@/data/manager_ga/member/reviewers';

interface ReviewerFilterSectionProps {
  search_query: string;
  on_search_change: (query: string) => void;
}

// 채널 이름 매핑
const channel_name_map: Record<Channel, string> = {
  Blog: '네이버 블로그',
  Clip: '네이버 클립',
  Instagram: '인스타그램',
  Youtube: '유튜브',
  Store: '네이버 스토어',
};

export default function ReviewerFilterSection({
  search_query,
  on_search_change,
}: ReviewerFilterSectionProps) {
  return (
    <MemberFilterSectionCommon<
      Channel,
      import('@/data/manager_ga/member/reviewers').ReviewerStatusType,
      import('@/data/manager_ga/member/reviewers').ReviewerType,
      import('@/data/manager_ga/member/reviewers').ReviewerStatus
    >
      search_query={search_query}
      on_search_change={on_search_change}
      styles={
        styles as {
          filter_item: string;
          checkbox_icon: string;
          checkbox_icon_checked: string;
          filter_text: string;
          dropdown_arrow: string;
          download_icon: string;
          report_icon: string;
        }
      }
      channel_name_map={channel_name_map}
      ChannelFilterModal={ChannelFilterModal as any}
      grade_or_division_label="등급"
      GradeOrDivisionFilterModal={GradeFilterModal as any}
      TypeFilterModal={TypeFilterModal as any}
      StatusFilterModal={StatusFilterModal as any}
      download_button_text="리뷰어 목록 다운로드"
    />
  );
}
