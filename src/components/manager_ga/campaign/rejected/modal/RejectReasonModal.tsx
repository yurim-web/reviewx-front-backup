/* ========================================
   📋 반려 사유 모달 컴포넌트
   ======================================== */

/**
 * 반려 사유 모달 컴포넌트
 *
 * 목적: GA 관리자 반려내역 페이지에서 반려 사유 확인 버튼을 클릭했을 때 나타나는 모달입니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/rejected (반려내역 페이지)
 *
 * 주요 기능:
 * - 반려 사유 텍스트 표시
 * - AI 추천 분류 태그 표시 및 선택
 * - 반려 사유 저장 기능
 *
 */

'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/manager_ga/campaign/rejected/modal/reject_reason_modal.module.css';
import {
  reject_code_info,
  type RejectCodeInfo,
} from '@/data/manager_ga/rejected';

interface RejectReasonModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 반려 사유 텍스트
  reject_reason: string;
  // 반려 코드
  reject_code: string;
}

export default function RejectReasonModal({
  is_open,
  on_close,
  reject_reason,
  reject_code,
}: RejectReasonModalProps) {
  // 선택된 AI 추천 분류 (라디오 버튼이므로 단일 값)
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  const [selected_classification, set_selected_classification] = useState<
    string | null
  >(null);

  // 반려 코드 정보 가져오기
  const code_info = reject_code_info.find((info) => info.code === reject_code);

  // 반려 사유 텍스트 상태 관리
  // 초기값은 props로 받은 reject_reason 또는 code_info의 reason을 사용
  const [reason_text, set_reason_text] = useState<string>(
    reject_reason || code_info?.reason || '반려 사유가 없습니다.',
  );

  // 모달이 열릴 때마다 반려 사유 텍스트 초기화
  // useEffect는 컴포넌트가 렌더링된 후에 실행되는 Hook입니다
  useEffect(() => {
    if (is_open) {
      set_reason_text(
        reject_reason || code_info?.reason || '반려 사유가 없습니다.',
      );
    }
  }, [is_open, reject_reason, code_info?.reason]);

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  // 조건부 렌더링: is_open이 false이면 null을 반환
  if (!is_open) return null;

  // AI 추천 분류 태그 목록 (반려 코드 정보에서 가져오기)
  // 같은 카테고리의 반려 코드들을 태그로 표시
  const ai_recommended_tags = reject_code_info
    .filter((info) => info.category === code_info?.category)
    .map((info) => info.reason);

  // AI 추천 분류 선택 핸들러 (라디오 버튼 방식)
  const handle_classification_change = (classification: string) => {
    set_selected_classification(classification);
  };

  // 반려 사유 텍스트 변경 핸들러
  const handle_reason_change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    set_reason_text(e.target.value);
  };

  // 확인 버튼 클릭 핸들러
  const handle_confirm = () => {
    // TODO: 반려 사유 확인 로직 구현
    on_close();
  };

  // 오버레이 클릭 핸들러
  // 모달 배경을 클릭하면 모달이 닫히도록 합니다
  const handle_overlay_click = (e: React.MouseEvent) => {
    // 이벤트가 발생한 요소가 오버레이 자체일 때만 닫기
    if (e.target === e.currentTarget) {
      on_close();
    }
  };

  return (
    <div className={styles.modal_overlay} onClick={handle_overlay_click}>
      <div
        className={styles.modal_container}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 제목 */}
        <h2 className={styles.modal_title}>콘텐츠 반려 사유</h2>

        {/* 반려 사유 텍스트 영역 (input 스타일) */}
        <div className={styles.reject_reason_box}>
          <textarea
            className={styles.reject_reason_text}
            value={reason_text}
            onChange={handle_reason_change}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            rows={6}
            placeholder="반려 사유를 입력하세요"
          />
        </div>

        {/* AI 추천 분류 섹션 */}
        <div className={styles.ai_recommended_section}>
          <p className={styles.ai_recommended_label}>AI 추천 분류</p>
          <div className={styles.classification_container}>
            {ai_recommended_tags.map((tag) => {
              const is_selected = selected_classification === tag;
              return (
                <label
                  key={tag}
                  className={`${styles.classification_item} ${
                    is_selected ? styles.classification_item_selected : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="ai-classification"
                    value={tag}
                    checked={is_selected}
                    onChange={() => handle_classification_change(tag)}
                    className={styles.classification_radio}
                  />
                  {is_selected && (
                    <img
                      src="/images/icons/red_check_icon.svg"
                      alt="선택됨"
                      className={styles.classification_check_icon}
                    />
                  )}
                  <span className={styles.classification_label}>{tag}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 모달 하단 버튼 영역 */}
        <div className={styles.modal_footer}>
          <button className={styles.close_button} onClick={on_close}>
            닫기
          </button>
          <button className={styles.confirm_button} onClick={handle_confirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
