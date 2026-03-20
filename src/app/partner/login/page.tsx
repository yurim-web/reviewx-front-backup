/* ========================================
   파트너 로그인 페이지
   ======================================== */

/**
 * 파트너 로그인 페이지
 *
 * 목적: 파트너 회원이 아이디(이메일)와 비밀번호를 입력하여 로그인할 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/login
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import PartnerHeader from "@/components/fragments/PartnerHeader";
import pageStyles from "@/styles/login/login/login_page.module.css";
import formStyles from "@/styles/login/login/form.module.css";
import optionsStyles from "@/styles/login/login/options.module.css";
import linksStyles from "@/styles/login/login/links.module.css";
import { useAuth } from "@/hooks/useAuth";

export default function PartnerLoginPage() {
  const { login, isLoading } = useAuth();

  // ========================================
  // 상태 관리
  // ========================================
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [autoLogin, setAutoLogin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // ========================================
  // 이벤트 핸들러
  // ========================================
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const handleAutoLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoLogin(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await login({ email, password }, "partner");
    } catch (error) {
      // axios 에러 → 백엔드 HTTP 상태 코드 기반 에러 처리
      const axiosError = error as { response?: { status?: number } };
      const status = axiosError?.response?.status;

      if (status === 401) {
        setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다."); // I_E7
      } else if (status === 404) {
        setErrorMessage("입력하신 정보와 일치하는 계정을 찾을 수 없습니다."); // I_E12
      } else if (status === 403) {
        setErrorMessage("정지되었거나 탈퇴된 계정입니다."); // I_E11
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("오류가 발생했습니다. 잠시 후 다시 시도해주세요."); // E_M5
      }
    }
  };

  // ========================================
  // 렌더링
  // ========================================
  return (
    <div className={pageStyles.partner_login_page_container}>
      {/* 파트너 전용 헤더 */}
      <PartnerHeader />

      {/* 메인 콘텐츠 영역 */}
      <main className={pageStyles.partner_login_main}>
        {/* 로그인 메시지 섹션 */}
        <section className={pageStyles.login_message_section}>
          <h2 className={pageStyles.login_title}>
            리뷰엑스,
            <br />
            좋은 리뷰는
            <br />
            좋은 캠페인이 만들어갑니다.
          </h2>
        </section>

        {/* 로그인 폼 섹션 */}
        <form className={formStyles.login_form} onSubmit={handleSubmit}>
          {/* 입력 필드 섹션 */}
          <div className={formStyles.form_section}>
            <div className={formStyles.input_wrapper}>
              <input
                id="email"
                type="email"
                className={formStyles.input_field}
                placeholder="아이디(이메일)"
                value={email}
                onChange={handleEmailChange}
                required
                aria-label="아이디(이메일) 입력"
              />
            </div>

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
              {/* 에러 메시지 */}
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

              {/* 파트너 회원가입 / 계정찾기 링크 */}
              <div className={optionsStyles.links_group}>
                <Link href="/partner/signup" className={optionsStyles.link_text}>
                  파트너 회원가입
                </Link>
                <span className={optionsStyles.link_divider}>|</span>
                <Link href="/partner/find-account" className={optionsStyles.link_text}>
                  아이디 · 비밀번호 찾기
                </Link>
              </div>
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
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>

        {/* 문의하기 링크 (카카오톡 외부 링크) */}
        <div className={linksStyles.inquiry_section}>
          <a
            href="https://pf.kakao.com" // TODO: 실제 카카오톡 문의 URL로 교체
            className={linksStyles.inquiry_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            문의가 필요한가요?
          </a>
        </div>
      </main>

      {/* 리뷰어 회원 로그인 링크 - 화면 하단 고정 */}
      <div className={linksStyles.user_login_section}>
        <Link href="/user/login" className={linksStyles.user_login_link}>
          리뷰어 회원 로그인
        </Link>
      </div>
    </div>
  );
}
