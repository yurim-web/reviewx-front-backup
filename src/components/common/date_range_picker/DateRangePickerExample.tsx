/* ========================================
   📅 날짜 범위 선택기 예시 컴포넌트 (스카이스캐너 스타일)
   ======================================== */

/**
 * 날짜 범위 선택기 예시 컴포넌트
 *
 * 목적: 스카이스캐너처럼 이전/다음 달의 날짜를 함께 표시하는 달력 컴포넌트 예시입니다.
 *
 * 주요 기능:
 * - 날짜 범위 선택 (시작일 ~ 종료일)
 * - 이전/다음 달 날짜 자동 표시 (회색으로 표시됨)
 * - 여러 달 동시 표시 (2개월)
 * - 한국어 로케일 지원
 *
 *
 * 사용 라이브러리:
 * - react-day-picker: 달력 UI 라이브러리
 * - date-fns: 날짜 포맷팅 유틸리티
 *
 * 설치 필요:
 * pnpm add react-day-picker date-fns
 */

'use client';

import { DayPicker } from 'react-day-picker';
import { useState } from 'react';
import { ko } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
// CSS 모듈 파일은 별도로 만들어서 사용할 수 있습니다
// import styles from './date_range_picker.module.css';

// 선택된 날짜 범위의 타입 정의
interface DateRange {
  // 시작일 (undefined일 수 있음 - 아직 선택 안 했을 때)
  from: Date | undefined;
  // 종료일 (undefined일 수 있음 - 아직 선택 안 했을 때)
  to: Date | undefined;
}

export default function DateRangePickerExample() {
  // useState: React의 상태 관리 훅
  // [상태값, 상태를 변경하는 함수] = useState(초기값)
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    from: undefined,  // 초기값: 아직 시작일이 선택되지 않음
    to: undefined,    // 초기값: 아직 종료일이 선택되지 않음
  });

  return (
    <div>
      {/* 
        DayPicker 컴포넌트: react-day-picker 라이브러리의 달력 컴포넌트
        
        props 설명:
        - mode="range": 날짜 범위 선택 모드 (시작일~종료일)
        - selected: 현재 선택된 날짜 범위
        - onSelect: 날짜를 선택했을 때 실행되는 함수 (setSelectedRange를 전달)
        - locale={ko}: 한국어 로케일 설정 (월, 요일이 한글로 표시됨)
        - showOutsideDays={true}: 이전/다음 달의 날짜도 표시 (회색으로 표시됨)
        - numberOfMonths={2}: 2개월을 동시에 표시 (스카이스캐너처럼)
        - className: CSS 클래스명 (스타일링용)
      */}
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={setSelectedRange}
        locale={ko}
        showOutsideDays={true}  // ← 이전/다음 달 날짜 표시하는 핵심 옵션!
        numberOfMonths={2}
        className="custom_date_range_picker"
      />

      {/* 선택된 날짜 범위 표시 영역 */}
      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f5f5f5' }}>
        <h3>선택된 날짜 범위:</h3>
        <p>
          시작일: {selectedRange.from ? selectedRange.from.toLocaleDateString('ko-KR') : '미선택'}
        </p>
        <p>
          종료일: {selectedRange.to ? selectedRange.to.toLocaleDateString('ko-KR') : '미선택'}
        </p>
      </div>
    </div>
  );
}
