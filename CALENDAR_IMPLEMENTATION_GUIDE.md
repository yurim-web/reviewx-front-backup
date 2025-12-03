# 📅 스카이스캐너 스타일 달력 구현 가이드

## 개요
이 문서는 스카이스캐너처럼 이전/다음 달의 날짜를 함께 표시하는 달력 구현 방법을 설명합니다.

## 라이브러리 설치

### react-day-picker 사용 (추천)
```bash
pnpm add react-day-picker date-fns
```

### 또는 react-datepicker 사용
```bash
pnpm add react-datepicker @types/react-datepicker
```

## 주요 기능 설명

### 1. 이전/다음 달 날짜 표시
- **기능**: 현재 달의 첫 주와 마지막 주에 이전/다음 달의 날짜를 회색으로 표시
- **장점**: 달력이 항상 6주로 일정하게 표시되어 UI가 깔끔함
- **활용**: 사용자가 연속된 날짜를 선택하기 쉬움

### 2. react-day-picker의 showOutsideDays 옵션
```typescript
import { DayPicker } from 'react-day-picker';

<DayPicker
  mode="range"  // 날짜 범위 선택 모드
  showOutsideDays={true}  // 이전/다음 달 날짜 표시
  // 이전/다음 달 날짜는 자동으로 disabled 처리됨
/>
```

### 3. react-datepicker의 경우
```typescript
import DatePicker from 'react-datepicker';

<DatePicker
  selectsRange={true}
  inline={true}
  calendarStartDay={0}  // 일요일 시작
  // 이전/다음 달 날짜는 자동으로 표시됨
/>
```

## 구현 예시

### 예시 1: react-day-picker 기본 사용법
```tsx
'use client';

import { DayPicker } from 'react-day-picker';
import { useState } from 'react';
import 'react-day-picker/dist/style.css';

export default function CalendarExample() {
  const [selectedRange, setSelectedRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  return (
    <DayPicker
      mode="range"
      selected={selectedRange}
      onSelect={setSelectedRange}
      showOutsideDays={true}  // ← 이전/다음 달 날짜 표시
      numberOfMonths={2}  // 2개월 동시 표시 (스카이스캐너처럼)
      className="calendar"
    />
  );
}
```

### 예시 2: 커스텀 스타일링 (스카이스캐너 스타일)
```tsx
'use client';

import { DayPicker, DayPickerProps } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import { useState } from 'react';

export default function CustomCalendar() {
  const [selectedRange, setSelectedRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  return (
    <DayPicker
      mode="range"
      selected={selectedRange}
      onSelect={setSelectedRange}
      locale={ko}  // 한국어 로케일
      showOutsideDays={true}  // 이전/다음 달 날짜 표시
      numberOfMonths={2}  // 11월, 12월 같이 2개월 표시
      className="custom-calendar"
      // 이전/다음 달 날짜는 자동으로 disabled 클래스가 적용됨
      // CSS에서 .rdp-day_outside 클래스로 스타일링 가능
    />
  );
}
```

## CSS 스타일링 예시

```css
/* 이전/다음 달 날짜 스타일링 */
.custom-calendar .rdp-day_outside {
  color: #999;  /* 회색으로 표시 */
  opacity: 0.5;
}

/* 선택된 날짜 범위 스타일링 */
.custom-calendar .rdp-day_range_middle {
  background-color: #e3f2fd;  /* 연한 파란색 */
}

.custom-calendar .rdp-day_range_start,
.custom-calendar .rdp-day_range_end {
  background-color: #2196f3;  /* 진한 파란색 */
  color: white;
  border-radius: 50%;
}
```

## 구현 단계

1. **라이브러리 설치**: `pnpm add react-day-picker date-fns`
2. **컴포넌트 생성**: 날짜 선택 컴포넌트 만들기
3. **스타일 적용**: CSS 모듈로 스타일링
4. **통합**: DateFilterSection에 통합

## 참고 사항

- `showOutsideDays={true}` 옵션 하나로 이전/다음 달 날짜가 자동으로 표시됩니다
- 이전/다음 달 날짜는 자동으로 비활성화되어 선택할 수 없습니다 (필요시 CSS로 활성화 가능)
- `numberOfMonths={2}` 옵션으로 여러 달을 동시에 표시할 수 있습니다



