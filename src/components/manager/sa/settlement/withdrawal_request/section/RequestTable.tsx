/* ========================================
   📋 출금 요청 테이블 컴포넌트
   ======================================== */

/**
 * 출금 요청 테이블 컴포넌트
 *
 * 목적: 출금 요청 목록을 테이블 형태로 표시합니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/withdrawal_request (출금 요청 페이지)
 *
 * 주요 기능:
 * - 체크박스로 출금 요청 선택/해제
 * - 전체 선택/해제 기능
 * - 출금 요청 정보 표시 (번호, 회차, 이름, 계좌번호, 주민등록번호, 출금 포인트, 신청일, 유형, 상태)
 * - 출금 액션 버튼 (승인/반려)
 * - 합계 행 표시
 * - 정렬 기능 (번호, 이름, 출금 포인트, 신청일)
 *
 * 기술 스택:
 * - CommonTable: 범용 테이블 컴포넌트를 사용하여 테이블 구조 제공
 * - Render Props 패턴: render_cell 함수를 통해 각 셀을 커스텀 렌더링
 * - useTableSort: 테이블 정렬 기능 제공
 */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { ReactNode, ReactElement } from "react";
import CommonTable, {
  type TableColumn,
  type TableRowData,
} from "@/components/manager/common/table/CommonTable";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import styles from "@/styles/manager_sa/settlement/withdrawal_request/request_table_ORIGINAL_BACKUP.module.css";
import {
  calculate_total_amount,
  type WithdrawalRequestItem,
} from "@/data/manager_sa/settlement/withdrawalRequestData";
import WithdrawalRejectModal from "@/components/manager/sa/settlement/withdrawal_request/modal/WithdrawalRejectModal";
import MemberStatusTag, {
  type MemberStatus,
} from "@/components/manager/common/tags/MemberStatusTag";
import BaseModal from "@/components/common/modal/BaseModal";

// WithdrawalRequestItem을 TableRowData로 확장
interface RequestTableRowData extends TableRowData, WithdrawalRequestItem {}

/**
 * RequestTable 컴포넌트 Props 인터페이스
 *
 * 각 속성 설명:
 * - title: 섹션 제목 (예: "긴급", "이번 회차 정산")
 * - data: 표시할 출금 요청 목록
 * - show_total: 합계 행 표시 여부
 * - filter_section: 제목 아래에 표시할 필터 섹션 (선택적)
 */
interface RequestTableProps {
  title: string;
  data: WithdrawalRequestItem[];
  show_total?: boolean;
  filter_section?: ReactNode;
}

export default function RequestTable({
  title,
  data,
  show_total = true,
  filter_section,
}: RequestTableProps) {
  // 긴급 테이블 여부 확인
  const is_emergency = title === "긴급";

  // 선택된 항목 ID 배열 관리 (CommonTable과 호환을 위해 배열로 변경)
  // 페이지 로드 시 모든 체크박스는 체크 해제 상태로 시작
  const [selected_ids, setSelectedIds] = useState<string[]>([]);

  /**
   * 반려 모달 제어 상태
   *
   * - is_reject_modal_open: 모달 표시 여부 (조건부 렌더링으로 제어)
   * - pending_reject_ids: 모달에서 반려할 항목 ID 배열 (모달 열 때 사용)
   *
   */
  const [is_reject_modal_open, setIsRejectModalOpen] = useState(false);
  const [pending_reject_ids, setPendingRejectIds] = useState<string[]>([]);

  /**
   * 승인 모달 제어 상태
   *
   * - is_approve_confirm_modal_open: 승인 확인 모달 표시 여부 (조건부 렌더링으로 제어)
   * - is_approve_success_modal_open: 승인 완료 모달 표시 여부 (조건부 렌더링으로 제어)
   * - pending_approve_items: 승인할 항목 정보 배열 (단일/다중 선택 모두 처리)
   *
   */
  const [is_approve_confirm_modal_open, setIsApproveConfirmModalOpen] =
    useState(false);
  const [is_approve_success_modal_open, setIsApproveSuccessModalOpen] =
    useState(false);
  const [pending_approve_items, setPendingApproveItems] = useState<
    WithdrawalRequestItem[]
  >([]);

  // (디버깅 로그 제거됨)

  // 컬럼별 타입 설정 (정렬을 위한 컬럼 타입 정의)
  // numeric_string: 숫자처럼 보이는 문자열 (예: "1,500,000")
  // date: 날짜 형식의 문자열 (예: "2025-08-01 18:56")
  // string: 일반 문자열
  const column_config: SortColumnConfig = {
    number: "numeric_string",
    name: "string",
    amount: "numeric_string",
    requestDate: "date",
  };

  // 정렬 훅 사용 (정렬 상태와 정렬된 데이터 관리)
  // 페이지 로드 시 "번호" 컬럼 기준 오름차순으로 기본 정렬
  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_request_list,
  } = useTableSort({
    data,
    initial_column_key: "number", // 기본 정렬: 번호 컬럼
    initial_direction: "asc", // 오름차순
    column_config,
  });

  // 테이블 컬럼 정의 (긴급/회차 정산에 따라 다름)
  // key: 데이터 필드명, label: 헤더에 표시될 텍스트, sortable: 정렬 가능 여부, className: CSS 클래스명
  const columns: TableColumn[] = useMemo(() => {
    const base_columns: TableColumn[] = [
      {
        key: "number",
        label: "번호",
        sortable: true,
        className: styles.table_cell_number,
      },
    ];

    // 회차 정산 테이블에만 회차 컬럼 추가
    if (!is_emergency) {
      base_columns.push({
        key: "round",
        label: "회차",
        sortable: true,
        className: styles.table_cell_round,
      });
    }

    // 나머지 컬럼 추가
    base_columns.push(
      {
        key: "name",
        label: "이름",
        sortable: true,
        className: styles.table_cell_name,
      },
      {
        key: "account",
        label: "계좌번호",
        className: styles.table_cell_account,
      },
      {
        key: "ssn",
        label: "주민등록번호",
        className: styles.table_cell_ssn,
      },
      {
        key: "amount",
        label: "출금 포인트",
        sortable: true,
        className: styles.table_cell_amount,
      },
      {
        key: "requestDate",
        label: "신청일",
        sortable: true,
        className: styles.table_cell_request_date,
      },
      {
        key: "type",
        label: "유형",
        className: styles.table_cell_type,
      },
      {
        key: "status",
        label: "상태",
        className: styles.table_cell_status,
      },
      {
        key: "action",
        label: "출금",
        className: styles.table_cell_action,
      }
    );

    return base_columns;
  }, [is_emergency]);

  // 전체 선택/해제 핸들러 (CommonTable과 호환)
  const handle_select_all = (is_all_selected: boolean) => {
    if (is_all_selected) {
      setSelectedIds(sorted_request_list.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  /**
   * 출금 승인 핸들러 (테이블 행의 승인 버튼 클릭 시)
   *
   * - 선택된 항목이 있으면: 선택된 모든 항목을 승인
   * - 선택된 항목이 없으면: 해당 행만 승인
   * - 승인 확인 모달을 엽니다.
   */
  const handle_approve = (id: string) => {
    // 선택된 항목이 있으면 선택된 모든 항목을 승인, 없으면 해당 항목만 승인
    const items_to_approve =
      selected_ids.length > 0
        ? sorted_request_list.filter((item) => selected_ids.includes(item.id))
        : [sorted_request_list.find((item) => item.id === id)];

    // 유효한 항목만 필터링 (undefined 제거)
    const valid_items = items_to_approve.filter(
      (item): item is WithdrawalRequestItem => item !== undefined
    );

    if (valid_items.length === 0) {
      console.error("승인할 항목을 찾을 수 없습니다:", id);
      return;
    }

    // 승인할 항목 정보 저장
    setPendingApproveItems(valid_items);

    // 선택된 항목이 없었으면 선택 상태도 업데이트 (UI 동기화)
    if (selected_ids.length === 0) {
      setSelectedIds([id]);
    }

    // 승인 확인 모달 열기
    setIsApproveConfirmModalOpen(true);
  };

  /**
   * 승인 확인 모달 닫기 핸들러
   *
   * - setIsApproveConfirmModalOpen(false)로 모달을 닫습니다.
   * - pending_approve_items도 초기화합니다.
   */
  const handle_close_approve_confirm_modal = () => {
    setIsApproveConfirmModalOpen(false);
    setPendingApproveItems([]);
  };

  /**
   * 승인 확인 모달에서 확인 버튼 클릭 핸들러
   *
   * - 실제 서비스에서는 여기서 API를 호출해 승인 처리를 진행합니다.
   * - 승인 확인 모달을 닫고 승인 완료 모달을 엽니다.
   */
  const handle_confirm_approve = () => {
    if (pending_approve_items.length === 0) {
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        const now = new Date();
        const approve_ids = pending_approve_items.map((item) => item.id);

        // 1. withdrawal_requests에서 상태 업데이트 및 실제 금액 정보 가져오기
        const storedRequests = localStorage.getItem('withdrawal_requests');
        const requestsMap = new Map(); // ID를 키로 한 요청 정보 맵

        if (storedRequests) {
          const requests = JSON.parse(storedRequests);

          requests.forEach((req: any) => {
            if (approve_ids.includes(req.id)) {
              req.status = 'approved';
              req.processed_date = now.toISOString();
              // 나중에 사용하기 위해 맵에 저장
              requestsMap.set(req.id, req);
            }
          });

          localStorage.setItem('withdrawal_requests', JSON.stringify(requests));
          console.log('✅ [출금 승인] withdrawal_requests 업데이트 완료');
        }

        // 2. user_accounts에서 포인트 처리 (pending → withdrawn으로 변경)
        const storedAccounts = localStorage.getItem('user_accounts');
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts);

          pending_approve_items.forEach((item: any) => {
            // withdrawal_requests에서 실제 금액 정보 가져오기
            const requestData = requestsMap.get(item.id);
            if (!requestData) {
              console.error('❌ [출금 승인] withdrawal_requests에서 데이터를 찾을 수 없음:', item.id);
              return;
            }

            const requestAmount = requestData.requested_amount;
            console.log('💰 [출금 승인] 처리할 금액:', requestAmount);

            const accountIndex = accounts.findIndex((a: any) =>
              a.id === requestData.user_id
            );

            if (accountIndex !== -1) {
              const account = accounts[accountIndex];
              console.log('📝 [출금 승인] 승인 전 account:', {
                user_id: requestData.user_id,
                available_points: account.available_points,
                pending_points: account.pending_points,
                withdrawn_points: account.withdrawn_points,
              });

              // 승인 시 available_points에서 차감하고 pending_points 차감
              account.available_points = (account.available_points || 0) - requestAmount;
              account.pending_points = (account.pending_points || 0) - requestAmount;

              // 포인트 내역에서 withdrawal_pending을 withdrawn으로 변경
              if (account.point_history) {
                const historyIndex = account.point_history.findIndex((h: any) => h.id === item.id);
                if (historyIndex !== -1) {
                  account.point_history[historyIndex].type = 'withdrawn';
                  account.point_history[historyIndex].status = 'completed';
                  account.point_history[historyIndex].description = '출금 완료';
                  account.point_history[historyIndex].balance = account.available_points;
                  console.log('📝 [출금 승인] 포인트 내역 업데이트:', account.point_history[historyIndex]);
                }
              }

              // withdrawn_points 증가
              account.withdrawn_points = (account.withdrawn_points || 0) + requestAmount;

              console.log('📝 [출금 승인] 승인 후 account:', {
                user_id: requestData.user_id,
                available_points: account.available_points,
                pending_points: account.pending_points,
                withdrawn_points: account.withdrawn_points,
              });

              accounts[accountIndex] = account;
            } else {
              console.error('❌ [출금 승인] user_id를 찾을 수 없음:', requestData.user_id);
            }
          });

          localStorage.setItem('user_accounts', JSON.stringify(accounts));
          console.log('✅ [출금 승인] user_accounts 업데이트 완료');
        }

        // 3. 알람 추가 (출금 완료 알람)
        const storedNotifications = localStorage.getItem('notifications');
        const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];

        pending_approve_items.forEach((item: any) => {
          const requestData = requestsMap.get(item.id);
          if (requestData) {
            const notification = {
              id: `notif_${item.id}_${now.getTime()}`,
              user_id: requestData.user_id,
              type: 'withdrawal_completed',
              title: '출금 완료',
              message: `${requestData.requested_amount.toLocaleString()}원 출금이 완료되었습니다.`,
              is_read: false,
              created_at: now.toISOString(),
            };
            notifications.unshift(notification);
          }
        });

        localStorage.setItem('notifications', JSON.stringify(notifications));
        console.log('✅ [출금 승인] 알람 추가 완료');

        // 4. withdrawal_history에 출금 완료 기록 추가
        const storedWithdrawalHistory = localStorage.getItem('withdrawal_history');
        const withdrawalHistory = storedWithdrawalHistory ? JSON.parse(storedWithdrawalHistory) : [];

        // localStorage에서 최신 업데이트된 user_accounts 읽기
        const updatedStoredAccounts = localStorage.getItem('user_accounts');
        const updatedAccounts = updatedStoredAccounts ? JSON.parse(updatedStoredAccounts) : [];

        pending_approve_items.forEach((item: any) => {
          const requestData = requestsMap.get(item.id);
          if (requestData) {
            // 업데이트된 잔여 포인트 가져오기
            const userAccount = updatedAccounts.find((a: any) => a.id === requestData.user_id);
            const updatedRemaining = userAccount ? (userAccount.available_points || 0).toLocaleString() : item.remaining;

            // 출금 완료 기록 생성
            const withdrawalRecord = {
              id: `withdrawal_${item.id}_${now.getTime()}`,
              number: item.number,
              round: item.round || "-",
              name: item.name,
              account: item.account,
              ssn: item.ssn,
              amount: requestData.requested_amount.toLocaleString(),
              remaining: updatedRemaining,
              requestDate: item.requestDate,
              paymentDate: now.toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }).replace(/\. /g, '-').replace('.', '').replace(',', ''),
              type: item.type,
              paymentStatus: "completed",
              status: item.status,
            };
            withdrawalHistory.push(withdrawalRecord);
          }
        });

        localStorage.setItem('withdrawal_history', JSON.stringify(withdrawalHistory));
        console.log('✅ [출금 승인] withdrawal_history 추가 완료');
      }
    } catch (error) {
      console.error('❌ [출금 승인] 처리 실패:', error);
      console.error('❌ [출금 승인] 에러 상세:', error);
      alert('출금 승인 처리 중 오류가 발생했습니다: ' + error);
      return; // 에러 발생 시 모달 열지 않고 리턴
    }

    // 승인 처리 후 선택 초기화
    setSelectedIds([]);

    // 승인 확인 모달 닫기
    setIsApproveConfirmModalOpen(false);

    // 승인 완료 모달 열기
    setIsApproveSuccessModalOpen(true);

    // 페이지 새로고침하여 업데이트된 데이터 반영
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  /**
   * 승인 완료 모달 닫기 핸들러
   *
   * - setIsApproveSuccessModalOpen(false)로 모달을 닫습니다.
   * - pending_approve_items도 초기화합니다.
   */
  const handle_close_approve_success_modal = () => {
    setIsApproveSuccessModalOpen(false);
    setPendingApproveItems([]);
  };

  /* ========================================================================
   * 📌 회차 정산 출금 승인/반려 가능 여부 계산 (임시 정책 로직)
   *
   * - 긴급 테이블(is_emergency === true)은 항상 즉시 처리 가능
   * - 회차 정산 테이블(is_emergency === false)은
   *   "해당 주 수요일 16시(KST) 이후"에만 승인/반려 가능하도록 제한
   *
   * 현재 정책:
   * - 매주 수요일 16시까지 출금 신청 건에 한하여 금요일에 입금
   * - 수요일 오후 16시 이후 정산 건은 그 다음 주 금요일에 입금
   *
   * ⚠️ 주의:
   * - 이 로직은 UI 레벨에서 버튼 활성/비활성만 제어합니다.
   * - 향후 정책 변경 또는 백엔드 검증 도입 시, 이 블록 전체를 삭제/수정할 수 있습니다.
   *   → 삭제 시 `is_round_action_available`를 항상 true로 두면 됩니다.
   * ====================================================================== */
  const is_round_action_available = useMemo(() => {
    // 긴급 테이블은 항상 허용
    if (is_emergency) {
      return true;
    }

    // 현재 시간을 KST(Asia/Seoul) 기준으로 계산
    const now_utc = new Date();
    const now_kst = new Date(
      now_utc.getTime() + now_utc.getTimezoneOffset() * 60000 + 9 * 60 * 60000
    );

    const day = now_kst.getDay(); // 0: 일요일, 1: 월요일, 2: 화요일, 3: 수요일 ...
    const hour = now_kst.getHours();
    const minute = now_kst.getMinutes();

    // 규칙: 이번 주 수요일 16:00 (KST) 이후에만 승인/반려 가능
    // - 월/화: 항상 불가
    // - 수요일 16:00 이전: 불가
    // - 수요일 16:00 이후, 목/금/토/일: 가능
    if (day < 3) {
      // 일(0), 월(1), 화(2)
      return false;
    }

    if (day === 3) {
      // 수요일인 경우 16시 이후만 허용
      if (hour < 16) return false;
      if (hour === 16 && minute < 0) return false; // 분까지 체크 (사실상 hour < 16이면 이미 막힘)
      return true;
    }

    // 목요일(4) 이후는 모두 허용
    return true;
  }, [is_emergency]);

  /**
   * 출금 반려 핸들러 (테이블 행의 반려 버튼 클릭 시)
   *
   * - 체크박스로 선택된 항목이 있으면: 선택된 모든 항목을 반려
   * - 선택된 항목이 없으면: 해당 행만 반려
   * 실제 구현에서는 API를 호출하여 반려 처리를 합니다.
   */
  const handle_reject = (item: WithdrawalRequestItem) => {
    // 선택된 항목이 있으면 그대로 사용, 없으면 해당 항목만 선택
    const ids_to_reject =
      selected_ids.length > 0 ? selected_ids : [item.id];

    // 모달에서 반려할 항목 ID 설정
    setPendingRejectIds(ids_to_reject);

    // 선택된 항목이 없었으면 선택 상태도 업데이트 (UI 동기화)
    if (selected_ids.length === 0) {
      setSelectedIds([item.id]);
    }

    // 모달을 엽니다
    setIsRejectModalOpen(true);
  };

  /**
   * 모달 닫기 핸들러
   *
   * - setIsRejectModalOpen(false)로 모달을 닫습니다.
   * - pending_reject_ids도 초기화합니다.
   */
  const handle_close_reject_modal = () => {
    setIsRejectModalOpen(false);
    setPendingRejectIds([]);
  };

  /**
   * 모달에서 반려 확정 핸들러
   *
   * - pending_reject_ids에 있는 항목들을 반려 처리합니다.
   * - 실제 서비스에서는 여기서 API를 호출해 반려 처리를 진행합니다.
   * - 데모 단계에서는 콘솔 로그 후 모달을 닫고 선택을 초기화합니다.
   */
  const handle_confirm_reject = (reason: string) => {
    if (pending_reject_ids.length === 0 || !reason.trim()) {
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        const now = new Date();

        // 1. withdrawal_requests에서 상태 업데이트
        const storedRequests = localStorage.getItem('withdrawal_requests');
        const requestsMap = new Map(); // ID를 키로 한 요청 정보 맵

        if (storedRequests) {
          const requests = JSON.parse(storedRequests);

          requests.forEach((req: any) => {
            if (pending_reject_ids.includes(req.id)) {
              req.status = 'rejected';
              req.processed_date = now.toISOString();
              req.rejection_reason = reason;
              // 나중에 사용하기 위해 맵에 저장
              requestsMap.set(req.id, req);
            }
          });

          localStorage.setItem('withdrawal_requests', JSON.stringify(requests));
          console.log('✅ [출금 반려] withdrawal_requests 업데이트 완료');
        }

        // 2. user_accounts에서 포인트 처리 (pending_points 복원)
        const storedAccounts = localStorage.getItem('user_accounts');
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts);

          pending_reject_ids.forEach((id: string) => {
            // withdrawal_requests에서 실제 금액 정보 가져오기
            const requestData = requestsMap.get(id);
            if (!requestData) {
              console.error('❌ [출금 반려] withdrawal_requests에서 데이터를 찾을 수 없음:', id);
              return;
            }

            const requestAmount = requestData.requested_amount;
            console.log('💰 [출금 반려] 처리할 금액:', requestAmount);

            const accountIndex = accounts.findIndex((a: any) =>
              a.id === requestData.user_id
            );

            if (accountIndex !== -1) {
              const account = accounts[accountIndex];
              console.log('📝 [출금 반려] 반려 전 account:', {
                user_id: requestData.user_id,
                available_points: account.available_points,
                pending_points: account.pending_points,
              });

              // 반려 시 pending_points 차감 (available_points는 그대로)
              account.pending_points = (account.pending_points || 0) - requestAmount;

              // 포인트 내역에서 withdrawal_pending을 failed로 변경
              if (account.point_history) {
                const historyIndex = account.point_history.findIndex((h: any) => h.id === id);
                if (historyIndex !== -1) {
                  account.point_history[historyIndex].status = 'failed';
                  account.point_history[historyIndex].description = '출금 신청 반려';
                  account.point_history[historyIndex].rejection_reason = reason;
                  account.point_history[historyIndex].balance = account.available_points;
                  console.log('📝 [출금 반려] 포인트 내역 업데이트:', account.point_history[historyIndex]);
                }
              }

              console.log('📝 [출금 반려] 반려 후 account:', {
                user_id: requestData.user_id,
                available_points: account.available_points,
                pending_points: account.pending_points,
              });

              accounts[accountIndex] = account;
            } else {
              console.error('❌ [출금 반려] user_id를 찾을 수 없음:', requestData.user_id);
            }
          });

          localStorage.setItem('user_accounts', JSON.stringify(accounts));
          console.log('✅ [출금 반려] user_accounts 업데이트 완료');
        }

        // 3. 알람 추가 (출금 반려 알람)
        const storedNotifications = localStorage.getItem('notifications');
        const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];

        pending_reject_ids.forEach((id: string) => {
          const requestData = requestsMap.get(id);
          if (requestData) {
            const notification = {
              id: `notif_${id}_${now.getTime()}`,
              user_id: requestData.user_id,
              type: 'withdrawal_rejected',
              title: '출금 반려',
              message: `출금 요청이 반려되었습니다.`,
              is_read: false,
              created_at: now.toISOString(),
            };
            notifications.unshift(notification);
          }
        });

        localStorage.setItem('notifications', JSON.stringify(notifications));
        console.log('✅ [출금 반려] 알람 추가 완료');
      }
    } catch (error) {
      console.error('❌ [출금 반려] 처리 실패:', error);
      alert('출금 반려 처리 중 오류가 발생했습니다: ' + error);
      return;
    }

    // 반려 처리 후 선택 초기화 및 모달 닫기
    setSelectedIds([]);
    setPendingRejectIds([]);
    setIsRejectModalOpen(false);

    // 페이지 새로고침하여 업데이트된 데이터 반영
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // 합계 금액 계산
  const total_amount = show_total
    ? calculate_total_amount(sorted_request_list)
    : 0;

  /**
   * 선택된 항목 합계/건수 계산
   *
   * 학습 포인트:
   * - 배열의 filter 메서드를 사용해서 `selected_ids`에 포함된 행만 골라냅니다.
   * - includes 메서드는 배열에 특정 값이 존재하는지 검사할 때 사용합니다.
   * - useMemo를 사용해서 의존성이 바뀔 때만 다시 계산하도록 최적화합니다.
   */
  const selected_items = useMemo(
    () => sorted_request_list.filter((item) => selected_ids.includes(item.id)),
    [sorted_request_list, selected_ids]
  );

  // 선택된 항목들의 출금 포인트 합계 (체크된 항목만 합산)
  const selected_total_amount = show_total
    ? calculate_total_amount(selected_items)
    : 0;

  // 선택된 건수 (체크된 행의 개수)
  const selected_count = selected_items.length;

  // 테이블 바디 스타일 계산
  // 긴급 테이블: 5개 항목만 보이도록 높이 제한 (5 * 76px = 380px)
  // 이번 회차 정산 테이블: 더 많은 항목이 보이도록 높이 제한 (약 520px)
  // CSS에서 직접 적용하도록 변경

  /**
   * 테이블 레이아웃(컬럼) 정의
   *
   * 긴급: 체크 | 번호 | 이름 | 계좌번호 | 주민등록번호 | 출금 포인트 | 신청일 | 유형 | 상태 | 출금
   * 회차 정산: 체크 | 번호 | 회차 | 이름 | 계좌번호 | 주민등록번호 | 출금 포인트 | 신청일 | 유형 | 상태 | 출금
   */
  const grid_template_columns = is_emergency
    ? "0.5fr 0.8fr 1.2fr 3.6fr 1.1fr 1.35fr 1.15fr 0.9fr 0.9fr 0.8fr"
    : "0.5fr 0.8fr 0.8fr 1.2fr 3.4fr 1.1fr 1.25fr 1.15fr 0.9fr 0.9fr 0.8fr";

  // 커스텀 헤더 렌더링 (SortableTableHeader 공통 컴포넌트 사용)
  // 동적 gridTemplateColumns를 container_style로 전달
  const render_table_header = () => {
    const is_all_selected =
      sorted_request_list.length > 0 &&
      selected_ids.length === sorted_request_list.length;

    const handle_select_all_click = () => {
      if (is_all_selected) {
        setSelectedIds([]);
      } else {
        setSelectedIds(sorted_request_list.map((item) => item.id));
      }
    };

    return (
      <SortableTableHeader
        columns={columns}
        sort_state={sort_state}
        handle_sort={handle_sort}
        handle_select_all={handle_select_all_click}
        is_all_selected={is_all_selected}
        styles={styles}
        container_style={{ gridTemplateColumns: grid_template_columns }}
        use_header_row={true}
      />
    );
  };

  // 각 셀 렌더링 함수 (Render Props 패턴)
  // row: 현재 행의 데이터, column: 현재 컬럼 정보, index: 행 인덱스
  const render_cell = (
    row: RequestTableRowData,
    column: TableColumn
  ): ReactNode => {
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
        // 출금 포인트 열: 금액과 잔여 금액을 세로로 표시
        // 주의: column.className에 이미 table_cell_amount가 적용되므로 여기서는 div만 사용
        return (
          <>
            <span className={styles.cell_text}>{row.amount}</span>
            <span className={styles.cell_text_secondary}>
              잔여 {row.remaining}
            </span>
          </>
        );
      case "requestDate":
        return <span className={styles.cell_text}>{row.requestDate}</span>;
      case "type":
        return <span className={styles.cell_text}>{row.type}</span>;
      case "status":
        // 상태 열: 상태 태그 컴포넌트 표시
        // MemberStatusTag 컴포넌트를 사용하여 상태에 맞는 스타일을 적용합니다.
        // row.status는 문자열이므로, 타입 단언(as)을 사용하여 MemberStatus 타입으로 변환합니다.
        // MemberStatusTag는 공백 없는 형태("일시정지")도 처리할 수 있으므로 타입 단언 사용
        // 데이터의 status 값이 "일시정지" 형태일 수 있지만, MemberStatusTag가 내부에서 정규화하여 처리합니다.
        return <MemberStatusTag status={row.status as any as MemberStatus} />;
      case "action":
        // 출금 액션 열: 승인/반려 버튼 표시
        // 회차 정산 테이블에서는 특정 요일/시간 전에는 비활성화
        const is_action_disabled = !is_round_action_available;
        return (
          <div className={styles.table_cell_action}>
            {/* 승인 버튼 */}
            <button
              className={styles.action_button_approve}
              onClick={(e) => {
                e.stopPropagation(); // 이벤트 버블링 방지
                e.preventDefault(); // 기본 동작 방지
                handle_approve(row.id);
              }}
              disabled={is_action_disabled}
              type="button"
              aria-label="승인"
            >
              <img
                src={
                  is_action_disabled
                    ? "/images/icons/sign_ok_grey.svg"
                    : "/images/icons/sign_ok.svg"
                }
                alt={is_action_disabled ? "승인 불가" : "승인"}
                className={styles.action_icon}
              />
            </button>
            {/* 반려버튼 */}
            <button
              className={styles.action_button_reject}
              onClick={(e) => {
                e.stopPropagation(); // 이벤트 버블링 방지
                e.preventDefault(); // 기본 동작 방지
                handle_reject(row);
              }}
              disabled={is_action_disabled}
              type="button"
              aria-label="반려"
            >
              <img
                src={
                  is_action_disabled
                    ? "/images/icons/sign_x_grey.svg"
                    : "/images/icons/sign_x.svg"
                }
                alt={is_action_disabled ? "반려 불가" : "반려"}
                className={styles.action_icon}
              />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  /**
   * 필터 섹션에 추가 동작(선택 항목 승인/반려)을 주입하기 위한 래퍼
   *
   * - 페이지에서 전달된 `filter_section`이 `WithdrawalRequestFilterSection`일 때
   *   `on_approve_selected`, `on_reject_selected` 콜백을 주입해서, 상단 버튼 클릭 시에도
   *   선택된 항목에 대해 승인/반려 모달을 열 수 있게 합니다.
   */
  const enhance_filter_section = (section?: ReactNode): ReactNode => {
    if (!section || !React.isValidElement(section)) return section;

    const element = section as ReactElement<any>;

    // 상단 "승인" 버튼 클릭 시 호출할 핸들러
    const handle_filter_approve_click = () => {
      // 회차 정산 테이블에서 아직 승인/반려 가능 시간이 아니면 동작하지 않음
      if (!is_round_action_available) {
        return;
      }

      if (selected_ids.length === 0) {
        // 선택된 항목이 없으면 모달을 열지 않음
        return;
      }

      // 현재 선택된 항목들을 승인할 항목으로 설정
      const items_to_approve = sorted_request_list.filter((item) =>
        selected_ids.includes(item.id)
      );

      if (items_to_approve.length === 0) {
        return;
      }

      // 승인할 항목 정보 저장 후 모달 오픈
      setPendingApproveItems(items_to_approve);
      setIsApproveConfirmModalOpen(true);
    };

    // 상단 "반려" 버튼 클릭 시 호출할 핸들러
    const handle_filter_reject_click = () => {
      // 회차 정산 테이블에서 아직 승인/반려 가능 시간이 아니면 동작하지 않음
      if (!is_round_action_available) {
        return;
      }

      if (selected_ids.length === 0) {
        // 선택된 항목이 없으면 모달을 열지 않음
        return;
      }

      // 현재 선택된 항목들로 pending_reject_ids 설정 후 모달 오픈
      setPendingRejectIds(selected_ids);
      setIsRejectModalOpen(true);
    };

    return React.cloneElement(element, {
      on_approve_selected: handle_filter_approve_click,
      on_reject_selected: handle_filter_reject_click,
    });
  };

  const enhanced_filter_section = enhance_filter_section(filter_section);

  return (
    <div className={styles.table_section}>
      {/* 섹션 제목 */}
      <h2 className={styles.section_title}>{title}</h2>
      {/* 필터 섹션 (제목 아래) */}
      {enhanced_filter_section && <div>{enhanced_filter_section}</div>}
      {/* 테이블 컨테이너 */}
      <div className={styles.table_container}>
        {/* CommonTable 컴포넌트 사용 */}
        <CommonTable<RequestTableRowData>
          columns={columns}
          data={sorted_request_list as RequestTableRowData[]}
          render_cell={render_cell}
          styles={styles}
          enable_checkbox={true}
          selected_ids={selected_ids}
          on_select_change={setSelectedIds}
          on_select_all={handle_select_all}
          render_header={render_table_header}
          empty_message="출금 요청 내역이 없습니다."
          container_class_name=""
          header_class_name=""
          body_class_name={`${styles.table_body} ${
            is_emergency ? styles.table_body_emergency : styles.table_body_round
          }`}
          row_class_name={`${styles.table_row} ${
            is_emergency ? styles.table_row_emergency : styles.table_row_round
          }`}
        />

        {/* 합계 행 */}
        {show_total && (
          <div className={styles.table_footer}>
            <div
              className={styles.table_footer_row}
              style={{ gridTemplateColumns: grid_template_columns }}
            >
              {/* 빈 공간들 */}
              {is_emergency ? (
                <>
                  {/* 긴급 테이블: 체크 | 번호 | 이름 | 계좌번호 | 주민등록번호 | 출금 포인트 | 신청일 | 유형 | 상태 | 출금 */}
                  {/* 왼쪽(첫 번째 컬럼)에 라벨, 출금 포인트 컬럼 위치에 금액을 배치합니다. */}
                  <div className={styles.table_cell_total_label}>
                    <span className={styles.total_label}>전체 합계</span>
                    {/* 선택된 항목이 있을 때만 선택 합계 표시 */}
                    {selected_ids.length > 0 && (
                      <span className={styles.total_label}>
                        선택 합계 ({selected_count.toLocaleString()}건)
                      </span>
                    )}
                  </div>
                  <div></div>
                  <div></div>
                  <div></div>
                  {/* 출금 포인트 컬럼 위치에 전체/선택 합계 금액 표시 */}
                  <div className={styles.table_cell_total_amount}>
                    <span className={styles.total_amount_main}>
                      {total_amount.toLocaleString()}
                    </span>
                    {/* 선택된 항목이 있을 때만 선택 합계 금액 표시 */}
                    {selected_ids.length > 0 && (
                      <span className={styles.total_amount_selected}>
                        {selected_total_amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </>
              ) : (
                <>
                  {/* 회차 정산 테이블: 체크 | 번호 | 회차 | 이름 | 계좌번호 | 주민등록번호 | 출금 포인트 | 신청일 | 유형 | 상태 | 출금 */}
                  {/* 왼쪽(첫 번째 컬럼)에 라벨, 출금 포인트 컬럼 위치에 금액을 배치합니다. */}
                  <div className={styles.table_cell_total_label}>
                    <span className={styles.total_label}>전체 합계</span>
                    {/* 선택된 항목이 있을 때만 선택 합계 표시 */}
                    {selected_ids.length > 0 && (
                      <span className={styles.total_label}>
                        선택 합계 ({selected_count.toLocaleString()}건)
                      </span>
                    )}
                  </div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  {/* 출금 포인트 컬럼 위치에 전체/선택 합계 금액 표시 */}
                  <div className={styles.table_cell_total_amount}>
                    <span className={styles.total_amount_main}>
                      {total_amount.toLocaleString()}
                    </span>
                    {/* 선택된 항목이 있을 때만 선택 합계 금액 표시 */}
                    {selected_ids.length > 0 && (
                      <span className={styles.total_amount_selected}>
                        {selected_total_amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 반려 모달 (조건부 렌더링) */}
      <WithdrawalRejectModal
        is_open={is_reject_modal_open}
        on_close={handle_close_reject_modal}
        on_confirm={handle_confirm_reject}
      />

      {/* 승인 확인 모달 (조건부 렌더링) */}
      {/* 승인 버튼 클릭 시 표시되는 확인 모달 */}
      {/* BaseModal 컴포넌트를 사용하여 메시지와 버튼을 표시합니다. */}
      {/* 선택된 항목이 1개일 때와 여러 개일 때 메시지가 다르게 표시됩니다. */}
      <BaseModal
        is_open={is_approve_confirm_modal_open}
        on_close={handle_close_approve_confirm_modal}
        message={
          pending_approve_items.length > 0
            ? (() => {
                // 단일 항목일 때: 해당 건을 출금 완료 처리하시겠습니까?
                if (pending_approve_items.length === 1) {
                  const item = pending_approve_items[0];
                  return `해당 건을 출금 완료 처리하시겠습니까?<br />처리 후 되돌릴 수 없습니다.<br /><span style="color: #FF5694;">[${item.name} - ${item.amount}원]</span>`;
                }
                // 다중 항목일 때: 선택된 n건을 출금 완료 처리하시겠습니까?
                else {
                  const total_amount = calculate_total_amount(
                    pending_approve_items
                  );
                  const count = pending_approve_items.length;
                  return `선택된 ${count}건을 출금 완료 처리하시겠습니까?<br />처리 후 되돌릴 수 없습니다.<br /><span style="color: #FF5694;">[${count}건 - ${total_amount.toLocaleString()}원]</span>`;
                }
              })()
            : ""
        }
        buttons={["취소", "확인"]}
        on_confirm={handle_confirm_approve}
        type="center"
        close_on_overlay_click={true}
        close_on_escape={true}
      />

      {/* 승인 완료 모달 (조건부 렌더링) */}
      {/* 승인 확인 모달에서 확인 버튼 클릭 시 표시되는 완료 모달 */}
      <BaseModal
        is_open={is_approve_success_modal_open}
        on_close={handle_close_approve_success_modal}
        message="출금 완료 처리되었습니다."
        buttons={["닫기"]}
        type="center"
        close_on_overlay_click={true}
        close_on_escape={true}
      />
    </div>
  );
}
