/* ========================================
   💰 금액 선택 드롭다운 컴포넌트
   ======================================== */

/**
 * 금액 선택 드롭다운 컴포넌트
 *
 * 목적: 포인트 충전 금액을 선택하는 드롭다운
 *
 * 사용 페이지:
 * - /partner/point/charge (무통장 입금)
 * - /partner/point/charge (카드 결제)
 */

import { useRef, RefObject } from "react";
import Image from "next/image";
import customDropdownStyles from "@/styles/partner/campaign_create/custom_dropdown.module.css";

interface AmountDropdownProps {
  id: string;
  label: string;
  selectedAmount: number | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (amount: number) => void;
  dropdownRef?: RefObject<HTMLDivElement | null>;
}

const AMOUNT_OPTIONS = [50000, 100000, 150000, 200000, 300000, 500000, 1000000];

export default function AmountDropdown({
  id,
  label,
  selectedAmount,
  isOpen,
  onToggle,
  onSelect,
  dropdownRef,
}: AmountDropdownProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = dropdownRef || internalRef;

  return (
    <div className={customDropdownStyles.custom_dropdown} ref={ref}>
      <button
        id={id}
        type="button"
        className={customDropdownStyles.dropdown_button}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className={customDropdownStyles.dropdown_text} data-placeholder="금액 선택">
          {selectedAmount ? selectedAmount.toLocaleString() : ""}
        </span>
        <Image
          src="/images/icons/dropdown_arrow.svg"
          alt=""
          className={`${customDropdownStyles.dropdown_arrow} ${
            isOpen ? customDropdownStyles.rotated : ""
          }`}
          width={16}
          height={16}
        />
      </button>
      {isOpen && (
        <div className={customDropdownStyles.dropdown_options} role="listbox" aria-label={label}>
          {AMOUNT_OPTIONS.map((amount) => (
            <button
              key={amount}
              type="button"
              role="option"
              aria-selected={selectedAmount === amount}
              className={customDropdownStyles.dropdown_option}
              onClick={() => onSelect(amount)}
            >
              {amount.toLocaleString()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
