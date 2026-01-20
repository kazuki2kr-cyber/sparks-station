"use client";

import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    limit
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Trash2,
    LogOut,
    Loader2,
    Trophy,
    Search,
    ArrowLeft,
    Calendar,
    Timer
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const WHITELIST = ["ichikawa.kazuki@shibaurafzk.com"];

interface RankingEntry {
    id: string;
    nickname: string;
    score: number;
    totalTime: number;
    timestamp: any;
}

export default function RankingAdmin() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [rankings, setRankings] = useState<RankingEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const isAnonymous = user?.isAnonymous;
    const isAuthorized = user && !isAnonymous && user.email && WHITELIST.includes(user.email);

    useEffect(() => {
        if (!loading && (!isAuthorized || isAnonymous)) {
            router.push("/quiz/admin");
        } else if (isAuthorized) {
            fetchRankings();
        }
    }, [user, loading, isAuthorized, isAnonymous, router]);

    const fetchRankings = async () => {
        setIsLoading(true);
        try {
            // Try primary query with two orders (Requires Composite Index)
            const qPrimary = query(
                collection(db, "leaderboard"),
                orderBy("score", "desc"),
                orderBy("totalTime", "asc"),
                limit(100)
            );
            const snap = await getDocs(qPrimary);
            const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as RankingEntry));
            setRankings(list);
        } catch (error: any) {
            console.error("Primary ranking fetch failed, trying fallback:", error);

            // Fallback to single order if the index doesn't exist yet
            try {
                const qFallback = query(
                    collection(db, "leaderboard"),
                    orderBy("score", "desc"),
                    limit(100)
                );
                const snap = await getDocs(qFallback);
                const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as RankingEntry));
                setRankings(list);

                if (error.message?.includes("index")) {
                    console.warn("Composite index missing in Admin. Using simpler ranking.");
                }
            } catch (fallbackError: any) {
                toast({ title: "取得エラー", description: fallbackError.message, variant: "destructive" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, nickname: string) => {
        if (!confirm(`${nickname} さんのデータを削除しますか？`)) return;
        try {
            await deleteDoc(doc(db, "leaderboard", id));
            toast({ title: "削除完了", description: "ランキングデータを削除しました。" });
            fetchRankings();
        } catch (error: any) {
            toast({ title: "削除エラー", description: error.message, variant: "destructive" });
        }
    };

    const filteredRankings = rankings.filter(r =>
        r.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "---";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('ja-JP');
    };

    if (loading || !isAuthorized) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link href="/quiz/admin">
                        <Button variant="ghost" size="icon" className="text-white/40 hover:text-white">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Trophy className="h-8 w-8 text-amber-500" />
                        <h1 className="text-2xl font-black gold-text italic tracking-widest uppercase">
                            Ranking Moderator
                        </h1>
                    </div>
                </div>
                <Button variant="ghost" onClick={async () => { await logout(); router.push("/quiz/admin"); }} className="text-white/40 hover:text-red-400">
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
            </div>

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
                    <input
                        type="text"
                        placeholder="ユーザー名で検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 text-lg focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                </div>

                {/* List Section */}
                <Card className="fantasy-card border-none bg-black/60 overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest font-black text-amber-500/50">
                                        <th className="px-6 py-4">Rank</th>
                                        <th className="px-6 py-4">Nickname</th>
                                        <th className="px-6 py-4 text-center">Score</th>
                                        <th className="px-6 py-4 text-center">Time</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="py-20 text-center">
                                                <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto opacity-20" />
                                            </td>
                                        </tr>
                                    ) : filteredRankings.length > 0 ? (
                                        filteredRankings.map((r, idx) => (
                                            <tr key={r.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4 font-mono text-white/40">#{idx + 1}</td>
                                                <td className="px-6 py-4 font-bold text-amber-100">{r.nickname}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-lg font-black gold-text italic">{r.score}</span>
                                                    <span className="text-[10px] ml-1 text-white/20">pt</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-1 text-white/40 text-sm">
                                                        <Timer className="h-3 w-3" /> {r.totalTime.toFixed(1)}s
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-white/20">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" /> {formatDate(r.timestamp)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(r.id, r.nickname)}
                                                        className="text-red-400/30 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-20 text-center text-white/20 italic">
                                                データが見つかりません
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
