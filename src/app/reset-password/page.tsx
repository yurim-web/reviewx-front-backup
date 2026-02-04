/* ========================================
   🔒 새 비밀번호 설정 페이지
   ======================================== */

/**
 * 새 비밀번호 설정 페이지
 *
 * 목적: 아이디/비밀번호 찾기 플로우 이후 또는
 *       기타 비밀번호 재설정 진입점에서
 *       사용자가 새 비밀번호를 설정할 수 있도록 하는 독립 페이지입니다.
 *
 * 페이지 경로:
 * - /reset-password
 *
 * 주요 기능:
 * - 새 비밀번호 입력 (비밀번호 표시/숨김 토글 포함)
 * - 새 비밀번호 확인 입력 (비밀번호 표시/숨김 토글 포함)
 * - 간단한 유효성 검사 (길이/일치 여부)
 *
 */

"use client";

import { useState } from "react";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import BaseModal from "@/components/common/modal/BaseModal";
import ErrorText from "@/components/common/error_text/ErrorText";
import styles from "@/styles/common/reset_password/reset_password.module.css";

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
  // isSuccessModalOpen: 비밀번호 변경 완료 모달 열림 상태
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  // TODO: 현재 비밀번호는 API에서 가져오거나 세션/쿠키에서 가져와야 함
  // 현재는 테스트용으로 빈 문자열로 설정 (실제 구현 시 API 연동 필요)
  const [currentPassword] = useState<string>("");

  /**
   * 비밀번호 유효성 검사 함수
   *
   * 규칙:
   * - 8~16자
   * - 영문 + 숫자 + 특수문자(!@#$%^&*()-_=+) 조합
   *
   * 정규식 설명:
   * - (?=.*[A-Za-z])  : 최소 1개의 영문 포함
   * - (?=.*\\d)       : 최소 1개의 숫자 포함
   * - (?=.*[!@#$%^&*()\\-_=+]) : 최소 1개의 지정 특수문자 포함
   * - [A-Za-z\\d!@#$%^&*()\\-_=+]{8,16} : 전체 길이 8~16자, 허용된 문자만 사용
   */
  const PASSWORD_PATTERN =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+])[A-Za-z\d!@#$%^&*()\-_=+]{8,16}$/;

  const validatePassword = (value: string): string | undefined => {
    // 값이 비어 있으면 여기서는 에러를 표시하지 않고, 제출 시에만 "입력해주세요" 에러 처리
    if (!value) return undefined;

    if (!PASSWORD_PATTERN.test(value)) {
      return "8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.";
    }

    return undefined;
  };

  /**
   * 폼 제출 핸들러
   * e.preventDefault(): 기본 폼 제출 동작(페이지 새로고침) 방지
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 에러 상태 초기화
    setPasswordError(undefined);
    setPasswordConfirmError(undefined);

    // 비밀번호 공백 검증
    if (password.length === 0) {
      setPasswordError("비밀번호를 입력해 주세요.");
      return;
    }

    // 비밀번호 패턴 검증 (8~16자, 영문 + 숫자 + 특수문자 조합)
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    // 비밀번호 일치 검증
    if (password !== passwordConfirm) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 현재 비밀번호와 동일한지 검증
    // TODO: currentPassword는 실제로는 API에서 가져오거나 세션/쿠키에서 가져와야 함
    if (currentPassword && password === currentPassword) {
      setPasswordError("기존 비밀번호는 사용할 수 없습니다.");
      return;
    }

    // TODO: 실제 비밀번호 변경 API 연동
    console.log("새 비밀번호 설정:", { password });
    // 비밀번호 변경 완료 모달 표시
    setIsSuccessModalOpen(true);
  };

  /**
   * 폼 유효성 여부
   *
   * - 비밀번호가 패턴에 맞는지 (8~16자, 영문 + 숫자 + 특수문자 조합)
   * - 비밀번호 확인이 비밀번호와 일치하는지
   * - 에러 메시지가 없는지
   */
  const isPasswordValid =
    password.length > 0 && !validatePassword(password) && !passwordError;
  const isPasswordConfirmValid =
    passwordConfirm.length > 0 &&
    passwordConfirm === password &&
    !passwordConfirmError;
  const isFormValid = isPasswordValid && isPasswordConfirmValid;

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
          <form
            id="reset-password-form"
            className={styles.reset_password_form}
            onSubmit={handleSubmit}
          >
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
                  placeholder="영문 + 숫자 + 특수문자 최대 20자 이내"
                  value={password}
                  onChange={(e) => {
                    // onChange 이벤트: 입력값이 변경될 때마다 실행
                    const newPassword = e.target.value;
                    setPassword(newPassword);

                    // 입력 중 실시간 유효성 검사 (패턴 체크)
                    const validationError = validatePassword(newPassword);
                    setPasswordError(validationError);

                    // 두 번째 비밀번호 입력값이 이미 있는 경우, 일치 여부도 함께 검사
                    if (passwordConfirm) {
                      if (newPassword !== passwordConfirm) {
                        setPasswordConfirmError(
                          "비밀번호가 일치하지 않습니다."
                        );
                      } else {
                        setPasswordConfirmError(undefined);
                      }
                    }
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
              <ErrorText message={passwordError} />
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
                    const newConfirm = e.target.value;
                    setPasswordConfirm(newConfirm);

                    // 첫 번째 비밀번호와 일치 여부 실시간 검사
                    if (newConfirm && newConfirm !== password) {
                      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
                    } else {
                      setPasswordConfirmError(undefined);
                    }
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
              <ErrorText message={passwordConfirmError} />
            </div>
          </form>

          {/* 비밀번호 변경 버튼 */}
          <button
            type="submit"
            form="reset-password-form"
            className={styles.submit_button}
            disabled={!isFormValid}
            aria-label="비밀번호 변경"
          >
            변경
          </button>
        </section>
      </main>

      {/* 비밀번호 변경 완료 모달 */}
      <BaseModal
        is_open={isSuccessModalOpen}
        on_close={() => setIsSuccessModalOpen(false)}
        message="비밀번호 변경이 완료되었습니다."
        buttons={["닫기"]}
      />
    </div>
  );
}
