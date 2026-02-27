"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { PRIZES, STUDENT_REG_URL } from "@/constants";

export default function Prizes() {
    return (
        <section id="prizes" className="relative py-24 lg:py-32 bg-metaverse-navy overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px meta-line opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-metaverse-pink/5 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 grid-bg opacity-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollReveal className="text-center mb-16">
                    <span className="inline-block text-xs font-inter font-semibold tracking-[0.3em] uppercase text-metaverse-pink mb-3">
                        Win Big
                    </span>
                    <h2 className="font-orbitron font-bold text-3xl sm:text-4xl lg:text-5xl text-white section-underline">
                        Grand <span className="gradient-text-gold">Prize Pool</span>
                    </h2>
                    <p className="mt-6 text-slate-400 font-inter text-base max-w-xl mx-auto">
                        Compete for amazing prizes, swags, certificates, and once-in-a-lifetime
                        opportunities!
                    </p>
                </ScrollReveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PRIZES.map((prize, i) => (
                        <ScrollReveal key={prize.rank} delay={i * 0.12} direction="up">
                            <motion.div
                                whileHover={{ y: -10, scale: 1.03 }}
                                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                                className={`relative group rounded-2xl p-6 glass ${prize.border} border hover:shadow-lg transition-all duration-400 flex flex-col items-center text-center overflow-hidden`}
                                style={{
                                    boxShadow: undefined,
                                }}
                            >
                                {/* Hover glow background */}
                                <div
                                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${prize.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-400`}
                                />

                                {/* Icon */}
                                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300 drop-shadow-lg">
                                    {prize.icon}
                                </div>

                                {/* Rank */}
                                <div
                                    className={`font-orbitron font-black text-3xl bg-gradient-to-r ${prize.gradient} bg-clip-text text-transparent mb-1`}
                                >
                                    {prize.rank}
                                </div>

                                {/* Prize label */}
                                <h3 className="font-orbitron font-bold text-sm text-white mb-2 tracking-wide">
                                    {prize.label}
                                </h3>

                                {/* Amount */}
                                <div
                                    className={`font-orbitron font-black text-2xl bg-gradient-to-r ${prize.gradient} bg-clip-text text-transparent mb-4`}
                                >
                                    {prize.amount}
                                </div>

                                {/* Divider */}
                                <div
                                    className={`w-full h-px bg-gradient-to-r ${prize.gradient} opacity-30 mb-4`}
                                />

                                {/* Perks */}
                                <ul className="space-y-1 w-full">
                                    {prize.perks.map((perk) => (
                                        <li
                                            key={perk}
                                            className="text-slate-300 font-inter text-xs flex items-center gap-2"
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${prize.gradient} shrink-0`} />
                                            {perk}
                                        </li>
                                    ))}
                                </ul>

                                {/* Bottom animated border */}
                                <div
                                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${prize.gradient} opacity-0 group-hover:opacity-80 transition-opacity duration-300`}
                                />
                            </motion.div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* CTA */}
                <ScrollReveal delay={0.5} className="text-center mt-14">
                    <p className="text-slate-400 font-inter mb-6 text-base">
                        Ready to compete? Register your team now and claim your glory! 🚀
                    </p>
                    <a
                        href={STUDENT_REG_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-inter font-bold text-base text-white bg-gradient-to-r from-metaverse-navy via-metaverse-plum to-metaverse-pink hover:shadow-meta hover:scale-105 transition-all duration-300"
                    >
                        ⚡ Register Now
                    </a>
                </ScrollReveal>
            </div>
        </section>
    );
}
