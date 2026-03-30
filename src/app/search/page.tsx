/* ========================================
   캠페인 검색 결과 페이지
   ======================================== */

/**
 * SearchPage
 *
 * 목적: 헤더 검색에서 이동하는 캠페인 검색 결과 페이지
 *       실제 API 호출(R-21 GET /search?keyword={keyword})은 SearchResultsSection에서
 *       클라이언트 사이드로 수행 (apiClient 인터셉터로 Bearer 토큰 자동 주입).
 *       토큰이 localStorage에 저장되므로 Server Component에서는 접근 불가.
 *
 * 사용 페이지:
 * - /search (캠페인 검색 결과)
 */

import type { Metadata } from "next";

import MainMenu from "@/components/main/MainMenu";
import Footer from "@/components/main/Footer";
import styles from "@/styles/home/home.module.css";
import SearchResultsSection from "@/components/search/SearchResultsSection";

export const metadata: Metadata = {
  title: "ReviewX | 캠페인 검색 결과",
  description: "리뷰 캠페인 검색 결과 페이지입니다",
};

type SearchPageProps = {
  searchParams?: Promise<{
    keyword?: string | string[];
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = await searchParams;
  const raw_keyword = resolved?.keyword ?? "";
  const keyword =
    typeof raw_keyword === "string" ? raw_keyword.trim() : (raw_keyword[0]?.trim() ?? "");

  return (
    <>
      {/* 메인 메뉴 (헤더 아래 고정) */}
      <MainMenu />

      {/* 헤더(80px) + MainMenu(약 69px) 공간 확보 */}
      <div className={styles.header_spacer}></div>

      <article className={styles.container}>
        {/* API 호출(R-21) 및 정적 fallback은 SearchResultsSection 내부에서 처리 */}
        <SearchResultsSection keyword={keyword} />
      </article>

      {/* 푸터 */}
      <Footer />
    </>
  );
}
