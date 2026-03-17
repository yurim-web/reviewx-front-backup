/* ========================================
   카테고리 등록/수정 폼 컴포넌트 (공통)
   ======================================== */

/**
 * CategoryForm
 *
 * 목적: GA/SA 관리자 커뮤니티 카테고리 등록·수정 공통 폼
 *
 * 사용 페이지:
 * - /manager_ga/community/categories/create, /manager_ga/community/categories/[id]/edit
 * - /manager_sa/community/categories/create, /manager_sa/community/categories/[id]/edit
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/manager/common/community/categories/category_create_page.module.css";
import { CustomDropdown } from "@/components/partner/campaign_create_form/common/selectors/CustomDropdown";
import ErrorText from "@/components/common/error_text/ErrorText";
import Toast from "@/components/common/toast/Toast";
import {
  categories_data,
  add_category,
  update_category,
  type CategoryDivision,
  type CategoryItem,
} from "@/data/manager_ga/community/categoriesData";

interface CategoryFormProps {
  // mode: "create" | "edit" - 등록 모드 또는 수정 모드
  mode: "create" | "edit";
  // manager_type: "ga" | "sa" - GA 또는 SA 관리자 구분
  manager_type: "ga" | "sa";
  // category_id: 수정 모드일 때만 필요 (수정할 카테고리의 ID)
  category_id?: string;
}

// 구분 옵션 목록
// CategoryDivision 타입의 모든 값을 배열로 정의하고 오름차순으로 정렬합니다
const division_options: CategoryDivision[] = (
  ["공지사항", "자주 묻는 질문", "이벤트"] as CategoryDivision[]
).sort((a, b) => a.localeCompare(b, "ko-KR"));

export default function CategoryForm({ mode, manager_type, category_id }: CategoryFormProps) {
  // Next.js 라우터 사용
  // useRouter: Next.js에서 페이지 이동을 위한 Hook입니다
  const router = useRouter();

  // 구분 상태 관리
  // useState: React Hook으로 컴포넌트의 구분 상태를 관리합니다
  // [현재 값, 값을 변경하는 함수] = useState(초기값)
  // 초기값은 "공지사항"으로 설정합니다 (Figma 디자인 참고)
  const [division, set_division] = useState<CategoryDivision>("공지사항");

  // 카테고리명 상태 관리
  // useState: React Hook으로 컴포넌트의 카테고리명 상태를 관리합니다
  const [category_name, set_category_name] = useState<string>("");

  // 에러 메시지 상태 관리
  // useState: React Hook으로 컴포넌트의 에러 메시지 상태를 관리합니다
  // 카테고리명 유효성 검사 실패 시 에러 메시지를 표시합니다
  const [error_message, set_error_message] = useState<string>("");

  // 토스트 메시지 표시 상태 관리
  // useState: React Hook으로 컴포넌트의 토스트 표시 상태를 관리합니다
  // 수정 모드에서 저장 성공 시 토스트 메시지를 표시합니다
  const [show_toast, set_show_toast] = useState<boolean>(false);

  // 로딩 상태 관리 (수정 모드일 때만 사용)
  // useState: React Hook으로 컴포넌트의 로딩 상태를 관리합니다
  // 수정 모드일 때만 true로 시작하여 데이터를 불러옵니다
  const [is_loading, set_is_loading] = useState<boolean>(mode === "edit");

  // useEffect: 수정 모드일 때 컴포넌트가 마운트될 때 기존 카테고리 데이터를 불러옵니다
  // useEffect는 두 번째 인자로 의존성 배열을 받습니다
  // 의존성 배열 [category_id, mode]: 이 값들이 변경될 때마다 함수가 실행됩니다
  useEffect(() => {
    // 등록 모드일 때는 데이터를 불러올 필요가 없습니다
    if (mode !== "edit" || !category_id) {
      set_is_loading(false);
      return;
    }

    // TODO: 실제 API 호출로 변경
    // 현재는 목업 데이터에서 카테고리를 찾습니다
    // 실제 구현 시에는 API를 호출하여 카테고리 데이터를 불러옵니다
    const category: CategoryItem | undefined = categories_data.find(
      (item) => item.id === category_id
    );

    if (category) {
      // 찾은 카테고리 데이터로 폼 필드를 채웁니다
      set_division(category.division);
      set_category_name(category.category_name);
    }

    // 로딩 완료
    set_is_loading(false);
  }, [category_id, mode]);

  // 카테고리명 유효성 검사 함수
  // 이 함수는 카테고리명의 길이와 중복을 검사합니다
  const validate_category_name = (): boolean => {
    // 에러 메시지 초기화
    set_error_message("");

    // 카테고리명 길이 검증 (2~10자)
    // trim(): 문자열 앞뒤 공백을 제거합니다
    // length: 문자열의 길이를 반환합니다
    const trimmed_name = category_name.trim();
    if (trimmed_name.length < 2 || trimmed_name.length > 10) {
      set_error_message("카테고리명은 2~10자 이내로 입력해주세요.");
      return false;
    }

    // 같은 구분 내 중복 검증
    // filter(): 배열에서 조건에 맞는 요소만 필터링합니다
    // find(): 배열에서 조건에 맞는 첫 번째 요소를 찾습니다
    // 수정 모드일 때는 현재 수정 중인 카테고리(category_id)는 중복 검사에서 제외합니다
    const duplicate_category = categories_data.find(
      (item) =>
        item.division === division &&
        item.category_name === trimmed_name &&
        // 수정 모드일 때는 현재 수정 중인 카테고리는 제외
        (mode !== "edit" || item.id !== category_id)
    );

    if (duplicate_category) {
      set_error_message("이미 사용 중인 카테고리명입니다.");
      return false;
    }

    // 유효성 검사 통과
    return true;
  };

  // 등록/저장 버튼 클릭 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  // mode에 따라 등록 또는 수정 로직을 실행합니다
  const handle_submit = () => {
    // 유효성 검사 실행
    // validate_category_name(): 카테고리명의 길이와 중복을 검사합니다
    // 유효성 검사 실패 시 함수를 종료합니다 (early return)
    if (!validate_category_name()) {
      return;
    }

    if (mode === "create") {
      // 등록 모드일 때는 목업 데이터에 새로운 카테고리를 추가합니다
      // TODO: 카테고리 등록 API 호출
      // 현재는 목업 데이터를 직접 추가합니다
      // 실제 구현 시에는 API를 호출하여 카테고리를 등록한 후 목록 페이지로 이동합니다
      // add_category: 목업 데이터에 새로운 카테고리를 추가하는 함수입니다
      // CategoryTable 컴포넌트에서 categories_data를 사용하므로, 추가된 내용이 테이블에 반영됩니다
      add_category(division, category_name.trim());
      // Toast 메시지 표시
      set_show_toast(true);
    } else {
      // 수정 모드일 때는 목업 데이터를 수정한 후 토스트 메시지를 표시합니다
      // TODO: 카테고리 수정 API 호출
      // 현재는 목업 데이터를 직접 수정합니다
      // 실제 구현 시에는 API를 호출하여 카테고리를 수정한 후 목록 페이지로 이동합니다
      if (category_id) {
        // update_category: 목업 데이터에서 카테고리를 수정하는 함수입니다
        // CategoryTable 컴포넌트에서 categories_data를 사용하므로, 수정된 내용이 테이블에 반영됩니다
        update_category(category_id, division, category_name.trim());
      }
      // 토스트 메시지 표시
      set_show_toast(true);
    }
  };

  // 토스트 닫기 핸들러
  // 토스트가 닫힐 때 호출되는 함수입니다
  const handle_toast_close = () => {
    // 토스트 상태를 false로 변경
    set_show_toast(false);
    // 등록/수정 모드 모두 목록 페이지로 이동
    setTimeout(() => {
      window.location.href = `/manager_${manager_type}/community/categories`;
    }, 2000); // Toast가 2초 동안 표시된 후 이동
  };

  // 취소 버튼 클릭 핸들러 (뒤로 가기)
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  const _handle_cancel = () => {
    // router.back: 이전 페이지로 돌아가는 메서드입니다
    router.back();
  };

  /**
   * 버튼 비활성화 여부 확인
   * - 모든 필수 필드가 입력되었는지 확인
   * - division, category_name 모두 필수
   * - 수정 모드일 때는 초기 데이터가 있으므로 항상 활성화
   */
  const is_button_disabled = useMemo(() => {
    // 수정 모드일 때는 초기 데이터가 있으므로 항상 활성화
    if (mode === "edit") {
      return false;
    }

    // 등록 모드일 때만 필드 검증
    // 카테고리명이 2자 이상이어야 함
    if (!category_name.trim() || category_name.trim().length < 2) {
      return true;
    }

    return false;
  }, [mode, category_name]);

  // 페이지 제목과 버튼 텍스트를 mode에 따라 결정
  // 삼항 연산자: 조건 ? 참일 때 값 : 거짓일 때 값
  const page_title = mode === "create" ? "카테고리 등록" : "카테고리 수정";
  const button_text = mode === "create" ? "등록" : "저장";
  const form_aria_label = mode === "create" ? "카테고리 등록 폼" : "카테고리 수정 폼";
  const button_aria_label = mode === "create" ? "카테고리 등록" : "카테고리 저장";

  // 로딩 중일 때 표시할 내용 (수정 모드일 때만)
  // 조건부 렌더링: is_loading이 true일 때 로딩 메시지를 표시합니다
  // 주의: Hooks 규칙을 지키기 위해 모든 Hooks는 early return 이전에 호출되어야 합니다
  if (is_loading) {
    return (
      <div className={styles.container}>
        <div className={styles.main_content}>
          <p>카테고리 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 토스트 메시지 */}
        {/* Toast: 저장 성공 시 표시되는 토스트 메시지 컴포넌트입니다 */}
        {/* 조건부 렌더링: 수정 모드에서만 토스트를 표시합니다 */}
        {/* isOpen: 토스트 표시 여부를 제어합니다 */}
        {/* onClose: 토스트가 닫힐 때 호출되는 콜백 함수입니다 */}
        {/* duration: 토스트가 자동으로 사라지는 시간입니다 (기본값: 2000ms) */}
        <Toast
          message={mode === "create" ? "등록되었습니다." : "저장되었습니다."}
          isOpen={show_toast}
          onClose={handle_toast_close}
          duration={2000}
        />

        {/* 페이지 제목 */}
        {/* 조건부 렌더링: mode에 따라 제목이 변경됩니다 */}
        <h1 className={styles.page_title}>{page_title}</h1>

        {/* 폼 영역 */}
        <div className={styles.form_card} aria-label={form_aria_label}>
          {/* 구분 필드 */}
          <div className={styles.form_field}>
            {/* label: 접근성을 위해 input과 연결합니다 */}
            <label className={styles.input_label} htmlFor="division">
              구분
            </label>
            {/* CustomDropdown: 커스텀 드롭다운 컴포넌트를 사용합니다 */}
            <CustomDropdown
              value={division}
              options={division_options}
              onChange={(value) => {
                // 구분 변경 시 에러 메시지 초기화
                set_division(value as CategoryDivision);
                set_error_message("");
              }}
              placeholder="구분을 선택하세요"
            />
          </div>

          {/* 카테고리명 필드 */}
          <div className={styles.form_field}>
            {/* label: 접근성을 위해 input과 연결합니다 */}
            <label className={styles.input_label} htmlFor="category_name">
              카테고리
            </label>
            {/* input: 텍스트 입력 필드입니다 */}
            {/* maxLength: HTML 속성으로 최대 입력 길이를 제한합니다 (10자) */}
            {/* minLength: HTML 속성으로 최소 입력 길이를 지정합니다 (2자) - 유효성 검사에 사용됩니다 */}
            <input
              id="category_name"
              type="text"
              className={styles.input_box}
              value={category_name}
              onChange={(e) => {
                set_category_name(e.target.value);
                set_error_message("");
              }}
              placeholder="카테고리명 입력"
              maxLength={10}
              aria-label="카테고리명"
            />
            {/* 에러 메시지 표시 */}
            {/* ErrorText: 입력 필드 에러 메시지를 표시하는 재사용 가능한 컴포넌트입니다 */}
            {/* 조건부 렌더링: error_message가 있을 때만 ErrorText 컴포넌트를 렌더링합니다 */}
            <ErrorText message={error_message} />
          </div>
        </div>

        {/* 등록/저장 버튼 */}
        <div className={styles.button_container}>
          <button
            type="button"
            className={`${styles.submit_button} ${
              is_button_disabled ? styles.submit_button_disabled : ""
            }`}
            onClick={handle_submit}
            disabled={is_button_disabled}
            aria-label={button_aria_label}
          >
            {/* 조건부 렌더링: mode에 따라 버튼 텍스트가 변경됩니다 */}
            {button_text}
          </button>
        </div>
      </div>
    </div>
  );
}
