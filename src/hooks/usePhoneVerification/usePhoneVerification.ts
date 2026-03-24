/* ========================================
   휴대폰 인증 커스텀 훅
   ======================================== */

/**
 * usePhoneVerification
 *
 * 목적: 휴대폰 인증 요청·코드 검증·타이머 관리 공통 로직 제공
 *
 * 사용 페이지:
 * - /find-account (사용자 아이디/비밀번호 찾기)
 * - /partner/find-account (파트너 아이디/비밀번호 찾기)
 * - /user/signup (사용자 회원가입)
 * - /partner/signup (파트너 회원가입)
 */

import { useEffect, useState, useRef } from "react";
import { validatePhone, validateVerificationCode } from "@/utils/validation";
import { apiClient } from "@/lib/api/client";

interface UsePhoneVerificationReturn {
  phone: string;
  verificationCode: string;
  isVerified: boolean;
  isPhoneVerified: boolean; // PhoneVerification 컴포넌트 호환성을 위한 별칭
  isVerificationRequested: boolean;
  timer: number;
  phoneError: string | undefined;
  verificationCodeError: string | undefined;
  setPhone: (value: string) => void;
  setVerificationCode: (value: string) => void;
  setIsVerified: (value: boolean) => void;
  setIsVerificationRequested: (value: boolean) => void;
  setTimer: (value: number) => void;
  setPhoneError: (value: string | undefined) => void;
  setVerificationCodeError: (value: string | undefined) => void;
  handlePhoneChange: (value: string) => void;
  handleVerificationCodeChange: (value: string) => void;
  handleVerificationRequest: () => Promise<void>;
  handleVerifyCode: () => void;
  resetVerification: () => void;
}

export function usePhoneVerification(): UsePhoneVerificationReturn {
  const [phone, setPhone] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isVerificationRequested, setIsVerificationRequested] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [requestCount, setRequestCount] = useState<number>(0); // 인증번호 요청 횟수
  const MAX_REQUEST_COUNT = 5; // 최대 요청 가능 횟수
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [verificationCodeError, setVerificationCodeError] = useState<string | undefined>();

  // 타이머 ID를 저장하기 위한 ref
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /** 인증번호 유효 시간 타이머 - timer가 0보다 크면 1초마다 감소 */
  useEffect(() => {
    if (timer > 0) {
      // 1초마다 실행되는 타이머 시작
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => {
          // 이전 값(prev)을 사용해서 1씩 감소
          if (prev <= 1) {
            // 타이머가 0이 되면 정지
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            // I_E10: 인증 만료 시 에러 표시 후 재발송 유도 (인증 영역은 유지)
            if (!isVerified) {
              setVerificationCodeError("인증번호 입력 시간을 초과했습니다.");
            }
            return 0;
          }
          return prev - 1; // 1초 감소
        });
      }, 1000); // 1000ms = 1초
    } else {
      // 타이머가 0이면 정지
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    // cleanup 함수: 컴포넌트가 언마운트되거나 timer가 변경되기 전에 실행
    // 메모리 누수를 방지하기 위해 타이머를 정리합니다
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timer, isVerified]);

  /** 휴대폰 번호 변경 핸들러 */
  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setPhoneError(undefined);
    // 전화번호가 변경되면 요청 횟수 초기화
    if (value !== phone) {
      setRequestCount(0);
    }
    if (isVerified) {
      setIsVerified(false);
    }
    if (isVerificationRequested) {
      setIsVerificationRequested(false);
      setTimer(0);
      setVerificationCode("");
      setVerificationCodeError(undefined);
    }
  };

  /** 인증번호 변경 핸들러 - 인증번호 입력 시 에러 메시지 자동 초기화 */
  const handleVerificationCodeChange = (value: string) => {
    setVerificationCode(value);
    // 인증번호 입력 시 에러 메시지 자동 초기화
    if (verificationCodeError) {
      setVerificationCodeError(undefined);
    }
  };

  /** 인증 요청 핸들러 - POST /api/admin/auth/phone/request 호출 */
  const handleVerificationRequest = async () => {
    // 인증번호 요청 횟수 제한 체크
    if (requestCount >= MAX_REQUEST_COUNT) {
      setPhoneError("MAX_VERIFICATION_REQUEST_EXCEEDED");
      return;
    }

    // 휴대폰 번호 형식 검증
    if (!validatePhone(phone)) {
      setPhoneError("올바른 휴대폰 번호 형식을 입력해주세요.");
      return;
    }

    try {
      const normalizedPhone = phone.replace(/-/g, "");
      await apiClient.post("/api/admin/auth/phone/request", { phone: normalizedPhone });

      // 인증번호 요청 상태로 변경
      setIsVerificationRequested(true);
      setIsVerified(false);
      setVerificationCode("");
      setPhoneError(undefined);
      setVerificationCodeError(undefined);
      setRequestCount((prev) => prev + 1);
      setTimer(240); // 4분 = 240초 타이머 시작
    } catch {
      setPhoneError("인증번호 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  /** 인증번호 확인 핸들러 - POST /api/admin/auth/phone/verify 호출 */
  const handleVerifyCode = async () => {
    // 인증번호 형식 검증 (6자리 숫자)
    if (!verificationCode || !validateVerificationCode(verificationCode)) {
      setVerificationCodeError("인증번호 6자리를 입력해주세요.");
      return;
    }

    try {
      const normalizedPhone = phone.replace(/-/g, "");
      const { data } = await apiClient.post("/api/admin/auth/phone/verify", {
        phone: normalizedPhone,
        code: verificationCode,
      });

      if (data.result === "OK") {
        setIsVerified(true);
        setIsVerificationRequested(false);
        setVerificationCode("");
        setTimer(0);
        setVerificationCodeError(undefined);
      } else {
        setVerificationCodeError("인증번호가 일치하지 않습니다.");
      }
    } catch {
      setVerificationCodeError("인증번호가 일치하지 않습니다.");
    }
  };

  /** 인증 상태 초기화 */
  const resetVerification = () => {
    setIsVerified(false); // 인증 완료 상태 초기화
    setIsVerificationRequested(false); // 인증번호 요청 상태 초기화
    setVerificationCode(""); // 인증번호 초기화
    setTimer(0); // 타이머 초기화
    setRequestCount(0); // 요청 횟수도 초기화
    setPhoneError(undefined);
    setVerificationCodeError(undefined);
    // 실행 중인 타이머가 있으면 정리
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  return {
    phone,
    verificationCode,
    isVerified,
    isPhoneVerified: isVerified, // PhoneVerification 컴포넌트 호환성을 위한 별칭
    isVerificationRequested,
    timer,
    phoneError,
    verificationCodeError,
    setPhone,
    setVerificationCode,
    setIsVerified,
    setIsVerificationRequested,
    setTimer,
    setPhoneError,
    setVerificationCodeError,
    handlePhoneChange,
    handleVerificationCodeChange,
    handleVerificationRequest,
    handleVerifyCode,
    resetVerification,
  };
}
