/* ========================================
   🔍 필터 섹션 컴포넌트
   ======================================== */

/**
 * 필터 섹션 컴포넌트
 *
 * 목적: GA 관리자 진행 현황 페이지의 필터 옵션들을 표시합니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/progress (진행 현황 페이지)
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

import { useState } from 'react';
import styles from '@/styles/manager_ga/campaign/progress/filter_section.module.css';
import BaseFilterSection, {
  type FilterTag,
} from '@/components/manager_ga/common/filter/BaseFilterSection';
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

  // 검색어 상태
  const [search_query, set_search_query] = useState('');

  // 상태 필터 모달 열림/닫힘 상태
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

  // 선택된 정렬 옵션
  const [selected_sort, set_selected_sort] = useState<string>('최신순');

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

  // 정렬 옵션 선택 핸들러
  const handle_sort_select = (sort: string) => {
    set_selected_sort(sort);
    // TODO: 정렬 로직 구현
  };

  // 활성 필터 태그 목록 생성
  const active_filter_tags: FilterTag<string>[] = [
    ...selected_statuses.map((status) => ({ value: status, label: status })),
    ...selected_types.map((type) => ({ value: type, label: type })),
    ...selected_channels.map((channel) => ({
      value: channel,
      label: channel_label_map[channel],
    })),
  ];

  // 필터 태그 제거 핸들러
  const handle_filter_tag_remove = (value: string) => {
    // 상태 필터 태그인지 확인
    if (selected_statuses.includes(value as CampaignStatus)) {
      handle_remove_status(value as CampaignStatus);
    }
    // 유형 필터 태그인지 확인
    else if (selected_types.includes(value as CampaignType)) {
      handle_remove_type(value as CampaignType);
    }
    // 채널 필터 태그인지 확인
    else if (selected_channels.includes(value as Channel)) {
      handle_remove_channel(value as Channel);
    }
  };

  return (
    <div>
      {/* BaseFilterSection 공통 컴포넌트 사용 */}
      <BaseFilterSection<string>
        search_query={search_query}
        on_search_change={set_search_query}
        selected_sort={selected_sort}
        on_sort_change={handle_sort_select}
        sort_options={sort_options}
        // 날짜 필터
        date_filter={
          <div className={styles.filter_item}>
            <div className={styles.filter_icon}></div>
            <span className={styles.filter_text}>2025-10-01 ~ 2025-10-31</span>
          </div>
        }
        // 필터 모달 버튼들 (여러 개를 Fragment로 묶어서 전달)
        filter_modal_button={
          <>
            {/* 상태 필터 */}
            <div
              className={styles.filter_item}
              onClick={handle_status_filter_click}
            >
              <div className={styles.checkbox_icon}></div>
              <span className={styles.filter_text}>상태</span>
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
              <img
                src="/images/icons/dropdown_arrow.svg"
                alt="드롭다운"
                className={styles.dropdown_arrow}
              />
            </div>
          </>
        }
        // 오른쪽 액션 버튼 (신고 필터)
        right_action_buttons={[
          <div key="report" className={styles.filter_item}>
            <img
              src="/images/icons/rerport_icon.svg"
              alt="신고"
              className={styles.report_icon}
            />
            <span className={styles.filter_text}>신고</span>
          </div>,
        ]}
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
      />

      {/* 필터 모달들 */}
      <StatusFilterModal
        is_open={is_status_modal_open}
        on_close={handle_status_modal_close}
        selected_statuses={selected_statuses}
        on_apply={handle_status_apply}
      />

      <TypeFilterModal
        is_open={is_type_modal_open}
        on_close={handle_type_modal_close}
        selected_types={selected_types}
        on_apply={handle_type_apply}
      />

      <ChannelFilterModal
        is_open={is_channel_modal_open}
        on_close={handle_channel_modal_close}
        selected_channels={selected_channels}
        on_apply={handle_channel_apply}
      />
    </div>
  );
}

