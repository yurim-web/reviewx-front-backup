import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "가이드 - ReviewX",
  description: "ReviewX 이용 가이드 및 안내",
};

export default function GuidePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>가이드 페이지</h1>
      <p>이곳은 가이드 페이지입니다.</p>
    </main>
  );
}
