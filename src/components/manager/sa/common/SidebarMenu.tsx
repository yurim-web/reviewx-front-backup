/* ========================================
   📋 SA 관리자 사이드바 메뉴 컴포넌트
   ======================================== */

/**
 * SA 관리자 사이드바 메뉴 컴포넌트
 *
 * 목적: SA 관리자 페이지의 왼쪽 사이드바에 표시되는 네비게이션 메뉴입니다.
 *
 * 사용 페이지:
 * - /manager_sa (SA 관리자 페이지)
 *
 * 주요 기능:
 * - 홈 메뉴 (대시보드)
 * - 캠페인 메뉴 (진행 현황)
 * - 운영 메뉴 (이용 제한 내역)
 * - 정산 메뉴 (출금 현황, 출금 요청, 결제 내역)
 * - 회원 메뉴 (리뷰어 목록, 파트너 목록, 관리자 목록)
 * - 커뮤니티 메뉴 (게시글 목록, 카테고리 관리)
 *
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
// GA/SA 사이드바는 동일한 스타일을 사용하므로 GA 사이드바 스타일 재사용
import styles from "@/styles/manager_ga/layout/sidebar.module.css";

// 메뉴 아이템 타입 정의
interface MenuItem {
  label: string;
  path: string;
  icon_name: string; // 아이콘 이름 (예: "dashboard", "progress" 등)
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
      items: [
        { label: "대시보드", path: "/manager_sa", icon_name: "dashboard" },
      ],
    },
    {
      title: "캠페인",
      items: [
        {
          label: "진행 현황",
          path: "/manager_sa/campaign/progress",
          icon_name: "progress",
        },
      ],
    },
    {
      title: "운영",
      items: [
        {
          label: "이용 제한 내역",
          path: "/manager_sa/member/blacklist",
          icon_name: "blacklist",
        },
      ],
    },
    {
      title: "정산",
      items: [
        {
          label: "출금 현황",
          path: "/manager_sa/settlement/withdrawal",
          icon_name: "withdrawal",
        },
        {
          label: "출금 요청",
          path: "/manager_sa/settlement/withdrawal_request",
          icon_name: "withdrawal_request",
        },
        {
          label: "결제 내역",
          path: "/manager_sa/settlement/payment_history",
          icon_name: "payment_history",
        },
      ],
    },
    {
      title: "회원",
      items: [
        {
          label: "리뷰어 목록",
          path: "/manager_sa/member/reviewers",
          icon_name: "reviewers",
        },
        {
          label: "파트너 목록",
          path: "/manager_sa/member/partners",
          icon_name: "partners",
        },
        {
          label: "관리자 목록",
          path: "/manager_sa/member/admins",
          icon_name: "admins",
        },
      ],
    },
    {
      title: "커뮤니티",
      items: [
        {
          label: "게시글 목록",
          path: "/manager_sa/community/posts",
          icon_name: "posts",
        },
        {
          label: "카테고리 관리",
          path: "/manager_sa/community/categories",
          icon_name: "categories",
        },
      ],
    },
  ];

  // 아이콘 경로를 반환하는 함수
  // active 상태에 따라 일반 아이콘 또는 활성화된 아이콘을 반환합니다
  const getIconPath = (icon_name: string, active: boolean) => {
    const icon_suffix = active ? "_active" : "";
    return `/images/management_page/sidemenu/${icon_name}${icon_suffix}.svg`;
  };

  // 현재 경로가 메뉴 아이템의 경로와 일치하는지 확인하는 함수
  const isActive = (path: string) => {
    // 정확히 일치하는 경우 활성화
    if (pathname === path) {
      return true;
    }

    // /manager_sa는 정확히 일치할 때만 활성화 (하위 경로 제외)
    if (path === "/manager_sa") {
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
            // 활성화 상태에 따라 적절한 아이콘 경로를 가져옵니다
            const icon_path = getIconPath(item.icon_name, active);
            return (
              <Link
                key={itemIndex}
                href={item.path}
                className={`${styles.menu_item} ${
                  active ? styles.menu_item_active : ""
                }`}
              >
                {/* 메뉴 아이템 아이콘 */}
                {/* Next.js의 Image 컴포넌트를 사용하여 SVG 아이콘을 표시합니다 */}
                <Image
                  src={icon_path}
                  alt={`${item.label} 아이콘`}
                  width={16}
                  height={16}
                  className={styles.menu_icon}
                />
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
