import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ReviewX | 관리자 로그인",
};

export default function ManagerLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
