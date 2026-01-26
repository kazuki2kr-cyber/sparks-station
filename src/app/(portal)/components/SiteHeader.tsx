"use client";

import { useState } from "react";
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { href: "/", label: "Insights" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
];

export default function SiteHeader() {
    const [isOpen, setIsOpen] = useState(false);

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

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors z-50 relative"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>

                {/* Mobile Nav Overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 top-0 bg-neutral-950 z-40 flex flex-col pt-24 px-6 md:hidden"
                        >
                            <nav className="flex flex-col gap-8 text-2xl font-light text-neutral-300">
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
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
