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
 *
 * API:
 * - 34번: GET /user/point/withdrawal_request (진입 데이터)
 * - 35번: POST /user/point/withdrawal_request (출금 신청)
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
import { useWithdrawalInfo } from "@/hooks/user/point/useWithdrawalInfo";
import type { WithdrawalResponse } from "@/types/api/withdrawal";
import Loading from "@/app/loading";
import styles from "../../../../styles/user/point/withdrawal_request.module.css";

export default function WithdrawalRequestPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    userInfo,
    calculateNetAmount,
    isAccountInfoValid,
    isLoading,
    isError,
    withdrawalMutation,
  } = useWithdrawalInfo();

  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState<boolean>(false);
  const [isAccountWarningModalOpen, setIsAccountWarningModalOpen] = useState<boolean>(false);
  const [isWithdrawalBlockedModalOpen, setIsWithdrawalBlockedModalOpen] = useState<boolean>(false);
  const [isServerErrorModalOpen, setIsServerErrorModalOpen] = useState<boolean>(false);
  const [blockedMessage, setBlockedMessage] = useState<string>("");
  const [completedData, setCompletedData] = useState<WithdrawalResponse | null>(null);

  // 로그인 체크 (isAuthLoading 완료 후 판단)
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/user/login");
    }
  }, [isAuthLoading, user, router]);

  // 서버 오류 모달 (GET 실패)
  useEffect(() => {
    if (isError) setIsServerErrorModalOpen(true);
  }, [isError]);

  if (isLoading) return <Loading />;

  const amount = withdrawalAmount ? Number(withdrawalAmount.replace(/,/g, "")) : 0;
  const netAmount = amount > 0 ? calculateNetAmount(amount) : 0;

  const isButtonEnabled = (): boolean => {
    if (amount === 0) return false;
    if (amount < userInfo.minAmount) return false;
    if (amount > userInfo.maxAmount) return false;
    if (amount > userInfo.availablePoints) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!isButtonEnabled()) return;

    // B_M2: 계좌 미등록 체크
    if (!isAccountInfoValid()) {
      setIsAccountWarningModalOpen(true);
      return;
    }

    withdrawalMutation.mutate(amount, {
      onSuccess: (res) => {
        // C_M2: 출금 완료 모달에 상세 정보 표시
        setCompletedData(res);
        setIsCompleteModalOpen(true);
      },
      onError: (error) => {
        const errorData = error.response?.data;
        const code = errorData?.errorCode;

        if (code === "NO_BANK_ACCOUNT") {
          // B_M2: 계좌 미등록
          setIsAccountWarningModalOpen(true);
        } else if (code === "PENDING_WITHDRAWAL_EXISTS") {
          // B_M1: 중복 신청 (처리 중인 출금 있음)
          setBlockedMessage(
            "처리 중인 출금 신청이 있습니다.<br>이전 신청이 완료된 후 다시 시도해주세요."
          );
          setIsWithdrawalBlockedModalOpen(true);
        } else if (code === "WITHDRAWAL_WEEKLY_LIMIT_EXCEEDED") {
          // B_M1: 주 1회 제한
          setBlockedMessage(
            "이번 주 출금 신청 횟수를 초과했습니다.<br>다음 주에 다시 시도해주세요."
          );
          setIsWithdrawalBlockedModalOpen(true);
        } else if (code === "EXCEED_MONTHLY_MAX_WITHDRAWAL") {
          setBlockedMessage("월 최대 출금 금액(2,000,000원)을 초과했습니다.");
          setIsWithdrawalBlockedModalOpen(true);
        } else if (code === "INSUFFICIENT_POINT") {
          // W_E3: 잔액 부족
          setErrorMessage("출금은 보유 포인트 이내에서만 신청할 수 있습니다.");
        } else if (code === "BELOW_MIN_WITHDRAWAL") {
          // W_E1: 최솟값 미달
          setErrorMessage(
            `출금은 최소 ${userInfo.minAmount.toLocaleString()}원부터 신청할 수 있습니다.`
          );
        } else if (code === "EXCEED_MAX_WITHDRAWAL") {
          // W_E2: 최댓값 초과
          setErrorMessage(
            `출금은 최대 ${userInfo.maxAmount.toLocaleString()}원까지 신청할 수 있습니다.`
          );
        } else {
          // E_M5: 서버 오류
          setIsServerErrorModalOpen(true);
        }
      },
    });
  };

  const handleCompleteModalClose = () => {
    setIsCompleteModalOpen(false);
    setCompletedData(null);
    router.push("/user/point");
  };

  const handleAmountChange = (formattedValue: string) => {
    setWithdrawalAmount(formattedValue);
    const numValue = parseFormattedAmount(formattedValue);
    const validation = validateAmount(numValue, {
      minAmount: userInfo.minAmount,
      maxAmount: userInfo.maxAmount,
      availablePoints: userInfo.availablePoints,
      errorMessages: {
        min: `출금은 최소 ${userInfo.minAmount.toLocaleString()}원부터 신청할 수 있습니다.`,
        max: `출금은 최대 ${userInfo.maxAmount.toLocaleString()}원까지 신청할 수 있습니다.`,
        exceedsAvailable: "출금은 보유 포인트 이내에서만 신청할 수 있습니다.",
      },
    });
    setErrorMessage(validation.errorMessage);
  };

  // C_M2: 출금 완료 모달 메시지 (상세 정보 포함)
  const completeModalMessage = completedData
    ? `출금 신청이 완료되었습니다.<br><br>` +
      `<strong>신청번호</strong>: ${completedData.withdrawalNumber}<br>` +
      `<strong>신청금액</strong>: ${completedData.requestedAmount.toLocaleString()}원<br>` +
      `<strong>공제금액</strong> (${(completedData.feeRate * 100).toFixed(1)}%): ${completedData.feeAmount.toLocaleString()}원<br>` +
      `<strong>실수령액</strong>: ${completedData.expectedAmount.toLocaleString()}원`
    : "출금 신청이 완료되었습니다.";

  return (
    <div className={styles.request_page}>
      <SubHeader />
      <main className={styles.main_content}>
        <PageTitle title="포인트 출금 신청" />

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
              </div>
            </div>

            <div className={styles.form_box}>
              <div className={styles.form_section}>
                <h1 className={styles.form_title}>출금 신청</h1>
                <div className={styles.form_group}>
                  <AmountInput
                    value={withdrawalAmount}
                    onChange={handleAmountChange}
                    minAmount={userInfo.minAmount}
                    maxAmount={userInfo.maxAmount}
                    availablePoints={userInfo.availablePoints}
                    placeholder={`최소 ${userInfo.minAmount.toLocaleString()}원 이상 최대 ${userInfo.maxAmount.toLocaleString()}원 이하`}
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
                  disabled={!isButtonEnabled() || withdrawalMutation.isPending}
                >
                  {withdrawalMutation.isPending ? "신청 중..." : "출금 신청"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* B_M2: 계좌 미등록 경고 모달 */}
      <BaseModal
        is_open={isAccountWarningModalOpen}
        on_close={() => setIsAccountWarningModalOpen(false)}
        message="계좌 정보가 없습니다.<br>계좌 정보 등록 후 출금 신청을 할 수 있습니다."
        buttons={["닫기", "등록"]}
        on_confirm={() => router.push("/user/mypage/edit")}
        type="center"
      />

      {/* B_M1: 출금 신청 불가 모달 (중복 신청/주간 제한/월 한도 초과) */}
      <BaseModal
        is_open={isWithdrawalBlockedModalOpen}
        on_close={() => setIsWithdrawalBlockedModalOpen(false)}
        message={blockedMessage}
        buttons={["닫기"]}
        type="center"
      />

      {/* C_M2: 출금 신청 완료 모달 (상세 정보 포함) */}
      <BaseModal
        is_open={isCompleteModalOpen}
        on_close={handleCompleteModalClose}
        message={completeModalMessage}
        buttons={["닫기"]}
        type="center"
      />

      {/* E_M5: 서버 오류 모달 */}
      <BaseModal
        is_open={isServerErrorModalOpen}
        on_close={() => setIsServerErrorModalOpen(false)}
        message={"오류가 발생했습니다.<br>잠시 후 다시 시도해주세요."}
        buttons={["닫기", "재시도"]}
        on_cancel={() => setIsServerErrorModalOpen(false)}
        on_confirm={() => {
          setIsServerErrorModalOpen(false);
          router.refresh();
        }}
        type="center"
      />
    </div>
  );
}
