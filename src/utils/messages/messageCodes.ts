/* ========================================
   📋 전체 메시지 코드 상수 정의 (통합 관리)
   ======================================== */

/**
 * 모듈 목적
 *
 * - 기능명세서에 정의된 모든 메시지 코드를 통합 관리
 * - 메시지 타입, 버튼 정보, 변수 치환 등 메타데이터 포함
 * - 백엔드 API 응답과 프론트엔드 메시지 처리를 연결
 *
 * 📌 메시지 분류:
 * - 입력 오류 (I_E): 입력 검증 관련 에러
 * - 채널 연동 오류 (C_E): 채널 연동 관련 에러
 * - 출금 신청 오류 (W_E): 출금 관련 에러
 * - 포인트 오류 (P_E): 포인트 관련 에러
 * - 리뷰어 알림 (A_R): 리뷰어에게 보내는 알림
 * - 파트너 알림 (A_P): 파트너에게 보내는 알림
 * - 관리자 알림 (A_A): 관리자에게 보내는 알림
 * - 토스트 메시지 (T_M): 토스트 알림
 * - 액션 모달 (A_M): 사용자 액션 확인 모달
 * - 오류/예외 모달 (E_M): 오류 안내 모달
 * - 완료 안내 모달 (C_M): 완료 안내 모달
 * - 차단/조건 충족 모달 (B_M): 조건 미충족 안내 모달
 */

/**
 * ========================================
 * 메시지 타입 정의
 * ========================================
 */
export type MessageType =
  | "에러"
  | "헬프"
  | "정상"
  | "하단 캠페인 안내 / 파랑"
  | "하단 캠페인 안내 / 빨강"
  | "하단 캠페인 안내 / 초록"
  | "파랑"
  | "초록"
  | "빨강"
  | "주황";

/**
 * ========================================
 * 모달 버튼 타입 정의
 * ========================================
 */
export type ModalButtonType =
  | "닫기"
  | "확인"
  | "취소"
  | "로그인"
  | "비밀번호 찾기"
  | "카카오 로그인하기"
  | "네이버 로그인하기"
  | "탈퇴"
  | "연장"
  | "해제"
  | "등록";

/**
 * ========================================
 * 메시지 메타데이터 인터페이스
 * ========================================
 */
export interface MessageMetadata {
  /** 메시지 코드 */
  code: string;
  /** 메시지 텍스트 (변수 포함 가능, 예: {남은기간}) */
  message: string;
  /** 메시지 타입 */
  type: MessageType;
  /** 모달 버튼 텍스트 (배열로 여러 버튼 지원) */
  buttons?: ModalButtonType[];
  /** 사용 위치/페이지 */
  usage?: string;
  /** 비고/추가 설명 */
  remarks?: string;
  /** 변수 목록 (메시지에 포함된 변수) */
  variables?: string[];
}

/**
 * ========================================
 * 입력 오류 메시지 (I_E)
 * ========================================
 */
export const INPUT_ERROR_MESSAGES: Record<string, MessageMetadata> = {
  I_E1: {
    code: "I_E1",
    message: "이미 가입된 휴대폰 번호입니다.",
    type: "에러",
    usage: "회원가입",
  },
  I_E2: {
    code: "I_E2",
    message: "이미 사용 중인 닉네임입니다.",
    type: "에러",
    usage: "회원가입",
  },
  I_E3: {
    code: "I_E3",
    message:
      "8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.",
    type: "에러",
    usage: "회원가입, 비밀번호 재설정",
  },
  I_E4: {
    code: "I_E4",
    message: "비밀번호가 일치하지 않습니다.",
    type: "에러",
    usage: "회원가입, 비밀번호 재설정",
  },
  I_E5: {
    code: "I_E5",
    message: "인증번호가 일치하지 않습니다.",
    type: "에러",
    usage: "회원가입, 아이디/비밀번호 찾기",
  },
  I_E6: {
    code: "I_E6",
    message: "인증번호를 받지 못 하셨나요?",
    type: "헬프",
    usage: "회원가입, 아이디/비밀번호 찾기",
  },
  I_E7: {
    code: "I_E7",
    message: "아이디 또는 비밀번호가 일치하지 않습니다.",
    type: "에러",
    usage: "로그인",
  },
  I_E8: {
    code: "I_E8",
    message: "기존 비밀번호는 사용할 수 없습니다.",
    type: "에러",
    usage: "비밀번호 재설정",
  },
  I_E9: {
    code: "I_E9",
    message: "주민등록번호를 정확히 입력해 주세요.",
    type: "에러",
    usage: "회원가입, 내 정보 수정",
  },
  I_E10: {
    code: "I_E10",
    message: "인증번호 입력 시간을 초과했습니다.",
    type: "에러",
    usage: "로그인",
  },
  I_E11: {
    code: "I_E11",
    message: "정지되었거나 탈퇴된 계정입니다.",
    type: "에러",
    usage: "로그인",
  },
  I_E12: {
    code: "I_E12",
    message: "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.",
    type: "에러",
    usage: "로그인, 계정 찾기, 아이디/비밀번호 찾기",
  },
  I_E13: {
    code: "I_E13",
    message: "이미 사용 중인 아이디입니다.",
    type: "에러",
    usage: "회원가입",
  },
  I_E14: {
    code: "I_E14",
    message:
      "인증번호 요청 횟수를 모두 사용했습니다. 24시간 후 다시 시도해 주세요.",
    type: "에러",
    usage: "회원가입, 아이디/비밀번호 찾기",
  },
  I_E15: {
    code: "I_E15",
    message: "이미 사용 중인 카테고리명입니다.",
    type: "에러",
    usage: "카테고리 관리",
  },
};

/**
 * ========================================
 * 채널 연동 오류 메시지 (C_E)
 * ========================================
 */
export const CHANNEL_ERROR_MESSAGES: Record<string, MessageMetadata> = {
  C_E1: {
    code: "C_E1",
    message: "채널을 찾을 수 없습니다.",
    type: "에러",
  },
  C_E2: {
    code: "C_E2",
    message: "이미 등록된 채널입니다.",
    type: "에러",
  },
  C_E3: {
    code: "C_E3",
    message: "채널 정보를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.",
    type: "에러",
  },
  C_E4: {
    code: "C_E4",
    message: "{SNS이름} 아이디만 입력해 주세요.",
    type: "에러",
    variables: ["SNS이름"],
  },
  C_E5: {
    code: "C_E5",
    message: "{SNS이름} 핸들(아이디)만 입력해 주세요.",
    type: "에러",
    variables: ["SNS이름"],
  },
};

/**
 * ========================================
 * 출금 신청 오류 메시지 (W_E)
 * ========================================
 */
export const WITHDRAWAL_ERROR_MESSAGES: Record<string, MessageMetadata> = {
  W_E1: {
    code: "W_E1",
    message: "출금은 최소 10,000원부터 신청할 수 있습니다.",
    type: "에러",
  },
  W_E2: {
    code: "W_E2",
    message: "출금은 최대 500,000원까지 신청할 수 있습니다.",
    type: "에러",
  },
  W_E3: {
    code: "W_E3",
    message: "출금은 보유 포인트 이내에서만 신청할 수 있습니다.",
    type: "에러",
  },
};

/**
 * ========================================
 * 포인트 오류 메시지 (P_E)
 * ========================================
 */
export const POINT_ERROR_MESSAGES: Record<string, MessageMetadata> = {
  P_E3: {
    code: "P_E3",
    message: "보유 포인트가 부족합니다. 포인트를 충전한 후 다시 시도해 주세요.",
    type: "에러",
  },
};

/**
 * ========================================
 * 리뷰어 알림 메시지 (A_R)
 * ========================================
 */
export const REVIEWER_NOTIFICATION_MESSAGES: Record<string, MessageMetadata> = {
  A_R1: {
    code: "A_R1",
    message: "축하드립니다! 캠페인에 선정되셨습니다.",
    type: "하단 캠페인 안내 / 파랑",
  },
  A_R2: {
    code: "A_R2",
    message: "참여 중인 캠페인 정보가 수정되었습니다.",
    type: "하단 캠페인 안내 / 파랑",
  },
  A_R3: {
    code: "A_R3",
    message: "콘텐츠 등록 기간입니다. 콘텐츠를 등록해 주세요.",
    type: "하단 캠페인 안내 / 파랑",
  },
  A_R4: {
    code: "A_R4",
    message:
      "콘텐츠 등록 기간이 {남은기간}일 남았습니다. 콘텐츠를 등록해 주세요.",
    type: "하단 캠페인 안내 / 빨강",
    variables: ["남은기간"],
    remarks: "7일 전부터 마감 당일까지 매일 알림",
  },
  A_R5: {
    code: "A_R5",
    message: "등록한 콘텐츠가 승인되었습니다.",
    type: "하단 캠페인 안내 / 초록",
  },
  A_R6: {
    code: "A_R6",
    message: "등록한 콘텐츠가 반려되었습니다. 반려 사유를 확인해 주세요.",
    type: "하단 캠페인 안내 / 빨강",
  },
  A_R7: {
    code: "A_R7",
    message: "지각 제출 기간입니다. {남은기간}일 안에 콘텐츠를 등록해 주세요.",
    type: "하단 캠페인 안내 / 빨강",
    variables: ["남은기간"],
    remarks: "지각 제출 7일, 7일 전부터 마감 당일까지 매일 알림",
  },
  A_R8: {
    code: "A_R8",
    message: "콘텐츠 등록 기간이 3일 연장되었습니다.",
    type: "하단 캠페인 안내 / 파랑",
  },
  A_R9: {
    code: "A_R9",
    message: "캠페인이 완료되어 {포인트} P가 적립되었습니다.",
    type: "하단 캠페인 안내 / 초록",
    variables: ["포인트"],
  },
  A_R10: {
    code: "A_R10",
    message: "포인트 출금 신청이 접수되었습니다.",
    type: "파랑",
  },
  A_R11: {
    code: "A_R11",
    message: "출금 요청이 승인되었습니다.",
    type: "초록",
  },
  A_R12: {
    code: "A_R12",
    message: "출금 요청이 반려되었습니다. 반려 사유를 확인해 주세요.",
    type: "빨강",
  },
  A_R13: {
    code: "A_R13",
    message: "패널티가 부여되었습니다.",
    type: "주황",
  },
  A_R14: {
    code: "A_R14",
    message: "부여된 패널티가 해제되었습니다.",
    type: "주황",
  },
  A_R15: {
    code: "A_R15",
    message:
      "운영 정책 위반으로 인해 {정지기간}일 동안 캠페인에 참여할 수 없습니다.",
    type: "주황",
    variables: ["정지기간"],
  },
  A_R16: {
    code: "A_R16",
    message: "운영 정책 위반으로 인해 영구 차단되었습니다.",
    type: "주황",
  },
  A_R17: {
    code: "A_R17",
    message: "등록된 채널에 문제가 발생했습니다. 다시 연결해 주세요.",
    type: "빨강",
  },
};

/**
 * ========================================
 * 파트너 알림 메시지 (A_P)
 * ========================================
 */
export const PARTNER_NOTIFICATION_MESSAGES: Record<string, MessageMetadata> = {
  A_P1: {
    code: "A_P1",
    message: "캠페인 진행 상태가 변경되었습니다.",
    type: "하단 캠페인 안내 / 파랑",
  },
  A_P2: {
    code: "A_P2",
    message: "캠페인이 완료되었습니다.",
    type: "하단 캠페인 안내 / 파랑",
  },
  A_P3: {
    code: "A_P3",
    message: "운영 정책 위반으로 인해 캠페인이 게시 중지되었습니다.",
    type: "하단 캠페인 안내 / 빨강",
  },
  A_P4: {
    code: "A_P4",
    message: "리뷰어가 콘텐츠를 등록했습니다.",
    type: "하단 캠페인 안내 / 파랑",
  },
  A_P5: {
    code: "A_P5",
    message: "리뷰어가 콘텐츠 등록 기한 연장을 요청했습니다.",
    type: "하단 캠페인 안내 / 빨강",
  },
  A_P6: {
    code: "A_P6",
    message:
      "운영 정책 위반으로 인해 {정지기간}일 동안 캠페인을 등록할 수 없습니다.",
    type: "주황",
    variables: ["정지기간"],
  },
  A_P7: {
    code: "A_P7",
    message: "운영 정책 위반으로 인해 영구 차단되었습니다.",
    type: "주황",
  },
};

/**
 * ========================================
 * 관리자 알림 메시지 (A_A)
 * ========================================
 */
export const ADMIN_NOTIFICATION_MESSAGES: Record<string, MessageMetadata> = {
  A_A1: {
    code: "A_A1",
    message:
      "캠페인/콘텐츠 반려가 {개수}건 발생했습니다. 반려 내역을 확인해 주세요.",
    type: "빨강",
    variables: ["개수"],
  },
  A_A2: {
    code: "A_A2",
    message:
      "캠페인/콘텐츠 신고 또는 정책 위반 요소가 {개수}건 발생했습니다. 신고 내역을 확인해 주세요.",
    type: "빨강",
    variables: ["개수"],
  },
  A_A3: {
    code: "A_A3",
    message:
      "운영 정책 위반으로 차단된 계정이 {개수}건 발생했습니다. 차단 내역을 확인해 주세요.",
    type: "빨강",
    variables: ["개수"],
  },
  A_A4: {
    code: "A_A4",
    message: "신규 채팅 문의가 {개수}건 있습니다.",
    type: "주황",
    variables: ["개수"],
  },
  A_A5: {
    code: "A_A5",
    message: "출금 요청이 {개수}건 접수되었습니다.",
    type: "파랑",
    variables: ["개수"],
  },
  A_A6: {
    code: "A_A6",
    message: "긴급 출금 요청이 {개수}건 접수되었습니다.",
    type: "주황",
    variables: ["개수"],
  },
};

/**
 * ========================================
 * 토스트 메시지 (T_M)
 * ========================================
 */
export const TOAST_MESSAGES: Record<string, MessageMetadata> = {
  T_M1: {
    code: "T_M1",
    message: "복사되었습니다.",
    type: "정상",
  },
  T_M2: {
    code: "T_M2",
    message: "인증번호를 요청했습니다.",
    type: "정상",
  },
  T_M3: {
    code: "T_M3",
    message: "저장되었습니다.",
    type: "정상",
    remarks: "임시 저장",
  },
};

/**
 * ========================================
 * 액션 모달 메시지 (A_M)
 * ========================================
 */
export const ACTION_MODAL_MESSAGES: Record<string, MessageMetadata> = {
  A_M1: {
    code: "A_M1",
    message:
      "입력하신 휴대폰 번호로 가입된 계정이 있습니다.<br>아래 안내된 버튼을 통해 로그인해 주세요.",
    type: "에러",
    buttons: ["카카오 로그인하기", "네이버 로그인하기", "닫기"],
    remarks: "(1)/(2)는 가입된 계정에 따라 다름, 버튼 가로",
  },
  A_M2: {
    code: "A_M2",
    message:
      "캠페인 진행 시에는 삭제/수정이 불가합니다.<br>캠페인을 등록하시겠습니까?",
    type: "에러",
    buttons: ["취소", "확인"],
  },
  A_M3: {
    code: "A_M3",
    message: "캠페인을 삭제하시겠습니까?<br>이 작업은 되돌릴 수 없습니다.",
    type: "에러",
    buttons: ["취소", "확인"],
  },
  A_M4: {
    code: "A_M4",
    message: "차단을 해제하시겠습니까?",
    type: "에러",
    buttons: ["취소", "확인"],
  },
  A_M5: {
    code: "A_M5",
    message:
      "탈퇴 시 진행한 캠페인 기록과<br>포인트가 모두 삭제되며, 재가입이 불가합니다.<br>정말 탈퇴하시겠습니까?",
    type: "에러",
    buttons: ["취소", "탈퇴"],
  },
  A_M6: {
    code: "A_M6",
    message: "아이디 조회<br>{가입된 아이디(이메일)}<br>가입일: {가입일}",
    type: "에러",
    buttons: ["로그인", "비밀번호 찾기"],
    variables: ["가입된 아이디(이메일)", "가입일"],
    remarks: "버튼 가로",
  },
  A_M7: {
    code: "A_M7",
    message: "마지막에 저장된 내용을 불러오시겠습니까?",
    type: "에러",
    buttons: ["취소", "확인"],
  },
  A_M8: {
    code: "A_M8",
    message: "임시 저장하시겠습니까?",
    type: "에러",
    buttons: ["취소", "확인"],
  },
  A_M9: {
    code: "A_M9",
    message: "콘텐츠 등록 기간을<br>3일 연장하시겠습니까?",
    type: "에러",
    buttons: ["취소", "연장"],
  },
  A_M10: {
    code: "A_M10",
    message: "이미 연장한 내역이 있습니다.<br>3일 더 연장하시겠습니까?",
    type: "에러",
    buttons: ["취소", "연장"],
  },
  A_M11: {
    code: "A_M11",
    message: "캠페인의 콘텐츠 등록 기간을<br>3일 연장하시겠습니까?",
    type: "에러",
    buttons: ["취소", "연장"],
  },
  A_M12: {
    code: "A_M12",
    message: "신고 내역을 해제하시겠습니까?",
    type: "에러",
    buttons: ["취소", "해제"],
  },
  A_M13: {
    code: "A_M13",
    message:
      "이미 연장한 내역이 있습니다.<br>추가 연장은 이번 요청이 마지막입니다.<br>계속하시겠습니까?",
    type: "에러",
    buttons: ["취소", "확인"],
  },
};

/**
 * ========================================
 * 오류/예외 안내 모달 메시지 (E_M)
 * ========================================
 */
export const ERROR_MODAL_MESSAGES: Record<string, MessageMetadata> = {
  E_M1: {
    code: "E_M1",
    message: "접근 권한이 없습니다.",
    type: "에러",
    buttons: ["닫기"],
  },
  E_M2: {
    code: "E_M2",
    message: "로그인이 필요합니다.",
    type: "에러",
    buttons: ["확인"],
  },
  E_M3: {
    code: "E_M3",
    message: "유효하지 않은 요청입니다.",
    type: "에러",
    buttons: ["확인"],
  },
  E_M4: {
    code: "E_M4",
    message: "로그인이 만료되었습니다.<br>다시 로그인해주세요.",
    type: "에러",
    buttons: ["확인"],
  },
  E_M5: {
    code: "E_M5",
    message: "오류가 발생했습니다.<br>잠시 후 다시 시도해주세요.",
    type: "에러",
    buttons: ["확인"],
  },
  E_M6: {
    code: "E_M6",
    message: "지정된 확장자(JPG, PNG, GIF)만<br>업로드할 수 있습니다.",
    type: "에러",
    buttons: ["확인"],
  },
  E_M7: {
    code: "E_M7",
    message: "10mb 이하의 파일만 업로드할 수 있습니다.",
    type: "에러",
    buttons: ["확인"],
  },
  E_M8: {
    code: "E_M8",
    message: "이미지는 최대 7장까지 등록할 수 있습니다.",
    type: "에러",
    buttons: ["확인"],
  },
  E_M9: {
    code: "E_M9",
    message: "콘텐츠를 확인할 수 없습니다.",
    type: "에러",
    buttons: ["닫기"],
  },
  E_M10: {
    code: "E_M10",
    message: "결제가 실패했습니다.<br>다시 시도하시겠습니까?",
    type: "에러",
    buttons: ["취소", "확인"],
  },
  E_M11: {
    code: "E_M11",
    message: "등록 기간이 마감되었습니다.",
    type: "에러",
    buttons: ["닫기"],
  },
  E_M12: {
    code: "E_M12",
    message: "이미 취소된 캠페인입니다.",
    type: "에러",
    buttons: ["확인"],
  },
  E_M13: {
    code: "E_M13",
    message: "이미 참여한 캠페인입니다.",
    type: "에러",
    buttons: ["확인"],
  },
  E_M14: {
    code: "E_M14",
    message: "지정된 확장자(JPG, PNG, PDF)만<br>업로드할 수 있습니다.",
    type: "에러",
    buttons: ["확인"],
  },
  E_M15: {
    code: "E_M15",
    message: "다운로드에 실패하였습니다.",
    type: "에러",
    buttons: ["닫기"],
  },
  E_M16: {
    code: "E_M16",
    message: "다운로드할 데이터가 없습니다.",
    type: "에러",
    buttons: ["닫기"],
  },
  E_M17: {
    code: "E_M17",
    message: "이미 선택된 리뷰어입니다.",
    type: "에러",
    buttons: ["확인"],
  },
  E_M18: {
    code: "E_M18",
    message: "이미 처리된 요청입니다.",
    type: "에러",
    buttons: ["확인"],
  },
  E_M19: {
    code: "E_M19",
    message: "시작일과 종료일을 확인해 주세요.",
    type: "에러",
    buttons: ["확인"],
  },
  E_M20: {
    code: "E_M20",
    message:
      "콘텐츠 제출 방식을 선택해 주세요.<br>링크 제출 또는 이미지 제출 중 하나 이상을 선택해 주세요.",
    type: "에러",
    buttons: ["확인"],
  },
};

/**
 * ========================================
 * 완료 안내 모달 메시지 (C_M)
 * ========================================
 */
export const COMPLETE_MODAL_MESSAGES: Record<string, MessageMetadata> = {
  C_M1: {
    code: "C_M1",
    message: "저장이 완료되었습니다.",
    type: "정상",
    buttons: ["닫기"],
  },
  C_M2: {
    code: "C_M2",
    message: "출금 신청이 완료되었습니다.",
    type: "정상",
    buttons: ["닫기"],
  },
  C_M3: {
    code: "C_M3",
    message: "입금 확인 요청이 등록되었습니다.",
    type: "정상",
    buttons: ["닫기"],
  },
  C_M4: {
    code: "C_M4",
    message: "캠페인 신청이 완료되었습니다.",
    type: "정상",
    buttons: ["닫기"],
  },
  C_M5: {
    code: "C_M5",
    message: "신청하신 캠페인이 취소되었습니다.",
    type: "정상",
    buttons: ["확인"],
  },
  C_M6: {
    code: "C_M6",
    message: "채널이 연결되었습니다.",
    type: "정상",
    buttons: ["닫기"],
  },
  C_M7: {
    code: "C_M7",
    message:
      "결제가 완료되었습니다.<br>(보유 포인트: {보유포인트} P)<br>닫기를 누르면 이전 페이지로 돌아갑니다.",
    type: "정상",
    buttons: ["닫기"],
    variables: ["보유포인트"],
  },
  C_M8: {
    code: "C_M8",
    message: "결제가 완료되었습니다.<br>(보유 포인트: {보유포인트} P)",
    type: "정상",
    buttons: ["닫기"],
    variables: ["보유포인트"],
  },
  C_M9: {
    code: "C_M9",
    message: "신고가 완료되었습니다.",
    type: "정상",
    buttons: ["닫기"],
  },
  C_M10: {
    code: "C_M10",
    message: "차단이 완료되었습니다.",
    type: "정상",
    buttons: ["닫기"],
  },
  C_M11: {
    code: "C_M11",
    message: "해제가 완료되었습니다.",
    type: "정상",
    buttons: ["닫기"],
  },
  C_M12: {
    code: "C_M12",
    message: "비밀번호 변경이 완료되었습니다.",
    type: "정상",
    buttons: ["닫기"],
  },
  C_M13: {
    code: "C_M13",
    message: "등록 기간 연장이 완료되었습니다.",
    type: "정상",
    buttons: ["닫기"],
  },
  C_M14: {
    code: "C_M14",
    message: "등록 기간 연장이 거절되었습니다.",
    type: "정상",
    buttons: ["닫기"],
  },
};

/**
 * ========================================
 * 차단/조건 충족 모달 메시지 (B_M)
 * ========================================
 */
export const BLOCK_MODAL_MESSAGES: Record<string, MessageMetadata> = {
  B_M1: {
    code: "B_M1",
    message:
      "마지막 출금 이후 7일이 지나야<br>다시 출금할 수 있습니다.<br>(현재: {경과일}일 경과)",
    type: "에러",
    buttons: ["닫기"],
    variables: ["경과일"],
  },
  B_M2: {
    code: "B_M2",
    message:
      "계좌 정보가 없습니다.<br>계좌 정보 등록 후 출금 신청을 할 수 있습니다.",
    type: "에러",
    buttons: ["닫기", "등록"],
  },
  B_M3: {
    code: "B_M3",
    message: "파트너 계정은 캠페인 신청이 불가합니다.",
    type: "에러",
    buttons: ["닫기"],
  },
  B_M4: {
    code: "B_M4",
    message: "모집 인원을 초과할 수 없습니다.",
    type: "에러",
    buttons: ["닫기"],
  },
  B_M5: {
    code: "B_M5",
    message: "탈퇴한 회원은 조회할 수 없습니다.",
    type: "에러",
    buttons: ["닫기"],
  },
  B_M6: {
    code: "B_M6",
    message:
      "진행 중인 캠페인이 있을 경우<br>탈퇴가 불가합니다.<br>먼저 캠페인을 완료해 주세요.",
    type: "에러",
    buttons: ["닫기"],
  },
  B_M7: {
    code: "B_M7",
    message: "연장은 최대 두 번까지만 가능합니다.",
    type: "에러",
    buttons: ["닫기"],
  },
  B_M8: {
    code: "B_M8",
    message: "정지 회원은 신규 캠페인 등록이 불가합니다.",
    type: "에러",
    buttons: ["닫기"],
  },
  B_M9: {
    code: "B_M9",
    message: "정지 회원은 캠페인 신청이 불가합니다.",
    type: "에러",
    buttons: ["닫기"],
  },
  B_M10: {
    code: "B_M10",
    message:
      "게시글이 등록된 상태에서는 삭제할 수 없습니다.<br>게시글을 삭제한 후 진행해 주세요.",
    type: "에러",
    buttons: ["닫기"],
  },
};

/**
 * ========================================
 * 모든 메시지 통합
 * ========================================
 */
export const ALL_MESSAGES: Record<string, MessageMetadata> = {
  ...INPUT_ERROR_MESSAGES,
  ...CHANNEL_ERROR_MESSAGES,
  ...WITHDRAWAL_ERROR_MESSAGES,
  ...POINT_ERROR_MESSAGES,
  ...REVIEWER_NOTIFICATION_MESSAGES,
  ...PARTNER_NOTIFICATION_MESSAGES,
  ...ADMIN_NOTIFICATION_MESSAGES,
  ...TOAST_MESSAGES,
  ...ACTION_MODAL_MESSAGES,
  ...ERROR_MODAL_MESSAGES,
  ...COMPLETE_MODAL_MESSAGES,
  ...BLOCK_MODAL_MESSAGES,
};

/**
 * ========================================
 * 메시지 코드 타입
 * ========================================
 */
export type MessageCode = keyof typeof ALL_MESSAGES;

/**
 * ========================================
 * 메시지 가져오기 함수
 * ========================================
 *
 * @param code - 메시지 코드 (예: 'I_E1', 'A_R1')
 * @param replaceValues - 변수 치환 값 (예: {남은기간: '3', 포인트: '1000'})
 * @returns 메시지 메타데이터
 *
 * @example
 * ```typescript
 * const message = getMessage('I_E1');
 * // { code: 'I_E1', message: '이미 가입된 휴대폰 번호입니다.', ... }
 *
 * const message = getMessage('A_R4', { 남은기간: '3' });
 * // { code: 'A_R4', message: '콘텐츠 등록 기간이 3일 남았습니다. ...', ... }
 * ```
 */
export function getMessage(
  code: string,
  replaceValues?: Record<string, string>
): MessageMetadata | null {
  const metadata = ALL_MESSAGES[code];

  if (!metadata) {
    return null;
  }

  // 변수 치환이 필요한 경우
  if (replaceValues && metadata.variables) {
    let processedMessage = metadata.message;

    Object.entries(replaceValues).forEach(([key, value]) => {
      // {변수명} 형식으로 치환
      processedMessage = processedMessage.replace(
        new RegExp(`\\{${key}\\}`, "g"),
        value
      );
    });

    return {
      ...metadata,
      message: processedMessage,
    };
  }

  return metadata;
}

/**
 * ========================================
 * 메시지 텍스트만 가져오기
 * ========================================
 *
 * @param code - 메시지 코드
 * @param replaceValues - 변수 치환 값
 * @returns 메시지 텍스트 (HTML 태그 포함 가능)
 */
export function getMessageText(
  code: string,
  replaceValues?: Record<string, string>
): string {
  const metadata = getMessage(code, replaceValues);
  return metadata?.message || "";
}

/**
 * ========================================
 * 메시지 코드 유효성 검증
 * ========================================
 */
export function isValidMessageCode(code: string): code is MessageCode {
  return code in ALL_MESSAGES;
}
