/* ========================================
   채널별 회원 분포 파이 차트 (GA/SA 공통)
   ======================================== */

/**
 * ChannelMemberPieChart
 *
 * 목적: 채널별 회원 등록 통계를 파이 차트로 표시합니다.
 *
 * 사용 페이지:
 * - /manager_ga/dashboard (GA 대시보드)
 * - /manager_sa/dashboard (SA 대시보드)
 */

"use client";

import { useRef, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
  type SectorProps,
} from "recharts";
import { usePieChartClickHandler } from "@/components/manager/ga/dashboard/chart/chart_event_handlers";

// 데이터 소스에 독립적인 공통 인터페이스
export interface PieChartChannelData {
  name: string;
  value: number;
  count: number;
}

interface PieLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
  name: string;
  value?: number;
  useFixed?: boolean;
};

interface PieTooltipPayloadItem {
  value: number;
  payload: PieChartChannelData;
  midAngle: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PieTooltipPayloadItem[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>;
}

interface ChannelMemberPieChartProps {
  channelData: PieChartChannelData[];
}

// 색상 정의
const colors = {
  blog: "#2DC469",
  instagram: "#FF5694",
  clip: "#9747FF",
  youtube: "#FF2626",
};

const getChannelColor = (channel: string): string => {
  switch (channel) {
    case "블로그":
      return colors.blog;
    case "인스타그램":
      return colors.instagram;
    case "클립":
      return colors.clip;
    case "유튜브":
      return colors.youtube;
    default:
      return colors.blog;
  }
};

// 각 섹션에 퍼센트를 표시하는 커스텀 라벨 컴포넌트
const CustomLabel = (props: PieLabelProps) => {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.08) {
    return null;
  }

  return (
    <text
      x={x}
      y={y}
      fill="#FFF"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={14}
      fontWeight={600}
      letterSpacing="-0.28px"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// 호버 시 표시할 커스텀 툴팁
const CustomTooltip = ({ active, payload, containerRef, setTooltipState }: CustomTooltipProps) => {
  const prev_calculated_ref = useRef<{
    midAngle: number;
    name: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (!active || !payload || !payload.length || !containerRef?.current) {
      setTooltipState({ visible: false, x: 0, y: 0, name: "", value: undefined });
      prev_calculated_ref.current = null;
      return;
    }

    const data = payload[0].payload;
    const { midAngle } = payload[0];

    const prev = prev_calculated_ref.current;
    const angle_changed = !prev || Math.abs(prev.midAngle - midAngle) >= 1;
    const name_changed = !prev || prev.name !== data.name;

    if (!angle_changed && !name_changed) {
      return;
    }

    const container = containerRef.current;
    const svgElement = container.querySelector("svg");

    if (svgElement) {
      const svgRect = svgElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const viewBox = svgElement.getAttribute("viewBox");
      if (!viewBox) return;

      const [vbX, vbY, vbW, vbH] = viewBox.split(" ").map(Number);
      const scaleX = svgRect.width / vbW;
      const scaleY = svgRect.height / vbH;
      const offsetX = 8;
      const RADIAN = Math.PI / 180;
      const chartCx = 100;
      const chartCy = 100;

      const percent_value = data.value;
      const percent_text = `${Math.round(percent_value)}%`;
      const text_elements = svgElement.querySelectorAll("text") as NodeListOf<SVGTextElement>;
      let target_text_element: SVGTextElement | null = null;
      for (const text_el of text_elements) {
        if (text_el.textContent?.trim() === percent_text) {
          target_text_element = text_el;
          break;
        }
      }

      let tooltipXLocal: number;
      let tooltipYLocal: number;

      if (target_text_element) {
        const text_x = parseFloat(target_text_element.getAttribute("x") || "0");
        const text_y = parseFloat(target_text_element.getAttribute("y") || "0");
        const px = (text_x - vbX) * scaleX;
        const py = (text_y - vbY) * scaleY;
        const fx = px + (svgRect.left - containerRect.left);
        const fy = py + (svgRect.top - containerRect.top);
        const text_bbox = target_text_element.getBBox();
        const text_width_px = text_bbox.width * scaleX;
        tooltipXLocal = fx + text_width_px / 2 + offsetX;
        tooltipYLocal = fy;
      } else {
        const outerRadius = 100;
        const xSvg = chartCx + outerRadius * Math.cos(-midAngle * RADIAN);
        const ySvg = chartCy + outerRadius * Math.sin(-midAngle * RADIAN);
        tooltipXLocal = (xSvg - vbX) * scaleX + (svgRect.left - containerRect.left) + offsetX;
        tooltipYLocal = (ySvg - vbY) * scaleY + (svgRect.top - containerRect.top);
      }

      const tooltipXFixed = containerRect.left + tooltipXLocal;
      const tooltipYFixed = containerRect.top + tooltipYLocal;

      setTooltipState({
        visible: true,
        x: tooltipXFixed,
        y: tooltipYFixed,
        name: data.name,
        value: data.value != null ? Math.round(Number(data.value)) : undefined,
        useFixed: true,
      });
      prev_calculated_ref.current = {
        midAngle,
        name: data.name,
        x: tooltipXLocal,
        y: tooltipYLocal,
      };
    }
  }, [active, payload, containerRef, setTooltipState]);

  return null;
};

// 파이 차트를 렌더링하는 메인 컴포넌트
export default function ChannelMemberPieChart({ channelData }: ChannelMemberPieChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip_state, set_tooltip_state] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    name: "",
  });
  const [tooltip_opacity, set_tooltip_opacity] = useState(0);

  usePieChartClickHandler(containerRef);

  // 툴팁 페이드인
  useEffect(() => {
    if (tooltip_state.visible) {
      set_tooltip_opacity(0);
      const raf = requestAnimationFrame(() => {
        set_tooltip_opacity(1);
      });
      return () => cancelAnimationFrame(raf);
    } else {
      set_tooltip_opacity(0);
    }
  }, [tooltip_state.visible]);

  // 파이 차트 전용 처리 (clipPath, 불필요한 선 제거)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const check_interval = setInterval(() => {
      const paths = container.querySelectorAll<SVGPathElement>(
        "path.recharts-pie-sector, path.recharts-sector"
      );
      paths.forEach((path) => {
        const svg = path.closest("svg");
        if (svg) {
          const clipPathId = "pie-clip-path";
          let clipPath = svg.querySelector(`#${clipPathId}`);
          if (!clipPath) {
            let defs = svg.querySelector("defs");
            if (!defs) {
              defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
              svg.insertBefore(defs, svg.firstChild);
            }
            clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
            clipPath.setAttribute("id", clipPathId);
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            const viewBox = svg.getAttribute("viewBox");
            if (viewBox) {
              const [x, y, width, height] = viewBox.split(" ").map(Number);
              const centerX = x + width / 2;
              const centerY = y + height / 2;
              circle.setAttribute("cx", centerX.toString());
              circle.setAttribute("cy", centerY.toString());
            } else {
              const svgRect = svg.getBoundingClientRect();
              const centerX = svgRect.width / 2;
              const centerY = svgRect.height / 2;
              circle.setAttribute("cx", centerX.toString());
              circle.setAttribute("cy", centerY.toString());
            }
            circle.setAttribute("r", "100");
            clipPath.appendChild(circle);
            defs.appendChild(clipPath);
          }
          path.setAttribute("clip-path", `url(#${clipPathId})`);
          path.style.setProperty("clip-path", `url(#${clipPathId})`, "important");
        }
      });

      const lines = container.querySelectorAll<SVGLineElement>(
        "line.recharts-tooltip-cursor, line.recharts-active-shape"
      );
      lines.forEach((line) => {
        line.style.setProperty("display", "none", "important");
        line.setAttribute("display", "none");
      });

      const allLines = container.querySelectorAll<SVGLineElement>("line");
      allLines.forEach((line) => {
        const _x1 = parseFloat(line.getAttribute("x1") || "0");
        const _y1 = parseFloat(line.getAttribute("y1") || "0");
        const x2 = parseFloat(line.getAttribute("x2") || "0");
        const y2 = parseFloat(line.getAttribute("y2") || "0");

        const centerX = 100;
        const centerY = 100;
        const distance = Math.sqrt(Math.pow(x2 - centerX, 2) + Math.pow(y2 - centerY, 2));
        if (distance > 100) {
          line.style.setProperty("display", "none", "important");
          line.setAttribute("display", "none");
        }
      });
    }, 100);

    return () => {
      clearInterval(check_interval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "200px",
        height: "200px",
        minWidth: "200px",
        minHeight: "200px",
        aspectRatio: "1",
        position: "relative",
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <clipPath id="pie-clip">
              <circle cx="50%" cy="50%" r="100" />
            </clipPath>
          </defs>

          <Tooltip
            content={
              <CustomTooltip containerRef={containerRef} setTooltipState={set_tooltip_state} />
            }
            cursor={false}
            animationDuration={0}
            animationEasing="linear"
            wrapperStyle={{ visibility: "hidden", pointerEvents: "none" }}
          />

          <Pie
            data={channelData as unknown as Parameters<typeof Pie>[0]["data"]}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={100}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            minAngle={5}
            label={<CustomLabel />}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="butt"
            clipPath="url(#pie-clip)"
            isAnimationActive={false}
            activeShape={(props: SectorProps) => <Sector {...props} />}
          >
            {channelData.map((entry, index) => {
              const fillColor = getChannelColor(entry.name);
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={fillColor}
                  stroke="white"
                  strokeWidth={2}
                  style={{ fill: fillColor }}
                />
              );
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {tooltip_state.visible && (
        <div
          style={{
            position: tooltip_state.useFixed ? "fixed" : "absolute",
            left: `${tooltip_state.x}px`,
            top: `${tooltip_state.y}px`,
            transform: "translateY(-50%)",
            backgroundColor: "#444444",
            color: "white",
            padding: "8px",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 500,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            opacity: tooltip_opacity,
            transition: "opacity 0.5s ease",
          }}
        >
          <span>{tooltip_state.name}</span>
          {tooltip_state.value != null && <span>{tooltip_state.value}%</span>}
        </div>
      )}
    </div>
  );
}
