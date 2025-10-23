// 메인 카테고리 메뉴

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../styles/home/home.module.css";

export default function MainMenu() {
  const pathname = usePathname();

  return (
    <section className={styles.main_menu_container}>
      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/" || pathname === "/partner" || pathname === "/user"
            ? styles.main_menu_item_active
            : ""
        }`}
        href="/"
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
