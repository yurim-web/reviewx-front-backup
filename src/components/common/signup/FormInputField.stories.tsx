import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import FormInputField from "./FormInputField";

const meta: Meta<typeof FormInputField> = {
  title: "Common/Signup/FormInputField",
  component: FormInputField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <FormInputField
        id="name"
        label="이름"
        value={value}
        onChange={setValue}
        placeholder="이름을 입력하세요"
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <FormInputField
        id="email"
        label="이메일"
        type="email"
        value={value}
        onChange={setValue}
        error="올바른 이메일 형식을 입력해주세요"
        placeholder="이메일을 입력하세요"
      />
    );
  },
};

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState("홍길동");
    return <FormInputField id="name" label="이름" value={value} onChange={setValue} />;
  },
};

export const ReadOnly: Story = {
  render: () => {
    const [value] = useState("hong@example.com");
    return (
      <FormInputField
        id="email"
        label="이메일"
        type="email"
        value={value}
        onChange={() => {}}
        readOnly
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value] = useState("홍길동");
    return <FormInputField id="name" label="이름" value={value} onChange={() => {}} disabled />;
  },
};

export const MaxLength: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <FormInputField
        id="name"
        label="이름 (최대 10자)"
        value={value}
        onChange={setValue}
        maxLength={10}
        placeholder="최대 10자까지 입력 가능"
      />
    );
  },
};
