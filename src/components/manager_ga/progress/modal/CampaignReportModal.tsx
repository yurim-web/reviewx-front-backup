/* ========================================
   📋 캠페인 신고 모달 컴포넌트
   ======================================== */

/**
 * 캠페인 신고 모달 컴포넌트
 *
 * 목적: GA 관리자 진행 현황 페이지에서 캠페인을 신고하는 모달입니다.
 *
 * 사용 위치:
 * - CampaignTable 컴포넌트의 신고 아이콘 클릭 시
 *
 * 주요 기능:
 * - 라디오 버튼 방식의 단일 선택 신고 사유 선택
 * - 신고 코드 옵션: W001 ~ W013
 * - 신고/닫기 기능
 * - 모달 오버레이 클릭으로 닫기
 *
 * 학습 포인트:
 * - useState: 컴포넌트의 상태를 관리하는 React Hook입니다
 * - useEffect: 컴포넌트가 렌더링된 후에 실행되는 Hook입니다
 * - 이벤트 핸들러: 사용자 상호작용에 반응하는 함수입니다
 * - 라디오 버튼: 단일 선택만 가능한 입력 요소입니다
 */

'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/manager_ga/campaign/progress/campaign_report_modal.module.css';
import { report_code_info, type ReportCode } from '@/data/manager_ga/reported';

interface CampaignReportModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  campaign_id?: string; // 신고할 캠페인 ID (옵션)
  on_report?: (report_code: ReportCode) => void; // 신고 완료 함수
}

// 신고 코드 필터 옵션 (이미지에 표시된 옵션만)
const report_code_options: ReportCode[] = [
  'W001', // 선정 후 취소
  'W002', // 지각 제출
  'W003', // 무단 이탈 · 노쇼
  'W004', // 노출 기간 불이행
  'W005', // 수정 요청 불이행
  'W006', // 게시 후 취소
  'W007', // 부적절한 캠페인 게시
  'W009', // 비정상 요청 반복
  'W010', // 중복 계정 탐지
  'W011', // 콘텐츠 중복 탐지
  'W013', // 기타 비매너 행위
];

export default function CampaignReportModal({
  is_open,
  on_close,
  campaign_id,
  on_report,
}: CampaignReportModalProps) {
  // 선택된 신고 코드 (라디오 버튼이므로 단일 값)
  const [selected_code, set_selected_code] = useState<ReportCode | null>(null);

  // 모달이 열릴 때마다 선택 상태를 초기화
  useEffect(() => {
    if (is_open) {
      // 기본값으로 첫 번째 옵션 선택
      set_selected_code('W001');
    }
  }, [is_open]);

  // 옵션 선택 핸들러
  const handle_option_change = (code: ReportCode) => {
    set_selected_code(code);
  };

  // 신고 핸들러
  const handle_report = () => {
    if (selected_code) {
      on_report?.(selected_code);
      on_close();
      // TODO: 실제 신고 로직 구현
    }
  };

  // 모달 오버레이 클릭 핸들러
  const handle_backdrop_click = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      on_close();
    }
  };

  // 신고 코드 정보 가져오기
  const get_code_info = (code: ReportCode) => {
    return report_code_info.find((info) => info.code === code);
  };

  if (!is_open) return null;

  return (
    <div className={styles.modal_overlay} onClick={handle_backdrop_click}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 제목 */}
        <h3 className={styles.modal_title}>콘텐츠 신고</h3>

        {/* 옵션 리스트 (세로 레이아웃) */}
        <div className={styles.options_list}>
          {report_code_options.map((code) => {
            const code_info = get_code_info(code);
            return (
              <label key={code} className={styles.option_item}>
                <input
                  type="radio"
                  name="report-reason"
                  value={code}
                  checked={selected_code === code}
                  onChange={() => handle_option_change(code)}
                  className={styles.option_radio}
                />
                <span className={styles.option_label}>
                  {code_info?.reason || code}
                </span>
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
            onClick={handle_report}
            disabled={!selected_code}
          >
            신고
          </button>
        </div>
      </div>
    </div>
  );
}
