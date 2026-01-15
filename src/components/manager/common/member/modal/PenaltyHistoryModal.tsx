/* ========================================
   ⚠️ 패널티 내역 모달 컴포넌트 (공통)
   ======================================== */

/**
 * 패널티 내역 모달 컴포넌트 (공통)
 *
 * 목적: 리뷰어/파트너 디테일 페이지에서 패널티 버튼을 클릭했을 때 나타나는 모달입니다.
 *
 * 📍 사용 위치:
 * - /manager_ga/member/reviewers/[id] (GA 관리자 리뷰어 디테일 페이지)
 * - /manager_sa/member/reviewers/[id] (SA 관리자 리뷰어 디테일 페이지)
 * - /manager_ga/member/partners/[id] (GA 관리자 파트너 디테일 페이지)
 * - /manager_sa/member/partners/[id] (SA 관리자 파트너 디테일 페이지)
 *
 * 주요 기능:
 * - 리뷰어/파트너의 패널티 내역을 테이블 형태로 표시합니다
 * - 패널티 내역이 없을 때는 빈 상태 메시지를 표시합니다
 * - 유형, 사유, 처리일, 상태 정보를 보여줍니다
 * - 처리일 기준 내림차순 정렬 (최신 패널티가 먼저 표시됩니다)
 */

"use client";

import MemberStatusTag from "@/components/manager/common/tags/MemberStatusTag";
import type { MemberStatus } from "@/components/manager/common/tags/MemberStatusTag";
import PenaltyTypeTag from "@/components/manager/common/tags/PenaltyTypeTag";
import type { PenaltyType } from "@/components/manager/common/tags/PenaltyTypeTag";
import tagStyles from "@/styles/common/tags.module.css";

// 패널티 내역 아이템 타입 정의 (리뷰어와 파트너 모두에서 사용)
export interface PenaltyHistoryItem {
  type: string; // 유형 (예: '지각 제출', '선정 후 취소', '기타')
  reason?: string; // 사유 (리뷰어는 reason, 파트너는 type을 사유로 사용)
  processed_date: string; // 처리일 (예: 2025-08-01 18:56)
  status: string; // 상태 (예: '경고', '정상', '일시정지')
}

interface PenaltyHistoryModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 함수
  on_close: () => void;
  // 패널티 내역 목록 데이터
  penalty_history: PenaltyHistoryItem[];
  // CSS 모듈 스타일 객체
  styles: Record<string, string> & {
    modal_overlay: string;
    modal_container: string;
    modal_content: string;
    modal_header: string;
    modal_title: string;
    close_button: string;
    close_icon: string;
    table_wrapper: string;
    table_header: string;
    table_body: string;
    table_row: string;
    table_cell: string;
    empty_state: string;
    empty_message: string;
  };
}

export default function PenaltyHistoryModal({
  is_open,
  on_close,
  penalty_history,
  styles: cssStyles,
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

  // 처리일 기준 내림차순 정렬된 패널티 내역
  // sort 함수: 배열의 요소를 정렬합니다
  // localeCompare: 문자열을 비교하여 정렬 순서를 결정합니다
  // 내림차순 정렬: b를 먼저 비교하여 최신 날짜가 앞에 오도록 합니다
  // processed_date 형식: "2025-08-01 18:56" (YYYY-MM-DD HH:mm)
  // 이 형식은 문자열 비교로도 올바르게 정렬됩니다
  const sorted_penalty_history = [...penalty_history].sort((a, b) => {
    // 내림차순: b가 a보다 크면 음수 반환 (b가 앞으로)
    return b.processed_date.localeCompare(a.processed_date);
  });

  return (
    <div className={cssStyles.modal_overlay} onClick={handle_overlay_click}>
      <div
        className={cssStyles.modal_container}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더와 바디를 하나로 통합 */}
        <div className={cssStyles.modal_content}>
          {/* 모달 헤더 */}
          <div className={cssStyles.modal_header}>
            <h2 className={cssStyles.modal_title}>패널티 내역</h2>
            {/* 닫기 버튼 */}
            <button
              className={cssStyles.close_button}
              onClick={on_close}
              aria-label="닫기"
            >
              <img
                src="/images/icons/modal_x.svg"
                alt="닫기"
                className={cssStyles.close_icon}
              />
            </button>
          </div>

          {/* 테이블 */}
          <div className={cssStyles.table_wrapper}>
            {/* 테이블 헤더 */}
            <div className={cssStyles.table_header}>
              <div className={cssStyles.table_cell}>유형</div>
              <div className={cssStyles.table_cell}>사유</div>
              <div className={cssStyles.table_cell}>처리일</div>
              <div className={cssStyles.table_cell}>상태</div>
            </div>

            {/* 테이블 바디: 항상 렌더링되며, 데이터가 없을 때는 빈 상태 메시지를 표시합니다 */}
            <div className={cssStyles.table_body}>
              {/* 조건부 렌더링: 데이터가 없을 때 빈 상태 메시지 표시 */}
              {sorted_penalty_history.length === 0 ? (
                <div className={cssStyles.empty_state}>
                  <p className={cssStyles.empty_message}>
                    패널티 내역이 없습니다.
                  </p>
                </div>
              ) : (
                /* map 함수를 사용하여 테이블 행을 렌더링합니다 */
                /* map 함수: 배열의 각 요소를 순회하며 새로운 배열을 만듭니다 */
                /* key prop: React에서 리스트를 렌더링할 때 각 요소를 구분하기 위해 필요합니다 */
                /* 정렬된 배열(sorted_penalty_history)을 사용하여 최신 패널티가 먼저 표시됩니다 */
                sorted_penalty_history.map((penalty, index) => {
                  // 상태 값에 따라 표시할 값을 결정합니다
                  // '일시정지'를 '일시 정지'로 변환하여 표시합니다
                  const display_status =
                    penalty.status === "일시정지"
                      ? "일시 정지"
                      : penalty.status;

                  // 사유: reason이 있으면 reason을, 없으면 type을 사유로 사용
                  const display_reason = penalty.reason || penalty.type;

                  return (
                    <div key={index} className={cssStyles.table_row}>
                      {/* 유형: 패널티 유형 태그 표시 */}
                      <div className={cssStyles.table_cell}>
                        <PenaltyTypeTag type="경고" />
                      </div>

                      {/* 사유: type 값(지각 제출, 선정 후 취소 등)을 텍스트로 표시 */}
                      <div className={cssStyles.table_cell}>
                        {display_reason}
                      </div>

                      {/* 처리일 */}
                      <div className={cssStyles.table_cell}>
                        {penalty.processed_date}
                      </div>

                      {/* 상태: 일시 정지(빨간색) 또는 정상(파란색) 태그로 표시 */}
                      <div className={cssStyles.table_cell}>
                        <MemberStatusTag
                          status={display_status as MemberStatus}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
