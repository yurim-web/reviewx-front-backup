/* ========================================
   📋 리뷰어 목록 테이블 컴포넌트 (공통)
   ======================================== */

/**
 * 리뷰어 목록 테이블 컴포넌트 (공통)
 *
 * 목적: 리뷰어 목록 페이지의 리뷰어 목록을 테이블 형태로 표시합니다.
 *
 * 📍 사용 위치:
 * - /manager_ga/member/reviewers (GA 관리자 리뷰어 목록 페이지)
 * - /manager_sa/member/reviewers (SA 관리자 리뷰어 목록 페이지)
 *
 * 주요 기능:
 * - 리뷰어 목록을 테이블로 표시합니다
 * - 검색어 필터를 적용합니다
 * - 체크박스로 리뷰어를 선택할 수 있습니다
 * - 채널 아이콘을 표시합니다
 * - 리뷰어 유형 태그를 표시합니다
 * - 리뷰어 상태를 표시합니다
 *
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTableSort } from "@/hooks/table/useTableSort";
import type { SortColumnConfig } from "@/utils/table/sort";
import SortableTableHeader from "@/components/manager/common/table/SortableTableHeader";
import type { TableColumn } from "@/components/manager/common/table/CommonTable";
import {
  reviewer_list,
  type ReviewerItem,
  type Channel,
  type ReviewerType,
  type ReviewerStatus,
} from "@/data/manager_ga/member/reviewers";
import type { ReviewerStatusType } from "@/data/manager_ga/common/filterOptions";
import type { ReviewerGrade } from "@/components/manager/common/member/reviewers/filter/GradeFilterModal";
import MemberStatusTag from "@/components/manager/common/tags/MemberStatusTag";
import ReviewerTypeTag from "@/components/manager/common/tags/ReviewerTypeTag";

interface ReviewerTableProps {
  // 검색어 상태를 props로 받습니다
  search_query: string;
  // 필터 상태
  selected_channels?: Channel[];
  selected_grades?: ReviewerGrade[];
  selected_types?: ReviewerStatusType[];
  selected_statuses?: ReviewerStatus[];
  // CSS 모듈 스타일 객체
  styles: Record<string, string> & {
    table_container: string;
    table_header: string;
    table_body: string;
    table_row: string;
    table_cell_checkbox: string;
    table_cell_number: string;
    table_cell_name: string;
    table_cell_channel: string;
    table_cell_type: string;
    table_cell_last_access: string;
    table_cell_join_date: string;
    table_cell_campaign_participated: string;
    table_cell_campaign_completed: string;
    table_cell_current_points: string;
    table_cell_withdrawn_points: string;
    table_cell_status_type: string;
    table_cell_status: string;
    checkbox: string;
    sort_icon: string;
    channel_icons: string;
    channel_icon_wrapper: string;
    channel_icon: string;
    type_tag: string;
    type_tag_supporter: string;
    type_tag_normal: string;
    type_tag_influencer: string;
    status_tag: string;
    status_tag_normal: string;
    status_tag_suspended: string;
    status_tag_permanent: string;
    empty_message: string;
  };
  // 상세 페이지 경로 (예: '/manager_ga/member/reviewers' 또는 '/manager_sa/member/reviewers')
  detail_path: string;
}

// 채널 아이콘 경로 매핑 (리뷰어에서 사용하는 채널만 포함)
const channel_icon_map: Partial<Record<Channel, string>> = {
  Blog: "/images/brand_logo/naverblog.svg",
  Clip: "/images/brand_logo/naverclip.svg",
  Instagram: "/images/brand_logo/insta.svg",
  Youtube: "/images/brand_logo/youtube.svg",
  Store: "/images/brand_logo/navershop.svg",
};

export default function ReviewerTable({
  search_query,
  selected_channels = [],
  selected_grades = [],
  selected_types = [],
  selected_statuses = [],
  styles: cssStyles,
  detail_path,
}: ReviewerTableProps) {
  // Next.js의 useRouter 훅을 사용하여 페이지 이동 기능 가져오기
  // useRouter: Next.js에서 제공하는 클라이언트 사이드 라우팅 훅입니다
  const router = useRouter();

  // 선택된 리뷰어 ID 목록 상태 관리
  const [selected_reviewer_ids, set_selected_reviewer_ids] = useState<string[]>(
    []
  );

  // 전체 선택/해제 상태 관리
  const [is_all_selected, set_is_all_selected] = useState(false);

  // 검색어 및 필터로 필터링된 리뷰어 목록
  const filtered_reviewers = reviewer_list.filter((reviewer) => {
    // 검색어 필터
    if (search_query) {
      const matches_search = reviewer.name
        .toLowerCase()
        .includes(search_query.toLowerCase());
      if (!matches_search) return false;
    }

    // 채널 필터
    if (selected_channels.length > 0) {
      const has_matching_channel = reviewer.channels.some((channel) =>
        selected_channels.includes(channel)
      );
      if (!has_matching_channel) return false;
    }

    // 등급 필터 (type 필드 사용)
    if (selected_grades.length > 0) {
      if (!selected_grades.includes(reviewer.type)) return false;
    }

    // 유형 필터 (status_type 필드 사용)
    if (selected_types.length > 0) {
      if (!selected_types.includes(reviewer.status_type)) return false;
    }

    // 상태 필터
    if (selected_statuses.length > 0) {
      if (!selected_statuses.includes(reviewer.status)) return false;
    }

    return true;
  });

  // 컬럼별 타입 설정
  const column_config: SortColumnConfig = {
    number: "numeric_string",
    name: "string",
    last_access_date: "date",
    join_date: "date",
    campaign_participated: "number",
    campaign_completed: "number",
    current_points: "number",
    withdrawn_points: "number",
    status: "string",
  };

  // 정렬 훅 사용
  const {
    sort_state,
    handle_sort,
    sorted_data: sorted_reviewers,
  } = useTableSort({
    data: filtered_reviewers,
    initial_column_key: "number",
    initial_direction: "asc",
    column_config,
  });

  // 개별 체크박스 토글 핸들러
  const handle_checkbox_toggle = (reviewer_id: string) => {
    set_selected_reviewer_ids((prev) => {
      if (prev.includes(reviewer_id)) {
        // 이미 선택된 경우 제거
        return prev.filter((id) => id !== reviewer_id);
      } else {
        // 선택되지 않은 경우 추가
        return [...prev, reviewer_id];
      }
    });
  };

  // 전체 선택/해제 핸들러
  const handle_select_all = () => {
    if (is_all_selected) {
      // 전체 해제
      set_selected_reviewer_ids([]);
      set_is_all_selected(false);
    } else {
      // 전체 선택
      set_selected_reviewer_ids(filtered_reviewers.map((r) => r.id));
      set_is_all_selected(true);
    }
  };

  // 숫자를 천 단위로 포맷팅하는 함수
  const format_number = (num: number): string => {
    return num.toLocaleString();
  };

  // 리뷰어 행 클릭 핸들러
  // 테이블 행을 클릭하면 해당 리뷰어의 디테일 페이지로 이동합니다
  const handle_row_click = (reviewer_id: string) => {
    // router.push: Next.js에서 제공하는 페이지 이동 함수입니다
    router.push(`${detail_path}/${reviewer_id}`);
  };

  // 테이블 컬럼 정의
  const columns: TableColumn[] = [
    {
      key: "number",
      label: "번호",
      sortable: true,
      className: cssStyles.table_cell_number,
    },
    {
      key: "name",
      label: "이름",
      sortable: true,
      className: cssStyles.table_cell_name,
    },
    {
      key: "channel",
      label: "채널",
      className: cssStyles.table_cell_channel,
    },
    {
      key: "type",
      label: "구분",
      className: cssStyles.table_cell_type,
    },
    {
      key: "last_access_date",
      label: "접속일",
      sortable: true,
      className: cssStyles.table_cell_last_access,
    },
    {
      key: "join_date",
      label: "가입일",
      sortable: true,
      className: cssStyles.table_cell_join_date,
    },
    {
      key: "campaign_participated",
      label: "캠페인 참여",
      sortable: true,
      className: cssStyles.table_cell_campaign_participated,
    },
    {
      key: "campaign_completed",
      label: "캠페인 완료",
      sortable: true,
      className: cssStyles.table_cell_campaign_completed,
    },
    {
      key: "current_points",
      label: "보유 포인트",
      sortable: true,
      className: cssStyles.table_cell_current_points,
    },
    {
      key: "withdrawn_points",
      label: "출금 포인트",
      sortable: true,
      className: cssStyles.table_cell_withdrawn_points,
    },
    {
      key: "status_type",
      label: "유형",
      className: cssStyles.table_cell_status_type,
    },
    {
      key: "status",
      label: "상태",
      sortable: false,
      className: cssStyles.table_cell_status,
    },
  ];

  // 커스텀 헤더 렌더링 (SortableTableHeader 공통 컴포넌트 사용)
  const render_custom_header = () => {
    return (
      <SortableTableHeader
        columns={columns}
        sort_state={sort_state}
        handle_sort={handle_sort}
        handle_select_all={handle_select_all}
        is_all_selected={is_all_selected}
        styles={cssStyles}
        use_header_row={false}
      />
    );
  };

  return (
    <div className={cssStyles.table_container}>
      {/* 테이블 헤더 */}
      {render_custom_header()}
      {/* 테이블 바디 */}
      <div className={cssStyles.table_body}>
        {sorted_reviewers.length === 0 ? (
          <div className={cssStyles.empty_message}>리뷰어가 없습니다.</div>
        ) : (
          sorted_reviewers.map((reviewer) => {
            const is_selected = selected_reviewer_ids.includes(reviewer.id);
            return (
              <div
                key={reviewer.id}
                className={cssStyles.table_row}
                onClick={() => handle_row_click(reviewer.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  // 키보드 접근성: Enter 키나 Space 키를 누르면 클릭과 동일하게 동작합니다
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handle_row_click(reviewer.id);
                  }
                }}
                aria-label={`${reviewer.name} 리뷰어 상세 정보 보기`}
              >
                {/* 체크박스 */}
                <div
                  className={cssStyles.table_cell_checkbox}
                  onClick={(e) => {
                    // 체크박스 클릭 시 행 클릭 이벤트가 발생하지 않도록 이벤트 전파를 막습니다
                    // stopPropagation: 이벤트 버블링을 방지하는 메서드입니다
                    e.stopPropagation();
                  }}
                >
                  <input
                    type="checkbox"
                    checked={is_selected}
                    onChange={() => handle_checkbox_toggle(reviewer.id)}
                    className={cssStyles.checkbox}
                  />
                </div>

                {/* 번호 */}
                <div className={cssStyles.table_cell_number}>
                  {reviewer.number}
                </div>

                {/* 이름 */}
                <div className={cssStyles.table_cell_name}>{reviewer.name}</div>

                {/* 채널 */}
                <div className={cssStyles.table_cell_channel}>
                  <div className={cssStyles.channel_icons}>
                    {reviewer.channels.map((channel, index) => (
                      <div
                        key={index}
                        className={cssStyles.channel_icon_wrapper}
                      >
                        <img
                          src={channel_icon_map[channel]}
                          alt={channel}
                          className={cssStyles.channel_icon}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 구분 (유형) */}
                <div className={cssStyles.table_cell_type}>
                  <ReviewerTypeTag type={reviewer.type} styles={cssStyles} />
                </div>

                {/* 접속일 */}
                <div className={cssStyles.table_cell_last_access}>
                  {reviewer.last_access_date}
                </div>

                {/* 가입일 */}
                <div className={cssStyles.table_cell_join_date}>
                  {reviewer.join_date}
                </div>

                {/* 캠페인 참여 */}
                <div className={cssStyles.table_cell_campaign_participated}>
                  {format_number(reviewer.campaign_participated)}회
                </div>

                {/* 캠페인 완료 */}
                <div className={cssStyles.table_cell_campaign_completed}>
                  {format_number(reviewer.campaign_completed)}회
                </div>

                {/* 보유 포인트 */}
                <div className={cssStyles.table_cell_current_points}>
                  {format_number(reviewer.current_points)}
                </div>

                {/* 출금 포인트 */}
                <div className={cssStyles.table_cell_withdrawn_points}>
                  {format_number(reviewer.withdrawn_points)}
                </div>

                {/* 유형 (상태 유형) */}
                <div className={cssStyles.table_cell_status_type}>
                  {reviewer.status_type}
                </div>

                {/* 상태 */}
                <div className={cssStyles.table_cell_status}>
                  <MemberStatusTag
                    status={
                      reviewer.status as "정상" | "일시 정지" | "영구 정지"
                    }
                    styles={cssStyles}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
