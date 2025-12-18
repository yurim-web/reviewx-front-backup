/* ========================================
   🔒 새 비밀번호 설정 페이지
   ======================================== */

/**
 * 새 비밀번호 설정 페이지
 *
 * 목적: 아이디/비밀번호 찾기 플로우 이후,
 *       사용자가 새 비밀번호를 설정할 수 있도록 하는 페이지입니다.
 *
 * 페이지 경로:
 * - /find-account/reset-password
 *
 * 주요 기능:
 * - 새 비밀번호 입력 (비밀번호 표시/숨김 토글 포함)
 * - 새 비밀번호 확인 입력 (비밀번호 표시/숨김 토글 포함)
 * - 간단한 유효성 검사 (길이/일치 여부)
 *
 * 학습 포인트:
 * - useState: 컴포넌트 내부 상태 관리 (비밀번호 값, 에러 상태, 표시/숨김 상태)
 * - 이벤트 핸들러: onChange, onSubmit으로 사용자 입력 처리
 * - 조건부 렌더링: 에러 메시지 표시 여부 결정
 * - TypeScript 타입: useState의 제네릭 타입 지정
 * - 접근성: aria-label로 버튼의 목적 명시
 */

"use client";

import { useState } from "react";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import styles from "@/styles/common/reset_password.module.css";

export default function ResetPasswordPage() {
  // useState: React의 상태 관리 훅
  // [상태값, 상태 변경 함수] = useState<타입>(초기값)
  // password: 새 비밀번호 입력값
  const [password, setPassword] = useState<string>("");
  // passwordConfirm: 새 비밀번호 확인 입력값
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  // showPassword: 첫 번째 비밀번호 필드의 표시/숨김 상태
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // showPasswordConfirm: 두 번째 비밀번호 필드의 표시/숨김 상태
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);
  // passwordError: 첫 번째 비밀번호 필드의 에러 메시지
  const [passwordError, setPasswordError] = useState<string | undefined>();
  // passwordConfirmError: 두 번째 비밀번호 필드의 에러 메시지
  const [passwordConfirmError, setPasswordConfirmError] = useState<
    string | undefined
  >();

  /**
   * 폼 제출 핸들러
   * e.preventDefault(): 기본 폼 제출 동작(페이지 새로고침) 방지
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 에러 상태 초기화
    setPasswordError(undefined);
    setPasswordConfirmError(undefined);

    // 비밀번호 길이 검증 (최대 20자)
    if (password.length === 0) {
      setPasswordError("비밀번호를 입력해 주세요.");
      return;
    }

    if (password.length > 20) {
      setPasswordError("비밀번호는 최대 20자 이내로 입력해 주세요.");
      return;
    }

    // 비밀번호 일치 검증
    if (password !== passwordConfirm) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // TODO: 실제 비밀번호 변경 API 연동
    console.log("새 비밀번호 설정:", { password });
    alert("비밀번호가 변경되었습니다. 변경된 비밀번호로 로그인해 주세요.");
  };

  return (
    <div className={styles.reset_password_page_container}>
      {/* 서브헤더 */}
      <SubHeader />

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.reset_password_main}>
        {/* 페이지 제목 */}
        <PageTitle title="새 비밀번호 설정" />

        {/* 폼 섹션 */}
        <section className={styles.reset_password_section}>
          {/* 폼 영역 */}
          <form className={styles.reset_password_form} onSubmit={handleSubmit}>
            {/* 새 비밀번호 입력 필드 */}
            <div className={styles.form_field}>
              <label className={styles.field_label} htmlFor="new-password">
                새 비밀번호
              </label>
              {/* 비밀번호 입력 래퍼: position: relative로 설정하여 눈 아이콘을 절대 위치로 배치 */}
              <div className={styles.password_input_wrapper}>
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  className={styles.input_field}
                  placeholder="영문 + 숫자 + 특수문자 최대 20자 이내 입력"
                  value={password}
                  onChange={(e) => {
                    // onChange 이벤트: 입력값이 변경될 때마다 실행
                    setPassword(e.target.value);
                    // 입력 중이면 에러 메시지 제거
                    if (passwordError) setPasswordError(undefined);
                  }}
                />
                {/* 비밀번호 표시/숨김 토글 버튼 */}
                <button
                  type="button"
                  className={styles.eye_toggle_button}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                  }
                >
                  <img
                    src={
                      showPassword
                        ? "/images/icons/signup/sign_show.svg"
                        : "/images/icons/signup/sign_none.svg"
                    }
                    alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                    width={16}
                    height={16}
                  />
                </button>
              </div>
              {/* 조건부 렌더링: passwordError가 있을 때만 에러 메시지 표시 */}
              {passwordError && (
                <div className={styles.error_message}>
                  <span className={styles.error_text}>{passwordError}</span>
                </div>
              )}
            </div>

            {/* 새 비밀번호 확인 입력 필드 */}
            <div className={styles.form_field}>
              <label
                className={styles.field_label}
                htmlFor="new-password-confirm"
              >
                새 비밀번호 확인
              </label>
              {/* 비밀번호 확인 입력 래퍼 */}
              <div className={styles.password_input_wrapper}>
                <input
                  id="new-password-confirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  className={styles.input_field}
                  placeholder="비밀번호 재입력"
                  value={passwordConfirm}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                    // 입력 중이면 에러 메시지 제거
                    if (passwordConfirmError)
                      setPasswordConfirmError(undefined);
                  }}
                />
                {/* 비밀번호 확인 필드의 표시/숨김 토글 버튼 */}
                <button
                  type="button"
                  className={styles.eye_toggle_button}
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  aria-label={
                    showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"
                  }
                >
                  <img
                    src={
                      showPasswordConfirm
                        ? "/images/icons/signup/sign_show.svg"
                        : "/images/icons/signup/sign_none.svg"
                    }
                    alt={
                      showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                    width={16}
                    height={16}
                  />
                </button>
              </div>
              {/* 조건부 렌더링: passwordConfirmError가 있을 때만 에러 메시지 표시 */}
              {passwordConfirmError && (
                <div className={styles.error_message}>
                  <span className={styles.error_text}>
                    {passwordConfirmError}
                  </span>
                </div>
              )}
            </div>

            {/* 비밀번호 변경 버튼 */}
            <button
              type="submit"
              className={styles.submit_button}
              aria-label="비밀번호 변경"
            >
              변경
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
