/**
 * 휴대폰 인증 관련 로직을 관리하는 커스텀 훅 (공통)
 *
 * 사용 컴포넌트:
 * - src/components/common/FindAccountPage.tsx
 * - src/app/user/signup/page.tsx
 * - src/app/partner/signup/page.tsx
 * - src/app/user/find-account/page.tsx
 *
 * 사용 페이지:
 * - /find-account (사용자 아이디/비밀번호 찾기)
 * - /partner/find-account (파트너 아이디/비밀번호 찾기)
 * - /user/signup (사용자 회원가입)
 * - /partner/signup (파트너 회원가입)
 * - /user/find-account (사용자 계정 찾기)
 *
 * ================================================================================================
 * 📋 에러 메시지 종류 정리 (Error Message Types)
 * ================================================================================================
 *
 * 이 훅에서 관리하는 에러는 2가지 타입이 있습니다:
 *
 * 1️⃣ phoneError (휴대폰 번호 관련 에러)
 *    - 발생 위치: handleVerificationRequest 함수
 *    - 에러 종류:
 *      ✅ "MAX_VERIFICATION_REQUEST_EXCEEDED"
 *         → 발생 조건: 인증번호 요청 횟수가 5회를 초과했을 때
 *         → UI 표시: PhoneVerification 컴포넌트에서 "인증번호 요청 횟수를 모두 사용했습니다. 24시간 후 다시 시도해 주세요."로 변환되어 표시
 *         → 표시 위치: 인증번호 입력 영역 (휴대폰 번호 입력 필드 아래가 아님)
 *
 *      ✅ "올바른 휴대폰 번호 형식을 입력해주세요."
 *         → 발생 조건: validatePhone 함수 검증 실패 시
 *         → UI 표시: 휴대폰 번호 입력 필드 아래에 그대로 표시
 *
 * 2️⃣ verificationCodeError (인증번호 관련 에러)
 *    - 발생 위치: handleVerifyCode 함수, 타이머 useEffect
 *    - 에러 종류:
 *      ✅ "인증번호 6자리를 입력해주세요."
 *         → 발생 조건: 인증번호가 비어있거나 validateVerificationCode 함수 검증 실패 시
 *         → UI 표시: 인증번호 입력 필드 아래에 그대로 표시
 *
 *      ✅ "인증번호가 일치하지 않습니다."
 *         → 발생 조건: checkTestVerificationCode 함수에서 인증번호 불일치 시
 *         → UI 표시: PhoneVerification 컴포넌트에서 그대로 표시
 *
 *      ✅ "인증번호 입력 시간을 초과했습니다."
 *         → 발생 조건: 타이머가 0이 되고 인증이 완료되지 않았을 때 (useEffect에서 자동 설정)
 *         → UI 표시: 인증번호 입력 필드 아래에 그대로 표시
 *
 * ⚠️ 주의사항:
 *    - "MAX_VERIFICATION_REQUEST_EXCEEDED"는 phoneError로 설정되지만,
 *      PhoneVerification 컴포넌트에서 휴대폰 번호 입력 필드 아래에는 표시하지 않고,
 *      인증번호 입력 영역에만 표시됩니다.
 *    - 타이머가 0이 되었을 때 "인증번호 입력 시간을 초과했습니다." 에러는
 *      이 훅의 useEffect에서 자동으로 verificationCodeError에 설정됩니다.
 */

import { useEffect, useState, useRef } from "react";
import {
  validatePhone,
  validateVerificationCode,
} from "@/utils/validation";
import { checkTestVerificationCode } from "@/data/signup/testVerificationData";

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
  const [isVerificationRequested, setIsVerificationRequested] =
    useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [requestCount, setRequestCount] = useState<number>(0); // 인증번호 요청 횟수
  const MAX_REQUEST_COUNT = 5; // 최대 요청 가능 횟수
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [verificationCodeError, setVerificationCodeError] = useState<
    string | undefined
  >();

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
            setIsVerificationRequested(false);
            // 타이머가 0이 되고 인증이 완료되지 않았으면 에러 메시지 설정
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

  /** 인증 요청 핸들러 - 실제 구현 시 API를 호출하여 인증번호를 전송해야 함 */
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

    // ⚠️ 실제 API 연결 시 사용할 코드
    // try {
    //   const response = await requestVerificationAPI({ phone });
    //   if (response.success) {
    //     console.log("인증번호 전송 완료");
    //   } else {
    //     alert("인증번호 전송에 실패했습니다. 다시 시도해주세요.");
    //   }
    // } catch (error) {
    //   console.error("인증 요청 오류:", error);
    //   alert("인증번호 전송 중 오류가 발생했습니다.");
    // }

    // 인증번호 요청 상태로 변경
    setIsVerificationRequested(true);
    setIsVerified(false);
    setVerificationCode("");
    setPhoneError(undefined); // 요청 성공 시 에러 초기화
    setVerificationCodeError(undefined); // 재전송 시 인증번호 에러도 초기화 (시간 초과 에러 포함)
    setRequestCount((prev) => prev + 1); // 요청 횟수 증가
    setTimer(240); // 4분 = 240초 타이머 시작
    console.log("인증번호 요청:", phone);
  };

  /** 인증번호 확인 핸들러 - 실제 구현 시 서버에 검증 요청해야 함 */
  const handleVerifyCode = () => {
    // 인증번호 형식 검증 (6자리 숫자)
    if (!verificationCode || !validateVerificationCode(verificationCode)) {
      setVerificationCodeError("인증번호 6자리를 입력해주세요.");
      return;
    }

    // 📌 테스트용: 테스트 인증번호 확인
    // 실제 서비스에서는 서버 API를 호출해서 인증번호를 확인합니다
    if (checkTestVerificationCode(verificationCode)) {
      setIsVerified(true); // 인증 완료 상태로 변경
      setIsVerificationRequested(false);
      setVerificationCode(""); // 인증번호 입력 필드 초기화
      setTimer(0); // 타이머 정지
      setVerificationCodeError(undefined); // 에러 초기화
      console.log("인증 완료");
    } else {
      // 실제 에러 문구는 UI 컴포넌트(PhoneVerification)에서 관리하므로
      // 여기서는 "에러가 있다"는 신호만 전달합니다.
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
