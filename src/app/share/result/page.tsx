import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { searchParams }: Props
): Promise<Metadata> {
    const params = await searchParams;

    const name = params.name || 'Guest';
    const score = params.score || '0';
    const rank = params.rank || 'Novice';
    const genre = params.genre || 'ALL';
    const rankLabel = params.rankLabel || 'RANK';

    // Construct the image URL
    // Note: specific hardcoded host or relative URL for metadata
    // In production, we need the deployment URL. 
    // For metadata.openGraph.images, it's best to use absolute URL usually, but Next.js resolves relative.
    // We'll pass query params to the API route.

    const query = new URLSearchParams({
        name: name as string,
        score: score as string,
        rank: rank as string,
        genre: genre as string,
        rankLabel: rankLabel as string,
    });

    const imageUrl = `/api/og?${query.toString()}`;

    return {
        title: `${name}'s Trial Record - Fantasy Quizzes Kingdom`,
        description: `Score: ${score}pt | Rank: ${rank} | Genre: ${genre}`,
        openGraph: {
            title: 'TRIAL RECORD - Fantasy Quizzes Kingdom',
            description: `View ${name}'s result in the Wisdom Trial. Score: ${score}`,
            images: [imageUrl],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'TRIAL RECORD - Fantasy Quizzes Kingdom',
            description: `Score: ${score}pt | Rank: ${rank}`,
            images: [imageUrl],
        },
    };
}

export default async function SharePage({ searchParams }: Props) {
    const params = await searchParams;
    const { name, score, rank, genre, rankLabel } = params as Record<string, string>;

    const query = new URLSearchParams({
        name: name || 'Guest',
        score: score || '0',
        rank: rank || 'Novice',
        genre: genre || 'ALL',
        rankLabel: rankLabel || 'RANK',
    });

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-20 pointer-events-none" />

            <div className="relative z-10 max-w-lg w-full space-y-8 text-center">
                <h1 className="text-3xl font-black text-amber-500 uppercase tracking-widest">
                    Trial Record
                </h1>

                {/* Display the generated OGP image for the user to see */}
                <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-amber-900/50">
                    <img
                        src={`/api/og?${query.toString()}`}
                        alt="Result Card"
                        className="w-full h-auto"
                    />
                </div>

                <div className="space-y-4">
                    <p className="text-amber-100/60 font-medium">
                        あなたも「知恵の試練」に挑戦しよう。
                    </p>
                    <Link href="/FantasyQuizzesKingdom" className="block w-full">
                        <Button className="w-full h-16 text-xl font-black bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all">
                            今すぐプレイ (Play Now)
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
