/* ========================================
   🔐 파트너 로그인 페이지
   ======================================== */

/**
 * 파트너 로그인 페이지
 *
 * 목적: 파트너 회원이 아이디(이메일)와 비밀번호를 입력하여 로그인할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/login
 *
 * 주요 기능:
 * - 아이디(이메일) 입력
 * - 비밀번호 입력
 * - 자동 로그인 체크박스
 * - 로그인 버튼
 * - 파트너 회원가입 / 계정찾기 / 문의 / 리뷰어 로그인 링크
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PartnerHeader from "@/components/fragments/PartnerHeader";
import pageStyles from "@/styles/login/login/page.module.css";
import formStyles from "@/styles/login/login/form.module.css";
import optionsStyles from "@/styles/login/login/options.module.css";
import linksStyles from "@/styles/login/login/links.module.css";
import { useAuth } from "@/hooks/useAuth";

export default function PartnerLoginPage() {
  const router = useRouter();
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
      // 인증 시스템을 통한 로그인 (LocalStorage 기반)
      await login({ email, password }, 'partner');

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
                placeholder="아이디(이메일)를 입력하세요"
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
                placeholder="비밀번호를 입력하세요"
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
              {isLoading ? '로그인 중...' : '로그인'}
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
