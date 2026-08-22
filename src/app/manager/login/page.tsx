/* ========================================
   관리자 로그인 페이지
   ======================================== */

/**
 * ManagerLoginPage
 *
 * 목적: 관리자 아이디·비밀번호 로그인 처리
 *
 * 사용 페이지:
 * - /manager/login (관리자 로그인)
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/fragments/Header";
import pageStyles from "@/styles/login/login/login_page.module.css";
import formStyles from "@/styles/login/login/form.module.css";
import optionsStyles from "@/styles/login/login/options.module.css";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { setStoredToken, setStoredUser } from "@/lib/auth/storage";
import type { UserRole } from "@/types/auth";

/**
 * 관리자 로그인 페이지 컴포넌트
 *
 * @returns JSX.Element - 사용자 로그인 페이지 UI
 */
export default function AdminLoginPage() {
  const router = useRouter();

  // ========================================
  // 상태 관리 (State Management)
  // ========================================

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [autoLogin, setAutoLogin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
    await performLogin(username, password);
  };

  /**
   * 포트폴리오 데모 로그인 버튼 핸들러
   *
   * 목적: 채용담당자 등 방문자가 아이디/비밀번호를 직접 입력하지 않아도
   * 클릭 한 번으로 관리자 대시보드를 바로 체험할 수 있도록 제공
   */
  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setUsername(demoEmail);
    setPassword(demoPassword);
    await performLogin(demoEmail, demoPassword);
  };

  /**
   * 로그인 실행 (폼 제출 / 데모 버튼 공통 로직)
   */
  const performLogin = async (loginEmail: string, loginPassword: string) => {
    // 에러 메시지 초기화
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // POST /api/admin/login API 호출
      const { data } = await apiClient.post("/api/admin/login", {
        email: loginEmail,
        password: loginPassword,
      });

      if (data.result !== "OK") {
        setErrorMessage(data.error?.message || "로그인에 실패했습니다.");
        return;
      }

      // BLOCKED 상태 체크
      if (data.user?.status === "BLOCKED") {
        setErrorMessage("이용이 제한된 계정입니다.");
        return;
      }

      // 역할 확인 (GA 또는 SA)
      const role = data.user?.role;
      if (role !== "manager_ga" && role !== "manager_sa") {
        setErrorMessage("관리자 계정만 로그인할 수 있습니다.");
        return;
      }

      // API 응답 토큰 직접 저장 (실제 백엔드 토큰 사용)
      setStoredToken(data.token, role as UserRole);
      setStoredUser({
        id: String(data.user.id),
        email: data.user.email,
        name: data.user.name,
        role: role as UserRole,
        status: "ACTIVE",
      });
      router.push(role === "manager_sa" ? "/manager_sa" : "/manager_ga");
    } catch (error) {
      // API 에러 응답 처리
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any;
      const errorData = axiosError?.response?.data;
      const errorCode = errorData?.error?.code;

      if (errorCode === "INVALID_CREDENTIALS") {
        setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
      } else if (errorCode === "ACCOUNT_BANNED") {
        setErrorMessage("정지되었거나 탈퇴된 계정입니다.");
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================
  // 렌더링 (JSX)
  // ========================================

  return (
    <>
      {/* 메인 헤더 */}
      <Header />

      {/* 메인 콘텐츠 영역 (너비 제한은 app/manager/layout.tsx 컨테이너에서 적용) */}
      <main className={pageStyles.partner_login_main}>
        {/* 로그인 메시지 섹션 */}
        <section className={pageStyles.login_message_section}>
          <h2 className={pageStyles.login_title}>
            리뷰엑스는
            <br />
            여러분이 만들어갑니다.
          </h2>
        </section>

        {/* 포트폴리오 데모 로그인 (⚠️ 실제 서비스 배포 시 삭제) */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            padding: "12px",
            border: "1px dashed #999",
            borderRadius: "8px",
          }}
        >
          <button
            type="button"
            onClick={() => handleDemoLogin("manager_ga@test.com", "1234")}
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "#f5f5f5",
              cursor: "pointer",
            }}
          >
            GA 계정으로 체험하기
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin("manager_sa@test.com", "1234")}
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "#f5f5f5",
              cursor: "pointer",
            }}
          >
            SA 계정으로 체험하기
          </button>
        </div>

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
                placeholder="아이디"
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
                placeholder="비밀번호"
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
