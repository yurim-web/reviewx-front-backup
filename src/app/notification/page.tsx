/* ========================================
   🔔 알림 페이지
   ======================================== */

/**
 * 알림 페이지
 *
 * 목적: 사용자에게 전달되는 다양한 알림을 목록 형태로 보여주는 페이지입니다.
 *       신고 발생, 반려 발생, 카카오톡 문의 등의 알림을 확인할 수 있습니다.
 *
 * 페이지 경로:
 * - /notification
 *
 * 사용 파일:
 * - 컴포넌트: Header, ManagerGAHeader
 * - CSS: notification.module.css
 *
 * 주요 기능:
 * - 알림 목록 표시 (라벨, 내용, 시간)
 * - 알림 타입별 색상 구분 (신고/반려: 빨강, 문의: 파랑)
 * - 경로에 따라 적절한 헤더 표시 (manager_ga/manager_sa: ManagerGAHeader, 그 외: Header)

 */

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "@/styles/user/notification/notification.module.css";
import Header from "@/components/fragments/Header";
import ManagerGAHeader from "@/components/manager/ga/common/ManagerGAHeader";
import SidebarMenuGA from "@/components/manager/ga/common/SidebarMenu";
import SidebarMenuSA from "@/components/manager/sa/common/SidebarMenu";
import PageTitle from "@/components/fragments/PageTitle";
// 관리자 페이지 레이아웃 스타일 (사이드바가 있을 때 사용)
import "@/styles/manager_ga/layout.css";
// 알림 목업 데이터
import {
  mockNotifications,
  NotificationItem,
} from "@/data/notification/notificationData";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";

/**
 * 알림 페이지 메인 컴포넌트
 *
 * 컴포넌트 구조:
 * 1. Header/ManagerGAHeader: 상단 고정 헤더 (경로에 따라 다름)
 * 2. page_header: "알림" 제목이 있는 헤더 섹션
 * 3. notification_list: 알림 목록 영역
 *    - 각 알림 아이템은 notification_item으로 렌더링
 *    - 빈 상태일 경우 empty_state 표시
 */
export default function NotificationPage() {
  /**
   * 현재 경로 확인
   * usePathname Hook: Next.js에서 현재 경로를 가져오는 Hook
   * - manager_ga나 manager_sa에서 접근한 경우 해당 헤더 사용
   */
  const pathname = usePathname();

  /**
   * 헤더 타입 결정
   * - manager_ga에서 접근한 경우: ManagerGAHeader 사용
   * - manager_sa에서 접근한 경우: ManagerGAHeader 사용 (현재는 ManagerSAHeader가 없어서 재사용)
   * - 그 외의 경우: 일반 Header 사용
   *
   * useState Hook: 컴포넌트의 상태를 관리하는 Hook
   * - headerType: 사용할 헤더 타입을 저장하는 상태
   * - 초기값: "default" (서버와 클라이언트에서 동일하게 유지하여 Hydration 오류 방지)
   * - mounted: 클라이언트에서 마운트되었는지 여부 (Hydration 오류 방지)
   */
  const [headerType, setHeaderType] = useState<
    "default" | "manager_ga" | "manager_sa"
  >("default");

  // 클라이언트에서만 실행되도록 mounted 상태 추가
  const [mounted, setMounted] = useState(false);

  /**
   * useEffect Hook: 컴포넌트가 마운트되거나 의존성이 변경될 때 실행
   * - 첫 번째 useEffect: 클라이언트에서 마운트되었음을 표시 (Hydration 오류 방지)
   * - 두 번째 useEffect: URL 쿼리 파라미터, sessionStorage, 또는 referrer를 확인하여 manager_ga나 manager_sa에서 접근했는지 판단
   */
  useEffect(() => {
    // 클라이언트에서 마운트되었음을 표시
    setMounted(true);
  }, []);

  useEffect(() => {
    // mounted가 true일 때만 실행 (Hydration 오류 방지)
    if (!mounted) return;

    // 1. URL 쿼리 파라미터 확인 (가장 우선순위)
    const urlParams = new URLSearchParams(window.location.search);
    const managerType = urlParams.get("manager");

    if (managerType === "ga") {
      setHeaderType("manager_ga");
      sessionStorage.setItem("notification_manager_type", "manager_ga");
      return;
    } else if (managerType === "sa") {
      setHeaderType("manager_sa");
      sessionStorage.setItem("notification_manager_type", "manager_sa");
      return;
    }

    // 2. sessionStorage 확인
    const storedManagerType = sessionStorage.getItem(
      "notification_manager_type"
    );
    if (storedManagerType === "manager_ga") {
      setHeaderType("manager_ga");
      return;
    } else if (storedManagerType === "manager_sa") {
      setHeaderType("manager_sa");
      return;
    }

    // 3. document.referrer 확인 (마지막 fallback)
    const referrer = document.referrer;
    if (referrer.includes("/manager_ga")) {
      setHeaderType("manager_ga");
      sessionStorage.setItem("notification_manager_type", "manager_ga");
    } else if (referrer.includes("/manager_sa")) {
      setHeaderType("manager_sa");
      sessionStorage.setItem("notification_manager_type", "manager_sa");
    } else {
      setHeaderType("default");
    }
  }, [pathname, mounted]);

  /**
   * 알림 목록 상태
   * 향후 API 연동 시 useState와 useEffect를 사용하여 서버에서 데이터를 가져올 수 있습니다.
   *
   * 예시:
   * const [notifications, setNotifications] = useState<NotificationItem[]>([]);
   *
   * useEffect(() => {
   *   // API 호출
   *   fetchNotifications().then(setNotifications);
   * }, []);
   */
  const notifications = mockNotifications;

  /**
   * 알림 라벨 색상 클래스 결정 함수
   *
   * CSS 모듈 주의사항:
   * - CSS 모듈은 클래스명을 해시화하므로 .class1.class2 같은 결합 선택자는 작동하지 않음
   * - 따라서 별도의 클래스명을 사용해야 함
   *
   * @param type - 알림 타입 ("withdrawal" | "urgent_withdrawal" | "block")
   * @returns CSS 클래스명
   */
  const getLabelClassName = (type: NotificationItem["type"]): string => {
    switch (type) {
      case "withdrawal":
        return styles.notification_label_withdrawal;
      case "urgent_withdrawal":
        return styles.notification_label_urgent_withdrawal;
      case "block":
        return styles.notification_label_block;
      default:
        return styles.notification_label_block;
    }
  };

  // Hydration 오류 방지: 서버와 클라이언트에서 동일한 초기 렌더링
  // mounted가 false일 때는 기본 Header만 표시
  if (!mounted) {
    return (
      <div className={styles.notification_container}>
        <Header />
        <main className={styles.main_content}>
          <ManagerPageTitle title="알림" />
          <section className={styles.notification_list}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className={styles.notification_item}>
                  <div className={styles.notification_content}>
                    <div className={styles.notification_left}>
                      <p
                        className={`${
                          styles.notification_label
                        } ${getLabelClassName(notification.type)}`.trim()}
                      >
                        {notification.label}
                      </p>
                      <p className={styles.notification_message}>
                        {notification.message}
                      </p>
                    </div>
                    <p className={styles.notification_time}>
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.empty_state}>
                <p className={styles.empty_text}>알림이 없습니다.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div
      className={`${styles.notification_container} ${
        headerType === "manager_ga" || headerType === "manager_sa"
          ? styles.has_sidebar
          : ""
      }`.trim()}
    >
      {/* 
        헤더: 조건부 렌더링
        - manager_ga에서 접근한 경우: ManagerGAHeader 사용
        - manager_sa에서 접근한 경우: ManagerGAHeader 사용 (현재는 ManagerSAHeader가 없어서 재사용)
        - 그 외의 경우: 일반 Header 사용
      */}
      {headerType === "manager_ga" ? (
        <ManagerGAHeader managerType="ga" />
      ) : headerType === "manager_sa" ? (
        <ManagerGAHeader managerType="sa" />
      ) : (
        <Header />
      )}

      {/* 
        사이드 메뉴: 조건부 렌더링
        - manager_ga에서 접근한 경우: GA 사이드바 메뉴 사용
        - manager_sa에서 접근한 경우: SA 사이드바 메뉴 사용
        - 그 외의 경우: 사이드바 없음
      */}
      {headerType === "manager_ga" && <SidebarMenuGA />}
      {headerType === "manager_sa" && <SidebarMenuSA />}

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.main_content}>
        <ManagerPageTitle title="알림" />

        {/* 알림 목록 섹션 */}
        <section className={styles.notification_list}>
          {/* 
            조건부 렌더링: 알림이 있을 때와 없을 때를 구분
            - notifications.length > 0: 알림이 있는 경우 목록 렌더링
            - 그 외: 빈 상태 메시지 표시
          */}
          {notifications.length > 0 ? (
            /**
             * map 함수를 사용한 리스트 렌더링
             * - 배열의 각 요소를 React 컴포넌트로 변환
             * - key prop: React가 각 요소를 구분하기 위한 고유 식별자 (필수)
             * - key는 배열의 인덱스가 아닌 고유한 id를 사용하는 것이 권장됨
             */
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={styles.notification_item}
                /**
                 * onClick 이벤트 핸들러 (향후 구현)
                 * 알림 클릭 시 상세 페이지로 이동하거나 모달을 열 수 있습니다.
                 *
                 * 예시:
                 * onClick={() => router.push(`/notification/${notification.id}`)}
                 */
              >
                {/* 알림 아이템 내부 레이아웃 */}
                <div className={styles.notification_content}>
                  {/* 왼쪽 영역: 라벨 + 내용 */}
                  <div className={styles.notification_left}>
                    {/* 
                      알림 라벨
                      - 동적 클래스명: getLabelClassName 함수로 타입에 맞는 색상 클래스 적용
                      - 템플릿 리터럴: `${styles.notification_label} ${getLabelClassName(...)}`
                      - trim(): 공백 제거
                      - CSS 모듈에서는 클래스 결합 선택자가 작동하지 않으므로 별도 클래스 사용
                    */}
                    <p
                      className={`${
                        styles.notification_label
                      } ${getLabelClassName(notification.type)}`.trim()}
                    >
                      {notification.label}
                    </p>

                    {/* 알림 내용 */}
                    <p className={styles.notification_message}>
                      {notification.message}
                    </p>
                  </div>

                  {/* 오른쪽 영역: 시간 */}
                  <p className={styles.notification_time}>
                    {notification.time}
                  </p>
                </div>
              </div>
            ))
          ) : (
            /**
             * 빈 상태 메시지
             * 알림이 없을 때 사용자에게 안내 메시지를 표시합니다.
             */
            <div className={styles.empty_state}>
              <p className={styles.empty_text}>알림이 없습니다.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/**
 * 학습 포인트 정리:
 *
 * 1. React 컴포넌트 구조
 *    - 함수형 컴포넌트: export default function 컴포넌트명()
 *    - JSX 반환: return 문에서 HTML과 유사한 JSX 문법 사용
 *
 * 2. CSS 모듈 사용법
 *    - import styles from "경로"
 *    - className={styles.클래스명} 형태로 사용
 *    - 클래스명은 스네이크 케이스로 작성 (notification_item)
 *
 * 3. 조건부 렌더링
 *    - 삼항 연산자: 조건 ? true일 때 : false일 때
 *    - && 연산자: 조건 && 렌더링할 내용
 *
 * 4. 리스트 렌더링
 *    - map 함수: 배열.map((item) => <컴포넌트 key={item.id} />)
 *    - key prop: 반드시 고유한 값 사용 (id 권장)
 *
 * 5. 동적 클래스명
 *    - 템플릿 리터럴: `${styles.class1} ${styles.class2}`
 *    - 조건에 따라 다른 클래스 적용
 *
 * 6. TypeScript 인터페이스
 *    - interface로 데이터 구조 정의
 *    - 타입 안정성 제공
 *
 * 추천 학습 순서:
 * 1. JSX 기본 문법 (태그, 속성, 중괄호)
 * 2. 컴포넌트와 props
 * 3. 조건부 렌더링과 리스트 렌더링
 * 4. CSS 모듈 사용법
 * 5. TypeScript 기본 타입과 인터페이스
 */
