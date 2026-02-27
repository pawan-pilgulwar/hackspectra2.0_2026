"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, STUDENT_REG_URL } from "@/constants";
import { FiMenu, FiX } from "react-icons/fi";
import { RiSpeedUpFill } from "react-icons/ri";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
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
                            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-neon">
                                <RiSpeedUpFill className="text-white text-lg" />
                            </div>
                            <span className="font-orbitron font-bold text-lg gradient-text group-hover:text-glow-purple transition-all">
                                HACK<span className="text-cyan-400">SPECTRA</span>
                            </span>
                        </button>

                        {/* Desktop links */}
                        <div className="hidden lg:flex items-center gap-6">
                            {NAV_LINKS.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => scrollToSection(link.href)}
                                    className="text-slate-300 hover:text-purple-400 font-inter text-sm font-medium transition-colors duration-200 relative group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-purple-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
                                </button>
                            ))}
                            <a
                                href={STUDENT_REG_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-inter font-semibold text-sm hover:shadow-neon hover:scale-105 transition-all duration-200"
                            >
                                Register Now
                            </a>
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
                                <button
                                    key={link.href}
                                    onClick={() => scrollToSection(link.href)}
                                    className="text-left py-3 px-4 text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg font-inter text-sm font-medium transition-all"
                                >
                                    {link.label}
                                </button>
                            ))}
                            <a
                                href={STUDENT_REG_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMenuOpen(false)}
                                className="mt-2 py-3 px-4 text-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-inter font-semibold text-sm"
                            >
                                Register Now
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
