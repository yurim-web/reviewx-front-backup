"use client";

/* ========================================
   💰 파트너 포인트 충전 페이지
   ======================================== */

/**
 * 목적: 파트너가 캠페인 운영을 위해 포인트를 충전하는 페이지입니다.
 * 경로: /partner/point/charge
 * 주요 기능: 포인트 표시, 금액 선택, 약관 동의, 신청 처리
 */

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SubHeader from "@/components/fragments/SubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import styles from "@/styles/partner/point/charge.module.css";
import customDropdownStyles from "@/styles/partner/campaign_create/custom_dropdown.module.css";

/**
 * 파트너 포인트 충전 페이지
 */
export default function PartnerPointChargePage() {
  const router = useRouter();
  const [chargeAmount, setChargeAmount] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"bank" | "card">("bank");
  const [depositorName, setDepositorName] = useState<string>("");
  const [issueInvoice, setIssueInvoice] = useState<boolean>(false);
  const [isBankAmountOpen, setIsBankAmountOpen] = useState<boolean>(false);
  const [isCardAmountOpen, setIsCardAmountOpen] = useState<boolean>(false);
  const [showCopyToast, setShowCopyToast] = useState<boolean>(false);

  // 드롭다운 ref - 외부 클릭 감지용
  const bankDropdownRef = useRef<HTMLDivElement>(null);
  const cardDropdownRef = useRef<HTMLDivElement>(null);

  // 파트너 정보 (실제로는 API에서 가져와야 함)
  const partnerInfo = {
    availablePoints: "",
    companyName: "주식회사 청명종합광고기획",
    ownerName: "김민회",
    businessNumber: "123-45-67890",
    address: "경기 성남시 분당구 정자일로 95 NAVER (우) 13561",
    bankAccount: "국민은행 659401-01-490957 (주)청명종합광고기획",
  };

  // 최소/최대 금액 상수
  const MIN_AMOUNT = 10000;
  const MAX_AMOUNT = 5000000;

  // 충전 예정 포인트 계산 (1:1 비율)
  // selectedAmount가 있으면 그 값을 사용, 없으면 chargeAmount에서 계산
  const chargePoints =
    selectedAmount !== null
      ? selectedAmount
      : chargeAmount
      ? Number(chargeAmount.replace(/,/g, ""))
      : 0;

  // 신청 후 포인트 계산: 현재 보유 포인트 + 충전 예정 포인트
  const postPoints = partnerInfo.availablePoints + chargePoints;

  // 유효성 검사 및 버튼 활성화 조건
  const isValidAmount = () => {
    if (chargePoints === 0) return false;
    if (chargePoints < MIN_AMOUNT) return false;
    if (chargePoints > MAX_AMOUNT) return false;
    return true;
  };

  // 무통장 입금 버튼 활성화 조건: 금액 + 입금자명 + 약관 동의
  const isBankButtonEnabled = () => {
    if (!isValidAmount()) return false;
    if (!depositorName.trim()) return false; // 입금자명이 비어있으면 false
    if (!agreeTerms) return false;
    return true;
  };

  // 신용카드 결제 버튼 활성화 조건: 금액 + 약관 동의
  const isCardButtonEnabled = () => {
    if (!isValidAmount()) return false;
    if (!agreeTerms) return false;
    return true;
  };

  const isButtonEnabled =
    activeTab === "bank" ? isBankButtonEnabled() : isCardButtonEnabled();

  // 충전 처리: 실제 결제 연동 시 결제 API를 호출한 뒤 성공/실패에 맞춰 흐름 제어가 필요합니다.
  const handleSubmit = () => {
    if (!isButtonEnabled) return;

    // TODO: 실제 결제/입금 확인 요청 API 호출
    const actionLabel = activeTab === "bank" ? "입금 확인 요청" : "결제";

    // 현재 날짜를 YYYY-MM-DD 형식으로 생성
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // 새로운 충전 내역 생성
    const newHistory = {
      id: `charge_${Date.now()}`, // 고유 ID 생성 (타임스탬프 사용)
      type: "earned" as const, // 충전 타입
      amount: chargePoints, // 충전 금액
      description: "포인트 충전", // 내역 설명
      date: formattedDate, // 오늘 날짜
      status: activeTab === "bank" ? ("pending" as const) : ("earned" as const), // 무통장 입금은 "신청", 카드 결제는 "충전"
      balance: 0, // 잔액은 all 페이지에서 계산됨
    };

    // localStorage에 새 충전 내역 저장 (all 페이지에서 불러와서 표시)
    localStorage.setItem(
      "partner_new_point_history",
      JSON.stringify(newHistory)
    );

    alert(
      `${actionLabel}이 완료되었습니다. (${chargePoints.toLocaleString()}원)`
    );
    router.push("/partner/point/all");
  };

  // 충전 금액 옵션 선택
  const handleAmountOptionClick = (value: number | null) => {
    setSelectedAmount(value);
    if (value !== null) {
      setChargeAmount(value.toLocaleString());
    } else {
      setChargeAmount("");
    }
  };

  // 메인 헤더 숨기기
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "none";
    }

    return () => {
      if (header) {
        header.style.display = "block";
      }
    };
  }, []);

  // 드롭다운 외부 클릭 감지 - 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // 무통장 입금 드롭다운 외부 클릭 시
      if (
        bankDropdownRef.current &&
        !bankDropdownRef.current.contains(target)
      ) {
        setIsBankAmountOpen(false);
      }

      // 신용카드 결제 드롭다운 외부 클릭 시
      if (
        cardDropdownRef.current &&
        !cardDropdownRef.current.contains(target)
      ) {
        setIsCardAmountOpen(false);
      }
    };

    // 클릭 이벤트 리스너 등록
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.charge_page}>
      {/* SubHeader */}
      <SubHeader />

      {/* 메인 컨텐츠 */}
      <main className={styles.main_content}>
        <div className={styles.container}>
          {/* 제목 */}
          <PageTitle title="포인트 충전" />

          {/* 결제 방식 탭 */}
          <article
            className={styles.tab_section}
            role="tablist"
            aria-label="결제 방식 선택"
          >
            <button
              role="tab"
              aria-selected={activeTab === "bank"}
              className={`${styles.tab_button} ${
                activeTab === "bank" ? styles.tab_active : ""
              }`}
              onClick={() => setActiveTab("bank")}
            >
              무통장 입금
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "card"}
              className={`${styles.tab_button} ${
                activeTab === "card" ? styles.tab_active : ""
              }`}
              onClick={() => setActiveTab("card")}
            >
              신용카드 결제
            </button>
          </article>

          {/* 무통장 입금 섹션*/}
          {activeTab === "bank" && (
            <section className={styles.bank_section}>
              {/* 입금 계좌 정보 */}
              <article className={styles.content_container}>
                <h2 className={styles.content_title}>입금 계좌 정보</h2>
                <div className={styles.account_info_row}>
                  <div className={styles.account_info_box}>
                    <span className={styles.account_text}>
                      {partnerInfo.bankAccount}
                    </span>
                    <button
                      className={styles.copy_button}
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          partnerInfo.bankAccount
                        );
                        setShowCopyToast(true);
                        setTimeout(() => setShowCopyToast(false), 2000);
                      }}
                    >
                      복사
                    </button>
                  </div>
                </div>

                <ul className={styles.account_notice_list}>
                  <li>
                    {" "}
                    • 아래 계좌로 신청할 금액을 입금 후 결제 포인트 충전 요청을
                    진행해 주세요.
                  </li>
                </ul>
              </article>

              <article className={styles.content_container}>
                <h2 className={styles.content_title}>입금 확인</h2>

                {/* 신청 금액 */}
                <div className={styles.form_section}>
                  <label
                    className={styles.section_label}
                    htmlFor="bank_amount_select"
                  >
                    신청 금액
                  </label>
                  <div
                    className={customDropdownStyles.custom_dropdown}
                    ref={bankDropdownRef}
                  >
                    <button
                      id="bank_amount_select"
                      type="button"
                      className={customDropdownStyles.dropdown_button}
                      aria-haspopup="listbox"
                      aria-expanded={isBankAmountOpen}
                      onClick={() => setIsBankAmountOpen((o) => !o)}
                    >
                      <span
                        className={customDropdownStyles.dropdown_text}
                        data-placeholder="금액 선택"
                      >
                        {selectedAmount ? selectedAmount.toLocaleString() : ""}
                      </span>
                      <img
                        src="/images/icons/dropdown_arrow.svg"
                        alt=""
                        className={`${customDropdownStyles.dropdown_arrow} ${
                          isBankAmountOpen ? customDropdownStyles.rotated : ""
                        }`}
                      />
                    </button>
                    {isBankAmountOpen && (
                      <div
                        className={customDropdownStyles.dropdown_options}
                        role="listbox"
                        aria-label="신청 금액"
                      >
                        {[
                          50000, 100000, 150000, 200000, 300000, 500000,
                          1000000,
                        ].map((v) => (
                          <button
                            key={v}
                            type="button"
                            role="option"
                            aria-selected={selectedAmount === v}
                            className={customDropdownStyles.dropdown_option}
                            onClick={() => {
                              handleAmountOptionClick(v);
                              setIsBankAmountOpen(false);
                            }}
                          >
                            {v.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 신청 후 포인트 */}
                <div className={styles.form_section}>
                  <label
                    className={styles.section_label}
                    htmlFor="post_points_display"
                  >
                    신청 후 포인트
                  </label>
                  <div
                    id="post_points_display"
                    className={styles.read_only_box}
                  >
                    {postPoints.toLocaleString()}
                  </div>
                </div>

                {/* 입금자명 */}
                <div className={styles.form_section}>
                  <label
                    className={styles.section_label}
                    htmlFor="depositor_name_input"
                  >
                    입금자명
                  </label>
                  <input
                    id="depositor_name_input"
                    type="text"
                    className={styles.input_box}
                    placeholder="입금자명 입력"
                    value={depositorName}
                    onChange={(e) => setDepositorName(e.target.value)}
                  />
                </div>

                {/* 계산서 발행 */}
                <div className={styles.form_section}>
                  <span className={styles.section_label}>계산서 발행</span>
                  <div className={styles.checkbox_row}>
                    <div className={styles.checkbox_container}>
                      <input
                        type="checkbox"
                        id="issueInvoice"
                        checked={issueInvoice}
                        onChange={(e) => setIssueInvoice(e.target.checked)}
                      />
                      <label htmlFor="issueInvoice">세금계산서 발행</label>
                    </div>
                  </div>
                </div>
              </article>

              <article className={styles.content_container}>
                {/* 사업자 정보 (세금계산서 발행 선택 시에만 표시) */}
                {issueInvoice && (
                  <>
                    <h3 className={styles.content_title}>사업자 정보</h3>
                    <div className={styles.form_section}>
                      <label className={styles.section_label}>상호명</label>
                      <div className={styles.read_only_box}>
                        {partnerInfo.companyName}
                      </div>
                    </div>
                    <div className={styles.form_section}>
                      <label className={styles.section_label}>대표자명</label>
                      <div className={styles.read_only_box}>
                        {partnerInfo.ownerName}
                      </div>
                    </div>
                    <div className={styles.form_section}>
                      <label className={styles.section_label}>
                        사업자등록번호
                      </label>
                      <div className={styles.read_only_box}>
                        {partnerInfo.businessNumber}
                      </div>
                    </div>
                    {/* 주소 */}
                    <div className={styles.form_section}>
                      <label className={styles.section_label}>주소</label>
                      <div className={styles.read_only_box}>
                        {partnerInfo.address}
                      </div>
                    </div>
                  </>
                )}

                {/* 약관 동의 */}
                <div className={styles.form_section}>
                  <span className={styles.section_label}>
                    결제 · 환불 및 이용약관 동의
                  </span>

                  <div
                    className={`${styles.checkbox_row} ${styles.checkbox_row_agree}`}
                  >
                    <div className={styles.checkbox_container}>
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <label htmlFor="agreeTerms">
                        구매 조건 확인 및 결제 진행에 동의합니다.
                      </label>
                    </div>

                    <button type="button" className={styles.terms_button}>
                      약관 보기
                    </button>
                  </div>
                </div>

                {/* 입금 안내 사항 */}
                <div
                  className={`${styles.form_section} ${styles.notice_section}`}
                >
                  <label className={styles.section_label}>입금 안내 사항</label>
                  <ul className={styles.notice_list}>
                    <li>입금 확인 후 승인 처리되어야 이용 권한이 생깁니다.</li>
                    <li>
                      신청 후 1일 이내 입금 확인이 안 될 경우 신청 내역이 삭제될
                      수 있습니다.
                    </li>
                    <li>
                      신청 이후 계좌 정보 수정이 불가능하며, 잘못 입력된 정보로
                      인해 발생하는 책임은 신청자 본인에게 있습니다.
                    </li>
                  </ul>
                </div>
              </article>
            </section>
          )}

          {/* 신용카드 결제 탭 - 기존 흐름 유지 */}
          {activeTab === "card" && (
            <section
              aria-labelledby="card_payment_title"
              className={styles.bank_section}
            >
              <article className={styles.content_container}>
                <h2 id="card_payment_title" className={styles.content_title}>
                  결제 진행
                </h2>

                {/* 신청 금액 - 드롭다운 선택 */}
                <div className={styles.form_section}>
                  <label
                    className={styles.section_label}
                    htmlFor="card_amount_select"
                  >
                    신청 금액
                  </label>
                  <div
                    className={customDropdownStyles.custom_dropdown}
                    ref={cardDropdownRef}
                  >
                    <button
                      id="card_amount_select"
                      type="button"
                      className={customDropdownStyles.dropdown_button}
                      aria-haspopup="listbox"
                      aria-expanded={isCardAmountOpen}
                      onClick={() => setIsCardAmountOpen((o) => !o)}
                    >
                      <span
                        className={customDropdownStyles.dropdown_text}
                        data-placeholder="금액 선택"
                      >
                        {selectedAmount ? selectedAmount.toLocaleString() : ""}
                      </span>
                      <img
                        src="/images/icons/dropdown_arrow.svg"
                        alt=""
                        className={`${customDropdownStyles.dropdown_arrow} ${
                          isCardAmountOpen ? customDropdownStyles.rotated : ""
                        }`}
                      />
                    </button>
                    {isCardAmountOpen && (
                      <div
                        className={customDropdownStyles.dropdown_options}
                        role="listbox"
                        aria-label="신청 금액"
                      >
                        {[
                          50000, 100000, 150000, 200000, 300000, 500000,
                          1000000,
                        ].map((v) => (
                          <button
                            key={v}
                            type="button"
                            role="option"
                            aria-selected={selectedAmount === v}
                            className={customDropdownStyles.dropdown_option}
                            onClick={() => {
                              handleAmountOptionClick(v);
                              setIsCardAmountOpen(false);
                            }}
                          >
                            {v.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 신청 후 포인트 */}
                <div className={styles.form_section}>
                  <label
                    className={styles.section_label}
                    htmlFor="card_post_points"
                  >
                    신청 후 포인트
                  </label>
                  <div id="card_post_points" className={styles.read_only_box}>
                    {postPoints.toLocaleString()}
                  </div>
                </div>

                {/* 약관 동의 */}
                <div className={styles.form_section}>
                  <span className={styles.section_label}>
                    결제 · 환불 및 이용약관 동의
                  </span>

                  <div
                    className={`${styles.checkbox_row} ${styles.checkbox_row_agree}`}
                  >
                    <div className={styles.checkbox_container}>
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <label htmlFor="agreeTerms">
                        구매 조건 확인 및 결제 진행에 동의합니다.
                      </label>
                    </div>

                    <button type="button" className={styles.terms_button}>
                      약관 보기
                    </button>
                  </div>
                </div>
              </article>
            </section>
          )}

          {/* 페이지 하단 단일 버튼 (기획서와 동일하게 고정 아님) */}
          <div className={styles.submit_button_section}>
            <button
              className={`${styles.submit_button} ${
                !isButtonEnabled ? styles.disabled : ""
              }`}
              onClick={handleSubmit}
              disabled={!isButtonEnabled}
              aria-disabled={!isButtonEnabled}
            >
              {activeTab === "bank" ? "입금 확인 요청하기" : "결제하기"}
            </button>
          </div>
        </div>
      </main>

      {/* 복사 완료 토스트 메시지 */}
      {showCopyToast && (
        <div className={styles.copy_toast}>
          <div className={styles.copy_toast_icon}></div>
          <span className={styles.copy_toast_text}>복사되었습니다.</span>
        </div>
      )}
    </div>
  );
}
