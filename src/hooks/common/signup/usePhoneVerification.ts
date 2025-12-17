/* ========================================
   🎣 휴대폰 인증 관리 커스텀 훅 (공통)
   ======================================== */

/**
 * 모듈 목적
 *
 * - 휴대폰 인증 상태 및 로직 관리
 * - 인증번호 요청, 인증 확인, 상태 초기화
 *
 * 📍 사용 페이지/컴포넌트:
 * - src/app/user/signup/page.tsx
 *   (사용자 회원가입 페이지에서 휴대폰 인증 로직 관리)
 * - src/app/partner/signup/page.tsx
 *   (파트너 회원가입 페이지에서 휴대폰 인증 로직 관리)
 *
 * 📌 공통 훅 위치:
 * - src/hooks/common/signup/usePhoneVerification.ts
 *   (user와 partner 회원가입 페이지에서 공통으로 사용하는 훅)
 */

import { useState, useEffect, useRef } from 'react';
import {
  validatePhone,
  validateVerificationCode,
} from '@/utils/signup/validation';
import { checkTestVerificationCode } from '@/data/signup/testVerificationData';

/**
 * 📌 커스텀 훅의 반환 타입 정의
 *
 * 이 훅이 반환하는 모든 값과 함수들의 타입을 미리 정의합니다.
 * TypeScript를 사용하면 컴포넌트에서 이 훅을 사용할 때 자동완성과 타입 체크가 가능합니다.
 */
interface UsePhoneVerificationReturn {
  phone: string; // 입력된 휴대폰 번호
  verificationCode: string; // 입력된 인증번호
  isVerificationRequested: boolean; // 인증번호 요청 여부
  isPhoneVerified: boolean; // 인증 완료 여부
  timer: number; // 남은 시간(초)
  setPhone: (phone: string) => void; // 휴대폰 번호 설정 함수
  setVerificationCode: (code: string) => void; // 인증번호 설정 함수
  handleVerificationRequest: () => string | null; // 인증번호 요청 함수 (에러 메시지 반환)
  handleVerify: () => string | null; // 인증 확인 함수 (에러 메시지 반환)
  resetVerification: () => void; // 인증 상태 초기화 함수
  setTimer: (seconds: number) => void; // 타이머 설정 함수
}

/**
 * 휴대폰 인증 관리 커스텀 훅
 *
 * @returns 휴대폰 인증 상태 및 제어 함수
 */
export function usePhoneVerification(): UsePhoneVerificationReturn {
  // 📌 상태 관리: useState로 컴포넌트의 상태를 관리합니다
  const [phone, setPhone] = useState<string>(''); // 휴대폰 번호
  const [verificationCode, setVerificationCode] = useState<string>(''); // 인증번호
  const [isVerificationRequested, setIsVerificationRequested] =
    useState<boolean>(false); // 인증번호 요청 여부
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false); // 인증 완료 여부
  const [timer, setTimer] = useState<number>(0); // 타이머(초 단위)

  // 📌 useRef: 컴포넌트가 리렌더링되어도 값이 유지되는 변수
  // setInterval의 ID를 저장해서 나중에 clearInterval로 정리할 수 있게 합니다
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 📌 useEffect: 타이머 관리
   *
   * timer 상태가 변경될 때마다 실행됩니다.
   * - timer > 0: 1초마다 타이머를 1씩 감소시킵니다
   * - timer가 0이 되면: 타이머를 정지시킵니다
   * - 컴포넌트가 언마운트되거나 timer가 변경되면: 이전 타이머를 정리합니다 (cleanup)
   */
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
  }, [timer]); // timer가 변경될 때마다 useEffect 실행

  /**
   * 📌 인증번호 요청 함수
   *
   * 휴대폰 번호가 올바른 형식인지 확인하고, 인증번호를 요청합니다.
   * @returns 에러가 있으면 에러 메시지(string), 성공하면 null
   */
  const handleVerificationRequest = (): string | null => {
    // 휴대폰 번호 형식 검증
    if (!validatePhone(phone)) {
      return '올바른 휴대폰 번호 형식을 입력해주세요.';
    }

    // 인증번호 요청 상태로 변경
    setIsVerificationRequested(true);
    setTimer(240); // 4분 = 240초 타이머 시작
    console.log('인증번호 요청:', phone);
    return null; // 성공
  };

  /**
   * 📌 인증번호 확인 함수
   *
   * 입력된 인증번호가 올바른지 확인합니다.
   * @returns 에러가 있으면 에러 메시지(string), 성공하면 null
   */
  const handleVerify = (): string | null => {
    // 인증번호 형식 검증 (6자리 숫자)
    if (!verificationCode || !validateVerificationCode(verificationCode)) {
      return '인증번호 6자리를 입력해주세요.';
    }

    // 📌 테스트용: 테스트 인증번호 확인
    // 실제 서비스에서는 서버 API를 호출해서 인증번호를 확인합니다
    if (checkTestVerificationCode(verificationCode)) {
      setIsPhoneVerified(true); // 인증 완료 상태로 변경
      setVerificationCode(''); // 인증번호 입력 필드 초기화
      setTimer(0); // 타이머 정지
      console.log('인증 완료');
      return null; // 성공
    } else {
      return '인증번호가 일치하지 않습니다.';
    }
  };

  /**
   * 📌 인증 상태 초기화 함수
   *
   * 모든 인증 관련 상태를 초기 상태로 되돌립니다.
   * 휴대폰 번호를 변경할 때 호출하면 됩니다.
   */
  const resetVerification = () => {
    setIsPhoneVerified(false); // 인증 완료 상태 초기화
    setIsVerificationRequested(false); // 인증번호 요청 상태 초기화
    setVerificationCode(''); // 인증번호 초기화
    setTimer(0); // 타이머 초기화
    // 실행 중인 타이머가 있으면 정리
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  /**
   * 📌 커스텀 훅의 반환값
   *
   * 이 훅을 사용하는 컴포넌트에서 사용할 수 있는 모든 값과 함수를 반환합니다.
   */
  return {
    phone, // 휴대폰 번호
    verificationCode, // 인증번호
    isVerificationRequested, // 인증번호 요청 여부
    isPhoneVerified, // 인증 완료 여부
    timer, // 남은 시간(초)
    setPhone, // 휴대폰 번호 설정 함수
    setVerificationCode, // 인증번호 설정 함수
    handleVerificationRequest, // 인증번호 요청 함수
    handleVerify, // 인증 확인 함수
    resetVerification, // 인증 상태 초기화 함수
    setTimer, // 타이머 설정 함수
  };
}
