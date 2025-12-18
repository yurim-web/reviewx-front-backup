/**
 * 차단된 회원 페이지 컴포넌트
 *
 * 차단된 회원이 로그인했을 때 서비스 이용 제한 안내를 표시하는 페이지입니다.
 *
 * 사용 페이지:
 * - /user/blocked (사용자 차단 페이지)
 * - /partner/blocked (파트너 차단 페이지)
 */

"use client";

import { useRouter } from "next/navigation";
import styles from "@/styles/common/blocked_user.module.css";

/**
 * 차단된 회원 페이지 컴포넌트
 */
export default function BlockedUserPage() {
  const router = useRouter();

  /**
   * 회원 탈퇴 버튼 클릭 핸들러
   * 실제 구현 시에는 API를 호출하여 회원 탈퇴를 처리해야 합니다.
   */
  const handleWithdrawal = async () => {
    // ⚠️ 실제 API 연결 시 사용할 코드
    // try {
    //   const response = await withdrawalAPI();
    //   if (response.success) {
    //     router.push("/user/login");
    //   } else {
    //     alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
    //   }
    // } catch (error) {
    //   console.error("회원 탈퇴 오류:", error);
    //   alert("회원 탈퇴 중 오류가 발생했습니다.");
    // }

    // 🧪 테스트용 코드 - 실제 API 연결 시 전체 삭제 필요
    console.log("회원 탈퇴 요청");
    const confirmed = window.confirm("정말 회원 탈퇴를 하시겠습니까?");
    if (confirmed) {
      router.push("/user/login");
    }
  };

  return (
    <div className={styles.blocked_user_page_container}>
      <main className={styles.blocked_user_main}>
        <section className={styles.content_section}>
          <div className={styles.logo_container}>
            <h1 className={styles.logo_text}>VX.</h1>
          </div>
          <p className={styles.message_text}>서비스 이용이 제한되었습니다.</p>
          <button
            type="button"
            className={styles.withdrawal_button}
            onClick={handleWithdrawal}
            aria-label="회원 탈퇴"
          >
            회원 탈퇴
          </button>
        </section>
      </main>
    </div>
  );
}
