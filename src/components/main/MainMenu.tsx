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
          pathname === "/" ? styles.main_menu_item_active : ""
        }`}
        href="/"
      >
        홈
      </Link>
      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/user/delivery" ? styles.main_menu_item_active : ""
        }`}
        href="/user/delivery"
      >
        배송형
      </Link>
      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/user/visit" ? styles.main_menu_item_active : ""
        }`}
        href="/user/visit"
      >
        방문형
      </Link>
      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/user/review" ? styles.main_menu_item_active : ""
        }`}
        href="/user/review"
      >
        구매평
      </Link>

      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/user/reporter" ? styles.main_menu_item_active : ""
        }`}
        href="/user/reporter"
      >
        기자단
      </Link>
      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/user/mission" ? styles.main_menu_item_active : ""
        }`}
        href="/user/mission"
      >
        미션형
      </Link>
    </section>
  );
}
