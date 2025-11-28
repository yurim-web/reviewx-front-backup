/* ========================================
   🔍 상태 필터 모달 컴포넌트
   ======================================== */

/**
 * 상태 필터 모달 컴포넌트
 *
 * 목적: GA 관리자 진행 현황 페이지에서 캠페인 상태를 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - FilterSection 컴포넌트의 상태 필터에서 사용
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 상태 옵션: 예정, 신청, 진행, 종료, 긴급
 * - 필터 적용/초기화 기능
 * - 모달 오버레이 클릭으로 닫기
 *
 * 학습 포인트:
 * - useState: 컴포넌트의 상태를 관리하는 React Hook입니다
 * - 이벤트 핸들러: 사용자 상호작용에 반응하는 함수입니다
 * - 조건부 렌더링: 조건에 따라 다른 내용을 렌더링합니다
 * - 배열 메서드: includes, filter 등을 사용하여 선택된 값들을 관리합니다
 */

'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/manager_ga/campaign/progress/status_filter_modal.module.css';

// 캠페인 상태 타입 정의
export type CampaignStatus = '예정' | '신청' | '진행' | '종료' | '긴급';

interface StatusFilterModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  selected_statuses: CampaignStatus[]; // 현재 선택된 상태들
  on_apply: (statuses: CampaignStatus[]) => void; // 필터 적용 함수
}

// 상태 필터 옵션
const status_options: CampaignStatus[] = [
  '예정',
  '신청',
  '진행',
  '종료',
  '긴급',
];

export default function StatusFilterModal({
  is_open,
  on_close,
  selected_statuses,
  on_apply,
}: StatusFilterModalProps) {
  // 모달 내부에서 관리하는 임시 선택 상태
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] 형태로 반환됩니다
  const [temp_selected, set_temp_selected] =
    useState<CampaignStatus[]>(selected_statuses);

  // 모달이 열릴 때마다 임시 선택 상태를 초기화
  // useEffect는 React의 Hook으로, 컴포넌트가 렌더링된 후에 실행됩니다
  // 의존성 배열 [is_open, selected_statuses]: 이 값들이 변경될 때마다 함수가 실행됩니다
  useEffect(() => {
    if (is_open) {
      // 모달이 열릴 때: 현재 선택된 상태로 초기화
      set_temp_selected(selected_statuses);
    }
  }, [is_open, selected_statuses]);

  // 옵션 선택/해제 핸들러
  // 체크박스를 클릭했을 때 호출되는 함수입니다
  const handle_option_change = (status: CampaignStatus) => {
    // 배열의 includes 메서드: 배열에 특정 값이 포함되어 있는지 확인합니다
    if (temp_selected.includes(status)) {
      // 이미 선택된 경우: 배열에서 제거
      // filter 메서드: 조건에 맞는 요소만 남긴 새로운 배열을 반환합니다
      set_temp_selected(temp_selected.filter((s) => s !== status));
    } else {
      // 선택되지 않은 경우: 배열에 추가
      // 스프레드 연산자(...): 배열의 모든 요소를 펼쳐서 새 배열을 만듭니다
      set_temp_selected([...temp_selected, status]);
    }
  };

  // 필터 적용 핸들러
  // "필터 적용하기" 버튼을 클릭했을 때 호출되는 함수입니다
  const handle_apply = () => {
    on_apply(temp_selected);
    on_close();
  };

  // 선택 초기화 핸들러
  // "선택 초기화" 버튼을 클릭했을 때 호출되는 함수입니다
  const handle_reset = () => {
    set_temp_selected([]);
  };

  // 모달 오버레이 클릭 핸들러
  // 모달 배경을 클릭했을 때 모달을 닫는 함수입니다
  const handle_backdrop_click = (e: React.MouseEvent) => {
    // e.target: 클릭한 요소
    // e.currentTarget: 이벤트 핸들러가 등록된 요소
    // 두 값이 같으면 배경을 클릭한 것입니다
    if (e.target === e.currentTarget) {
      on_close();
    }
  };

  // 모달이 닫혀있으면 렌더링하지 않음
  // 조건부 렌더링: 조건에 따라 컴포넌트를 렌더링하거나 렌더링하지 않습니다
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
          <h4 className={styles.section_title}>상태</h4>

          {/* 옵션 그리드 (2단 레이아웃) */}
          <div className={styles.options_grid}>
            {status_options.map((status) => (
              <label key={status} className={styles.option_item}>
                <input
                  type="checkbox"
                  value={status}
                  checked={temp_selected.includes(status)}
                  onChange={() => handle_option_change(status)}
                  className={styles.option_checkbox}
                />
                <span className={styles.option_label}>{status}</span>
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
