/* ========================================
   포인트 내역 페이지 공통 컴포넌트
   ======================================== */

/**
 * PointHistoryPage
 *
 * 목적: 포인트 내역(전체/적립/출금)을 필터링하여 표시하는 공통 컴포넌트
 *       커서 기반 무한 스크롤을 지원합니다.
 *
 * 사용 페이지:
 * - /user/point/all (전체 포인트 내역)
 * - /user/point/earned (적립 포인트 내역)
 * - /user/point/withdrawn (출금 포인트 내역)
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useModalState } from "@/hooks/useModalState";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import PointTabNavigation from "@/components/common/point/PointTabNavigation";
import TextareaModal from "@/components/common/modal/TextareaModal";
import BaseModal from "@/components/common/modal/BaseModal";
import PendingPointModal from "@/components/user/point/PendingPointModal";
import { MainTab, PointTab, PointHistory } from "@/types/domain/user";
import { useAuth } from "@/hooks/useAuth";
import { usePointData } from "@/hooks/user/point/usePointData";
import Loading from "@/app/loading";
import styles from "@/styles/user/point/point.module.css";

type FilterFunction = (history: PointHistory) => boolean;

interface PointHistoryPageProps {
  activePointTab: PointTab;
  filterFunction: FilterFunction;
  isEmptyView?: boolean;
}

export default function PointHistoryPage({
  activePointTab,
  filterFunction,
  isEmptyView = false,
}: PointHistoryPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const {
    pointInfo,
    userPointHistory,
    pendingPointList,
    isAccountInfoValid,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePointData(activePointTab);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (isError) setShowErrorModal(true);
  }, [isError]);

  // 로그인 체크
  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      router.push("/user/login");
    }
  }, [user, router]);

  const [activeMainTab, setActiveMainTab] = useState<MainTab>("point");
  const rejectionModal = useModalState();
  const accountModal = useModalState();
  const pendingModal = useModalState();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedRejectionReason, setSelectedRejectionReason] = useState("");
  const [modalTitle, setModalTitle] = useState("사유 확인");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 무한 스크롤: IntersectionObserver
  const observerRef = useRef<HTMLDivElement | null>(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "200px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const handlePointTabChange = (tab: PointTab) => {
    switch (tab) {
      case "all":
        if (activePointTab !== "all") router.push("/user/point/all");
        break;
      case "earned":
        if (activePointTab !== "earned") router.push("/user/point/earned");
        break;
      case "withdrawn":
        if (activePointTab !== "withdrawn") router.push("/user/point/withdrawn");
        break;
    }
  };

  const handleWithdrawalClick = () => {
    if (!isAccountInfoValid()) {
      accountModal.open();
      return;
    }
    router.push("/user/point/withdrawal_request");
  };

  const handleGoToAccountRegistration = () => {
    accountModal.close();
    router.push("/user/mypage/edit");
  };

  const handleReasonClick = (history: PointHistory) => {
    if (history.rejection_reason) {
      setModalTitle("사유 확인");
      setSelectedRejectionReason(history.rejection_reason);
      rejectionModal.open();
    }
  };

  const handleModalClose = () => {
    rejectionModal.close();
    setSelectedRejectionReason("");
  };

  if (isLoading) return <Loading />;

  // ========================================
  // 데이터 필터링 및 정렬
  // ========================================

  const effectiveHistoryData = isEmptyView ? [] : userPointHistory;
  const filteredHistoryData = effectiveHistoryData
    .filter(filterFunction)
    .sort((a, b) => b.date.localeCompare(a.date));

  // ========================================
  // 상태 배지 헬퍼 함수
  // ========================================

  const isWithdrawalFailed = (h: PointHistory): boolean =>
    h.status === "failed" && (h.type === "withdrawn" || h.type === "withdrawal_pending");

  const getStatusBadgeClass = (h: PointHistory): string => {
    if (h.status === "earned") return styles.earned;
    if (h.status === "completed") return styles.completed;
    if (h.status === "pending") return styles.pending;
    if (isWithdrawalFailed(h)) return styles.failed;
    return styles.cancelled;
  };

  const getStatusBadgeText = (h: PointHistory, mobile = false): string => {
    if (h.status === "earned") return "적립";
    if (h.status === "completed") return "출금";
    if (h.status === "pending") return mobile ? "출금 신청" : "신청";
    if (isWithdrawalFailed(h)) return "반려";
    return "취소";
  };

  const RejectionReasonLink = ({
    history,
    iconSize = 16,
  }: {
    history: PointHistory;
    iconSize?: number;
  }) => {
    if (
      !history.rejection_reason ||
      (history.type !== "withdrawn" && history.type !== "withdrawal_pending")
    ) {
      return null;
    }
    return (
      <div className={styles.reason_section} onClick={() => handleReasonClick(history)}>
        <div className={styles.reason_icon}>
          <Image
            src="/images/management_page/cancel_info.svg"
            alt="정보 아이콘"
            width={iconSize}
            height={iconSize}
          />
        </div>
        <span className={styles.reason_text}>사유 확인</span>
      </div>
    );
  };

  return (
    <div className={styles.point_page}>
      <main className={styles.main_content}>
        <div className={styles.container}>
          {/* 메인 탭 네비게이션 */}
          <TabNavigation activeTab={activeMainTab} setActiveTab={setActiveMainTab} />

          {/* 포인트 세부 탭 네비게이션 */}
          <PointTabNavigation
            activePointTab={activePointTab}
            setActivePointTab={handlePointTabChange}
            basePath="/user/point"
            tabLabels={{ earned: "적립", withdrawn: "출금" }}
          />

          {/* 포인트 요약 정보 섹션 */}
          <article className={styles.point_summary_section}>
            <div className={styles.point_summary_info}>
              <span className={styles.point_label}>보유 포인트</span>
              <div className={styles.point_amount}>
                <span className={styles.amount_number}>
                  {pointInfo.available_points.toLocaleString()}
                </span>
                <span className={styles.amount_unit}>P</span>
              </div>
            </div>

            <div className={styles.point_buttons}>
              <button
                className={styles.pending_point_button}
                onClick={() => {
                  if (isMobile) {
                    router.push("/user/point/pending");
                  } else {
                    pendingModal.open();
                  }
                }}
              >
                적립 예정 포인트 확인
              </button>
              <button className={styles.withdrawal_button} onClick={handleWithdrawalClick}>
                출금 신청하기
              </button>
            </div>
          </article>

          {/* 포인트 내역 리스트 섹션 */}
          <article className={styles.history_list}>
            {filteredHistoryData.length === 0 ? (
              <div className={styles.empty_state}>
                <p className={styles.empty_message}>포인트 내역이 없습니다.</p>
              </div>
            ) : (
              <>
                {filteredHistoryData.map((history) => (
                  <div key={history.id} className={styles.history_item}>
                    {/* PC 버전 (모바일에서 숨김) */}
                    <div className={styles.status_badge_container}>
                      <div className={`${styles.status_badge} ${getStatusBadgeClass(history)}`}>
                        {getStatusBadgeText(history)}
                      </div>
                    </div>

                    <div className={styles.history_info}>
                      <div className={styles.history_description}>
                        {history.status === "failed" ? (
                          <div className={styles.cancelled_description}>
                            <span className={styles.main_text}>{history.description}</span>
                            <RejectionReasonLink history={history} iconSize={16} />
                          </div>
                        ) : (
                          history.description
                        )}
                      </div>
                      <div className={styles.history_date}>{history.date}</div>
                    </div>

                    <div className={styles.point_info}>
                      <div
                        className={`${styles.point_change} ${
                          history.status === "failed"
                            ? styles.cancelled_amount
                            : history.amount > 0
                              ? styles.positive
                              : styles.negative
                        }`}
                      >
                        {history.amount > 0
                          ? `+ ${history.amount.toLocaleString()}`
                          : `${history.amount.toLocaleString()}`}{" "}
                        P
                      </div>
                      <div className={styles.point_balance}>
                        {history.balance.toLocaleString()} P
                      </div>
                    </div>

                    {/* 모바일 버전 (PC에서 숨김) */}
                    {/* 1번째 줄: 설명 (왼쪽) + 포인트 금액 + 잔액 (오른쪽) */}
                    <div className={styles.mobile_row_first}>
                      <div className={styles.mobile_description}>
                        {history.status === "failed" ? (
                          <div className={styles.cancelled_description}>
                            <span className={styles.main_text}>{history.description}</span>
                            <RejectionReasonLink history={history} iconSize={12} />
                          </div>
                        ) : (
                          history.description
                        )}
                      </div>

                      <div className={styles.mobile_points_group}>
                        <div
                          className={`${styles.mobile_point_change} ${
                            history.status === "failed"
                              ? styles.cancelled_amount
                              : history.amount > 0
                                ? styles.positive
                                : styles.negative
                          }`}
                        >
                          {history.amount > 0
                            ? `+ ${history.amount.toLocaleString()}`
                            : `${history.amount.toLocaleString()}`}{" "}
                          P
                        </div>
                        <div className={styles.mobile_balance}>
                          {history.balance.toLocaleString()} P
                        </div>
                      </div>
                    </div>

                    {/* 2번째 줄: 날짜 (왼쪽) + 상태 (오른쪽) */}
                    <div className={styles.mobile_row_second}>
                      <div className={styles.mobile_date}>{history.date}</div>
                      <div className={`${styles.mobile_status} ${getStatusBadgeClass(history)}`}>
                        {getStatusBadgeText(history, true)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* 무한 스크롤 트리거 + 로딩 표시 */}
                <div ref={observerRef} className={styles.scroll_trigger}>
                  {isFetchingNextPage && (
                    <div className={styles.loading_more}>
                      <span>불러오는 중...</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </article>
        </div>
      </main>

      {/* 적립 예정 포인트 확인 모달 */}
      <PendingPointModal
        is_open={pendingModal.isOpen}
        on_close={pendingModal.close}
        pending_list={pendingPointList}
      />

      {/* 반려 사유 모달 */}
      <TextareaModal
        is_open={rejectionModal.isOpen}
        on_close={handleModalClose}
        title={modalTitle}
        value={selectedRejectionReason}
        readOnly={true}
        variant="reject"
        buttons={["닫기"]}
      />

      {/* 계좌 정보 확인 모달 */}
      <BaseModal
        is_open={accountModal.isOpen}
        on_close={accountModal.close}
        message="계좌 정보가 없습니다.<br>계좌 정보 등록 후 출금 신청을 할 수 있습니다."
        buttons={["취소", "등록"]}
        on_confirm={handleGoToAccountRegistration}
        type="center"
      />

      {/* 서버 오류 모달 (E_M5) */}
      <BaseModal
        is_open={showErrorModal}
        on_close={() => setShowErrorModal(false)}
        message={"오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."}
        buttons={["닫기", "재시도"]}
        on_cancel={() => setShowErrorModal(false)}
        on_confirm={() => {
          setShowErrorModal(false);
          router.refresh();
        }}
        type="center"
      />
    </div>
  );
}
