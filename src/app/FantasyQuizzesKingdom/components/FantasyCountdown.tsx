"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface FantasyCountdownProps {
    seconds?: number; // Kept for compatibility, but animation is fixed 3-2-1 sequence
    onComplete: () => void;
}

const COUNTDOWN_SEQUENCE = [
    { num: 3, delay: 0 },
    { num: 2, delay: 1 },
    { num: 1, delay: 2 },
];

export default function FantasyCountdown({ onComplete }: FantasyCountdownProps) {
    useEffect(() => {
        // Complete the countdown after the full sequence (3s numbers + 0.8s START)
        const timer = setTimeout(() => {
            onComplete();
        }, 3800);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
            {/* Numbers 3, 2, 1 */}
            {COUNTDOWN_SEQUENCE.map((item) => (
                <motion.div
                    key={item.num}
                    className="absolute flex items-center justify-center p-20"
                    initial={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
                    // Keyframes: [Start, Appear, Hold, Disappear]
                    animate={{
                        opacity: [0, 1, 1, 0],
                        scale: [2, 1, 1, 0.5],
                        filter: ["blur(20px)", "blur(0px)", "blur(0px)", "blur(10px)"]
                    }}
                    transition={{
                        duration: 1,
                        times: [0, 0.2, 0.8, 1],
                        delay: item.delay,
                        ease: "easeInOut"
                    }}
                >
                    <span
                        className="text-[12rem] md:text-[20rem] font-black italic tracking-tighter text-amber-100"
                        style={{
                            textShadow: `
                                0 0 20px #fbbf24,
                                0 0 40px #f59e0b,
                                0 0 80px #b45309
                            `
                        }}
                    >
                        {item.num}
                    </span>

                    {/* Gathering Light Burst (Behind number) */}
                    <motion.div
                        className="absolute inset-0 bg-amber-400/20 rounded-full blur-3xl z-[-1]"
                        animate={{ scale: [1.5, 1, 0.5, 0], opacity: [0, 0.5, 0.5, 0] }}
                        transition={{
                            duration: 1,
                            times: [0, 0.2, 0.8, 1],
                            delay: item.delay,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>
            ))}

            {/* START! */}
            <motion.div
                key="start"
                className="absolute flex items-center justify-center p-20"
                initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1.2, 1.5, 2],
                    filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(20px)"]
                }}
                transition={{
                    duration: 0.8,
                    times: [0, 0.2, 0.7, 1],
                    delay: 3.0, // After 3, 2, 1
                    ease: "easeOut"
                }}
            >
                <div className="relative">
                    <span
                        className="text-8xl md:text-9xl font-black italic text-white tracking-widest relative z-10"
                        style={{
                            textShadow: `
                                0 0 30px #fbbf24,
                                0 0 60px #f59e0b,
                                0 0 100px #ffffff
                            `
                        }}
                    >
                        START!
                    </span>

                    {/* Bright shockwave for START */}
                    <motion.div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[40px] border-amber-200/50 blur-xl z-0"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ delay: 3.0, duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
