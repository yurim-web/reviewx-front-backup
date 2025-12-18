/**
 * AddressInput 컴포넌트 스토리북
 *
 * 주소 입력 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import AddressInput from "./AddressInput";

const meta: Meta<typeof AddressInput> = {
  title: "Common/MyPage/AddressInput",
  component: AddressInput,
  tags: ["autodocs"],
  argTypes: {
    postalCode: {
      description: "우편번호",
      control: "text",
    },
    address: {
      description: "기본 주소",
      control: "text",
    },
    detailAddress: {
      description: "상세 주소",
      control: "text",
    },
    showRequiredAsterisk: {
      description: "필수 표시(*) 여부",
      control: "boolean",
    },
    postalCodeReadOnly: {
      description: "우편번호 읽기 전용 여부",
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof AddressInput>;

/**
 * 기본 상태
 *
 * 빈 주소 입력 필드입니다.
 */
export const Default: Story = {
  args: {
    postalCode: "",
    address: "",
    detailAddress: "",
    onPostalCodeChange: (value) => console.log("Postal code changed:", value),
    onAddressChange: (value) => console.log("Address changed:", value),
    onDetailAddressChange: (value) =>
      console.log("Detail address changed:", value),
    onPostalCodeSearch: () => console.log("Postal code search clicked"),
    showRequiredAsterisk: false,
    postalCodeReadOnly: false,
  },
};

/**
 * 필수 필드
 *
 * 필수 표시(*)가 있는 주소 입력 필드입니다.
 */
export const Required: Story = {
  args: {
    postalCode: "",
    address: "",
    detailAddress: "",
    onPostalCodeChange: (value) => console.log("Postal code changed:", value),
    onAddressChange: (value) => console.log("Address changed:", value),
    onDetailAddressChange: (value) =>
      console.log("Detail address changed:", value),
    onPostalCodeSearch: () => console.log("Postal code search clicked"),
    showRequiredAsterisk: true,
    postalCodeReadOnly: false,
  },
};

/**
 * 입력된 주소
 *
 * 주소가 입력된 상태입니다.
 */
export const WithValues: Story = {
  args: {
    postalCode: "12345",
    address: "서울특별시 강남구 테헤란로 123",
    detailAddress: "456호",
    onPostalCodeChange: (value) => console.log("Postal code changed:", value),
    onAddressChange: (value) => console.log("Address changed:", value),
    onDetailAddressChange: (value) =>
      console.log("Detail address changed:", value),
    onPostalCodeSearch: () => console.log("Postal code search clicked"),
    showRequiredAsterisk: false,
    postalCodeReadOnly: true,
  },
};

/**
 * 우편번호 찾기 없음
 *
 * 우편번호 찾기 버튼이 없는 상태입니다.
 */
export const WithoutSearchButton: Story = {
  args: {
    postalCode: "",
    address: "",
    detailAddress: "",
    onPostalCodeChange: (value) => console.log("Postal code changed:", value),
    onAddressChange: (value) => console.log("Address changed:", value),
    onDetailAddressChange: (value) =>
      console.log("Detail address changed:", value),
    showRequiredAsterisk: false,
    postalCodeReadOnly: false,
  },
};

/**
 * 인터랙티브 예시
 *
 * 실제로 입력할 수 있는 상태입니다.
 */
export const Interactive: Story = {
  render: (args) => {
    const [postalCode, setPostalCode] = useState(args.postalCode || "");
    const [address, setAddress] = useState(args.address || "");
    const [detailAddress, setDetailAddress] = useState(
      args.detailAddress || ""
    );

    return (
      <AddressInput
        {...args}
        postalCode={postalCode}
        address={address}
        detailAddress={detailAddress}
        onPostalCodeChange={(value) => {
          setPostalCode(value);
          args.onPostalCodeChange?.(value);
        }}
        onAddressChange={(value) => {
          setAddress(value);
          args.onAddressChange?.(value);
        }}
        onDetailAddressChange={(value) => {
          setDetailAddress(value);
          args.onDetailAddressChange?.(value);
        }}
      />
    );
  },
  args: {
    postalCode: "",
    address: "",
    detailAddress: "",
    onPostalCodeChange: (value) => console.log("Postal code changed:", value),
    onAddressChange: (value) => console.log("Address changed:", value),
    onDetailAddressChange: (value) =>
      console.log("Detail address changed:", value),
    onPostalCodeSearch: () => console.log("Postal code search clicked"),
    showRequiredAsterisk: false,
    postalCodeReadOnly: false,
  },
};
