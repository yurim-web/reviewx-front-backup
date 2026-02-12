"use client";

/**
 * 보유 포인트 표시 컴포넌트
 *
 * 사용처:
 * - src/app/user/point/withdrawal_request/page.tsx
 *
 * 목적: 보유 포인트를 일관된 형식으로 표시하는 재사용 가능한 컴포넌트
 *
 * Props:
 * - points: 보유 포인트 (숫자)
 * - label: 라벨 텍스트 (기본값: "보유 포인트")
 * - unit: 단위 텍스트 (기본값: "P")
 * - className: 컨테이너 CSS 클래스명
 * - labelClassName: 라벨 CSS 클래스명
 * - amountClassName: 금액 영역 CSS 클래스명
 * - numberClassName: 숫자 CSS 클래스명
 * - unitClassName: 단위 CSS 클래스명
 */

interface AvailablePointsDisplayProps {
  points: number;
  label?: string;
  unit?: string;
  className?: string;
  labelClassName?: string;
  amountClassName?: string;
  numberClassName?: string;
  unitClassName?: string;
}

export default function AvailablePointsDisplay({
  points,
  label = "보유 포인트",
  unit = "P",
  className = "",
  labelClassName = "",
  amountClassName = "",
  numberClassName = "",
  unitClassName = "",
}: AvailablePointsDisplayProps) {
  return (
    <div className={className}>
      <span className={labelClassName}>{label}</span>
      <div className={amountClassName}>
        <span className={numberClassName}>{points.toLocaleString()}</span>
        <span className={unitClassName}>{unit}</span>
      </div>
    </div>
  );
}
