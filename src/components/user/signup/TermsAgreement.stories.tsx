/**
 * TermsAgreement 컴포넌트 스토리북
 *
 * 약관 동의 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  memo,
} from "react";
import TermsAgreement from "./TermsAgreement";

const meta: Meta<typeof TermsAgreement> = {
  title: "User/SignUp/TermsAgreement",
  component: TermsAgreement,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    allAgreed: {
      description: "전체 동의 여부",
      control: "boolean",
    },
    termsAgreed: {
      description: "이용약관 동의 여부",
      control: "boolean",
    },
    privacyAgreed: {
      description: "개인정보 처리방침 동의 여부",
      control: "boolean",
    },
    marketingAgreed: {
      description: "마케팅 정보 수신 동의 여부",
      control: "boolean",
    },
    error: {
      description: "에러 메시지",
      control: "text",
    },
  },
};

export default meta;

type Story = StoryObj<typeof TermsAgreement>;

// Wrapper 컴포넌트: Hook을 사용하기 위해 함수 컴포넌트로 래핑
interface TermsAgreementWrapperProps {
  initialAllAgreed?: boolean;
  initialTermsAgreed?: boolean;
  initialPrivacyAgreed?: boolean;
  initialMarketingAgreed?: boolean;
  error?: string;
}

function TermsAgreementWrapper({
  initialAllAgreed = false,
  initialTermsAgreed = false,
  initialPrivacyAgreed = false,
  initialMarketingAgreed = false,
  error,
}: TermsAgreementWrapperProps) {
  const [allAgreed, setAllAgreed] = useState(initialAllAgreed);
  const [termsAgreed, setTermsAgreed] = useState(initialTermsAgreed);
  const [privacyAgreed, setPrivacyAgreed] = useState(initialPrivacyAgreed);
  const [marketingAgreed, setMarketingAgreed] = useState(
    initialMarketingAgreed
  );

  // 이전 initial 값들을 추적하여 불필요한 업데이트 방지
  const prevInitials = useRef({
    allAgreed: initialAllAgreed,
    termsAgreed: initialTermsAgreed,
    privacyAgreed: initialPrivacyAgreed,
    marketingAgreed: initialMarketingAgreed,
  });

  // args 변경 시에만 상태 업데이트 (깜빡임 방지)
  useEffect(() => {
    const hasChanged =
      prevInitials.current.allAgreed !== initialAllAgreed ||
      prevInitials.current.termsAgreed !== initialTermsAgreed ||
      prevInitials.current.privacyAgreed !== initialPrivacyAgreed ||
      prevInitials.current.marketingAgreed !== initialMarketingAgreed;

    if (hasChanged) {
      setAllAgreed(initialAllAgreed);
      setTermsAgreed(initialTermsAgreed);
      setPrivacyAgreed(initialPrivacyAgreed);
      setMarketingAgreed(initialMarketingAgreed);
      prevInitials.current = {
        allAgreed: initialAllAgreed,
        termsAgreed: initialTermsAgreed,
        privacyAgreed: initialPrivacyAgreed,
        marketingAgreed: initialMarketingAgreed,
      };
    }
  }, [
    initialAllAgreed,
    initialTermsAgreed,
    initialPrivacyAgreed,
    initialMarketingAgreed,
  ]);

  const handleAllAgreedChange = useCallback((checked: boolean) => {
    setAllAgreed(checked);
    setTermsAgreed(checked);
    setPrivacyAgreed(checked);
    setMarketingAgreed(checked);
  }, []);

  const handleTermsAgreedChange = useCallback((checked: boolean) => {
    setTermsAgreed(checked);
    // 함수형 업데이트로 최신 상태값 사용하여 전체 동의 계산
    setPrivacyAgreed((prevPrivacy) => {
      setMarketingAgreed((prevMarketing) => {
        setAllAgreed(checked && prevPrivacy && prevMarketing);
        return prevMarketing;
      });
      return prevPrivacy;
    });
  }, []);

  const handlePrivacyAgreedChange = useCallback((checked: boolean) => {
    setPrivacyAgreed(checked);
    // 함수형 업데이트로 최신 상태값 사용하여 전체 동의 계산
    setTermsAgreed((prevTerms) => {
      setMarketingAgreed((prevMarketing) => {
        setAllAgreed(prevTerms && checked && prevMarketing);
        return prevMarketing;
      });
      return prevTerms;
    });
  }, []);

  const handleMarketingAgreedChange = useCallback((checked: boolean) => {
    setMarketingAgreed(checked);
    // 함수형 업데이트로 최신 상태값 사용하여 전체 동의 계산
    setTermsAgreed((prevTerms) => {
      setPrivacyAgreed((prevPrivacy) => {
        setAllAgreed(prevTerms && prevPrivacy && checked);
        return prevPrivacy;
      });
      return prevTerms;
    });
  }, []);

  const props = useMemo(
    () => ({
      allAgreed,
      termsAgreed,
      privacyAgreed,
      marketingAgreed,
      error,
      onAllAgreedChange: handleAllAgreedChange,
      onTermsAgreedChange: handleTermsAgreedChange,
      onPrivacyAgreedChange: handlePrivacyAgreedChange,
      onMarketingAgreedChange: handleMarketingAgreedChange,
    }),
    [
      allAgreed,
      termsAgreed,
      privacyAgreed,
      marketingAgreed,
      error,
      handleAllAgreedChange,
      handleTermsAgreedChange,
      handlePrivacyAgreedChange,
      handleMarketingAgreedChange,
    ]
  );

  return React.createElement(TermsAgreement, props);
}

// React.memo로 Wrapper 컴포넌트 메모이제이션 (깜빡임 방지)
const MemoizedTermsAgreementWrapper = memo(TermsAgreementWrapper);

// 안정적인 render 함수들 (컴포넌트 외부에 정의하여 깜빡임 방지)
const renderAllAgreed = (args: any) => {
  return React.createElement(MemoizedTermsAgreementWrapper, {
    initialAllAgreed: args.allAgreed ?? true,
    initialTermsAgreed: args.termsAgreed ?? true,
    initialPrivacyAgreed: args.privacyAgreed ?? true,
    initialMarketingAgreed: args.marketingAgreed ?? true,
    error: args.error,
  });
};

const renderPartialAgreed = (args: any) => {
  return React.createElement(MemoizedTermsAgreementWrapper, {
    initialAllAgreed: args.allAgreed ?? false,
    initialTermsAgreed: args.termsAgreed ?? true,
    initialPrivacyAgreed: args.privacyAgreed ?? true,
    initialMarketingAgreed: args.marketingAgreed ?? false,
    error: args.error,
  });
};

const renderWithError = (args: any) => {
  return React.createElement(MemoizedTermsAgreementWrapper, {
    initialAllAgreed: args.allAgreed ?? false,
    initialTermsAgreed: args.termsAgreed ?? false,
    initialPrivacyAgreed: args.privacyAgreed ?? false,
    initialMarketingAgreed: args.marketingAgreed ?? false,
    error: args.error || "약관에 동의해주세요.",
  });
};

// 전체 동의
export const AllAgreed: Story = {
  render: renderAllAgreed,
  args: {
    allAgreed: true,
    termsAgreed: true,
    privacyAgreed: true,
    marketingAgreed: true,
  },
};

// 부분 동의
export const PartialAgreed: Story = {
  render: renderPartialAgreed,
  args: {
    allAgreed: false,
    termsAgreed: true,
    privacyAgreed: true,
    marketingAgreed: false,
  },
};

// 에러 상태
export const WithError: Story = {
  render: renderWithError,
  args: {
    allAgreed: false,
    termsAgreed: false,
    privacyAgreed: false,
    marketingAgreed: false,
    error: "약관에 동의해주세요.",
  },
};
