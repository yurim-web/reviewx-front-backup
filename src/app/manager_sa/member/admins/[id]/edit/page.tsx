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

import { useParams } from "next/navigation";
import styles from "@/styles/manager_sa/member/admins/admin_create_page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import AdminForm from "@/components/manager/sa/member/admins/section/AdminForm";
import { admin_list, type AdminItem } from "@/data/manager_sa/member/admins";

export default function AdminEditPage() {
  // useParams: URL 파라미터에서 동적 경로 값을 가져오는 훅입니다
  // 예: /manager_sa/member/admins/123/edit → params.id = "123"
  const params = useParams();
  const admin_id = params?.id as string;

  // 관리자 데이터 찾기
  // find 메서드: 배열에서 조건에 맞는 첫 번째 요소를 반환합니다
  const admin_data: AdminItem | undefined = admin_list.find(
    (admin) => admin.id === admin_id
  );

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
