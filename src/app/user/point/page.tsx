/* ========================================
   💰 포인트 관리 페이지
   ======================================== */

/**
 * 포인트 관리 페이지
 *
 * 목적: 사용자의 포인트 현황, 내역, 출금 신청을 관리하는 포인트 전용 페이지입니다.
 *
 * 페이지 경로:
 * - /user/point
 *
 * 사용 파일:
 * - 컴포넌트: Header, TabNavigation, PointTabNavigation
 * - 타입: MainTab, PointTab
 * - 데이터: pointHistoryData
 * - CSS: point.module.css
 *
 * 주요 기능:
 * - 보유 포인트 현황 표시
 * - 포인트 내역 조회 (전체/적립/출금)
 * - 출금 신청 기능
 * - 포인트 상태별 필터링 (적립, 완료, 신청, 취소)
 * - 상단 고정 탭 네비게이션
 * - 포인트 내역 상세 정보 표시
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/fragments/Header";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import PointTabNavigation from "@/components/user/point/PointTabNavigation";
import { MainTab } from "@/types/campaignManagement";
import { PointTab } from "@/types/point";
import { pointHistoryData } from "@/data/user/point/pointData";
import styles from "../../../styles/user/point/point.module.css";

/**
 * 포인트 메인 페이지 - Figma 디자인에 맞춤
 */
export default function PointPage() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("point");
  const [activePointTab, setActivePointTab] = useState<PointTab>("all");

  const handleWithdrawalClick = () => {
    router.push("/user/point/withdrawal_request");
  };

  // 탭에 따라 데이터 필터링
  const filteredHistoryData = pointHistoryData.filter((history) => {
    if (activePointTab === "all") return true;
    if (activePointTab === "earned") return history.status === "earned";
    if (activePointTab === "withdrawn")
      return ["completed", "pending", "failed"].includes(history.status);
    return true;
  });

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
            setActivePointTab={setActivePointTab}
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
                        <div className={styles.reason_section}>
                          <div className={styles.reason_icon}>
                            <Image
                              src="/images/management_page/cancel_info.svg"
                              alt="정보 아이콘"
                              width={16}
                              height={16}
                            />
                          </div>
                          <span className={styles.reason_text}>사유보기</span>
                          <span className={styles.reason_content}>
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
