/* ========================================
   💸 포인트 출금 신청 페이지
   ======================================== */

/**
 * 포인트 출금 신청 페이지
 *
 * 목적: 사용자가 보유한 포인트를 출금 신청할 수 있는 페이지입니다.
 *
 * 페이지 경로:
 * - /user/point/withdrawal_request
 *
 * 사용 파일:
 * - 컴포넌트: SubHeader
 * - CSS: withdrawal_request.module.css
 *
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import BaseModal from "@/components/common/modal/BaseModal";
import AmountInput from "@/components/point/AmountInput";
import AvailablePointsDisplay from "@/components/point/AvailablePointsDisplay";
import ReadOnlyFormField from "@/components/point/ReadOnlyFormField";
import { parseFormattedAmount } from "@/utils/formatting/amount";
import { validateAmount } from "@/utils/validation/amount";
import { useAuth } from "@/hooks/useAuth";
import styles from "../../../../styles/user/point/withdrawal_request.module.css";

/**
 * 포인트 출금 신청 페이지
 */
export default function WithdrawalRequestPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  // 출금 신청 완료 모달 상태
  const [isCompleteModalOpen, setIsCompleteModalOpen] =
    useState<boolean>(false);
  // 계좌 정보 없음 경고 모달 상태
  const [isAccountWarningModalOpen, setIsAccountWarningModalOpen] =
    useState<boolean>(false);
  // 출금 신청 불가 모달 상태 (7일 미경과)
  const [isWithdrawalBlockedModalOpen, setIsWithdrawalBlockedModalOpen] =
    useState<boolean>(false);

  // 사용자 정보 (user_accounts에서 로드)
  const [userInfo, setUserInfo] = useState({
    name: "",
    bank: "",
    accountNumber: "",
    residentNumber: "",
    availablePoints: 0,
    lastWithdrawalDate: null as Date | null,
  });

  // user_accounts에서 사용자 정보 로드
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      try {
        const storedAccounts = localStorage.getItem("user_accounts");
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts);
          const userAccount = accounts.find(
            (a: any) => a.id === user.id || a.email === user.email,
          );
          if (userAccount) {
            setUserInfo({
              name: userAccount.account_holder || userAccount.name || "",
              bank: userAccount.bank || "",
              accountNumber: userAccount.account_number || "",
              residentNumber:
                userAccount.ssn_front && userAccount.ssn_back
                  ? `${userAccount.ssn_front}-${userAccount.ssn_back}`
                  : "",
              availablePoints: userAccount.available_points || 0,
              lastWithdrawalDate: userAccount.last_withdrawal_date
                ? new Date(userAccount.last_withdrawal_date)
                : null,
            });
            console.log("✅ [출금 신청] 사용자 정보 로드:", userAccount);
          }
        }
      } catch (error) {
        console.error("❌ [출금 신청] 사용자 정보 로드 실패:", error);
      }
    }
  }, [user]);

  // 최소/최대 금액 상수
  const MIN_AMOUNT = 10000;
  const MAX_AMOUNT = 500000;

  // 출금 예정 금액 계산 (3.3% 공제)
  const calculateNetAmount = (amount: number): number => {
    return Math.floor(amount * 0.967);
  };

  const amount = withdrawalAmount
    ? Number(withdrawalAmount.replace(/,/g, ""))
    : 0;
  const netAmount = amount > 0 ? calculateNetAmount(amount) : 0;

  /**
   * 마지막 출금일로부터 경과일 계산
   *
   * 기능:
   * - 마지막 출금일이 없으면 null 반환 (출금 이력 없음)
   * - 마지막 출금일로부터 오늘까지 경과한 일수 계산
   *
   * 반환값:
   * - null: 출금 이력이 없음
   * - number: 경과일 수 (0 이상)
   *
   */
  const getDaysSinceLastWithdrawal = (): number | null => {
    if (!userInfo.lastWithdrawalDate) {
      return null; // 출금 이력이 없음
    }

    const today = new Date();
    const lastDate = new Date(userInfo.lastWithdrawalDate);

    // 시간을 00:00:00으로 설정하여 날짜만 비교
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);

    // 경과일 계산 (밀리초 차이를 일수로 변환)
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  /**
   * 출금 신청 가능 여부 확인 (7일 경과 여부)
   *
   * 기능:
   * - 마지막 출금일로부터 7일이 지났는지 확인
   * - 출금 이력이 없으면 출금 가능
   *
   * 반환값:
   * - true: 출금 신청 가능 (7일 경과 또는 출금 이력 없음)
   * - false: 출금 신청 불가 (7일 미경과)
   *
   */
  const canWithdraw = (): boolean => {
    const daysSince = getDaysSinceLastWithdrawal();

    // 출금 이력이 없으면 출금 가능
    if (daysSince === null) {
      return true;
    }

    // 7일 이상 경과했으면 출금 가능
    return daysSince >= 7;
  };

  /**
   * 출금 신청 버튼 활성화 조건 검사
   *
   * 버튼이 활성화되려면 다음 조건을 모두 만족해야 합니다:
   * 1. 출금 신청 금액 ≥ 10,000원
   * 2. 출금 신청 금액 ≤ 500,000원
   * 3. 출금 신청 금액 ≤ 보유 포인트
   *
   */
  const isButtonEnabled = () => {
    // 출금 금액이 0이면 비활성화
    if (amount === 0) return false;

    // 조건 1: 출금 신청 금액 ≥ 10,000원
    if (amount < MIN_AMOUNT) return false;

    // 조건 2: 출금 신청 금액 ≤ 500,000원
    if (amount > MAX_AMOUNT) return false;

    // 조건 3: 출금 신청 금액 ≤ 보유 포인트
    if (amount > userInfo.availablePoints) return false;

    // 모든 조건을 만족하면 활성화
    return true;
  };

  /**
   * 계좌 정보 유효성 검사
   *
   * 기능:
   * - 예금주, 은행, 계좌번호, 주민등록번호가 모두 입력되어 있는지 확인
   *
   * 반환값:
   * - true: 계좌 정보가 모두 입력됨
   * - false: 계좌 정보가 하나라도 비어있음
   */
  const isAccountInfoValid = () => {
    return (
      userInfo.name.trim() !== "" &&
      userInfo.bank.trim() !== "" &&
      userInfo.accountNumber.trim() !== "" &&
      userInfo.residentNumber.trim() !== ""
    );
  };

  /**
   * 출금 신청 처리
   *
   * 기능:
   * - 버튼 활성화 상태 확인
   * - 계좌 정보 유효성 검사
   * - 7일 경과 여부 확인
   * - 계좌 정보가 없으면 경고 모달 표시
   * - 7일이 지나지 않았으면 출금 불가 모달 표시
   * - 모든 조건을 만족하면 출금 신청 진행 및 완료 모달 표시
   *
   */
  const handleSubmit = () => {
    if (!isButtonEnabled()) return;

    // 계좌 정보가 없으면 경고 모달 표시
    if (!isAccountInfoValid()) {
      setIsAccountWarningModalOpen(true);
      return;
    }

    // 7일이 지나지 않았으면 출금 불가 모달 표시
    if (!canWithdraw()) {
      setIsWithdrawalBlockedModalOpen(true);
      return;
    }

    // 출금 신청 처리
    try {
      if (typeof window !== "undefined" && user) {
        const now = new Date();
        const requestId = `withdrawal_${user.id}_${now.getTime()}`;

        // 1. user_accounts에 포인트 내역 추가
        const storedAccounts = localStorage.getItem("user_accounts");
        if (storedAccounts) {
          const accounts = JSON.parse(storedAccounts);
          const accountIndex = accounts.findIndex(
            (a: any) => a.id === user.id || a.email === user.email,
          );

          if (accountIndex !== -1) {
            const account = accounts[accountIndex];

            // 출금 신청 시에는 pending_points만 증가 (available_points는 그대로)
            // 관리자 승인 시에 available_points에서 차감됨
            account.pending_points = (account.pending_points || 0) + amount;

            // 포인트 내역에 출금 신청 기록 추가
            if (!account.point_history) {
              account.point_history = [];
            }

            account.point_history.unshift({
              id: requestId,
              type: "withdrawal_pending",
              amount: -amount,
              description: "출금 신청 대기중",
              date: now.toISOString().split("T")[0],
              status: "pending",
              balance: account.available_points,
            });

            // 마지막 출금 신청일 업데이트
            account.last_withdrawal_date = now.toISOString();

            accounts[accountIndex] = account;
            localStorage.setItem("user_accounts", JSON.stringify(accounts));
            console.log("✅ [출금 신청] user_accounts 업데이트 완료");
          }
        }

        // 2. withdrawal_requests에 관리자용 출금 요청 기록 추가
        const storedRequests = localStorage.getItem("withdrawal_requests");
        const requests = storedRequests ? JSON.parse(storedRequests) : [];

        requests.unshift({
          id: requestId,
          user_id: user.id,
          user_name: userInfo.name,
          user_number: user.id.includes("kakao") ? "000001" : "000002",
          requested_amount: amount,
          net_amount: netAmount,
          tax_amount: amount - netAmount,
          bank: userInfo.bank,
          account_number: userInfo.accountNumber,
          account_holder: userInfo.name,
          status: "pending",
          request_date: now.toISOString(),
          processed_date: null,
        });

        localStorage.setItem("withdrawal_requests", JSON.stringify(requests));
        console.log("✅ [출금 신청] withdrawal_requests 추가 완료");

        // 3. 알람 추가 (출금 신청 알람)
        const storedNotifications = localStorage.getItem("notifications");
        const notifications = storedNotifications
          ? JSON.parse(storedNotifications)
          : [];

        const notification = {
          id: `notif_${requestId}_${now.getTime()}`,
          user_id: user.id,
          type: "withdrawal_requested",
          title: "포인트 출금 신청",
          message: `포인트 출금 신청이 접수되었습니다.`,
          is_read: false,
          created_at: now.toISOString(),
        };
        notifications.unshift(notification);

        localStorage.setItem("notifications", JSON.stringify(notifications));
        console.log("✅ [출금 신청] 알람 추가 완료");
      }

      // 완료 모달 표시
      setIsCompleteModalOpen(true);
    } catch (error) {
      console.error("❌ [출금 신청] 처리 실패:", error);
      alert("출금 신청 처리 중 오류가 발생했습니다.");
    }
  };

  /**
   * 출금 신청 완료 모달 닫기 핸들러
   *
   * 기능:
   * - 모달을 닫고 포인트 페이지로 이동
   *
   */
  const handleCompleteModalClose = () => {
    setIsCompleteModalOpen(false);
    router.push("/user/point");
  };

  /**
   * 계좌 정보 경고 모달 닫기 핸들러
   *
   * 기능:
   * - 모달을 닫기만 함 (닫기 버튼 클릭 시)
   *
   */
  const handleAccountWarningModalClose = () => {
    setIsAccountWarningModalOpen(false);
  };

  /**
   * 계좌 정보 등록 페이지로 이동 핸들러
   *
   * 기능:
   * - 개인 정보 수정 페이지로 이동
   *

   */
  const handleGoToAccountRegistration = () => {
    router.push("/user/mypage/edit");
  };

  const handleAmountChange = (formattedValue: string) => {
    setWithdrawalAmount(formattedValue);
    const numValue = parseFormattedAmount(formattedValue);
    const validation = validateAmount(numValue, {
      minAmount: MIN_AMOUNT,
      maxAmount: MAX_AMOUNT,
      availablePoints: userInfo.availablePoints,
      errorMessages: {
        min: "출금은 최소 10,000원부터 신청할 수 있습니다.",
        max: "출금은 최대 500,000원까지 신청할 수 있습니다.",
        exceedsAvailable: "출금은 보유 포인트 이내에서만 신청할 수 있습니다.",
      },
    });
    setErrorMessage(validation.errorMessage);
  };

  return (
    <div className={styles.request_page}>
      {/* SubHeader */}
      <SubHeader />

      {/* 메인 컨텐츠 */}
      <main className={styles.main_content}>
        <div className={styles.container}>
          {/* 제목 (모바일에서는 숨김) */}
          <div className={styles.page_title_wrapper}>
            <PageTitle title="포인트 출금 신청" />
          </div>

          <AvailablePointsDisplay
            points={userInfo.availablePoints}
            className={styles.available_points_section}
            labelClassName={styles.points_label}
            amountClassName={styles.points_amount}
            numberClassName={styles.amount_number}
            unitClassName={styles.amount_unit}
          />

          {/* 폼 박스 컨테이너 */}
          <div className={styles.form_boxes_container}>
            {/* 첫 번째 박스: 본인 명의 계좌 정보 */}
            <div className={styles.form_box}>
              <div className={styles.form_section}>
                <h1 className={styles.form_title}>본인 명의 계좌 정보</h1>
                <ReadOnlyFormField
                  label="예금주"
                  value={userInfo.name}
                  className={styles.form_group}
                  labelClassName={styles.form_label}
                  inputClassName={`${styles.form_input} ${styles.disabled}`}
                />
                <ReadOnlyFormField
                  label="은행"
                  value={userInfo.bank}
                  className={styles.form_group}
                  labelClassName={styles.form_label}
                  inputClassName={`${styles.form_input} ${styles.disabled}`}
                />
                <ReadOnlyFormField
                  label="계좌번호"
                  value={userInfo.accountNumber}
                  className={styles.form_group}
                  labelClassName={styles.form_label}
                  inputClassName={`${styles.form_input} ${styles.disabled}`}
                />
                <ReadOnlyFormField
                  label="주민등록번호"
                  value={userInfo.residentNumber}
                  className={styles.form_group}
                  labelClassName={styles.form_label}
                  inputClassName={`${styles.form_input} ${styles.disabled}`}
                />
              </div>
            </div>

            {/* 두 번째 박스: 출금 신청 및 안내 사항 */}
            <div className={styles.form_box}>
              <div className={styles.form_section}>
                <h1 className={styles.form_title}>출금 신청</h1>
                <div className={styles.form_group}>
                  <AmountInput
                    value={withdrawalAmount}
                    onChange={handleAmountChange}
                    minAmount={MIN_AMOUNT}
                    maxAmount={MAX_AMOUNT}
                    availablePoints={userInfo.availablePoints}
                    placeholder="최소 10,000원 이상 최대 500,000원 이하"
                    label="출금 금액"
                    errorMessage={errorMessage}
                    className=""
                    labelClassName={styles.form_label}
                    inputClassName={`${styles.form_input} ${
                      errorMessage ? styles.error : ""
                    }`}
                  />
                </div>

                {/* 출금 예정 금액 */}
                <div className={styles.form_group}>
                  <label className={styles.form_label}>
                    출금 예정 금액 (3.3% 공제)
                  </label>
                  <input
                    type="text"
                    className={`${styles.form_input} ${styles.disabled}`}
                    value={netAmount > 0 ? netAmount.toLocaleString() : "0"}
                    disabled
                  />
                </div>
              </div>

              {/* 출금 안내 사항 */}
              <div className={styles.notice_section}>
                <h3 className={styles.notice_title}>출금 안내 사항</h3>
                <ul className={styles.notice_list}>
                  <li>
                    입력하신 정보와 예금주 정보가 반드시 일치해야 지급됩니다.
                  </li>
                  <li>사업 소득에 따른 세금 3.3% 공제 후 출금됩니다.</li>
                  <li>
                    출금은 주 1회 가능하며, 1회 최대 신청 금액은
                    500,000원입니다. 재출금 신청은 마지막으로 출금 신청한
                    날로부터 7일 이후에 가능합니다.
                  </li>
                  <li>
                    매주 수요일 16시까지 출금 신청 건에 한하여 금요일에
                    입금됩니다. 수요일 오후 16시 이후 정산 건은 그 다음 주
                    금요일에 입금됩니다.
                  </li>
                  <li>지급일이 공휴일인 경우 이전 영업일에 지급됩니다.</li>
                </ul>
              </div>
              <div className={styles.submit_button_section}>
                {/* 출금 신청 버튼 */}
                <button
                  className={`${styles.submit_button} ${
                    !isButtonEnabled() ? styles.disabled : ""
                  }`}
                  onClick={handleSubmit}
                  disabled={!isButtonEnabled()}
                >
                  출금 신청
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 계좌 정보 없음 경고 모달 */}
      <BaseModal
        is_open={isAccountWarningModalOpen}
        on_close={handleAccountWarningModalClose}
        message="계좌 정보가 없습니다.<br>계좌 정보 등록 후 출금 신청을 할 수 있습니다."
        buttons={["닫기", "등록"]}
        on_confirm={handleGoToAccountRegistration}
        type="center"
      />

      {/* 출금 신청 불가 모달 (7일 미경과)
      마지막 출금 신청으로부터 7일이 지나지 않았을 때 신청 불가 안내 모달 노출  */}
      <BaseModal
        is_open={isWithdrawalBlockedModalOpen}
        on_close={() => setIsWithdrawalBlockedModalOpen(false)}
        message={`마지막 출금 이후 7일이 지나야<br>다시 출금할 수 있습니다.<br><span style="color: #ff2626;">(현재: ${
          getDaysSinceLastWithdrawal() || 0
        }일 경과)</span>`}
        buttons={["닫기"]}
        type="center"
      />

      {/* 출금 신청 완료 모달 */}
      <BaseModal
        is_open={isCompleteModalOpen}
        on_close={handleCompleteModalClose}
        message="출금 신청이 완료되었습니다."
        buttons={["닫기"]}
        type="center"
      />
    </div>
  );
}
