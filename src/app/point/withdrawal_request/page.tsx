// 포인트 출금 신청하기 페이지

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SubHeader from "@/components/fragments/SubHeader";
import styles from "../../../styles/point/withdrawal_request.module.css";

/**
 * 포인트 출금 신청 페이지
 */
export default function WithdrawalRequestPage() {
  const router = useRouter();
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // 사용자 정보 (실제로는 API에서 가져와야 함)
  // TODO: API로 실제 사용자 정보를 가져와야 함
  const userInfo = {
    name: "홍길동",
    bank: "우리은행",
    accountNumber: "000000000000",
    residentNumber: "800102-*******",
    // 포인트 임의로 바꾸는 부분!!!!
    availablePoints: 10000000, // API에서 실제 보유 포인트를 가져와야 함
  };

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

  // 유효성 검사 및 버튼 활성화 조건
  const isValidAmount = () => {
    if (amount === 0) return false;
    if (amount < MIN_AMOUNT) return false;
    if (amount > MAX_AMOUNT) return false;
    if (amount > userInfo.availablePoints) return false;
    return true;
  };

  const isButtonEnabled = isValidAmount();

  // 출금 신청 처리
  const handleSubmit = () => {
    if (!isButtonEnabled) return;

    // TODO: 실제 출금 신청 API 호출
    alert("출금 신청이 완료되었습니다.");
    router.push("/point");
  };

  // 금액 입력 포맷팅 및 유효성 검사
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numValue = value ? Number(value) : 0;
    const formattedValue = value ? numValue.toLocaleString() : "";

    setWithdrawalAmount(formattedValue);

    // 에러 메시지 설정
    if (numValue === 0) {
      setErrorMessage("");
    } else if (numValue < MIN_AMOUNT) {
      setErrorMessage("출금은 최소 10,000원부터 신청할 수 있습니다.");
    } else if (numValue > MAX_AMOUNT) {
      setErrorMessage("출금은 최대 500,000원까지 신청할 수 있습니다.");
    } else if (numValue > userInfo.availablePoints) {
      setErrorMessage("출금은 보유 포인트 이내에서만 신청할 수 있습니다.");
    } else {
      setErrorMessage("");
    }
  };

  // 메인 헤더 숨기기
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "none";
    }

    // 컴포넌트 언마운트 시 헤더 다시 보이기
    return () => {
      if (header) {
        header.style.display = "block";
      }
    };
  }, []);

  return (
    <div className={styles.request_page}>
      {/* SubHeader */}
      <SubHeader />

      {/* 메인 컨텐츠 */}
      <main className={styles.main_content}>
        <div className={styles.container}>
          {/* 제목 */}
          <h1 className={styles.page_title}>포인트 출금 신청</h1>

          {/* 구분선 */}
          <div className={styles.title_divider} />

          {/* 보유 포인트 */}
          <div className={styles.available_points_section}>
            <span className={styles.points_label}>보유 포인트</span>
            <div className={styles.points_amount}>
              <span className={styles.amount_number}>
                {userInfo.availablePoints.toLocaleString()}
              </span>
              <span className={styles.amount_unit}>P</span>
            </div>
          </div>

          {/* 입력 필드 영역 */}
          <div className={styles.form_section}>
            {/* 예금주 */}
            <div className={styles.form_group}>
              <label className={styles.form_label}>예금주</label>
              <input
                type="text"
                className={`${styles.form_input} ${styles.disabled}`}
                value={userInfo.name}
                disabled
              />
            </div>

            {/* 은행 */}
            <div className={styles.form_group}>
              <label className={styles.form_label}>은행</label>
              <input
                type="text"
                className={`${styles.form_input} ${styles.disabled}`}
                value={userInfo.bank}
                disabled
              />
            </div>

            {/* 계좌번호 */}
            <div className={styles.form_group}>
              <label className={styles.form_label}>계좌번호</label>
              <input
                type="text"
                className={`${styles.form_input} ${styles.disabled}`}
                value={userInfo.accountNumber}
                disabled
              />
            </div>

            {/* 주민등록번호 */}
            <div className={styles.form_group}>
              <label className={styles.form_label}>주민등록번호</label>
              <input
                type="text"
                className={`${styles.form_input} ${styles.disabled}`}
                value={userInfo.residentNumber}
                disabled
              />
            </div>

            {/* 출금 신청 */}
            <div className={styles.form_group}>
              <label className={styles.form_label}>출금 신청</label>
              <input
                type="text"
                className={`${styles.form_input} ${
                  errorMessage ? styles.error : ""
                }`}
                value={withdrawalAmount}
                onChange={handleAmountChange}
                placeholder="최소 10,000원 이상 최대 500,000원 이하"
              />
              {errorMessage && (
                <span className={styles.error_message}>{errorMessage}</span>
              )}
              {!errorMessage && withdrawalAmount && (
                <span className={styles.helper_text}>
                  출금은 최소 10,000원 이상부터 신청할 수 있습니다.
                </span>
              )}
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
              <li>입력하신 정보와 예금주 정보가 반드시 일치해야 지급됩니다.</li>
              <li>사업 소득에 따른 세금 3.3% 공제 후 출금됩니다.</li>
              <li>
                출금은 주 1회 가능하며, 1회 최대 신청 금액은 500,000원입니다.
                재출금 신청은 마지막으로 출금 신청한 날로부터 7일 이후에
                가능합니다.
              </li>
              <li>
                매주 수요일 16시까지 출금 신청 건에 한하여 금요일에 입금됩니다.
                수요일 오후 16시 이후 정산 건은 그 다음 주 금요일에 입금됩니다.
              </li>
              <li>지급일이 공휴일인 경우 이전 영업일에 지급됩니다.</li>
            </ul>
          </div>
          <div className={styles.submit_button_section}>
            {/* 출금 신청 버튼 */}
            <button
              className={`${styles.submit_button} ${
                !isButtonEnabled ? styles.disabled : ""
              }`}
              onClick={handleSubmit}
              disabled={!isButtonEnabled}
            >
              출금 신청하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
