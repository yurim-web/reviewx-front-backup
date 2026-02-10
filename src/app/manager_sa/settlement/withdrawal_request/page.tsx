/* ========================================
   💰 SA 관리자 출금 요청 페이지
   ======================================== */

/**
 * SA 관리자 출금 요청 페이지
 *
 * 목적: SA 관리자가 출금 요청을 확인하고 승인/반려할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_sa/settlement/withdrawal_request
 *
 * 주요 기능:
 * - 필터 섹션 (승인, 반려 필터, 원천징수 영수증 다운로드)
 * - 긴급 출금 요청 테이블
 * - 이번 순차 정산 출금 요청 테이블
 *
 */

"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/manager_sa/settlement/withdrawal_request/withdrawal_request_page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import WithdrawalRequestFilterSection, {
  type RequestFilterStatus,
} from "@/components/manager/sa/settlement/withdrawal_request/section/WithdrawalRequestFilterSection";
import RequestTable from "@/components/manager/sa/settlement/withdrawal_request/section/RequestTable";
import {
  urgentRequestList,
  currentRoundRequestList,
} from "@/data/manager_sa/settlement/withdrawalRequestData";

export default function WithdrawalRequestPage() {
  // 필터 상태 관리
  const [selected_filter, set_selected_filter] =
    useState<RequestFilterStatus>("all");

  // localStorage에서 출금 요청 목록 로드
  const [withdrawal_requests, set_withdrawal_requests] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedRequests = localStorage.getItem('withdrawal_requests');
        const storedAccounts = localStorage.getItem('user_accounts');

        if (storedRequests) {
          const requests = JSON.parse(storedRequests);
          const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];

          // withdrawal_requests 데이터를 WithdrawalRequestItem 형식으로 변환
          const formattedRequests = requests
            .filter((req: any) => req.status === 'pending') // pending 상태만 표시
            .map((req: any, index: number) => {
              // user_accounts에서 해당 유저 정보 찾기
              const userAccount = accounts.find((a: any) => a.id === req.user_id);

              // 주민등록번호 가져오기
              let ssn = "******-*******";
              if (userAccount && userAccount.ssn_front && userAccount.ssn_back) {
                ssn = `${userAccount.ssn_front}-${userAccount.ssn_back}`;
              }

              // 잔여 포인트 계산 (available_points)
              let remaining = "0";
              if (userAccount) {
                remaining = (userAccount.available_points || 0).toLocaleString();
              }

              return {
                id: req.id,
                number: req.user_number || `00000${index + 1}`.slice(-6),
                round: "-", // 긴급 출금으로 표시
                name: req.user_name || req.account_holder,
                account: `${req.bank} ${req.account_number} ${req.account_holder}`,
                ssn: ssn,
                amount: req.requested_amount.toLocaleString(), // 숫자를 문자열로 변환
                remaining: remaining,
                requestDate: new Date(req.request_date).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }).replace(/\. /g, '-').replace('.', '').replace(',', ''),
                type: "일반 회원",
                status: "정상",
                isSelected: false,
              };
            });

          set_withdrawal_requests(formattedRequests);
          console.log('✅ [관리자 출금 요청] withdrawal_requests 로드:', formattedRequests);
        }
      } catch (error) {
        console.error('❌ [관리자 출금 요청] withdrawal_requests 로드 실패:', error);
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="출금 요청" />

        {/* 긴급 출금 요청 테이블 */}
        <RequestTable
          title="긴급"
          data={[...urgentRequestList, ...withdrawal_requests]}
          show_total={true}
          filter_section={
            <WithdrawalRequestFilterSection
              selected_filter={selected_filter}
              on_filter_change={set_selected_filter}
            />
          }
        />

        {/* 이번 순차 정산 출금 요청 테이블 */}
        <RequestTable
          title="회차 정산"
          data={[...currentRoundRequestList, ...withdrawal_requests]}
          show_total={true}
          filter_section={
            <WithdrawalRequestFilterSection
              selected_filter={selected_filter}
              on_filter_change={set_selected_filter}
            />
          }
        />
      </div>
    </div>
  );
}
