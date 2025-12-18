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

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/user/notice/notice.module.css";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";

interface NoticeItem {
  id: number;
  title: string;
  date: string;
  category: string;
}

// 임시 목업  데이터
const mockNotices: NoticeItem[] = [
  {
    id: 1,
    title: "리뷰X 서비스 리뉴얼 안내",
    date: "2025-09-12",
    category: "전체",
  },
  {
    id: 2,
    title: "리뷰X 사용자 기능 추가 안내",
    date: "2025-09-12",
    category: "소식",
  },
  {
    id: 3,
    title:
      "판매하기 버튼, 월급 이외 수익 창출한 방법 제시! 박재범 대표 \"물건을 쇼핑하기만 하는 것이 아니라 판매를 통해 수익을 얻는 '놀이터'입니다\" 브릿지 총 60억 투자 비결은? 남들과 다른 차별성을 제시한다!",
    date: "2025-09-12",
    category: "중요",
  },
  {
    id: 4,
    title: "리뷰X 홍보 캐시 서비스 지급 정책 변경 안내문",
    date: "2025-09-12",
    category: "이벤트",
  },
  {
    id: 5,
    title: "리뷰X 보유 캐시 변동 안내문",
    date: "2025-09-12",
    category: "미션형",
  },
  {
    id: 6,
    title: "리뷰X 알림톡 다중 발송 오류 사과문",
    date: "2025-09-12",
    category: "소식",
  },
];

const categories = ["전체", "중요", "소식", "미션형", "이벤트"];

export default function NoticePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const handleBackClick = () => {
    router.back();
  };

  const filteredNotices =
    selectedCategory === "전체"
      ? mockNotices
      : mockNotices.filter((notice) => notice.category === selectedCategory);

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
                <div key={notice.id} className={styles.notice_item}>
                  <div className={styles.notice_content}>
                    <div className={styles.notice_title}>{notice.title}</div>
                    <div className={styles.notice_date}>{notice.date}</div>
                  </div>
                </div>
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
