import { SaasCaseDbAccessClient } from "./SaasCaseDbAccessClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SaaS事例データベース",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function SaasCaseDbAccessPage() {
  return <SaasCaseDbAccessClient />;
}
