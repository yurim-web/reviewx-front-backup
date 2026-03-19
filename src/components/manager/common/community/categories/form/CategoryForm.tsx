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

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Loading from "@/app/loading";
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
import { createCategory, updateCategoryApi, getCategoryFormOptions } from "@/lib/api/categories";

interface CategoryFormProps {
  mode: "create" | "edit";
  manager_type: "ga" | "sa";
  category_id?: string;
}

// 구분 옵션 기본값 (API 미응답 시 fallback)
const DEFAULT_DIVISION_OPTIONS: CategoryDivision[] = ["공지사항", "자주 묻는 질문"];

export default function CategoryForm({ mode, manager_type, category_id }: CategoryFormProps) {
  const router = useRouter();

  const [division, set_division] = useState<CategoryDivision>("공지사항");
  const [category_name, set_category_name] = useState<string>("");
  const [error_message, set_error_message] = useState<string>("");
  const [show_toast, set_show_toast] = useState<boolean>(false);
  const [is_loading, set_is_loading] = useState<boolean>(mode === "edit");

  // 구분 옵션 조회 (GET /api/admin/board-categories/form)
  const { data: formOptions } = useQuery({
    queryKey: ["categoryFormOptions"],
    queryFn: getCategoryFormOptions,
    retry: false,
    staleTime: Infinity,
  });
  const division_options: CategoryDivision[] =
    (formOptions?.divisions as CategoryDivision[] | undefined) ?? DEFAULT_DIVISION_OPTIONS;

  // 카테고리 등록 mutation
  const create_mutation = useMutation({
    mutationFn: () => createCategory({ division, categoryName: category_name.trim() }),
    onSuccess: () => {
      // API 성공 시에도 localStorage에 반영 (목록 페이지가 localStorage 기준)
      add_category(division, category_name.trim());
      set_show_toast(true);
    },
    onError: () => {
      // 백엔드 미구현 시 mock fallback
      add_category(division, category_name.trim());
      set_show_toast(true);
    },
  });

  // 카테고리 수정 mutation
  const update_mutation = useMutation({
    mutationFn: () =>
      updateCategoryApi(Number(category_id), {
        division,
        categoryName: category_name.trim(),
      }),
    onSuccess: () => {
      // API 성공 시에도 localStorage에 반영 (목록 페이지가 localStorage 기준)
      if (category_id) update_category(category_id, division, category_name.trim());
      set_show_toast(true);
    },
    onError: () => {
      // 백엔드 미구현 시 mock fallback
      if (category_id) update_category(category_id, division, category_name.trim());
      set_show_toast(true);
    },
  });

  // 수정 모드: 기존 카테고리 데이터 로드
  useEffect(() => {
    if (mode !== "edit" || !category_id) {
      set_is_loading(false);
      return;
    }

    // TODO: 실제 API 호출로 변경
    const category: CategoryItem | undefined = categories_data.find(
      (item) => item.id === category_id
    );

    if (category) {
      set_division(category.division);
      set_category_name(category.category_name);
    }

    set_is_loading(false);
  }, [category_id, mode]);

  // 카테고리명 유효성 검사 (길이 2~10자 + 같은 구분 내 중복 검증)
  const validate_category_name = (): boolean => {
    set_error_message("");

    const trimmed_name = category_name.trim();
    if (trimmed_name.length < 2 || trimmed_name.length > 10) {
      set_error_message("카테고리명은 2~10자 이내로 입력해주세요.");
      return false;
    }

    const duplicate_category = categories_data.find(
      (item) =>
        item.division === division &&
        item.category_name === trimmed_name &&
        (mode !== "edit" || item.id !== category_id)
    );

    if (duplicate_category) {
      set_error_message("이미 사용 중인 카테고리명입니다.");
      return false;
    }

    return true;
  };

  const handle_submit = () => {
    if (!validate_category_name()) return;

    if (mode === "create") {
      create_mutation.mutate();
    } else {
      update_mutation.mutate();
    }
  };

  // useCallback으로 감싸서 Toast 타이머 리셋 방지
  const handle_toast_close = useCallback(() => {
    set_show_toast(false);
    router.push(`/manager_${manager_type}/community/categories`);
  }, [router, manager_type]);

  const is_button_disabled = useMemo(() => {
    if (create_mutation.isPending || update_mutation.isPending) return true;
    if (mode === "edit") return false;
    if (!category_name.trim() || category_name.trim().length < 2) return true;
    return false;
  }, [mode, category_name, create_mutation.isPending, update_mutation.isPending]);

  const page_title = mode === "create" ? "카테고리 등록" : "카테고리 수정";
  const button_text = mode === "create" ? "등록" : "저장";
  const form_aria_label = mode === "create" ? "카테고리 등록 폼" : "카테고리 수정 폼";
  const button_aria_label = mode === "create" ? "카테고리 등록" : "카테고리 저장";

  if (is_loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        <Toast
          message={mode === "create" ? "등록되었습니다." : "저장되었습니다."}
          isOpen={show_toast}
          onClose={handle_toast_close}
          duration={2000}
        />

        <h1 className={styles.page_title}>{page_title}</h1>

        <div className={styles.form_card} aria-label={form_aria_label}>
          {/* 구분 필드 */}
          <div className={styles.form_field}>
            <label className={styles.input_label} htmlFor="division">
              구분
            </label>
            <CustomDropdown
              value={division}
              options={division_options}
              onChange={(value) => {
                set_division(value as CategoryDivision);
                set_error_message("");
              }}
              placeholder="구분을 선택하세요"
            />
          </div>

          {/* 카테고리명 필드 */}
          <div className={styles.form_field}>
            <label className={styles.input_label} htmlFor="category_name">
              카테고리
            </label>
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
            {button_text}
          </button>
        </div>
      </div>
    </div>
  );
}
