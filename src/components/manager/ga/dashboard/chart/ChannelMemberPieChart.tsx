/* ========================================
   🥧 채널별 회원 파이 차트 컴포넌트
   ======================================== */

/**
 * 채널별 회원 파이 차트 컴포넌트
 *
 * 목적: 채널별 회원 등록 통계를 파이 차트로 표시합니다.
 *
 * 사용 위치:
 * - MemberStatsSection 컴포넌트 (채널별 회원 통계 카드)
 *
 * 주요 기능:
 * - 블로그 등록: 50% (어두운 회색)
 * - 인스타그램 등록: 25% (중간 회색)
 * - 클립 등록: 20% (밝은 회색)
 * - 유튜브 등록: 5% (가장 밝은 회색)
 
 */

'use client';

import { useRef, useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  Tooltip,
} from 'recharts';
import styles from '@/styles/manager/common/dashboard/chart/member_stats.module.css';
import {
  channelData,
  ChannelData,
} from '@/data/manager_ga/dashboard/dashboardData';
import { use_pie_chart_click_handler } from './chart_event_handlers';

/* ========================================
   🎨 색상 관련 함수
   ======================================== */

// 색상 정의
const colors = {
  blog: '#2DC469', // 초록색 (블로그)
  instagram: '#FF5694', // 핑크색 (인스타그램)
  clip: '#9747FF', // 보라색 (클립)
  youtube: '#FF2626', // 빨간색 (유튜브)
};

// ──────────────────────────────────────
// 채널별 색상 매핑 함수
// ──────────────────────────────────────
// 입력: 채널 이름 (예: "블로그", "인스타그램")
// 출력: 해당 채널의 색상 코드 (예: "#666666")
const getChannelColor = (channel: string): string => {
  switch (channel) {
    case '블로그':
      return colors.blog; // 초록색
    case '인스타그램':
      return colors.instagram; // 핑크색
    case '클립':
      return colors.clip; // 보라색
    case '유튜브':
      return colors.youtube; // 빨간색
    default:
      return colors.blog; // 기본값 (블로그 색상)
  }
};

/* ========================================
   🏷️ 커스텀 라벨 컴포넌트
   ======================================== */

// 각 섹션에 퍼센트를 표시하는 커스텀 라벨 컴포넌트
// 파이 차트의 각 조각 안에 "50%", "25%" 같은 텍스트를 표시
const CustomLabel = (props: any) => {
  // props에서 필요한 값들 가져오기
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  // cx, cy: 차트의 중심 좌표
  // midAngle: 섹션의 중앙 각도
  // innerRadius: 내부 반지름
  // outerRadius: 외부 반지름
  // percent: 비율 (0.5 = 50%)

  // ──────────────────────────────────────
  // 섹션의 중앙 위치 계산 (삼각함수 사용)
  // ──────────────────────────────────────
  const RADIAN = Math.PI / 180; // 각도를 라디안으로 변환
  // 섹션의 중앙 지점 계산 (반지름의 중간 지점)
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN); // X 좌표 계산
  const y = cy + radius * Math.sin(-midAngle * RADIAN); // Y 좌표 계산

  // 퍼센트가 너무 작으면 표시하지 않음 (5% 미만)
  if (percent < 0.05) {
    return null;
  }

  // 텍스트 요소 반환 (SVG의 <text> 태그)
  return (
    <text
      x={x} // 텍스트 X 위치
      y={y} // 텍스트 Y 위치
      fill="#FFF" // 텍스트 색상 (흰색)
      textAnchor="middle" // 텍스트 정렬 (가운데)
      dominantBaseline="middle" // 세로 정렬 (가운데)
      fontSize={14} // 폰트 크기
      fontWeight={600} // 폰트 굵기
      letterSpacing="-0.28px" // 글자 간격
    >
      {`${(percent * 100).toFixed(0)}%`}{' '}
      {/* 비율을 퍼센트로 변환 (예: 0.5 → "50%") */}
    </text>
  );
};

/* ========================================
   💬 커스텀 툴팁 컴포넌트
   ======================================== */

// 호버 시 표시할 커스텀 툴팁
// 마우스를 파이 차트 위에 올리면 채널 이름을 보여주는 툴팁 표시
// containerRef를 사용하여 정확한 위치 계산
const CustomTooltip = ({
  active,
  payload,
  containerRef,
  setTooltipState,
}: any) => {
  // active: 툴팁이 활성화되었는지 여부
  // payload: 차트 데이터 정보
  // containerRef: 차트 컨테이너의 ref
  // setTooltipState: 툴팁 상태를 설정하는 함수

  // 이전 계산된 값을 추적하여 불필요한 업데이트 방지
  const prev_calculated_ref = useRef<{
    midAngle: number;
    name: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    // active가 false이거나 payload가 없으면 툴팁 숨김
    if (!active || !payload || !payload.length || !containerRef?.current) {
      if (prev_calculated_ref.current !== null) {
        // setTimeout으로 지연하여 무한 루프 방지
        const timeout_id = setTimeout(() => {
          setTooltipState({ visible: false, x: 0, y: 0, name: '' });
        }, 0);
        prev_calculated_ref.current = null;
        return () => clearTimeout(timeout_id);
      }
      return;
    }

    const data = payload[0].payload; // 차트 데이터 (채널 이름, 값 등)
    const { midAngle } = payload[0];

    // 이전 계산값과 비교하여 실제로 변경되었을 때만 업데이트
    const prev = prev_calculated_ref.current;
    const angle_changed = !prev || Math.abs(prev.midAngle - midAngle) >= 1;
    const name_changed = !prev || prev.name !== data.name;

    // midAngle이나 name이 변경되지 않았으면 업데이트하지 않음 (무한 루프 방지)
    if (!angle_changed && !name_changed) {
      return;
    }

    const container = containerRef.current;
    const svgElement = container.querySelector('svg');

    if (svgElement) {
      // ──────────────────────────────────────
      // 실제 텍스트 요소의 위치를 직접 가져오기
      // ──────────────────────────────────────
      // SVG 내부의 모든 text 요소 찾기
      const text_elements = svgElement.querySelectorAll(
        'text',
      ) as NodeListOf<SVGTextElement>;

      // 해당 섹션의 퍼센트 값 계산
      const percent_value = data.value;
      const percent_text = `${Math.round(percent_value)}%`;

      // 퍼센트 텍스트와 일치하는 text 요소 찾기
      let target_text_element: SVGTextElement | null = null;
      for (const text_el of text_elements) {
        if (text_el.textContent?.trim() === percent_text) {
          target_text_element = text_el;
          break;
        }
      }

      if (target_text_element) {
        // 텍스트 요소의 실제 SVG 좌표 가져오기
        const text_x = parseFloat(target_text_element.getAttribute('x') || '0');
        const text_y = parseFloat(target_text_element.getAttribute('y') || '0');

        const svgRect = svgElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const viewBox = svgElement.getAttribute('viewBox');

        if (viewBox) {
          const [x, y, width, height] = viewBox.split(' ').map(Number);
          // SVG 좌표를 픽셀 좌표로 변환
          const scaleX = svgRect.width / width;
          const scaleY = svgRect.height / height;

          // SVG 내부 픽셀 좌표 계산
          // text_x, text_y는 SVG 좌표계 (viewBox 기준)이므로 픽셀 좌표로 변환
          const pixelX = (text_x - x) * scaleX;
          const pixelY = (text_y - y) * scaleY;

          // 컨테이너 기준 상대 좌표로 변환
          // SVG 요소의 화면상 위치에서 컨테이너의 화면상 위치를 빼서 상대 좌표 계산
          const finalX = pixelX + (svgRect.left - containerRect.left);
          const finalY = pixelY + (svgRect.top - containerRect.top);

          // 텍스트 요소의 실제 크기 가져오기 (오른쪽 끝 위치 계산용)
          const text_bbox = target_text_element.getBBox();
          const text_width_px = text_bbox.width * scaleX;

          // 퍼센트 텍스트의 오른쪽에 툴팁 배치
          const offsetX = 8; // 텍스트와 툴팁 사이 간격
          const tooltipX = finalX + text_width_px / 2 + offsetX; // 텍스트 중앙에서 오른쪽으로
          const tooltipY = finalY;

          // setTimeout으로 지연하여 무한 루프 방지
          const timeout_id = setTimeout(() => {
            setTooltipState({
              visible: true,
              x: tooltipX,
              y: tooltipY,
              name: data.name,
            });

            // 이전 계산값 저장 (각 섹션마다 다른 midAngle을 추적)
            prev_calculated_ref.current = {
              midAngle,
              name: data.name,
              x: tooltipX,
              y: tooltipY,
            };
          }, 0);

          return () => clearTimeout(timeout_id);
        }
      }
    }
  }, [active, payload, containerRef]);

  return null; // 툴팁은 컨테이너 밖에 렌더링
};

/* ========================================
   🎯 메인 컴포넌트
   ======================================== */

// 파이 차트를 렌더링하는 메인 컴포넌트
export default function ChannelMemberPieChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  // 툴팁 상태 관리
  const [tooltip_state, set_tooltip_state] = useState<{
    visible: boolean;
    x: number;
    y: number;
    name: string;
  }>({ visible: false, x: 0, y: 0, name: '' });

  /* ========================================
     🔧 부가 기능 처리 (공용 유틸리티 사용)
     ======================================== */

  // 흰색 선 유지 및 클릭 이벤트 처리
  // 파이 차트의 경계선을 흰색으로 유지하고, 바깥으로 튀어나오는 선 제거
  // 공용 유틸리티 함수를 사용하여 코드 중복 제거
  use_pie_chart_click_handler(containerRef);

  // 파이 차트 전용 추가 처리 (clipPath, 불필요한 선 제거)
  // 이 부분은 파이 차트에만 특화된 기능이므로 여기에 유지
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const check_interval = setInterval(() => {
      const paths = container.querySelectorAll<SVGPathElement>(
        'path.recharts-pie-sector, path.recharts-sector',
      );
      paths.forEach((path) => {
        // ──────────────────────────────────────
        // clipPath 적용: 바깥으로 튀어나오는 선 제거
        // ──────────────────────────────────────
        const svg = path.closest('svg');
        if (svg) {
          // SVG에 clipPath 추가 (원 모양으로 잘라내기)
          const clipPathId = 'pie-clip-path';
          let clipPath = svg.querySelector(`#${clipPathId}`);
          if (!clipPath) {
            let defs = svg.querySelector('defs');
            if (!defs) {
              defs = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'defs',
              );
              svg.insertBefore(defs, svg.firstChild);
            }
            clipPath = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'clipPath',
            );
            clipPath.setAttribute('id', clipPathId);
            const circle = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'circle',
            );
            // viewBox를 기반으로 중심점 계산
            const viewBox = svg.getAttribute('viewBox');
            if (viewBox) {
              const [x, y, width, height] = viewBox.split(' ').map(Number);
              const centerX = x + width / 2;
              const centerY = y + height / 2;
              circle.setAttribute('cx', centerX.toString());
              circle.setAttribute('cy', centerY.toString());
            } else {
              // viewBox가 없으면 SVG의 실제 크기 사용
              const svgRect = svg.getBoundingClientRect();
              const centerX = svgRect.width / 2;
              const centerY = svgRect.height / 2;
              circle.setAttribute('cx', centerX.toString());
              circle.setAttribute('cy', centerY.toString());
            }
            circle.setAttribute('r', '90');
            clipPath.appendChild(circle);
            defs.appendChild(clipPath);
          }
          // path에 clipPath 적용
          path.setAttribute('clip-path', `url(#${clipPathId})`);
          path.style.setProperty(
            'clip-path',
            `url(#${clipPathId})`,
            'important',
          );
        }
      });

      // ──────────────────────────────────────
      // 불필요한 선(line) 제거
      // ──────────────────────────────────────

      // Recharts가 자동으로 만드는 선들 제거
      const lines = container.querySelectorAll<SVGLineElement>(
        'line.recharts-tooltip-cursor, line.recharts-active-shape',
      );
      lines.forEach((line) => {
        line.style.setProperty('display', 'none', 'important');
        line.setAttribute('display', 'none');
      });

      // 모든 line 요소 중 바깥으로 나가는 선 제거
      const allLines = container.querySelectorAll<SVGLineElement>('line');
      allLines.forEach((line) => {
        // 선의 시작점과 끝점 좌표 가져오기
        const x1 = parseFloat(line.getAttribute('x1') || '0');
        const y1 = parseFloat(line.getAttribute('y1') || '0');
        const x2 = parseFloat(line.getAttribute('x2') || '0');
        const y2 = parseFloat(line.getAttribute('y2') || '0');

        // ──────────────────────────────────────
        // 중심점에서 멀리 떨어진 선 제거 (바깥으로 나가는 선)
        // ──────────────────────────────────────
        const centerX = 200; // 차트 중심 X (대략적인 값)
        const centerY = 200; // 차트 중심 Y (대략적인 값)
        // 선의 끝점과 중심점 사이의 거리 계산 (피타고라스 정리)
        const distance = Math.sqrt(
          Math.pow(x2 - centerX, 2) + Math.pow(y2 - centerY, 2),
        );
        // 외부 반지름(90)보다 멀리 나가는 선은 제거
        if (distance > 100) {
          line.style.setProperty('display', 'none', 'important');
          line.setAttribute('display', 'none');
        }
      });
    }, 100);

    return () => {
      clearInterval(check_interval);
    };
  }, []);

  /* ========================================
     🎨 렌더링 부분 (화면에 그려지는 부분)
     ======================================== */

  return (
    <div
      ref={containerRef}
      style={{
        width: '180px',
        height: '180px',
        position: 'relative',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 반응형 컨테이너: 180px × 180px 크기로 고정 */}
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          {/* clipPath 정의: 원 모양으로 잘라내기 */}
          <defs>
            <clipPath id="pie-clip">
              <circle cx="50%" cy="50%" r="90" />
            </clipPath>
          </defs>

          {/* 툴팁 설정: 마우스 호버 시 채널 이름 표시 */}
          <Tooltip
            content={
              <CustomTooltip
                containerRef={containerRef}
                setTooltipState={set_tooltip_state}
              />
            }
            cursor={false}
            animationDuration={0}
            animationEasing="linear"
          />

          {/* 파이 차트 메인 설정 */}
          <Pie
            data={channelData as any} // 차트 데이터
            cx="50%" // 중심 X 좌표
            cy="50%" // 중심 Y 좌표
            innerRadius={0} // 내부 반지름 (0이면 파이 차트, 0보다 크면 도넛 차트)
            outerRadius={90} // 외부 반지름 (180px 크기에 맞춤)
            dataKey="value" // 사용할 데이터 키
            startAngle={90} // 시작 각도 (12시 방향부터 시작)
            endAngle={-270} // 끝 각도 (한 바퀴 돌아서 12시 방향으로)
            paddingAngle={0} // 섹션 간 간격 (0이면 붙어있음)
            minAngle={5} // 최소 각도 (5도) - 작은 섹션도 최소한의 너비를 가지도록 설정
            label={<CustomLabel />} // 각 섹션에 퍼센트 표시
            stroke="white" // 섹션 사이 흰색 선
            strokeWidth={2} // 경계선 두께
            strokeLinecap="butt" // 선 끝을 둥글게 하지 않음
            clipPath="url(#pie-clip)" // 외부로 튀어나오는 선 제거
            isAnimationActive={false} // 애니메이션 비활성화
          >
            {/* 각 섹션에 색상 적용 */}
            {channelData.map((entry, index) => {
              const fillColor = getChannelColor(entry.name); // 채널별 색상 가져오기
              return (
                <Cell
                  key={`cell-${index}`} // React key (고유 식별자)
                  fill={fillColor} // 섹션 색상
                  stroke="white" // 섹션 사이 흰색 선
                  strokeWidth={2} // 경계선 두께
                  style={{ fill: fillColor }} // 호버 시에도 색상 유지
                />
              );
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* 컨테이너 밖에 렌더링되는 툴팁 */}
      {tooltip_state.visible && (
        <div
          style={{
            position: 'absolute',
            left: `${tooltip_state.x}px`,
            top: `${tooltip_state.y}px`,
            transform: 'translateY(-50%)',
            backgroundColor: '#444444', // 배경색 (어두운 회색)
            color: 'white', // 텍스트 색상
            padding: '8px 8px', // 내부 여백
            borderRadius: '4px', // 모서리 둥글게
            fontSize: '13px', // 폰트 크기
            fontWeight: 500, // 폰트 굵기
            pointerEvents: 'none', // 클릭 이벤트 방지
            whiteSpace: 'nowrap', // 텍스트 줄바꿈 방지
            zIndex: 1000, // 다른 요소 위에 표시
          }}
        >
          {tooltip_state.name}
        </div>
      )}
    </div>
  );
}
