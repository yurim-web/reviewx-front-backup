/* ========================================
   메인 메뉴 컴포넌트
   ======================================== */

/**
 * MainMenu
 *
 * 목적: 홈 페이지 카테고리 메뉴 표시
 *
 * 사용 페이지:
 * - / (홈 페이지)
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../styles/home/home.module.css";

export default function MainMenu() {
  const pathname = usePathname();

  /**
   * 사용자 컨텍스트 상태
   *
   * 설명:
   * - 파트너 또는 사용자 경로에서 캠페인 페이지로 이동했는지 추적합니다.
   * - sessionStorage를 사용하여 현재 세션 동안만 유지됩니다.
   * - ConditionalHeader와 동일한 방식으로 컨텍스트를 관리합니다.
   * - 초기값은 null로 설정하여 서버와 클라이언트가 동일한 값을 사용하도록 합니다.
   * - useEffect에서 클라이언트 사이드에서만 sessionStorage를 확인하여 업데이트합니다.
   * - "partner": 파트너 컨텍스트
   * - "user": 사용자 컨텍스트
   * - null: 컨텍스트 없음 (루트 경로)
   */
  const [_headerContext, setHeaderContext] = useState<"partner" | "user" | null>(null);

  /**
   * 홈 링크 상태
   *
   * 설명:
   * - 서버와 클라이언트가 동일한 초기값을 사용하도록 pathname 기반으로만 초기화합니다.
   * - useEffect에서 headerContext가 업데이트되면 다시 계산합니다.
   */
  const getInitialHomeHref = (): string => {
    const isPartnerPath = pathname.startsWith("/partner");
    const isUserPath = pathname.startsWith("/user");
    if (isPartnerPath) return "/partner";
    if (isUserPath) return "/user";
    return "/";
  };

  const [homeHref, setHomeHref] = useState<string>(getInitialHomeHref);

  /**
   * 경로 변경 추적 및 컨텍스트 관리
   *
   * 설명:
   * - useEffect: 컴포넌트가 마운트되거나 pathname이 변경될 때 실행됩니다.
   * - ConditionalHeader와 동일한 로직으로 컨텍스트를 추적합니다.
   * - 파트너 경로에서는 "partner" 컨텍스트 저장
   * - 사용자 경로(/user)에서는 "user" 컨텍스트 저장
   * - 루트 경로(/)에서는 컨텍스트 제거
   * - 캠페인 경로에서는 저장된 컨텍스트 확인
   * - 초기 마운트 시에도 sessionStorage에서 컨텍스트를 확인합니다.
   * - headerContext가 업데이트되면 homeHref도 함께 업데이트합니다.
   */
  useEffect(() => {
    // 클라이언트 사이드에서만 실행 (SSR 방지)
    if (typeof window === "undefined") return;

    const isPartnerPath = pathname.startsWith("/partner");
    const isCampaignPath = pathname.startsWith("/campaign");
    const isUserPath = pathname.startsWith("/user");
    const isRootPath = pathname === "/";

    let newContext: "partner" | "user" | null = null;
    let newHomeHref = "/";

    if (isPartnerPath) {
      // 파트너 경로에 있으면 파트너 컨텍스트 저장
      sessionStorage.setItem("headerContext", "partner");
      newContext = "partner";
      newHomeHref = "/partner";
    } else if (isUserPath) {
      // 사용자 경로에 있으면 사용자 컨텍스트 저장
      sessionStorage.setItem("headerContext", "user");
      newContext = "user";
      newHomeHref = "/user";
    } else if (isRootPath) {
      // 루트 경로에 있으면 컨텍스트 제거
      sessionStorage.removeItem("headerContext");
      newContext = null;
      newHomeHref = "/";
    } else if (isCampaignPath) {
      // 캠페인 경로에서는 저장된 컨텍스트 확인
      const savedContext = sessionStorage.getItem("headerContext");
      if (savedContext === "partner" || savedContext === "user") {
        newContext = savedContext as "partner" | "user";
        newHomeHref = savedContext === "partner" ? "/partner" : "/user";
      } else {
        newContext = null;
        newHomeHref = "/";
      }
    } else {
      // 그 외 경로에서는 컨텍스트 제거
      sessionStorage.removeItem("headerContext");
      newContext = null;
      newHomeHref = "/";
    }

    setHeaderContext(newContext);
    setHomeHref(newHomeHref);
  }, [pathname]);

  return (
    <section className={styles.main_menu_container}>
      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/" || pathname === "/partner" || pathname === "/user"
            ? styles.main_menu_item_active
            : ""
        }`}
        href={homeHref}
      >
        홈
      </Link>
      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/campaign/delivery" ? styles.main_menu_item_active : ""
        }`}
        href="/campaign/delivery"
      >
        배송형
      </Link>
      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/campaign/visit" ? styles.main_menu_item_active : ""
        }`}
        href="/campaign/visit"
      >
        방문형
      </Link>
      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/campaign/review" ? styles.main_menu_item_active : ""
        }`}
        href="/campaign/review"
      >
        구매평
      </Link>

      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/campaign/reporter" ? styles.main_menu_item_active : ""
        }`}
        href="/campaign/reporter"
      >
        기자단
      </Link>
      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/campaign/mission" ? styles.main_menu_item_active : ""
        }`}
        href="/campaign/mission"
      >
        미션형
      </Link>
    </section>
  );
}
