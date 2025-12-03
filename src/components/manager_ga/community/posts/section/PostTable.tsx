/* ========================================
   📋 게시글 목록 테이블 컴포넌트
   ======================================== */

/**
 * 게시글 목록 테이블 컴포넌트
 *
 * 목적: GA 관리자 게시글 목록 페이지의 게시글 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/community/posts (게시글 목록 페이지)
 *
 * 주요 기능:
 * - 게시글 목록을 테이블로 표시합니다
 * - 검색어 필터를 적용합니다
 * - 체크박스로 게시글을 선택할 수 있습니다
 * - 구분 태그를 표시합니다 (공지사항/자주 묻는 질문/이벤트)
 * - 카테고리 태그를 표시합니다
 * - 조회수를 천 단위로 포맷팅하여 표시합니다
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
import styles from '@/styles/manager_ga/community/posts/post_table.module.css';
import {
  posts_data,
  type PostItem,
  type PostDivision,
} from '@/data/manager_ga/community/postsData';

interface PostTableProps {
  // 검색어 상태를 props로 받습니다
  search_query: string;
}

// 구분 태그 스타일 매핑
const division_style_map: Record<PostDivision, string> = {
  공지사항: styles.division_tag_notice,
  '자주 묻는 질문': styles.division_tag_faq,
  이벤트: styles.division_tag_event,
};

export default function PostTable({ search_query }: PostTableProps) {
  // 선택된 게시글 ID 목록 상태 관리
  const [selected_post_ids, set_selected_post_ids] = useState<string[]>([]);

  // 전체 선택/해제 상태 관리
  const [is_all_selected, set_is_all_selected] = useState(false);

  // 검색어로 필터링된 게시글 목록
  const filtered_posts = posts_data.filter((item) => {
    if (!search_query) return true;
    // 제목으로 검색
    return item.title.toLowerCase().includes(search_query.toLowerCase());
  });

  // 개별 체크박스 토글 핸들러
  const handle_checkbox_toggle = (post_id: string) => {
    set_selected_post_ids((prev) => {
      if (prev.includes(post_id)) {
        // 이미 선택된 경우 제거
        return prev.filter((id) => id !== post_id);
      } else {
        // 선택되지 않은 경우 추가
        return [...prev, post_id];
      }
    });
  };

  // 전체 선택/해제 핸들러
  const handle_select_all = () => {
    if (is_all_selected) {
      // 전체 해제
      set_selected_post_ids([]);
      set_is_all_selected(false);
    } else {
      // 전체 선택
      set_selected_post_ids(filtered_posts.map((item) => item.id));
      set_is_all_selected(true);
    }
  };

  // 숫자를 천 단위로 포맷팅하는 함수
  const format_number = (num: number): string => {
    return num.toLocaleString();
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
        </div>
        <div className={styles.table_cell_division}>
          <span>구분</span>
        </div>
        <div className={styles.table_cell_category}>
          <span>카테고리</span>
        </div>
        <div className={styles.table_cell_title}>
          <span>제목</span>
        </div>
        <div className={styles.table_cell_view_count}>
          <span>조회수</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_registered_date}>
          <span>등록일</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_registered_by}>
          <span>등록자</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
      </div>

      {/* 테이블 바디 */}
      <div className={styles.table_body}>
        {filtered_posts.length === 0 ? (
          <div className={styles.empty_message}>게시글이 없습니다.</div>
        ) : (
          filtered_posts.map((item) => {
            const is_selected = selected_post_ids.includes(item.id);
            return (
              <div key={item.id} className={styles.table_row}>
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
                    onChange={() => handle_checkbox_toggle(item.id)}
                    className={styles.checkbox}
                  />
                </div>

                {/* 번호 */}
                <div className={styles.table_cell_number}>{item.number}</div>

                {/* 구분 (공지사항/자주 묻는 질문/이벤트) */}
                <div className={styles.table_cell_division}>
                  <span
                    className={`${styles.division_tag} ${
                      division_style_map[item.division]
                    }`}
                  >
                    {item.division}
                  </span>
                </div>

                {/* 카테고리 */}
                <div className={styles.table_cell_category}>
                  <span className={styles.category_tag}>{item.category}</span>
                </div>

                {/* 제목 */}
                <div className={styles.table_cell_title}>
                  <span className={styles.title_text}>{item.title}</span>
                </div>

                {/* 조회수 */}
                <div className={styles.table_cell_view_count}>
                  {format_number(item.view_count)}
                </div>

                {/* 등록일 */}
                <div className={styles.table_cell_registered_date}>
                  {item.registered_date}
                </div>

                {/* 등록자 */}
                <div className={styles.table_cell_registered_by}>
                  {item.registered_by}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
