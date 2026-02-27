"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { RULES } from "@/constants";

export default function Rules() {
    return (
        <section id="rules" className="relative py-24 lg:py-32 bg-dark overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px neon-line opacity-30" />
            <div className="absolute top-1/2 -right-40 w-80 h-80 rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 grid-bg opacity-15" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollReveal className="text-center mb-16">
                    <span className="inline-block text-xs font-inter font-semibold tracking-[0.3em] uppercase text-blue-400 mb-3">
                        Fair Play
                    </span>
                    <h2 className="font-orbitron font-bold text-3xl sm:text-4xl lg:text-5xl text-white section-underline">
                        Rules &amp; <span className="gradient-text">Guidelines</span>
                    </h2>
                    <p className="mt-6 text-slate-400 font-inter text-base max-w-xl mx-auto">
                        Follow these guidelines to ensure a fair, exciting, and competitive
                        hackathon experience for all participants.
                    </p>
                </ScrollReveal>

                <div className="grid sm:grid-cols-2 gap-4">
                    {RULES.map((rule, i) => (
                        <ScrollReveal key={i} delay={i * 0.07} direction="up">
                            <motion.div
                                whileHover={{ x: 4, scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="group flex items-start gap-4 glass rounded-xl p-5 border border-purple-500/15 hover:border-purple-500/40 hover:shadow-neon transition-all duration-300"
                            >
                                {/* Number badge */}
                                <div className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-orbitron font-bold text-sm text-white shadow-neon group-hover:scale-110 transition-transform duration-200">
                                    {String(i + 1).padStart(2, "0")}
                                </div>
                                <p className="text-slate-300 font-inter text-sm leading-relaxed group-hover:text-white transition-colors duration-200 pt-1">
                                    {rule}
                                </p>
                            </motion.div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Bottom note */}
                <ScrollReveal delay={0.5} className="mt-10 text-center">
                    <div className="inline-block glass rounded-xl px-6 py-4 border border-yellow-500/30">
                        <p className="text-yellow-300 font-inter text-sm">
                            ⚠️{" "}
                            <span className="font-semibold">Important:</span> Violations of
                            rules may lead to immediate disqualification without appeal.
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
