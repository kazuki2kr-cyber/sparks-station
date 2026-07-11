import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'お問い合わせ',
    description: 'Sparks Stationの記事訂正、商品サポート、取材・提携に関するお問い合わせ窓口です。',
    alternates: {
        canonical: '/contact',
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
