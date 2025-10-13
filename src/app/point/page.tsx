"use client";

import { useState } from "react";
import Header from "@/components/fragments/Header";
import TabNavigation from "@/components/campaign_management/TabNavigation";
import PointTabNavigation from "@/components/point/PointTabNavigation";
import PointSummary from "@/components/point/PointSummary";
import PointHistoryList from "@/components/point/PointHistoryList";
import { MainTab } from "@/types/campaignManagement";
import { PointTab } from "@/types/point";
import { pointSummary, pointHistoryData } from "@/data/point/pointData";
import styles from "../../styles/point/point.module.css";

/**
 * 포인트 메인 페이지 - Figma 디자인에 맞춤
 */
export default function PointPage() {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("point");
  const [activePointTab, setActivePointTab] = useState<PointTab>("all");

  const handleWithdrawalClick = () => {
    // TODO: 출금 신청 모달 또는 페이지로 이동
    alert("출금 신청 기능은 추후 구현 예정입니다.");
  };

  return (
    <div className={styles.point_page}>
      {/* 헤더 배경 */}
      <div className={styles.header_background}></div>

      {/* 로고 */}
      <div className={styles.logo}>로고</div>

      {/* 우측 상단 버튼들 */}
      <div className={styles.header_buttons}>
        <div className={styles.close_button}></div>
        <div className={styles.close_button}></div>
      </div>

      {/* 메인 탭 네비게이션 */}
      <div className={styles.main_tabs}>
        <div className={styles.campaign_tab}>
          <span className={styles.tab_text}>캠페인</span>
          <span className={`${styles.tab_text} ${styles.active}`}>포인트</span>
        </div>
        <div className={styles.account_tab}>
          <span className={styles.tab_text}>계정</span>
        </div>
      </div>

      {/* 구분선들 */}
      <div className={styles.divider_line}></div>
      <div className={styles.divider_line_2}></div>
      <div className={styles.active_underline}></div>

      {/* 포인트 요약 정보 */}
      <div className={styles.point_summary_section}>
        <div className={styles.point_label}>보유 포인트</div>
        <div className={styles.point_amount}>
          <span className={styles.amount_number}>511,200</span>
          <span className={styles.amount_unit}>P</span>
        </div>
        <button
          className={styles.withdrawal_button}
          onClick={handleWithdrawalClick}
        >
          출금 신청하기
        </button>
      </div>

      {/* 포인트 세부 탭 네비게이션 */}
      <div className={styles.point_tabs}>
        <span className={`${styles.point_tab} ${styles.active}`}>전체</span>
        <span className={styles.point_tab}>적립</span>
        <span className={styles.point_tab}>출금</span>
      </div>

      {/* 포인트 내역 리스트 */}
      <div className={styles.history_list}>
        {pointHistoryData.map((history) => (
          <div key={history.id} className={styles.history_item}>
            <div className={styles.history_divider}></div>

            {/* 상태 배지 */}
            <div className={styles.status_badge}>
              {history.status === "failed"
                ? "취소"
                : history.status === "completed" && history.type === "withdrawn"
                ? "완료"
                : history.type === "earned"
                ? "적립"
                : "출금"}
            </div>

            {/* 내역 정보 */}
            <div className={styles.history_info}>
              <div className={styles.history_description}>
                {history.description}
              </div>
              <div className={styles.history_date}>{history.date}</div>
            </div>

            {/* 포인트 정보 */}
            <div className={styles.point_info}>
              <div
                className={`${styles.point_change} ${
                  history.amount > 0 ? styles.positive : styles.negative
                }`}
              >
                {history.amount > 0
                  ? `+ ${history.amount.toLocaleString()}`
                  : `${history.amount.toLocaleString()}`}{" "}
                P
              </div>
              <div className={styles.point_balance}>
                {history.balance.toLocaleString()} P
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
