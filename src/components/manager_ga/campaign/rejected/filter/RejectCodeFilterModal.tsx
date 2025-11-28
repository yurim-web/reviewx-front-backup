/* ========================================
   🔍 반려 코드 필터 모달 컴포넌트
   ======================================== */

/**
 * 반려 코드 필터 모달 컴포넌트
 *
 * 목적: GA 관리자 반려내역 페이지에서 반려 코드를 필터링하는 모달입니다.
 *
 * 사용 위치:
 * - FilterSection 컴포넌트의 반려 코드 필터에서 사용
 *
 * 주요 기능:
 * - 체크박스 방식의 다중 선택 필터링
 * - 반려 코드 옵션: R001 ~ R008
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
import { reject_code_info, type RejectCode } from '@/data/manager_ga/rejected';

interface RejectCodeFilterModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  selected_codes: RejectCode[]; // 현재 선택된 반려 코드들
  on_apply: (codes: RejectCode[]) => void; // 필터 적용 함수
}

// 반려 코드 필터 옵션
const reject_code_options: RejectCode[] = [
  'R001',
  'R002',
  'R003',
  'R004',
  'R005',
  'R006',
  'R007',
  'R008',
];

export default function RejectCodeFilterModal({
  is_open,
  on_close,
  selected_codes,
  on_apply,
}: RejectCodeFilterModalProps) {
  // 모달 내부에서 관리하는 임시 선택 상태
  const [temp_selected, set_temp_selected] =
    useState<RejectCode[]>(selected_codes);

  // 모달이 열릴 때마다 임시 선택 상태를 초기화
  useEffect(() => {
    if (is_open) {
      set_temp_selected(selected_codes);
    }
  }, [is_open, selected_codes]);

  // 옵션 선택/해제 핸들러
  const handle_option_change = (code: RejectCode) => {
    if (temp_selected.includes(code)) {
      set_temp_selected(temp_selected.filter((c) => c !== code));
    } else {
      set_temp_selected([...temp_selected, code]);
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

  // 반려 코드 정보 가져오기
  const get_code_info = (code: RejectCode) => {
    return reject_code_info.find((info) => info.code === code);
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
          <h4 className={styles.section_title}>반려 코드</h4>

          {/* 옵션 그리드 (2단 레이아웃) */}
          <div className={styles.options_grid}>
            {reject_code_options.map((code) => {
              const code_info = get_code_info(code);
              return (
                <label key={code} className={styles.option_item}>
                  <input
                    type="checkbox"
                    value={code}
                    checked={temp_selected.includes(code)}
                    onChange={() => handle_option_change(code)}
                    className={styles.option_checkbox}
                  />
                  <span className={styles.option_label}>
                    {code} {code_info ? `(${code_info.reason})` : ''}
                  </span>
                </label>
              );
            })}
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

