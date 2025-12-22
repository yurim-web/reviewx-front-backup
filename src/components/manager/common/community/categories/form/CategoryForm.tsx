/* ========================================
   📝 카테고리 등록/수정 폼 컴포넌트 (공통)
   ======================================== */

/**
 * 카테고리 등록/수정 폼 컴포넌트 (공통)
 *
 * 목적: 카테고리 등록과 수정을 하나의 컴포넌트로 재사용합니다.
 *
 * 사용 위치:
 * - /manager_ga/community/categories/create (카테고리 등록 페이지)
 * - /manager_ga/community/categories/[id]/edit (카테고리 수정 페이지)
 * - /manager_sa/community/categories/create (카테고리 등록 페이지)
 * - /manager_sa/community/categories/[id]/edit (카테고리 수정 페이지)
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/manager/common/community/categories/category_create_page.module.css";
import { CustomDropdown } from "@/components/partner/campaign_create_form/common/CustomDropdown";
import {
  categories_data,
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
// CategoryDivision 타입의 모든 값을 배열로 정의합니다
const division_options: CategoryDivision[] = [
  "공지사항",
  "자주 묻는 질문",
  "이벤트",
];

export default function CategoryForm({
  mode,
  manager_type,
  category_id,
}: CategoryFormProps) {
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

  // 등록/저장 버튼 클릭 핸들러
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  // mode에 따라 등록 또는 수정 로직을 실행합니다
  const handle_submit = () => {
    if (mode === "create") {
      // TODO: 카테고리 등록 API 호출
      // 현재는 목록 페이지로 이동만 처리합니다
      // 실제 구현 시에는 API를 호출하여 카테고리를 등록한 후 목록 페이지로 이동합니다
      console.log("카테고리 등록:", { division, category_name });
    } else {
      // TODO: 카테고리 수정 API 호출
      // 현재는 목록 페이지로 이동만 처리합니다
      // 실제 구현 시에는 API를 호출하여 카테고리를 수정한 후 목록 페이지로 이동합니다
      console.log("카테고리 수정:", { category_id, division, category_name });
    }

    // 등록/수정 후 카테고리 목록 페이지로 이동
    // router.push: Next.js에서 페이지를 이동하는 메서드입니다
    router.push(`/manager_${manager_type}/community/categories`);
  };

  // 취소 버튼 클릭 핸들러 (뒤로 가기)
  // 화살표 함수로 이벤트 핸들러를 정의합니다
  const handle_cancel = () => {
    // router.back: 이전 페이지로 돌아가는 메서드입니다
    router.back();
  };

  // 로딩 중일 때 표시할 내용 (수정 모드일 때만)
  // 조건부 렌더링: is_loading이 true일 때 로딩 메시지를 표시합니다
  if (is_loading) {
    return (
      <div className={styles.container}>
        <div className={styles.main_content}>
          <p>카테고리 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 페이지 제목과 버튼 텍스트를 mode에 따라 결정
  // 삼항 연산자: 조건 ? 참일 때 값 : 거짓일 때 값
  const page_title = mode === "create" ? "카테고리 등록" : "카테고리 수정";
  const button_text = mode === "create" ? "등록" : "저장";
  const form_aria_label =
    mode === "create" ? "카테고리 등록 폼" : "카테고리 수정 폼";
  const button_aria_label =
    mode === "create" ? "카테고리 등록" : "카테고리 저장";

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
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
              onChange={(value) => set_division(value as CategoryDivision)}
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
            <input
              id="category_name"
              type="text"
              className={styles.input_box}
              value={category_name}
              onChange={(e) => set_category_name(e.target.value)}
              placeholder="카테고리명 입력"
              aria-label="카테고리명"
            />
          </div>
        </div>

        {/* 등록/저장 버튼 */}
        <div className={styles.button_container}>
          <button
            type="button"
            className={styles.submit_button}
            onClick={handle_submit}
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
