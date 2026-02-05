/* ========================================
   🏢 파트너 전용 서브헤더 컴포넌트
   ======================================== */

/**
 * 파트너 전용 서브헤더 컴포넌트
 *
 * 목적: 파트너 캠페인 신청내역 페이지와 캠페인 콘텐츠 내역 페이지에서 사용되는 서브헤더입니다.
 *       뒤로가기 버튼과 파트너 전용 기능들을 포함합니다.
 *
 * 사용 페이지:
 * - /partner/campaign_application/* (캠페인 신청내역 페이지)
 * - /partner/campaign_contents/* (캠페인 콘텐츠 내역 페이지)
 *
 * 주요 기능:
 * - 뒤로가기 버튼 (왼쪽)
 * - 검색 아이콘
 * - 새 캠페인 등록 버튼
 * - 알림 아이콘
 * - 가이드북 아이콘
 * - 사용자 아이콘 (마이페이지로 이동)
 * - 항상 상단에 고정됨 (position: fixed)
 * - 메인 헤더를 자동으로 숨김
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "@/styles/fragments/header.module.css";
import HeaderSearch from "@/components/fragments/HeaderSearch";
import { mockPartnerNotifications } from "@/data/notification/notificationData";

/**
 * 파트너 서브헤더 컴포넌트
 *
 * 📌 React 컴포넌트 기본 구조:
 * - 함수형 컴포넌트: React 16.8 이후 권장 방식
 * - "use client": Next.js 13+ App Router에서 클라이언트 컴포넌트임을 명시
 * - useEffect: 컴포넌트 마운트/언마운트 시 부수 효과(side effect) 처리
 * - useRouter: Next.js에서 프로그래밍 방식으로 페이지 이동
 * - usePathname: 현재 경로 정보 가져오기
 */
export default function PartnerSubHeader() {
  /**
   * useRouter: Next.js에서 페이지 이동을 위한 Hook
   * - router.back(): 이전 페이지로 이동
   * - router.push(): 특정 경로로 이동
   */
  const router = useRouter();

  /**
   * usePathname: 현재 경로를 가져오는 Hook
   * - 예: "/partner/campaign_application/delivery/delivery_1"
   */
  const pathname = usePathname();

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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 캠페인 콘텐츠 내역 페이지에서는 모바일에서 숨김 처리
  const isCampaignContentsPage = pathname?.includes('/partner/campaign_contents/');
  const shouldHideOnMobile = isCampaignContentsPage && isMobile;

  /**
   * 알림 아이콘 경로 결정
   * - 알림이 있으면 notification_ok.svg 사용
   * - 알림이 없으면 notification_icon.svg 사용
   *
   * 📌 조건부 값 할당:
   * - 삼항 연산자(? :)를 사용하여 조건에 따라 다른 값 할당
   * - mockPartnerNotifications.length > 0: 알림 데이터가 있는지 확인
   */
  const has_notifications = mockPartnerNotifications.length > 0;

  // 알림 아이콘 경로 (모바일/PC 구분)
  const getNotificationIconSrc = () => {
    if (!isMounted) {
      return "/images/header/notification_icon.svg";
    }

    // 모바일 전용 아이콘
    if (isMobile) {
      return has_notifications
        ? "/images/header/mobile/mo_notification_ok.svg"
        : "/images/header/mobile/mo_notification_icon.svg";
    }

    // PC 아이콘
    return has_notifications
      ? "/images/header/notification_ok.svg"
      : "/images/header/notification_icon.svg";
  };

  // 검색 아이콘 경로 (모바일/PC 구분)
  const getSearchIconSrc = () => {
    if (!isMounted) {
      return "/images/header/header_search.svg";
    }
    return isMobile
      ? "/images/header/mobile/mo_search.svg"
      : "/images/header/header_search.svg";
  };

  // 사용자 아이콘 경로 (모바일/PC 구분)
  const getUserIconSrc = () => {
    if (!isMounted) {
      return "/images/header/header_user.svg";
    }
    return isMobile
      ? "/images/header/mobile/mo_user.svg"
      : "/images/header/header_user.svg";
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

  /**
   * 메인 헤더 숨기기 처리
   *
   * 📌 useEffect Hook:
   * - 컴포넌트가 마운트될 때(화면에 표시될 때) 실행되는 함수
   * - 의존성 배열이 비어있으면([]) 컴포넌트 마운트/언마운트 시에만 실행
   *
   * 📌 DOM 조작:
   * - document.querySelector(): HTML 요소를 찾는 메서드
   * - header.style.display: CSS 스타일 속성 변경
   *
   * 📌 Cleanup 함수:
   * - useEffect의 return 값으로 함수를 반환하면 컴포넌트 언마운트 시 실행
   * - 메인 헤더를 다시 표시하여 다른 페이지에서 정상적으로 보이도록 함
   */
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    // cleanup 함수: 컴포넌트가 언마운트될 때 실행
    return () => {
      if (header) header.style.display = "block";
    };
  }, []); // 빈 의존성 배열: 컴포넌트 마운트/언마운트 시에만 실행

  /**
   * 뒤로가기 함수
   *
   * 📌 조건부 네비게이션:
   * - pathname?.startsWith(): 경로가 특정 문자열로 시작하는지 확인
   * - ?. (옵셔널 체이닝): pathname이 null/undefined일 수 있으므로 안전하게 접근
   * - router.back(): 브라우저 히스토리를 사용하여 이전 페이지로 이동
   * - router.push(): 특정 경로로 프로그래밍 방식으로 이동
   */
  const handleGoBack = () => {
    // 파트너 캠페인 생성 페이지에서는 홈으로 이동
    if (pathname?.startsWith("/partner/campaign/create")) {
      router.push("/partner");
    } else {
      // 그 외 모든 경우 이전 페이지로 이동
      router.back();
    }
  };

  return (
    /**
     * 서브헤더 컨테이너
     *
     * 📌 CSS 모듈:
     * - styles.partner_sub_header: CSS 모듈에서 가져온 클래스명
     * - 고정 위치(position: fixed)로 상단에 고정
     * - 모바일에서는 숨김 처리 (캠페인 콘텐츠 내역 페이지에서만)
     */
    <div className={`${styles.gradient_bar} ${shouldHideOnMobile ? styles.hide_on_mobile : ''}`}>
      <div className={styles.header_controls}>
        {/* 뒤로가기 버튼 */}
        {/* 📌 버튼 이벤트 핸들러:
            - onClick: 버튼 클릭 시 실행될 함수
            - handleGoBack: 이전 페이지로 이동하는 함수
        */}
        <button
          className={styles.back_button}
          onClick={handleGoBack}
          aria-label="뒤로가기"
        >
          <img src="/images/header/header_arrow_back.svg" alt="뒤로가기" />
        </button>

        {/* 오른쪽 아이콘 그룹 */}
        <div className={styles.right_icons}>
          {/* 새 캠페인 등록: PC에서는 버튼, 모바일에서는 아이콘 */}
          {isMobile ? (
            <Link
              href="/partner/campaign/create"
              className={styles.notification_icon}
              aria-label="새 캠페인 등록"
            >
              <img src="/images/header/mobile/mo_partner_campaign.svg" alt="새 캠페인 등록" />
            </Link>
          ) : (
            <Link
              href="/partner/campaign/create"
              className={styles.new_campaign_button}
            >
              새 캠페인 등록
            </Link>
          )}

          {/* 검색 아이콘 */}
          {/* 📌 컴포넌트 재사용:
              - HeaderSearch: 기존에 만들어진 검색 컴포넌트 재사용
              - search_path prop: 검색 결과 페이지 경로 전달
          */}
          <HeaderSearch searchIconSrc={getSearchIconSrc()} search_path="/partner/search" />

          {/* 알림 아이콘 */}
          <Link
            href="/partner/notification"
            className={styles.notification_icon}
            aria-label="알림"
          >
            <img src={getNotificationIconSrc()} alt="알림" />
          </Link>

          {/* 가이드북 아이콘 - PC에서만 표시 */}
          {/* 📌 외부 링크:
              - target="_blank": 새 탭에서 열기
              - rel="noopener noreferrer": 보안을 위한 속성
          */}
          {!isMobile && (
            <a
              href="https://markx.dev/guide_book"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bookmark_icon}
              aria-label="가이드북"
            >
              <img src="/images/header/header_book.svg" alt="가이드북" />
            </a>
          )}

          {/* 사용자 아이콘 (마이페이지) */}
          <Link
            href="/partner/campaign_management"
            className={styles.user_icon}
            aria-label="마이페이지"
          >
            <img src={getUserIconSrc()} alt="사용자" />
          </Link>
        </div>
      </div>
    </div>
  );
}
