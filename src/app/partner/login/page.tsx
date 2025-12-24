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
import Header from "@/components/fragments/Header";
import styles from "@/styles/login/login.module.css";
// 🧪 테스트용 - 실제 API 연동 시 삭제 예정
import {
  findAccountByCredentials,
  findAccountByEmail,
} from "@/data/login/unifiedAccountData";

export default function PartnerLoginPage() {
  const router = useRouter();

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
      // ========================================
      // ⚠️ 실제 API 연결 시 사용할 코드 (예시)
      // ========================================
      // const response = await loginAPI({ email, password, autoLogin });
      // if (!response.success) {
      //   setErrorMessage(response.errorMessage);
      //   return;
      // }
      // router.push("/partner/dashboard");

      // ========================================
      // 🧪 테스트용 코드 (실제 연동 시 전체 삭제)
      // ========================================
      console.log("로그인 시도:", { email, password, autoLogin });

      // 먼저 이메일로 계정 존재 여부 확인
      const accountByEmail = findAccountByEmail(email);

      // 계정이 아예 존재하지 않는 경우
      if (!accountByEmail) {
        setErrorMessage("입력하신 정보와 일치하는 계정을 찾을 수 없습니다.");
        return;
      }

      // 이메일과 비밀번호로 계정 찾기 (비밀번호 확인)
      const foundAccount = findAccountByCredentials(email, password);

      // 비밀번호가 틀린 경우 (계정은 있지만 비밀번호가 맞지 않음)
      if (!foundAccount) {
        setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
        return;
      }

      // 이용 제한(차단) 계정인지 먼저 확인
      if (foundAccount.isBlocked) {
        // 이용 제한 안내 페이지로 이동
        router.push("/blacklist_info");
        return;
      }

      // 정지/탈퇴된 계정인 경우
      if (foundAccount.isBanned) {
        setErrorMessage("정지되었거나 탈퇴된 계정입니다.");
        return;
      }

      // 성공 케이스
      console.log("로그인 성공 (테스트 모드)");

      // 테스트용: localStorage에 이메일 저장 (비밀번호 변경 페이지에서 사용)
      if (typeof window !== "undefined") {
        localStorage.setItem("partner_email", foundAccount.email);
      }

      // 통합 계정 데이터의 redirectUrl 사용
      router.push(foundAccount.redirectUrl);
      // ========================================
    } catch (error) {
      setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  // ========================================
  // 렌더링
  // ========================================
  return (
    <div className={styles.partner_login_page_container}>
      {/* 메인 헤더 */}
      <Header />

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.partner_login_main}>
        {/* 로그인 메시지 섹션 */}
        <section className={styles.login_message_section}>
          <h2 className={styles.login_title}>
            리뷰엑스,
            <br />
            좋은 리뷰는
            <br />
            좋은 캠페인이 만들어갑니다.
          </h2>
        </section>

        {/* 로그인 폼 섹션 */}
        <form className={styles.login_form} onSubmit={handleSubmit}>
          {/* 입력 필드 섹션 */}
          <div className={styles.form_section}>
            <div className={styles.input_wrapper}>
              <input
                id="email"
                type="email"
                className={styles.input_field}
                placeholder="아이디(이메일)를 입력하세요"
                value={email}
                onChange={handleEmailChange}
                required
                aria-label="아이디(이메일) 입력"
              />
            </div>

            <div className={styles.input_wrapper}>
              <input
                id="password"
                type="password"
                className={styles.input_field}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={handlePasswordChange}
                required
                aria-label="비밀번호 입력"
              />
              {/* 에러 메시지 */}
              {errorMessage && (
                <div className={styles.error_message_section}>
                  <span className={styles.error_text}>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* 옵션 및 링크 섹션 */}
          <div className={styles.form_section}>
            <div className={styles.login_options_section}>
              {/* 자동 로그인 체크박스 */}
              <div className={styles.auto_login_wrapper}>
                <input
                  id="auto-login"
                  type="checkbox"
                  className={styles.checkbox}
                  checked={autoLogin}
                  onChange={handleAutoLoginChange}
                  aria-label="자동 로그인"
                />
                <label htmlFor="auto-login" className={styles.checkbox_label}>
                  자동 로그인
                </label>
              </div>

              {/* 파트너 회원가입 / 계정찾기 링크 */}
              <div className={styles.links_group}>
                <Link href="/partner/signup" className={styles.link_text}>
                  파트너 회원가입
                </Link>
                <span className={styles.link_divider}>|</span>
                <Link href="/partner/find-account" className={styles.link_text}>
                  아이디 · 비밀번호 찾기
                </Link>
              </div>
            </div>
          </div>

          {/* 로그인 버튼 섹션 */}
          <div className={styles.form_section}>
            <button
              type="submit"
              className={styles.partner_login_button}
              aria-label="로그인"
            >
              로그인
            </button>
          </div>
        </form>

        {/* 문의하기 링크 (카카오톡 외부 링크) */}
        <div className={styles.inquiry_section}>
          <a
            href="https://pf.kakao.com" // TODO: 실제 카카오톡 문의 URL로 교체
            className={styles.inquiry_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            문의가 필요한가요?
          </a>
        </div>
      </main>

      {/* 리뷰어 회원 로그인 링크 - 화면 하단 고정 */}
      <div className={styles.user_login_section}>
        <Link href="/user/login" className={styles.user_login_link}>
          리뷰어 회원 로그인
        </Link>
      </div>
    </div>
  );
}
