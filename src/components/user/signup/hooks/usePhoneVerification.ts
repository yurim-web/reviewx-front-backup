/* ========================================
   🎣 휴대폰 인증 관리 커스텀 훅
   ======================================== */

/**
 * 모듈 목적
 *
 * - 휴대폰 인증 상태 및 로직 관리
 * - 인증번호 요청, 인증 확인, 상태 초기화
 */

import { useState, useEffect, useRef } from 'react';
import {
  validatePhone,
  validateVerificationCode,
} from '@/utils/user/signup/validation';

interface UsePhoneVerificationReturn {
  phone: string;
  verificationCode: string;
  isVerificationRequested: boolean;
  isPhoneVerified: boolean;
  timer: number;
  setPhone: (phone: string) => void;
  setVerificationCode: (code: string) => void;
  handleVerificationRequest: () => string | null;
  handleVerify: () => string | null;
  resetVerification: () => void;
  setTimer: (seconds: number) => void;
}

/**
 * 휴대폰 인증 관리 커스텀 훅
 *
 * @returns 휴대폰 인증 상태 및 제어 함수
 */
export function usePhoneVerification(): UsePhoneVerificationReturn {
  const [phone, setPhone] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isVerificationRequested, setIsVerificationRequested] =
    useState<boolean>(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 관리
  useEffect(() => {
    if (timer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timer]);

  const handleVerificationRequest = (): string | null => {
    if (!validatePhone(phone)) {
      return '올바른 휴대폰 번호 형식을 입력해주세요.';
    }

    setIsVerificationRequested(true);
    setTimer(240); // 4분 = 240초
    console.log('인증번호 요청:', phone);
    return null;
  };

  const handleVerify = (): string | null => {
    if (!verificationCode || !validateVerificationCode(verificationCode)) {
      return '인증번호 6자리를 입력해주세요.';
    }

    // 테스트용: 인증번호가 '000000'이면 인증 성공
    if (verificationCode === '000000') {
      setIsPhoneVerified(true);
      setVerificationCode('');
      setTimer(0);
      console.log('인증 완료');
      return null;
    } else {
      return '인증번호가 일치하지 않습니다.';
    }
  };

  const resetVerification = () => {
    setIsPhoneVerified(false);
    setIsVerificationRequested(false);
    setVerificationCode('');
    setTimer(0);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  return {
    phone,
    verificationCode,
    isVerificationRequested,
    isPhoneVerified,
    timer,
    setPhone,
    setVerificationCode,
    handleVerificationRequest,
    handleVerify,
    resetVerification,
    setTimer,
  };
}
