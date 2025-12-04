/* ========================================
   🔍 패널티 이력 모달 컴포넌트 (공통 래퍼)
   ======================================== */

/**
 * 패널티 이력 모달 컴포넌트 (공통 래퍼)
 *
 * 목적: GA/SA 관리자 파트너 상세 페이지에서 공통 PenaltyHistoryModal을 사용합니다.
 *       스타일과 데이터를 전달하여 렌더링합니다.
 *
 * 사용 위치:
 * - /manager_ga/member/partners/[id] (GA 관리자 파트너 상세 페이지)
 * - /manager_sa/member/partners/[id] (SA 관리자 파트너 상세 페이지)
 */

import PenaltyHistoryModalCommon, {
  type PenaltyHistoryItem as CommonPenaltyHistoryItem,
} from '@/components/manager/common/member/modal/PenaltyHistoryModal';
import styles from '@/styles/manager_ga/member/reviewers/modal/penalty_history_modal.module.css';
import type { PenaltyHistoryItem } from '@/data/manager_ga/member/partners';

interface PenaltyHistoryModalProps {
  // 모달 열림/닫힘 상태
  is_open: boolean;
  // 모달 닫기 핸들러 함수
  on_close: () => void;
  // 패널티 이력 배열
  penalty_history: PenaltyHistoryItem[];
}

// PenaltyHistoryItem을 CommonPenaltyHistoryItem으로 변환하는 함수
// 파트너는 reason이 없고 type만 유지하여 사용
const convert_to_common_penalty_item = (
  penalty: PenaltyHistoryItem,
): CommonPenaltyHistoryItem => {
  return {
    type: penalty.type,
    reason: undefined, // 파트너는 reason이 없음
    processed_date: penalty.processed_date,
    status: penalty.status,
  };
};

export default function PenaltyHistoryModal({
  is_open,
  on_close,
  penalty_history,
}: PenaltyHistoryModalProps) {
  // PenaltyHistoryItem 배열을 CommonPenaltyHistoryItem 배열로 변환
  const penalty_items: CommonPenaltyHistoryItem[] = penalty_history.map(
    convert_to_common_penalty_item,
  );

  return (
    <PenaltyHistoryModalCommon
      is_open={is_open}
      on_close={on_close}
      penalty_history={penalty_items}
      styles={
        styles as {
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
          type_tag_penalty: string;
          status_tag: string;
          status_tag_suspended: string;
          status_tag_normal: string;
          empty_state: string;
          empty_message: string;
        }
      }
    />
  );
}

