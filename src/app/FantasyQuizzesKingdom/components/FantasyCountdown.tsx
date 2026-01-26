"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface FantasyCountdownProps {
    seconds?: number;
    onComplete: () => void;
}

export default function FantasyCountdown({ seconds = 3, onComplete }: FantasyCountdownProps) {
    const [count, setCount] = useState(seconds);

    useEffect(() => {
        if (count > 0) {
            const timer = setTimeout(() => {
                setCount(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            // Wait a bit for the "GO" or final effect before completing
            const timer = setTimeout(() => {
                onComplete();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [count, onComplete]);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none">
            <AnimatePresence mode="wait">
                {count > 0 ? (
                    <motion.div
                        key={count}
                        className="relative flex items-center justify-center"
                        initial={{ scale: 2, opacity: 0, filter: "blur(20px)" }}
                        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                        exit={{ scale: 0, opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {/* Core Number */}
                        <span className="text-[12rem] md:text-[20rem] font-black italic gold-text tracking-tighter drop-shadow-[0_0_50px_rgba(251,191,36,0.8)]">
                            {count}
                        </span>

                        {/* Orbiting Particles */}
                        <motion.div
                            className="absolute inset-0"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="absolute top-0 left-1/2 w-4 h-4 bg-amber-400 rounded-full blur-sm shadow-[0_0_20px_#fbbf24]" />
                            <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-amber-200 rounded-full blur-sm shadow-[0_0_20px_#fde68a]" />
                        </motion.div>

                        {/* Gathering Light Effect (Reverse Ring) */}
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-amber-500/50"
                            initial={{ scale: 2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="go"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative"
                    >
                        <span className="text-8xl md:text-9xl font-black italic text-white drop-shadow-[0_0_60px_rgba(255,255,255,0.8)]">
                            START!
                        </span>
                        {/* Shockwave */}
                        <motion.div
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-[20px] border-amber-500/30"
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
