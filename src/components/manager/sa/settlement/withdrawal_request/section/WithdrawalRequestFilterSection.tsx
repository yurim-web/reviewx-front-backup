/* ========================================
   🔍 출금 요청 필터 섹션 컴포넌트
   ======================================== */

/**
 * 출금 요청 필터 섹션 컴포넌트
 *
 * 목적: 출금 요청 페이지의 필터 옵션들을 표시합니다.
 *
 * 사용 위치:
 * - /manager_sa/settlement/withdrawal_request (출금 요청 페이지)
 *
 * 주요 기능:
 * - 승인 필터 버튼
 * - 반려 필터 버튼
 * - 신청자 원천징수 양식 다운로드 버튼
 *
 */

"use client";

import { useState } from "react";
import styles from "@/styles/manager/common/section/filter_section.module.css";

export type RequestFilterStatus = "all" | "approved" | "rejected";

interface WithdrawalRequestFilterSectionProps {
  selected_filter?: RequestFilterStatus;
  on_filter_change?: (filter: RequestFilterStatus) => void;
}

export default function WithdrawalRequestFilterSection({
  selected_filter,
  on_filter_change,
}: WithdrawalRequestFilterSectionProps = {}) {
  const [local_filter, set_local_filter] = useState<RequestFilterStatus>("all");

  // props로 전달된 필터가 있으면 사용, 없으면 로컬 상태 사용
  const current_filter = selected_filter ?? local_filter;
  const handle_filter_change = on_filter_change ?? set_local_filter;

  /**
   * 필터 버튼 클릭 핸들러
   *
   * 승인/반려 필터 버튼 클릭 시 필터 상태를 변경합니다.
   */
  const handle_filter_click = (filter: RequestFilterStatus) => {
    // 이미 선택된 필터를 클릭하면 "all"로 초기화, 아니면 해당 필터로 변경
    const new_filter = current_filter === filter ? "all" : filter;
    handle_filter_change(new_filter);
  };

  /**
   * 원천징수 양식 다운로드 핸들러
   *
   * 신청자 원천징수 양식을 다운로드합니다.
   * 실제 구현에서는 API를 호출하여 파일을 다운로드합니다.
   */
  const handle_download_click = () => {
    // TODO: 실제 다운로드 로직 구현
    console.log("원천징수 양식 다운로드");
  };

  return (
    <div className={styles.filter_section}>
      {/* 승인 필터 버튼 */}
      <button
        className={`${styles.filter_button} ${
          current_filter === "approved" ? styles.filter_button_selected : ""
        }`}
        onClick={() => handle_filter_click("approved")}
        type="button"
      >
        <img
          src="/images/icons/sign_ok.svg"
          alt="승인"
          className={styles.filter_icon}
        />
        <span className={styles.filter_text_dark}>승인</span>
      </button>

      {/* 반려 필터 버튼 */}
      <button
        className={`${styles.filter_button} ${
          current_filter === "rejected" ? styles.filter_button_selected : ""
        }`}
        onClick={() => handle_filter_click("rejected")}
        type="button"
      >
        <img
          src="/images/icons/sign_x.svg"
          alt="반려"
          className={styles.filter_icon}
        />
        <span className={styles.filter_text_dark}>반려</span>
      </button>

      {/* 원천징수 양식 다운로드 버튼 */}
      <button
        className={styles.download_button}
        onClick={handle_download_click}
        type="button"
      >
        <img
          src="/images/excel_icon.png"
          alt="다운로드"
          className={styles.download_icon}
        />
        <span className={styles.download_button_text}>
          신청자 원천징수 양식 다운로드
        </span>
      </button>
    </div>
  );
}
