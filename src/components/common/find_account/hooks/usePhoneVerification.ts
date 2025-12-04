/**
 * 휴대폰 인증 관련 로직을 관리하는 커스텀 훅
 *
 * 사용처:
 * - src/components/common/FindAccountPage.tsx
 */

import { useEffect, useState } from "react";

interface UsePhoneVerificationReturn {
  phone: string;
  verificationCode: string;
  isVerified: boolean;
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
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [verificationCodeError, setVerificationCodeError] = useState<
    string | undefined
  >();

  /** 인증번호 유효 시간 타이머 - timer가 0보다 크면 1초마다 감소 */
  useEffect(() => {
    if (timer <= 0) return;

    const intervalId = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setIsVerificationRequested(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [timer]);

  /** 휴대폰 번호 변경 핸들러 */
  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setPhoneError(undefined);
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

  /** 인증 요청 핸들러 - 실제 구현 시 API를 호출하여 인증번호를 전송해야 함 */
  const handleVerificationRequest = async () => {
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

    // 🧪 테스트용 코드 - 실제 API 연결 시 전체 삭제 필요
    if (phone.length < 13) {
      setPhoneError("올바른 휴대폰 번호를 입력해주세요.");
      return;
    }

    console.log("인증번호 요청:", phone);
    setIsVerificationRequested(true);
    setIsVerified(false);
    setVerificationCode("");
    setTimer(180); // 3분
  };

  /** 인증번호 확인 핸들러 - 실제 구현 시 서버에 검증 요청해야 함 */
  const handleVerifyCode = () => {
    if (verificationCode.length !== 6) {
      setVerificationCodeError("인증번호 6자리를 모두 입력해주세요.");
      return;
    }

    console.log("인증번호 확인:", { phone, verificationCode });
    setIsVerified(true);
    setIsVerificationRequested(false);
    setTimer(0);
  };

  /** 인증 상태 초기화 */
  const resetVerification = () => {
    setPhone("");
    setIsVerified(false);
    setIsVerificationRequested(false);
    setVerificationCode("");
    setTimer(0);
    setPhoneError(undefined);
    setVerificationCodeError(undefined);
  };

  return {
    phone,
    verificationCode,
    isVerified,
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
    handleVerificationRequest,
    handleVerifyCode,
    resetVerification,
  };
}
