/* ========================================
   📋 신고 사유 모달 컴포넌트
   ======================================== */

/**
 * 신고 사유 모달 컴포넌트
 *
 * 목적: GA 관리자 신고내역 페이지에서 신고 사유 확인 버튼을 클릭했을 때 나타나는 모달입니다.
 *
 * 사용 위치:
 * - /manager_ga/campaign/reported (신고내역 페이지)
 *
 * 주요 기능:
 * - 신고 사유 텍스트 표시
 * - AI 추천 분류 태그 표시 및 선택
 * - 신고 사유 저장 기능
 *
 * 학습 포인트:
 * - 모달 컴포넌트: 사용자에게 추가 정보를 표시하거나 입력을 받는 팝업 창입니다
 * - 조건부 렌더링: isOpen이 false이면 null을 반환하여 모달을 표시하지 않습니다
 * - 이벤트 전파 방지: stopPropagation을 사용하여 모달 내부 클릭 시 모달이 닫히지 않도록 합니다
 * - 상태 관리: useState를 사용하여 선택된 태그와 신고 사유를 관리합니다
 * - 배열 메서드: map 함수를 사용하여 태그 목록을 렌더링합니다
 */

'use client';

import { useState } from 'react';
import styles from '@/styles/manager_ga/campaign/reported/modal/report_reason_modal.module.css';
import { report_code_info, type ReportCodeInfo } from '@/data/manager_ga/reported';

interface ReportReasonModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 신고 사유 텍스트
  report_reason: string;
  // 신고 코드
  report_code: string;
}

export default function ReportReasonModal({
  is_open,
  on_close,
  report_reason,
  report_code,
}: ReportReasonModalProps) {
  // 선택된 AI 추천 분류 태그 상태
  // useState는 React의 Hook으로, 컴포넌트의 상태를 관리합니다
  const [selected_tags, set_selected_tags] = useState<string[]>([]);

  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  // 조건부 렌더링: is_open이 false이면 null을 반환
  if (!is_open) return null;

  // 신고 코드 정보 가져오기
  const code_info = report_code_info.find((info) => info.code === report_code);

  // AI 추천 분류 태그 목록 (신고 코드 정보에서 가져오기)
  // 같은 카테고리의 신고 코드들을 태그로 표시
  const ai_recommended_tags = report_code_info
    .filter((info) => info.category === code_info?.category)
    .map((info) => info.reason);

  // 태그 선택/해제 핸들러
  // 클릭한 태그가 이미 선택되어 있으면 제거, 없으면 추가
  const handle_tag_click = (tag: string) => {
    set_selected_tags((prev) => {
      if (prev.includes(tag)) {
        // 이미 선택된 태그면 제거
        return prev.filter((t) => t !== tag);
      } else {
        // 선택되지 않은 태그면 추가
        return [...prev, tag];
      }
    });
  };

  // 저장 버튼 클릭 핸들러
  const handle_save = () => {
    // TODO: 신고 사유 저장 로직 구현
    console.log('신고 사유 저장:', {
      report_reason,
      report_code,
      selected_tags,
    });
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
      <div className={styles.modal_container} onClick={(e) => e.stopPropagation()}>
        {/* 모달 제목 */}
        <h2 className={styles.modal_title}>콘텐츠 신고 사유</h2>

        {/* 신고 사유 텍스트 영역 */}
        <div className={styles.report_reason_box}>
          <p className={styles.report_reason_text}>{report_reason || code_info?.reason || '신고 사유가 없습니다.'}</p>
        </div>

        {/* AI 추천 분류 섹션 */}
        <div className={styles.ai_recommended_section}>
          <p className={styles.ai_recommended_label}>AI 추천 분류</p>
          <div className={styles.tag_container}>
            {ai_recommended_tags.map((tag) => {
              const is_selected = selected_tags.includes(tag);
              return (
                <button
                  key={tag}
                  className={`${styles.tag} ${is_selected ? styles.tag_selected : styles.tag_unselected}`}
                  onClick={() => handle_tag_click(tag)}
                >
                  {is_selected && (
                    <img
                      src="/images/icons/sign_ok.svg"
                      alt="선택됨"
                      className={styles.tag_check_icon}
                    />
                  )}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 모달 하단 버튼 영역 */}
        <div className={styles.modal_footer}>
          <button className={styles.close_button} onClick={on_close}>
            닫기
          </button>
          <button className={styles.save_button} onClick={handle_save}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

