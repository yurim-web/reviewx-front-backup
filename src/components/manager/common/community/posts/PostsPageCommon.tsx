/* ========================================
   관리자 게시글 목록 페이지 (공통 컴포넌트)
   ======================================== */

/**
 * 관리자 게시글 목록 페이지 (공통 컴포넌트)
 *
 * 목적: GA/SA 관리자 게시글 목록 페이지에서 공통으로 사용하는 페이지 컴포넌트입니다.
 *       manager_type에 따라 URL 경로를 동적으로 결정합니다.
 *
 * 두 가지 사용 위치:
 * - /manager_ga/community/posts (GA 관리자 게시글 목록 페이지)
 * - /manager_sa/community/posts (SA 관리자 게시글 목록 페이지)
 */

"use client";

import { useCallback, useState } from "react";
import { startOfMonth, endOfMonth, format } from "date-fns";
import styles from "@/styles/manager/common/manager_common_page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import PostFilterSection from "@/components/manager/common/community/posts/section/PostFilterSection";
import PostTable from "@/components/manager/common/community/posts/section/PostTable";
import type { PostDivision } from "@/data/manager_ga/common/filterOptions";
import type { PostTarget } from "@/data/manager_ga/community/postsData";
import type { DateRange } from "@/components/manager/ga/dashboard/section/DateRangePickerModal";
import { useAdminPosts, useDeleteBoard, useToggleBoardFix } from "@/hooks/manager/ga/useAdminPosts";
import {
  useSAAdminPosts,
  useSADeleteBoards,
  useSAPinBoard,
  useSAUnpinBoard,
} from "@/hooks/manager/sa/community/useSAAdminPosts";
import Loading from "@/app/loading";
import BaseModal from "@/components/common/modal/BaseModal";
import Toast from "@/components/common/toast/Toast";

// 관리자 타입 정의
export type ManagerType = "ga" | "sa";

interface PostsPageCommonProps {
  manager_type: ManagerType;
}

export default function PostsPageCommon({ manager_type }: PostsPageCommonProps) {
  // 검색어 상태
  const [search_query, set_search_query] = useState<string>("");

  // 구분 필터 상태
  const [selected_divisions, set_selected_divisions] = useState<PostDivision[]>([]);

  // 대상 필터 상태
  const [selected_targets, set_selected_targets] = useState<PostTarget[]>([]);

  // 날짜 범위 필터 상태 (기본: 이번 달)
  const [selected_date_range, set_selected_date_range] = useState<DateRange | undefined>(() => {
    const today = new Date();
    return {
      from: startOfMonth(today),
      to: endOfMonth(today),
    };
  });

  // 선택된 게시글 ID 목록 (boardId 문자열)
  const [selected_post_ids, set_selected_post_ids] = useState<string[]>([]);

  // 삭제 확인 모달
  const [is_delete_modal_open, set_is_delete_modal_open] = useState(false);

  // 토스트
  const [toast, set_toast] = useState<{ is_open: boolean; message: string }>({
    is_open: false,
    message: "",
  });

  const handle_toast_close = useCallback(() => {
    set_toast((prev) => (prev.is_open ? { is_open: false, message: "" } : prev));
  }, []);

  // API 파라미터 구성 (단일 division/target만 서버 필터, 복수는 클라이언트 필터)
  const api_params = {
    page: 1,
    size: 100,
    ...(selected_divisions.length === 1 ? { division: selected_divisions[0] } : {}),
    ...(selected_targets.length === 1 ? { target: selected_targets[0] } : {}),
    ...(search_query ? { keyword: search_query } : {}),
    ...(selected_date_range?.from
      ? { startDate: format(selected_date_range.from, "yyyy-MM-dd") }
      : {}),
    ...(selected_date_range?.to ? { endDate: format(selected_date_range.to, "yyyy-MM-dd") } : {}),
  };

  const is_sa = manager_type === "sa";

  // API 훅 (GA/SA 모두 호출 — React 규칙, 사용할 결과만 선택)
  const gaListResult = useAdminPosts(api_params);
  const saListResult = useSAAdminPosts(api_params);
  const { data: listResponse, isLoading } = is_sa ? saListResult : gaListResult;

  // GA 뮤테이션
  const gaDeleteBoard = useDeleteBoard();
  const gaToggleFix = useToggleBoardFix();

  // SA 뮤테이션
  const saDeleteBoards = useSADeleteBoards();
  const saPinBoard = useSAPinBoard();
  const saUnpinBoard = useSAUnpinBoard();

  // API 데이터 → 테이블 행 변환
  const boards = listResponse?.data?.boards || [];

  // 고정 토글 핸들러
  const handle_pin_selected_posts = async () => {
    if (selected_post_ids.length === 0) return;
    if (is_sa) {
      for (const id of selected_post_ids) {
        await saPinBoard.mutateAsync(Number(id));
      }
    } else {
      for (const id of selected_post_ids) {
        await gaToggleFix.mutateAsync({ boardId: Number(id), body: { isFixed: true } });
      }
    }
    set_toast({ is_open: true, message: "저장되었습니다." });
  };

  const handle_unpin_selected_posts = async () => {
    if (selected_post_ids.length === 0) return;
    if (is_sa) {
      for (const id of selected_post_ids) {
        await saUnpinBoard.mutateAsync(Number(id));
      }
    } else {
      for (const id of selected_post_ids) {
        await gaToggleFix.mutateAsync({ boardId: Number(id), body: { isFixed: false } });
      }
    }
    set_toast({ is_open: true, message: "저장되었습니다." });
  };

  // 삭제 핸들러
  const handle_delete_click = () => {
    if (selected_post_ids.length === 0) return;
    set_is_delete_modal_open(true);
  };

  const handle_delete_confirm = async () => {
    if (is_sa) {
      // SA: 복수 삭제 (단일 API 호출)
      await saDeleteBoards.mutateAsync(selected_post_ids.map(Number));
    } else {
      // GA: 개별 삭제
      for (const id of selected_post_ids) {
        await gaDeleteBoard.mutateAsync(Number(id));
      }
    }
    set_selected_post_ids([]);
    set_is_delete_modal_open(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        <ManagerPageTitle title="게시글 목록" />

        <PostFilterSection
          search_query={search_query}
          on_search_change={set_search_query}
          selected_divisions={selected_divisions}
          on_divisions_change={set_selected_divisions}
          selected_targets={selected_targets}
          on_targets_change={set_selected_targets}
          selected_date_range={selected_date_range}
          on_date_range_change={set_selected_date_range}
          on_pin_selected={handle_pin_selected_posts}
          on_unpin_selected={handle_unpin_selected_posts}
          on_delete_selected={handle_delete_click}
          manager_type={manager_type}
        />

        <PostTable
          boards={boards}
          selected_divisions={selected_divisions}
          selected_targets={selected_targets}
          selected_post_ids={selected_post_ids}
          on_selected_post_ids_change={set_selected_post_ids}
          manager_type={manager_type}
        />
      </div>

      <BaseModal
        is_open={is_delete_modal_open}
        on_close={() => set_is_delete_modal_open(false)}
        message="선택한 내역을 삭제하시겠습니까?"
        buttons={["취소", "확인"]}
        on_cancel={() => set_is_delete_modal_open(false)}
        on_confirm={handle_delete_confirm}
      />

      <Toast
        message={toast.message}
        isOpen={toast.is_open}
        onClose={handle_toast_close}
        positionVariant="lower"
        duration={1000}
      />
    </div>
  );
}
