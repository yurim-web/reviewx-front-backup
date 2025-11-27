/* ========================================
   🔍 반려내역 필터 섹션 컴포넌트
   ======================================== */

/**
 * 반려내역 필터 섹션 컴포넌트
 *
 * 목적: GA 관리자 반려내역 페이지의 필터 옵션들을 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/rejected (반려내역 페이지)
 *
 * 주요 기능:
 * - 날짜 필터
 * - 반려 코드 필터
 * - 검색 필터
 * - 정렬 필터
 * - 신고 필터
 *
 * 학습 포인트:
 * - CSS 모듈: styles 객체를 통해 클래스명을 참조합니다
 * - JSX: HTML과 유사하지만 JavaScript 표현식을 사용할 수 있습니다
 * - 이미지 사용: Next.js에서 public 폴더의 이미지는 / 경로로 접근할 수 있습니다
 *   예: /images/icons/rerport_icon.svg
 * - img 태그: alt 속성은 접근성을 위해 필수입니다 (스크린 리더가 읽을 수 있도록)
 * - input 태그: 사용자 입력을 받는 HTML 요소입니다
 *   - type="text": 텍스트 입력을 받습니다
 *   - placeholder: 입력 전에 보이는 힌트 텍스트입니다
 *   - className: CSS 모듈의 클래스를 적용합니다
 * - flex 레이아웃: flex: 1을 사용하면 남은 공간을 모두 차지합니다
 * - justify-content: space-between: 자식 요소들을 양 끝에 배치하고 중간 공간을 균등 분배합니다
 * - 그룹화: 관련된 요소들을 div로 묶어서 레이아웃을 제어할 수 있습니다
 * - Props: 부모 컴포넌트에서 자식 컴포넌트로 데이터와 함수를 전달합니다
 * - 이벤트 핸들러: onChange 이벤트를 통해 부모 컴포넌트의 상태를 업데이트합니다
 */

import styles from '@/styles/manager_ga/campaign/progress/filter_section.module.css';

interface FilterSectionProps {
  // 검색어 상태와 변경 함수를 props로 받습니다
  search_query: string;
  on_search_change: (query: string) => void;
}

export default function FilterSection({
  search_query,
  on_search_change,
}: FilterSectionProps) {
  return (
    <div className={styles.filter_section}>
      {/* 왼쪽 그룹: 날짜, 반려 코드, 검색 필터 */}
      <div className={styles.filter_group_left}>
        {/* 날짜 필터 */}
        <div className={styles.filter_item}>
          <div className={styles.filter_icon}></div>
          <span className={styles.filter_text}>2025-10-01 ~ 2025-10-31</span>
        </div>

        {/* 반려 코드 필터 */}
        <div className={styles.filter_item}>
          <div className={styles.checkbox_icon}></div>
          <span className={styles.filter_text}>반려 코드</span>
          {/* 드롭다운 화살표 아이콘 */}
          <img
            src="/images/icons/dropdown_arrow.svg"
            alt="드롭다운"
            className={styles.dropdown_arrow}
          />
        </div>

        {/* 검색 필터 - 실제 검색 입력창 */}
        <div className={styles.search_filter_item}>
          {/* 검색 아이콘 - 돋보기 아이콘 */}
          <img
            src="/images/icons/search_icon.svg"
            alt="검색"
            className={styles.search_icon}
          />
          {/* 검색 입력창 */}
          <input
            type="text"
            placeholder="검색"
            value={search_query}
            onChange={(e) => on_search_change(e.target.value)}
            className={styles.search_input}
          />
        </div>
      </div>

      {/* 오른쪽 그룹: 신고, 정렬 필터 */}
      <div className={styles.filter_group_right}>
        {/* 신고 필터 */}
        <div className={styles.filter_item}>
          {/* 신고 아이콘 - 빨간색 말풍선 아이콘 */}
          <img
            src="/images/icons/rerport_icon.svg"
            alt="신고"
            className={styles.report_icon}
          />
          <span className={styles.filter_text}>신고</span>
        </div>

        {/* 정렬 필터 */}
        <div className={styles.filter_item}>
          <span className={styles.filter_text}>최신순</span>
          {/* 드롭다운 화살표 아이콘 */}
          <img
            src="/images/icons/dropdown_arrow.svg"
            alt="드롭다운"
            className={styles.dropdown_arrow}
          />
        </div>
      </div>
    </div>
  );
}

