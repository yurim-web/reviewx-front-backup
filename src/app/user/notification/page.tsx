/* ========================================
   유저 알림 페이지
   ======================================== */

/**
 * UserNotificationPage
 *
 * 목적: 유저의 알림 내역을 표시하는 페이지
 *
 * 사용 페이지:
 * - /user/notification (알림)
 */

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/user/notification/notification.module.css";
import SubHeader from "@/components/fragments/SubHeader";
import NotificationList from "@/components/notification/NotificationList";
import PageTitle from "@/components/fragments/PageTitle";
import Toast from "@/components/common/toast/Toast";
import { useAuth } from "@/hooks/useAuth";
// 알림 목업 데이터 (향후 API로 대체)
import { mockReviewerNotifications } from "@/data/notification/notificationData";

interface StoredNotification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  created_at: string;
  campaign_id?: string;
  campaign_title?: string;
  is_read: boolean;
}

interface NotificationItem {
  id: string | number;
  category: string;
  message: string;
  time?: string;
  campaign_id?: number;
  campaign_name?: string;
  is_read: boolean;
  _source?: string;
}

export default function UserNotificationPage() {
  const { user } = useAuth();
  const router = useRouter();

  // 모바일 여부 감지
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 로그인 체크
  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      router.push("/user/login");
    }
  }, [user, router]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    mockReviewerNotifications as NotificationItem[]
  );
  const [isDeleteToastOpen, setIsDeleteToastOpen] = useState(false);

  // 무한 스크롤
  const PAGE_SIZE = 15;
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, notifications.length));
  }, [notifications.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  /**
   * localStorage에서 알림 불러오기
   */
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      try {
        const storedNotifications = localStorage.getItem("notifications");
        if (storedNotifications) {
          const allNotifications = JSON.parse(storedNotifications);

          // 현재 유저의 알림만 필터링
          const userNotifications = (allNotifications as StoredNotification[])
            .filter((notif) => notif.user_id === user.id)
            .map((notif) => {
              // 기존 알림 형식에 맞게 변환
              let category = "A_R10"; // 기본값: 출금 신청 카테고리

              // 알림 타입에 따라 카테고리 매핑
              if (notif.type === "campaign_selected") {
                category = "A_R1"; // 캠페인 선정
              } else if (notif.type === "campaign_rejected") {
                category = "A_R2"; // 캠페인 탈락 (A_R2를 임시로 사용)
              } else if (notif.type === "campaign_update") {
                category = "A_R2"; // 캠페인 수정
              } else if (notif.type === "withdrawal_completed") {
                category = "A_R11"; // 출금 승인
              } else if (notif.type === "withdrawal_requested") {
                category = "A_R10"; // 출금 신청
              } else if (notif.type === "withdrawal_rejected") {
                category = "A_R12"; // 출금 반려
              }

              return {
                id: notif.id,
                category: category,
                message: notif.message,
                time: new Date(notif.created_at)
                  .toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  .replace(/\. /g, "-")
                  .replace(".", "")
                  .replace(",", ""),
                campaign_id: notif.campaign_id ? parseInt(notif.campaign_id) : undefined,
                campaign_name: notif.campaign_title,
                is_read: notif.is_read,
                _source: "localStorage", // 출처 구분을 위한 속성
              };
            });

          // localStorage 알림 + mock 알림 합치기
          // 각 알림에 출처를 표시하여 고유한 키 생성 가능
          const mockNotificationsWithSource = mockReviewerNotifications.map((notif) => ({
            ...notif,
            _source: "mock", // 출처 구분을 위한 속성
          }));
          setNotifications([
            ...userNotifications,
            ...(mockNotificationsWithSource as NotificationItem[]),
          ]);
        }
      } catch (_error) {}
    }
  }, [user]);

  /**
   * 알림 클릭 핸들러 (향후 구현)
   * 알림 클릭 시 상세 페이지로 이동하거나 모달을 열 수 있습니다.
   *
   * @param notification - 클릭된 알림 아이템
   */
  const handleNotificationClick = (_notification: (typeof mockReviewerNotifications)[0]) => {
    // TODO: 알림 상세 페이지로 이동 또는 모달 열기
  };

  /** 전체 삭제 버튼 클릭 → 바로 삭제 후 토스트만 표시 */
  const handleDeleteAllClick = () => {
    setNotifications([]);
    setDisplayCount(PAGE_SIZE);
    if (typeof window !== "undefined" && user) {
      try {
        const storedNotifications = localStorage.getItem("notifications");
        if (storedNotifications) {
          const allNotifications = JSON.parse(storedNotifications);
          const otherUserNotifications = (allNotifications as StoredNotification[]).filter(
            (notif) => notif.user_id !== user.id
          );
          localStorage.setItem("notifications", JSON.stringify(otherUserNotifications));
        }
      } catch (_error) {}
    }
    setIsDeleteToastOpen(true);
  };

  return (
    <div className={`${styles.notification_container} ${isMobile ? styles.mobile : ""}`}>
      {/* 서브헤더 (PC 전용) - 모바일에서는 렌더링하지 않음 */}
      {!isMobile && <SubHeader />}

      {/* 알림 페이지 헤더 */}
      {/* 모바일: PageTitle (뒤로가기 + 알림 + 전체 삭제) / PC: 기존 notification_header */}
      {isMobile ? (
        <PageTitle
          title="알림"
          right_content={
            <button className={styles.delete_all_button} onClick={handleDeleteAllClick}>
              전체 삭제
            </button>
          }
        />
      ) : (
        <div className={styles.notification_header}>
          <h1 className={styles.notification_header_title}>알림</h1>
          <button className={styles.delete_all_button} onClick={handleDeleteAllClick}>
            전체 삭제
          </button>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.main_content}>
        {/* 알림 목록 컴포넌트 (무한 스크롤: 15개씩 표시) */}
        <NotificationList
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          notifications={notifications.slice(0, displayCount) as any}
          on_notification_click={handleNotificationClick}
        />

        {/* 무한 스크롤 sentinel: 뷰포트에 들어오면 다음 15개 로드 */}
        {displayCount < notifications.length && <div ref={sentinelRef} style={{ height: 1 }} />}
      </main>

      <Toast
        message="삭제되었습니다."
        isOpen={isDeleteToastOpen}
        duration={1500}
        onClose={() => setIsDeleteToastOpen(false)}
      />
    </div>
  );
}
