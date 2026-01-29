import { Metadata } from "next";
import SoloClient from "./SoloClient";

export const metadata: Metadata = {
    title: "Solo Mode | Fantasy Quizzes Kingdom",
    description: "全国ランキングを目指せ！完全無料・登録不要の早押しクイズスコアアタック。",
    alternates: {
        canonical: '/FantasyQuizzesKingdom/solo',
    },
};

export default function Page() {
    return <SoloClient />;
}
