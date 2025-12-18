/**
 * AddressInput 컴포넌트 스토리북
 *
 * 주소 입력 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import AddressInput from "./AddressInput";

const meta: Meta<typeof AddressInput> = {
  title: "Partner/Signup/AddressInput",
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
    postalCodeError: {
      description: "우편번호 에러 메시지 (선택적)",
      control: "text",
    },
    addressError: {
      description: "주소 에러 메시지 (선택적)",
      control: "text",
    },
    detailAddressError: {
      description: "상세 주소 에러 메시지 (선택적)",
      control: "text",
    },
    onPostalCodeChange: {
      description: "우편번호 변경 핸들러",
      action: "postal code changed",
    },
    onAddressChange: {
      description: "주소 변경 핸들러",
      action: "address changed",
    },
    onDetailAddressChange: {
      description: "상세 주소 변경 핸들러",
      action: "detail address changed",
    },
    onPostalCodeSearch: {
      description: "우편번호 찾기 핸들러",
      action: "postal code search clicked",
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
  render: (args) => {
    const [postalCode, setPostalCode] = useState("");
    const [address, setAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

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
    onPostalCodeSearch: () => {
      alert("우편번호 찾기 기능");
    },
  },
};

/**
 * 입력값이 있는 상태
 *
 * 주소가 입력된 상태입니다.
 */
export const WithValue: Story = {
  render: (args) => {
    const [postalCode, setPostalCode] = useState("12345");
    const [address, setAddress] = useState("서울특별시 강남구 테헤란로 123");
    const [detailAddress, setDetailAddress] = useState("456호");

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
    onPostalCodeSearch: () => {
      alert("우편번호 찾기 기능");
    },
  },
};

/**
 * 에러 상태
 *
 * 에러 메시지가 표시되는 상태입니다.
 */
export const WithError: Story = {
  render: (args) => {
    const [postalCode, setPostalCode] = useState("");
    const [address, setAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    return (
      <AddressInput
        {...args}
        postalCode={postalCode}
        address={address}
        detailAddress={detailAddress}
        postalCodeError="우편번호를 입력해주세요"
        addressError="주소를 입력해주세요"
        detailAddressError="상세 주소를 입력해주세요"
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
    onPostalCodeSearch: () => {
      alert("우편번호 찾기 기능");
    },
  },
};
