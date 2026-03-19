/* ========================================
   서브 헤더 컴포넌트
   ======================================== */

/**
 * SubHeader
 *
 * 목적: 캠페인 상세 등 하위 페이지에서 사용하는 고정 헤더 (뒤로가기, 알림, 마이페이지)
 *
 * 사용 페이지:
 * - /campaign/:type/:id (캠페인 상세 페이지)
 * - 기타 하위 페이지
 */

"use client";

import { useEffect, useState, MouseEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "@/styles/fragments/header.module.css";
import HeaderSearch from "@/components/fragments/HeaderSearch";
import { useAuth } from "@/hooks/useAuth";
import { useHasNotifications } from "@/hooks/useHasNotifications";

interface SubHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export default function SubHeader({ title, showBackButton: _showBackButton }: SubHeaderProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const hasNotifications = useHasNotifications();

  // Hydration 에러 방지
  const [isMounted, setIsMounted] = useState(false);
  // 모바일 여부 감지
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // 검색 아이콘 경로 (모바일/PC 구분)
  const getSearchIconSrc = () => {
    return isMobile ? "/images/header/mobile/mo_search.svg" : "/images/header/header_search.svg";
  };

  // 알림 아이콘: 비로그인 → 무조건 비활성(알림 X), 로그인 시 알림 1개 이상이면 활성
  const getNotificationIconSrc = () => {
    if (!isMounted) {
      return "/images/header/notification_icon.svg";
    }
    // 비로그인 → 항상 비활성 아이콘
    if (!user) {
      return isMobile
        ? "/images/header/mobile/mo_notification_icon.svg"
        : "/images/header/notification_icon.svg";
    }
    const effective_has_notifications = hasNotifications;
    if (isMobile) {
      return effective_has_notifications
        ? "/images/header/mobile/mo_notification_ok.svg"
        : "/images/header/mobile/mo_notification_icon.svg";
    }
    return effective_has_notifications
      ? "/images/header/notification_ok.svg"
      : "/images/header/notification_icon.svg";
  };

  // 사용자 아이콘 경로 (모바일/PC 구분)
  const getUserIconSrc = () => {
    return isMobile ? "/images/header/mobile/mo_user.svg" : "/images/header/header_user.svg";
  };

  // 로고 이미지 경로 (모바일/PC 구분)
  const getLogoSrc = () => {
    if (!isMounted) {
      return "/images/header/vx_header_logo.svg";
    }
    return isMobile
      ? "/images/header/mobile/mo_header_vx_logo.svg"
      : "/images/header/vx_header_logo.svg";
  };

  // 알림 아이콘 클릭 핸들러
  const handleNotificationClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // 로그인하지 않은 상태에서는 알림 페이지로 이동하지 않음
    if (!user) {
      event.preventDefault();
      router.push("/user/login");
      return;
    }
    // 로그인된 상태에서는 기본 링크 동작으로 /user/notification 이동
  };

  return (
    // 항상 fixed 클래스 적용
    <div className={styles.gradient_bar}>
      <div className={styles.header_controls}>
        {/* 모바일에서 타이틀이 있으면 뒤로가기 + 타이틀 표시 */}
        {isMobile && title ? (
          <>
            <button className={styles.back_button} onClick={handleGoBack}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/header/mobile/mo_back_btn.svg" alt="뒤로가기" />
            </button>
            <h1 className={styles.mobile_title}>{title}</h1>
          </>
        ) : isMobile ? (
          <Link href="/user" className={styles.header_logo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getLogoSrc()} alt="VX 로고" />
          </Link>
        ) : (
          <button className={styles.back_button} onClick={handleGoBack}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/header/header_arrow_back.svg" alt="뒤로가기" />
          </button>
        )}
        <div className={styles.right_icons}>
          {/* 검색 */}
          <HeaderSearch searchIconSrc={getSearchIconSrc()} />
          {/* 알림 아이콘 (로그인 상태에 따라 동작) */}
          <Link
            href="/user/notification"
            className={styles.notification_icon}
            onClick={handleNotificationClick}
            aria-label="알림"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getNotificationIconSrc()} alt="bell_icon" />
          </Link>
          {/* 마이페이지로 연결 */}
          <Link
            href={
              pathname?.startsWith("/partner") ? "/partner/campaign_management" : "/user/mypage"
            }
            className={styles.user_icon}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getUserIconSrc()} alt="user" />
          </Link>
        </div>
      </div>
    </div>
  );
}
