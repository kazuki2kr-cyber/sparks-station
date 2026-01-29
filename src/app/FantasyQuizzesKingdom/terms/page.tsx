import { Metadata } from "next";
import TermsOfServiceClient from "./TermsClient";

export const metadata: Metadata = {
    title: "利用規約 | Fantasy Quizzes Kingdom",
    alternates: {
        canonical: '/FantasyQuizzesKingdom/terms',
    },
};

export default function Page() {
    return <TermsOfServiceClient />;
}
