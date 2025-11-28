/* ========================================
   ⚠️ 패널티 내역 모달 컴포넌트
   ======================================== */

/**
 * 패널티 내역 모달 컴포넌트
 *
 * 목적: GA 관리자 리뷰어 디테일 페이지에서 패널티 버튼을 클릭했을 때 나타나는 모달입니다.
 *
 * 사용 위치:
 * - /manager_ga/member/reviewers/[id] (리뷰어 디테일 페이지)
 *
 * 주요 기능:
 * - 리뷰어의 패널티 내역을 테이블 형태로 표시합니다
 * - 패널티 내역이 없을 때는 빈 상태 메시지를 표시합니다
 * - 유형, 사유, 처리일, 상태 정보를 보여줍니다
 *
 * 학습 포인트:
 * - 모달 컴포넌트: 사용자에게 추가 정보를 표시하는 팝업 창입니다
 * - 조건부 렌더링: is_open이 false이면 null을 반환하여 모달을 표시하지 않습니다
 * - 빈 상태 처리: 배열이 비어있을 때와 데이터가 있을 때를 다르게 렌더링합니다
 * - 이벤트 전파 방지: stopPropagation을 사용하여 모달 내부 클릭 시 모달이 닫히지 않도록 합니다
 * - 배열 메서드: map 함수를 사용하여 패널티 목록을 렌더링합니다
 */

'use client';

import Image from 'next/image';
import styles from '@/styles/manager_ga/member/reviewers/modal/penalty_history_modal.module.css';
import type { PenaltyHistoryItem } from '@/data/manager_ga/member/reviewers';

interface PenaltyHistoryModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 패널티 내역 목록 데이터
  penalty_history: PenaltyHistoryItem[];
}

export default function PenaltyHistoryModal({
  is_open,
  on_close,
  penalty_history,
}: PenaltyHistoryModalProps) {
  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  // 조건부 렌더링: is_open이 false이면 null을 반환
  if (!is_open) return null;

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
        {/* 모달 헤더와 바디를 하나로 통합 */}
        <div className={styles.modal_content}>
          {/* 모달 헤더 */}
          <div className={styles.modal_header}>
            <h2 className={styles.modal_title}>패널티 내역</h2>
            {/* 닫기 버튼 */}
            <button
              className={styles.close_button}
              onClick={on_close}
              aria-label="닫기"
            >
              <img
                src="/images/icons/modal_x.svg"
                alt="닫기"
                className={styles.close_icon}
              />
            </button>
          </div>

          {/* 테이블 */}
          <div className={styles.table_wrapper}>
            {/* 테이블 헤더 */}
            <div className={styles.table_header}>
              <div className={styles.table_cell}>유형</div>
              <div className={styles.table_cell}>사유</div>
              <div className={styles.table_cell}>처리일</div>
              <div className={styles.table_cell}>상태</div>
            </div>

            {/* 패널티 내역이 없을 때: 빈 상태 메시지 표시 */}
            {penalty_history.length === 0 ? (
              <div className={styles.empty_state}>
                <p className={styles.empty_message}>패널티 내역이 없습니다.</p>
              </div>
            ) : (
              /* 테이블 바디: 패널티 내역이 있을 때만 표시 */
              <div className={styles.table_body}>
                {/* map 함수를 사용하여 테이블 행을 렌더링합니다 */}
                {/* map 함수: 배열의 각 요소를 순회하며 새로운 배열을 만듭니다 */}
                {/* key prop: React에서 리스트를 렌더링할 때 각 요소를 구분하기 위해 필요합니다 */}
                {penalty_history.map((penalty, index) => (
                  <div key={index} className={styles.table_row}>
                    {/* 유형 */}
                    <div className={styles.table_cell}>{penalty.type}</div>

                    {/* 사유 */}
                    <div className={styles.table_cell}>{penalty.reason}</div>

                    {/* 처리일 */}
                    <div className={styles.table_cell}>
                      {penalty.processed_date}
                    </div>

                    {/* 상태 */}
                    <div className={styles.table_cell}>
                      {/* 상태에 따라 다른 스타일의 태그를 표시합니다 */}
                      {/* 삼항 연산자: 조건에 따라 다른 값을 반환합니다 */}
                      <span
                        className={`${styles.status_tag} ${
                          penalty.status === '경고'
                            ? styles.status_tag_warning
                            : penalty.status === '일시정지'
                            ? styles.status_tag_suspended
                            : styles.status_tag_normal
                        }`}
                      >
                        {penalty.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
