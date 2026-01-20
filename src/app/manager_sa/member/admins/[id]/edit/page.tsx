/* ========================================
   👤 SA 관리자 관리자 수정 페이지
   ======================================== */

/**
 * SA 관리자 관리자 수정 페이지
 *
 * 목적: SA 관리자가 기존 관리자 정보를 수정할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_sa/member/admins/[id]/edit
 *
 * 주요 기능:
 * - 관리자 수정 폼 (아이디 표시, 비밀번호 변경, 이름, 휴대폰 번호)
 * - 저장 버튼
 *
 * 컴포넌트 구조:
 * - ManagerPageTitle: 페이지 제목
 * - AdminEditForm: 관리자 수정 폼
 *
 * @returns 관리자 수정 페이지 JSX
 */

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "@/styles/manager_sa/member/admins/admin_create_page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import AdminForm from "@/components/manager/sa/member/admins/section/AdminForm";
import {
  get_admin_list_from_storage,
  type AdminItem,
} from "@/data/manager_sa/member/admins";

export default function AdminEditPage() {
  // useParams: URL 파라미터에서 동적 경로 값을 가져오는 훅입니다
  // 예: /manager_sa/member/admins/123/edit → params.id = "123"
  const params = useParams();
  const admin_id = params?.id as string;

  // 관리자 데이터 상태 관리
  // useState: React Hook으로 컴포넌트의 상태를 관리합니다
  const [admin_data, set_admin_data] = useState<AdminItem | undefined>(
    undefined
  );
  const [is_loading, set_is_loading] = useState(true);

  // localStorage에서 관리자 데이터 가져오기
  // useEffect: 컴포넌트가 렌더링된 후 실행되는 훅입니다
  // 의존성 배열 [admin_id]가 변경될 때마다 실행됩니다
  useEffect(() => {
    // Next.js SSR 환경 체크
    if (typeof window === "undefined") {
      set_is_loading(false);
      return;
    }

    // localStorage에서 관리자 목록 가져오기
    const stored_admin_list = get_admin_list_from_storage();

    // 관리자 데이터 찾기
    // find 메서드: 배열에서 조건에 맞는 첫 번째 요소를 반환합니다
    const found_admin = stored_admin_list.find(
      (admin) => admin.id === admin_id
    );

    set_admin_data(found_admin);
    set_is_loading(false);
  }, [admin_id]);

  // 로딩 중일 때 표시할 내용
  if (is_loading) {
    return (
      <div className={styles.container}>
        <div className={styles.main_content}>
          <ManagerPageTitle title="관리자 수정" />
          <div>로딩 중...</div>
        </div>
      </div>
    );
  }

  // 관리자 데이터가 없을 때 표시할 내용
  if (!admin_data) {
    return (
      <div className={styles.container}>
        <div className={styles.main_content}>
          <ManagerPageTitle title="관리자 수정" />
          <div>관리자를 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="관리자 수정" />

        {/* 관리자 수정 폼 (통합 컴포넌트 사용) */}
        <AdminForm mode="edit" initial_data={admin_data} admin_id={admin_id} />
      </div>
    </div>
  );
}
