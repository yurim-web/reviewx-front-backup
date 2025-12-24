/**
 * 서브헤더 컴포넌트
 * 캠페인 상세 페이지 등에서 사용되는 헤더
 * - 뒤로가기 버튼
 * - 가이드북 링크
 * - 마이페이지 링크
 * - 항상 상단에 고정됨 (position: fixed)
 * - 메인 헤더를 자동으로 숨김 (SubHeader가 표시될 때는 메인 헤더 숨김)
 */

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "../../styles/fragments/sub_header.module.css";

export default function SubHeader() {
  const router = useRouter();
  const pathname = usePathname();

  // 메인 헤더 숨기기 처리
  // SubHeader가 마운트될 때 메인 헤더를 숨기고, 언마운트될 때 다시 표시
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    // cleanup 함수: 컴포넌트가 언마운트될 때 실행
    // 메인 헤더를 다시 표시하여 다른 페이지에서 정상적으로 보이도록 함
    return () => {
      if (header) header.style.display = "block";
    };
  }, []); // 빈 의존성 배열: 컴포넌트 마운트/언마운트 시에만 실행

  // 뒤로가기 함수
  const handleGoBack = () => {
    // 파트너 캠페인 생성 페이지에서는 홈으로 이동
    if (pathname?.startsWith("/partner/campaign/create")) {
      router.push("/partner");
    } else {
      // 포인트 충전 페이지 포함 모든 경우 이전 페이지로 이동
      router.back();
    }
  };

  return (
    // 항상 fixed 클래스 적용
    <div className={styles.gradient_bar}>
      <div className={styles.header_controls}>
        <button className={styles.back_button} onClick={handleGoBack}>
          <img src="/images/header/header_arrow_back.svg" alt="뒤로가기" />
        </button>
        <div className={styles.right_icons}>
          <a
            href="https://markx.dev/guide_book"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bookmark_icon}
          >
            <img src="/images/header/header_book.svg" alt="book" />
          </a>
          <Link 
            href={pathname?.startsWith("/partner") ? "/partner/campaign_management" : "/user/mypage"} 
            className={styles.user_icon}
          >
            <img src="/images/header/header_user.svg" alt="user" />
          </Link>
        </div>
      </div>
    </div>
  );
}
