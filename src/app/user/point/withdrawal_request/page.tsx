/* ========================================
   포인트 출금 신청 페이지
   ======================================== */

/**
 * WithdrawalRequestPage
 *
 * 목적: 사용자가 보유한 포인트를 출금 신청하는 페이지 (3.3% 원천징수 공제)
 *
 * 사용 페이지:
 * - /user/point/withdrawal_request (포인트 출금 신청)
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
import { useWithdrawalInfo } from "@/hooks/user/point/useWithdrawalInfo";
import styles from "../../../../styles/user/point/withdrawal_request.module.css";

const MIN_AMOUNT = 10000;
const MAX_AMOUNT = 500000;

export default function WithdrawalRequestPage() {
  const router = useRouter();
  const {
    userInfo,
    calculateNetAmount,
    getDaysSinceLastWithdrawal,
    canWithdraw,
    isAccountInfoValid,
    submitWithdrawal,
  } = useWithdrawalInfo();

  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState<boolean>(false);
  const [isAccountWarningModalOpen, setIsAccountWarningModalOpen] = useState<boolean>(false);
  const [isWithdrawalBlockedModalOpen, setIsWithdrawalBlockedModalOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== "undefined" && window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const amount = withdrawalAmount ? Number(withdrawalAmount.replace(/,/g, "")) : 0;
  const netAmount = amount > 0 ? calculateNetAmount(amount) : 0;

  const isButtonEnabled = (): boolean => {
    if (amount === 0) return false;
    if (amount < MIN_AMOUNT) return false;
    if (amount > MAX_AMOUNT) return false;
    if (amount > userInfo.availablePoints) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!isButtonEnabled()) return;

    if (!isAccountInfoValid()) {
      setIsAccountWarningModalOpen(true);
      return;
    }

    if (!canWithdraw()) {
      setIsWithdrawalBlockedModalOpen(true);
      return;
    }

    try {
      const success = await submitWithdrawal(amount, netAmount);
      if (success) {
        setIsCompleteModalOpen(true);
      } else {
        alert("출금 신청 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch {
      alert("출금 신청 처리 중 오류가 발생했습니다.");
    }
  };

  const handleCompleteModalClose = () => {
    setIsCompleteModalOpen(false);
    router.push("/user/point");
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
      <SubHeader />
      <main className={styles.main_content}>
        <PageTitle title={isMobile ? "포인트 충전" : "포인트 출금 신청"} />

        <div className={styles.container}>
          <AvailablePointsDisplay
            points={userInfo.availablePoints}
            className={styles.available_points_section}
            labelClassName={styles.points_label}
            amountClassName={styles.points_amount}
            numberClassName={styles.amount_number}
            unitClassName={styles.amount_unit}
          />

          <div className={styles.form_boxes_container}>
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
                    inputClassName={`${styles.form_input} ${errorMessage ? styles.error : ""}`}
                  />
                </div>

                <div className={styles.form_group}>
                  <label className={styles.form_label}>출금 예정 금액 (3.3% 공제)</label>
                  <input
                    type="text"
                    className={`${styles.form_input} ${styles.disabled}`}
                    value={netAmount > 0 ? netAmount.toLocaleString() : "0"}
                    disabled
                  />
                </div>
              </div>

              <div className={styles.notice_section}>
                <h3 className={styles.notice_title}>출금 안내 사항</h3>
                <ul className={styles.notice_list}>
                  <li>입력하신 정보와 예금주 정보가 반드시 일치해야 지급됩니다.</li>
                  <li>사업 소득에 따른 세금 3.3% 공제 후 출금됩니다.</li>
                  <li>
                    출금은 주 1회 가능하며, 1회 최대 신청 금액은 500,000원입니다. 재출금 신청은
                    마지막으로 출금 신청한 날로부터 7일 이후에 가능합니다.
                  </li>
                  <li>
                    매주 수요일 16시까지 출금 신청 건에 한하여 금요일에 입금됩니다. 수요일 오후 16시
                    이후 정산 건은 그 다음 주 금요일에 입금됩니다.
                  </li>
                  <li>지급일이 공휴일인 경우 이전 영업일에 지급됩니다.</li>
                </ul>
              </div>

              <div className={styles.submit_button_section}>
                <button
                  className={`${styles.submit_button} ${!isButtonEnabled() ? styles.disabled : ""}`}
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

      <BaseModal
        is_open={isAccountWarningModalOpen}
        on_close={() => setIsAccountWarningModalOpen(false)}
        message="계좌 정보가 없습니다.<br>계좌 정보 등록 후 출금 신청을 할 수 있습니다."
        buttons={["닫기", "등록"]}
        on_confirm={() => router.push("/user/mypage/edit")}
        type="center"
      />

      <BaseModal
        is_open={isWithdrawalBlockedModalOpen}
        on_close={() => setIsWithdrawalBlockedModalOpen(false)}
        message={`마지막 출금 이후 7일이 지나야<br>다시 출금할 수 있습니다.<br><span style="color: #ff2626;">(현재: ${getDaysSinceLastWithdrawal() ?? 0}일 경과)</span>`}
        buttons={["닫기"]}
        type="center"
      />

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
