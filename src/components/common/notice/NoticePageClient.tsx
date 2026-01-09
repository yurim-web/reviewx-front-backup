/* ========================================
   📢 공지사항 페이지 컴포넌트 (공통)
   ======================================== */

/**
 * 공지사항 페이지 컴포넌트 (공통)
 *
 * 목적: 유저와 파트너 공지사항 페이지에서 공통으로 사용하는 컴포넌트입니다.
 *
 * 사용 위치:
 * - /user/notice (유저 공지사항 페이지)
 * - /partner/notice (파트너 공지사항 페이지)
 *
 * 주요 기능:
 * - 카테고리별 공지사항 필터링
 * - 공지사항 목록 표시 (제목, 날짜, 카테고리)
 * - 핀된 공지사항 맨 위 고정
 *
 * Props 설명:
 * - header_component: 헤더 컴포넌트 (SubHeader 또는 PartnerHeader)
 * - target: 공지사항 대상 ("user" | "partner")
 * - detail_page_path: 상세 페이지 경로 (예: "/user/notice" 또는 "/partner/notice")
 */

"use client";

import React, { useState, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "@/styles/user/notice/notice.module.css";
import PageTitle from "@/components/fragments/PageTitle";
import { type NoticeDetail, type NoticeTarget } from "@/data/user/notice/noticesData";
import { posts_data } from "@/data/manager_ga/community/postsData";
import { convertPostsToNotices } from "@/utils/notice/convertPostToNotice";
import { get_post_detail } from "@/data/manager_ga/community/postsData";
import {
  categories_data,
  type CategoryItem,
} from "@/data/manager_ga/community/categoriesData";

/**
 * NoticePageClient 컴포넌트의 Props 타입 정의
 *
 * @property header_component - 헤더 컴포넌트 (ReactNode)
 * @property target - 공지사항 대상 ("user" | "partner")
 * @property detail_page_path - 상세 페이지 경로 (예: "/user/notice" 또는 "/partner/notice")
 */
interface NoticePageClientProps {
  header_component: ReactNode; // 헤더 컴포넌트 (SubHeader 또는 PartnerHeader)
  target: NoticeTarget; // 공지사항 대상 ("user" | "partner")
  detail_page_path: string; // 상세 페이지 경로
}

/**
 * 공지사항 페이지 공통 컴포넌트
 *
 * @param props - NoticePageClientProps 객체
 * @param props.header_component - 헤더 컴포넌트
 * @param props.target - 공지사항 대상 ("user" | "partner")
 * @param props.detail_page_path - 상세 페이지 경로
 * @returns 공지사항 페이지 JSX 요소
 */
export default function NoticePageClient({
  header_component,
  target,
  detail_page_path,
}: NoticePageClientProps) {
  // Next.js 라우터: 페이지 이동에 사용
  // useRouter: Next.js에서 페이지 이동을 위한 Hook입니다
  const router = useRouter();

  // 선택된 카테고리 상태 관리
  // useState: React Hook으로 컴포넌트의 선택된 카테고리 상태를 관리합니다
  const [selected_category, set_selected_category] = useState("전체");

  /**
   * 관리자에서 등록한 카테고리 목록을 동적으로 가져오기
   * - division이 "공지사항"인 카테고리만 필터링
   * - "전체" 카테고리를 맨 앞에 추가
   * - useMemo를 사용하여 카테고리 데이터가 변경될 때만 재계산
   */
  const categories = useMemo(() => {
    // division이 "공지사항"인 카테고리만 필터링
    // filter: 배열에서 조건에 맞는 요소만 추출합니다
    const notice_categories = categories_data
      .filter((category: CategoryItem) => category.division === "공지사항")
      // map: 배열의 각 요소를 변환하여 새로운 배열을 만듭니다
      .map((category: CategoryItem) => category.category_name);

    // 중복 제거 (Set을 사용하여 중복된 카테고리명 제거)
    // Set: 중복되지 않는 값들의 집합입니다
    // Array.from: Set을 배열로 변환합니다
    const unique_categories = Array.from(new Set(notice_categories));

    // "전체"를 맨 앞에 추가
    // 스프레드 연산자(...)를 사용하여 배열을 펼칩니다
    return ["전체", ...unique_categories];
  }, []);

  /**
   * 공지사항 클릭 핸들러
   * - 선택한 공지사항의 상세 페이지로 이동합니다
   *
   * @param notice - 클릭한 공지사항 데이터
   */
  const handle_notice_click = (notice: NoticeDetail) => {
    // router.push: Next.js에서 페이지를 이동하는 메서드입니다
    router.push(`${detail_page_path}/${notice.id}`);
  };

  /**
   * 관리자 게시글 데이터를 공지사항으로 변환
   * - division이 "공지사항"인 게시글만 변환
   * - PostDetail의 content도 포함하여 변환
   * - useMemo를 사용하여 데이터가 변경될 때만 재계산
   */
  const converted_notices = useMemo(() => {
    // convertPostsToNotices: 관리자 게시글을 공지사항 형식으로 변환하는 함수
    const notices = convertPostsToNotices(posts_data);

    // content 추가 (PostDetail에서 가져오기)
    // map: 각 공지사항에 content를 추가합니다
    return notices.map((notice) => {
      // get_post_detail: 게시글 ID로 상세 정보를 가져옵니다
      const post_detail = get_post_detail(notice.id.toString());
      return {
        // 스프레드 연산자(...): 기존 notice 객체의 모든 속성을 복사합니다
        ...notice,
        // content가 있으면 사용하고, 없으면 빈 문자열 사용
        // 논리 연산자(||): 왼쪽 값이 falsy이면 오른쪽 값을 사용합니다
        content: post_detail?.content || notice.content || "",
      };
    });
  }, []);

  /**
   * 공지사항 필터링 및 정렬
   * - target에 따라 필터링 (user 또는 partner)
   *   - target이 일치하는 경우: 해당 대상 전용
   *   - target이 undefined인 경우: 전체 대상 (양쪽 모두 표시)
   * - 카테고리별 필터링
   * - 정렬 규칙:
   *   1. 고정글(핀된 항목)은 상단 배치, 고정글끼리는 최신순
   *   2. 일반 글은 최신순 정렬
   */
  const filtered_notices = (
    selected_category === "전체"
      ? converted_notices.filter(
          // filter: 조건에 맞는 공지사항만 추출합니다
          (notice) => !notice.target || notice.target === target
        )
      : converted_notices.filter(
          (notice) =>
            (!notice.target || notice.target === target) &&
            notice.category === selected_category
        )
  ).sort((a, b) => {
    // sort: 배열을 정렬합니다
    // 1. 핀된 공지사항을 맨 위로 정렬
    if (a.is_pinned && !b.is_pinned) return -1; // a가 앞으로
    if (!a.is_pinned && b.is_pinned) return 1; // b가 앞으로

    // 2. 둘 다 핀되어 있거나 둘 다 핀 안 되어 있으면 날짜 내림차순 (최신순)
    // new Date: 문자열 날짜를 Date 객체로 변환합니다
    // getTime: Date 객체를 숫자(밀리초)로 변환합니다
    const date_a = new Date(a.date).getTime();
    const date_b = new Date(b.date).getTime();
    return date_b - date_a; // 내림차순 (최신순)
  });

  return (
    <div className={styles.notice_container}>
      {/* 헤더 컴포넌트 (SubHeader 또는 PartnerHeader) */}
      {header_component}

      <main className={styles.main_content}>
        {/* 페이지 제목 */}
        <PageTitle title="공지사항" />

        <section className={styles.section_container}>
          {/* 카테고리 필터 */}
          <div className={styles.category_container}>
            {/* map: 카테고리 배열을 순회하며 버튼을 생성합니다 */}
            {categories.map((category) => (
              <button
                key={category}
                // 템플릿 리터럴: 문자열과 변수를 결합합니다
                // 삼항 연산자: 조건에 따라 다른 클래스를 적용합니다
                className={`${styles.category_item} ${
                  selected_category === category ? styles.active : ""
                }`}
                // onClick: 버튼 클릭 시 선택된 카테고리를 변경합니다
                onClick={() => set_selected_category(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 공지사항 목록 또는 빈 상태 */}
          {/* 삼항 연산자: 조건에 따라 다른 내용을 렌더링합니다 */}
          {filtered_notices.length > 0 ? (
            <div className={styles.notice_list}>
              {/* map: 필터링된 공지사항 배열을 순회하며 목록 아이템을 생성합니다 */}
              {filtered_notices.map((notice) => (
                <button
                  key={notice.id}
                  type="button"
                  className={styles.notice_item}
                  onClick={() => handle_notice_click(notice)}
                >
                  <div className={styles.notice_content}>
                    <div className={styles.notice_title_wrapper}>
                      <div className={styles.notice_title}>{notice.title}</div>
                      {/* 핀 아이콘 - 핀된 공지사항만 표시 (제목 오른쪽) */}
                      {/* 조건부 렌더링: is_pinned가 true일 때만 아이콘을 표시합니다 */}
                      {notice.is_pinned && (
                        <Image
                          src="/images/icons/pin_table_icon.svg"
                          alt="핀"
                          width={20}
                          height={20}
                          className={styles.pin_icon}
                        />
                      )}
                    </div>
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







