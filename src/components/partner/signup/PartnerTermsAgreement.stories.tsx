/**
 * PartnerTermsAgreement 컴포넌트 스토리북
 *
 * 파트너 약관 동의 컴포넌트의 다양한 상태를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import PartnerTermsAgreement from "./PartnerTermsAgreement";

const meta: Meta<typeof PartnerTermsAgreement> = {
  title: "Partner/Signup/PartnerTermsAgreement",
  component: PartnerTermsAgreement,
  tags: ["autodocs"],
  argTypes: {
    allAgreed: {
      description: "전체 동의 여부",
      control: "boolean",
    },
    serviceTermsAgreed: {
      description: "서비스 이용 약관 동의 여부",
      control: "boolean",
    },
    privacyAgreed: {
      description: "개인정보 수집 및 이용 동의 여부",
      control: "boolean",
    },
    thirdPartyAgreed: {
      description: "개인정보 제3자 제공 동의 여부",
      control: "boolean",
    },
    advertisingAgreed: {
      description: "광고 · 홍보 관련 준수 사항 동의 여부",
      control: "boolean",
    },
    marketingAgreed: {
      description: "마케팅 목적의 개인정보 수집 및 이용 동의 여부",
      control: "boolean",
    },
    thirdPartyMarketingAgreed: {
      description: "제3자 정보 제공(마케팅/프로모션 목적) 동의 여부",
      control: "boolean",
    },
    error: {
      description: "에러 메시지 (선택적)",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PartnerTermsAgreement>;

/**
 * 기본 상태
 *
 * 모든 약관이 동의되지 않은 상태입니다.
 */
export const Default: Story = {
  render: (args) => {
    const [allAgreed, setAllAgreed] = useState(false);
    const [serviceTermsAgreed, setServiceTermsAgreed] = useState(false);
    const [privacyAgreed, setPrivacyAgreed] = useState(false);
    const [thirdPartyAgreed, setThirdPartyAgreed] = useState(false);
    const [advertisingAgreed, setAdvertisingAgreed] = useState(false);
    const [marketingAgreed, setMarketingAgreed] = useState(false);
    const [thirdPartyMarketingAgreed, setThirdPartyMarketingAgreed] = useState(false);

    return (
      <PartnerTermsAgreement
        {...args}
        allAgreed={allAgreed}
        serviceTermsAgreed={serviceTermsAgreed}
        privacyAgreed={privacyAgreed}
        thirdPartyAgreed={thirdPartyAgreed}
        advertisingAgreed={advertisingAgreed}
        marketingAgreed={marketingAgreed}
        thirdPartyMarketingAgreed={thirdPartyMarketingAgreed}
        onAllAgreedChange={(checked) => {
          setAllAgreed(checked);
          if (checked) {
            setServiceTermsAgreed(true);
            setPrivacyAgreed(true);
            setThirdPartyAgreed(true);
            setAdvertisingAgreed(true);
            setMarketingAgreed(true);
            setThirdPartyMarketingAgreed(true);
          } else {
            setServiceTermsAgreed(false);
            setPrivacyAgreed(false);
            setThirdPartyAgreed(false);
            setAdvertisingAgreed(false);
            setMarketingAgreed(false);
            setThirdPartyMarketingAgreed(false);
          }
        }}
        onServiceTermsAgreedChange={(checked) => {
          setServiceTermsAgreed(checked);
          args.onServiceTermsAgreedChange?.(checked);
        }}
        onPrivacyAgreedChange={(checked) => {
          setPrivacyAgreed(checked);
          args.onPrivacyAgreedChange?.(checked);
        }}
        onThirdPartyAgreedChange={(checked) => {
          setThirdPartyAgreed(checked);
          args.onThirdPartyAgreedChange?.(checked);
        }}
        onAdvertisingAgreedChange={(checked) => {
          setAdvertisingAgreed(checked);
          args.onAdvertisingAgreedChange?.(checked);
        }}
        onMarketingAgreedChange={(checked) => {
          setMarketingAgreed(checked);
          args.onMarketingAgreedChange?.(checked);
        }}
        onThirdPartyMarketingAgreedChange={(checked) => {
          setThirdPartyMarketingAgreed(checked);
          args.onThirdPartyMarketingAgreedChange?.(checked);
        }}
      />
    );
  },
  args: {},
};

/**
 * 전체 동의 상태
 *
 * 모든 약관이 동의된 상태입니다.
 */
export const AllAgreed: Story = {
  render: (args) => {
    const [allAgreed, setAllAgreed] = useState(true);
    const [serviceTermsAgreed, setServiceTermsAgreed] = useState(true);
    const [privacyAgreed, setPrivacyAgreed] = useState(true);
    const [thirdPartyAgreed, setThirdPartyAgreed] = useState(true);
    const [advertisingAgreed, setAdvertisingAgreed] = useState(true);
    const [marketingAgreed, setMarketingAgreed] = useState(true);
    const [thirdPartyMarketingAgreed, setThirdPartyMarketingAgreed] = useState(true);

    return (
      <PartnerTermsAgreement
        {...args}
        allAgreed={allAgreed}
        serviceTermsAgreed={serviceTermsAgreed}
        privacyAgreed={privacyAgreed}
        thirdPartyAgreed={thirdPartyAgreed}
        advertisingAgreed={advertisingAgreed}
        marketingAgreed={marketingAgreed}
        thirdPartyMarketingAgreed={thirdPartyMarketingAgreed}
        onAllAgreedChange={(checked) => {
          setAllAgreed(checked);
          if (checked) {
            setServiceTermsAgreed(true);
            setPrivacyAgreed(true);
            setThirdPartyAgreed(true);
            setAdvertisingAgreed(true);
            setMarketingAgreed(true);
            setThirdPartyMarketingAgreed(true);
          } else {
            setServiceTermsAgreed(false);
            setPrivacyAgreed(false);
            setThirdPartyAgreed(false);
            setAdvertisingAgreed(false);
            setMarketingAgreed(false);
            setThirdPartyMarketingAgreed(false);
          }
        }}
        onServiceTermsAgreedChange={(checked) => {
          setServiceTermsAgreed(checked);
          args.onServiceTermsAgreedChange?.(checked);
        }}
        onPrivacyAgreedChange={(checked) => {
          setPrivacyAgreed(checked);
          args.onPrivacyAgreedChange?.(checked);
        }}
        onThirdPartyAgreedChange={(checked) => {
          setThirdPartyAgreed(checked);
          args.onThirdPartyAgreedChange?.(checked);
        }}
        onAdvertisingAgreedChange={(checked) => {
          setAdvertisingAgreed(checked);
          args.onAdvertisingAgreedChange?.(checked);
        }}
        onMarketingAgreedChange={(checked) => {
          setMarketingAgreed(checked);
          args.onMarketingAgreedChange?.(checked);
        }}
        onThirdPartyMarketingAgreedChange={(checked) => {
          setThirdPartyMarketingAgreed(checked);
          args.onThirdPartyMarketingAgreedChange?.(checked);
        }}
      />
    );
  },
  args: {},
};

/**
 * 에러 상태
 *
 * 에러 메시지가 표시되는 상태입니다.
 */
export const WithError: Story = {
  render: (args) => {
    const [allAgreed, setAllAgreed] = useState(false);
    const [serviceTermsAgreed, setServiceTermsAgreed] = useState(false);
    const [privacyAgreed, setPrivacyAgreed] = useState(false);
    const [thirdPartyAgreed, setThirdPartyAgreed] = useState(false);
    const [advertisingAgreed, setAdvertisingAgreed] = useState(false);
    const [marketingAgreed, setMarketingAgreed] = useState(false);
    const [thirdPartyMarketingAgreed, setThirdPartyMarketingAgreed] = useState(false);

    return (
      <PartnerTermsAgreement
        {...args}
        allAgreed={allAgreed}
        serviceTermsAgreed={serviceTermsAgreed}
        privacyAgreed={privacyAgreed}
        thirdPartyAgreed={thirdPartyAgreed}
        advertisingAgreed={advertisingAgreed}
        marketingAgreed={marketingAgreed}
        thirdPartyMarketingAgreed={thirdPartyMarketingAgreed}
        error="필수 약관에 동의해주세요"
        onAllAgreedChange={(checked) => {
          setAllAgreed(checked);
          if (checked) {
            setServiceTermsAgreed(true);
            setPrivacyAgreed(true);
            setThirdPartyAgreed(true);
            setAdvertisingAgreed(true);
            setMarketingAgreed(true);
            setThirdPartyMarketingAgreed(true);
          } else {
            setServiceTermsAgreed(false);
            setPrivacyAgreed(false);
            setThirdPartyAgreed(false);
            setAdvertisingAgreed(false);
            setMarketingAgreed(false);
            setThirdPartyMarketingAgreed(false);
          }
        }}
        onServiceTermsAgreedChange={(checked) => {
          setServiceTermsAgreed(checked);
          args.onServiceTermsAgreedChange?.(checked);
        }}
        onPrivacyAgreedChange={(checked) => {
          setPrivacyAgreed(checked);
          args.onPrivacyAgreedChange?.(checked);
        }}
        onThirdPartyAgreedChange={(checked) => {
          setThirdPartyAgreed(checked);
          args.onThirdPartyAgreedChange?.(checked);
        }}
        onAdvertisingAgreedChange={(checked) => {
          setAdvertisingAgreed(checked);
          args.onAdvertisingAgreedChange?.(checked);
        }}
        onMarketingAgreedChange={(checked) => {
          setMarketingAgreed(checked);
          args.onMarketingAgreedChange?.(checked);
        }}
        onThirdPartyMarketingAgreedChange={(checked) => {
          setThirdPartyMarketingAgreed(checked);
          args.onThirdPartyMarketingAgreedChange?.(checked);
        }}
      />
    );
  },
  args: {},
};
