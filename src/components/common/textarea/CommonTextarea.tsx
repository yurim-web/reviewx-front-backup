/* ========================================
   📋 공통 Textarea 컴포넌트
   ======================================== */

/**
 * 공통 Textarea 컴포넌트
 *
 * 📝 목적:
 * - 재사용 가능한 textarea 컴포넌트
 * - 커스텀 스크롤바 스타일 적용
 * - 에러 상태 표시 지원
 *
 * 📝 사용처:
 * - ManagerReportReasonModal.tsx
 * - 기타 textarea가 필요한 모달 컴포넌트
 *
 * 📝 React 학습 포인트:
 * - forwardRef: 부모 컴포넌트에서 ref를 전달받기 위해 사용
 * - React.forwardRef는 ref를 자식 컴포넌트로 전달할 수 있게 해주는 고차 컴포넌트(HOC)입니다
 * - useRef로 생성한 ref를 textarea DOM 요소에 직접 연결할 수 있습니다
 */

"use client";

import { forwardRef } from "react";
import styles from "@/styles/common/textarea/textarea_common.module.css";

// CommonTextarea 컴포넌트의 Props 타입 정의
// React.ChangeEvent<HTMLTextAreaElement>: textarea의 change 이벤트 타입
export interface CommonTextareaProps {
  // textarea의 현재 값
  value: string;
  // textarea 값이 변경될 때 호출되는 함수
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  // placeholder 텍스트
  placeholder?: string;
  // textarea의 행 수 (높이 결정)
  rows?: number;
  // 추가 CSS 클래스명 (옵션)
  className?: string;
  // 에러 상태 여부 (true일 때 빨간 테두리 표시)
  has_error?: boolean;
  // 이벤트 전파 방지 여부 (모달 내부에서 사용 시 true)
  stop_propagation?: boolean;
  // 읽기 전용 모드 (true일 때 입력 불가)
  readOnly?: boolean;
  // 비활성화 상태 (true일 때 입력 및 포커스 불가)
  disabled?: boolean;
}

/**
 * CommonTextarea 컴포넌트
 *
 * forwardRef를 사용하여 부모 컴포넌트에서 ref를 전달받을 수 있도록 합니다
 * forwardRef<반환할 ref 타입, props 타입>(컴포넌트 함수)
 */
const CommonTextarea = forwardRef<HTMLTextAreaElement, CommonTextareaProps>(
  (
    {
      value,
      onChange,
      placeholder = "내용을 입력해주세요",
      rows = 5,
      className = "",
      has_error = false,
      stop_propagation = true,
      readOnly = false,
      disabled = false,
    },
    ref
  ) => {
    // 이벤트 전파 방지 핸들러
    // 모달 내부에서 textarea를 클릭하거나 포커스할 때 모달이 닫히는 것을 방지합니다
    const handle_click = (e: React.MouseEvent<HTMLTextAreaElement>) => {
      if (stop_propagation) {
        // stopPropagation(): 이벤트가 부모 요소로 전파되는 것을 막습니다
        e.stopPropagation();
      }
    };

    const handle_focus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (stop_propagation) {
        e.stopPropagation();
      }
    };

    // wrapper 클래스명 동적 생성
    // 템플릿 리터럴과 삼항 연산자를 사용하여 조건부로 클래스를 추가합니다
    // trim(): 문자열 앞뒤 공백 제거
    const wrapper_class_name = `${styles.textarea_wrapper} ${
      has_error ? styles.textarea_error : ""
    }`.trim();

    // textarea 클래스명 동적 생성
    // 기존 className이 있으면 추가로 적용합니다
    const textarea_class_name = `${styles.textarea} ${className}`.trim();

    return (
      <div className={wrapper_class_name}>
        <textarea
          ref={ref}
          className={textarea_class_name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onClick={handle_click}
          onFocus={handle_focus}
          rows={rows}
          readOnly={readOnly}
          disabled={disabled}
        />
      </div>
    );
  }
);

// forwardRef로 만든 컴포넌트는 displayName을 설정해야 디버깅 시 이름이 표시됩니다
CommonTextarea.displayName = "CommonTextarea";

export default CommonTextarea;
