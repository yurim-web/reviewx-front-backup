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
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import Toast from "@/components/common/toast/Toast";
import BaseModal from "@/components/common/modal/BaseModal";
import { parseFormattedAmount } from "@/utils/formatting/amount";
import { validateAmount } from "@/utils/validation/amount";
import styles from "@/styles/partner/point/charge.module.css";
import customDropdownStyles from "@/styles/partner/campaign_create/custom_dropdown.module.css";
import { useAuth } from "@/hooks/useAuth";
import { getPartnerPointSummary, addPointCharge } from "@/data/partner/point/pointData";
import { addPaymentHistory } from "@/data/manager_sa/settlement/paymentHistoryData";

/**
 * 파트너 포인트 충전 페이지
 */
export default function PartnerPointChargePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [chargeAmount, setChargeAmount] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"bank" | "card">("bank");
  const [depositorName, setDepositorName] = useState<string>("");
  // 영수증/계산서 발행 옵션: "none" (미발행), "cash_income" (현금영수증 소득공제), "cash_expense" (현금영수증 지출증빙), "tax_invoice" (세금계산서)
  // 초기값: 현금영수증 (소득공제)로 설정
  const [invoiceType, setInvoiceType] = useState<
    "none" | "cash_income" | "cash_expense" | "tax_invoice"
  >("cash_income");
  const [isBankAmountOpen, setIsBankAmountOpen] = useState<boolean>(false);
  const [isCardAmountOpen, setIsCardAmountOpen] = useState<boolean>(false);
  const [isInvoiceDropdownOpen, setIsInvoiceDropdownOpen] =
    useState<boolean>(false);
  const [showCopyToast, setShowCopyToast] = useState<boolean>(false);
  
  // 현금영수증 (소득공제) 정보
  const [cashReceiptIncome, setCashReceiptIncome] = useState({
    name: "",
    phone: "",
  });
  
  // 현금영수증 (지출증빙) 정보
  const [cashReceiptExpense, setCashReceiptExpense] = useState({
    company_name: "",
    business_number: "",
  });

  // 카드 결제 실패 모달 상태
  const [cardPaymentFailModal, setCardPaymentFailModal] = useState({
    is_open: false,
  });

  // 카드 결제 성공 모달 상태
  const [cardPaymentSuccessModal, setCardPaymentSuccessModal] = useState({
    is_open: false,
  });

  // 무통장 입금 신청 모달 상태
  const [bankDepositModal, setBankDepositModal] = useState({
    is_open: false,
  });

  // 드롭다운 ref - 외부 클릭 감지용
  const bankDropdownRef = useRef<HTMLDivElement>(null);
  const cardDropdownRef = useRef<HTMLDivElement>(null);
  const invoiceDropdownRef = useRef<HTMLDivElement>(null);

  // invoiceType을 결제 내역 타입으로 변환
  const getTaxInvoiceType = (): '미발행' | '세금계산서' | '현금영수증 (소득공제)' | '현금영수증 (지출증빙)' => {
    if (invoiceType === 'none') return '미발행';
    if (invoiceType === 'tax_invoice') return '세금계산서';
    if (invoiceType === 'cash_income') return '현금영수증 (소득공제)';
    if (invoiceType === 'cash_expense') return '현금영수증 (지출증빙)';
    return '미발행';
  };

  // 파트너 정보 - 로그인된 사용자 정보 사용
  const [currentPoints, setCurrentPoints] = useState(0);

  // 사용자 포인트 정보 로드
  useEffect(() => {
    if (user?.id) {
      const summary = getPartnerPointSummary(user.id);
      setCurrentPoints(summary.available_points);
    }
  }, [user]);

  const partnerInfo = {
    availablePoints: currentPoints,
    companyName: user?.business_name || "회사명 미등록",
    ownerName: user?.name || "이름 미등록",
    businessNumber: user?.business_number || "사업자번호 미등록",
    address: "주소 미등록",
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
  const availablePoints =
    typeof partnerInfo.availablePoints === "number"
      ? partnerInfo.availablePoints
      : Number(partnerInfo.availablePoints) || 0;
  const postPoints = availablePoints + chargePoints;

  // 카드 결제 성공 후 보유 포인트 (충전 완료된 포인트)
  const successPostPoints = availablePoints + chargePoints;

  const isValidAmount = () => {
    const validation = validateAmount(chargePoints, {
      minAmount: MIN_AMOUNT,
      maxAmount: MAX_AMOUNT
    });
    return validation.isValid;
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

  /**
   * 카드 결제 처리 (실제 결제 API 호출 시뮬레이션)
   *
   * 설명:
   * - 실제로는 결제 API를 호출하고 성공/실패에 따라 모달을 표시합니다.
   * - 현재는 시뮬레이션으로 성공/실패를 랜덤하게 처리합니다.
   */
  const handleCardPayment = () => {
    if (!user?.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    // TODO: 실제 결제 API 호출
    // 예시: const result = await paymentAPI.charge(chargePoints);

    // 시뮬레이션: 랜덤하게 성공/실패 결정 (실제로는 API 응답에 따라)
    const isSuccess = Math.random() > 0.3; // 70% 성공률

    if (isSuccess) {
      // console.log('포인트 충전 - user.id:', user.id, 'chargePoints:', chargePoints);
      // 포인트 충전 처리
      addPointCharge(user.id, chargePoints, '카드 결제를 통한 포인트 충전');

      // 관리자 결제내역에 추가
      addPaymentHistory(user.id, chargePoints, '카드 결제', undefined, getTaxInvoiceType());

      // 현재 포인트 업데이트 (모달 닫은 후에 업데이트되도록 하지 않음)
      // const updatedSummary = getPartnerPointSummary(user.id);
      // setCurrentPoints(updatedSummary.available_points);

      // 결제 성공: 성공 모달 표시
      setCardPaymentSuccessModal({ is_open: true });
    } else {
      // 결제 실패: 실패 모달 표시
      setCardPaymentFailModal({ is_open: true });
    }
  };

  /**
   * 카드 결제 실패 모달에서 다시 시도 클릭
   */
  const handleCardPaymentRetry = () => {
    setCardPaymentFailModal({ is_open: false });
    // 다시 결제 시도
    handleCardPayment();
  };

  /**
   * 카드 결제 성공 모달에서 닫기 클릭
   *
   * 설명:
   * - 이전 페이지(캠페인 등록 페이지)로 돌아갑니다.
   * - localStorage에 저장된 이전 페이지 경로를 사용합니다.
   */
  const handleCardPaymentSuccessClose = () => {
    setCardPaymentSuccessModal({ is_open: false });

    // 포인트 업데이트 (모달 닫을 때)
    if (user?.id) {
      const updatedSummary = getPartnerPointSummary(user.id);
      setCurrentPoints(updatedSummary.available_points);
    }

    // 이전 페이지로 돌아가기
    router.back();
  };

  /**
   * 무통장 입금 신청 처리
   */
  const handleBankDepositSubmit = () => {
    if (!user?.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 무통장 입금은 관리자 승인 후 포인트 적립 (임시로 즉시 적립)
    addPointCharge(user.id, chargePoints, `무통장 입금 (입금자: ${depositorName})`);

    // 관리자 결제내역에 추가
    addPaymentHistory(user.id, chargePoints, '무통장 입금', depositorName, getTaxInvoiceType());

    // 무통장 입금 신청 모달 표시
    setBankDepositModal({ is_open: true });
  };

  /**
   * 무통장 입금 신청 모달에서 닫기 클릭
   */
  const handleBankDepositModalClose = () => {
    setBankDepositModal({ is_open: false });

    // 포인트 업데이트 (모달 닫을 때)
    if (user?.id) {
      const updatedSummary = getPartnerPointSummary(user.id);
      setCurrentPoints(updatedSummary.available_points);
    }

    // 이전 페이지로 돌아가기
    router.back();
  };

  // 충전 처리: 실제 결제 연동 시 결제 API를 호출한 뒤 성공/실패에 맞춰 흐름 제어가 필요합니다.
  const handleSubmit = () => {
    if (!isButtonEnabled) return;

    if (activeTab === "bank") {
      // 무통장 입금 처리
      handleBankDepositSubmit();
    } else {
      // 카드 결제 처리
      handleCardPayment();
    }
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

  // 메인 헤더 숨기기는 SubHeader 컴포넌트에서 처리

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

      // 영수증/계산서 발행 드롭다운 외부 클릭 시
      if (
        invoiceDropdownRef.current &&
        !invoiceDropdownRef.current.contains(target)
      ) {
        setIsInvoiceDropdownOpen(false);
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
      {/* 파트너 전용 서브헤더 */}
      <PartnerSubHeader />

      {/* 메인 컨텐츠 */}
      <main
        className={`${styles.main_content} ${
          activeTab === "card" ? styles.main_content_with_fixed_button : ""
        }`}
      >
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
                      국민은행 659401-01-490957<br className={styles.mobile_br} /> (주)청명종합광고기획
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

                {/* 영수증/계산서 발행 - 드롭다운 선택 */}
                <div className={styles.form_section}>
                  <label
                    className={styles.section_label}
                    htmlFor="invoice_type_select"
                  >
                    영수증/계산서 발행
                  </label>
                  <div
                    className={customDropdownStyles.custom_dropdown}
                    ref={invoiceDropdownRef}
                  >
                    <button
                      id="invoice_type_select"
                      type="button"
                      className={customDropdownStyles.dropdown_button}
                      aria-haspopup="listbox"
                      aria-expanded={isInvoiceDropdownOpen}
                      onClick={() => setIsInvoiceDropdownOpen((o) => !o)}
                    >
                      <span
                        className={customDropdownStyles.dropdown_text}
                        data-placeholder="옵션 선택"
                      >
                        {invoiceType === "none"
                          ? "미발행"
                          : invoiceType === "cash_income"
                          ? "현금영수증 (소득공제)"
                          : invoiceType === "cash_expense"
                          ? "현금영수증 (지출증빙)"
                          : "세금계산서"}
                      </span>
                      <img
                        src="/images/icons/dropdown_arrow.svg"
                        alt=""
                        className={`${customDropdownStyles.dropdown_arrow} ${
                          isInvoiceDropdownOpen
                            ? customDropdownStyles.rotated
                            : ""
                        }`}
                      />
                    </button>
                    {isInvoiceDropdownOpen && (
                      <div
                        className={customDropdownStyles.dropdown_options}
                        role="listbox"
                        aria-label="영수증/계산서 발행 옵션"
                      >
                        <button
                          type="button"
                          role="option"
                          aria-selected={invoiceType === "none"}
                          className={customDropdownStyles.dropdown_option}
                          onClick={() => {
                            setInvoiceType("none");
                            setIsInvoiceDropdownOpen(false);
                          }}
                        >
                          미발행
                        </button>
                        <button
                          type="button"
                          role="option"
                          aria-selected={invoiceType === "cash_income"}
                          className={customDropdownStyles.dropdown_option}
                          onClick={() => {
                            setInvoiceType("cash_income");
                            setIsInvoiceDropdownOpen(false);
                          }}
                        >
                          현금영수증 (소득공제)
                        </button>
                        <button
                          type="button"
                          role="option"
                          aria-selected={invoiceType === "cash_expense"}
                          className={customDropdownStyles.dropdown_option}
                          onClick={() => {
                            setInvoiceType("cash_expense");
                            setIsInvoiceDropdownOpen(false);
                          }}
                        >
                          현금영수증 (지출증빙)
                        </button>
                        <button
                          type="button"
                          role="option"
                          aria-selected={invoiceType === "tax_invoice"}
                          className={customDropdownStyles.dropdown_option}
                          onClick={() => {
                            setInvoiceType("tax_invoice");
                            setIsInvoiceDropdownOpen(false);
                          }}
                        >
                          세금계산서
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
              </article>

              <article className={styles.content_container}>
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

                {/* 사업자 정보 (세금계산서 발행 선택 시에만 표시) */}
                {invoiceType === "tax_invoice" && (
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

                {/* 현금영수증 (소득공제) 정보 입력 섹션 */}
                {invoiceType === "cash_income" && (
                  <>
                    <h3 className={styles.content_title}>기본 정보</h3>
                    <div className={styles.form_section}>
                      <label
                        className={styles.section_label}
                        htmlFor="cash_receipt_name_input"
                      >
                        이름
                      </label>
                      <input
                        id="cash_receipt_name_input"
                        type="text"
                        className={styles.input_box}
                        placeholder="이름 입력"
                        value={cashReceiptIncome.name}
                        onChange={(e) =>
                          setCashReceiptIncome((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className={styles.form_section}>
                      <label
                        className={styles.section_label}
                        htmlFor="cash_receipt_phone_input"
                      >
                        휴대폰 번호
                      </label>
                      <input
                        id="cash_receipt_phone_input"
                        type="text"
                        className={styles.input_box}
                        placeholder="휴대폰 번호 입력"
                        value={cashReceiptIncome.phone}
                        onChange={(e) =>
                          setCashReceiptIncome((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </>
                )}

                {/* 현금영수증 (지출증빙) 정보 입력 섹션 */}
                {invoiceType === "cash_expense" && (
                  <>
                    <h3 className={styles.content_title}>기본 정보</h3>
                    <div className={styles.form_section}>
                      <label
                        className={styles.section_label}
                        htmlFor="cash_receipt_company_input"
                      >
                        상호명
                      </label>
                      <input
                        id="cash_receipt_company_input"
                        type="text"
                        className={styles.input_box}
                        placeholder="상호명 입력"
                        value={cashReceiptExpense.company_name}
                        onChange={(e) =>
                          setCashReceiptExpense((prev) => ({
                            ...prev,
                            company_name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className={styles.form_section}>
                      <label
                        className={styles.section_label}
                        htmlFor="cash_receipt_business_input"
                      >
                        사업자등록번호
                      </label>
                      <input
                        id="cash_receipt_business_input"
                        type="text"
                        className={styles.input_box}
                        placeholder="사업자등록번호 입력"
                        value={cashReceiptExpense.business_number}
                        onChange={(e) =>
                          setCashReceiptExpense((prev) => ({
                            ...prev,
                            business_number: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </>
                )}

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

          {/* 페이지 하단 단일 버튼
              - 무통장 입금: 일반 흐름 (고정 X)
              - 신용카드 결제: 화면 하단 고정 (PC/모바일) */}
          <div
            className={`${styles.submit_button_section} ${
              activeTab === "card" ? styles.submit_button_fixed : ""
            }`}
          >
            <button
              className={`${styles.submit_button} ${
                !isButtonEnabled ? styles.disabled : ""
              }`}
              onClick={handleSubmit}
              disabled={!isButtonEnabled}
              aria-disabled={!isButtonEnabled}
            >
              {activeTab === "bank" ? "입금 확인 요청" : "결제"}
            </button>
          </div>
        </div>
      </main>

      {/* 복사 완료 토스트 메시지 */}
      <Toast
        message="복사되었습니다."
        isOpen={showCopyToast}
        onClose={() => setShowCopyToast(false)}
        duration={2000}
      />

      {/* 카드 결제 실패 모달 */}
      <BaseModal
        is_open={cardPaymentFailModal.is_open}
        on_close={() => setCardPaymentFailModal({ is_open: false })}
        message="결제가 실패했습니다.<br>다시 시도하시겠습니까?"
        buttons={["취소", "확인"]}
        on_confirm={handleCardPaymentRetry}
      />

      {/* 카드 결제 성공 모달 */}
      <BaseModal
        is_open={cardPaymentSuccessModal.is_open}
        on_close={handleCardPaymentSuccessClose}
        message={`결제가 완료되었습니다.<br><span style="color: #2DC469;">(보유 포인트: ${successPostPoints.toLocaleString()} P)</span><br>닫기를 누르면 이전 페이지로 돌아갑니다.`}
        buttons={["닫기"]}
      />

      {/* 무통장 입금 신청 모달 */}
      <BaseModal
        is_open={bankDepositModal.is_open}
        on_close={handleBankDepositModalClose}
        message="입금 확인 요청이 등록되었습니다."
        buttons={["닫기"]}
      />
    </div>
  );
}
