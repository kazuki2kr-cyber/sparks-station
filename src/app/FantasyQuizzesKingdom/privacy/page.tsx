import { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyClient";

export const metadata: Metadata = {
    title: "プライバシーポリシー | Fantasy Quizzes Kingdom",
    alternates: {
        canonical: '/FantasyQuizzesKingdom/privacy',
    },
};

export default function Page() {
    return <PrivacyPolicyClient />;
}
