/* ========================================
   🔍 필터 섹션 컴포넌트
   ======================================== */

/**
 * 필터 섹션 컴포넌트
 *
 * 목적: GA 관리자 진행 현황 페이지의 필터 옵션들을 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/progress (진행 현황 페이지)
 *
 * 주요 기능:
 * - 날짜 필터
 * - 검색 필터
 * - 상태 필터
 * - 유형 필터
 * - 채널 필터
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
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '@/styles/manager_ga/campaign/progress/filter_section.module.css';
import StatusFilterModal from '../filter/StatusFilterModal';
import TypeFilterModal from '../filter/TypeFilterModal';
import ChannelFilterModal, {
  channel_label_map,
} from '../filter/ChannelFilterModal';
import type { CampaignStatus } from '../filter/StatusFilterModal';
import type { CampaignType } from '../filter/TypeFilterModal';
import type { Channel } from '../filter/ChannelFilterModal';

export default function FilterSection() {
  /* ========================================
     📌 상태 관리 (State Management)
     ======================================== */

  // 상태 필터 모달 열림/닫힘 상태
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [is_status_modal_open, set_is_status_modal_open] = useState(false);

  // 선택된 상태들
  const [selected_statuses, set_selected_statuses] = useState<CampaignStatus[]>(
    [],
  );

  // 유형 필터 모달 열림/닫힘 상태
  const [is_type_modal_open, set_is_type_modal_open] = useState(false);

  // 선택된 유형들
  const [selected_types, set_selected_types] = useState<CampaignType[]>([]);

  // 채널 필터 모달 열림/닫힘 상태
  const [is_channel_modal_open, set_is_channel_modal_open] = useState(false);

  // 선택된 채널들
  const [selected_channels, set_selected_channels] = useState<Channel[]>([]);

  // 정렬 필터 드롭다운 열림/닫힘 상태
  const [is_sort_dropdown_open, set_is_sort_dropdown_open] = useState(false);

  // 선택된 정렬 옵션
  const [selected_sort, set_selected_sort] = useState<string>('최신순');

  // 정렬 드롭다운 컨테이너 참조
  const sort_dropdown_ref = useRef<HTMLDivElement>(null);

  // 정렬 옵션 목록
  const sort_options = ['최신순', '인기순', '마감임박순', '포인트높은순'];

  /* ========================================
     🛠️ 이벤트 핸들러 (Event Handlers)
     ======================================== */

  // 상태 필터 모달 열기
  const handle_status_filter_click = () => {
    set_is_status_modal_open(true);
  };

  // 상태 필터 모달 닫기
  const handle_status_modal_close = () => {
    set_is_status_modal_open(false);
  };

  // 상태 필터 적용
  const handle_status_apply = (statuses: CampaignStatus[]) => {
    set_selected_statuses(statuses);
    // TODO: 실제 필터링 로직 구현
  };

  // 상태 태그 제거 핸들러
  const handle_remove_status = (status: CampaignStatus) => {
    set_selected_statuses(selected_statuses.filter((s) => s !== status));
    // TODO: 필터링 로직 업데이트
  };

  // 유형 필터 모달 열기
  const handle_type_filter_click = () => {
    set_is_type_modal_open(true);
  };

  // 유형 필터 모달 닫기
  const handle_type_modal_close = () => {
    set_is_type_modal_open(false);
  };

  // 유형 필터 적용
  const handle_type_apply = (types: CampaignType[]) => {
    set_selected_types(types);
    // TODO: 실제 필터링 로직 구현
  };

  // 유형 태그 제거 핸들러
  const handle_remove_type = (type: CampaignType) => {
    set_selected_types(selected_types.filter((t) => t !== type));
    // TODO: 필터링 로직 업데이트
  };

  // 채널 필터 모달 열기
  const handle_channel_filter_click = () => {
    set_is_channel_modal_open(true);
  };

  // 채널 필터 모달 닫기
  const handle_channel_modal_close = () => {
    set_is_channel_modal_open(false);
  };

  // 채널 필터 적용
  const handle_channel_apply = (channels: Channel[]) => {
    set_selected_channels(channels);
    // TODO: 실제 필터링 로직 구현
  };

  // 채널 태그 제거 핸들러
  const handle_remove_channel = (channel: Channel) => {
    set_selected_channels(selected_channels.filter((c) => c !== channel));
    // TODO: 필터링 로직 업데이트
  };

  // 정렬 드롭다운 토글 핸들러
  const handle_sort_dropdown_toggle = () => {
    set_is_sort_dropdown_open(!is_sort_dropdown_open);
  };

  // 정렬 옵션 선택 핸들러
  const handle_sort_select = (sort: string) => {
    set_selected_sort(sort);
    set_is_sort_dropdown_open(false);
    // TODO: 정렬 로직 구현
  };

  // 외부 클릭 감지 (드롭다운 닫기)
  useEffect(() => {
    const handle_click_outside = (event: MouseEvent) => {
      if (
        sort_dropdown_ref.current &&
        !sort_dropdown_ref.current.contains(event.target as Node)
      ) {
        set_is_sort_dropdown_open(false);
      }
    };

    if (is_sort_dropdown_open) {
      document.addEventListener('mousedown', handle_click_outside);
    }

    return () => {
      document.removeEventListener('mousedown', handle_click_outside);
    };
  }, [is_sort_dropdown_open]);

  return (
    <div>
      <div className={styles.filter_section}>
        {/* 왼쪽 그룹: 날짜, 상태, 유형, 채널, 검색 필터 */}
        <div className={styles.filter_group_left}>
          {/* 날짜 필터 */}
          <div className={styles.filter_item}>
            <div className={styles.filter_icon}></div>
            <span className={styles.filter_text}>2025-10-01 ~ 2025-10-31</span>
          </div>

          {/* 상태 필터 */}
          <div
            className={styles.filter_item}
            onClick={handle_status_filter_click}
          >
            <div className={styles.checkbox_icon}></div>
            <span className={styles.filter_text}>상태</span>
            {/* 드롭다운 화살표 아이콘 */}
            <img
              src="/images/icons/dropdown_arrow.svg"
              alt="드롭다운"
              className={styles.dropdown_arrow}
            />
          </div>

          {/* 유형 필터 */}
          <div
            className={styles.filter_item}
            onClick={handle_type_filter_click}
          >
            <div className={styles.checkbox_icon}></div>
            <span className={styles.filter_text}>유형</span>
            {/* 드롭다운 화살표 아이콘 */}
            <img
              src="/images/icons/dropdown_arrow.svg"
              alt="드롭다운"
              className={styles.dropdown_arrow}
            />
          </div>

          {/* 채널 필터 */}
          <div
            className={styles.filter_item}
            onClick={handle_channel_filter_click}
          >
            <div className={styles.checkbox_icon}></div>
            <span className={styles.filter_text}>채널</span>
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

          {/* 정렬 필터 - 드롭다운 */}
          <div
            ref={sort_dropdown_ref}
            className={styles.sort_dropdown_container}
          >
            <div
              className={styles.filter_item}
              onClick={handle_sort_dropdown_toggle}
            >
              <span className={styles.filter_text}>{selected_sort}</span>
              {/* 드롭다운 화살표 아이콘 */}
              <img
                src="/images/icons/dropdown_arrow.svg"
                alt="드롭다운"
                className={`${styles.dropdown_arrow} ${
                  is_sort_dropdown_open ? styles.dropdown_arrow_rotated : ''
                }`}
              />
            </div>

            {/* 드롭다운 메뉴 */}
            {is_sort_dropdown_open && (
              <div className={styles.sort_dropdown_menu}>
                {sort_options.map((option) => (
                  <button
                    key={option}
                    className={`${styles.sort_dropdown_item} ${
                      selected_sort === option
                        ? styles.sort_dropdown_item_selected
                        : ''
                    }`}
                    onClick={() => handle_sort_select(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 상태 필터 모달 */}
        <StatusFilterModal
          is_open={is_status_modal_open}
          on_close={handle_status_modal_close}
          selected_statuses={selected_statuses}
          on_apply={handle_status_apply}
        />

        {/* 유형 필터 모달 */}
        <TypeFilterModal
          is_open={is_type_modal_open}
          on_close={handle_type_modal_close}
          selected_types={selected_types}
          on_apply={handle_type_apply}
        />

        {/* 채널 필터 모달 */}
        <ChannelFilterModal
          is_open={is_channel_modal_open}
          on_close={handle_channel_modal_close}
          selected_channels={selected_channels}
          on_apply={handle_channel_apply}
        />
      </div>

      {/* 활성 필터 태그 영역 */}
      {(selected_statuses.length > 0 ||
        selected_types.length > 0 ||
        selected_channels.length > 0) && (
        <div className={styles.active_filters}>
          {/* 상태 태그 */}
          {selected_statuses.map((status) => (
            <div key={`status-${status}`} className={styles.filter_tag}>
              <span className={styles.filter_tag_text}>{status}</span>
              <button
                className={styles.remove_tag}
                onClick={() => handle_remove_status(status)}
                aria-label={`${status} 필터 제거`}
              >
                <img
                  src="/images/filter/x_small.svg"
                  alt="제거"
                  className={styles.remove_icon}
                />
              </button>
            </div>
          ))}

          {/* 유형 태그 */}
          {selected_types.map((type) => (
            <div key={`type-${type}`} className={styles.filter_tag}>
              <span className={styles.filter_tag_text}>{type}</span>
              <button
                className={styles.remove_tag}
                onClick={() => handle_remove_type(type)}
                aria-label={`${type} 필터 제거`}
              >
                <img
                  src="/images/filter/x_small.svg"
                  alt="제거"
                  className={styles.remove_icon}
                />
              </button>
            </div>
          ))}

          {/* 채널 태그 */}
          {selected_channels.map((channel) => (
            <div key={`channel-${channel}`} className={styles.filter_tag}>
              <span className={styles.filter_tag_text}>
                {channel_label_map[channel]}
              </span>
              <button
                className={styles.remove_tag}
                onClick={() => handle_remove_channel(channel)}
                aria-label={`${channel_label_map[channel]} 필터 제거`}
              >
                <img
                  src="/images/filter/x_small.svg"
                  alt="제거"
                  className={styles.remove_icon}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
