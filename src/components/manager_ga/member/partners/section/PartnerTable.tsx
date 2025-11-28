/* ========================================
   📋 파트너 목록 테이블 컴포넌트
   ======================================== */

/**
 * 파트너 목록 테이블 컴포넌트
 *
 * 목적: GA 관리자 파트너 목록 페이지의 파트너 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/member/partners (파트너 목록 페이지)
 *
 * 주요 기능:
 * - 파트너 목록을 테이블로 표시합니다
 * - 검색어 필터를 적용합니다
 * - 체크박스로 파트너를 선택할 수 있습니다
 * - 사업자등록번호·대표자명을 표시합니다
 * - 파트너 구분 태그를 표시합니다 (법인/개인)
 * - 파트너 상태를 표시합니다
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
import styles from '@/styles/manager_ga/member/partners/partner_table.module.css';
import {
  partner_list,
  type PartnerItem,
  type PartnerDivision,
  type PartnerStatus,
  type PartnerStatusType,
} from '@/data/manager_ga/member/partners';

interface PartnerTableProps {
  // 검색어 상태를 props로 받습니다
  search_query: string;
}

// 파트너 구분 태그 스타일 매핑
const partner_division_style_map: Record<PartnerDivision, string> = {
  법인: styles.division_tag_corporate,
  개인: styles.division_tag_individual,
};

// 파트너 상태 태그 스타일 매핑
const partner_status_style_map: Record<PartnerStatus, string> = {
  정상: styles.status_tag_normal,
  '일시 정지': styles.status_tag_suspended,
  '영구 정지': styles.status_tag_permanent,
};

export default function PartnerTable({ search_query }: PartnerTableProps) {
  // Next.js의 useRouter 훅을 사용하여 페이지 이동 기능 가져오기
  // useRouter: Next.js에서 제공하는 클라이언트 사이드 라우팅 훅입니다
  const router = useRouter();

  // 선택된 파트너 ID 목록 상태 관리
  const [selected_partner_ids, set_selected_partner_ids] = useState<string[]>(
    [],
  );

  // 전체 선택/해제 상태 관리
  const [is_all_selected, set_is_all_selected] = useState(false);

  // 검색어로 필터링된 파트너 목록
  const filtered_partners = partner_list.filter((partner) => {
    if (!search_query) return true;
    // 상호명으로 검색
    return partner.business_name
      .toLowerCase()
      .includes(search_query.toLowerCase());
  });

  // 개별 체크박스 토글 핸들러
  const handle_checkbox_toggle = (partner_id: string) => {
    set_selected_partner_ids((prev) => {
      if (prev.includes(partner_id)) {
        // 이미 선택된 경우 제거
        return prev.filter((id) => id !== partner_id);
      } else {
        // 선택되지 않은 경우 추가
        return [...prev, partner_id];
      }
    });
  };

  // 전체 선택/해제 핸들러
  const handle_select_all = () => {
    if (is_all_selected) {
      // 전체 해제
      set_selected_partner_ids([]);
      set_is_all_selected(false);
    } else {
      // 전체 선택
      set_selected_partner_ids(filtered_partners.map((p) => p.id));
      set_is_all_selected(true);
    }
  };

  // 숫자를 천 단위로 포맷팅하는 함수
  const format_number = (num: number): string => {
    return num.toLocaleString();
  };

  // 파트너 행 클릭 핸들러
  // 테이블 행을 클릭하면 해당 파트너의 디테일 페이지로 이동합니다
  const handle_row_click = (partner_id: string) => {
    // router.push: Next.js에서 제공하는 페이지 이동 함수입니다
    // `/manager_ga/member/partners/${partner_id}` 경로로 이동합니다
    router.push(`/manager_ga/member/partners/${partner_id}`);
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
        <div className={styles.table_cell_business_name}>
          <span>상호명</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.sort_icon}
          />
        </div>
        <div className={styles.table_cell_division}>
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
        <div className={styles.table_cell_campaign_in_progress}>
          <span>캠페인 진행</span>
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
        <div className={styles.table_cell_used_points}>
          <span>사용 포인트</span>
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
        {filtered_partners.length === 0 ? (
          <div className={styles.empty_message}>파트너가 없습니다.</div>
        ) : (
          filtered_partners.map((partner) => {
            const is_selected = selected_partner_ids.includes(partner.id);
            return (
              <div
                key={partner.id}
                className={styles.table_row}
                onClick={() => handle_row_click(partner.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  // 키보드 접근성: Enter 키나 Space 키를 누르면 클릭과 동일하게 동작합니다
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handle_row_click(partner.id);
                  }
                }}
                aria-label={`${partner.business_name} 파트너 상세 정보 보기`}
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
                    onChange={() => handle_checkbox_toggle(partner.id)}
                    className={styles.checkbox}
                  />
                </div>

                {/* 번호 */}
                <div className={styles.table_cell_number}>{partner.number}</div>

                {/* 상호명 */}
                <div className={styles.table_cell_business_name}>
                  <div className={styles.business_name_wrapper}>
                    <div className={styles.business_name_row}>
                      <span className={styles.business_name_text}>
                        {partner.business_name}
                      </span>
                      <button
                        className={styles.download_info_button}
                        onClick={() => {
                          // TODO: 사업자 정보 다운로드 기능 구현
                        }}
                        aria-label={`${partner.business_name} 사업자 정보 다운로드`}
                      >
                        <img
                          src="/images/icons/table_download.svg"
                          alt="다운로드"
                          className={styles.download_info_icon}
                        />
                      </button>
                    </div>
                    <span className={styles.business_info_text}>
                      {partner.business_number} · {partner.representative_name}
                    </span>
                  </div>
                </div>

                {/* 구분 (법인/개인) */}
                <div className={styles.table_cell_division}>
                  <span
                    className={`${styles.division_tag} ${
                      partner_division_style_map[partner.division]
                    }`}
                  >
                    {partner.division}
                  </span>
                </div>

                {/* 접속일 */}
                <div className={styles.table_cell_last_access}>
                  {partner.last_access_date}
                </div>

                {/* 가입일 */}
                <div className={styles.table_cell_join_date}>
                  {partner.join_date}
                </div>

                {/* 캠페인 진행 */}
                <div className={styles.table_cell_campaign_in_progress}>
                  {format_number(partner.campaign_in_progress)}회
                </div>

                {/* 캠페인 완료 */}
                <div className={styles.table_cell_campaign_completed}>
                  {format_number(partner.campaign_completed)}회
                </div>

                {/* 보유 포인트 */}
                <div className={styles.table_cell_current_points}>
                  {format_number(partner.current_points)}
                </div>

                {/* 사용 포인트 */}
                <div className={styles.table_cell_used_points}>
                  {format_number(partner.used_points)}
                </div>

                {/* 유형 (상태 유형) */}
                <div className={styles.table_cell_status_type}>
                  {partner.status_type}
                </div>

                {/* 상태 */}
                <div className={styles.table_cell_status}>
                  <span
                    className={`${styles.status_tag} ${
                      partner_status_style_map[partner.status]
                    }`}
                  >
                    {partner.status}
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
