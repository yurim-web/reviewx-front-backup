/* ========================================
   📝 관리자 등록 폼 컴포넌트
   ======================================== */

/**
 * 관리자 등록 폼 컴포넌트
 *
 * 목적: 관리자 등록 페이지에서 사용하는 등록 폼 컴포넌트입니다.
 *
 * 사용 위치:
 * - /manager_sa/member/admins/create (관리자 등록 페이지)
 *
 * 주요 기능:
 * - 아이디 입력
 * - 비밀번호 입력 및 확인
 * - 이름 입력
 * - 휴대폰 번호 입력
 * - 등록 버튼
 *
 * React 핵심 개념:
 * - useState: 폼 입력값 상태 관리
 * - 이벤트 핸들러: onChange로 입력값 변경 처리
 * - 폼 제출: onSubmit으로 등록 처리
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/manager_sa/member/admins/admin_register_form.module.css";

export default function AdminRegisterForm() {
  // Next.js의 useRouter 훅을 사용하여 페이지 이동 기능 가져오기
  // useRouter: Next.js에서 제공하는 클라이언트 사이드 라우팅 훅입니다
  const router = useRouter();

  // 폼 입력값 상태 관리
  // useState: React Hook으로 컴포넌트의 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] = useState(초기값)
  const [form_data, set_form_data] = useState({
    id: "",
    password: "",
    password_confirm: "",
    name: "",
    phone: "",
  });

  // 입력값 변경 핸들러
  // 이벤트 핸들러 함수로, 사용자가 입력 필드를 변경할 때 호출됩니다
  // e.target.name: 입력 필드의 name 속성 (예: "id", "password")
  // e.target.value: 입력 필드의 현재 값
  const handle_input_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    set_form_data((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 핸들러
  // 폼이 제출될 때 호출되는 함수입니다
  // e.preventDefault(): 기본 폼 제출 동작을 막아서 페이지 새로고침을 방지합니다
  const handle_submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 관리자 등록 API 호출
    console.log("등록 데이터:", form_data);
    // 등록 성공 후 관리자 목록 페이지로 이동
    router.push("/manager_sa/member/admins");
  };

  return (
    <form className={styles.register_form} onSubmit={handle_submit}>
      {/* 아이디 입력 필드 */}
      <div className={styles.form_field}>
        <label htmlFor="id" className={styles.form_label}>
          아이디
        </label>
        <input
          type="text"
          id="id"
          name="id"
          value={form_data.id}
          onChange={handle_input_change}
          className={styles.form_input}
          placeholder="아이디를 입력하세요"
          required
        />
      </div>

      {/* 비밀번호 입력 필드 */}
      <div className={styles.form_field}>
        <label htmlFor="password" className={styles.form_label}>
          비밀번호
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={form_data.password}
          onChange={handle_input_change}
          className={styles.form_input}
          placeholder="비밀번호를 입력하세요"
          required
        />
      </div>

      {/* 비밀번호 확인 입력 필드 */}
      <div className={styles.form_field}>
        <label htmlFor="password_confirm" className={styles.form_label}>
          비밀번호 확인
        </label>
        <input
          type="password"
          id="password_confirm"
          name="password_confirm"
          value={form_data.password_confirm}
          onChange={handle_input_change}
          className={styles.form_input}
          placeholder="비밀번호를 다시 입력하세요"
          required
        />
      </div>

      {/* 이름 입력 필드 */}
      <div className={styles.form_field}>
        <label htmlFor="name" className={styles.form_label}>
          이름
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={form_data.name}
          onChange={handle_input_change}
          className={styles.form_input}
          placeholder="이름을 입력하세요"
          required
        />
      </div>

      {/* 휴대폰 번호 입력 필드 */}
      <div className={styles.form_field}>
        <label htmlFor="phone" className={styles.form_label}>
          휴대폰 번호
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={form_data.phone}
          onChange={handle_input_change}
          className={styles.form_input}
          placeholder="- 제외 입력"
          pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
          required
        />
      </div>

      {/* 등록 버튼 */}
      <button type="submit" className={styles.submit_button}>
        등록
      </button>
    </form>
  );
}
