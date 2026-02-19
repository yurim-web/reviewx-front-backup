/* ========================================
   💰 포인트 내역 페이지 공통 컴포넌트
   ======================================== */

/**
 * 포인트 내역 페이지 공통 컴포넌트
 *
 * 목적: 포인트 내역을 보여주는 페이지의 공통 로직과 UI를 재사용하기 위한 컴포넌트입니다.
 *
 * 📍 사용 페이지:
 * - /user/point/all (전체 포인트 내역)
 * - /user/point/earned (적립 포인트 내역)
 * - /user/point/withdrawn (출금 포인트 내역)
 *
 * 주요 기능:
 * - 포인트 내역 필터링 및 표시
 * - 보유 포인트 현황 표시
 * - 출금 신청 기능
 * - 반려 사유 모달 표시 (출금 신청 반려 시에만)
 *
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import PointTabNavigation from "@/components/common/point/PointTabNavigation";
import TextareaModal from "@/components/common/modal/TextareaModal";
import BaseModal from "@/components/common/modal/BaseModal";
import PendingPointModal from "@/components/user/point/PendingPointModal";
import { MainTab, PointTab, PointHistory } from "@/types/domain/user";
import {
  pointHistoryData,
  pendingPointListData,
} from "@/data/user/point/pointData";
import { useAuth } from "@/hooks/useAuth";
import styles from "@/styles/user/point/point.module.css";

/**
 * 포인트 내역 필터 함수 타입
 *
 * 설명:
 * - 포인트 내역을 필터링하는 함수의 타입을 정의합니다.
 * - 각 페이지(전체/적립/출금)마다 다른 필터링 로직을 적용할 수 있습니다.
 */
type FilterFunction = (history: PointHistory) => boolean;

/**
 * PointHistoryPage 컴포넌트 Props 인터페이스
 *
 * 설명:
 * - 컴포넌트에 전달되는 속성들의 타입을 정의합니다.
 * - TypeScript를 사용하여 타입 안정성을 보장합니다.
 */
interface PointHistoryPageProps {
  /** 현재 활성화된 포인트 탭 (전체/적립/출금) */
  activePointTab: PointTab;
  /** 포인트 내역 필터링 함수 */
  filterFunction: FilterFunction;
}

/**
 * 포인트 내역 페이지 공통 컴포넌트
 *
 * 설명:
 * - 세 개의 포인트 페이지(all, earned, withdrawn)에서 공통으로 사용되는 컴포넌트입니다.
 * - Props로 받은 필터 함수를 사용하여 내역을 필터링합니다.
 *
 * React 컴포넌트 구조:
 * - 함수형 컴포넌트 (Function Component)
 * - Hooks 사용 (useState, useRef, useRouter)
 */
export default function PointHistoryPage({
  activePointTab,
  filterFunction,
}: PointHistoryPageProps) {
  // ========================================
  // 📌 React Hooks 사용
  // ========================================

  /**
   * useRouter Hook
   *
   * 설명:
   * - Next.js의 클라이언트 사이드 라우팅을 위한 Hook입니다.
   * - router.push()를 사용하여 페이지 이동을 처리합니다.
   */
  const router = useRouter();

  /**
   * useAuth Hook - 사용자 인증 정보
   */
  const { user } = useAuth();

  /**
   * useState Hook - 메인 탭 상태 관리
   *
   * 설명:
   * - 'point' 탭이 활성화된 상태를 관리합니다.
   * - useState는 [상태값, 상태변경함수]를 반환합니다.
   */
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("point");

  /**
   * useState Hook - 모달 열림/닫힘 상태
   *
   * 설명:
   * - 반려 사유 모달을 보여줄지 말지를 결정하는 boolean 상태입니다.
   * - false: 숨김, true: 표시
   */
  const [is_modal_open, setIsModalOpen] = useState(false);

  /**
   * useState Hook - 계좌 정보 확인 모달 상태
   *
   * 설명:
   * - 계좌 정보가 없을 때 표시하는 모달의 열림/닫힘 상태입니다.
   * - false: 숨김, true: 표시
   */
  const [is_account_modal_open, setIsAccountModalOpen] = useState(false);

  /** 적립 예정 포인트 확인 모달 (데스크톱) */
  const [is_pending_modal_open, setIsPendingModalOpen] = useState(false);

  /** 모바일 여부 (모바일에서는 적립 예정 포인트를 페이지로 이동) */
  const [is_mobile, setIsMobile] = useState(false);

  /**
   * useState Hook - 선택된 반려 사유
   *
   * 설명:
   * - 현재 모달에 표시할 반려 사유 텍스트를 저장합니다.
   * - 사용자가 "사유보기" 버튼을 클릭했을 때 해당 내역의 반려 사유를 저장합니다.
   */
  const [selected_rejection_reason, setSelectedRejectionReason] = useState("");

  /**
   * useState Hook - 모달 제목
   *
   * 설명:
   * - 반려/취소 사유 확인 모달의 제목을 저장합니다.
   */
  const [modal_title, setModalTitle] = useState("사유 확인");

  /**
   * useState Hook - 포인트 정보
   *
   * 설명:
   * - user_accounts에서 읽어온 포인트 정보를 저장합니다.
   */
  const [pointInfo, setPointInfo] = useState({
    available_points: 0,
    pending_points: 0,
    current_points: 0,
  });

  /**
   * useState Hook - 사용자 계좌 정보
   *
   * 설명:
   * - user_accounts에서 읽어온 사용자의 계좌 정보를 저장합니다.
   */
  const [accountInfo, setAccountInfo] = useState({
    name: "",
    bank: "",
    accountNumber: "",
    residentNumber: "",
  });

  /**
   * useState Hook - 포인트 내역
   *
   * 설명:
   * - user_accounts에서 읽어온 포인트 내역을 저장합니다.
   */
  const [userPointHistory, setUserPointHistory] = useState<PointHistory[]>([]);

  /**
   * useState Hook - 적립 예정 포인트 목록
   *
   * 설명:
   * - 캠페인 참여 후 들어오기로 되어 있는 포인트(예정) 목록입니다.
   * - user_accounts.pending_point_list가 있으면 사용, 없으면 기본 데이터 사용.
   */
  const [pendingPointList, setPendingPointList] = useState(
    () => pendingPointListData,
  );

  // ========================================
  // 🎯 useEffect - 포인트 정보 로드
  // ========================================

  /**
   * 포인트 정보 및 내역 로드 함수
   */
  const loadPointData = () => {
    if (typeof window !== "undefined" && user) {
      try {
        const storedAccounts = localStorage.getItem("user_accounts");
        console.log("📦 [포인트 페이지] user_accounts 원본:", storedAccounts);
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts);
          console.log("📦 [포인트 페이지] 파싱된 accounts:", accounts);
          const userAccount = accounts.find(
            (a: any) => a.id === user.id || a.email === user.email,
          );
          console.log("👤 [포인트 페이지] 현재 유저:", user.id, user.email);
          console.log("👤 [포인트 페이지] 찾은 userAccount:", userAccount);
          if (userAccount) {
            const newPointInfo = {
              available_points: userAccount.available_points || 0,
              pending_points: userAccount.pending_points || 0,
              current_points: userAccount.current_points || 0,
            };
            console.log(
              "💰 [포인트 페이지] 업데이트할 포인트 정보:",
              newPointInfo,
            );
            setPointInfo(newPointInfo);

            // 계좌 정보 로드
            const newAccountInfo = {
              name: userAccount.account_holder || userAccount.name || "",
              bank: userAccount.bank || "",
              accountNumber: userAccount.account_number || "",
              residentNumber:
                userAccount.ssn_front && userAccount.ssn_back
                  ? `${userAccount.ssn_front}-${userAccount.ssn_back}`
                  : "",
            };
            setAccountInfo(newAccountInfo);

            // 포인트 내역 로드 (없으면 빈 배열)
            setUserPointHistory(userAccount.point_history || []);

            // 적립 예정 포인트 목록 (user_accounts에 있으면 사용, 없으면 기본 데이터 유지)
            if (userAccount.pending_point_list?.length !== undefined) {
              setPendingPointList(userAccount.pending_point_list);
            }

            console.log("✅ [포인트 페이지] 포인트 정보 로드 완료");
          } else {
            console.warn("⚠️ [포인트 페이지] userAccount를 찾을 수 없습니다");
          }
        } else {
          console.warn(
            "⚠️ [포인트 페이지] user_accounts가 localStorage에 없습니다",
          );
        }
      } catch (error) {
        console.error("❌ [포인트 페이지] 포인트 정보 로드 실패:", error);
      }
    } else {
      console.log(
        "⚠️ [포인트 페이지] window 또는 user가 없습니다. window:",
        typeof window,
        "user:",
        user,
      );
    }
  };

  /**
   * useEffect: user_accounts에서 포인트 정보 및 내역 로드
   */
  useEffect(() => {
    loadPointData();

    // 페이지 포커스 시 데이터 다시 로드
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("🔄 [포인트 페이지] 페이지 포커스 - 데이터 다시 로드");
        loadPointData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  /** 모바일 여부 감지 (적립 예정 포인트: 모바일 → 페이지 이동, 데스크톱 → 모달) */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ========================================
  // 🎯 이벤트 핸들러 함수들
  // ========================================

  /**
   * 포인트 탭 변경 핸들러
   *
   * 설명:
   * - 사용자가 포인트 탭(전체/적립/출금)을 클릭했을 때 실행되는 함수입니다.
   * - 각 탭에 해당하는 페이지로 이동합니다.
   * - 현재 페이지인 경우 아무 동작도 하지 않습니다.
   *

   */
  const handlePointTabChange = (tab: PointTab) => {
    switch (tab) {
      case "all":
        // 현재 페이지가 all이 아닌 경우에만 이동
        if (activePointTab !== "all") {
          window.location.href = "/user/point/all";
        }
        break;
      case "earned":
        // 현재 페이지가 earned가 아닌 경우에만 이동
        if (activePointTab !== "earned") {
          window.location.href = "/user/point/earned";
        }
        break;
      case "withdrawn":
        // 현재 페이지가 withdrawn이 아닌 경우에만 이동
        if (activePointTab !== "withdrawn") {
          window.location.href = "/user/point/withdrawn";
        }
        break;
    }
  };

  /**
   * 계좌 정보 유효성 검사
   *
   * 기능:
   * - 예금주, 은행, 계좌번호, 주민등록번호가 모두 입력되어 있는지 확인
   *
   * 반환값:
   * - true: 계좌 정보가 모두 입력됨
   * - false: 계좌 정보가 하나라도 비어있음
   */
  const isAccountInfoValid = () => {
    return (
      accountInfo.name.trim() !== "" &&
      accountInfo.bank.trim() !== "" &&
      accountInfo.accountNumber.trim() !== "" &&
      accountInfo.residentNumber.trim() !== ""
    );
  };

  /**
   * 출금 신청 버튼 클릭 핸들러
   *
   * 설명:
   * - "출금 신청하기" 버튼을 클릭했을 때 실행되는 함수입니다.
   * - 계좌 정보가 없으면 모달을 표시하고, 있으면 출금 신청 페이지로 이동합니다.
   *
   */
  const handleWithdrawalClick = () => {
    // 계좌 정보가 없으면 모달 표시
    if (!isAccountInfoValid()) {
      setIsAccountModalOpen(true);
      return;
    }

    // 계좌 정보가 있으면 출금 신청 페이지로 이동
    router.push("/user/point/withdrawal_request");
  };

  /**
   * 계좌 정보 모달 닫기 핸들러
   *
   * 설명:
   * - 모달을 닫을 때 실행되는 함수입니다.
   */
  const handleAccountModalClose = () => {
    setIsAccountModalOpen(false);
  };

  /**
   * 계좌 정보 등록 페이지로 이동 핸들러
   *
   * 설명:
   * - "등록하기" 버튼을 클릭했을 때 실행되는 함수입니다.
   * - 모달을 닫고 내 정보 수정 페이지로 이동합니다.
   */
  const handleGoToAccountRegistration = () => {
    setIsAccountModalOpen(false);
    router.push("/user/mypage/edit_profile");
  };

  /**
   * 사유보기 버튼 클릭 핸들러
   *
   * 설명:
   * - "사유보기" 버튼을 클릭했을 때 실행되는 함수입니다.
   * - 출금 신청 반려 시 해당 내역의 반려 사유를 "사유 확인" 모달에 표시합니다.
   *
   */
  const handle_reason_click = (history: PointHistory) => {
    // 반려 사유가 있는 경우에만 모달 표시
    if (history.rejection_reason) {
      setModalTitle("사유 확인");
      setSelectedRejectionReason(history.rejection_reason);
      setIsModalOpen(true);
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
    setIsModalOpen(false);
    setSelectedRejectionReason("");
  };

  // ========================================
  // 🔍 데이터 필터링 및 정렬
  // ========================================

  /**
   * 포인트 내역 필터링 및 정렬
   *
   * 설명:
   * - user가 로그인되어 있으면 user_accounts의 포인트 내역을 사용합니다.
   * - user_accounts가 없거나 user가 없으면 기본 데이터를 사용합니다.
   * - Props로 받은 filterFunction을 사용하여 포인트 내역을 필터링합니다.
   * - 날짜 기준으로 최신순(내림차순)으로 정렬합니다.
   * - 배열의 filter와 sort 메서드를 체이닝하여 사용합니다.
   *
   */
  const historyDataSource = user ? userPointHistory : pointHistoryData;
  const filteredHistoryData = historyDataSource
    .filter(filterFunction)
    .sort((a, b) => {
      // 날짜를 비교하여 최신순(내림차순)으로 정렬
      // b.date가 a.date보다 크면(최신이면) 양수 반환하여 b를 앞으로
      return b.date.localeCompare(a.date);
    });

  // ========================================
  // 🎨 JSX 렌더링
  // ========================================

  /**
   * JSX 반환
   *
   * 설명:
   * - React 컴포넌트는 JSX를 반환합니다.
   * - JSX는 HTML과 유사하지만 JavaScript 표현식을 사용할 수 있습니다.
   * - className 속성: CSS 모듈의 클래스를 적용
   * - 중괄호 {}: JavaScript 표현식을 사용할 때 사용
   */
  return (
    <div className={styles.point_page}>
      <main className={styles.main_content}>
        <div className={styles.container}>
          {/* 메인 탭 네비게이션 */}
          <TabNavigation
            activeTab={activeMainTab}
            setActiveTab={setActiveMainTab}
          />

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

            {/* 버튼 영역: 적립 예정 포인트 확인 + 출금 신청하기 */}
            <div className={styles.point_buttons}>
              <button
                className={styles.pending_point_button}
                onClick={() => {
                  if (is_mobile) {
                    router.push("/user/point/pending");
                  } else {
                    setIsPendingModalOpen(true);
                  }
                }}
              >
                적립 예정 포인트 확인
              </button>
              <button
                className={styles.withdrawal_button}
                onClick={handleWithdrawalClick}
              >
                출금 신청하기
              </button>
            </div>
          </article>

          {/* 포인트 내역 리스트 섹션 */}
          <article className={styles.history_list}>
            {/**
             * 배열 렌더링 - 빈 상태 처리 추가
             *
             * 설명:
             * - 포인트 내역이 없으면 안내 메시지를 표시합니다.
             * - 포인트 내역이 있으면 map 메서드를 사용하여 배열의 각 요소를 JSX로 변환합니다.
             * - key prop: React가 각 요소를 구분하기 위해 필요 (고유한 값 사용)
             * - 조건부 렌더링: 삼항 연산자와 && 연산자 사용
             */}
            {filteredHistoryData.length === 0 ? (
              <div className={styles.empty_state}>
                <p className={styles.empty_message}>포인트 내역이 없습니다.</p>
              </div>
            ) : (
              filteredHistoryData.map((history) => (
                <div key={history.id} className={styles.history_item}>
                  {/* PC 버전: 기존 구조 (모바일에서 숨김) */}
                  <div className={styles.status_badge_container}>
                    <div
                      className={`${styles.status_badge} ${
                        history.status === "earned"
                          ? styles.earned
                          : history.status === "completed"
                            ? styles.completed
                            : history.status === "pending"
                              ? styles.pending
                              : history.status === "failed" &&
                                  (history.type === "withdrawn" ||
                                    history.type === "withdrawal_pending")
                                ? styles.failed
                                : styles.cancelled
                      }`}
                    >
                      {history.status === "earned"
                        ? "적립"
                        : history.status === "completed"
                          ? "출금"
                          : history.status === "pending"
                            ? "신청"
                            : history.status === "failed" &&
                                (history.type === "withdrawn" ||
                                  history.type === "withdrawal_pending")
                              ? "반려"
                              : "취소"}
                    </div>
                  </div>

                  <div className={styles.history_info}>
                    <div className={styles.history_description}>
                      {history.status === "failed" ? (
                        <div className={styles.cancelled_description}>
                          <span className={styles.main_text}>
                            {history.description}
                          </span>
                          {history.rejection_reason &&
                            (history.type === "withdrawn" ||
                              history.type === "withdrawal_pending") && (
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
                                <span className={styles.reason_text}>
                                  사유 확인
                                </span>
                              </div>
                            )}
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

                  {/* 모바일 버전: 2줄 구조 (PC에서 숨김) */}
                  {/* 1번째 줄: 설명 (왼쪽) + 포인트 금액 + 잔액 (오른쪽, 세로 묶음) */}
                  <div className={styles.mobile_row_first}>
                    <div className={styles.mobile_description}>
                      {history.status === "failed" ? (
                        <div className={styles.cancelled_description}>
                          <span className={styles.main_text}>
                            {history.description}
                          </span>
                          {history.rejection_reason &&
                            (history.type === "withdrawn" ||
                              history.type === "withdrawal_pending") && (
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
                                <span className={styles.reason_text}>
                                  사유 확인
                                </span>
                              </div>
                            )}
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
                    <div
                      className={`${styles.mobile_status} ${
                        history.status === "earned"
                          ? styles.earned
                          : history.status === "completed"
                            ? styles.completed
                            : history.status === "pending"
                              ? styles.pending
                              : history.status === "failed" &&
                                  (history.type === "withdrawn" ||
                                    history.type === "withdrawal_pending")
                                ? styles.failed
                                : styles.cancelled
                      }`}
                    >
                      {history.status === "earned"
                        ? "적립"
                        : history.status === "completed"
                          ? "출금"
                          : history.status === "pending"
                            ? "출금 신청"
                            : history.status === "failed" &&
                                (history.type === "withdrawn" ||
                                  history.type === "withdrawal_pending")
                              ? "반려"
                              : "취소"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </article>
        </div>
      </main>

      {/* 적립 예정 포인트 확인 모달 */}
      <PendingPointModal
        is_open={is_pending_modal_open}
        on_close={() => setIsPendingModalOpen(false)}
        pending_list={pendingPointList}
      />

      {/* 반려 사유 모달 */}
      {/**
       * TextareaModal 컴포넌트
       *
       * 설명:
       * - 공통 모달 컴포넌트를 재사용하여 반려 사유를 표시합니다.
       * - readOnly 모드로 설정하여 읽기 전용으로 표시합니다.
       * - variant="reject"로 설정하여 반려 모달 스타일을 적용합니다.
       *
       */}
      <TextareaModal
        is_open={is_modal_open}
        on_close={handle_modal_close}
        title={modal_title}
        value={selected_rejection_reason}
        readOnly={true}
        variant="reject"
        buttons={["닫기"]}
      />

      {/* 계좌 정보 확인 모달 */}
      {/**
       * BaseModal 컴포넌트
       *
       * 설명:
       * - 계좌 정보가 없을 때 표시하는 모달입니다.
       * - "취소" 버튼: 모달을 닫습니다.
       * - "등록하기" 버튼: 내 정보 수정 페이지로 이동합니다.
       *
       */}
      <BaseModal
        is_open={is_account_modal_open}
        on_close={handleAccountModalClose}
        message="계좌 정보가 없습니다.<br>계좌 정보 등록 후 출금 신청을 할 수 있습니다."
        buttons={["취소", "등록"]}
        on_confirm={handleGoToAccountRegistration}
        type="center"
      />
    </div>
  );
}
