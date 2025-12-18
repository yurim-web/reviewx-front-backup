/* ========================================
   🛠️ 메시지 헬퍼 유틸리티
   ======================================== */

/**
 * 모듈 목적
 *
 * - 메시지 코드를 실제 UI 컴포넌트에서 쉽게 사용할 수 있도록 도와주는 헬퍼 함수
 * - 모달, 토스트, 알림 등 다양한 UI 컴포넌트에서 사용
 *
 * 📍 사용 위치:
 * - 모달 컴포넌트
 * - 토스트 컴포넌트
 * - 알림 컴포넌트
 * - 에러 처리
 */

import React from "react";
import {
  getMessage,
  getMessageText,
  type MessageMetadata,
  type MessageCode,
  type MessageType,
} from "./messageCodes";

/**
 * ========================================
 * 메시지 타입에 따른 색상 클래스 반환
 * ========================================
 *
 * CSS 모듈에서 사용할 클래스명을 반환합니다.
 *
 * @param type - 메시지 타입
 * @returns CSS 클래스명 (예: 'message_error', 'message_success')
 */
export function getMessageTypeClass(type: MessageType): string {
  const typeMap: Record<string, string> = {
    에러: "message_error",
    헬프: "message_help",
    정상: "message_success",
    "하단 캠페인 안내 / 파랑": "message_info_blue",
    "하단 캠페인 안내 / 빨강": "message_info_red",
    "하단 캠페인 안내 / 초록": "message_info_green",
    파랑: "message_blue",
    초록: "message_green",
    빨강: "message_red",
    주황: "message_orange",
  };

  return typeMap[type] || "message_default";
}

/**
 * ========================================
 * HTML 태그를 포함한 메시지를 React 요소로 변환
 * ========================================
 *
 * <br> 태그를 실제 줄바꿈으로 변환합니다.
 *
 * @param message - HTML 태그가 포함된 메시지
 * @returns React 요소 배열
 *
 * @example
 * ```typescript
 * const message = "첫 번째 줄<br>두 번째 줄";
 * const elements = parseMessageWithHTML(message);
 * // [<React.Fragment key="0">첫 번째 줄</React.Fragment>, <br key="1" />, ...]
 * ```
 */
export function parseMessageWithHTML(
  message: string
): (string | React.ReactElement)[] {
  const parts = message.split(/<br\s*\/?>/i);
  const result: (string | React.ReactElement)[] = [];

  parts.forEach((part, index) => {
    if (index > 0) {
      result.push(React.createElement("br", { key: `br-${index}` }));
    }
    result.push(part);
  });

  return result;
}

/**
 * ========================================
 * 메시지 코드로부터 모달 Props 생성
 * ========================================
 *
 * 모달 컴포넌트에서 사용할 수 있는 props를 생성합니다.
 *
 * @param code - 메시지 코드
 * @param replaceValues - 변수 치환 값
 * @returns 모달에 사용할 props
 *
 * @example
 * ```typescript
 * const modalProps = getModalProps('A_M2', {});
 * // {
 * //   message: '캠페인 진행 시에는 삭제/수정이 불가합니다...',
 * //   buttons: ['취소', '확인'],
 * //   type: '에러'
 * // }
 * ```
 */
export function getModalProps(
  code: string,
  replaceValues?: Record<string, string>
) {
  const metadata = getMessage(code, replaceValues);

  if (!metadata) {
    return {
      message: "알 수 없는 오류가 발생했습니다.",
      buttons: ["닫기"],
      type: "에러" as MessageType,
    };
  }

  return {
    message: metadata.message,
    buttons: metadata.buttons || ["닫기"],
    type: metadata.type,
    code: metadata.code,
    usage: metadata.usage,
    remarks: metadata.remarks,
  };
}

/**
 * ========================================
 * 토스트 메시지 Props 생성
 * ========================================
 *
 * @param code - 토스트 메시지 코드 (T_M으로 시작)
 * @param replaceValues - 변수 치환 값
 * @returns 토스트에 사용할 props
 */
export function getToastProps(
  code: string,
  replaceValues?: Record<string, string>
) {
  const metadata = getMessage(code, replaceValues);

  if (!metadata) {
    return {
      message: "알 수 없는 오류가 발생했습니다.",
      type: "정상" as MessageType,
    };
  }

  return {
    message: metadata.message,
    type: metadata.type,
    code: metadata.code,
  };
}

/**
 * ========================================
 * 알림 메시지 Props 생성
 * ========================================
 *
 * @param code - 알림 메시지 코드 (A_R, A_P, A_A로 시작)
 * @param replaceValues - 변수 치환 값
 * @returns 알림에 사용할 props
 */
export function getNotificationProps(
  code: string,
  replaceValues?: Record<string, string>
) {
  const metadata = getMessage(code, replaceValues);

  if (!metadata) {
    return {
      message: "알 수 없는 알림입니다.",
      type: "정상" as MessageType,
    };
  }

  return {
    message: metadata.message,
    type: metadata.type,
    code: metadata.code,
    label: getNotificationLabel(metadata.type),
  };
}

/**
 * ========================================
 * 알림 타입에 따른 라벨 텍스트 반환
 * ========================================
 *
 * @param type - 메시지 타입
 * @returns 라벨 텍스트
 */
function getNotificationLabel(type: MessageType): string {
  if (type.includes("파랑")) return "안내";
  if (type.includes("초록")) return "완료";
  if (type.includes("빨강")) return "주의";
  if (type.includes("주황")) return "경고";
  return "알림";
}
