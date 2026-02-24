/* ========================================
   🏦 환불 은행 선택 드롭다운 컴포넌트
   ======================================== */

/**
 * 환불 은행 선택 드롭다운 컴포넌트
 *
 * 목적: 포인트 충전 시 환불 계좌 은행을 선택하는 드롭다운
 *
 * 사용 위치:
 * - /partner/point/charge (무통장 입금)
 */

import { RefObject } from "react";
import customDropdownStyles from "@/styles/partner/campaign_create/custom_dropdown.module.css";

interface BankDropdownProps {
  id: string;
  label: string;
  selectedBank: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (bank: string) => void;
  banks: readonly string[];
  dropdownRef?: RefObject<HTMLDivElement>;
}

export default function BankDropdown({
  id,
  label,
  selectedBank,
  isOpen,
  onToggle,
  onSelect,
  banks,
  dropdownRef,
}: BankDropdownProps) {
  return (
    <div className={customDropdownStyles.custom_dropdown} ref={dropdownRef}>
      <button
        id={id}
        type="button"
        className={customDropdownStyles.dropdown_button}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span
          className={customDropdownStyles.dropdown_text}
          data-placeholder="은행 선택"
        >
          {selectedBank || ""}
        </span>
        <img
          src="/images/icons/dropdown_arrow.svg"
          alt=""
          className={`${customDropdownStyles.dropdown_arrow} ${
            isOpen ? customDropdownStyles.rotated : ""
          }`}
        />
      </button>
      {isOpen && (
        <div
          className={customDropdownStyles.dropdown_options}
          role="listbox"
          aria-label={label}
        >
          {banks.map((bank) => (
            <button
              key={bank}
              type="button"
              role="option"
              aria-selected={selectedBank === bank}
              className={customDropdownStyles.dropdown_option}
              onClick={() => onSelect(bank)}
            >
              {bank}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
