'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export default function VoteButtons({ slug }: { slug: string }) {
    const [votes, setVotes] = useState({ helpful: 0, not_helpful: 0 });
    const [userVote, setUserVote] = useState<'helpful' | 'not_helpful' | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for previous vote
        const storedVote = localStorage.getItem(`vote_${slug}`);
        if (storedVote === 'helpful' || storedVote === 'not_helpful') {
            setUserVote(storedVote);
        }

        // Fetch current votes
        const fetchVotes = async () => {
            const docRef = doc(db, 'posts_stats', slug);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setVotes({
                    helpful: data.helpful || 0,
                    not_helpful: data.not_helpful || 0
                });
            } else {
                // Initialize if not exists
                await setDoc(docRef, { helpful: 0, not_helpful: 0 });
            }
            setLoading(false);
        };

        fetchVotes();
    }, [slug]);

    const handleVote = async (type: 'helpful' | 'not_helpful') => {
        if (userVote) return; // Prevent double voting

        // Optimistic update
        setVotes(prev => ({
            ...prev,
            [type]: prev[type] + 1
        }));
        setUserVote(type);
        localStorage.setItem(`vote_${slug}`, type);

        const docRef = doc(db, 'posts_stats', slug);
        await updateDoc(docRef, {
            [type]: increment(1)
        }).catch(err => {
            console.error("Error updating vote:", err);
            // Revert on error
            setVotes(prev => ({
                ...prev,
                [type]: prev[type] - 1
            }));
            setUserVote(null);
            localStorage.removeItem(`vote_${slug}`);
        });
    };

    if (loading) return <div className="h-12"></div>;

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800">
            <h3 className="text-sm font-medium text-neutral-400">この記事は参考になりましたか？</h3>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => handleVote('helpful')}
                    disabled={!!userVote}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border ${userVote === 'helpful'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : userVote
                            ? 'opacity-50 cursor-not-allowed text-neutral-500 border-transparent'
                            : 'bg-neutral-800/40 border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600 text-neutral-300 cursor-pointer'
                        }`}
                >
                    <ThumbsUp size={18} />
                    <span>参考になった</span>
                    <span className="text-xs font-mono bg-neutral-950 px-1.5 py-0.5 rounded ml-1">
                        {votes.helpful}
                    </span>
                </button>

                <button
                    onClick={() => handleVote('not_helpful')}
                    disabled={!!userVote}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border ${userVote === 'not_helpful'
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : userVote
                            ? 'opacity-50 cursor-not-allowed text-neutral-500 border-transparent'
                            : 'bg-neutral-800/40 border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600 text-neutral-300 cursor-pointer'
                        }`}
                >
                    <ThumbsDown size={18} />
                    <span>いまいち</span>
                </button>
            </div>
            {userVote && (
                <p className="text-xs text-neutral-500 animate-in fade-in slide-in-from-bottom-1">
                    フィードバックありがとうございます
                </p>
            )}
        </div>
    );
}
