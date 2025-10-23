"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SubHeader from "@/components/fragments/SubHeader";
import styles from "../../../../styles/user/mypage/edit_profile.module.css";

export default function PartnerEditProfilePage() {
  const [formData, setFormData] = useState({
    companyName: "리뷰엑스 주식회사",
    managerName: "홍길동",
    managerEmail: "partner@example.com",
    phone: "",
    businessNumber: "000-00-00000",
    accountHolder: "리뷰엑스",
    bank: "우리은행",
    accountNumber: "000000000000",
  });

  const [isPhoneVerified, setIsPhoneVerified] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbersOnly = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    let formatted = "";
    if (numbersOnly.length >= 1) {
      formatted = numbersOnly.slice(0, 3);
      if (numbersOnly.length >= 4) {
        formatted += "-" + numbersOnly.slice(3, 7);
        if (numbersOnly.length >= 8) {
          formatted += "-" + numbersOnly.slice(7, 11);
        }
      }
    }
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const isValidPhoneNumber = (phone: string) => /^010-\d{4}-\d{4}$/.test(phone);

  const handleVerificationRequest = () => {
    if (!isValidPhoneNumber(formData.phone)) {
      alert("올바른 휴대폰 번호 형식을 입력해주세요. (예: 010-0000-0000)");
      return;
    }
    console.log("인증번호 요청");
  };

  const isSaveEnabled = [
    formData.phone.trim(),
    formData.accountHolder.trim(),
    formData.bank.trim(),
    formData.accountNumber.trim(),
  ].every((v) => v.length > 0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  return (
    <div className={styles.edit_profile_container}>
      <SubHeader />
      <main className={styles.main_content}>
        <h1 className={styles.page_title}>내 정보 수정</h1>

        <section className={styles.section_container}>
          <h2 className={styles.section_title}>기본 정보</h2>

          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="companyName">
              회사명
            </label>
            <input
              id="companyName"
              name="companyName"
              className={styles.input_field}
              value={formData.companyName}
              onChange={handleInputChange}
            />
          </article>

          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="managerName">
              담당자명
            </label>
            <input
              id="managerName"
              name="managerName"
              className={styles.input_field}
              value={formData.managerName}
              onChange={handleInputChange}
            />
          </article>

          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="managerEmail">
              담당자 이메일
            </label>
            <input
              id="managerEmail"
              name="managerEmail"
              type="email"
              className={styles.input_field}
              value={formData.managerEmail}
              onChange={handleInputChange}
            />
          </article>

          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="phone">
              휴대폰 번호<span className={styles.required_asterisk}>*</span>
            </label>
            <div className={styles.input_with_button}>
              <div className={styles.phone_input_container}>
                <input
                  id="phone"
                  name="phone"
                  className={styles.input_field}
                  value={formData.phone}
                  onChange={handlePhoneInputChange}
                  placeholder="010-0000-0000"
                />
                {isPhoneVerified && (
                  <div className={styles.phone_check_icon}>
                    <Image
                      src="/images/icons/phone_verified.svg"
                      alt="인증 완료"
                      width={16}
                      height={16}
                    />
                  </div>
                )}
              </div>
              <button
                className={styles.verification_button}
                onClick={handleVerificationRequest}
              >
                인증번호 받기
              </button>
            </div>
          </article>

          <h3 className={styles.section_subtitle}>사업자 정보</h3>
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="businessNumber">
              사업자등록번호
            </label>
            <input
              id="businessNumber"
              name="businessNumber"
              className={styles.input_field}
              value={formData.businessNumber}
              onChange={handleInputChange}
            />
          </article>

          <h3 className={styles.section_subtitle}>정산 계좌</h3>
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="accountHolder">
              예금주<span className={styles.required_asterisk}>*</span>
            </label>
            <input
              id="accountHolder"
              name="accountHolder"
              className={styles.input_field}
              value={formData.accountHolder}
              onChange={handleInputChange}
            />
          </article>
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="bank">
              은행<span className={styles.required_asterisk}>*</span>
            </label>
            <input
              id="bank"
              name="bank"
              className={styles.input_field}
              value={formData.bank}
              onChange={handleInputChange}
            />
          </article>
          <article className={styles.field_article}>
            <label className={styles.field_label} htmlFor="accountNumber">
              계좌번호<span className={styles.required_asterisk}>*</span>
            </label>
            <input
              id="accountNumber"
              name="accountNumber"
              className={styles.input_field}
              value={formData.accountNumber}
              onChange={handleInputChange}
            />
          </article>
        </section>

        <div className={styles.save_button_container}>
          <button
            className={`${styles.save_button} ${
              !isSaveEnabled ? styles.disabled_button : ""
            }`}
            disabled={!isSaveEnabled}
          >
            저장하기
          </button>
        </div>
      </main>
    </div>
  );
}
