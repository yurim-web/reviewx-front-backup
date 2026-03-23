/* ========================================
   💰 파트너 포인트 페이지 공통 레이아웃 컴포넌트
   ======================================== */

/**
 * 파트너 포인트 페이지의 공통 UI 레이아웃 컴포넌트
 *
 * 📌 컴포넌트 재사용성:
 * - 여러 포인트 페이지(all, earned, withdrawn)에서 동일한 UI 구조를 사용합니다
 * - 레이아웃 변경 시 한 곳만 수정하면 모든 페이지에 반영됩니다
 *
 * 📌 Props 패턴:
 * - 컴포넌트에 데이터와 필터 함수를 props로 전달하여 재사용성을 높입니다
 * - filterHistory 함수를 props로 받아 각 페이지별로 다른 필터링을 적용합니다
 */

"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useModalState } from "@/hooks/useModalState";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TabNavigation from "@/components/partner/campaign_management/TabNavigation";
import PointTabNavigation from "@/components/common/point/PointTabNavigation";
import TextareaModal from "@/components/common/modal/TextareaModal";
import PartnerPaymentInfoModal from "@/components/partner/point/PartnerPaymentInfoModal";
import {
  PartnerMainTab,
  PartnerPointTab,
  PartnerPointHistory,
  PartnerPointSummary,
} from "@/types/domain/partner";
import styles from "@/styles/user/point/point.module.css";
import partnerPointStyles from "@/styles/partner/point/point_layout.module.css";

/* ========================================
   📦 컴포넌트 Props 타입 정의
   ======================================== */
interface PartnerPointPageLayoutProps {
  /** 현재 활성화된 포인트 탭 */
  activePointTab: PartnerPointTab;
  /** 포인트 내역 데이터 */
  historyData: PartnerPointHistory[];
  /** 포인트 요약 정보 */
  summary: PartnerPointSummary;
  /** 포인트 내역 필터 함수 (각 페이지별로 다른 필터링 적용) */
  filterHistory?: (history: PartnerPointHistory) => boolean;
  /** 무한스크롤: 다음 페이지 로드 */
  onLoadMore?: () => void;
  /** 무한스크롤: 다음 페이지 존재 여부 */
  hasMore?: boolean;
  /** 무한스크롤: 다음 페이지 로딩 중 */
  isLoadingMore?: boolean;
}

/**
 * 파트너 포인트 페이지 공통 레이아웃 컴포넌트
 *
 *
 * 사용 페이지:
 * - /partner/point/all (전체 포인트 내역)
 * - /partner/point/earned (충전 내역)
 * - /partner/point/withdrawn (사용 내역)
 */
export default function PartnerPointPageLayout({
  activePointTab,
  historyData,
  summary,
  filterHistory,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: PartnerPointPageLayoutProps) {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState<PartnerMainTab>("point");
  // 📌 반려 사유 모달 상태 관리:
  // - 반려 사유 모달을 보여줄지 말지를 결정하는 boolean 상태입니다
  const rejectionModal = useModalState();
  // 📌 선택된 반려 사유:
  // - 현재 모달에 표시할 반려 사유 텍스트를 저장합니다
  const [selected_rejection_reason, setSelectedRejectionReason] = useState("");
  // 📌 모달 제목:
  // - 모달의 제목을 저장합니다
  // - 반환 반려 상태에 따라 "반환 반려 사유"로 표시됩니다
  const [modal_title, setModalTitle] = useState("반려 사유");

  // 결제 정보 하단 시트 모달 (포인트 충전 항목 클릭 시)
  const paymentInfoModal = useModalState();
  const [payment_info_modal_history, set_payment_info_modal_history] =
    useState<PartnerPointHistory | null>(null);

  /**
   * 포인트 탭 변경 핸들러
   * 각 탭 클릭 시 해당 페이지로 이동
   *
   * 📌 라우팅 패턴:
   * - router.push를 사용하여 SPA 방식 페이지 전환
   * - URL 기반 라우팅으로 새로고침 시에도 페이지 유지
   */
  const handlePointTabChange = (tab: PartnerPointTab) => {
    switch (tab) {
      case "all":
        router.push("/partner/point/all");
        break;
      case "earned":
        router.push("/partner/point/earned");
        break;
      case "withdrawn":
        router.push("/partner/point/withdrawn");
        break;
    }
  };

  /**
   * 충전 버튼 클릭 핸들러
   * 포인트 충전 페이지로 이동
   */
  const handleWithdrawalClick = () => {
    router.push("/partner/point/charge");
  };

  /**
   * 사유보기 버튼 클릭 핸들러
   *
   * 설명:
   * - "사유보기" 버튼을 클릭했을 때 실행되는 함수입니다.
   * - 반환 사유 또는 반려 사유를 모달에 표시합니다.
   * - 반환 상태에 따라 모달 제목을 설정합니다.
   *
   * 📌 반환 사유 처리:
   * - type이 "returned"이면 "반환 사유"로 표시
   * - return_reason이 있으면 사용, 없으면 rejection_reason 사용
   * - 반환 반려(status가 "failed")인 경우 "반환 반려 사유"로 표시
   */
  const handle_reason_click = (history: PartnerPointHistory) => {
    // 반환 상태인 경우
    if (history.type === "returned") {
      // 반환 사유 우선 사용, 없으면 rejection_reason 사용
      const reason =
        history.return_reason || history.rejection_reason || "반환 사유 정보가 없습니다.";

      // 반환 반려 상태 구분
      if (history.status === "failed") {
        setModalTitle("반환 반려 사유");
      } else {
        setModalTitle("반환 사유");
      }

      // 반환 사유 설정 및 모달 열기
      setSelectedRejectionReason(reason);
      rejectionModal.open();
    }
    // 반려된 경우 (반환 제외)
    else if (history.status === "failed" && history.rejection_reason) {
      setModalTitle("반려 사유");
      setSelectedRejectionReason(history.rejection_reason);
      rejectionModal.open();
    }
  };

  /**
   * 모달 닫기 핸들러
   *
   * 설명:
   * - 모달을 닫을 때 실행되는 함수입니다.
   * - 모달 상태를 false로 설정하고 반려 사유를 초기화합니다.
   */
  const handle_modal_close = () => {
    rejectionModal.close();
    setSelectedRejectionReason("");
  };

  // 무한스크롤: IntersectionObserver로 리스트 하단 감지
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasMore && !isLoadingMore && onLoadMore) {
        onLoadMore();
      }
    },
    [hasMore, isLoadingMore, onLoadMore]
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  /**
   * 포인트 내역 필터링 및 정렬
   *
   * 📌 useMemo 훅:
   * - 필터링 및 정렬 결과를 메모이제이션하여 성능 최적화
   * - historyData나 filterHistory가 변경될 때만 재계산
   *
   * 📌 정렬 로직:
   * - 날짜 기준 내림차순 정렬 (최신순)
   * - date 문자열을 비교하여 최신 내역이 위에 표시되도록 함
   */
  const filtered_and_sorted_history = useMemo(() => {
    // 필터링 적용 (필터 함수가 제공된 경우)
    let filtered = filterHistory ? historyData.filter(filterHistory) : historyData;

    // 최신순 정렬 (날짜 기준 내림차순)
    // 📌 배열 정렬:
    // - sort() 메서드는 원본 배열을 변경합니다
    // - 날짜 문자열을 비교하여 내림차순 정렬 (최신 날짜가 먼저)
    filtered = [...filtered].sort((a, b) => {
      // 날짜 문자열 비교 (YYYY-MM-DD 형식)
      // 내림차순: b.date.localeCompare(a.date)
      return b.date.localeCompare(a.date);
    });

    return filtered;
  }, [historyData, filterHistory]);

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
            basePath="/partner/point"
            tabLabels={{ earned: "충전", withdrawn: "사용" }}
          />

          {/* 포인트 요약 정보 */}
          <article className={styles.point_summary_section}>
            <div className={styles.point_summary_info}>
              <span className={styles.point_label}>보유 포인트</span>
              <div className={styles.point_amount}>
                <span className={styles.amount_number}>
                  {summary.total_points.toLocaleString()}
                </span>
                <span className={styles.amount_unit}>P</span>
              </div>
            </div>

            <button className={styles.withdrawal_button} onClick={handleWithdrawalClick}>
              포인트 충전하기
            </button>
          </article>

          {/* 포인트 내역 리스트 */}
          <article className={styles.history_list}>
            {filtered_and_sorted_history.length === 0 ? (
              <div className={styles.empty_state}>
                {activePointTab === "earned"
                  ? "포인트 충전 내역이 없습니다."
                  : activePointTab === "withdrawn"
                    ? "포인트 사용 내역이 없습니다."
                    : "포인트 내역이 없습니다."}
              </div>
            ) : (
              filtered_and_sorted_history.map((history) => (
                <div key={history.id} className={styles.history_item}>
                  {/* 상태 배지 */}
                  <div className={styles.status_badge_container}>
                    <div
                      className={`${styles.status_badge} ${
                        history.type === "earned"
                          ? styles.earned // 충전: 초록색 #2dc469
                          : history.type === "returned"
                            ? styles.cancelled // 반환: 회색 #ababab
                            : history.type === "withdrawn"
                              ? styles.completed // 사용: 파란색 #2b7fff
                              : history.status === "earned"
                                ? styles.earned
                                : history.status === "completed"
                                  ? styles.completed
                                  : history.status === "pending"
                                    ? styles.pending
                                    : styles.cancelled
                      }`}
                    >
                      {history.type === "earned"
                        ? "충전"
                        : history.type === "returned"
                          ? "반환"
                          : history.type === "withdrawn"
                            ? "사용"
                            : history.status === "completed"
                              ? "완료"
                              : history.status === "pending"
                                ? "신청"
                                : "취소"}
                    </div>
                  </div>

                  {/* 내역 정보 (설명 + 결제정보 버튼은 description 바로 옆 한 줄) */}
                  <div className={styles.history_info}>
                    <div className={partnerPointStyles.history_description_row}>
                      <div
                        className={`${styles.history_description} ${partnerPointStyles.history_description_cell}`}
                      >
                        {history.type !== "returned" &&
                        history.status === "failed" &&
                        history.rejection_reason ? (
                          <div className={styles.cancelled_description}>
                            <span className={styles.main_text}>{history.description}</span>
                            {history.rejection_reason && (
                              <div
                                className={styles.reason_section}
                                onClick={() => handle_reason_click(history)}
                              >
                                <div className={styles.reason_icon}>
                                  <Image
                                    src="/images/management_page/cancel_info.svg"
                                    alt="정보 아이콘"
                                    width={16}
                                    height={16}
                                  />
                                </div>
                                <span className={styles.reason_text}>사유보기</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          history.description
                        )}
                      </div>
                      {history.type === "earned" && (
                        <button
                          type="button"
                          className={partnerPointStyles.payment_info_btn}
                          onClick={() => {
                            set_payment_info_modal_history(history);
                            paymentInfoModal.open();
                          }}
                          aria-label="결제 정보 보기"
                        >
                          <Image
                            src="/images/icons/point/point_bell.svg"
                            alt=""
                            width={16}
                            height={16}
                          />
                        </button>
                      )}
                    </div>
                    <div className={styles.history_date}>{history.date}</div>
                  </div>

                  {/* 포인트 정보 */}
                  <div className={styles.point_info}>
                    <div
                      className={`${styles.point_change} ${
                        history.type === "returned"
                          ? styles.returned // 반환: 회색 #848484
                          : history.type === "earned"
                            ? styles.positive // 충전: 초록색
                            : styles.negative // 사용: 파랑색
                      }`}
                    >
                      {/**
                       * 포인트 금액 표시 로직:
                       * - 충전(earned): + (양수로 표시, 초록색)
                       * - 반환(returned): + (양수로 표시, 회색 #848484)
                       * - 사용(withdrawn): - (음수로 표시, 파랑색)
                       *
                       * 📌 스타일:
                       * - 두 번째 이미지처럼 깔끔하게 표시
                       * - 반려된 경우에도 일반 스타일 적용 (취소선 제거)
                       */}
                      {history.type === "returned" || history.type === "earned"
                        ? `+ ${Math.abs(history.amount).toLocaleString()}`
                        : `${history.amount.toLocaleString()}`}{" "}
                      P
                    </div>
                    <div className={styles.point_balance}>{history.balance.toLocaleString()} P</div>
                  </div>

                  {/* 모바일 버전: 2줄 구조 (PC에서 숨김) - 제목+아이콘 한 박스, gap 모바일만 */}
                  <div
                    className={`${styles.mobile_row_first} ${partnerPointStyles.partner_mobile_row_first}`}
                  >
                    <div className={partnerPointStyles.mobile_description_with_btn}>
                      <div
                        className={`${styles.mobile_description} ${partnerPointStyles.partner_mobile_description}`}
                      >
                        {history.type !== "returned" &&
                        history.status === "failed" &&
                        history.rejection_reason ? (
                          <div className={styles.cancelled_description}>
                            <span className={styles.main_text}>{history.description}</span>
                            {history.rejection_reason && (
                              <div
                                className={styles.reason_section}
                                onClick={() => handle_reason_click(history)}
                              >
                                <div className={styles.reason_icon}>
                                  <Image
                                    src="/images/management_page/cancel_info.svg"
                                    alt="정보 아이콘"
                                    width={12}
                                    height={12}
                                  />
                                </div>
                                <span className={styles.reason_text}>사유보기</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          history.description
                        )}
                      </div>
                      {history.type === "earned" && (
                        <div className={partnerPointStyles.payment_info_btn_wrapper_mobile}>
                          <button
                            type="button"
                            className={partnerPointStyles.payment_info_btn}
                            onClick={() => {
                              set_payment_info_modal_history(history);
                              paymentInfoModal.open();
                            }}
                            aria-label="결제 정보 보기"
                          >
                            <Image
                              src="/images/icons/point/point_bell.svg"
                              alt=""
                              width={16}
                              height={16}
                            />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className={styles.mobile_points_group}>
                      <div
                        className={`${styles.mobile_point_change} ${
                          history.type === "returned"
                            ? styles.returned // 반환: 회색 #848484
                            : history.type === "earned"
                              ? styles.positive // 충전: 초록색
                              : styles.negative // 사용: 파랑색
                        }`}
                      >
                        {history.type === "returned" || history.type === "earned"
                          ? `+ ${Math.abs(history.amount).toLocaleString()}`
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
                    <div
                      className={`${styles.mobile_status} ${
                        history.type === "earned"
                          ? styles.earned // 충전: 초록색 #2dc469
                          : history.type === "returned"
                            ? styles.cancelled // 반환: 회색 #848484
                            : history.type === "withdrawn"
                              ? styles.completed // 사용: 파란색 #2b7fff
                              : history.status === "earned"
                                ? styles.earned
                                : history.status === "completed"
                                  ? styles.completed
                                  : history.status === "pending"
                                    ? styles.pending
                                    : styles.cancelled
                      }`}
                    >
                      {history.type === "earned"
                        ? "충전"
                        : history.type === "returned"
                          ? "반환"
                          : history.type === "withdrawn"
                            ? "사용"
                            : history.status === "completed"
                              ? "완료"
                              : history.status === "pending"
                                ? "신청"
                                : "취소"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </article>

          {/* 무한스크롤 감지 영역 */}
          <div ref={loadMoreRef} style={{ height: 1 }} />
          {isLoadingMore && (
            <div style={{ textAlign: "center", padding: "16px 0", color: "#999" }}>
              불러오는 중...
            </div>
          )}
        </div>
      </main>

      {/* 반려 사유 모달 */}
      {/**
       * TextareaModal 컴포넌트
       *
       * 설명:
       * - 공통 모달 컴포넌트를 재사용하여 반려 사유를 표시합니다.
       * - readOnly 모드로 설정하여 읽기 전용으로 표시합니다.
       * - variant="reject"로 설정하여 반려 모달 스타일을 적용합니다.
       *
       * 📌 반환 반려 처리:
       * - 반환 반려 사유를 모달에 표시합니다.
       */}
      <TextareaModal
        is_open={rejectionModal.isOpen}
        on_close={handle_modal_close}
        title={modal_title}
        value={selected_rejection_reason}
        readOnly={true}
        variant="reject"
        buttons={["닫기"]}
      />

      {/* 결제 정보 하단 시트 모달 (충전 항목 클릭 시) - Figma 4417-18179 */}
      <PartnerPaymentInfoModal
        is_open={paymentInfoModal.isOpen}
        on_close={() => {
          paymentInfoModal.close();
          set_payment_info_modal_history(null);
        }}
        history={payment_info_modal_history}
      />
    </div>
  );
}
