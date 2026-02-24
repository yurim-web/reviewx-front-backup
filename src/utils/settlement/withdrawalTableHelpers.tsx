/* ========================================
   출금 테이블 공통 유틸리티
   ======================================== */

/**
 * withdrawalTableHelpers
 *
 * 목적: WithdrawalTable, RequestTable 등에서 중복되는 셀 렌더링 로직을 공통화
 *
 * 사용 페이지:
 * - /manager_sa/settlement/withdrawal (출금 현황)
 * - /manager_sa/settlement/withdrawal_request (출금 요청)
 */

import type { ReactNode } from "react";
import type { TableColumn } from "@/components/manager/common/table/CommonTable";

/**
 * 출금 테이블 공통 셀 데이터 타입
 * - number, round, name, account, ssn, amount, remaining, requestDate, type 등 공통 필드
 */
export interface WithdrawalTableRowBase {
  number?: string;
  round?: string;
  name?: string;
  account?: string;
  ssn?: string;
  amount?: string;
  remaining?: string;
  requestDate?: string;
  paymentDate?: string;
  type?: string;
}

type CellRenderer = (
  row: WithdrawalTableRowBase,
  styles: Record<string, string>
) => ReactNode;

/**
 * 공통 셀 렌더링 함수
 *
 * @param row - 테이블 행 데이터
 * @param column - 컬럼 정보
 * @param styles - CSS 모듈 스타일 객체
 * @param customRenderers - 커스텀 렌더러 (특정 컬럼에 대한 커스텀 렌더링 함수)
 * @returns 렌더링된 React 노드
 */
export function renderCommonWithdrawalCell(
  row: WithdrawalTableRowBase,
  column: TableColumn,
  styles: Record<string, string>,
  customRenderers?: {
    amount?: CellRenderer;
    status?: CellRenderer;
    paymentStatus?: CellRenderer;
    action?: CellRenderer;
    [key: string]: CellRenderer | undefined;
  }
): ReactNode {
  // 커스텀 렌더러가 있으면 우선 사용
  if (customRenderers?.[column.key]) {
    return customRenderers[column.key]!(row, styles);
  }

  // 공통 셀 렌더링
  switch (column.key) {
    case "number":
      return <span className={styles.cell_text}>{row.number}</span>;
    case "round":
      return <span className={styles.cell_text}>{row.round}</span>;
    case "name":
      return <span className={styles.cell_text}>{row.name}</span>;
    case "account":
      return <span className={styles.cell_text}>{row.account}</span>;
    case "ssn":
      return <span className={styles.cell_text}>{row.ssn}</span>;
    case "amount":
      // 기본 amount 렌더링 (잔여 금액 포함)
      if (row.remaining) {
        return (
          <>
            <span className={styles.cell_text}>{row.amount}</span>
            <span className={styles.cell_text_secondary}>
              잔여 {row.remaining}
            </span>
          </>
        );
      }
      return <span className={styles.cell_text}>{row.amount}</span>;
    case "requestDate":
      return <span className={styles.cell_text}>{row.requestDate}</span>;
    case "paymentDate":
      return <span className={styles.cell_text}>{row.paymentDate}</span>;
    case "type":
      return <span className={styles.cell_text}>{row.type}</span>;
    default:
      return null;
  }
}

/**
 * 출금 테이블 공통 컬럼 설정
 */
export const COMMON_WITHDRAWAL_COLUMN_CONFIG = {
  number: "numeric_string",
  name: "string",
  amount: "numeric_string",
  requestDate: "date",
  paymentDate: "date",
} as const;
