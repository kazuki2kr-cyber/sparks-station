"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { href: "/", label: "Articles" },
    { href: "/tools", label: "Tools" },
    { href: "/products", label: "Products" },
];

export default function SiteHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group z-50 relative">
                    {/* Brand Logo Image */}
                    <div className="relative w-40 h-10">
                        <img
                            src="/sparks-station-kv.png"
                            alt="Sparks Station"
                            className="object-contain w-full h-full"
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-emerald-400 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Button (Open Only) */}
                <button
                    className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors z-50 relative"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* Mobile Menu Portal */}
                {mounted && createPortal(
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 z-[9999] bg-black flex flex-col md:hidden font-mono"
                            >
                                {/* Header inside Portal (for Close Button placement) */}
                                <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-800">
                                    <div className="w-40 h-10 relative opacity-50 grayscale">
                                        <img
                                            src="/sparks-station-kv.png"
                                            alt="Sparks Station"
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                    <button
                                        className="p-2 text-neutral-100 hover:text-emerald-400 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Close menu"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                {/* Menu Items */}
                                <nav className="flex flex-col gap-8 text-2xl font-light text-neutral-300 pt-12 px-6">
                                    {NAV_LINKS.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="hover:text-emerald-400 transition-colors border-b border-neutral-800 pb-4"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                    {/* Mobile Only: About Link */}
                                    <Link
                                        href="/about"
                                        onClick={() => setIsOpen(false)}
                                        className="hover:text-emerald-400 transition-colors border-b border-neutral-800 pb-4"
                                    >
                                        About
                                    </Link>
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </div>
        </header>
    );
}
