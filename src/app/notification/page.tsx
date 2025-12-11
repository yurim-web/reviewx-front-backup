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
 * - 컴포넌트: SubHeader
 * - CSS: notification.module.css
 *
 * 주요 기능:
 * - 알림 목록 표시 (라벨, 내용, 시간)
 * - 알림 타입별 색상 구분 (신고/반려: 빨강, 문의: 파랑)
 * - 메인 헤더 숨김 처리 (SubHeader 사용)
 *
 * React 핵심 개념:
 * - useState: 알림 목록 상태 관리
 * - useEffect: 컴포넌트 마운트 시 데이터 로드 (향후 API 연동 시 사용)
 * - map: 알림 목록을 반복 렌더링
 * - 조건부 렌더링: 빈 상태 메시지 표시
 */

"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "@/styles/user/notification/notification.module.css";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";

/**
 * 알림 타입 정의
 * - type: 알림의 종류를 구분하는 필드
 *   - "report": 신고 발생 (빨간색 라벨)
 *   - "reject": 반려 발생 (빨간색 라벨)
 *   - "inquiry": 카카오톡 문의 (파란색 라벨)
 * - label: 알림 라벨 텍스트 (화면에 표시되는 라벨)
 * - message: 알림 내용 텍스트
 * - time: 알림 발생 시간 (YYYY-MM-DD HH:mm 형식)
 */
interface NotificationItem {
  id: number;
  type: "report" | "reject" | "inquiry";
  label: string;
  message: string;
  time: string;
}

/**
 * 임시 목업 데이터
 * 실제 프로젝트에서는 API를 통해 서버에서 알림 데이터를 가져옵니다.
 * 현재는 개발 및 디자인 확인을 위한 샘플 데이터입니다.
 */
const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "report",
    label: "신고 발생",
    message: "캠페인 · 콘텐츠 신고가 발생했습니다. 신고 내역을 확인해 주세요.",
    time: "2025-09-01 18:35",
  },
  {
    id: 2,
    type: "reject",
    label: "반려 발생",
    message: "캠페인 · 콘텐츠 반려가 발생했습니다. 반려 상태를 분류해 주세요.",
    time: "2025-09-01 18:35",
  },
  {
    id: 3,
    type: "inquiry",
    label: "카카오톡 문의",
    message: "신규 채팅 문의가 2건 있습니다.",
    time: "2025-09-01 18:35",
  },
];

/**
 * 알림 페이지 메인 컴포넌트
 *
 * 컴포넌트 구조:
 * 1. SubHeader: 상단 고정 헤더 (뒤로가기, 가이드북, 마이페이지 링크)
 * 2. page_header: "알림" 제목이 있는 헤더 섹션
 * 3. notification_list: 알림 목록 영역
 *    - 각 알림 아이템은 notification_item으로 렌더링
 *    - 빈 상태일 경우 empty_state 표시
 */
export default function NotificationPage() {
  /**
   * 현재 경로 확인
   * usePathname Hook: Next.js에서 현재 경로를 가져오는 Hook
   * - manager_ga나 manager_sa에서 접근한 경우 SubHeader를 숨김
   */
  const pathname = usePathname();

  /**
   * SubHeader 표시 여부 결정
   * - manager_ga나 manager_sa에서 접근한 경우: SubHeader 숨김 (이미 헤더가 있음)
   * - 그 외의 경우: SubHeader 표시
   *
   * useState Hook: 컴포넌트의 상태를 관리하는 Hook
   * - showSubHeader: SubHeader를 표시할지 여부를 저장하는 상태
   * - 초기값: true (기본적으로 SubHeader 표시)
   */
  const [showSubHeader, setShowSubHeader] = useState(true);

  /**
   * useEffect Hook: 컴포넌트가 마운트되거나 의존성이 변경될 때 실행
   * - 의존성 배열 [pathname]: pathname이 변경될 때마다 실행
   * - 이전 경로를 확인하여 manager_ga나 manager_sa에서 접근했는지 판단
   */
  useEffect(() => {
    // 이전 경로 확인 (document.referrer 또는 sessionStorage 사용)
    const referrer = document.referrer;
    // manager_ga나 manager_sa에서 접근한 경우 SubHeader 숨김
    if (referrer.includes("/manager_ga") || referrer.includes("/manager_sa")) {
      setShowSubHeader(false);
    } else {
      setShowSubHeader(true);
    }
  }, [pathname]);

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
   * 삼항 연산자 사용:
   * - 조건 ? 값1 : 값2 형태
   * - type이 "inquiry"이면 "inquiry" 클래스, 아니면 "report" 클래스 반환
   *
   * CSS 모듈 주의사항:
   * - CSS 모듈은 클래스명을 해시화하므로 .class1.class2 같은 결합 선택자는 작동하지 않음
   * - 따라서 별도의 클래스명을 사용해야 함 (notification_label_report, notification_label_inquiry)
   *
   * @param type - 알림 타입 ("report" | "reject" | "inquiry")
   * @returns CSS 클래스명
   */
  const getLabelClassName = (type: NotificationItem["type"]): string => {
    return type === "inquiry"
      ? styles.notification_label_inquiry
      : styles.notification_label_report;
  };

  return (
    <div
      className={`${styles.notification_container} ${
        !showSubHeader ? styles.no_subheader : ""
      }`.trim()}
    >
      {/* 
        서브헤더: 조건부 렌더링
        - manager_ga나 manager_sa에서 접근한 경우: SubHeader 숨김 (이미 헤더가 있음)
        - 그 외의 경우: SubHeader 표시
        - 뒤로가기 버튼
        - 가이드북 링크
        - 마이페이지 링크
        - 메인 헤더를 자동으로 숨김 처리
      */}
      {showSubHeader && <SubHeader />}

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.main_content}>
        {/* 
          페이지 제목
          - PageTitle 컴포넌트 사용: 공지사항 페이지와 동일한 패턴
          - sticky 포지션: 스크롤 시 SubHeader 아래에 고정
          - 배경색: white (PageTitle 컴포넌트에서 처리)
        */}
        <PageTitle title="알림" />

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
