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
          pathname === "/delivery" ? styles.main_menu_item_active : ""
        }`}
        href="/delivery"
      >
        배송형
      </Link>
      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/visit" ? styles.main_menu_item_active : ""
        }`}
        href="/visit"
      >
        방문형
      </Link>
      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/review" ? styles.main_menu_item_active : ""
        }`}
        href="/review"
      >
        구매평
      </Link>
      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/experience" ? styles.main_menu_item_active : ""
        }`}
        href="/experience"
      >
        체험단
      </Link>
      <Link
        className={`${styles.main_menu_item} ${
          pathname === "/reporter" ? styles.main_menu_item_active : ""
        }`}
        href="/reporter"
      >
        기자단
      </Link>
    </section>
  );
}
