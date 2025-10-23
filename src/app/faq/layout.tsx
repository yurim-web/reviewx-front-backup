import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 자주 묻는 질문",
  description: "자주 묻는 질문을 확인하세요",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


