/* ========================================
   🎣 타이머 관리 커스텀 훅 (공통)
   ======================================== */

/**
 * 모듈 목적
 *
 * - 인증번호 타이머 상태 및 로직 관리
 * - setInterval을 사용한 카운트다운 구현
 * - 컴포넌트 언마운트 시 자동 정리
 *
 * 📍 사용 페이지/컴포넌트:
 * - (현재 사용되지 않음 - 향후 필요 시 사용 가능)
 *
 * 📌 공통 훅 위치:
 * - src/hooks/common/useTimer.ts
 */

import { useState, useEffect, useRef } from 'react';

/**
 * 타이머 관리 커스텀 훅
 *
 * @returns {Object} 타이머 상태 및 제어 함수
 * @returns {number} timer - 현재 남은 시간 (초)
 * @returns {Function} setTimer - 타이머 시간 설정 함수
 */
export function useTimer() {
  const [timer, setTimer] = useState<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  return { timer, setTimer };
}
