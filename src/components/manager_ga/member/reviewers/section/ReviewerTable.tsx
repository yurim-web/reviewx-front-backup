/* ========================================
   📋 리뷰어 목록 테이블 컴포넌트
   ======================================== */

/**
 * 리뷰어 목록 테이블 컴포넌트
 *
 * 목적: GA 관리자 리뷰어 목록 페이지의 리뷰어 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/member/reviewers (리뷰어 목록 페이지)
 *
 * 주요 기능:
 * - 리뷰어 목록을 테이블로 표시합니다
 * - 검색어 필터를 적용합니다
 * - 체크박스로 리뷰어를 선택할 수 있습니다
 * - 채널 아이콘을 표시합니다
 * - 리뷰어 유형 태그를 표시합니다
 * - 리뷰어 상태를 표시합니다
 *
 * 학습 포인트:
 * - CSS 모듈: styles 객체를 통해 클래스명을 참조합니다
 * - JSX: HTML과 유사하지만 JavaScript 표현식을 사용할 수 있습니다
 * - map 함수: 배열을 순회하며 JSX 요소를 생성합니다
 * - key prop: React에서 리스트를 렌더링할 때 각 요소를 구분하기 위해 필요합니다
 * - 조건부 렌더링: 삼항 연산자를 사용하여 조건에 따라 다른 내용을 표시합니다
 * - filter 함수: 배열에서 조건에 맞는 요소만 추출합니다
 * - Props: 부모 컴포넌트에서 자식 컴포넌트로 데이터와 함수를 전달합니다
 * - 숫자 포맷팅: toLocaleString()을 사용하여 숫자를 천 단위로 구분하여 표시합니다
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/manager_ga/member/reviewers/reviewer_table.module.css';
import {
  reviewer_list,
  type ReviewerItem,
  type Channel,
  type ReviewerType,
  type ReviewerStatus,
  type ReviewerStatusType,
} from '@/data/manager_ga/member/reviewers';

interface ReviewerTableProps {
  // 검색어 상태를 props로 받습니다
  search_query: string;
}

// 채널 아이콘 경로 매핑
const channel_icon_map: Record<Channel, string> = {
  Blog: '/images/brand_logo/naverblog.svg',
  Clip: '/images/brand_logo/naverclip.svg',
  Instagram: '/images/brand_logo/insta.svg',
  Youtube: '/images/brand_logo/youtube.svg',
};

// 리뷰어 유형 태그 스타일 매핑
const reviewer_type_style_map: Record<ReviewerType, string> = {
  서포터즈: styles.type_tag_supporter,
  일반: styles.type_tag_normal,
  인플루언서: styles.type_tag_influencer,
};

// 리뷰어 상태 태그 스타일 매핑
const reviewer_status_style_map: Record<ReviewerStatus, string> = {
  정상: styles.status_tag_normal,
  '일시 정지': styles.status_tag_suspended,
  '영구 정지': styles.status_tag_permanent,
};

// 리뷰어 상태 유형은 태그 스타일 없이 일반 텍스트로만 표시

export default function ReviewerTable({ search_query }: ReviewerTableProps) {
  // Next.js의 useRouter 훅을 사용하여 페이지 이동 기능 가져오기
  // useRouter: Next.js에서 제공하는 클라이언트 사이드 라우팅 훅입니다
  const router = useRouter();

  // 선택된 리뷰어 ID 목록 상태 관리
  const [selected_reviewer_ids, set_selected_reviewer_ids] = useState<string[]>(
    [],
  );

  // 전체 선택/해제 상태 관리
  const [is_all_selected, set_is_all_selected] = useState(false);

  // 검색어로 필터링된 리뷰어 목록
  const filtered_reviewers = reviewer_list.filter((reviewer) => {
    if (!search_query) return true;
    // 이름으로 검색
    return reviewer.name.toLowerCase().includes(search_query.toLowerCase());
  });

  // 개별 체크박스 토글 핸들러
  const handle_checkbox_toggle = (reviewer_id: string) => {
    set_selected_reviewer_ids((prev) => {
      if (prev.includes(reviewer_id)) {
        // 이미 선택된 경우 제거
        return prev.filter((id) => id !== reviewer_id);
      } else {
        // 선택되지 않은 경우 추가
        return [...prev, reviewer_id];
      }
    });
  };

  // 전체 선택/해제 핸들러
  const handle_select_all = () => {
    if (is_all_selected) {
      // 전체 해제
      set_selected_reviewer_ids([]);
      set_is_all_selected(false);
    } else {
      // 전체 선택
      set_selected_reviewer_ids(filtered_reviewers.map((r) => r.id));
      set_is_all_selected(true);
    }
  };

  // 숫자를 천 단위로 포맷팅하는 함수
  const format_number = (num: number): string => {
    return num.toLocaleString();
  };

  // 리뷰어 행 클릭 핸들러
  // 테이블 행을 클릭하면 해당 리뷰어의 디테일 페이지로 이동합니다
  const handle_row_click = (reviewer_id: string) => {
    // router.push: Next.js에서 제공하는 페이지 이동 함수입니다
    // `/manager_ga/member/reviewers/${reviewer_id}` 경로로 이동합니다
    router.push(`/manager_ga/member/reviewers/${reviewer_id}`);
  };

  return (
    <div className={styles.table_container}>
      {/* 테이블 헤더 */}
      <div className={styles.table_header}>
        <div className={styles.table_cell_checkbox}>
          <input
            type="checkbox"
            checked={is_all_selected}
            onChange={handle_select_all}
            className={styles.checkbox}
          />
        </div>
        <div className={styles.table_cell_number}>
          <span>번호</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_name}>
          <span>이름</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_channel}>
          <span>채널</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_type}>
          <span>구분</span>
        </div>
        <div className={styles.table_cell_last_access}>
          <span>접속일</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_join_date}>
          <span>가입일</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_campaign_participated}>
          <span>캠페인 참여</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_campaign_completed}>
          <span>캠페인 완료</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_current_points}>
          <span>보유 포인트</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_withdrawn_points}>
          <span>출금 포인트</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_status_type}>
          <span>유형</span>
        </div>
        <div className={styles.table_cell_status}>
          <span>상태</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
      </div>

      {/* 테이블 바디 */}
      <div className={styles.table_body}>
        {filtered_reviewers.length === 0 ? (
          <div className={styles.empty_message}>리뷰어가 없습니다.</div>
        ) : (
          filtered_reviewers.map((reviewer) => {
            const is_selected = selected_reviewer_ids.includes(reviewer.id);
            return (
              <div
                key={reviewer.id}
                className={styles.table_row}
                onClick={() => handle_row_click(reviewer.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  // 키보드 접근성: Enter 키나 Space 키를 누르면 클릭과 동일하게 동작합니다
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handle_row_click(reviewer.id);
                  }
                }}
                aria-label={`${reviewer.name} 리뷰어 상세 정보 보기`}
              >
                {/* 체크박스 */}
                <div
                  className={styles.table_cell_checkbox}
                  onClick={(e) => {
                    // 체크박스 클릭 시 행 클릭 이벤트가 발생하지 않도록 이벤트 전파를 막습니다
                    // stopPropagation: 이벤트 버블링을 방지하는 메서드입니다
                    e.stopPropagation();
                  }}
                >
                  <input
                    type="checkbox"
                    checked={is_selected}
                    onChange={() => handle_checkbox_toggle(reviewer.id)}
                    className={styles.checkbox}
                  />
                </div>

                {/* 번호 */}
                <div className={styles.table_cell_number}>
                  {reviewer.number}
                </div>

                {/* 이름 */}
                <div className={styles.table_cell_name}>{reviewer.name}</div>

                {/* 채널 */}
                <div className={styles.table_cell_channel}>
                  <div className={styles.channel_icons}>
                    {reviewer.channels.map((channel, index) => (
                      <div key={index} className={styles.channel_icon_wrapper}>
                        <img
                          src={channel_icon_map[channel]}
                          alt={channel}
                          className={styles.channel_icon}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 구분 (유형) */}
                <div className={styles.table_cell_type}>
                  <span
                    className={`${styles.type_tag} ${
                      reviewer_type_style_map[reviewer.type]
                    }`}
                  >
                    {reviewer.type}
                  </span>
                </div>

                {/* 접속일 */}
                <div className={styles.table_cell_last_access}>
                  {reviewer.last_access_date}
                </div>

                {/* 가입일 */}
                <div className={styles.table_cell_join_date}>
                  {reviewer.join_date}
                </div>

                {/* 캠페인 참여 */}
                <div className={styles.table_cell_campaign_participated}>
                  {format_number(reviewer.campaign_participated)}회
                </div>

                {/* 캠페인 완료 */}
                <div className={styles.table_cell_campaign_completed}>
                  {format_number(reviewer.campaign_completed)}회
                </div>

                {/* 보유 포인트 */}
                <div className={styles.table_cell_current_points}>
                  {format_number(reviewer.current_points)}
                </div>

                {/* 출금 포인트 */}
                <div className={styles.table_cell_withdrawn_points}>
                  {format_number(reviewer.withdrawn_points)}
                </div>

                {/* 유형 (상태 유형) */}
                <div className={styles.table_cell_status_type}>
                  {reviewer.status_type}
                </div>

                {/* 상태 */}
                <div className={styles.table_cell_status}>
                  <span
                    className={`${styles.status_tag} ${
                      reviewer_status_style_map[reviewer.status]
                    }`}
                  >
                    {reviewer.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
