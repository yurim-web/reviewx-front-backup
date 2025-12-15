/* ========================================
   🔍 관리자 필터 섹션 컴포넌트
   ======================================== */

/**
 * 관리자 필터 섹션 컴포넌트
 *
 * 목적: 관리자 목록을 필터링하기 위한 필터 버튼들을 표시하는 섹션입니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/admins (관리자 목록 페이지)
 *
 * 주요 기능:
 * - 채널 필터
 * - 등급 필터
 * - 유형 필터
 * - 상태 필터
 * - 검색어 필터
 * - 정렬 필터 (최신순)
 * - 등록 버튼
 * - 삭제 버튼
 *
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/manager_sa/member/admins/admin_filter_section.module.css";
import BaseFilterSection, {
  type FilterTag,
} from "@/components/manager/ga/common/filter/BaseFilterSection";
import StatusFilterModal from "../filter/StatusFilterModal";
import type { AdminStatus } from "@/data/manager_sa/member/admins";

interface AdminFilterSectionProps {
  search_query: string;
  on_search_change: (query: string) => void;
  // 필터 상태
  selected_statuses?: AdminStatus[];
  on_statuses_change?: (statuses: AdminStatus[]) => void;
}

export default function AdminFilterSection({
  search_query,
  on_search_change,
  selected_statuses = [],
  on_statuses_change,
}: AdminFilterSectionProps) {
  // Next.js의 useRouter 훅을 사용하여 페이지 이동 기능 가져오기
  const router = useRouter();

  // 필터 모달 열림/닫힘 상태 관리
  const [is_status_modal_open, set_is_status_modal_open] = useState(false);

  // 상태 필터 핸들러
  const handle_status_apply = (statuses: AdminStatus[]) => {
    on_statuses_change?.(statuses);
  };

  // 활성 필터 태그 목록 생성 (상태 필터만)
  const active_filter_tags: FilterTag<string>[] = [
    ...selected_statuses.map((status) => ({ value: status, label: status })),
  ];

  // 필터 태그 제거 핸들러
  const handle_filter_tag_remove = (value: string) => {
    on_statuses_change?.(
      selected_statuses.filter((s) => s !== (value as AdminStatus))
    );
  };

  // 등록 버튼 핸들러
  // Next.js의 useRouter를 사용하여 관리자 등록 페이지로 이동
  const handle_register = () => {
    // 관리자 등록 페이지로 이동
    router.push("/manager_sa/member/admins/create");
  };

  // 삭제 버튼 핸들러
  const handle_delete = () => {
    // TODO: 관리자 삭제 기능 구현
  };

  // 차단 버튼 핸들러
  const handle_block = () => {
    // TODO: 관리자 차단 기능 구현
  };

  // 다운로드 버튼 핸들러
  const handle_download = () => {
    // TODO: 관리자 목록 다운로드 기능 구현
  };

  return (
    <div>
      {/* BaseFilterSection 공통 컴포넌트 사용 */}
      <BaseFilterSection<string>
        search_query={search_query}
        on_search_change={on_search_change}
        // 필터 모달 버튼 (상태 필터만)
        filter_modal_button={
          <div
            className={styles.filter_item}
            onClick={() => set_is_status_modal_open(true)}
          >
            <div
              className={`${styles.checkbox_icon} ${
                selected_statuses.length > 0 ? styles.checkbox_icon_checked : ""
              }`}
            ></div>
            <span className={styles.filter_text}>상태</span>
            <img
              src="/images/icons/dropdown_arrow.svg"
              alt="드롭다운"
              className={styles.dropdown_arrow}
            />
          </div>
        }
        // 검색 필터 뒤에 올 버튼 (관리자 목록 다운로드)
        search_after_buttons={
          <div className={styles.filter_item} onClick={handle_download}>
            <img
              src="/images/excel_icon.png"
              alt="다운로드"
              className={styles.download_icon}
            />
            <span className={styles.filter_text}>관리자 목록 다운로드</span>
          </div>
        }
        // 오른쪽에 위치할 버튼들 (등록, 삭제, 차단)
        right_buttons={
          <>
            {/* 등록 버튼 */}
            <div className={styles.filter_item} onClick={handle_register}>
              <img
                src="/images/icons/sign_plus.svg"
                alt="등록"
                className={styles.action_icon}
              />
              <span className={styles.filter_text}>등록</span>
            </div>
            {/* 삭제 버튼 */}
            <div className={styles.filter_item} onClick={handle_delete}>
              <img
                src="/images/icons/sign_x.svg"
                alt="삭제"
                className={styles.action_icon}
              />
              <span className={styles.filter_text}>삭제</span>
            </div>
            {/* 차단 버튼 */}
            <div className={styles.filter_item} onClick={handle_block}>
              <img
                src="/images/icons/block_btn_icon.svg"
                alt="차단"
                className={styles.block_icon}
              />
              <span className={styles.filter_text}>차단</span>
            </div>
          </>
        }
        // 활성 필터 태그들
        active_filter_tags={active_filter_tags}
        on_filter_tag_remove={handle_filter_tag_remove}
      />

      {/* 상태 필터 모달 */}
      <StatusFilterModal
        is_open={is_status_modal_open}
        on_close={() => set_is_status_modal_open(false)}
        selected_statuses={selected_statuses}
        on_apply={handle_status_apply}
      />
    </div>
  );
}
