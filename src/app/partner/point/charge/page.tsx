"use client";

/* ========================================
   💰 파트너 포인트 충전 페이지
   ======================================== */

/**
 * 파트너 포인트 충전 페이지
 *
 * 목적: 파트너가 캠페인 운영을 위해 포인트를 충전하는 페이지입니다.
 *
 * 사용 페이지:
 * - /partner/point/charge
 */

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import PartnerSubHeader from "@/components/fragments/PartnerSubHeader";
import PageTitle from "@/components/fragments/PageTitle";
import Toast from "@/components/common/toast/Toast";
import BaseModal from "@/components/common/modal/BaseModal";
import PartnerChargeTermsModal from "@/components/partner/point/PartnerChargeTermsModal";
import AmountDropdown from "@/components/partner/point/AmountDropdown";
import InvoiceTypeDropdown, {
  type InvoiceType,
} from "@/components/partner/point/InvoiceTypeDropdown";
import BankDropdown from "@/components/partner/point/BankDropdown";
import { validateAmount } from "@/utils/validation/amount";
import { formatPhone, formatBusinessNumber } from "@/utils/formatting/input";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import chargeBaseStyles from "@/styles/partner/point/charge_base.module.css";
import chargeTabsStyles from "@/styles/partner/point/charge_tabs.module.css";
import chargeAccountStyles from "@/styles/partner/point/charge_account.module.css";
import chargeSubmitStyles from "@/styles/partner/point/charge_submit.module.css";
import chargeTermsStyles from "@/styles/partner/point/charge_terms.module.css";
import Loading from "@/app/loading";
import { useAuth } from "@/hooks/useAuth";
import { usePartnerPointList } from "@/hooks/partner/point/usePartnerPoints";
import { usePartnerCharge } from "@/hooks/partner/point/usePartnerCharge";
import type { ReceiptType } from "@/types/api/partnerPoint";
import { REFUND_BANKS } from "./constants";

const styles = {
  ...chargeBaseStyles,
  ...chargeTabsStyles,
  ...chargeAccountStyles,
  ...chargeSubmitStyles,
  ...chargeTermsStyles,
};

/**
 * 파트너 포인트 충전 페이지
 */
export default function PartnerPointChargePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { summary, isLoading: isPointLoading } = usePartnerPointList("ALL");
  const chargeMutation = usePartnerCharge();
  const [chargeAmount, setChargeAmount] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"bank" | "card">("bank");

  const handleTabChange = (tab: "bank" | "card") => {
    setActiveTab(tab);
    setChargeAmount("");
    setSelectedAmount(null);
    setAgreeTerms(false);
    setDepositorName("");
    setInvoiceType("cash_income");
    setRefundBank("");
    setRefundAccountNumber("");
    setRefundAccountHolder("");
    setCashReceiptIncome({ name: "", phone: "" });
    setCashReceiptExpense({ company_name: "", business_number: "" });
  };
  const [depositorName, setDepositorName] = useState<string>("");
  // 영수증/계산서 발행 옵션: "none" (미발행), "cash_income" (현금영수증 소득공제), "cash_expense" (현금영수증 지출증빙), "tax_invoice" (세금계산서)
  // 초기값: 현금영수증 (소득공제)로 설정
  const [invoiceType, setInvoiceType] = useState<InvoiceType>("cash_income");
  const [isBankAmountOpen, setIsBankAmountOpen] = useState<boolean>(false);
  const [isCardAmountOpen, setIsCardAmountOpen] = useState<boolean>(false);
  const [isInvoiceDropdownOpen, setIsInvoiceDropdownOpen] = useState<boolean>(false);
  const [isRefundBankDropdownOpen, setIsRefundBankDropdownOpen] = useState<boolean>(false);
  const [showCopyToast, setShowCopyToast] = useState<boolean>(false);

  // 환불 정보 (무통장 입금 - Figma 4129-17244)
  const [refundBank, setRefundBank] = useState<string>("");
  const [refundAccountNumber, setRefundAccountNumber] = useState<string>("");
  const [refundAccountHolder, setRefundAccountHolder] = useState<string>("");

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

  // 결제·환불 및 이용약관 보기 모달 상태
  const [charge_terms_modal_open, set_charge_terms_modal_open] = useState<boolean>(false);

  // 드롭다운 ref - 외부 클릭 감지용
  const bankDropdownRef = useRef<HTMLDivElement>(null);
  const cardDropdownRef = useRef<HTMLDivElement>(null);
  const invoiceDropdownRef = useRef<HTMLDivElement>(null);
  const refundBankDropdownRef = useRef<HTMLDivElement>(null);

  // invoiceType을 결제 내역 타입으로 변환
  const getTaxInvoiceType = ():
    | "미발행"
    | "세금계산서"
    | "현금영수증 (소득공제)"
    | "현금영수증 (지출증빙)" => {
    if (invoiceType === "none") return "미발행";
    if (invoiceType === "tax_invoice") return "세금계산서";
    if (invoiceType === "cash_income") return "현금영수증 (소득공제)";
    if (invoiceType === "cash_expense") return "현금영수증 (지출증빙)";
    return "미발행";
  };

  // 프론트엔드 InvoiceType → 백엔드 ReceiptType 변환
  const toReceiptType = (type: InvoiceType): ReceiptType => {
    const map: Record<InvoiceType, ReceiptType> = {
      none: "NONE",
      cash_income: "CASH_RECEIPT_INCOME",
      cash_expense: "CASH_RECEIPT_EXPENSE",
      tax_invoice: "TAX_INVOICE",
    };
    return map[type];
  };

  const partnerInfo = {
    availablePoints: summary.available_points,
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
      maxAmount: MAX_AMOUNT,
    });
    return validation.isValid;
  };

  // 무통장 입금 버튼 활성화 조건: 모든 필수 입력 채워져야 활성화
  const isBankButtonEnabled = () => {
    if (!isValidAmount()) return false;
    if (!depositorName.trim()) return false;
    if (!agreeTerms) return false;
    // 환불 정보 필수
    if (!refundBank.trim()) return false;
    if (!refundAccountNumber.trim()) return false;
    if (!refundAccountHolder.trim()) return false;
    // 영수증/계산서 타입별 기본 정보 필수
    if (invoiceType === "cash_income") {
      if (!cashReceiptIncome.name.trim()) return false;
      if (!cashReceiptIncome.phone.trim()) return false;
    }
    if (invoiceType === "cash_expense") {
      if (!cashReceiptExpense.company_name.trim()) return false;
      if (!cashReceiptExpense.business_number.trim()) return false;
    }
    return true;
  };

  // 신용카드 결제 버튼 활성화 조건: 금액 + 약관 동의
  const isCardButtonEnabled = () => {
    if (!isValidAmount()) return false;
    if (!agreeTerms) return false;
    return true;
  };

  const isButtonEnabled = activeTab === "bank" ? isBankButtonEnabled() : isCardButtonEnabled();

  /**
   * 카드 결제 처리
   * POST /partner/points/charge (paymentMethod: "CARD")
   */
  const handleCardPayment = () => {
    if (!user?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    chargeMutation.mutate(
      {
        paymentMethod: "CARD",
        amount: chargePoints,
        agreeToTerms: agreeTerms,
      },
      {
        onSuccess: () => {
          setCardPaymentSuccessModal({ is_open: true });
        },
        onError: () => {
          setCardPaymentFailModal({ is_open: true });
        },
      }
    );
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

    // 이전 페이지로 돌아가기
    router.back();
  };

  /**
   * 무통장 입금 신청 처리
   * POST /partner/points/charge (paymentMethod: "BANK_TRANSFER")
   */
  const handleBankDepositSubmit = () => {
    if (!user?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    // name/phoneNumber: 백엔드에서 항상 필수(Y)이므로
    // receiptType에 따라 적절한 값을 전송
    let name = "";
    let phoneNumber = "";
    if (invoiceType === "cash_income") {
      name = cashReceiptIncome.name;
      phoneNumber = cashReceiptIncome.phone.replace(/-/g, "");
    } else if (invoiceType === "cash_expense") {
      name = cashReceiptExpense.company_name;
      phoneNumber = cashReceiptExpense.business_number.replace(/-/g, "");
    } else if (invoiceType === "tax_invoice") {
      name = user?.name || "";
      phoneNumber = "";
    }

    chargeMutation.mutate(
      {
        paymentMethod: "BANK_TRANSFER",
        amount: chargePoints,
        agreeToTerms: agreeTerms,
        depositorName,
        receiptType: toReceiptType(invoiceType),
        name,
        phoneNumber,
        refundBank,
        refundAccountNumber,
        refundAccountHolder,
      },
      {
        onSuccess: () => {
          setBankDepositModal({ is_open: true });
        },
        onError: () => {
          alert("입금 확인 요청에 실패했습니다. 다시 시도해주세요.");
        },
      }
    );
  };

  /**
   * 무통장 입금 신청 모달에서 닫기 클릭
   */
  const handleBankDepositModalClose = () => {
    setBankDepositModal({ is_open: false });

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
  useOutsideClick([bankDropdownRef, cardDropdownRef], () => {
    setIsBankAmountOpen(false);
    setIsCardAmountOpen(false);
  });

  useOutsideClick([invoiceDropdownRef], () => {
    setIsInvoiceDropdownOpen(false);
  });

  useOutsideClick([refundBankDropdownRef], () => {
    setIsRefundBankDropdownOpen(false);
  });

  if (isPointLoading) return <Loading />;

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
          <article className={styles.tab_section} role="tablist" aria-label="결제 방식 선택">
            <button
              role="tab"
              aria-selected={activeTab === "bank"}
              className={`${styles.tab_button} ${activeTab === "bank" ? styles.tab_active : ""}`}
              onClick={() => handleTabChange("bank")}
            >
              무통장 입금
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "card"}
              className={`${styles.tab_button} ${activeTab === "card" ? styles.tab_active : ""}`}
              onClick={() => handleTabChange("card")}
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
                      국민은행 659401-01-490957
                      <br className={styles.mobile_br} /> (주)청명종합광고기획
                    </span>
                    <button
                      className={styles.copy_button}
                      onClick={async () => {
                        await navigator.clipboard.writeText(partnerInfo.bankAccount);
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
                    • 아래 계좌로 신청할 금액을 입금 후 결제 포인트 충전 요청을 진행해 주세요.
                  </li>
                </ul>
              </article>

              <article className={styles.content_container}>
                <h2 className={styles.content_title}>입금 확인</h2>

                {/* 신청 금액 */}
                <div className={styles.form_section}>
                  <label className={styles.section_label} htmlFor="bank_amount_select">
                    신청 금액
                  </label>
                  <AmountDropdown
                    id="bank_amount_select"
                    label="신청 금액"
                    selectedAmount={selectedAmount}
                    isOpen={isBankAmountOpen}
                    onToggle={() => setIsBankAmountOpen((o) => !o)}
                    onSelect={(amount) => {
                      handleAmountOptionClick(amount);
                      setIsBankAmountOpen(false);
                    }}
                    dropdownRef={bankDropdownRef}
                  />
                </div>

                {/* 신청 후 포인트 */}
                <div className={styles.form_section}>
                  <label className={styles.section_label} htmlFor="post_points_display">
                    신청 후 포인트
                  </label>
                  <div id="post_points_display" className={styles.read_only_box}>
                    {postPoints.toLocaleString()}
                  </div>
                </div>

                {/* 입금자명 */}
                <div className={styles.form_section}>
                  <label className={styles.section_label} htmlFor="depositor_name_input">
                    입금자명
                  </label>
                  <input
                    id="depositor_name_input"
                    type="text"
                    className={styles.input_box}
                    value={depositorName}
                    onChange={(e) => setDepositorName(e.target.value)}
                  />
                </div>

                {/* 영수증/계산서 발행 - 드롭다운 선택 */}
                <div className={styles.form_section}>
                  <label className={styles.section_label} htmlFor="invoice_type_select">
                    영수증/계산서 발행
                  </label>
                  <InvoiceTypeDropdown
                    id="invoice_type_select"
                    selectedType={invoiceType}
                    isOpen={isInvoiceDropdownOpen}
                    onToggle={() => setIsInvoiceDropdownOpen((o) => !o)}
                    onSelect={(type) => {
                      setInvoiceType(type);
                      setIsInvoiceDropdownOpen(false);
                    }}
                    dropdownRef={invoiceDropdownRef}
                  />
                </div>
              </article>

              <article className={styles.content_container}>
                {/* 약관 동의 */}
                <div className={styles.form_section}>
                  <span className={styles.section_label}>결제 · 환불 및 이용약관 동의</span>

                  <div className={`${styles.checkbox_row} ${styles.checkbox_row_agree}`}>
                    <div className={styles.checkbox_container}>
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <label htmlFor="agreeTerms">구매 조건 확인 및 결제 진행에 동의합니다.</label>
                    </div>

                    <button
                      type="button"
                      className={styles.terms_button}
                      onClick={() => set_charge_terms_modal_open(true)}
                      aria-label="결제·환불 및 이용약관 보기"
                    >
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
                      <div className={styles.read_only_box}>{partnerInfo.companyName}</div>
                    </div>
                    <div className={styles.form_section}>
                      <label className={styles.section_label}>대표자명</label>
                      <div className={styles.read_only_box}>{partnerInfo.ownerName}</div>
                    </div>
                    <div className={styles.form_section}>
                      <label className={styles.section_label}>사업자등록번호</label>
                      <div className={styles.read_only_box}>{partnerInfo.businessNumber}</div>
                    </div>
                    {/* 주소 */}
                    <div className={styles.form_section}>
                      <label className={styles.section_label}>주소</label>
                      <div className={styles.read_only_box}>{partnerInfo.address}</div>
                    </div>
                  </>
                )}

                {/* 현금영수증 (소득공제) 정보 입력 섹션 - 한 블록 */}
                {invoiceType === "cash_income" && (
                  <div className={styles.content_block}>
                    <h3 className={styles.content_title}>기본 정보</h3>
                    <div className={styles.form_section}>
                      <label className={styles.section_label} htmlFor="cash_receipt_name_input">
                        이름
                      </label>
                      <input
                        id="cash_receipt_name_input"
                        type="text"
                        className={styles.input_box}
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
                      <label className={styles.section_label} htmlFor="cash_receipt_phone_input">
                        휴대폰 번호
                      </label>
                      <input
                        id="cash_receipt_phone_input"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        className={styles.input_box}
                        placeholder="- 제외 입력"
                        value={cashReceiptIncome.phone}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          setCashReceiptIncome((prev) => ({
                            ...prev,
                            phone: formatted,
                          }));
                        }}
                        maxLength={13}
                      />
                    </div>
                  </div>
                )}

                {/* 현금영수증 (지출증빙) 정보 입력 섹션 - 한 블록 */}
                {invoiceType === "cash_expense" && (
                  <div className={styles.content_block}>
                    <h3 className={styles.content_title}>기본 정보</h3>
                    <div className={styles.form_section}>
                      <label className={styles.section_label} htmlFor="cash_receipt_company_input">
                        상호명
                      </label>
                      <input
                        id="cash_receipt_company_input"
                        type="text"
                        className={styles.input_box}
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
                      <label className={styles.section_label} htmlFor="cash_receipt_business_input">
                        사업자등록번호
                      </label>
                      <input
                        id="cash_receipt_business_input"
                        type="text"
                        inputMode="numeric"
                        className={styles.input_box}
                        placeholder="- 제외 입력"
                        value={cashReceiptExpense.business_number}
                        onChange={(e) => {
                          const formatted = formatBusinessNumber(e.target.value);
                          setCashReceiptExpense((prev) => ({
                            ...prev,
                            business_number: formatted,
                          }));
                        }}
                        maxLength={12}
                      />
                    </div>
                  </div>
                )}

                {/* 환불 정보 (Figma 4129-17244) - 한 블록 */}
                <div className={styles.content_block}>
                  <h3 className={styles.content_title}>환불 정보</h3>
                  <div className={styles.form_section}>
                    <label className={styles.section_label} htmlFor="refund_bank_select">
                      은행
                    </label>
                    <BankDropdown
                      id="refund_bank_select"
                      label="환불 은행 선택"
                      selectedBank={refundBank}
                      isOpen={isRefundBankDropdownOpen}
                      onToggle={() => setIsRefundBankDropdownOpen((o) => !o)}
                      onSelect={(bank) => {
                        setRefundBank(bank);
                        setIsRefundBankDropdownOpen(false);
                      }}
                      banks={REFUND_BANKS}
                      dropdownRef={refundBankDropdownRef}
                    />
                  </div>
                  <div className={styles.form_section}>
                    <label className={styles.section_label} htmlFor="refund_account_number_input">
                      계좌번호
                    </label>
                    <input
                      id="refund_account_number_input"
                      type="text"
                      inputMode="numeric"
                      className={styles.input_box}
                      placeholder="- 제외 입력"
                      value={refundAccountNumber}
                      onChange={(e) =>
                        setRefundAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 20))
                      }
                    />
                  </div>
                  <div className={styles.form_section}>
                    <label className={styles.section_label} htmlFor="refund_account_holder_input">
                      예금주
                    </label>
                    <input
                      id="refund_account_holder_input"
                      type="text"
                      className={styles.input_box}
                      value={refundAccountHolder}
                      onChange={(e) => setRefundAccountHolder(e.target.value)}
                    />
                  </div>
                </div>

                {/* 입금 안내 사항 */}
                <div className={`${styles.form_section} ${styles.notice_section}`}>
                  <label className={styles.section_label}>입금 안내 사항</label>
                  <ul className={styles.notice_list}>
                    <li>입금 확인 후 승인 처리되어야 포인트를 사용할 수 있습니다.</li>
                    <li>신청 후 24시간 이내 입금 확인이 안 될 경우 신청 내역이 삭제됩니다.</li>
                    <li>환불 계좌는 입금 금액이 다를 경우 환불 처리를 위해 필요합니다.</li>
                    <li>
                      신청 이후 정보 수정이 불가능하며, 잘못 입력된 정보로 인해 발생하는 책임은
                      신청자 본인에게 있습니다.
                    </li>
                    <li>
                      입금자명이 다를 경우 확인이 불가능하며, 1:1 문의를 통해 별도 확인이
                      필요합니다.
                    </li>
                  </ul>
                </div>
              </article>
            </section>
          )}

          {/* 신용카드 결제 탭 - 기존 흐름 유지 */}
          {activeTab === "card" && (
            <section aria-labelledby="card_payment_title" className={styles.bank_section}>
              <article className={styles.content_container}>
                <h2 id="card_payment_title" className={styles.content_title}>
                  결제 진행
                </h2>

                {/* 신청 금액 - 드롭다운 선택 */}
                <div className={styles.form_section}>
                  <label className={styles.section_label} htmlFor="card_amount_select">
                    신청 금액
                  </label>
                  <AmountDropdown
                    id="card_amount_select"
                    label="신청 금액"
                    selectedAmount={selectedAmount}
                    isOpen={isCardAmountOpen}
                    onToggle={() => setIsCardAmountOpen((o) => !o)}
                    onSelect={(amount) => {
                      handleAmountOptionClick(amount);
                      setIsCardAmountOpen(false);
                    }}
                    dropdownRef={cardDropdownRef}
                  />
                </div>

                {/* 신청 후 포인트 */}
                <div className={styles.form_section}>
                  <label className={styles.section_label} htmlFor="card_post_points">
                    신청 후 포인트
                  </label>
                  <div id="card_post_points" className={styles.read_only_box}>
                    {postPoints.toLocaleString()}
                  </div>
                </div>

                {/* 약관 동의 */}
                <div className={styles.form_section}>
                  <span className={styles.section_label}>결제 · 환불 및 이용약관 동의</span>

                  <div className={`${styles.checkbox_row} ${styles.checkbox_row_agree}`}>
                    <div className={styles.checkbox_container}>
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <label htmlFor="agreeTerms">구매 조건 확인 및 결제 진행에 동의합니다.</label>
                    </div>

                    <button
                      type="button"
                      className={styles.terms_button}
                      onClick={() => set_charge_terms_modal_open(true)}
                      aria-label="결제·환불 및 이용약관 보기"
                    >
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
              className={`${styles.submit_button} ${!isButtonEnabled || chargeMutation.isPending ? styles.disabled : ""}`}
              onClick={handleSubmit}
              disabled={!isButtonEnabled || chargeMutation.isPending}
              aria-disabled={!isButtonEnabled || chargeMutation.isPending}
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
        message={`결제가 완료되었습니다.<br><span style="color: #2DC469;">(보유 포인트: ${successPostPoints.toLocaleString()} P)</span>`}
        buttons={["닫기"]}
      />

      {/* 무통장 입금 신청 모달 */}
      <BaseModal
        is_open={bankDepositModal.is_open}
        on_close={handleBankDepositModalClose}
        message="입금 확인 요청이 등록되었습니다."
        buttons={["닫기"]}
      />

      {/* 결제·환불 및 이용약관 보기 모달 */}
      <PartnerChargeTermsModal
        is_open={charge_terms_modal_open}
        on_close={() => set_charge_terms_modal_open(false)}
      />
    </div>
  );
}
