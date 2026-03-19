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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "@/styles/user/notification/notification.module.css";
import SubHeader from "@/components/fragments/SubHeader";
import NotificationList from "@/components/notification/NotificationList";
import PageTitle from "@/components/fragments/PageTitle";
import Toast from "@/components/common/toast/Toast";
import BaseModal from "@/components/common/modal/BaseModal";
import { useAuth } from "@/hooks/useAuth";
import { fetchNotifications } from "@/lib/api/notification";
import type { NotificationApiItem } from "@/types/api/notification";
import Loading from "@/app/loading";
// 알림 정적 fallback 데이터
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
  message?: string;
  time?: string;
  campaign_id?: number;
  campaign_name?: string;
  is_read: boolean;
  _source?: string;
}

function formatNotificationDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}`;
}

function getReviewerId(userId: string): number {
  if (userId.includes("kakao")) return 1;
  if (userId.includes("naver")) return 2;
  return 1;
}

const TYPE_TO_CATEGORY: Record<string, string> = {
  CAMPAIGN_SELECTED: "A_R1",
  CAMPAIGN_UPDATED: "A_R2",
  CONTENT_REGISTRATION: "A_R3",
  CONTENT_REGISTRATION_REMINDER: "A_R4",
  CONTENT_APPROVED: "A_R5",
  CONTENT_REJECTED: "A_R6",
  LATE_SUBMISSION: "A_R7",
  CONTENT_EXTENDED: "A_R8",
  POINT_EARNED: "A_R9",
  WITHDRAWAL_REQUESTED: "A_R10",
  WITHDRAWAL_COMPLETED: "A_R11",
  WITHDRAWAL_REJECTED: "A_R12",
  PENALTY_GIVEN: "A_R13",
  PENALTY_RELEASED: "A_R14",
  ACCOUNT_SUSPENDED: "A_R15",
  ACCOUNT_BLOCKED: "A_R16",
  CHANNEL_ERROR: "A_R17",
};

function adaptApiNotification(item: NotificationApiItem): NotificationItem {
  return {
    id: item.id,
    category: TYPE_TO_CATEGORY[item.type] ?? "A_R1",
    message: item.message,
    time: formatNotificationDate(item.created_at),
    campaign_id: item.campaign_id,
    campaign_name: item.campaign_name,
    is_read: item.is_read,
    _source: "api",
  };
}

export default function UserNotificationPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const reviewerId = user ? getReviewerId(user.id) : 0;

  // 알림 목록 (API)
  const {
    data: apiNotifications,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications", reviewerId],
    queryFn: () => fetchNotifications(reviewerId),
    enabled: reviewerId > 0,
    staleTime: 30_000,
    retry: false,
  });

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
    if (typeof window !== "undefined" && !authLoading && !user) {
      router.push("/user/login");
    }
  }, [user, router, authLoading]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    mockReviewerNotifications as NotificationItem[]
  );
  const [isDeleteToastOpen, setIsDeleteToastOpen] = useState(false);
  const [isServerErrorModalOpen, setIsServerErrorModalOpen] = useState(false);

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
   * 알림 목록 구성: API 데이터 + localStorage 병합
   * API 로드 성공 → API 데이터 사용 / 실패·로딩 중 → mockReviewerNotifications fallback
   */
  useEffect(() => {
    // base: API 데이터 또는 정적 fallback
    const baseNotifications: NotificationItem[] =
      apiNotifications != null
        ? apiNotifications.map(adaptApiNotification)
        : (mockReviewerNotifications as unknown as NotificationItem[]);

    if (typeof window !== "undefined" && user) {
      try {
        const storedNotifications = localStorage.getItem("notifications");
        if (storedNotifications) {
          const allNotifications = JSON.parse(storedNotifications);

          // 현재 유저의 localStorage 알림만 필터링·변환
          const LOCAL_TYPE_MAP: Record<string, string> = {
            campaign_selected: "A_R1",
            campaign_rejected: "A_R2",
            campaign_update: "A_R2",
            withdrawal_completed: "A_R11",
            withdrawal_requested: "A_R10",
            withdrawal_rejected: "A_R12",
          };
          const localNotifications = (allNotifications as StoredNotification[])
            .filter((notif) => notif.user_id === user.id)
            .map((notif) => ({
              id: notif.id,
              category: LOCAL_TYPE_MAP[notif.type] ?? "A_R10",
              message: notif.message,
              time: formatNotificationDate(notif.created_at),
              campaign_id: notif.campaign_id ? parseInt(notif.campaign_id) : undefined,
              campaign_name: notif.campaign_title,
              is_read: notif.is_read,
              _source: "localStorage",
            }));

          setNotifications([...localNotifications, ...baseNotifications]);
          return;
        }
      } catch (_error) {}
    }
    setNotifications(baseNotifications);
  }, [user, apiNotifications]);

  // isError → E_M5 서버 오류 모달
  useEffect(() => {
    if (isError) setIsServerErrorModalOpen(true);
  }, [isError]);

  /** 전체 삭제 버튼 클릭 → 바로 삭제 후 토스트 표시 */
  const handleDeleteAllClick = () => {
    setNotifications([]);
    setDisplayCount(PAGE_SIZE);
    // 헤더 알림 아이콘 즉시 비활성화 — 캐시를 빈 배열로 덮어씀
    queryClient.setQueryData(["notifications", reviewerId], []);
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

  if (reviewerId > 0 && isLoading) return <Loading />;

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

      {/* E_M5: 서버 오류 모달 */}
      <BaseModal
        is_open={isServerErrorModalOpen}
        on_close={() => setIsServerErrorModalOpen(false)}
        message={"오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."}
        buttons={["닫기", "재시도"]}
        on_cancel={() => setIsServerErrorModalOpen(false)}
        on_confirm={() => {
          setIsServerErrorModalOpen(false);
          window.location.reload();
        }}
        type="center"
      />
    </div>
  );
}
