import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ReviewX | 배송형 캠페인",
};

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
