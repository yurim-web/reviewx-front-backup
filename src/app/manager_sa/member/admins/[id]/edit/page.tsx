/* ========================================
   SA 관리자 관리자 수정 페이지
   ======================================== */

/**
 * AdminEditPage
 *
 * 목적: SA 관리자가 기존 관리자 정보를 수정할 수 있는 페이지입니다.
 *
 * 사용 페이지:
 * - /manager_sa/member/admins/[id]/edit
 */

"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import styles from "@/styles/manager_sa/member/admins/admin_create_page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import AdminForm from "@/components/manager/sa/member/admins/section/AdminForm";
import { useAdminMembers } from "@/hooks/manager/ga/useAdminMembers";
import type { AdminMemberApiItem } from "@/types/api/admin";
import type { AdminItem } from "@/data/manager_sa/member/admins";

// API 데이터를 AdminItem으로 변환
function toAdminItem(item: AdminMemberApiItem): AdminItem {
  return {
    id: item.id,
    number: item.number,
    name: item.name,
    phone: item.phone,
    report_count: item.report_count,
    block_count: item.block_count,
    last_access_date: item.last_access_date,
    join_date: item.join_date,
    status: item.status as AdminItem["status"],
  };
}

export default function AdminEditPage() {
  const params = useParams();
  const admin_id = params?.id as string;

  // API 훅으로 관리자 목록 조회
  const { adminMembers, isLoading } = useAdminMembers();

  // API 데이터에서 해당 관리자 찾기
  const admin_data = useMemo(() => {
    const found = adminMembers.find((admin) => admin.id === admin_id);
    return found ? toAdminItem(found) : undefined;
  }, [adminMembers, admin_id]);

  if (isLoading) {
    return <Loading />;
  }

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
        <ManagerPageTitle title="관리자 수정" />
        <AdminForm mode="edit" initial_data={admin_data} admin_id={admin_id} />
      </div>
    </div>
  );
}
