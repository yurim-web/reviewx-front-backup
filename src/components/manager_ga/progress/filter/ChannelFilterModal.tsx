/* ========================================
   🔍 채널 필터 모달 컴포넌트
   ======================================== */

/**
 * 채널 필터 모달 컴포넌트
 *
 * 목적: GA 관리자 진행 현황 페이지에서 캠페인 채널을 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - FilterSection 컴포넌트의 채널 필터에서 사용
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 채널 옵션: 네이버 블로그, 인스타그램, 유튜브, 클립, 릴스, 쇼츠
 * - 필터 적용/초기화 기능
 * - 모달 오버레이 클릭으로 닫기
 *
 * 학습 포인트:
 * - useState: 컴포넌트의 상태를 관리하는 React Hook입니다
 * - useEffect: 컴포넌트가 렌더링된 후에 실행되는 Hook입니다
 * - 이벤트 핸들러: 사용자 상호작용에 반응하는 함수입니다
 * - 배열 메서드: includes, filter 등을 사용하여 선택된 값들을 관리합니다
 */

'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/manager_ga/campaign/progress/status_filter_modal.module.css';

// 채널 타입 정의 (영문)
export type Channel =
  | 'Blog'
  | 'Clip'
  | 'Instagram'
  | 'Mission'
  | 'Reels'
  | 'Shorts'
  | 'Store'
  | 'Youtube';

// 채널 한글명 매핑 (export하여 다른 컴포넌트에서도 사용 가능)
export const channel_label_map: Record<Channel, string> = {
  Blog: '네이버 블로그',
  Instagram: '인스타그램',
  Youtube: '유튜브',
  Clip: '클립',
  Reels: '릴스',
  Shorts: '쇼츠',
  Mission: '미션',
  Store: '스토어',
};

interface ChannelFilterModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  selected_channels: Channel[]; // 현재 선택된 채널들
  on_apply: (channels: Channel[]) => void; // 필터 적용 함수
}

// 채널 필터 옵션
const channel_options: Channel[] = [
  'Blog',
  'Instagram',
  'Youtube',
  'Clip',
  'Reels',
  'Shorts',
];

export default function ChannelFilterModal({
  is_open,
  on_close,
  selected_channels,
  on_apply,
}: ChannelFilterModalProps) {
  // 모달 내부에서 관리하는 임시 선택 상태
  const [temp_selected, set_temp_selected] =
    useState<Channel[]>(selected_channels);

  // 모달이 열릴 때마다 임시 선택 상태를 초기화
  useEffect(() => {
    if (is_open) {
      set_temp_selected(selected_channels);
    }
  }, [is_open, selected_channels]);

  // 옵션 선택/해제 핸들러
  const handle_option_change = (channel: Channel) => {
    if (temp_selected.includes(channel)) {
      set_temp_selected(temp_selected.filter((c) => c !== channel));
    } else {
      set_temp_selected([...temp_selected, channel]);
    }
  };

  // 필터 적용 핸들러
  const handle_apply = () => {
    on_apply(temp_selected);
    on_close();
  };

  // 선택 초기화 핸들러
  const handle_reset = () => {
    set_temp_selected([]);
  };

  // 모달 오버레이 클릭 핸들러
  const handle_backdrop_click = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      on_close();
    }
  };

  if (!is_open) return null;

  return (
    <div className={styles.modal_overlay} onClick={handle_backdrop_click}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className={styles.modal_header}>
          <h3 className={styles.modal_title}>필터</h3>
          <button className={styles.modal_close_button} onClick={on_close}>
            <img src="/images/filter/x_icon.svg" alt="닫기" />
          </button>
        </div>

        {/* 모달 바디 */}
        <div className={styles.modal_body}>
          {/* 섹션 제목 */}
          <h4 className={styles.section_title}>채널</h4>

          {/* 옵션 그리드 (2단 레이아웃) */}
          <div className={styles.options_grid}>
            {channel_options.map((channel) => (
              <label key={channel} className={styles.option_item}>
                <input
                  type="checkbox"
                  value={channel}
                  checked={temp_selected.includes(channel)}
                  onChange={() => handle_option_change(channel)}
                  className={styles.option_checkbox}
                />
                <span className={styles.option_label}>
                  {channel_label_map[channel]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className={styles.modal_footer}>
          <button className={styles.apply_button} onClick={handle_apply}>
            필터 적용하기
          </button>
          <button className={styles.reset_button} onClick={handle_reset}>
            <div className={styles.reset_icon}></div>
            선택 초기화
          </button>
        </div>
      </div>
    </div>
  );
}
