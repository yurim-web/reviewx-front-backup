/* ========================================
   📋 GA 관리자 사이드바 메뉴 컴포넌트
   ======================================== */

/**
 * GA 관리자 사이드바 메뉴 컴포넌트
 *
 * 목적: GA 관리자 페이지의 왼쪽 사이드바에 표시되는 네비게이션 메뉴입니다.
 *
 * 사용 페이지:
 * - /manager_ga (GA 관리자 페이지)
 *
 * 주요 기능:
 * - 홈 메뉴 (대시보드)
 * - 캠페인 메뉴 (진행 현황, 반려 내역, 신고 내역, 템플릿 관리)
 * - 회원 메뉴 (리뷰어 목록, 파트너 목록, 차단 내역)
 * - 커뮤니티 메뉴 (게시글 목록)
 *
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/manager_ga/layout/sidebar.module.css";

// 메뉴 아이템 타입 정의
interface MenuItem {
  label: string;
  path: string;
}

// 메뉴 카테고리 타입 정의
interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export default function SidebarMenu() {
  // 현재 경로를 가져옵니다 (usePathname은 Next.js의 Hook)
  const pathname = usePathname();

  // 메뉴 구조 정의
  // 배열로 메뉴 카테고리를 정의합니다
  const menuCategories: MenuCategory[] = [
    {
      title: "홈",
      items: [{ label: "대시보드", path: "/manager_ga" }],
    },
    {
      title: "캠페인",
      items: [
        { label: "진행 현황", path: "/manager_ga/campaign/progress" },
        { label: "반려 내역", path: "/manager_ga/campaign/rejected" },
        { label: "신고 내역", path: "/manager_ga/campaign/reported" },
        { label: "템플릿 관리", path: "/manager_ga/campaign/templates" },
      ],
    },
    {
      title: "회원",
      items: [
        { label: "리뷰어 목록", path: "/manager_ga/member/reviewers" },
        { label: "파트너 목록", path: "/manager_ga/member/partners" },
        { label: "이용 제한 내역", path: "/manager_ga/member/blacklist" },
      ],
    },
    {
      title: "커뮤니티",
      items: [
        { label: "게시글 목록", path: "/manager_ga/community/posts" },
        { label: "카테고리 관리", path: "/manager_ga/community/categories" },
      ],
    },
  ];

  // 현재 경로가 메뉴 아이템의 경로와 일치하는지 확인하는 함수
  const isActive = (path: string) => {
    // 정확히 일치하는 경우 활성화
    if (pathname === path) {
      return true;
    }

    // /manager_ga는 정확히 일치할 때만 활성화 (하위 경로 제외)
    if (path === "/manager_ga") {
      return false;
    }

    // 다른 경로는 정확히 일치하거나 하위 경로인 경우 활성화
    return pathname?.startsWith(path + "/");
  };

  return (
    <aside className={styles.sidebar}>
      {/* 각 메뉴 카테고리를 순회하며 렌더링 */}
      {menuCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className={styles.menu_category}>
          {/* 카테고리 제목 */}
          <p className={styles.category_title}>{category.title}</p>

          {/* 카테고리 내 메뉴 아이템들 */}
          {category.items.map((item, itemIndex) => {
            const active = isActive(item.path);
            return (
              <Link
                key={itemIndex}
                href={item.path}
                className={`${styles.menu_item} ${
                  active ? styles.menu_item_active : ""
                }`}
              >
                {/* 메뉴 아이템 아이콘 (작은 회색 사각형) */}
                <div className={styles.menu_icon}></div>
                {/* 메뉴 아이템 라벨 */}
                <span
                  className={`${styles.menu_label} ${
                    active ? styles.menu_label_active : ""
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
