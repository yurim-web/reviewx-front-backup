/* ========================================
   💰 파트너 전체 포인트 내역 페이지
   ======================================== */

/**
 * 파트너 전체 포인트 내역 페이지
 *
 * 목적: 모든 파트너 포인트 내역을 보여주는 독립적인 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/point/all
 *
 * 주요 기능:
 * - 모든 포인트 내역 표시 (적립, 출금, 완료, 신청, 취소)
 * - 보유 포인트 현황 표시
 * - 출금 신청 기능
 * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
 */

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TabNavigation from "@/components/partner/campaign_management/TabNavigation";
import PartnerPointTabNavigation from "@/components/partner/point/PointTabNavigation";
import { MainTab } from "@/types/campaignManagement";
import { PointTab } from "@/types/point";
import { partnerPointHistoryData } from "@/data/partner/point/pointData";
import styles from "@/styles/user/point/point.module.css";

/**
 * 파트너 전체 포인트 내역 페이지 컴포넌트
 */
export default function PartnerAllPointPage() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("point");
  const [activePointTab, setActivePointTab] = useState<PointTab>("all");
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
        // 현재 페이지이므로 아무것도 하지 않음
        break;
      case "earned":
        window.location.href = "/partner/point/earned";
        break;
      case "withdrawn":
        window.location.href = "/partner/point/withdrawn";
        break;
    }
  };

  /**
   * 충전 버튼 클릭 핸들러
   * 포인트 충전 페이지로 이동
   */
  const handleWithdrawalClick = () => {
    router.push("/partner/point/charge");
  };

  /**
   * 툴팁 표시 핸들러
   * 마우스 오버 시 툴팁 위치 설정
   */
  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 8,
      y: rect.top + rect.height / 2,
    });
    setShowTooltip(true);
  };

  /**
   * 툴팁 숨김 핸들러
   * 마우스 아웃 시 툴팁 숨김
   */
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // 전체 데이터 표시 (필터링 없음)
  const filteredHistoryData = partnerPointHistoryData;

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
          <PartnerPointTabNavigation
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
              포인트 충전하기
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
