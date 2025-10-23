import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReviewX | 파트너 마이페이지",
  description: "파트너 마이페이지",
};

export default function PartnerMypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
