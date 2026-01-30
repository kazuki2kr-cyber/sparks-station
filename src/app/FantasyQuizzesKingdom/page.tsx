import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  alternates: {
    canonical: '/FantasyQuizzesKingdom',
  },
};

import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <HomeClient />
    </Suspense>
  );
}
