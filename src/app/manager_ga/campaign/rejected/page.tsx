/* ========================================
   📋 GA 관리자 반려내역 페이지
   ======================================== */

/**
 * GA 관리자 반려내역 페이지
 *
 * 목적: GA 관리자가 캠페인 반려 내역을 확인하고 관리할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_ga/campaign/rejected
 *
 * 주요 기능:
 * - 반려 코드 안내 섹션 (각 반려 코드의 카테고리와 사유 표시)
 * - 반려 내역 통계 섹션 (반려 코드별 반려 횟수 집계)
 * - 필터 섹션 (날짜, 반려 코드, 검색, 정렬, 신고)
 * - 반려 내역 목록 테이블 (캠페인 번호, 캠페인명, 반려 코드, 반려 사유, 검수자, 대상자, 처리일, 반려 횟수, 사유 확인하기)

 */

'use client';

import { useState } from 'react';
import styles from '@/styles/manager_ga/rejected.module.css';
import {
  reject_code_info,
  reject_stats,
  rejected_campaign_list,
  type RejectedCampaignItem,
} from '@/data/manager_ga/rejected';

/**
 * 반려내역 페이지 컴포넌트
 *
 * @returns 반려내역 페이지 JSX
 */
export default function RejectedPage() {
  // 검색어 상태 관리
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [search_query, set_search_query] = useState<string>('');

  // 반려 코드 필터 상태 관리
  const [selected_reject_code, set_selected_reject_code] = useState<
    string | null
  >(null);

  // 숫자를 천 단위로 포맷팅하는 함수
  // 예: 19999 -> "19,999"
  const format_number = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  // 반려 코드 정보를 코드로 찾는 함수
  const get_reject_code_info = (code: string) => {
    return reject_code_info.find((info) => info.code === code);
  };

  // 필터링된 반려 내역 목록
  // filter 함수는 배열에서 조건에 맞는 요소만 추출합니다
  const filtered_list = rejected_campaign_list.filter((item) => {
    // 검색어 필터: 캠페인명이나 캠페인 번호에 검색어가 포함되어 있는지 확인
    if (
      search_query &&
      !item.campaign_name.includes(search_query) &&
      !item.campaign_number.includes(search_query)
    ) {
      return false;
    }

    // 반려 코드 필터: 선택된 반려 코드가 있으면 해당 코드만 표시
    if (selected_reject_code && item.reject_code !== selected_reject_code) {
      return false;
    }

    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <h1 className={styles.page_title}>캠페인 반려 내역</h1>

        {/* 반려 코드 안내 섹션 */}
        <div className={styles.reject_code_section}>
          <h2 className={styles.section_title}>반려 코드 안내</h2>
          <div className={styles.reject_code_grid}>
            {/* 반려 코드 정보를 map 함수로 순회하며 렌더링 */}
            {reject_code_info.map((info) => (
              <div key={info.code} className={styles.reject_code_item}>
                <span className={styles.reject_code}>{info.code}</span>
                <span className={styles.reject_code_category}>
                  {info.category}
                </span>
                <span className={styles.reject_code_reason}>{info.reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 반려 내역 통계 섹션 */}
        <div className={styles.reject_stats_section}>
          <h2 className={styles.section_title}>반려 내역</h2>
          <div className={styles.reject_stats_grid}>
            {/* 반려 내역 통계를 map 함수로 순회하며 렌더링 */}
            {reject_stats.map((stat, index) => (
              <div key={stat.code} className={styles.reject_stats_item}>
                <span>{stat.code}</span>
                <span className={styles.reject_stats_separator}>·</span>
                <span>{format_number(stat.count)}회</span>
              </div>
            ))}
          </div>
        </div>

        {/* 필터 섹션 */}
        <div className={styles.filter_section}>
          {/* 날짜 필터 */}
          <div className={styles.filter_item}>
            <div className={styles.filter_icon}></div>
            <span className={styles.filter_text}>2025-10-01 ~ 2025-10-31</span>
          </div>

          {/* 반려 코드 필터 */}
          <div className={styles.filter_item}>
            <div className={styles.checkbox_icon}></div>
            <span className={styles.filter_text}>반려 코드</span>
            <div className={styles.dropdown_arrow}></div>
          </div>

          {/* 검색 필터 */}
          <div className={styles.filter_item}>
            <div className={styles.search_icon}></div>
            <input
              type="text"
              placeholder="검색"
              value={search_query}
              onChange={(e) => set_search_query(e.target.value)}
              className={styles.filter_text}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
              }}
            />
          </div>

          {/* 정렬 필터 */}
          <div className={styles.filter_item}>
            <span className={styles.filter_text}>최신순</span>
            <div className={styles.dropdown_arrow}></div>
          </div>

          {/* 신고 필터 */}
          <div className={styles.filter_item}>
            <span className={styles.filter_text}>신고</span>
            <div className={styles.report_icon}></div>
          </div>
        </div>

        {/* 테이블 섹션 */}
        <div className={styles.table_section}>
          {/* 테이블 헤더 */}
          <div className={styles.table_header}>
            <div className={styles.table_header_cell}>
              캠페인 번호
              <span className={styles.sort_icon}></span>
            </div>
            <div className={styles.table_header_cell}>캠페인명</div>
            <div className={styles.table_header_cell}>대상자</div>
            <div className={styles.table_header_cell}>검수자</div>
            <div className={styles.table_header_cell}>반려 코드</div>
            <div className={styles.table_header_cell}>반려 사유</div>
            <div className={styles.table_header_cell}>
              반려 횟수
              <span className={styles.sort_icon}></span>
            </div>
            <div className={styles.table_header_cell}>
              처리일
              <span className={styles.sort_icon}></span>
            </div>
          </div>

          {/* 테이블 바디 - 반려 내역 목록을 map 함수로 순회하며 렌더링 */}
          {filtered_list.length === 0 ? (
            // 필터링 결과가 없는 경우 빈 상태 메시지 표시
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: '#848484',
                fontSize: '14px',
              }}
            >
              반려 내역이 없습니다.
            </div>
          ) : (
            filtered_list.map((item) => {
              const code_info = get_reject_code_info(item.reject_code);
              return (
                <div key={item.id} className={styles.table_row}>
                  {/* 캠페인 번호 */}
                  <div className={styles.table_cell}>
                    {item.campaign_number}
                  </div>

                  {/* 캠페인명 - 호버 시 전체 텍스트 표시 */}
                  <div
                    className={styles.table_cell_campaign_name}
                    title={item.campaign_name}
                  >
                    {item.campaign_name}
                  </div>

                  {/* 대상자 - 호버 시 전체 텍스트 표시 */}
                  <div className={styles.table_cell} title={item.target}>
                    {item.target}
                  </div>

                  {/* 검수자 */}
                  <div className={styles.table_cell}>{item.inspector}</div>

                  {/* 반려 코드 */}
                  <div className={styles.table_cell}>{item.reject_code}</div>

                  {/* 반려 사유 - 사유 확인하기 버튼만 표시 */}
                  <div
                    className={`${styles.table_cell} ${styles.table_cell_reject_reason}`}
                  >
                    <button
                      className={styles.reject_reason_button}
                      onClick={() => {
                        // TODO: 사유 확인하기 모달 또는 상세 페이지로 이동
                        alert(
                          `반려 사유: ${
                            item.reject_reason || code_info?.reason || '없음'
                          }`,
                        );
                      }}
                      aria-label={`${item.campaign_number} 반려 사유 확인하기`}
                    >
                      <span className={styles.reject_reason_icon}></span>
                      사유 확인하기
                    </button>
                  </div>

                  {/* 반려 횟수 */}
                  <div className={styles.table_cell}>{item.reject_count}회</div>

                  {/* 처리일 */}
                  <div className={styles.table_cell}>{item.processed_date}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
