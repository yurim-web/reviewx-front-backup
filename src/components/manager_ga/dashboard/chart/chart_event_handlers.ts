/* ========================================
   🛠️ 차트 이벤트 핸들러 유틸리티
   ======================================== */

/**
 * 차트 이벤트 핸들러 유틸리티
 *
 * 목적: Recharts 차트에서 클릭 시 나타나는 검정색 선을 제거하고,
 *       원하는 스타일을 유지하기 위한 공용 함수들입니다.
 *
 * 사용 위치:
 * - ChannelMemberPieChart (파이 차트)
 *   경로: src/components/manager_ga/dashboard/chart/ChannelMemberPieChart.tsx
 * - MemberTypeBarChart (막대 차트)
 *   경로: src/components/manager_ga/dashboard/chart/MemberTypeBarChart.tsx
 * - 기타 Recharts 차트 컴포넌트
 */

import { useEffect, RefObject } from 'react';

/* ========================================
   📋 타입 정의
   ======================================== */

/**
 * 차트 스타일 설정 옵션
 *
 * @property stroke - 선 색상 (예: 'white', 'none')
 * @property strokeWidth - 선 두께 (예: '2', '0')
 * @property selector - CSS 선택자 (예: 'path.recharts-pie-sector', 'rect.recharts-bar-rectangle')
 */
interface ChartStyleOptions {
  stroke: string; // 선 색상
  strokeWidth: string; // 선 두께
  selector: string; // CSS 선택자
}

/* ========================================
   🔧 파이 차트용 이벤트 핸들러
   ======================================== */

/**
 * 파이 차트용 클릭 이벤트 핸들러 설정
 *
 * 목적: 파이 차트에서 클릭 시 검정색 선이 나타나지 않도록 흰색 선을 유지합니다.
 *
 * @param containerRef - 차트 컨테이너의 ref 객체
 * @param options - 스타일 설정 옵션 (선택사항)
 */
export function use_pie_chart_click_handler(
  containerRef: RefObject<HTMLDivElement | null>,
  options?: Partial<ChartStyleOptions>,
) {
  // 기본 옵션 설정
  const defaultOptions: ChartStyleOptions = {
    stroke: 'white',
    strokeWidth: '2',
    selector: 'path.recharts-pie-sector, path.recharts-sector',
  };

  const finalOptions = { ...defaultOptions, ...options };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ──────────────────────────────────────
    // 클릭 이벤트 처리 함수
    // ──────────────────────────────────────
    // 클릭 시 검정색 선이 나타나지 않도록 흰색 선 유지
    const handle_click = (e: MouseEvent) => {
      e.preventDefault(); // 기본 동작 방지
      e.stopPropagation(); // 이벤트 전파 방지
      // 파이 차트의 각 조각(path)을 찾아서 처리
      const paths = container.querySelectorAll<SVGPathElement>(
        finalOptions.selector,
      );
      paths.forEach((path) => {
        // 흰색 선 유지
        path.setAttribute('stroke', finalOptions.stroke);
        path.style.setProperty('stroke', finalOptions.stroke, 'important');
        path.style.setProperty(
          'stroke-width',
          finalOptions.strokeWidth,
          'important',
        );
        // outline 제거
        path.style.setProperty('outline', 'none', 'important');
      });
      return false;
    };

    // ──────────────────────────────────────
    // 마우스 다운 이벤트 처리 함수
    // ──────────────────────────────────────
    const handle_mouse_down = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // 이벤트 리스너 등록 (capture phase에서 실행)
    container.addEventListener('click', handle_click, true);
    container.addEventListener('mousedown', handle_mouse_down, true);

    // ──────────────────────────────────────
    // 주기적 체크 함수 (100ms마다 실행)
    // ──────────────────────────────────────
    // 흰색 선 유지 및 바깥으로 튀어나오는 선 제거
    const check_interval = setInterval(() => {
      // 파이 차트의 각 조각(path)을 찾아서 처리
      const paths = container.querySelectorAll<SVGPathElement>(
        finalOptions.selector,
      );
      paths.forEach((path) => {
        const stroke = path.getAttribute('stroke');
        const strokeWidth = path.getAttribute('stroke-width');

        // 검정색이나 다른 색상이면 흰색으로 변경
        if (stroke && stroke !== finalOptions.stroke && stroke !== 'none') {
          path.setAttribute('stroke', finalOptions.stroke);
        }
        // stroke-width가 0이거나 없으면 설정값으로 변경
        if (!strokeWidth || strokeWidth === '0') {
          path.setAttribute('stroke-width', finalOptions.strokeWidth);
        }

        // CSS로 강제로 흰색 선 적용
        path.style.setProperty('stroke', finalOptions.stroke, 'important');
        path.style.setProperty(
          'stroke-width',
          finalOptions.strokeWidth,
          'important',
        );
        path.style.setProperty('stroke-linecap', 'butt', 'important'); // 선 끝을 둥글게 하지 않음
        path.style.setProperty('stroke-linejoin', 'miter', 'important'); // 선 연결을 뾰족하게
        path.style.setProperty('outline', 'none', 'important');
      });
    }, 100);

    // ──────────────────────────────────────
    // 정리 함수 (컴포넌트가 사라질 때 실행)
    // ──────────────────────────────────────
    // 이벤트 리스너 제거 및 interval 정리
    return () => {
      container.removeEventListener('click', handle_click, true);
      container.removeEventListener('mousedown', handle_mouse_down, true);
      clearInterval(check_interval);
    };
  }, [
    containerRef,
    finalOptions.stroke,
    finalOptions.strokeWidth,
    finalOptions.selector,
  ]);
}

/* ========================================
   📊 막대 차트용 이벤트 핸들러
   ======================================== */

/**
 * 막대 차트용 클릭 이벤트 핸들러 설정
 *
 * 목적: 막대 차트에서 클릭 시 검정색 선이 나타나지 않도록 선을 제거합니다.
 *
 * @param containerRef - 차트 컨테이너의 ref 객체
 * @param options - 스타일 설정 옵션 (선택사항)
 */
export function use_bar_chart_click_handler(
  containerRef: RefObject<HTMLDivElement | null>,
  options?: Partial<ChartStyleOptions>,
) {
  // 기본 옵션 설정
  const defaultOptions: ChartStyleOptions = {
    stroke: 'none',
    strokeWidth: '0',
    selector: 'rect.recharts-bar-rectangle, rect.recharts-bar',
  };

  const finalOptions = { ...defaultOptions, ...options };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ──────────────────────────────────────
    // 클릭 이벤트 처리 함수
    // ──────────────────────────────────────
    // 클릭 시 나타나는 검정색 선 제거
    const handle_click = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // 막대 차트의 각 막대(rect)를 찾아서 처리
      const rects = container.querySelectorAll<SVGRectElement>(
        finalOptions.selector,
      );
      rects.forEach((rect) => {
        // stroke 제거
        rect.setAttribute('stroke', finalOptions.stroke);
        rect.style.setProperty('stroke', finalOptions.stroke, 'important');
        rect.style.setProperty(
          'stroke-width',
          finalOptions.strokeWidth,
          'important',
        );
        // outline 제거
        rect.style.setProperty('outline', 'none', 'important');
      });
      return false;
    };

    // ──────────────────────────────────────
    // 마우스 다운 이벤트 처리 함수
    // ──────────────────────────────────────
    const handle_mouse_down = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // 이벤트 리스너 등록
    container.addEventListener('click', handle_click, true);
    container.addEventListener('mousedown', handle_mouse_down, true);

    // ──────────────────────────────────────
    // 주기적으로 stroke 제거 (클릭 후에도 유지)
    // ──────────────────────────────────────
    const check_interval = setInterval(() => {
      const rects = container.querySelectorAll<SVGRectElement>(
        finalOptions.selector,
      );
      rects.forEach((rect) => {
        const stroke = rect.getAttribute('stroke');
        const strokeWidth = rect.getAttribute('stroke-width');
        if (stroke && stroke !== finalOptions.stroke) {
          rect.setAttribute('stroke', finalOptions.stroke);
        }
        if (strokeWidth && strokeWidth !== finalOptions.strokeWidth) {
          rect.setAttribute('stroke-width', finalOptions.strokeWidth);
        }
        rect.style.setProperty('stroke', finalOptions.stroke, 'important');
        rect.style.setProperty(
          'stroke-width',
          finalOptions.strokeWidth,
          'important',
        );
        rect.style.setProperty('outline', 'none', 'important');
      });
    }, 100);

    // ──────────────────────────────────────
    // 정리 함수
    // ──────────────────────────────────────
    return () => {
      container.removeEventListener('click', handle_click, true);
      container.removeEventListener('mousedown', handle_mouse_down, true);
      clearInterval(check_interval);
    };
  }, [
    containerRef,
    finalOptions.stroke,
    finalOptions.strokeWidth,
    finalOptions.selector,
  ]);
}
