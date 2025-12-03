/* ========================================
   📋 차단 내역 테이블 컴포넌트
   ======================================== */

/**
 * 차단 내역 테이블 컴포넌트
 *
 * 목적: GA 관리자 차단 내역 페이지의 차단 내역 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/member/blacklist (차단 내역 페이지)
 *
 * 주요 기능:
 * - 차단 내역 목록을 테이블로 표시합니다
 * - 검색어 필터를 적용합니다
 * - 체크박스로 차단 내역을 선택할 수 있습니다
 * - 구분 태그를 표시합니다 (파트너/리뷰어/관리자)
 * - 차단 코드와 차단 사유를 표시합니다
 *
 */

'use client';

import { useState } from 'react';
import styles from '@/styles/manager_ga/member/blacklist/blacklist_table.module.css';
import {
  blacklist_data,
  type BlacklistItem,
  type BlacklistDivision,
} from '@/data/manager_ga/member/blacklist';

interface BlacklistTableProps {
  // 검색어 상태를 props로 받습니다
  search_query: string;
}

// 구분 태그 스타일 매핑
const division_style_map: Record<BlacklistDivision, string> = {
  파트너: styles.division_tag_partner,
  리뷰어: styles.division_tag_reviewer,
  관리자: styles.division_tag_admin,
};

export default function BlacklistTable({ search_query }: BlacklistTableProps) {
  // 선택된 차단 내역 ID 목록 상태 관리
  const [selected_blacklist_ids, set_selected_blacklist_ids] = useState<
    string[]
  >([]);

  // 전체 선택/해제 상태 관리
  const [is_all_selected, set_is_all_selected] = useState(false);

  // 검색어로 필터링된 차단 내역 목록
  const filtered_blacklist = blacklist_data.filter((item) => {
    if (!search_query) return true;
    // 이름/상호명 또는 아이디로 검색
    return (
      item.name.toLowerCase().includes(search_query.toLowerCase()) ||
      item.user_id.toLowerCase().includes(search_query.toLowerCase())
    );
  });

  // 개별 체크박스 토글 핸들러
  const handle_checkbox_toggle = (blacklist_id: string) => {
    set_selected_blacklist_ids((prev) => {
      if (prev.includes(blacklist_id)) {
        // 이미 선택된 경우 제거
        return prev.filter((id) => id !== blacklist_id);
      } else {
        // 선택되지 않은 경우 추가
        return [...prev, blacklist_id];
      }
    });
  };

  // 전체 선택/해제 핸들러
  const handle_select_all = () => {
    if (is_all_selected) {
      // 전체 해제
      set_selected_blacklist_ids([]);
      set_is_all_selected(false);
    } else {
      // 전체 선택
      set_selected_blacklist_ids(filtered_blacklist.map((item) => item.id));
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
        <div className={styles.table_cell_name}>
          <span>이름/상호명</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_user_id}>
          <span>아이디</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_division}>
          <span>구분</span>
        </div>
        <div className={styles.table_cell_points}>
          <span>보유 포인트</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_ip}>
          <span>아이피</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_block_code}>
          <span>차단 코드</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_block_reason}>
          <span>차단 사유</span>
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
        {filtered_blacklist.length === 0 ? (
          <div className={styles.empty_message}>차단 내역이 없습니다.</div>
        ) : (
          filtered_blacklist.map((item) => {
            const is_selected = selected_blacklist_ids.includes(item.id);
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

                {/* 이름/상호명 */}
                <div className={styles.table_cell_name}>{item.name}</div>

                {/* 아이디 */}
                <div className={styles.table_cell_user_id}>{item.user_id}</div>

                {/* 구분 (파트너/리뷰어/관리자) */}
                <div className={styles.table_cell_division}>
                  <span
                    className={`${styles.division_tag} ${
                      division_style_map[item.division]
                    }`}
                  >
                    {item.division}
                  </span>
                </div>

                {/* 보유 포인트 */}
                <div className={styles.table_cell_points}>
                  {format_number(item.current_points)}
                </div>

                {/* 아이피 */}
                <div className={styles.table_cell_ip}>{item.ip_address}</div>

                {/* 차단 코드 */}
                <div className={styles.table_cell_block_code}>
                  {item.block_code}
                </div>

                {/* 차단 사유 */}
                <div className={styles.table_cell_block_reason}>
                  {item.block_reason}
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
