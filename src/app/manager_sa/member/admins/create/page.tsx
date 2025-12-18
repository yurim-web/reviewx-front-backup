/* ========================================
   👤 SA 관리자 관리자 등록 페이지
   ======================================== */

/**
 * SA 관리자 관리자 등록 페이지
 *
 * 목적: SA 관리자가 새로운 관리자를 등록할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /manager_sa/member/admins/create
 *
 * 주요 기능:
 * - 관리자 등록 폼 (아이디, 비밀번호, 비밀번호 확인, 이름, 휴대폰 번호)
 * - 등록 버튼
 *
 * 컴포넌트 구조:
 * - ManagerPageTitle: 페이지 제목
 * - AdminRegisterForm: 관리자 등록 폼
 *
 * @returns 관리자 등록 페이지 JSX
 */

"use client";

import styles from "@/styles/manager_sa/member/admins/admin_create_page.module.css";
import ManagerPageTitle from "@/components/manager/common/fragments/ManagerPageTitle";
import AdminForm from "@/components/manager/sa/member/admins/section/AdminForm";

export default function AdminCreatePage() {
  return (
    <div className={styles.container}>
      <div className={styles.main_content}>
        {/* 페이지 제목 */}
        <ManagerPageTitle title="관리자 등록" />

        {/* 관리자 등록 폼 (통합 컴포넌트 사용) */}
        <AdminForm mode="create" />
      </div>
    </div>
  );
}
