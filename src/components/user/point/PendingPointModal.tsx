/* ========================================
   💰 적립 예정 포인트 확인 모달
   ======================================== */

/**
 * 적립 예정 포인트 확인 모달
 *
 * 목적: "적립 예정 포인트 확인" 버튼 클릭 시 표시되는 모달
 * 기획: 캠페인 참여 후 들어오기로 되어 있는 포인트(예정된 포인트) 목록 표시
 *
 * 사용 페이지:
 * - /user/point/all
 * - /user/point/earned
 * - /user/point/withdrawn
 */

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/user/point/pending_point_modal.module.css";
import type { PendingPointItem } from "@/types/domain/user";

interface PendingPointModalProps {
  is_open: boolean;
  on_close: () => void;
  pending_list: PendingPointItem[];
}

export default function PendingPointModal({
  is_open,
  on_close,
  pending_list,
}: PendingPointModalProps) {
  const list_wrapper_ref = useRef<HTMLDivElement>(null);
  const [has_scroll, set_has_scroll] = useState(false);

  useEffect(() => {
    if (!is_open) return;
    const handle_escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") on_close();
    };
    window.addEventListener("keydown", handle_escape);
    return () => window.removeEventListener("keydown", handle_escape);
  }, [is_open, on_close]);

  /* 스크롤바가 생길 때만 padding 조정 (terms_view_modal과 동일) */
  useEffect(() => {
    if (!is_open) {
      set_has_scroll(false);
      return;
    }
    const el = list_wrapper_ref.current;
    if (!el) return;
    const check = () => {
      set_has_scroll(el.scrollHeight > el.clientHeight);
    };
    const id = requestAnimationFrame(() => check());
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
    };
  }, [is_open, pending_list.length]);

  if (!is_open) return null;

  const handle_overlay_click = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) on_close();
  };

  return (
    <div
      className={styles.modal_overlay}
      onClick={handle_overlay_click}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pending_point_modal_title"
    >
      <div
        className={styles.modal_container}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더: 타이틀 + 닫기(X) 버튼 */}
        <div className={styles.modal_header}>
          <h2
            id="pending_point_modal_title"
            className={styles.title}
          >
            적립 예정 포인트
          </h2>
          <button
            type="button"
            className={styles.close_button}
            onClick={on_close}
            aria-label="모달 닫기"
          >
            <Image
              src="/images/filter/x_icon.svg"
              alt="닫기"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* 스크롤 가능한 목록 영역 (8개 이상 시 스크롤, 하단 여백 유지) */}
        <div
          className={`${styles.list_wrapper} ${has_scroll ? styles.list_wrapper_has_scroll : ""}`.trim()}
        >
          <div
            ref={list_wrapper_ref}
            className={`${styles.list_wrapper_inner} ${has_scroll ? styles.list_wrapper_inner_has_scroll : ""}`.trim()}
          >
            {pending_list.length === 0 ? (
            <p className={styles.empty_message}>적립 예정 포인트가 없습니다.</p>
          ) : (
            <ul className={styles.pending_list}>
              {pending_list.map((item) => (
                <li key={item.id} className={styles.pending_item}>
                  <div className={styles.item_badge}>예정</div>
                  <div className={styles.item_info}>
                    <span className={styles.item_description}>
                      {item.description}
                    </span>
                    <span className={styles.item_date}>{item.date}</span>
                  </div>
                  <div className={styles.item_amount}>
                    + {item.amount.toLocaleString()} P
                  </div>
                </li>
              ))}
            </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
