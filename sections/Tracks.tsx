"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { TRACKS } from "@/constants";

export default function Tracks() {
    return (
        <section id="tracks" className="relative py-24 lg:py-32 bg-metaverse-navy overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px meta-line opacity-30" />
            <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-metaverse-pink/5 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 grid-bg opacity-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollReveal className="text-center mb-16">
                    <span className="inline-block text-xs font-inter font-semibold tracking-[0.3em] uppercase text-metaverse-pink mb-3">
                        Innovation Domains
                    </span>
                    <h2 className="font-orbitron font-bold text-3xl sm:text-4xl lg:text-5xl text-white section-underline">
                        HackSpectra{" "}
                        <span className="gradient-text">Themes</span>
                    </h2>
                    <p className="mt-6 text-slate-400 font-inter text-base max-w-2xl mx-auto">
                        Innovate, Create, and Solve Real-World Problems! Choose from these
                        exciting domains and build solutions that matter.
                    </p>
                </ScrollReveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TRACKS.map((track, i) => (
                        <ScrollReveal key={track.title} delay={i * 0.1}>
                            <motion.div
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                                className={`relative group rounded-2xl p-6 glass border border-white/5 hover:${track.glow} hover:border-metaverse-pink/30 transition-all duration-400 overflow-hidden cursor-default h-full`}
                            >
                                {/* Gradient overlay on hover */}
                                <div
                                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-10 transition-opacity duration-400`}
                                />

                                {/* Glow dot */}
                                <div
                                    className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg`}
                                />

                                {/* Icon */}
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                                    {track.icon}
                                </div>

                                {/* Content */}
                                <h3 className="font-orbitron font-bold text-lg text-white mb-3 tracking-wide group-hover:gradient-text transition-all">
                                    {track.title}
                                </h3>
                                <p className="text-slate-400 font-inter text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                                    {track.description}
                                </p>

                                {/* Bottom accent line */}
                                <div
                                    className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${track.color} opacity-0 group-hover:opacity-60 transition-opacity duration-300`}
                                />
                            </motion.div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
