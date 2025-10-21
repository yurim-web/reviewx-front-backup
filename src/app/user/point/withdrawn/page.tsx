/* ========================================
   💰 출금 포인트 내역 페이지
   ======================================== */

/**
 * 출금 포인트 내역 페이지
 *
 * 목적: 출금 관련 포인트 내역을 보여주는 독립적인 페이지입니다.
 *
 * 페이지 경로:
 * - /user/point/withdrawn
 *
 * 주요 기능:
 * - 출금 관련 포인트 내역만 표시 (완료, 신청, 취소)
 * - 보유 포인트 현황 표시
 * - 출금 신청 기능
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 */

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import PointTabNavigation from "@/components/user/point/PointTabNavigation";
import { MainTab } from "@/types/campaignManagement";
import { PointTab } from "@/types/point";
import { pointHistoryData } from "@/data/user/point/pointData";
import styles from "../../../../styles/user/point/point.module.css";

/**
 * 출금 포인트 내역 페이지 컴포넌트
 */
export default function WithdrawnPointPage() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("point");
  const [activePointTab, setActivePointTab] = useState<PointTab>("withdrawn");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  /**
   * 포인트 탭 변경 핸들러
   * 각 탭 클릭 시 해당 페이지로 이동
   */
  const handlePointTabChange = (tab: PointTab) => {
    switch (tab) {
      case "all":
        window.location.href = "/user/point/all";
        break;
      case "earned":
        window.location.href = "/user/point/earned";
        break;
      case "withdrawn":
        // 현재 페이지이므로 아무것도 하지 않음
        break;
    }
  };

  const handleWithdrawalClick = () => {
    router.push("/user/point/withdrawal_request");
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 8,
      y: rect.top + rect.height / 2,
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // 출금 관련 상태의 데이터만 필터링 (완료, 신청, 취소)
  const filteredHistoryData = pointHistoryData.filter((history) =>
    ["completed", "pending", "failed"].includes(history.status)
  );

  return (
    <div className={styles.point_page}>
      <main className={styles.main_content}>
        <div className={styles.container}>
          {/* 메인 탭 네비게이션 */}
          <TabNavigation
            activeTab={activeMainTab}
            setActiveTab={setActiveMainTab}
          />

          {/* 포인트 세부 탭 네비게이션 */}
          <PointTabNavigation
            activePointTab={activePointTab}
            setActivePointTab={handlePointTabChange}
          />

          {/* 포인트 요약 정보 */}
          <article className={styles.point_summary_section}>
            <div className={styles.point_summary_info}>
              <span className={styles.point_label}>보유 포인트</span>
              <div className={styles.point_amount}>
                <span className={styles.amount_number}>511,200</span>
                <span className={styles.amount_unit}>P</span>
              </div>
            </div>

            <button
              className={styles.withdrawal_button}
              onClick={handleWithdrawalClick}
            >
              출금 신청하기
            </button>
          </article>

          {/* 포인트 내역 리스트 */}
          <article className={styles.history_list}>
            {filteredHistoryData.map((history) => (
              <div key={history.id} className={styles.history_item}>
                {/* 상태 배지 */}
                <div className={styles.status_badge_container}>
                  <div
                    className={`${styles.status_badge} ${
                      history.status === "earned"
                        ? styles.earned
                        : history.status === "completed"
                        ? styles.completed
                        : history.status === "pending"
                        ? styles.pending
                        : styles.cancelled
                    }`}
                  >
                    {history.status === "earned"
                      ? "적립"
                      : history.status === "completed"
                      ? "완료"
                      : history.status === "pending"
                      ? "신청"
                      : "취소"}
                  </div>
                </div>

                {/* 내역 정보 */}
                <div className={styles.history_info}>
                  <div className={styles.history_description}>
                    {history.status === "failed" ? (
                      <div className={styles.cancelled_description}>
                        <span className={styles.main_text}>
                          {history.description}
                        </span>
                        <div
                          className={styles.reason_section}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className={styles.reason_icon}>
                            <Image
                              src="/images/management_page/cancel_info.svg"
                              alt="정보 아이콘"
                              width={16}
                              height={16}
                            />
                          </div>
                          <span className={styles.reason_text}>사유보기</span>
                          <span
                            ref={tooltipRef}
                            className={styles.reason_content}
                            style={{
                              left: tooltipPosition.x,
                              top: tooltipPosition.y,
                              transform: "translateY(-50%)",
                              opacity: showTooltip ? 1 : 0,
                              visibility: showTooltip ? "visible" : "hidden",
                            }}
                          >
                            예금주와 본인 명의 불일치
                          </span>
                        </div>
                      </div>
                    ) : (
                      history.description
                    )}
                  </div>
                  <div className={styles.history_date}>{history.date}</div>
                </div>

                {/* 포인트 정보 */}
                <div className={styles.point_info}>
                  <div
                    className={`${styles.point_change} ${
                      history.status === "failed"
                        ? styles.cancelled_amount
                        : history.amount > 0
                        ? styles.positive
                        : styles.negative
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
          </article>
        </div>
      </main>
    </div>
  );
}
