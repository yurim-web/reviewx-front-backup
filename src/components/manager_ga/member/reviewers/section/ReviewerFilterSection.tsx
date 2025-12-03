/* ========================================
   🔍 리뷰어 필터 섹션 컴포넌트
   ======================================== */

/**
 * 리뷰어 필터 섹션 컴포넌트
 *
 * 목적: 리뷰어 목록을 필터링하기 위한 필터 버튼들을 표시하는 섹션입니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers (리뷰어 목록 페이지)
 *
 * 주요 기능:
 * - 채널 필터
 * - 등급 필터
 * - 유형 필터
 * - 상태 필터
 * - 검색 필터
 * - 정렬 필터 (최신순)
 * - 차단 버튼
 * - 리뷰어 목록 다운로드 버튼
 *
 * 학습 포인트:
 * - 이벤트 핸들러: onClick으로 버튼 클릭 이벤트를 처리합니다
 * - 상태 관리: useState를 사용하여 필터 상태를 관리합니다
 * - 조건부 렌더링: 선택된 필터에 따라 UI를 변경합니다
 */

'use client';

import { useState } from 'react';
import styles from '@/styles/manager_ga/member/reviewers/reviewer_filter_section.module.css';
import BaseFilterSection, {
  type FilterTag,
} from '@/components/manager_ga/common/filter/BaseFilterSection';
import ChannelFilterModal from '@/components/manager_ga/member/reviewers/filter/ChannelFilterModal';
import GradeFilterModal from '@/components/manager_ga/member/reviewers/filter/GradeFilterModal';
import TypeFilterModal from '@/components/manager_ga/member/reviewers/filter/TypeFilterModal';
import StatusFilterModal from '@/components/manager_ga/member/reviewers/filter/StatusFilterModal';
import type {
  Channel,
  ReviewerStatusType,
  ReviewerType,
  ReviewerStatus,
} from '@/data/manager_ga/member/reviewers';

interface ReviewerFilterSectionProps {
  search_query: string;
  on_search_change: (query: string) => void;
}

export default function ReviewerFilterSection({
  search_query,
  on_search_change,
}: ReviewerFilterSectionProps) {
  // 필터 모달 열림/닫힘 상태 관리
  const [is_channel_modal_open, set_is_channel_modal_open] = useState(false);
  const [is_grade_modal_open, set_is_grade_modal_open] = useState(false);
  const [is_type_modal_open, set_is_type_modal_open] = useState(false);
  const [is_status_modal_open, set_is_status_modal_open] = useState(false);

  // 선택된 필터 상태 관리
  const [selected_channels, set_selected_channels] = useState<Channel[]>([]);
  const [selected_grades, set_selected_grades] = useState<ReviewerStatusType[]>(
    [],
  );
  const [selected_types, set_selected_types] = useState<ReviewerType[]>([]);
  const [selected_statuses, set_selected_statuses] = useState<ReviewerStatus[]>(
    [],
  );
  const [selected_sort, set_selected_sort] = useState('최신순');

  // 채널 필터 핸들러
  const handle_channel_apply = (channels: Channel[]) => {
    set_selected_channels(channels);
  };

  const handle_remove_channel = (channel: Channel) => {
    set_selected_channels(selected_channels.filter((c) => c !== channel));
  };

  // 등급 필터 핸들러
  const handle_grade_apply = (grades: ReviewerStatusType[]) => {
    set_selected_grades(grades);
  };

  const handle_remove_grade = (grade: ReviewerStatusType) => {
    set_selected_grades(selected_grades.filter((g) => g !== grade));
  };

  // 유형 필터 핸들러
  const handle_type_apply = (types: ReviewerType[]) => {
    set_selected_types(types);
  };

  const handle_remove_type = (type: ReviewerType) => {
    set_selected_types(selected_types.filter((t) => t !== type));
  };

  // 상태 필터 핸들러
  const handle_status_apply = (statuses: ReviewerStatus[]) => {
    set_selected_statuses(statuses);
  };

  const handle_remove_status = (status: ReviewerStatus) => {
    set_selected_statuses(selected_statuses.filter((s) => s !== status));
  };

  // 정렬 옵션
  const sort_options = ['최신순', '오래된순'];

  // 정렬 옵션 선택 핸들러
  const handle_sort_change = (sort: string) => {
    set_selected_sort(sort);
    // TODO: 정렬 로직 구현
  };

  // 채널 이름 매핑
  const channel_name_map: Record<Channel, string> = {
    Blog: '네이버 블로그',
    Clip: '네이버 클립',
    Instagram: '인스타그램',
    Youtube: '유튜브',
    Store: '네이버 스토어',
  };

  // 활성 필터 태그 목록 생성
  const active_filter_tags: FilterTag<string>[] = [
    ...selected_channels.map((channel) => ({
      value: channel,
      label: channel_name_map[channel],
    })),
    ...selected_grades.map((grade) => ({ value: grade, label: grade })),
    ...selected_types.map((type) => ({ value: type, label: type })),
    ...selected_statuses.map((status) => ({ value: status, label: status })),
  ];

  // 필터 태그 제거 핸들러
  const handle_filter_tag_remove = (value: string) => {
    if (selected_channels.includes(value as Channel)) {
      handle_remove_channel(value as Channel);
    } else if (selected_grades.includes(value as ReviewerStatusType)) {
      handle_remove_grade(value as ReviewerStatusType);
    } else if (selected_types.includes(value as ReviewerType)) {
      handle_remove_type(value as ReviewerType);
    } else if (selected_statuses.includes(value as ReviewerStatus)) {
      handle_remove_status(value as ReviewerStatus);
    }
  };

  return (
    <div>
      {/* BaseFilterSection 공통 컴포넌트 사용 */}
      <BaseFilterSection<string>
        search_query={search_query}
        on_search_change={on_search_change}
        selected_sort={selected_sort}
        on_sort_change={handle_sort_change}
        sort_options={sort_options}
        // 필터 모달 버튼들
        filter_modal_button={
          <>
            {/* 채널 필터 */}
            <div
              className={styles.filter_item}
              onClick={() => set_is_channel_modal_open(true)}
            >
              <div
                className={`${styles.checkbox_icon} ${
                  selected_channels.length > 0
                    ? styles.checkbox_icon_checked
                    : ''
                }`}
              ></div>
              <span className={styles.filter_text}>채널</span>
              <img
                src="/images/icons/dropdown_arrow.svg"
                alt="드롭다운"
                className={styles.dropdown_arrow}
              />
            </div>

            {/* 등급 필터 */}
            <div
              className={styles.filter_item}
              onClick={() => set_is_grade_modal_open(true)}
            >
              <div
                className={`${styles.checkbox_icon} ${
                  selected_grades.length > 0 ? styles.checkbox_icon_checked : ''
                }`}
              ></div>
              <span className={styles.filter_text}>등급</span>
              <img
                src="/images/icons/dropdown_arrow.svg"
                alt="드롭다운"
                className={styles.dropdown_arrow}
              />
            </div>

            {/* 유형 필터 */}
            <div
              className={styles.filter_item}
              onClick={() => set_is_type_modal_open(true)}
            >
              <div
                className={`${styles.checkbox_icon} ${
                  selected_types.length > 0 ? styles.checkbox_icon_checked : ''
                }`}
              ></div>
              <span className={styles.filter_text}>유형</span>
              <img
                src="/images/icons/dropdown_arrow.svg"
                alt="드롭다운"
                className={styles.dropdown_arrow}
              />
            </div>

            {/* 상태 필터 */}
            <div
              className={styles.filter_item}
              onClick={() => set_is_status_modal_open(true)}
            >
              <div
                className={`${styles.checkbox_icon} ${
                  selected_statuses.length > 0
                    ? styles.checkbox_icon_checked
                    : ''
                }`}
              ></div>
              <span className={styles.filter_text}>상태</span>
              <img
                src="/images/icons/dropdown_arrow.svg"
                alt="드롭다운"
                className={styles.dropdown_arrow}
              />
            </div>

            {/* 리뷰어 목록 다운로드 버튼 */}
            <div className={styles.filter_item}>
              <img
                src="/images/excel_icon.png"
                alt="다운로드"
                className={styles.download_icon}
              />
              <span className={styles.filter_text}>리뷰어 목록 다운로드</span>
            </div>
          </>
        }
        // 오른쪽 액션 버튼 (차단)
        right_action_buttons={[
          <div key="block" className={styles.filter_item}>
            <img
              src="/images/icons/rerport_icon.svg"
              alt="차단"
              className={styles.report_icon}
            />
            <span className={styles.filter_text}>차단</span>
          </div>,
        ]}
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
      />

      {/* 필터 모달들 */}
      <ChannelFilterModal
        is_open={is_channel_modal_open}
        on_close={() => set_is_channel_modal_open(false)}
        selected_channels={selected_channels}
        on_apply={handle_channel_apply}
      />

      <GradeFilterModal
        is_open={is_grade_modal_open}
        on_close={() => set_is_grade_modal_open(false)}
        selected_grades={selected_grades}
        on_apply={handle_grade_apply}
      />

      <TypeFilterModal
        is_open={is_type_modal_open}
        on_close={() => set_is_type_modal_open(false)}
        selected_types={selected_types}
        on_apply={handle_type_apply}
      />

      <StatusFilterModal
        is_open={is_status_modal_open}
        on_close={() => set_is_status_modal_open(false)}
        selected_statuses={selected_statuses}
        on_apply={handle_status_apply}
      />
    </div>
  );
}
