import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 파트너 대시보드",
  description: "파트너 대시보드",
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
