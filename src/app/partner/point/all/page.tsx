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

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TabNavigation from "@/components/partner/campaign_management/TabNavigation";
import PartnerPointTabNavigation from "@/components/partner/point/PointTabNavigation";
import { PartnerMainTab, PartnerPointTab, PartnerPointHistory } from "@/types/partner/partner";
import { partnerPointHistoryData, partnerPointSummary } from "@/data/partner/point/pointData";
import styles from "@/styles/user/point/point.module.css";

/**
 * 파트너 전체 포인트 내역 페이지 컴포넌트
 */
export default function PartnerAllPointPage() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState<PartnerMainTab>("point");
  const [activePointTab, setActivePointTab] = useState<PartnerPointTab>("all");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  // 포인트 내역 상태 관리 (기존 데이터 + 새로 추가된 내역)
  const [historyData, setHistoryData] = useState<PartnerPointHistory[]>(partnerPointHistoryData);
  // 포인트 요약 정보 상태 관리
  const [summary, setSummary] = useState(partnerPointSummary);

  /**
   * 포인트 탭 변경 핸들러
   * 각 탭 클릭 시 해당 페이지로 이동
   */
  const handlePointTabChange = (tab: PartnerPointTab) => {
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

  /**
   * localStorage에서 새 충전 내역 확인 및 추가
   * 
   * 설명:
   * - 충전 페이지에서 충전 완료 시 localStorage에 저장한 새 내역을 확인합니다.
   * - 새 내역이 있으면 기존 데이터 배열의 맨 앞에 추가합니다.
   * - 포인트 요약 정보도 업데이트합니다.
   * - 처리 완료 후 localStorage에서 삭제합니다.
   * 
   * 동작 순서:
   * 1. localStorage에서 "partner_new_point_history" 키로 저장된 데이터 확인
   * 2. 데이터가 있으면 파싱하여 새 내역 생성
   * 3. 잔액 계산 (기존 총 포인트 + 충전 금액)
   * 4. 새 내역을 배열 맨 앞에 추가 (최신 내역이 위에 표시되도록)
   * 5. 포인트 요약 정보 업데이트
   * 6. localStorage에서 삭제 (중복 추가 방지)
   */
  useEffect(() => {
    // localStorage에서 새 충전 내역 확인
    const newHistoryJson = localStorage.getItem("partner_new_point_history");
    
    if (newHistoryJson) {
      try {
        const newHistory: PartnerPointHistory = JSON.parse(newHistoryJson);
        
        // 잔액 계산: 현재 보유 포인트(summary) + 충전 금액
        // setState의 함수형 업데이트를 사용하여 최신 상태값을 참조
        setSummary((prevSummary) => {
          const newBalance = prevSummary.total_points + newHistory.amount;
          newHistory.balance = newBalance; // 새 내역의 잔액 설정
          
          // 포인트 요약 정보 업데이트
          return {
            ...prevSummary,
            total_points: newBalance,
            available_points: newBalance,
          };
        });
        
        // 새 내역을 배열 맨 앞에 추가 (최신 내역이 위에 표시)
        setHistoryData((prevData) => [newHistory, ...prevData]);
        
        // 처리 완료 후 localStorage에서 삭제 (중복 추가 방지)
        localStorage.removeItem("partner_new_point_history");
      } catch (error) {
        // JSON 파싱 오류 시 에러 처리
        console.error("새 충전 내역 파싱 오류:", error);
        localStorage.removeItem("partner_new_point_history");
      }
    }
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  // 전체 데이터 표시 (필터링 없음)
  const filteredHistoryData = historyData;

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
                <span className={styles.amount_number}>{summary.total_points.toLocaleString()}</span>
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
                      history.type === "earned"
                        ? styles.charged
                        : history.type === "withdrawn" && history.status === "completed"
                        ? styles.used
                        : history.status === "earned"
                        ? styles.earned
                        : history.status === "completed"
                        ? styles.completed
                        : history.status === "pending"
                        ? styles.pending
                        : styles.cancelled
                    }`}
                  >
                    {history.type === "earned"
                      ? "충전"
                      : history.type === "withdrawn"
                      ? "사용"
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
