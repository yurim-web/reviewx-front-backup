/* ========================================
   🔐 관리자 로그인 페이지
   ======================================== */

/**
 * 관리자 로그인 페이지
 *
 * 목적: 관리자가 아이디와 비밀번호를 입력하여 로그인할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager/login
 *
 * 주요 기능:
 * - 아이디 입력
 * - 비밀번호 입력
 * - 자동 로그인 체크박스
 * - 로그인 버튼
 * - 아이디 · 비밀번호 찾기 링크
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/fragments/Header";
import pageStyles from "@/styles/login/login/page.module.css";
import formStyles from "@/styles/login/login/form.module.css";
import optionsStyles from "@/styles/login/login/options.module.css";
import { useAuth } from "@/hooks/useAuth";
import { unifiedAccountData } from "@/data/login/unifiedAccountData";

/**
 * 관리자 로그인 페이지 컴포넌트
 *
 * @returns JSX.Element - 사용자 로그인 페이지 UI
 */
export default function AdminLoginPage() {
  // Next.js의 useRouter 훅: 페이지 이동을 위한 라우터 객체
  const router = useRouter();
  const { login, isLoading } = useAuth();

  // ========================================
  // 상태 관리 (State Management)
  // ========================================

  /**
   * 아이디 상태
   */
  const [username, setUsername] = useState<string>("");

  /**
   * 비밀번호 상태
   */
  const [password, setPassword] = useState<string>("");

  /**
   * 자동 로그인 체크박스 상태
   */
  const [autoLogin, setAutoLogin] = useState<boolean>(false);

  /**
   * 로그인 에러 메시지 상태
   */
  const [errorMessage, setErrorMessage] = useState<string>("");

  // ========================================
  // 이벤트 핸들러 (Event Handlers)
  // ========================================

  /**
   * 아이디 입력 변경 핸들러
   *
   * @param e - React의 ChangeEvent 타입 (input 요소의 변경 이벤트)
   */
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    // 입력 시 에러 메시지 초기화
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  /**
   * 비밀번호 입력 변경 핸들러
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // 입력 시 에러 메시지 초기화
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  /**
   * 자동 로그인 체크박스 변경 핸들러
   *
   * @param e - React의 ChangeEvent 타입 (checkbox 요소의 변경 이벤트)
   */
  const handleAutoLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoLogin(e.target.checked);
  };

  /**
   * 로그인 폼 제출 핸들러
   *
   * @param e - React의 FormEvent 타입 (폼 제출 이벤트)
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 에러 메시지 초기화
    setErrorMessage("");

    try {
      // 관리자 계정인지 먼저 확인 (GA 또는 SA)
      const account = unifiedAccountData.find(
        (acc) => acc.email === username && acc.password === password
      );

      if (!account) {
        setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
        return;
      }

      // 관리자 계정인지 확인
      if (account.role !== 'manager_ga' && account.role !== 'manager_sa') {
        setErrorMessage("관리자 계정만 로그인할 수 있습니다.");
        return;
      }

      // 인증 시스템을 통한 로그인
      await login({ email: username, password }, account.role);

      // login 함수에서 자동으로 리다이렉트하므로 여기서는 추가 처리 불필요
    } catch (error) {
      // 에러 메시지 표시
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  // ========================================
  // 렌더링 (JSX)
  // ========================================

  return (
    <div className={pageStyles.partner_login_page_container}>
      {/* 메인 헤더 */}
      <Header />

      {/* 메인 콘텐츠 영역 */}
      <main className={pageStyles.partner_login_main}>
        {/* 로그인 메시지 섹션 */}
        <section className={pageStyles.login_message_section}>
          <h2 className={pageStyles.login_title}>
            리뷰엑스는
            <br />
            여러분이 만들어갑니다.
          </h2>
        </section>

        {/* 로그인 폼 섹션 */}
        <form className={formStyles.login_form} onSubmit={handleSubmit}>
          {/* 입력 필드 섹션 */}
          <div className={formStyles.form_section}>
            {/* 아이디 입력 필드 */}
            <div className={formStyles.input_wrapper}>
              <input
                id="username"
                type="text"
                className={formStyles.input_field}
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={handleUsernameChange}
                required
                aria-label="아이디 입력"
              />
            </div>

            {/* 비밀번호 입력 필드 */}
            <div className={formStyles.input_wrapper}>
              <input
                id="password"
                type="password"
                className={formStyles.input_field}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={handlePasswordChange}
                required
                aria-label="비밀번호 입력"
              />
              {/* 에러 메시지 - 비밀번호 입력 필드 바로 아래 */}
              {errorMessage && (
                <div className={formStyles.error_message_section}>
                  <span className={formStyles.error_text}>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* 옵션 및 링크 섹션 */}
          <div className={formStyles.form_section}>
            <div className={optionsStyles.login_options_section}>
              {/* 자동 로그인 체크박스 */}
              <div className={optionsStyles.auto_login_wrapper}>
                <input
                  id="auto-login"
                  type="checkbox"
                  className={optionsStyles.checkbox}
                  checked={autoLogin}
                  onChange={handleAutoLoginChange}
                  aria-label="자동 로그인"
                />
                <label htmlFor="auto-login" className={optionsStyles.checkbox_label}>
                  자동 로그인
                </label>
              </div>

              {/* 아이디 · 비밀번호 찾기 링크 */}
              <Link href="/find-account" className={optionsStyles.link_text}>
                아이디 · 비밀번호 찾기
              </Link>
            </div>
          </div>

          {/* 로그인 버튼 섹션 */}
          <div className={formStyles.form_section}>
            <button
              type="submit"
              className={optionsStyles.partner_login_button}
              aria-label="로그인"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
