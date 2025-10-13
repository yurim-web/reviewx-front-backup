import { Metadata } from "next";

export const metadata: Metadata = {
  title: "포인트 - ReviewX",
  description: "포인트 관리 페이지",
};

export default function PointLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
