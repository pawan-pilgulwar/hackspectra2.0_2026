"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, STUDENT_REG_URL, isProblemSelectionOpen, hasEventStarted } from "@/constants";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image"
import Link from "next/link";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showProblemSelection, setShowProblemSelection] = useState(false);
    const [showClosed, setShowClosed] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Check time-based button visibility
    useEffect(() => {
        const checkButtonVisibility = () => {
            if (hasEventStarted()) {
                // Event has started or passed - show "Closed" button
                setShowProblemSelection(false);
                setShowClosed(true);
            } else if (isProblemSelectionOpen()) {
                // Problem selection is open (10 days before event)
                setShowProblemSelection(true);
                setShowClosed(false);
            } else {
                // Before problem selection opens - show "Register" button
                setShowProblemSelection(false);
                setShowClosed(false);
            }
        };

        // Check immediately
        checkButtonVisibility();

        // Check every minute for time-based updates
        const interval = setInterval(checkButtonVisibility, 60000);

        return () => clearInterval(interval);
    }, []);

    const scrollToSection = (href: string) => {
        setMenuOpen(false);
        const el = document.querySelector(href);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "glass-dark shadow-lg shadow-purple-900/10"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <button
                            onClick={() => scrollToSection("#hero")}
                            className="flex items-center gap-2 group"
                        >
                            <div className="relative rounded-lg overflow-hidden shadow-neon">
                                <Image
                                    src="/images/hackSpectraLogo.jpg"
                                    alt="HackSpectra Logo"
                                    width={50}
                                    height={50}
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-orbitron font-bold text-lg gradient-text group-hover:text-glow-purple transition-all">
                                HACK<span className="text-cyan-400">SPECTRA</span>
                            </span>
                        </button>

                        {/* Desktop links */}
                        <div className="hidden lg:flex items-center gap-6">
                            {NAV_LINKS.map((link) => (
                                !link.href.startsWith("#") ? (
                                    <Link
                                        key={link.href}
                                        href={link.href === "/problems" ? "/auth" : link.href}
                                        className="text-slate-300 hover:text-purple-400 font-inter text-sm font-medium transition-colors duration-200 relative group"
                                    >
                                        {link.label}
                                    </Link>
                                ) : (
                                    <button
                                        key={link.href}
                                        onClick={() => scrollToSection(link.href)}
                                        className="text-slate-300 hover:text-purple-400 font-inter text-sm font-medium transition-colors duration-200 relative group"
                                    >
                                        {link.label}
                                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-purple-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
                                    </button>
                                )
                            ))}

                            {/* Time-based button logic */}
                            {showClosed ? (
                                // Show "Closed" button when event has started
                                <button
                                    disabled
                                    className="ml-2 px-5 py-2 rounded-lg bg-red-600/50 text-white/70 font-inter font-semibold text-sm cursor-not-allowed border border-red-500/30"
                                >
                                    Selection Closed
                                </button>
                            ) : showProblemSelection ? (
                                // Show "Problem Statement Selection" button 10 days before event
                                <Link
                                    href="/auth"
                                    className="ml-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-inter font-semibold text-sm hover:shadow-neon hover:scale-105 transition-all duration-200"
                                >
                                    Problem Selection
                                </Link>
                            ) : (
                                // Show "Register Now" button before problem selection opens
                                <a
                                    href={STUDENT_REG_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-inter font-semibold text-sm hover:shadow-neon hover:scale-105 transition-all duration-200"
                                >
                                    Register Now
                                </a>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden text-slate-300 hover:text-purple-400 transition-colors p-2"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? (
                                <FiX className="text-2xl" />
                            ) : (
                                <FiMenu className="text-2xl" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25 }}
                        className="fixed top-16 left-0 right-0 z-40 glass-dark border-t border-purple-800/30 lg:hidden"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                            {NAV_LINKS.map((link) => (
                                !link.href.startsWith("#") ? (
                                    <Link
                                        key={link.href}
                                        href={link.href === "/problems" ? "/auth" : link.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="text-left py-3 px-4 text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg font-inter text-sm font-medium transition-all"
                                    >
                                        {link.label}
                                    </Link>
                                ) : (
                                    <button
                                        key={link.href}
                                        onClick={() => scrollToSection(link.href)}
                                        className="text-left py-3 px-4 text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg font-inter text-sm font-medium transition-all"
                                    >
                                        {link.label}
                                    </button>
                                )
                            ))}

                            {/* Time-based button logic for mobile */}
                            {showClosed ? (
                                <button
                                    disabled
                                    className="mt-2 py-3 px-4 text-center rounded-lg bg-red-600/50 text-white/70 font-inter font-semibold text-sm cursor-not-allowed border border-red-500/30"
                                >
                                    Event Closed
                                </button>
                            ) : showProblemSelection ? (
                                <Link
                                    href="/auth"
                                    onClick={() => setMenuOpen(false)}
                                    className="mt-2 py-3 px-4 text-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-inter font-semibold text-sm"
                                >
                                    Problem Selection
                                </Link>
                            ) : (
                                <a
                                    href={STUDENT_REG_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMenuOpen(false)}
                                    className="mt-2 py-3 px-4 text-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-inter font-semibold text-sm"
                                >
                                    Register Now
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
