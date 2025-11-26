/* ========================================
   📊 디바이스 통계 차트 컴포넌트
   ======================================== */

/**
 * 디바이스 통계 차트 컴포넌트
 *
 * 목적: All, PC, Tablet, Mobile, App 등 디바이스별 접속 통계를 가로 막대 차트로 표시합니다.
 *
 * 주요 기능:
 * - All: 여러 디바이스 비율을 스택형 막대로 표시 (파란색, 노란색, 핑크색, 보라색)
 * - PC, Tablet, Mobile, App: 각각 단일 막대로 표시
 * - 회색 배경에 색상 막대가 채워지는 형태
 *
 */

'use client';

import chartStyles from '@/styles/manager_ga/charts.module.css';
import deviceStyles from '@/styles/manager_ga/device_stats.module.css';

/* ========================================
   📊 디바이스 통계 차트 (Progress Bar 버전)
   ======================================== */

/**
 * 디바이스 통계 차트
 *
 * 목적: 복잡한 차트 대신 학습하기 쉬운 진행 바(progress bar) 형태로
 *       PC · Tablet · Mobile · App 비율을 보여줍니다.
 *
 * React 학습 포인트:
 * - JSX: HTML처럼 보이지만 실제로는 JavaScript 객체이며, map() 결과를 그대로 렌더링할 수 있습니다.
 * - props/state: 현재 컴포넌트는 자체 상태(state)를 사용하지 않고 정적 데이터 배열을 렌더링합니다.
 * - 리스트 렌더링: Array.prototype.map()을 사용하여 반복되는 UI를 생성할 때 key prop이 필요합니다.
 * - 조건부 클래스: 색상 스타일을 객체로 매핑해 유지보수성을 높입니다.
 */

type DeviceColorKey = 'pc' | 'tablet' | 'mobile' | 'app';

// 진행 바 세그먼트 타입 (All 막대에서 사용)
interface DeviceSegment {
  id: string;
  percentage: number;
  colorKey: DeviceColorKey;
  description: string;
}

// 진행 바에 사용할 데이터 타입
interface DeviceProgress {
  label: string; // 화면에 보여줄 디바이스명
  percentage?: number; // 진행률 (0~100) - 단일 막대용
  colorKey?: DeviceColorKey; // 색상 구분용 키
  description: string; // 접근성 설명 (스크린리더용)
  segments?: DeviceSegment[]; // All 막대처럼 여러 세그먼트를 표시할 때 사용
}

/* =====================
   📦 디바이스 데이터
   ===================== */
const base_device_progress_data: DeviceProgress[] = [
  {
    label: 'PC',
    percentage: 70,
    colorKey: 'pc',
    description: 'PC 접속 비율 70%',
  },
  {
    label: 'Tablet',
    percentage: 25,
    colorKey: 'tablet',
    description: '태블릿 접속 비율 25%',
  },
  {
    label: 'Mobile',
    percentage: 55,
    colorKey: 'mobile',
    description: '모바일 접속 비율 55%',
  },
  {
    label: 'App',
    percentage: 60,
    colorKey: 'app',
    description: '앱 접속 비율 60%',
  },
];

// All 막대용 세그먼트 계산 (각 디바이스 비율을 전체 합계 대비 백분율로 환산)
const total_percentage = base_device_progress_data.reduce(
  (sum, device) => sum + (device.percentage || 0),
  0,
);

const all_device_segments: DeviceSegment[] = base_device_progress_data.map(
  (device) => ({
    id: device.label,
    percentage: Number(
      (((device.percentage || 0) / total_percentage) * 100).toFixed(2),
    ),
    colorKey: device.colorKey || 'pc',
    description: `${device.label} 비중 ${(device.percentage || 0).toFixed(0)}%`,
  }),
);

const device_progress_data: DeviceProgress[] = [
  {
    label: 'All',
    description: '전체 디바이스 비율 (PC + Tablet + Mobile + App)',
    segments: all_device_segments,
  },
  ...base_device_progress_data,
];

// 색상 모듈 클래스 매핑 (JS 객체 -> CSS 모듈 연결)
const progress_bar_color_map: Record<DeviceColorKey, string> = {
  pc: deviceStyles.device_progress_bar_fill_pc,
  tablet: deviceStyles.device_progress_bar_fill_tablet,
  mobile: deviceStyles.device_progress_bar_fill_mobile,
  app: deviceStyles.device_progress_bar_fill_app,
};

export default function DeviceStatsChart() {
  return (
    <div
      className={chartStyles.chart_area}
      style={{
        width: '100%',
        backgroundColor: 'transparent',
        alignItems: 'flex-start',
        padding: 0,
      }}
    >
      {/* 섹션 설명: JSX 블록을 논리적으로 구분 */}
      <div className={deviceStyles.device_stats_chart_wrapper}>
        {/* 리스트 렌더링(map)을 사용해 반복 UI 구성 */}
        <ul className={deviceStyles.device_progress_list}>
          {device_progress_data.map((device) => (
            <li key={device.label} className={deviceStyles.device_progress_row}>
              {/* 디바이스명 + 값 */}
              <div className={deviceStyles.device_progress_label_group}>
                <span className={deviceStyles.device_progress_label}>
                  {device.label}
                </span>
              </div>

              {/* 진행 바: 접근성 위해 role/aria-label 추가 */}
              <div
                className={deviceStyles.device_progress_bar_container}
                role="img"
                aria-label={device.description}
              >
                {/* All 막대 (여러 세그먼트) */}
                {device.segments ? (
                  <div className={deviceStyles.device_progress_bar_stack}>
                    {device.segments.map((segment) => (
                      <span
                        key={`${device.label}-${segment.id}`}
                        className={`${
                          deviceStyles.device_progress_stack_segment
                        } ${progress_bar_color_map[segment.colorKey]}`}
                        style={{ width: `${segment.percentage}%` }}
                        aria-label={segment.description}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className={`${deviceStyles.device_progress_bar_fill} ${
                      device.colorKey
                        ? progress_bar_color_map[device.colorKey]
                        : ''
                    }`}
                    style={{ width: `${device.percentage}%` }} // 구조분해 + 템플릿 리터럴 설명용
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
