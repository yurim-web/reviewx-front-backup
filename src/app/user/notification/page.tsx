/* ========================================
   🔔 유저 알림 페이지
   ======================================== */

/**
 * 유저 알림 페이지
 *
 * 목적: 유저 단에서 사용되는 알림 페이지입니다.
 *
 * 페이지 경로:
 * - /user/notification
 *
 * 주요 기능:
 * - 유저 전용 헤더 표시
 * - 알림 목록 표시
 *
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/user/notification/notification.module.css";
import SubHeader from "@/components/fragments/SubHeader";
import NotificationList from "@/components/notification/NotificationList";
import PageTitle from "@/components/fragments/PageTitle";
import { useAuth } from "@/hooks/useAuth";
// 알림 목업 데이터 (향후 API로 대체)
import { mockReviewerNotifications } from "@/data/notification/notificationData";

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
    if (typeof window !== 'undefined' && !user) {
      router.push('/user/login');
    }
  }, [user, router]);
  const [notifications, setNotifications] = useState<any[]>(mockReviewerNotifications);

  /**
   * localStorage에서 알림 불러오기
   */
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      try {
        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
          const allNotifications = JSON.parse(storedNotifications);

          // 현재 유저의 알림만 필터링
          const userNotifications = allNotifications
            .filter((notif: any) => notif.user_id === user.id)
            .map((notif: any) => {
              // 기존 알림 형식에 맞게 변환
              let category = 'A_R10'; // 기본값: 출금 신청 카테고리

              // 알림 타입에 따라 카테고리 매핑
              if (notif.type === 'campaign_selected') {
                category = 'A_R1'; // 캠페인 선정
              } else if (notif.type === 'campaign_rejected') {
                category = 'A_R2'; // 캠페인 탈락 (A_R2를 임시로 사용)
              } else if (notif.type === 'campaign_update') {
                category = 'A_R2'; // 캠페인 수정
              } else if (notif.type === 'withdrawal_completed') {
                category = 'A_R11'; // 출금 승인
              } else if (notif.type === 'withdrawal_requested') {
                category = 'A_R10'; // 출금 신청
              } else if (notif.type === 'withdrawal_rejected') {
                category = 'A_R12'; // 출금 반려
              }

              return {
                id: notif.id,
                category: category,
                message: notif.message,
                time: new Date(notif.created_at).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }).replace(/\. /g, '-').replace('.', '').replace(',', ''),
                campaign_id: notif.campaign_id ? parseInt(notif.campaign_id) : undefined,
                campaign_name: notif.campaign_title,
                is_read: notif.is_read,
                _source: 'localStorage', // 출처 구분을 위한 속성
              };
            });

          // localStorage 알림 + mock 알림 합치기
          // 각 알림에 출처를 표시하여 고유한 키 생성 가능
          const mockNotificationsWithSource = mockReviewerNotifications.map(
            (notif) => ({
              ...notif,
              _source: 'mock', // 출처 구분을 위한 속성
            })
          );
          setNotifications([...userNotifications, ...mockNotificationsWithSource]);
          console.log('✅ [알림 페이지] 알림 로드 완료:', userNotifications);
        }
      } catch (error) {
        console.error('❌ [알림 페이지] 알림 로드 실패:', error);
      }
    }
  }, [user]);

  /**
   * 알림 클릭 핸들러 (향후 구현)
   * 알림 클릭 시 상세 페이지로 이동하거나 모달을 열 수 있습니다.
   *
   * @param notification - 클릭된 알림 아이템
   */
  const handle_notification_click = (
    notification: (typeof mockReviewerNotifications)[0]
  ) => {
    // TODO: 알림 상세 페이지로 이동 또는 모달 열기
    // 예시: router.push(`/user/notification/${notification.id}`)
  };

  return (
    <div className={styles.notification_container}>
      {/* 서브헤더 (PC 전용) - 모바일에서는 렌더링하지 않음 */}
      {!isMobile && <SubHeader />}

      {/* 페이지 타이틀
          - PC: sticky로 상단 고정
          - 모바일: fixed로 최상단 고정 (메인 헤더 대신)
      */}
      <PageTitle title="알림" />

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.main_content}>

        {/* 알림 목록 컴포넌트 */}
        <NotificationList
          notifications={notifications}
          on_notification_click={handle_notification_click}
        />
      </main>
    </div>
  );
}
