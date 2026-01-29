import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
    title: "お問い合わせ | Fantasy Quizzes Kingdom",
    alternates: {
        canonical: '/FantasyQuizzesKingdom/contact',
    },
};

export default function Page() {
    return <ContactClient />;
}
