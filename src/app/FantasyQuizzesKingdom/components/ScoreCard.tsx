import { Trophy, Star, Crown } from "lucide-react";
// import { motion } from "framer-motion";

interface ScoreCardProps {
    playerName: string;
    genre: string;
    score: number | string;
    rank: string;
    rankLabel?: string;
    className?: string;
}

export default function ScoreCard({
    playerName,
    genre,
    score,
    rank,
    rankLabel = "Rank",
    className = ""
}: ScoreCardProps) {
    return (
        <div className={`relative w-full aspect-[3/4] rounded-lg shadow-2xl overflow-hidden ${className}`}>
            {/* Leather Texture Background with Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('/score-card-bg.png')`,
                    boxShadow: "inset 0 0 50px rgba(0,0,0,0.8)" // Inner shadow for depth
                }}
            >
                {/* Overlay to ensure text readability over the crest */}
                <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
            </div>

            {/* Gold Frame */}
            <div className="absolute inset-4 border-[2px] border-[#b38728] rounded z-10 opacity-80"
                style={{
                    background: "linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)",
                    WebkitBackgroundClip: "border-box",
                    WebkitTextFillColor: "transparent"
                }}
            >
                <div className="absolute inset-1 border border-[#fcf6ba] opacity-50 rounded-sm"></div>
            </div>

            {/* Corners (Ornamental) */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-300 rounded-tl-xl z-20" style={{ filter: "drop-shadow(0 0 5px #bf953f)" }} />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-300 rounded-tr-xl z-20" style={{ filter: "drop-shadow(0 0 5px #bf953f)" }} />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-300 rounded-bl-xl z-20" style={{ filter: "drop-shadow(0 0 5px #bf953f)" }} />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-300 rounded-br-xl z-20" style={{ filter: "drop-shadow(0 0 5px #bf953f)" }} />

            {/* Content */}
            <div className="relative z-30 flex flex-col items-center h-full py-12 px-6 text-center text-amber-100">

                {/* Header */}
                <div className="space-y-2 mb-6">
                    <Crown className="w-12 h-12 text-amber-300 mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                    <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        TRIAL RECORD
                    </h1>
                    <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-200 to-transparent mx-auto opacity-80" />
                </div>

                {/* Main Stats */}
                <div className="w-full flex-1 flex flex-col justify-center gap-4">
                    <div className="bg-black/40 p-4 rounded-lg border border-amber-500/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                        <p className="text-[10px] uppercase tracking-widest text-amber-200/70 mb-1 font-serif">Player Name</p>
                        <p className="text-2xl font-bold font-serif text-amber-50 drop-shadow-md truncate">{playerName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/40 p-3 rounded-lg border border-amber-500/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                            <p className="text-[10px] uppercase tracking-widest text-amber-200/70 mb-1 font-serif">Genre</p>
                            <p className="text-lg font-bold font-serif text-amber-50 drop-shadow-md truncate">{genre}</p>
                        </div>
                        <div className="bg-black/40 p-3 rounded-lg border border-amber-500/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                            <p className="text-[10px] uppercase tracking-widest text-amber-200/70 mb-1 font-serif">{rankLabel}</p>
                            <p className="text-lg font-bold font-serif text-amber-400 drop-shadow-md truncate">{rank}</p>
                        </div>
                    </div>

                    <div className="relative py-2 mt-2">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-900/40 to-transparent blur-xl"></div>
                        <p className="text-5xl font-black font-mono text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                            {score.toLocaleString()}
                        </p>
                        <p className="text-xs uppercase tracking-[0.4em] text-amber-400 font-bold mt-1 shadow-black drop-shadow-md">POINTS</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="space-y-1 mt-auto pt-4 pb-2 z-50">
                    <div className="flex items-center justify-center gap-2 opacity-80 mb-2">
                        <Star className="w-3 h-3 text-amber-400" />
                        <span className="h-px w-8 bg-amber-400/50"></span>
                        <Star className="w-3 h-3 text-amber-400" />
                    </div>
                    <h2 className="text-xs font-bold tracking-widest text-amber-200 uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                        Fantasy Quizzes Kingdom
                    </h2>
                    <p className="text-[10px] text-amber-400/80 font-serif italic drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
                        by Sparks Station
                    </p>
                </div>
            </div>

            {/* Emboss Effect Overlay */}
            <div className="absolute inset-0 z-40 pointer-events-none mix-blend-overlay opacity-30 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] rounded-lg"></div>
        </div>
    );
}
