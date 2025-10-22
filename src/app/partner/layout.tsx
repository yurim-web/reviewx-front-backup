import { Metadata } from "next";
import PartnerHeader from "@/components/fragments/PartnerHeader";

export const metadata: Metadata = {
  title: "ReviewX | 파트너 캠페인 관리",
  description: "파트너 캠페인 관리 플랫폼입니다",
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PartnerHeader />
      {children}
    </>
  );
}
