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
 *
 * 백엔드 스펙:
 * - 등록: POST /api/admin/board-categories { division, categoryName }
 * - 수정: PUT /api/admin/board-categories/{categoryId} { categoryName } (구분 변경 불가)
 * - 폼 옵션: GET /api/admin/board-categories/form → divisions: [{ value, label }]
 */

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import styles from "@/styles/manager/common/community/categories/category_create_page.module.css";
import { CustomDropdown } from "@/components/partner/campaign_create_form/common/selectors/CustomDropdown";
import ErrorText from "@/components/common/error_text/ErrorText";
import Toast from "@/components/common/toast/Toast";
import {
  type CategoryDivision,
  type DivisionOption,
  DIVISION_LABEL_MAP,
} from "@/lib/api/categories";
import {
  useCategoryDetail,
  useCategoryFormOptions,
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/manager/ga/useAdminCategories";
import {
  useSACategoryDetail,
  useSACategoryFormOptions,
  useSACreateCategory,
  useSAUpdateCategory,
} from "@/hooks/manager/sa/community/useSAAdminCategories";

interface CategoryFormProps {
  mode: "create" | "edit";
  manager_type: "ga" | "sa";
  category_id?: string;
}

export default function CategoryForm({ mode, manager_type, category_id }: CategoryFormProps) {
  const router = useRouter();

  const is_sa = manager_type === "sa";

  const [division, set_division] = useState<CategoryDivision>("NOTICE");
  const [category_name, set_category_name] = useState<string>("");
  const [error_message, set_error_message] = useState<string>("");
  const [show_toast, set_show_toast] = useState<boolean>(false);

  // 구분 옵션 조회 — GA/SA 훅 모두 무조건 호출 (React hooks 규칙)
  const gaFormOptions = useCategoryFormOptions();
  const saFormOptions = useSACategoryFormOptions();
  const formOptionsResponse = is_sa ? saFormOptions.data : gaFormOptions.data;

  const defaultDivisions: DivisionOption[] = is_sa
    ? [
        { value: "NOTICE", label: "공지사항" },
        { value: "FAQ", label: "자주 묻는 질문" },
        { value: "EVENT", label: "이벤트" },
      ]
    : [
        { value: "NOTICE", label: "공지사항" },
        { value: "QUESTIONS", label: "자주 묻는 질문" },
      ];
  const divisionOptions: DivisionOption[] =
    formOptionsResponse?.data?.divisions ?? defaultDivisions;

  // 수정 모드: API로 카테고리 상세 조회 — GA/SA 훅 모두 무조건 호출
  const numericCategoryId = category_id ? Number(category_id) : 0;
  const gaDetail = useCategoryDetail(mode === "edit" && !is_sa ? numericCategoryId : 0);
  const saDetail = useSACategoryDetail(mode === "edit" && is_sa ? numericCategoryId : 0);
  const detailResponse = is_sa ? saDetail.data : gaDetail.data;
  const isDetailLoading = is_sa ? saDetail.isLoading : gaDetail.isLoading;

  // 수정 모드: 상세 데이터 로드 완료 시 폼에 반영
  useEffect(() => {
    if (mode === "edit" && detailResponse?.data) {
      set_division(detailResponse.data.division);
      set_category_name(detailResponse.data.categoryName);
    }
  }, [mode, detailResponse]);

  // 카테고리 등록 mutation — GA/SA 모두 호출
  const gaCreateMutation = useCreateCategory();
  const saCreateMutation = useSACreateCategory();
  const createMutation = is_sa ? saCreateMutation : gaCreateMutation;

  // 카테고리 수정 mutation — GA/SA 모두 호출
  const gaUpdateMutation = useUpdateCategory();
  const saUpdateMutation = useSAUpdateCategory();

  // 카테고리명 유효성 검사 (길이 2~10자)
  const validate_category_name = (): boolean => {
    set_error_message("");

    const trimmed_name = category_name.trim();
    if (trimmed_name.length < 2 || trimmed_name.length > 10) {
      set_error_message("카테고리명은 2~10자 이내로 입력해주세요.");
      return false;
    }

    return true;
  };

  /** 에러 응답에서 메시지 추출 */
  const handleApiError = (error: unknown) => {
    const response = (
      error as {
        response?: { status?: number; data?: { error?: { code?: string; message?: string } } };
      }
    )?.response;
    if (response?.status === 409 && response?.data?.error?.code === "DUPLICATE_CATEGORY_NAME") {
      set_error_message("이미 사용 중인 카테고리명입니다.");
    } else if (response?.status === 400) {
      set_error_message(response?.data?.error?.message || "입력값을 확인해주세요.");
    } else {
      set_error_message("오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const handle_submit = () => {
    if (!validate_category_name()) return;

    if (mode === "create") {
      if (is_sa) {
        saCreateMutation.mutate(
          { division: division as "NOTICE" | "FAQ" | "EVENT", categoryName: category_name.trim() },
          {
            onSuccess: () => set_show_toast(true),
            onError: handleApiError,
          }
        );
      } else {
        gaCreateMutation.mutate(
          { division, categoryName: category_name.trim() },
          {
            onSuccess: () => set_show_toast(true),
            onError: handleApiError,
          }
        );
      }
    } else if (is_sa) {
      // SA: PATCH — division + categoryName 모두 전송
      saUpdateMutation.mutate(
        {
          categoryId: numericCategoryId,
          body: {
            division: division as "NOTICE" | "FAQ" | "EVENT",
            categoryName: category_name.trim(),
          },
        },
        {
          onSuccess: () => set_show_toast(true),
          onError: handleApiError,
        }
      );
    } else {
      // GA: PUT — categoryName만 전송
      gaUpdateMutation.mutate(
        { categoryId: numericCategoryId, body: { categoryName: category_name.trim() } },
        {
          onSuccess: () => set_show_toast(true),
          onError: handleApiError,
        }
      );
    }
  };

  const handle_toast_close = useCallback(() => {
    set_show_toast(false);
    router.push(`/manager_${manager_type}/community/categories`);
  }, [router, manager_type]);

  const updateMutation = is_sa ? saUpdateMutation : gaUpdateMutation;

  const is_button_disabled = useMemo(() => {
    if (createMutation.isPending || updateMutation.isPending) return true;
    if (mode === "edit") return false;
    if (!category_name.trim() || category_name.trim().length < 2) return true;
    return false;
  }, [mode, category_name, createMutation.isPending, updateMutation.isPending]);

  const page_title = mode === "create" ? "카테고리 등록" : "카테고리 수정";
  const button_text = mode === "create" ? "등록" : "저장";
  const form_aria_label = mode === "create" ? "카테고리 등록 폼" : "카테고리 수정 폼";
  const button_aria_label = mode === "create" ? "카테고리 등록" : "카테고리 저장";

  // 수정 모드 로딩
  if (mode === "edit" && isDetailLoading) {
    return <Loading />;
  }

  // 드롭다운 옵션: value → label 형태로 변환
  const dropdownOptions = divisionOptions.map((opt) => opt.label);
  const selectedDivisionLabel = DIVISION_LABEL_MAP[division] || division;

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
            {mode === "edit" && !is_sa ? (
              // GA 수정 모드: 구분 변경 불가 (읽기 전용)
              <input
                type="text"
                className={styles.input_box}
                value={selectedDivisionLabel}
                readOnly
                disabled
                style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
              />
            ) : (
              <CustomDropdown
                value={selectedDivisionLabel}
                options={dropdownOptions}
                onChange={(label) => {
                  // label → value 역변환
                  const found = divisionOptions.find((opt) => opt.label === label);
                  if (found) {
                    set_division(found.value);
                    set_error_message("");
                  }
                }}
                placeholder="구분을 선택하세요"
              />
            )}
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
