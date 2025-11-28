/* ========================================
   🔍 유형 필터 모달 컴포넌트
   ======================================== */

/**
 * 유형 필터 모달 컴포넌트
 *
 * 목적: GA 관리자 진행 현황 페이지에서 캠페인 유형을 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - FilterSection 컴포넌트의 유형 필터에서 사용
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 유형 옵션: 배송형, 방문형, 구매평, 기자단, 미션형
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

// 캠페인 유형 타입 정의
export type CampaignType = '배송형' | '방문형' | '구매평' | '기자단' | '미션형';

interface TypeFilterModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  selected_types: CampaignType[]; // 현재 선택된 유형들
  on_apply: (types: CampaignType[]) => void; // 필터 적용 함수
}

// 유형 필터 옵션
const type_options: CampaignType[] = [
  '배송형',
  '방문형',
  '구매평',
  '기자단',
  '미션형',
];

export default function TypeFilterModal({
  is_open,
  on_close,
  selected_types,
  on_apply,
}: TypeFilterModalProps) {
  // 모달 내부에서 관리하는 임시 선택 상태
  const [temp_selected, set_temp_selected] =
    useState<CampaignType[]>(selected_types);

  // 모달이 열릴 때마다 임시 선택 상태를 초기화
  useEffect(() => {
    if (is_open) {
      set_temp_selected(selected_types);
    }
  }, [is_open, selected_types]);

  // 옵션 선택/해제 핸들러
  const handle_option_change = (type: CampaignType) => {
    if (temp_selected.includes(type)) {
      set_temp_selected(temp_selected.filter((t) => t !== type));
    } else {
      set_temp_selected([...temp_selected, type]);
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
          <h4 className={styles.section_title}>유형</h4>

          {/* 옵션 그리드 (2단 레이아웃) */}
          <div className={styles.options_grid}>
            {type_options.map((type) => (
              <label key={type} className={styles.option_item}>
                <input
                  type="checkbox"
                  value={type}
                  checked={temp_selected.includes(type)}
                  onChange={() => handle_option_change(type)}
                  className={styles.option_checkbox}
                />
                <span className={styles.option_label}>{type}</span>
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

