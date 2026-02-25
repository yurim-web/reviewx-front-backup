/* ========================================
   관리자 수정 폼 컴포넌트
   ======================================== */

/**
 * AdminEditForm
 *
 * 목적: 관리자 수정 페이지에서 사용하는 수정 폼 컴포넌트입니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/admins/[id]/edit (관리자 수정 페이지)
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "@/styles/manager_sa/member/admins/admin_register_form.module.css";
import { admin_list } from "@/data/manager_sa/member/admins";

export default function AdminEditForm() {
  // Next.js의 useRouter 훅을 사용하여 페이지 이동 기능 가져오기
  const router = useRouter();
  // useParams: URL 파라미터에서 동적 경로 값을 가져오는 훅입니다
  // 예: /manager_sa/member/admins/123/edit → params.id = "123"
  const params = useParams();
  const admin_id = params?.id as string;

  // 관리자 데이터 찾기
  const admin_data = admin_list.find((admin) => admin.id === admin_id);

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

  // 컴포넌트가 마운트될 때 관리자 데이터를 폼에 로드
  // useEffect: 컴포넌트가 렌더링된 후 실행되는 훅입니다
  // 의존성 배열 [admin_data]가 변경될 때마다 실행됩니다
  useEffect(() => {
    if (admin_data) {
      set_form_data({
        id: admin_data.id,
        password: "",
        password_confirm: "",
        name: admin_data.name,
        phone: "010-1234-5678", // TODO: 실제 데이터에서 가져오기
      });
    }
  }, [admin_data]);

  // 관리자 데이터가 없으면 에러 메시지 표시
  if (!admin_data) {
    return <div className={styles.error_message}>관리자를 찾을 수 없습니다.</div>;
  }

  // 입력값 변경 핸들러
  // 이벤트 핸들러 함수로, 사용자가 입력 필드를 변경할 때 호출됩니다
  // e.target.name: 입력 필드의 name 속성 (예: "password", "name")
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
    // TODO: 관리자 수정 API 호출
    // 수정 성공 후 관리자 목록 페이지로 이동
    router.push("/manager_sa/member/admins");
  };

  return (
    <form className={styles.edit_form} onSubmit={handle_submit}>
      {/* 아이디 입력 필드 (수정 불가, 비활성화) */}
      <div className={styles.form_field}>
        <label htmlFor="id" className={styles.form_label}>
          아이디
        </label>
        <input
          type="text"
          id="id"
          name="id"
          value={form_data.id}
          disabled
          className={`${styles.form_input} ${styles.form_input_disabled}`}
          readOnly
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
          placeholder="변경 시 8~16자 영문, 숫자, 특수문자 조합 입력"
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
          placeholder="변경 시 비밀번호 재입력"
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

      {/* 저장 버튼 */}
      <button type="submit" className={styles.submit_button}>
        저장
      </button>
    </form>
  );
}
