/**
 * 캠페인 상세 페이지 스크롤 이벨 고정 공용 훅
 *
 * 사용 파일:
 * - src/app/campaign/delivery/[id]/page.tsx
 * - src/app/campaign/mission/[id]/page.tsx
 * - src/app/campaign/reporter/[id]/page.tsx
 * - src/app/campaign/review/[id]/page.tsx
 * - src/app/campaign/visit/[id]/page.tsx
 *
 * 주요 기능:
 * - 캠페인 정보 라벨의 초기 위치 저장
 * - 스크롤 이벤트로 캠페인 정보 라벨 고정 제어
 * - MainMenu 표시/숨김 제어
 */

import { useEffect, useState, useRef } from "react";

/**
 * 훅 반환 타입
 */
interface UseCampaignDetailScrollReturn {
  // 캠페인 정보 라벨 고정 상태
  isCampaignInfoFixed: boolean;
  // 캠페인 정보 라벨 ref
  campaignInfoLabelRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 캠페인 상세 페이지 스크롤 이벨 고정 공용 훅
 *
 * @returns 캠페인 정보 라벨 고정 상태와 ref
 */
export function useCampaignDetailScroll(): UseCampaignDetailScrollReturn {
  /* ========================================
     상태 관리
     ======================================== */

  /**
   * 캠페인 정보 라벨 고정 상태
   * - true: 라벨이 상단에 고정됨
   * - false: 라벨이 원래 위치에 있음
   */
  const [isCampaignInfoFixed, setIsCampaignInfoFixed] = useState(false);

  /* ========================================
     Refs
     ======================================== */

  /**
   * 캠페인 정보 라벨 요소에 대한 참조
   */
  const campaignInfoLabelRef = useRef<HTMLDivElement>(null);

  /**
   * 캠페인 정보 라벨의 초기 위치를 저장 (페이지 최상단부터의 거리)
   */
  const initialLabelPositionRef = useRef<number | null>(null);

  /* ========================================
     Side Effects
     ======================================== */

  /**
   * 초기 로드 시 캠페인 정보 라벨의 위치를 한 번만 저장
   */
  useEffect(() => {
    // DOM이 완전히 로드된 후 위치 계산 (100ms 딜레이)
    const timer = setTimeout(() => {
      if (
        campaignInfoLabelRef.current &&
        initialLabelPositionRef.current === null
      ) {
        // 라벨의 현재 화면상 위치 가져오기
        const rect = campaignInfoLabelRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;

        // 페이지 최상단부터 라벨까지의 실제 거리 계산
        const absolutePosition = rect.top + scrollY;
        initialLabelPositionRef.current = absolutePosition;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  /**
   * 스크롤 이벤트: 캠페인 정보 라벨 고정 제어
   */
  useEffect(() => {
    const handleScroll = () => {
      // 초기 위치가 아직 계산되지 않았으면 종료
      if (initialLabelPositionRef.current === null) return;

      const scrollY = window.scrollY;

      // SubHeader의 높이만큼 빼기 (80px)
      // 캠페인 정보 라벨이 화면 상단 80px 위치(SubHeader 바로 아래)에 도달하면 고정
      const triggerPoint = initialLabelPositionRef.current - 80;

      // 스크롤이 트리거 포인트에 도달했을 때 라벨 고정
      if (scrollY >= triggerPoint) {
        setIsCampaignInfoFixed(true);
      } else {
        setIsCampaignInfoFixed(false);
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);

    // 초기 로드 시에도 한 번 실행 (새로고침 시 스크롤 위치 복원 대응)
    handleScroll();

    // 컴포넌트 언마운트 시 이벤트 리스너 제거 (메모리 누수 방지)
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return {
    isCampaignInfoFixed,
    campaignInfoLabelRef,
  };
}
