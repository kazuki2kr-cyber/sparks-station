"use client";

import { Trophy, Star, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function DesignPreviewPage() {
    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-8">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-lg shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
                {/* Leather Texture Background */}
                <div 
                    className="absolute inset-0 z-0 bg-[#5d1a1a]"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 50% 30%, rgba(160, 50, 50, 0.4), transparent 80%),
                            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")
                        `,
                        boxShadow: "inset 0 0 100px rgba(0,0,0,0.8)"
                    }}
                />
                
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
                <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-300 rounded-tl-xl z-20" style={{ filter: "drop-shadow(0 0 5px #bf953f)" }}/>
                <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-300 rounded-tr-xl z-20" style={{ filter: "drop-shadow(0 0 5px #bf953f)" }}/>
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-300 rounded-bl-xl z-20" style={{ filter: "drop-shadow(0 0 5px #bf953f)" }}/>
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-300 rounded-br-xl z-20" style={{ filter: "drop-shadow(0 0 5px #bf953f)" }}/>

                {/* Content */}
                <div className="relative z-30 flex flex-col items-center justify-between h-full py-16 px-8 text-center text-amber-100">
                    
                    {/* Header */}
                    <div className="space-y-4">
                        <Crown className="w-16 h-16 text-amber-400 mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" />
                        <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-[#fcf6ba] via-[#bf953f] to-[#aa771c] drop-shadow-sm">
                            CERTIFICATE
                        </h1>
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
                    </div>

                    {/* Main Stats */}
                    <div className="space-y-6 w-full">
                        <div className="bg-black/30 p-6 rounded-lg border border-amber-500/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                            <p className="text-xs uppercase tracking-widest text-amber-300/60 mb-1">Player Name</p>
                            <p className="text-2xl font-bold font-serif text-amber-100">Hero of Quiz</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/30 p-4 rounded-lg border border-amber-500/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                                <p className="text-[10px] uppercase tracking-widest text-amber-300/60 mb-1">Genre</p>
                                <p className="text-lg font-bold text-white">HISTORY</p>
                            </div>
                            <div className="bg-black/30 p-4 rounded-lg border border-amber-500/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                                <p className="text-[10px] uppercase tracking-widest text-amber-300/60 mb-1">Rank</p>
                                <p className="text-xl font-black text-amber-400">S</p>
                            </div>
                        </div>

                        <div className="relative py-4">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-900/40 to-transparent blur-xl"></div>
                            <p className="text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                                9,850
                            </p>
                            <p className="text-sm uppercase tracking-[0.5em] text-amber-600 font-bold mt-2">POINTS</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="space-y-2 mt-auto pt-8">
                        <div className="flex items-center justify-center gap-2 opacity-80">
                            <Star className="w-3 h-3 text-amber-500" />
                            <span className="h-px w-8 bg-amber-500/50"></span>
                            <Star className="w-3 h-3 text-amber-500" />
                        </div>
                        <h2 className="text-sm font-bold tracking-widest text-[#bf953f] uppercase drop-shadow-md">
                            Fantasy Quizzes Kingdom
                        </h2>
                        <p className="text-[10px] text-amber-700 font-serif italic">
                            Presented by Sparks Station
                        </p>
                    </div>
                </div>
                
                {/* Emboss Effect Overlay */}
                <div className="absolute inset-0 z-40 pointer-events-none mix-blend-overlay opacity-30 bg-[url('https://www.transparenttextures.com/patterns/leather.png')]"></div>
            </div>
        </div>
    );
}
