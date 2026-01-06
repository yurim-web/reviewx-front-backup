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
 * - 반려 사유 모달 표시 (적립 취소, 출금 신청 반려)
 *
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TabNavigation from "@/components/user/campaign_management/TabNavigation";
import PointTabNavigation from "@/components/common/point/PointTabNavigation";
import TextareaModal from "@/components/common/modal/TextareaModal";
import { MainTab, PointTab, PointHistory } from "@/types/user/user";
import { pointHistoryData } from "@/data/user/point/pointData";
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
   * - 모달의 제목을 저장합니다.
   * - 취소 상태에 따라 "적립 취소 사유" 또는 "출금 신청 반려 사유"로 구분됩니다.
   */
  const [modal_title, setModalTitle] = useState("반려 사유");

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
   * 출금 신청 버튼 클릭 핸들러
   *
   * 설명:
   * - "출금 신청하기" 버튼을 클릭했을 때 실행되는 함수입니다.
   * - Next.js의 router를 사용하여 출금 신청 페이지로 이동합니다.
   *
   * Next.js 학습 포인트:
   * - router.push(): 클라이언트 사이드 네비게이션 (페이지 새로고침 없이 이동)
   */
  const handleWithdrawalClick = () => {
    router.push("/user/point/withdrawal_request");
  };

  /**
   * 사유보기 버튼 클릭 핸들러
   *
   * 설명:
   * - "사유보기" 버튼을 클릭했을 때 실행되는 함수입니다.
   * - 해당 내역의 반려 사유를 모달에 표시합니다.
   * - 취소 상태에 따라 모달 제목을 구분합니다.
   *   - type이 "earned"이고 status가 "failed"면 "적립 취소 사유"
   *   - type이 "withdrawn"이고 status가 "failed"면 "출금 신청 반려 사유"
   *
   * JavaScript 학습 포인트:
   * - 화살표 함수: 매개변수를 받아서 함수 실행
   * - 조건부 로직: if 문을 사용하여 상태에 따라 다른 동작 수행
   * - 논리 연산자: && (AND), || (OR)
   */
  const handle_reason_click = (history: PointHistory) => {
    // 반려 사유가 있는 경우에만 모달 표시
    if (history.rejection_reason) {
      // 취소 상태 구분
      // type이 "earned"이고 status가 "failed"면 적립 취소
      if (history.type === "earned" && history.status === "failed") {
        setModalTitle("적립 취소 사유");
      }
      // type이 "withdrawn"이고 status가 "failed"면 출금 신청 반려
      else if (history.type === "withdrawn" && history.status === "failed") {
        setModalTitle("출금 신청 반려 사유");
      }
      // 기본값 (혹시 모를 경우를 대비)
      else {
        setModalTitle("반려 사유");
      }

      // 반려 사유 설정 및 모달 열기
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
   * - Props로 받은 filterFunction을 사용하여 포인트 내역을 필터링합니다.
   * - 날짜 기준으로 최신순(내림차순)으로 정렬합니다.
   * - 배열의 filter와 sort 메서드를 체이닝하여 사용합니다.
   *
   * JavaScript 학습 포인트:
   * - Array.filter(): 조건에 맞는 요소만 필터링하여 새 배열 반환
   * - Array.sort(): 배열을 정렬 (원본 배열을 변경함)
   * - 화살표 함수: (item) => 조건식 형태로 간단하게 작성
   * - 메서드 체이닝: 여러 메서드를 연속적으로 호출
   * - 날짜 비교: 문자열 형태의 날짜를 비교하여 정렬
   *   - b.date.localeCompare(a.date): b가 a보다 크면 양수 반환 (내림차순)
   */
  const filteredHistoryData = pointHistoryData
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
                <span className={styles.amount_number}>511,200</span>
                <span className={styles.amount_unit}>P</span>
              </div>
            </div>

            {/* 출금 신청 버튼 */}
            <button
              className={styles.withdrawal_button}
              onClick={handleWithdrawalClick}
            >
              출금 신청하기
            </button>
          </article>

          {/* 포인트 내역 리스트 섹션 */}
          <article className={styles.history_list}>
            {/**
             * 배열 렌더링
             *
             * 설명:
             * - map 메서드를 사용하여 배열의 각 요소를 JSX로 변환합니다.
             * - key prop: React가 각 요소를 구분하기 위해 필요 (고유한 값 사용)
             * - 조건부 렌더링: 삼항 연산자와 && 연산자 사용
             */}
            {filteredHistoryData.map((history) => (
              <div key={history.id} className={styles.history_item}>
                {/* 상태 배지 컨테이너 */}
                <div className={styles.status_badge_container}>
                  {/**
                   * 동적 클래스명 적용
                   *
                   * 설명:
                   * - 템플릿 리터럴(백틱)을 사용하여 여러 클래스를 조합합니다.
                   * - 삼항 연산자를 중첩하여 여러 조건을 체크합니다.
                   */}
                  <div
                    className={`${styles.status_badge} ${
                      history.status === "earned"
                        ? styles.earned
                        : history.status === "completed"
                        ? styles.completed
                        : history.status === "pending"
                        ? styles.pending
                        : styles.cancelled
                    }`}
                  >
                    {/**
                     * 조건부 텍스트 렌더링
                     *
                     * 설명:
                     * - 중첩된 삼항 연산자를 사용하여 상태에 따라 다른 텍스트를 표시합니다.
                     * - 조건 ? 값1 : 값2 형태
                     */}
                    {history.status === "earned"
                      ? "적립"
                      : history.status === "completed"
                      ? "완료"
                      : history.status === "pending"
                      ? "신청"
                      : "취소"}
                  </div>
                </div>

                {/* 내역 정보 */}
                <div className={styles.history_info}>
                  <div className={styles.history_description}>
                    {/**
                     * 조건부 렌더링
                     *
                     * 설명:
                     * - history.status === 'failed'인 경우에만 특별한 UI를 표시합니다.
                     * - && 연산자: 왼쪽이 true면 오른쪽을 반환, false면 아무것도 반환하지 않음
                     */}
                    {history.status === "failed" ? (
                      <div className={styles.cancelled_description}>
                        <span className={styles.main_text}>
                          {history.description}
                        </span>
                        {/**
                         * 반려 사유가 있는 경우에만 사유보기 버튼 표시
                         *
                         * 설명:
                         * - rejection_reason이 있을 때만 "사유보기" 버튼을 보여줍니다.
                         * - && 연산자: 왼쪽이 true면 오른쪽을 반환, false면 아무것도 반환하지 않음
                         */}
                        {history.rejection_reason && (
                          <div
                            className={styles.reason_section}
                            onClick={() => handle_reason_click(history)}
                          >
                            <div className={styles.reason_icon}>
                              {/**
                               * Next.js Image 컴포넌트
                               *
                               * 설명:
                               * - Next.js에서 제공하는 최적화된 이미지 컴포넌트입니다.
                               * - 자동으로 이미지를 최적화하고 lazy loading을 지원합니다.
                               * - width, height 속성 필수
                               */}
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
                  <div className={styles.history_date}>{history.date}</div>
                </div>

                {/* 포인트 정보 */}
                <div className={styles.point_info}>
                  {/**
                   * 동적 클래스명과 텍스트
                   *
                   * 설명:
                   * - 포인트 금액이 양수/음수에 따라 다른 스타일을 적용합니다.
                   * - toLocaleString(): 숫자를 천 단위 구분자로 포맷팅
                   */}
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
              </div>
            ))}
          </article>
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
       * React 학습 포인트:
       * - 조건부 렌더링: 모달이 열려있을 때만 렌더링
       * - Props 전달: 여러 속성을 컴포넌트에 전달
       * - 컴포넌트 재사용: 공통 컴포넌트를 여러 곳에서 사용
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
    </div>
  );
}
