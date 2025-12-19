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
import styles from "@/styles/login/login.module.css";
// 🧪 테스트용 - 실제 API 연결 시 이 import 삭제
import {
  checkUserTestLogin,
  isBlockedUserAccount,
  BANNED_USER_ACCOUNTS,
} from "@/data/login/testLoginData";

/**
 * 관리자 로그인 페이지 컴포넌트
 *
 * @returns JSX.Element - 사용자 로그인 페이지 UI
 */
export default function AdminLoginPage() {
  // Next.js의 useRouter 훅: 페이지 이동을 위한 라우터 객체
  const router = useRouter();

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
      // ========================================
      // ⚠️ 실제 API 연결 시 사용할 코드 (아래 주석 해제)
      // ========================================
      // const response = await loginAPI({ username, password, autoLogin });
      // if (!response.success) {
      //   setErrorMessage(response.errorMessage);
      //   return;
      // }
      // // 로그인 성공 시 처리
      // router.push('/user/campaign_management');
      // ========================================

      // ========================================
      // 🧪 테스트용 코드 - 실제 API 연결 시 전체 삭제 필요
      // ========================================
      console.log("로그인 시도:", { username, password, autoLogin });

      // 이용 제한(차단) 계정인지 먼저 확인 (비밀번호가 맞는 경우)
      if (isBlockedUserAccount(username, password)) {
        // 이용 제한 안내 페이지로 이동
        router.push("/blacklist_info");
        return;
      }

      // 정지/탈퇴된 계정인 경우
      if (BANNED_USER_ACCOUNTS.includes(username)) {
        router.push("/pause_info");
        return;
      }

      // 테스트 데이터 확인 (testLoginData.ts 파일 참고)
      const testError = checkUserTestLogin(username, password);
      if (testError) {
        setErrorMessage(testError);
        return;
      }

      // 성공 케이스 (테스트 데이터에 있는 경우)
      console.log("로그인 성공 (테스트 모드)");

      // 관리자 타입별로 다른 페이지로 이동
      if (username === "manager_sa@test.com") {
        router.push("/manager_sa");
        return;
      }

      if (username === "manager_ga@test.com") {
        router.push("/manager_ga");
        return;
      }

      // 기본 fallback (혹시 다른 관리자 계정이 추가될 경우)
      router.push("/manager_sa");
      // ========================================
      // 🧪 테스트용 코드 끝 - 실제 API 연결 시 위 전체 블록 삭제
      // ========================================
    } catch (error) {
      // API 호출 실패 시 기본 에러 메시지
      setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  // ========================================
  // 렌더링 (JSX)
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
            리뷰엑스는
            <br />
            여러분이 만들어갑니다.
          </h2>
        </section>

        {/* 로그인 폼 섹션 */}
        <form className={styles.login_form} onSubmit={handleSubmit}>
          {/* 입력 필드 섹션 */}
          <div className={styles.form_section}>
            {/* 아이디 입력 필드 */}
            <div className={styles.input_wrapper}>
              <input
                id="username"
                type="text"
                className={styles.input_field}
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={handleUsernameChange}
                required
                aria-label="아이디 입력"
              />
            </div>

            {/* 비밀번호 입력 필드 */}
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
              {/* 에러 메시지 - 비밀번호 입력 필드 바로 아래 */}
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

              {/* 아이디 · 비밀번호 찾기 링크 */}
              <Link href="/find-account" className={styles.link_text}>
                아이디 · 비밀번호 찾기
              </Link>
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
      </main>
    </div>
  );
}
