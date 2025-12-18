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
 * - 파트너 회원가입 링크
 * - 아이디 · 비밀번호 찾기 링크
 * - 문의하기 링크
 * - 리뷰어 회원 로그인 링크
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/fragments/Header';
import styles from '@/styles/login/partner_login.module.css';
// 🧪 테스트용 - 실제 API 연결 시 이 import 삭제
import { checkTestLogin, isBlockedAccount } from '@/data/login/testLoginData';

/**
 * 파트너 로그인 페이지 컴포넌트
 */
export default function PartnerLoginPage() {
  const router = useRouter();

  // ========================================
  // 상태 관리 (State Management)
  // ========================================

  /**
   * 아이디(이메일) 상태
   */
  const [email, setEmail] = useState<string>('');

  /**
   * 비밀번호 상태
   */
  const [password, setPassword] = useState<string>('');

  /**
   * 자동 로그인 체크박스 상태
   */
  const [autoLogin, setAutoLogin] = useState<boolean>(false);

  /**
   * 로그인 에러 메시지 상태
   */
  const [errorMessage, setErrorMessage] = useState<string>('');

  // ========================================
  // 이벤트 핸들러 (Event Handlers)
  // ========================================

  /**
   * 아이디(이메일) 입력 변경 핸들러
   *
   * @param e - React의 ChangeEvent 타입 (input 요소의 변경 이벤트)
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // 입력 시 에러 메시지 초기화
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  /**
   * 비밀번호 입력 변경 핸들러
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // 입력 시 에러 메시지 초기화
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  /**
   * 자동 로그인 체크박스 변경 핸들러
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
    setErrorMessage('');

    try {
      // ========================================
      // ⚠️ 실제 API 연결 시 사용할 코드 (아래 주석 해제)
      // ========================================
      // const response = await loginAPI({ email, password, autoLogin });
      // if (!response.success) {
      //   setErrorMessage(response.errorMessage);
      //   return;
      // }
      // // 로그인 성공 시 처리
      // router.push('/partner/dashboard');
      // ========================================

      // ========================================
      // 🧪 테스트용 코드 - 실제 API 연결 시 전체 삭제 필요
      // ========================================
      console.log('로그인 시도:', { email, password, autoLogin });

      // 차단된 계정인지 먼저 확인 (비밀번호가 맞는 경우)
      if (isBlockedAccount(email, password)) {
        // 차단된 계정인 경우 차단 페이지로 이동
        router.push('/blocked');
        return;
      }

      // 테스트 데이터 확인 (testLoginData.ts 파일 참고)
      const testError = checkTestLogin(email, password);
      if (testError) {
        setErrorMessage(testError);
        return;
      }

      // 성공 케이스 (테스트 데이터에 없는 경우)
      console.log('로그인 성공 (테스트 모드)');
      // 로그인 성공 시 페이지 이동
      router.push('/partner/campaign_management');
      // ========================================
      // 🧪 테스트용 코드 끝 - 실제 API 연결 시 위 전체 블록 삭제
      // ========================================
    } catch (error) {
      // API 호출 실패 시 기본 에러 메시지
      setErrorMessage('아이디 또는 비밀번호가 일치하지 않습니다.');
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

              {/* 링크 그룹 */}
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
              className={styles.login_button}
              aria-label="로그인"
            >
              로그인
            </button>
          </div>
        </form>

        {/* 문의하기 링크 */}
        <div className={styles.inquiry_section}>
          <Link href="/inquiry" className={styles.inquiry_link}>
            문의가 필요한가요?
          </Link>
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
