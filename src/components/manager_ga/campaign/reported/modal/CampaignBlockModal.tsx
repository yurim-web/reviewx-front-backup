/* ========================================
   📋 캠페인 차단 모달 컴포넌트
   ======================================== */

/**
 * 캠페인 차단 모달 컴포넌트
 *
 * 목적: GA 관리자 신고내역 페이지에서 캠페인을 차단하는 모달입니다.
 *
 * 사용 위치:
 * - ReportedCampaignTable 컴포넌트의 차단 아이콘 클릭 시
 *
 * 주요 기능:
 * - 라디오 버튼 방식의 단일 선택 차단 사유 선택
 * - 차단 사유 옵션들
 * - 차단/닫기 기능
 * - 모달 오버레이 클릭으로 닫기
 *
 */

'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/manager_ga/campaign/progress/campaign_report_modal.module.css';

interface CampaignBlockModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  campaign_id?: string; // 차단할 캠페인 ID (옵션)
  on_block?: (block_reason: string) => void; // 차단 완료 함수
}

// 차단 사유 옵션
const block_reason_options = [
  '반복 반려 누적',
  '반복 취소 누적',
  '무단 이탈 · 노쇼 누적',
  '공정위 위반 게시 요청 누적',
  '부적절 캠페인 게시',
  '콘텐츠 도용 · 중복',
  '비정상 요청 · 접근',
  '외부 결제 · 금전 요구',
  '비매너 행위',
];

export default function CampaignBlockModal({
  is_open,
  on_close,
  campaign_id,
  on_block,
}: CampaignBlockModalProps) {
  // 선택된 차단 사유 (라디오 버튼이므로 단일 값)
  const [selected_reason, set_selected_reason] = useState<string | null>(null);

  // 모달이 열릴 때마다 선택 상태를 초기화
  useEffect(() => {
    if (is_open) {
      // 기본값으로 첫 번째 옵션 선택
      set_selected_reason(block_reason_options[0]);
    }
  }, [is_open]);

  // 옵션 선택 핸들러
  const handle_option_change = (reason: string) => {
    set_selected_reason(reason);
  };

  // 차단 핸들러
  const handle_block = () => {
    if (selected_reason) {
      on_block?.(selected_reason);
      on_close();
      // TODO: 실제 차단 로직 구현
    }
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
        {/* 모달 제목 */}
        <h3 className={styles.modal_title}>콘텐츠 차단</h3>

        {/* 옵션 리스트 (세로 레이아웃) */}
        <div className={styles.options_list}>
          {block_reason_options.map((reason) => {
            return (
              <label key={reason} className={styles.option_item}>
                <input
                  type="radio"
                  name="block-reason"
                  value={reason}
                  checked={selected_reason === reason}
                  onChange={() => handle_option_change(reason)}
                  className={styles.option_radio}
                />
                <span className={styles.option_label}>{reason}</span>
              </label>
            );
          })}
        </div>

        {/* 모달 푸터 */}
        <div className={styles.modal_footer}>
          <button className={styles.close_button} onClick={on_close}>
            닫기
          </button>
          <button
            className={styles.report_button}
            onClick={handle_block}
            disabled={!selected_reason}
          >
            차단
          </button>
        </div>
      </div>
    </div>
  );
}

