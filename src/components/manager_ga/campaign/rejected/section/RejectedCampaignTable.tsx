/* ========================================
   📋 반려내역 테이블 컴포넌트
   ======================================== */

/**
 * 반려내역 테이블 컴포넌트
 *
 * 목적: GA 관리자 반려내역 페이지의 반려 내역 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/rejected (반려내역 페이지)
 *
 * 주요 기능:
 * - 반려 내역 목록을 테이블로 표시합니다
 * - 검색어와 반려 코드 필터를 적용합니다
 * - 사유 확인하기 버튼을 제공합니다
 *
 */

'use client';

import { useState, useRef } from 'react';
import styles from '@/styles/manager_ga/campaign/rejected_table.module.css';
import {
  rejected_campaign_list,
  reject_code_info,
  type RejectedCampaignItem,
  type RejectCodeInfo,
  type RejectCode,
} from '@/data/manager_ga/rejected';
import RejectReasonModal from '../modal/RejectReasonModal';
import CampaignReportModal from '@/components/manager_ga/campaign/progress/modal/CampaignReportModal';
import type { ReportCode } from '@/data/manager_ga/reported';

interface RejectedCampaignTableProps {
  // 검색어 상태와 변경 함수를 props로 받습니다
  search_query: string;
  // 반려 코드 필터 상태를 props로 받습니다 (배열로 변경)
  selected_reject_codes: RejectCode[];
}

export default function RejectedCampaignTable({
  search_query,
  selected_reject_codes,
}: RejectedCampaignTableProps) {
  // 호버된 행의 ID를 관리하는 상태 (툴팁용)
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [hovered_row_id, set_hovered_row_id] = useState<string | null>(null);

  // 호버된 행의 ID를 관리하는 상태 (신고 아이콘용)
  const [hovered_report_row_id, set_hovered_report_row_id] = useState<
    string | null
  >(null);

  // 반려 사유 모달 상태 관리
  // 모달이 열려있는지, 어떤 항목의 모달인지 관리합니다
  const [modal_state, set_modal_state] = useState<{
    is_open: boolean;
    item: RejectedCampaignItem | null;
  }>({
    is_open: false,
    item: null,
  });

  // 신고 모달 상태 관리
  // 신고 모달이 열려있는지, 어떤 항목의 신고 모달인지 관리합니다
  const [report_modal_state, set_report_modal_state] = useState<{
    is_open: boolean;
    campaign_id: string | null;
  }>({
    is_open: false,
    campaign_id: null,
  });

  // 툴팁 위치 정보를 관리하는 상태
  // 캠페인명 셀의 위치, 너비, 높이를 저장하여 툴팁을 정확한 위치에 표시합니다
  const [tooltip_position, set_tooltip_position] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  // 각 행의 캠페인명 텍스트 ref를 저장하는 객체
  // useRef는 DOM 요소에 직접 접근할 수 있게 해주는 React Hook입니다
  const campaign_name_refs = useRef<{ [key: string]: HTMLSpanElement | null }>(
    {},
  );

  // 반려 코드 정보를 코드로 찾는 함수
  const get_reject_code_info = (code: string): RejectCodeInfo | undefined => {
    return reject_code_info.find((info) => info.code === code);
  };

  // 텍스트가 잘렸는지 확인하는 함수
  // scrollWidth: 요소의 실제 내용 너비 (스크롤 포함)
  // clientWidth: 요소의 보이는 너비 (스크롤 제외)
  // scrollWidth > clientWidth이면 텍스트가 잘린 것입니다
  // 약간의 여유(1px)를 두어 더 안정적으로 체크합니다
  const is_text_overflow = (element: HTMLSpanElement | null): boolean => {
    if (!element) return false;
    return element.scrollWidth > element.clientWidth + 1;
  };

  // 캠페인명 텍스트 호버 이벤트 핸들러
  // 마우스가 캠페인명 텍스트 위에 올라갔을 때 호출됩니다
  const handle_campaign_name_mouse_enter = (
    item_id: string,
    event: React.MouseEvent<HTMLSpanElement>,
  ) => {
    const campaign_name_element = event.currentTarget;

    // 텍스트가 잘린 경우에만 툴팁 표시
    if (is_text_overflow(campaign_name_element)) {
      set_hovered_row_id(item_id);

      // 캠페인명 셀의 위치와 너비를 계산하여 툴팁 위치 설정
      const rect = campaign_name_element.getBoundingClientRect();
      // 테이블 행 래퍼의 위치를 기준으로 상대 위치 계산
      const row_wrapper = campaign_name_element.closest(
        `.${styles.table_row_wrapper}`,
      );
      if (row_wrapper) {
        const wrapper_rect = row_wrapper.getBoundingClientRect();
        set_tooltip_position({
          left: rect.left - wrapper_rect.left,
          top: rect.bottom - wrapper_rect.top + 4, // 캠페인명 셀의 아래쪽 위치에서 10px 위로
          width: rect.width,
        });
      }
    }
  };

  // 캠페인명 셀에서 마우스가 벗어났을 때 호출됩니다
  const handle_campaign_name_mouse_leave = () => {
    set_hovered_row_id(null);
    set_tooltip_position(null);
  };

  // 신고 아이콘 클릭 핸들러
  // 신고 아이콘을 클릭했을 때 신고 모달을 엽니다
  const handle_report_click = (campaign_id: string) => {
    set_report_modal_state({
      is_open: true,
      campaign_id,
    });
  };

  // 신고 모달 닫기 핸들러
  // 신고 모달을 닫을 때 호출됩니다
  const handle_report_modal_close = () => {
    set_report_modal_state({
      is_open: false,
      campaign_id: null,
    });
  };

  // 신고 완료 핸들러
  // 신고 모달에서 신고 버튼을 클릭했을 때 호출됩니다
  const handle_report_submit = (report_code: ReportCode) => {
    // TODO: 실제 신고 로직 구현
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

    // 반려 코드 필터: 선택된 반려 코드가 있으면 해당 코드들만 표시
    if (
      selected_reject_codes.length > 0 &&
      !selected_reject_codes.includes(item.reject_code)
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className={styles.table_section}>
      {/* 테이블 헤더 */}
      <div className={styles.table_header}>
        {/* 캠페인 번호 - 화살표 아이콘 포함 */}
        <div className={styles.table_header_cell}>
          <span>캠페인 번호</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.table_header_arrow}
          />
        </div>
        {/* 캠페인명 - 텍스트 정렬을 위해 span으로 감싸기 */}
        <div className={styles.table_header_cell}>
          <span>캠페인명</span>
        </div>
        {/* 대상자 - 텍스트 정렬을 위해 span으로 감싸기 */}
        <div className={styles.table_header_cell}>
          <span>대상자</span>
        </div>
        {/* 검수자 - 텍스트 정렬을 위해 span으로 감싸기 */}
        <div className={styles.table_header_cell}>
          <span>검수자</span>
        </div>
        {/* 반려 코드 - 텍스트 정렬을 위해 span으로 감싸기 */}
        <div className={styles.table_header_cell}>
          <span>반려 코드</span>
        </div>
        {/* 반려 사유 - 텍스트 정렬을 위해 span으로 감싸기 */}
        <div className={styles.table_header_cell}>
          <span>반려 사유</span>
        </div>
        {/* 반려 횟수 - 화살표 아이콘 포함 */}
        <div className={styles.table_header_cell}>
          <span>반려 횟수</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.table_header_arrow}
          />
        </div>
        {/* 처리일 - 화살표 아이콘 포함 */}
        <div className={styles.table_header_cell}>
          <span>처리일</span>
          <img
            src="/images/icons/table_arrow.svg"
            alt="정렬"
            className={styles.table_header_arrow}
          />
        </div>
        {/* 신고 아이콘 칸 - 헤더는 빈 칸으로 표시 */}
        <div className={styles.table_header_cell_report}></div>
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
        filtered_list.map((item: RejectedCampaignItem) => {
          const code_info = get_reject_code_info(item.reject_code);
          const is_hovered = hovered_row_id === item.id;
          const is_report_hovered = hovered_report_row_id === item.id;
          return (
            <div
              key={item.id}
              className={styles.table_row_wrapper}
              onMouseEnter={() => set_hovered_report_row_id(item.id)}
              onMouseLeave={() => set_hovered_report_row_id(null)}
            >
              {/* 테이블 행 */}
              <div className={styles.table_row}>
                {/* 캠페인 번호 */}
                <div className={styles.table_cell}>{item.campaign_number}</div>

                {/* 캠페인명 - 텍스트가 잘리는 경우를 대비 */}
                <div className={styles.table_cell_campaign_name}>
                  <span
                    ref={(el) => {
                      campaign_name_refs.current[item.id] = el;
                    }}
                    className={styles.campaign_name_text}
                    onMouseEnter={(e) =>
                      handle_campaign_name_mouse_enter(item.id, e)
                    }
                    onMouseLeave={handle_campaign_name_mouse_leave}
                  >
                    {item.campaign_name}
                  </span>
                </div>

                {/* 대상자 */}
                <div className={styles.table_cell}>{item.target}</div>

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
                      // 모달 열기
                      set_modal_state({
                        is_open: true,
                        item: item,
                      });
                    }}
                    aria-label={`${item.campaign_number} 반려 사유 확인`}
                  >
                    <img
                      src="/images/management_page/cancel_info.svg"
                      alt="반려 사유 정보"
                      className={styles.reject_reason_icon}
                    />
                    사유 확인
                  </button>
                </div>

                {/* 반려 횟수 */}
                <div className={styles.table_cell}>{item.reject_count}회</div>

                {/* 처리일 */}
                <div className={styles.table_cell}>{item.processed_date}</div>

                {/* 신고 아이콘 칸 - 호버 시에만 표시 */}
                <div className={styles.table_cell_report}>
                  {is_report_hovered && (
                    <button
                      onClick={() => handle_report_click(item.id)}
                      className={styles.report_button}
                      aria-label={`${item.campaign_name} 신고`}
                    >
                      <img
                        src="/images/icons/table_report.svg"
                        alt="신고"
                        className={styles.report_icon}
                      />
                    </button>
                  )}
                </div>
              </div>

              {/* 호버 시 나타나는 툴팁 박스 - 캠페인명 셀 바로 아래에 표시 */}
              {is_hovered && tooltip_position && (
                <div
                  className={styles.tooltip_box}
                  style={{
                    left: `${tooltip_position.left}px`,
                    top: `${tooltip_position.top}px`,
                  }}
                >
                  {item.campaign_name}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* 반려 사유 모달 */}
      {modal_state.item && (
        <RejectReasonModal
          is_open={modal_state.is_open}
          on_close={() => {
            set_modal_state({
              is_open: false,
              item: null,
            });
          }}
          reject_reason={
            modal_state.item.reject_reason ||
            get_reject_code_info(modal_state.item.reject_code)?.reason ||
            '반려 사유가 없습니다.'
          }
          reject_code={modal_state.item.reject_code}
        />
      )}

      {/* 신고 모달 */}
      <CampaignReportModal
        is_open={report_modal_state.is_open}
        on_close={handle_report_modal_close}
        campaign_id={report_modal_state.campaign_id || undefined}
        on_report={handle_report_submit}
      />
    </div>
  );
}
