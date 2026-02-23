/* ========================================
   💰 적립 예정 포인트 페이지 (모바일 전용 페이지 이동)
   ========================================
   모바일에서 "적립 예정 포인트 확인" 클릭 시 이동하는 전용 페이지.
   Figma: node 4927-23131
   구조: 모바일 포인트 내역 페이지와 동일 (SubHeader + 보유 포인트 + 리스트)
   ======================================== */

"use client";

import { useState, useEffect } from "react";
import PageTitle from "@/components/fragments/PageTitle";
import { pendingPointListData } from "@/data/user/point/pointData";
import { useAuth } from "@/hooks/useAuth";
import type { PendingPointItem } from "@/types/domain/user";
import pointStyles from "@/styles/user/point/point.module.css";

export default function PendingPointPage() {
  const { user } = useAuth();
  const [available_points, setAvailablePoints] = useState(0);
  const [pending_list, setPendingList] = useState<PendingPointItem[]>(
    () => pendingPointListData,
  );

  useEffect(() => {
    if (typeof window === "undefined" || !user) return;
    try {
      const stored = localStorage.getItem("user_accounts");
      if (stored) {
        const accounts = JSON.parse(stored);
        const account = accounts.find(
          (a: any) => a.id === user.id || a.email === user.email,
        );
        if (account) {
          setAvailablePoints(account.available_points ?? 0);
          if (account.pending_point_list?.length !== undefined) {
            setPendingList(account.pending_point_list);
          }
        }
      }
    } catch {
      // keep defaults
    }
  }, [user]);

  /* 기본 헤더 숨김 (모바일에서 PageTitle만 사용) */
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  return (
    <>
      <PageTitle title="적립 예정 포인트" />
      <div className={pointStyles.point_page}>
        <main className={pointStyles.main_content}>
          <div className={pointStyles.container}>
            {/* 보유 포인트 (모바일 포인트 내역과 동일) */}
            <article className={pointStyles.point_summary_section}>
              <div className={pointStyles.point_summary_info}>
                <span className={pointStyles.point_label}>보유 포인트</span>
                <div className={pointStyles.point_amount}>
                  <span className={pointStyles.amount_number}>
                    {available_points.toLocaleString()}
                  </span>
                  <span className={pointStyles.amount_unit}>P</span>
                </div>
              </div>
            </article>

            {/* 적립 예정 목록 (모바일 포인트 내역과 동일 구조) */}
            <article className={pointStyles.history_list}>
              {pending_list.length === 0 ? (
                <div className={pointStyles.empty_state}>
                  <p className={pointStyles.empty_message}>
                    적립 예정 포인트가 없습니다.
                  </p>
                </div>
              ) : (
                pending_list.map((item) => (
                  <div key={item.id} className={pointStyles.history_item}>
                    <div className={pointStyles.mobile_row_first}>
                      <div className={pointStyles.mobile_description}>
                        {item.description}
                      </div>
                      <div className={pointStyles.mobile_points_group}>
                        <div
                          className={`${pointStyles.mobile_point_change} ${pointStyles.positive}`}
                        >
                          + {item.amount.toLocaleString()} P
                        </div>
                      </div>
                    </div>
                    <div className={pointStyles.mobile_row_second}>
                      <div className={pointStyles.mobile_date}>
                        {item.date}
                      </div>
                      <span
                        className={`${pointStyles.mobile_status} ${pointStyles.earned}`}
                      >
                        예정
                      </span>
                    </div>
                  </div>
                ))
              )}
            </article>
          </div>
        </main>
      </div>
    </>
  );
}
