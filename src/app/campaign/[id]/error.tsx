// 캠페인 상세 페이지 에러 상태 (Next.js 특수 파일)
// 이 파일은 Next.js App Router의 특수 파일 중 하나입니다
// error.tsx 파일이 있으면 해당 경로의 페이지에서 에러가 발생했을 때 자동으로 표시됩니다
// JavaScript 에러가 발생하면 이 컴포넌트가 에러 바운더리 역할을 합니다

// "use client" 지시어
// 이 컴포넌트는 클라이언트 사이드에서 실행되어야 합니다
// useEffect, onClick 등의 브라우저 API를 사용하기 때문입니다
"use client";

// React의 useEffect 훅 import
// 컴포넌트가 마운트될 때 에러를 로깅하기 위해 사용합니다
import { useEffect } from "react";

// TypeScript 인터페이스 정의
// Next.js에서 에러 컴포넌트에 전달하는 props의 타입입니다
interface ErrorProps {
  error: Error & { digest?: string }; // 발생한 에러 객체
  reset: () => void; // 에러 상태를 리셋하는 함수
}

// React 함수형 컴포넌트 (기본 export)
// Next.js에서 자동으로 인식하여 에러 상태로 사용합니다
export default function Error({ error, reset }: ErrorProps) {
  // useEffect 훅 사용
  // 컴포넌트가 마운트될 때 에러를 콘솔에 로깅합니다
  useEffect(() => {
    // 에러 로깅
    console.error("Campaign detail page error:", error);
  }, [error]); // error가 변경될 때마다 실행

  return (
    <div className="campaign_detail_error">
      <div className="error_container">
        <div className="error_icon">⚠️</div>
        <h2 className="error_title">캠페인 정보를 불러올 수 없습니다</h2>
        <p className="error_message">
          요청하신 캠페인 정보를 불러오는 중 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>
        <div className="error_actions">
          {/* 다시 시도 버튼 */}
          {/* reset 함수를 호출하여 에러 상태를 리셋합니다 */}
          <button onClick={reset} className="retry_button">
            다시 시도
          </button>
          {/* 이전 페이지로 버튼 */}
          {/* 브라우저의 뒤로가기 기능을 사용합니다 */}
          <button onClick={() => window.history.back()} className="back_button">
            이전 페이지로
          </button>
        </div>
      </div>
    </div>
  );
}
