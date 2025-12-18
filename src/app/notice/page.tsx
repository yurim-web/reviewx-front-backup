/* ========================================
   📢 공지사항 페이지
   ======================================== */

/**
 * 공지사항 페이지
 *
 * 목적: 서비스 관련 공지사항을 카테고리별로 정리하여 보여주는 공지사항 페이지입니다.
 *
 * 페이지 경로:
 * - /user/notice
 *
 * 사용 파일:
 * - 컴포넌트: SubHeader
 * - CSS: notice.module.css
 *
 * 주요 기능:
 * - 카테고리별 공지사항 필터링 (전체, 중요, 소식, 미션형, 이벤트)
 * - 공지사항 목록 표시 (제목, 날짜, 카테고리)
 * - 메인 헤더 숨김 처리
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/user/notice/notice.module.css";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import { notices, type NoticeDetail } from "@/data/user/notice/noticesData";

const categories = ["전체", "중요", "소식", "미션형", "이벤트"];

export default function NoticePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const handleBackClick = () => {
    router.back();
  };

  const handleNoticeClick = (notice: NoticeDetail) => {
    router.push(`/notice/${notice.id}`);
  };

  const filteredNotices =
    selectedCategory === "전체"
      ? notices
      : notices.filter((notice) => notice.category === selectedCategory);

  return (
    <div className={styles.notice_container}>
      {/* 서브헤더 */}
      <SubHeader />

      <main className={styles.main_content}>
        {/* 페이지 제목 */}
        <PageTitle title="공지사항" />

        <section className={styles.section_container}>
          {/* 카테고리 필터 */}
          <div className={styles.category_container}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.category_item} ${
                  selectedCategory === category ? styles.active : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 공지사항 목록 또는 빈 상태 */}
          {filteredNotices.length > 0 ? (
            <div className={styles.notice_list}>
              {filteredNotices.map((notice) => (
                <button
                  key={notice.id}
                  type="button"
                  className={styles.notice_item}
                  onClick={() => handleNoticeClick(notice)}
                >
                  <div className={styles.notice_content}>
                    <div className={styles.notice_title}>{notice.title}</div>
                    <div className={styles.notice_date}>{notice.date}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.empty_state}>
              <p className={styles.empty_text}>공지사항이 없습니다.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
