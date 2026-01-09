/* ========================================
   🔒 파트너 비밀번호 변경 페이지
   ======================================== */

/**
 * 파트너 비밀번호 변경 페이지
 *
 * 목적: 파트너(광고주)가 로그인한 상태에서
 *       현재 비밀번호를 확인하고 새 비밀번호로 변경할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /partner/reset-password
 *
 * 주요 기능:
 * - 현재 비밀번호 입력 (비밀번호 표시/숨김 토글 포함)
 * - 새 비밀번호 입력 (비밀번호 표시/숨김 토글 포함)
 * - 새 비밀번호 확인 입력 (비밀번호 표시/숨김 토글 포함)
 * - 간단한 유효성 검사 (길이/일치 여부)
 */

"use client";

import { useState, useEffect } from "react";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import ErrorText from "@/components/common/error_text/ErrorText";
import { findAccountByEmail } from "@/data/login/unifiedAccountData";
import styles from "@/styles/partner/reset_password/reset_password.module.css";

export default function PartnerResetPasswordPage() {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);
  const [currentPasswordError, setCurrentPasswordError] = useState<
    string | undefined
  >();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [passwordConfirmError, setPasswordConfirmError] = useState<
    string | undefined
  >();

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  // 현재 로그인한 파트너의 이메일 가져오기 (테스트용)
  // 실제 구현 시에는 세션이나 쿠키에서 가져와야 합니다
  const getCurrentPartnerEmail = (): string => {
    // localStorage에서 이메일 가져오기 (테스트용)
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("partner_email");
      if (savedEmail) return savedEmail;
    }
    // 테스트용 기본값 (실제로는 로그인한 사용자 정보에서 가져와야 함)
    return "test@test.com";
  };

  const PASSWORD_PATTERN =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+])[A-Za-z\d!@#$%^&*()\-_=+]{8,16}$/;

  const validatePassword = (value: string): string | undefined => {
    if (!value) return undefined;

    if (!PASSWORD_PATTERN.test(value)) {
      return "8~16자 영문, 숫자, 특수문자(!@#$%^&*()-_=+) 조합으로 입력해 주세요.";
    }

    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCurrentPasswordError(undefined);
    setPasswordError(undefined);
    setPasswordConfirmError(undefined);

    if (currentPassword.length === 0) {
      setCurrentPasswordError("현재 비밀번호를 입력해 주세요.");
      return;
    }

    if (password.length === 0) {
      setPasswordError("비밀번호를 입력해 주세요.");
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (currentPassword === password) {
      setPasswordError("기존 비밀번호는 사용할 수 없습니다.");
      return;
    }

    if (password !== passwordConfirm) {
      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 현재 로그인한 파트너의 이메일 가져오기
      const currentEmail = getCurrentPartnerEmail();

      // 목업 데이터에서 현재 파트너 계정 찾기
      const currentAccount = findAccountByEmail(currentEmail);

      if (!currentAccount) {
        setCurrentPasswordError("계정을 찾을 수 없습니다.");
        return;
      }

      // 현재 비밀번호가 맞는지 확인
      if (currentAccount.password !== currentPassword) {
        setCurrentPasswordError("비밀번호가 일치하지 않습니다.");
        return;
      }

      // TODO: 실제 비밀번호 변경 API 연동
      // const response = await changePasswordAPI({ currentPassword, newPassword: password });
      // if (!response.success) {
      //   if (response.errorCode === 'INVALID_CURRENT_PASSWORD') {
      //     setCurrentPasswordError("비밀번호가 일치하지 않습니다.");
      //   } else {
      //     alert(response.errorMessage || "비밀번호 변경에 실패했습니다.");
      //   }
      //   return;
      // }

      // 테스트용: 목업 데이터의 비밀번호 업데이트 (실제로는 API 호출)
      if (currentAccount) {
        currentAccount.password = password;
        console.log("비밀번호 변경 완료 (테스트 모드):", {
          email: currentEmail,
          newPassword: password,
        });
      }

      alert("비밀번호가 변경되었습니다.");
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  const isCurrentPasswordValid =
    currentPassword.length > 0 && !currentPasswordError;
  const isPasswordValid =
    password.length > 0 && !validatePassword(password) && !passwordError;
  const isPasswordConfirmValid =
    passwordConfirm.length > 0 &&
    passwordConfirm === password &&
    !passwordConfirmError;
  const isFormValid =
    isCurrentPasswordValid && isPasswordValid && isPasswordConfirmValid;

  return (
    <div className={styles.reset_password_page_container}>
      {/* 서브헤더 - 파트너 전용 서브헤더 사용 */}
      <PartnerSubHeader />

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.reset_password_main}>
        {/* 페이지 제목 */}
        <PageTitle title="비밀번호 변경" />

        {/* 폼 섹션 */}
        <section className={styles.reset_password_section}>
          {/* 폼 영역 */}
          <form
            id="partner-reset-password-form"
            className={styles.reset_password_form}
            onSubmit={handleSubmit}
          >
            {/* 현재 비밀번호 입력 필드 */}
            <div className={styles.form_field}>
              <label className={styles.field_label} htmlFor="current-password">
                현재 비밀번호
              </label>
              <div className={styles.password_input_wrapper}>
                <input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  className={styles.input_field}
                  placeholder="현재 비밀번호 입력"
                  value={currentPassword}
                  onChange={(e) => {
                    const newCurrentPassword = e.target.value;
                    setCurrentPassword(newCurrentPassword);

                    if (newCurrentPassword.length > 0) {
                      setCurrentPasswordError(undefined);
                    }
                  }}
                />
                <button
                  type="button"
                  className={styles.eye_toggle_button}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={
                    showCurrentPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                  }
                >
                  <img
                    src={
                      showCurrentPassword
                        ? "/images/icons/signup/sign_show.svg"
                        : "/images/icons/signup/sign_none.svg"
                    }
                    alt={
                      showCurrentPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                    width={16}
                    height={16}
                  />
                </button>
              </div>
              <ErrorText message={currentPasswordError} />
            </div>

            {/* 새 비밀번호 입력 필드 */}
            <div className={styles.form_field}>
              <label className={styles.field_label} htmlFor="new-password">
                비밀번호
              </label>
              <div className={styles.password_input_wrapper}>
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  className={styles.input_field}
                  placeholder="영문 + 숫자 + 특수문자 최대 20자 이내 입력"
                  value={password}
                  onChange={(e) => {
                    const newPassword = e.target.value;
                    setPassword(newPassword);

                    const validationError = validatePassword(newPassword);

                    if (newPassword && newPassword === currentPassword) {
                      setPasswordError("기존 비밀번호는 사용할 수 없습니다.");
                    } else if (validationError) {
                      setPasswordError(validationError);
                    } else {
                      setPasswordError(undefined);
                    }

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
              <ErrorText message={passwordError} />
            </div>

            {/* 새 비밀번호 확인 입력 필드 */}
            <div className={styles.form_field}>
              <label
                className={styles.field_label}
                htmlFor="new-password-confirm"
              >
                비밀번호 확인
              </label>
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

                    if (newConfirm && newConfirm !== password) {
                      setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
                    } else {
                      setPasswordConfirmError(undefined);
                    }
                  }}
                />
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
              <ErrorText message={passwordConfirmError} />
            </div>
          </form>

          {/* 비밀번호 변경 버튼 */}
          <button
            type="submit"
            form="partner-reset-password-form"
            className={styles.submit_button}
            disabled={!isFormValid}
            aria-label="비밀번호 변경"
          >
            변경
          </button>
        </section>
      </main>
    </div>
  );
}
