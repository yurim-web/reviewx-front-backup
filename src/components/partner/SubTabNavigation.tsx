/* ========================================
   📑 파트너 서브 탭 네비게이션 컴포넌트
   ======================================== */

/**
 * 파트너 서브 탭 네비게이션 컴포넌트
 *
 * 목적: 파트너 마이페이지에서 사용되는 서브 탭 네비게이션을 제공합니다.
 *
 * 사용 위치:
 * - /partner/mypage (파트너 마이페이지 메인)
 * - /partner/mypage/profile (파트너 프로필 페이지)
 * - /partner/mypage/channel (파트너 채널 페이지)
 *
 * 주요 기능:
 * - 파트너 마이페이지의 서브 탭 네비게이션 UI 제공
 * - 현재는 "프로필" 탭만 표시 (추후 확장 가능)
 * - 탭 클릭 시 해당 페이지로 이동
 *
 */

"use client";

import { useRouter } from "next/navigation";
import styles from "../../styles/user/mypage/navigation.module.css";

/**
 * 파트너 서브 탭 네비게이션 Props 인터페이스
 *
 * 설명:
 * - TypeScript 인터페이스는 컴포넌트가 받을 props의 타입을 정의합니다.
 * - 이를 통해 컴포넌트 사용 시 타입 안정성을 보장할 수 있습니다.
 *
 * 속성 설명:
 * - activeSubTab: 현재 활성화된 서브 탭 (현재는 "profile"만 가능)
 * - setActiveSubTab: 서브 탭을 변경하는 함수
 */
interface PartnerSubTabNavigationProps {
  /** 현재 활성화된 서브 탭 */
  activeSubTab: "profile";
  /** 서브 탭 변경 핸들러 함수 */
  setActiveSubTab: (tab: "profile") => void;
}

/**
 * 파트너 서브 탭 네비게이션 컴포넌트
 *
 * 설명:
 * - 파트너 마이페이지에서 사용되는 서브 탭 네비게이션을 렌더링합니다.
 * - 현재는 "프로필" 탭만 표시되며, 클릭 시 프로필 페이지로 이동합니다.
 */
export default function PartnerSubTabNavigation({
  activeSubTab,
  setActiveSubTab,
}: PartnerSubTabNavigationProps) {
  // Next.js의 useRouter 훅을 사용하여 페이지 이동 기능 제공
  // 설명: useRouter는 Next.js에서 제공하는 클라이언트 사이드 라우팅 훅입니다.
  const router = useRouter();

  /**
   * 서브 탭 클릭 핸들러
   *
   * 설명:
   * - 탭을 클릭했을 때 실행되는 함수입니다.
   * - router.push()를 사용하여 해당 페이지로 이동합니다.
   *
   * 매개변수:
   * - tab: 클릭된 탭의 이름 (현재는 "profile"만 가능)
   */
  const handleSubTabClick = (tab: "profile") => {
    // router.push()를 사용하여 /partner/mypage/profile 페이지로 이동
    // 설명: Next.js의 클라이언트 사이드 네비게이션으로, 페이지 새로고침 없이 이동합니다.
    router.push("/partner/mypage/profile");
  };

  /**
   * JSX 반환
   *
   * 설명:
   * - React 컴포넌트는 JSX를 반환하여 화면에 렌더링합니다.
   * - className 속성에 CSS 모듈의 클래스를 적용합니다.
   */
  return (
    <div className={styles.sub_tab_container}>
      {/* 프로필 탭 버튼 */}
      <button
        className={`${styles.sub_tab_item} ${styles.active}`}
        onClick={() => handleSubTabClick("profile")}
      >
        프로필
      </button>
      {/* 서브 탭 인디케이터 (시각적 표시) */}
      <div className={styles.sub_tab_indicator} />
    </div>
  );
}
