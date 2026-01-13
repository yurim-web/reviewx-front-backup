/* ========================================
   📋 캠페인 이용 제한 사유 모달 컴포넌트
   ======================================== */

/**
 * 캠페인 이용 제한 사유 모달 컴포넌트
 *
 * 목적: GA 관리자 신고 내역 페이지에서 캠페인 이용 제한 사유를 선택하는 모달입니다.
 *
 * 📍 사용 위치:
 * - 직접 사용 컴포넌트:
 *   - ReportedCampaignTable 컴포넌트의 차단 아이콘 클릭 시 (신고 내역 페이지)
 *
 * - 최종 사용 페이지:
 *   - /manager_ga/campaign/reported (GA 관리자 신고 내역 페이지)
 *
 * 사용 흐름:
 * 신고 내역 페이지 (/manager_ga/campaign/reported)
 *   └─> ReportedCampaignTable 컴포넌트
 *       └─> CampaignRestrictionModal 컴포넌트 (차단 아이콘 클릭 시)
 *
 * 주요 기능:
 * - 라디오 버튼 방식의 단일 선택 사유 선택
 * - 이용 제한 사유 문자열 배열 사용
 * - 취소/확인 버튼 제공
 * - 모달 오버레이 클릭으로 닫기
 *
 * 📝 사용처:
 * - src/components/manager/ga/campaign/reported/section/ReportedCampaignTable.tsx
 *   (신고 내역 테이블 컴포넌트에서 이용 제한 사유 모달로 사용)
 *
 */

"use client";

import { useState, useEffect } from "react";

// CampaignRestrictionModal 컴포넌트의 props 타입 정의
export interface CampaignRestrictionModalProps {
  is_open: boolean; // 모달 열림/닫힘 상태
  on_close: () => void; // 모달 닫기 함수
  campaign_id?: string; // 이용 제한할 캠페인 ID (옵션)
  on_block?: (restriction_reason: string) => void; // 이용 제한 완료 함수
  block_reason_options: string[]; // 이용 제한 사유 옵션 목록
  // CSS 모듈 스타일 객체
  styles: Record<string, string> & {
    modal_overlay: string;
    modal_content: string;
    modal_title: string;
    options_list: string;
    option_item: string;
    option_radio: string;
    option_label: string;
    modal_footer: string;
    close_button: string;
    block_button: string;
  };
}

export default function CampaignRestrictionModal({
  is_open,
  on_close,
  campaign_id,
  on_block,
  block_reason_options,
  styles: cssStyles,
}: CampaignRestrictionModalProps) {
  // useState: 선택된 이용 제한 사유를 관리하는 React Hook
  // [상태값, 상태를 변경하는 함수] = useState(초기값)
  const [selected_block_reason, set_selected_block_reason] = useState<
    string | null
  >(null);

  // useEffect: 모달이 열릴 때마다 선택 상태를 초기화
  // useEffect는 컴포넌트가 렌더링된 후에 실행됩니다
  useEffect(() => {
    if (is_open) {
      // 모달이 열릴 때 첫 번째 이용 제한 사유 옵션을 자동으로 선택합니다
      set_selected_block_reason(block_reason_options[0] || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is_open]);

  // 옵션 선택 핸들러
  // 라디오 버튼을 클릭했을 때 선택된 이용 제한 사유를 업데이트합니다
  const handle_block_option_change = (reason: string) => {
    set_selected_block_reason(reason);
  };

  // 이용 제한 핸들러
  // "확인" 버튼을 클릭했을 때 선택된 이용 제한 사유로 이용 제한을 실행합니다
  const handle_block = () => {
    if (selected_block_reason) {
      // on_block 함수가 전달되었으면 실행합니다
      // ?. (옵셔널 체이닝): 함수가 존재할 때만 호출합니다
      on_block?.(selected_block_reason);
      on_close();
      // TODO: 실제 이용 제한 로직 구현
    }
  };

  // 모달 오버레이 클릭 핸들러
  // 모달 배경(오버레이)을 클릭했을 때 모달을 닫습니다
  const handle_backdrop_click = (e: React.MouseEvent) => {
    // e.target: 클릭한 요소
    // e.currentTarget: 이벤트 핸들러가 등록된 요소 (오버레이)
    // 오버레이를 직접 클릭했을 때만 닫기 (내부 콘텐츠 클릭 시에는 닫지 않음)
    if (e.target === e.currentTarget) {
      on_close();
    }
  };

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!is_open) return null;

  return (
    <div className={cssStyles.modal_overlay} onClick={handle_backdrop_click}>
      <div
        className={cssStyles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 제목 */}
        <h3 className={cssStyles.modal_title}>이용 제한 사유</h3>

        {/* 옵션 리스트 (세로 레이아웃) */}
        <div className={cssStyles.options_list}>
          {/* 이용 제한 사유 옵션 렌더링 */}
          {/* map(): 배열의 각 요소를 순회하며 JSX 요소를 생성합니다 */}
          {block_reason_options.map((reason) => {
            return (
              <label key={reason} className={cssStyles.option_item}>
                {/* 라디오 버튼: 단일 선택만 가능 */}
                <input
                  type="radio"
                  name="block-reason"
                  value={reason}
                  checked={selected_block_reason === reason}
                  onChange={() => handle_block_option_change(reason)}
                  className={cssStyles.option_radio}
                />
                <span className={cssStyles.option_label}>{reason}</span>
              </label>
            );
          })}
        </div>

        {/* 모달 푸터 */}
        <div className={cssStyles.modal_footer}>
          {/* 취소 버튼 */}
          <button className={cssStyles.close_button} onClick={on_close}>
            취소
          </button>
          {/* 확인 버튼 */}
          <button
            className={cssStyles.block_button}
            onClick={handle_block}
            disabled={!selected_block_reason}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

