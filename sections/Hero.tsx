"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import CountdownTimer from "@/components/CountdownTimer";
import {
    EVENT_NAME,
    EVENT_TAGLINE,
    EVENT_DATE_DISPLAY,
    EVENT_DURATION,
    STUDENT_REG_URL,
    TEAM_SIZE,
} from "@/constants";

const ParticleBackground = dynamic(
    () => import("@/components/ParticleBackground"),
    { ssr: false }
);

export default function Hero() {
    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            id="hero"
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-metaverse-navy meta-pattern"
        >
            {/* Particle Background */}
            <ParticleBackground />

            {/* Radial glow blobs */}
            <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-metaverse-pink/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-metaverse-plum/10 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-metaverse-slate/5 blur-3xl pointer-events-none" />

            {/* Grid overlay */}
            <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-24">
                {/* Event badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 border border-metaverse-pink/30"
                >
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm font-inter text-slate-300 tracking-widest uppercase">
                        {EVENT_DATE_DISPLAY} &nbsp;·&nbsp; {EVENT_DURATION} &nbsp;·&nbsp; {TEAM_SIZE}
                    </span>
                </motion.div>

                {/* Main title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-4"
                >
                    <h1 className="font-orbitron font-black text-4xl sm:text-6xl md:text-8xl lg:text-8xl leading-none tracking-tighter break-words">
                        {/* first word gradient, rest white */}
                        {(() => {
                            const parts = EVENT_NAME.split(" ");
                            const first = parts.shift();
                            const rest = parts.join(" ");
                            return (
                                <>
                                    <span className="gradient-text text-glow-pink">{first}</span>
                                    {rest && (
                                        <span className="text-white text-glow-white"> {rest}</span>
                                    )}
                                </>
                            );
                        })()}
                    </h1>
                </motion.div>

                {/* Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="mb-6"
                >
                    <div className="meta-line w-32 sm:w-64 mx-auto mb-6" />
                    <p className="font-orbitron text-lg sm:text-xl md:text-2xl tracking-widest uppercase text-metaverse-pink text-glow-pink">
                        {EVENT_TAGLINE}
                    </p>
                    <div className="meta-line w-32 sm:w-64 mx-auto mt-6" />
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.55 }}
                    className="text-slate-400 font-inter text-base sm:text-lg max-w-xs sm:max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    A 24-hour hackathon by{" "}
                    <span className="text-metaverse-pink font-semibold">
                        MGM's College of Engineering, Nanded
                    </span>
                    . Build, innovate, and compete — where ideas meet the metaverse.
                </motion.p>

                {/* Countdown Timer */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                    className="flex flex-col items-center gap-4 mb-12"
                >
                    <p className="text-xs font-inter text-slate-500 uppercase tracking-widest">
                        Event Starts In
                    </p>
                    <CountdownTimer />
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.9 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a
                        href={STUDENT_REG_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative px-8 py-4 rounded-xl font-inter font-bold text-base text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-meta"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-metaverse-navy via-metaverse-plum to-metaverse-pink" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 animated-border transition-opacity duration-300" />
                        <span className="relative z-10 flex items-center gap-2">
                            ⚡ Register as Student
                        </span>
                    </a>

                    <button
                        onClick={() => scrollTo("about")}
                        className="px-8 py-4 rounded-xl font-inter font-medium text-base text-slate-400 hover:text-metaverse-pink border border-slate-700 hover:border-metaverse-pink/30 transition-all duration-300"
                    >
                        Know More ↓
                    </button>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-xs text-slate-500 font-inter tracking-widest uppercase">
                    Scroll
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-px h-10 bg-gradient-to-b from-metaverse-pink to-transparent"
                />
            </motion.div>
        </section>
    );
}
