import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  alternates: {
    canonical: '/FantasyQuizzesKingdom',
  },
};

export default function Home() {
  return <HomeClient />;
}
