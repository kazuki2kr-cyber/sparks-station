import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QUIZ_CATEGORIES } from '../../lib/constants';
import ThemeLandingPage from './client-page';

type Props = {
    params: Promise<{ slug: string }>;
};

// Map slugs to categories and Metadata
const THEME_METADATA: Record<string, { title: string; description: string; categoryId: string }> = {
    party: {
        title: "忘年会・新年会・結婚式二次会の余興に！インストール不要の早押しクイズゲーム | Fantasy Quizzes Kingdom",
        description: "幹事様必見！アプリのインストール不要で、URLを共有するだけですぐに遊べるリアルタイム早押しクイズ。忘年会、新年会、歓迎会、送別会、結婚式の二次会、社内イベントなどのレクリエーション・余興に最適です。",
        categoryId: "party"
    },
    wedding: {
        title: "結婚式二次会の余興ゲームはこれ！全員参加型早押しクイズ | Fantasy Quizzes Kingdom",
        description: "結婚式の二次会余興で盛り上がるゲームをお探しの幹事様へ。ゲスト全員がスマホで参加できる早押しクイズ大会を簡単に開催。アプリ不要、スクリーンに映すだけで会場が一体に。",
        categoryId: "party"
    },
    bonenkai: { // Legacy/Alias
        title: "忘年会・新年会の余興に！インストール不要の早押しクイズ | Fantasy Quizzes Kingdom",
        description: "幹事必見！アプリのインストール不要で、URLを共有するだけですぐに遊べるリアルタイム早押しクイズ。忘年会、新年会、社内レクリエーションに。",
        categoryId: "party"
    },
    education: {
        title: "授業・クラスレクのアイスブレイクに！学習用クイズツール | Fantasy Quizzes Kingdom",
        description: "先生のための教育用クイズ作成ツール。プロジェクターに映して、生徒たちのスマホで参加。授業の復習やホームルームのレクリエーションに。",
        categoryId: "study"
    },
    "anime-game": {
        title: "アニメ・ゲーム知識決定戦！オタククイズ大会ツール | Fantasy Quizzes Kingdom",
        description: "Discordコミュニティやオフ会で盛り上がる！アニメ、ゲーム、漫画の知識を競う早押しバトル。",
        categoryId: "anime-game"
    }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const meta = THEME_METADATA[slug];

    if (!meta) {
        return {
            title: "Theme not found",
        };
    }

    return {
        title: meta.title,
        description: meta.description,
        openGraph: {
            title: meta.title,
            description: meta.description,
            type: 'website',
            images: ['/key-visual.png'], // Ensure you have this
        }
    };
}

export async function generateStaticParams() {
    return Object.keys(THEME_METADATA).map((slug) => ({
        slug,
    }));
}

export default async function Page({ params }: Props) {
    const { slug } = await params;
    const meta = THEME_METADATA[slug];

    if (!meta) {
        notFound();
    }

    return <ThemeLandingPage slug={slug} categoryId={meta.categoryId} />;
}
