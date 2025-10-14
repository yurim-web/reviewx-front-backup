"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/fragments/Header";
import TabNavigation from "@/components/campaign_management/TabNavigation";
import { MainTab } from "@/types/campaignManagement";
import { PointTab } from "@/types/point";
import { pointHistoryData } from "@/data/point/pointData";
import styles from "../../styles/point/point.module.css";

/**
 * 포인트 메인 페이지 - Figma 디자인에 맞춤
 */
export default function PointPage() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("point");
  const [activePointTab, setActivePointTab] = useState<PointTab>("all");

  const handleWithdrawalClick = () => {
    router.push("/point/withdrawal_request");
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
          <article className={styles.point_tab_navigation}>
            <div className={styles.left_point_tabs}>
              <button
                className={`${styles.point_tab} ${
                  activePointTab === "all" ? styles.active : ""
                }`}
                onClick={() => setActivePointTab("all")}
              >
                <span>전체</span>
              </button>

              <button
                className={`${styles.point_tab} ${
                  activePointTab === "earned" ? styles.active : ""
                }`}
                onClick={() => setActivePointTab("earned")}
              >
                <span>적립</span>
              </button>

              <button
                className={`${styles.point_tab} ${
                  activePointTab === "withdrawn" ? styles.active : ""
                }`}
                onClick={() => setActivePointTab("withdrawn")}
              >
                <span>출금</span>
              </button>
            </div>
          </article>

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
