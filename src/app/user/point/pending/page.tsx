/* ========================================
   적립 예정 포인트 페이지
   ======================================== */

/**
 * PendingPointPage
 *
 * 목적: 모바일에서 적립 예정 포인트 내역을 표시하는 전용 페이지
 *
 * 사용 페이지:
 * - /user/point/pending (적립 예정 포인트, 모바일 전용)
 */

"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import PageTitle from "@/components/fragments/PageTitle";
import { usePointData } from "@/hooks/user/point/usePointData";
import pointStyles from "@/styles/user/point/point.module.css";

export default function PendingPointPage() {
  const { pointInfo, pendingPointList: pending_list } = usePointData();
  const list_container_ref = useRef<HTMLElement>(null);
  const available_points = pointInfo.available_points;
  const [point_col_width, set_point_col_width] = useState<number | null>(null);

  /* 모바일: 포인트 영역 너비를 목록에서 가장 긴 값에 맞춰 동일하게 적용 */
  const measure_point_width = useCallback(() => {
    const container = list_container_ref.current;
    if (!container || pending_list.length === 0) return;
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      set_point_col_width(null);
      return;
    }
    const nodes = container.querySelectorAll(`.${pointStyles.mobile_point_change}`);
    let max_w = 0;
    nodes.forEach((el) => {
      const w = (el as HTMLElement).getBoundingClientRect().width;
      if (w > max_w) max_w = w;
    });
    if (max_w > 0) set_point_col_width(max_w);
  }, [pending_list]);

  useLayoutEffect(() => {
    measure_point_width();
  }, [measure_point_width]);

  useEffect(() => {
    const on_resize = () => measure_point_width();
    window.addEventListener("resize", on_resize);
    return () => window.removeEventListener("resize", on_resize);
  }, [measure_point_width]);

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
            {/* 보유 포인트 (모바일에서만 숨김) */}
            <article
              className={`${pointStyles.point_summary_section} ${pointStyles.point_summary_section_hide_on_mobile}`}
            >
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

            {/* 적립 예정 목록 (구분선 가로 풀 너비 - Figma 기획) */}
            <article
              ref={list_container_ref}
              className={`${pointStyles.history_list} ${pointStyles.history_list_full_bleed_lines}`}
            >
              {pending_list.length === 0 ? (
                <div className={pointStyles.empty_state}>
                  <p className={pointStyles.empty_message}>적립 예정 포인트가 없습니다.</p>
                </div>
              ) : (
                pending_list.map((item) => (
                  <div key={item.id} className={pointStyles.history_item}>
                    <div className={pointStyles.mobile_row_first}>
                      <div className={pointStyles.mobile_description}>{item.description}</div>
                      <div
                        className={pointStyles.mobile_points_group}
                        style={point_col_width != null ? { width: point_col_width } : undefined}
                      >
                        <div
                          className={`${pointStyles.mobile_point_change} ${pointStyles.positive}`}
                        >
                          + {item.amount.toLocaleString()} P
                        </div>
                      </div>
                    </div>
                    <div className={pointStyles.mobile_row_second}>
                      <div className={pointStyles.mobile_date}>{item.date} 예정</div>
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
