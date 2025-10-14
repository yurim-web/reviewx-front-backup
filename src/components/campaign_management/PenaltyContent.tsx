/**
 * 패널티 내역 컴포넌트
 * - 사용자의 패널티 현황과 내역을 보여주는 컴포넌트
 */

import styles from "../../styles/campaign_management/campaign_management.module.css";
import penaltyStyles from "../../styles/campaign_management/penalty.module.css";

// TypeScript 타입 정의 - 패널티 상태 (4가지 상태)
type PenaltyStatus = "활동 가능" | "경고 조치" | "이용 정지 15일" | "영구 정지";

// TypeScript 타입 정의 - 패널티 종류 (4가지 종류)
type PenaltyType = "경고" | "주의" | "정지" | "제재";

// 개별 패널티 아이템의 구조를 정의하는 인터페이스
interface PenaltyItem {
  id: string; // 고유 ID
  type: PenaltyType; // 패널티 종류
  title: string; // 패널티 제목
  date: string; // 발생 날짜
}

/* ========================================
   목업 데이터 (Mock Data)
   - 실제 개발에서는 API에서 받아올 데이터
   - 지금은 테스트용으로 하드코딩된 샘플 데이터
======================================== */

// 패널티 내역 목업 데이터 (배열) - 이미지 기준으로 업데이트
// 빈 상태를 보고싶다면 주석처리하기~

const mockPenaltyData: PenaltyItem[] = [
  { id: "1", type: "정지", title: "캠페인 지각 제출", date: "2025-09-12" },
  { id: "2", type: "주의", title: "캠페인 반복 반려", date: "2025-09-10" },
  { id: "3", type: "주의", title: "캠페인 지각 제출", date: "2025-09-12" },
  { id: "4", type: "주의", title: "캠페인 반복 반려", date: "2025-09-10" },
  { id: "5", type: "주의", title: "캠페인 반복 반려", date: "2025-09-10" },
  { id: "6", type: "주의", title: "캠페인 반복 반려", date: "2025-09-10" },
  { id: "7", type: "제재", title: "이용 정지 3일", date: "2025-09-10" },
  {
    id: "8",
    type: "경고",
    title: "캠페인 의무 노출 기간 불이행",
    date: "2025-09-08",
  },
  { id: "9", type: "경고", title: "캠페인 지시 불이행", date: "2025-09-06" },
  {
    id: "10",
    type: "경고",
    title: "캠페인 무단 이탈 (노쇼)",
    date: "2025-09-10",
  },
  {
    id: "11",
    type: "경고",
    title: "캠페인 의무 노출 기간 불이행",
    date: "2025-09-01",
  },
];

// 패널티 내역 목업 데이터 (배열) - 빈 상태 테스트용으로 빈 배열
// 빈상태 보고 싶을때 위에꺼 주석처리하고 이거 주석 풀기!!
// const mockPenaltyData: PenaltyItem[] = [];

// 사용자 현재 패널티 상태 목업 데이터 (객체)
// as PenaltyStatus는 TypeScript 타입 단언(Type Assertion)
const mockUserStatus = {
  currentStatus: "이용 정지 15일" as PenaltyStatus, // 현재 패널티 상태
  penaltyCount: 12, // 총 패널티 횟수
};

/* ========================================
   설정 객체들 (Configuration Objects)
   - 반복되는 설정들을 객체로 관리
   - switch문 대신 객체 사용 (성능상 이점)
======================================== */

// 패널티 상태별 CSS 클래스와 진행바 설정
// 객체의 키(key)가 패널티 상태, 값(value)이 설정
const statusConfig = {
  "활동 가능": {
    className: penaltyStyles.active_status, // CSS 클래스명
    progress: { leftWidth: "0%", rightWidth: "0%" }, // 진행바 너비 (활동 가능: 진행바 없음)
  },
  "경고 조치": {
    className: penaltyStyles.warning_status,
    progress: { leftWidth: "30%", rightWidth: "0%" }, // 경고: 왼쪽 30%만
  },
  "이용 정지": {
    className: penaltyStyles.suspension_status,
    progress: { leftWidth: "100%", rightWidth: "30%" }, // 정지: 왼쪽 100%, 오른쪽 30%
  },
  "이용 정지 15일": {
    className: penaltyStyles.suspension_status,
    progress: { leftWidth: "100%", rightWidth: "30%" }, // 정지: 왼쪽 100%, 오른쪽 30%
  },
  "영구 정지": {
    className: penaltyStyles.permanent_ban_status,
    progress: { leftWidth: "100%", rightWidth: "100%" }, // 영구정지: 모든 바 100%
  },
};

// 패널티 타입별 배지 CSS 클래스 설정
// 객체 키는 따옴표 없이도 사용 가능 (유효한 식별자인 경우)
const typeBadgeClasses = {
  경고: penaltyStyles.warning_badge, // 경고 배지 스타일
  주의: penaltyStyles.caution_badge, // 주의 배지 스타일
  정지: penaltyStyles.stop_badge, // 정지 배지 스타일
  제재: penaltyStyles.sanction_badge, // 제재 배지 스타일
};

/* ========================================
   메인 React 컴포넌트
   - React 함수형 컴포넌트 (Function Component)
   - export default로 내보내서 다른 파일에서 import 가능
======================================== */

export default function PenaltyContent() {
  /* ========================================
     데이터 및 상태 초기화
     - 컴포넌트 내부에서 사용할 변수들 정의
  ======================================== */

  // 목업 데이터를 컴포넌트 변수에 할당
  const penaltyData = mockPenaltyData; // 패널티 내역 데이터
  const userStatus = mockUserStatus; // 사용자 패널티 상태

  // 패널티 데이터 존재 여부 확인 (불린값)
  // .length > 0은 배열에 요소가 있는지 확인하는 일반적인 방법
  const hasPenaltyData = penaltyData.length > 0;

  /* ========================================
     UI 계산 로직
     - 현재 상태에 따라 어떤 스타일을 적용할지 결정
  ======================================== */

  // 객체에서 현재 상태에 맞는 설정 가져오기
  // statusConfig["영구 정지"] 와 같이 동작
  const config = statusConfig[userStatus.currentStatus];

  // 구조 분해 할당(Destructuring Assignment)으로 진행바 너비 추출
  // config.progress.leftWidth, config.progress.rightWidth 대신 간단하게
  const { leftWidth, rightWidth } = config.progress;

  // 주의 라벨 활성화 조건 (이용정지 또는 영구정지일 때)
  const isCautionActive =
    userStatus.currentStatus === "이용 정지" ||
    userStatus.currentStatus === "이용 정지 15일" ||
    userStatus.currentStatus === "영구 정지";

  // 삼항 연산자(Ternary Operator) 사용
  // 조건 ? 참일때값 : 거짓일때값
  const cautionLabelClass = isCautionActive
    ? penaltyStyles.caution_label_active // 활성화된 스타일
    : penaltyStyles.caution_label; // 기본 스타일

  /* ========================================
     JSX 반환 (Return JSX)
     - JSX: JavaScript + XML, React에서 UI를 표현하는 문법
     - HTML 비슷하지만 JavaScript 표현식 사용 가능 { }
  ======================================== */

  return (
    <main className={penaltyStyles.penalty_content}>
      {/* ========== 패널티 현황 섹션 ========== */}
      <section className={penaltyStyles.penalty_stage_section}>
        {/* 패널티 현황 헤더 */}
        <article className={penaltyStyles.penalty_status_header}>
          <h2 className={penaltyStyles.penalty_section_title}>패널티 현황</h2>
          {/* 
            템플릿 리터럴(`${}`) 사용하여 여러 CSS 클래스 결합
            config.className은 현재 상태에 따른 동적 클래스
          */}
          <strong
            className={`${penaltyStyles.penalty_status_base} ${config.className}`}
            aria-label="현재 패널티 상태"
          >
            {/* JSX에서 중괄호 {}는 JavaScript 표현식을 넣는 곳 */}
            {userStatus.currentStatus}
          </strong>
        </article>

        {/* 패널티 진행 단계 바 */}
        <div className={penaltyStyles.penalty_stage_info}>
          {/* role="progressbar"는 접근성(accessibility)을 위한 속성 */}
          <div className={penaltyStyles.penalty_stage_bar} role="progressbar">
            <div className={penaltyStyles.stage_bar_container}>
              {/* 경고 단계 라벨 */}
              <span className={penaltyStyles.warning_label} aria-current="step">
                경고
              </span>

              {/* 경고 단계 진행바 */}
              <div className={penaltyStyles.left_stage_bar} aria-hidden="true">
                {/* 
                  style 속성에 객체 전달 (인라인 스타일)
                  width 값은 위에서 계산한 leftWidth 변수 사용
                */}
                <div
                  className={penaltyStyles.stage_bar_fill}
                  style={{ width: leftWidth }}
                ></div>
              </div>

              {/* 주의 단계 라벨 */}
              <span className={cautionLabelClass}>주의</span>

              {/* 주의/정지 단계 진행바 */}
              <div className={penaltyStyles.right_stage_bar} aria-hidden="true">
                <div
                  className={penaltyStyles.right_stage_bar_fill}
                  style={{ width: rightWidth }}
                ></div>
              </div>

              {/* 정지 단계 라벨 */}
              <span className={penaltyStyles.stop_label}>정지</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 패널티 내역 섹션 ========== */}
      <section className={penaltyStyles.penalty_history_section}>
        <h2 className={penaltyStyles.penalty_history_title}>패널티 내역</h2>

        {/* 
          조건부 렌더링 (Conditional Rendering)
          삼항 연산자 사용: 조건 ? 참일때 JSX : 거짓일때 JSX
        */}
        {hasPenaltyData ? (
          <ul className={penaltyStyles.penalty_list}>
            {/* 
              .map() 메소드로 배열 렌더링 (React에서 리스트 렌더링하는 기본 방법)
              각 배열 요소를 JSX 요소로 변환
              key prop은 React가 요소를 추적하기 위해 필요 (고유값이어야 함)
            */}
            {penaltyData.map((penalty) => (
              <li key={penalty.id} className={penaltyStyles.penalty_item}>
                {/* 패널티 타입 배지 */}
                <div
                  className={`${penaltyStyles.penalty_point_badge} ${
                    typeBadgeClasses[penalty.type]
                  }`}
                  aria-label="패널티 태그"
                >
                  {penalty.type}
                </div>

                {/* 패널티 상세 정보 */}
                <div className={penaltyStyles.penalty_details}>
                  <h3 className={penaltyStyles.penalty_title_text}>
                    {penalty.title}
                  </h3>
                  {/* 
                    <time> 태그는 날짜/시간을 의미적으로 표현
                    dateTime 속성은 기계가 읽을 수 있는 형식
                  */}
                  <time
                    className={penaltyStyles.penalty_date}
                    dateTime={penalty.date}
                  >
                    {penalty.date}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={penaltyStyles.empty_penalty_state}>
            <p className={penaltyStyles.empty_penalty_message}>
              패널티 내역이 없습니다.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
