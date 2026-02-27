"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { STATS, WHY_JOIN } from "@/constants";
import { motion } from "framer-motion";

export default function About() {
    return (
        <section id="about" className="relative py-24 lg:py-32 bg-metaverse-navy overflow-hidden">
            {/* Background accents */}
            <div className="absolute top-0 left-0 right-0 h-px meta-line opacity-30" />
            <div className="absolute -top-40 right-0 w-80 h-80 rounded-full bg-metaverse-pink/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 -left-40 w-80 h-80 rounded-full bg-metaverse-plum/5 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 grid-bg opacity-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section header */}
                <ScrollReveal className="text-center mb-16">
                    <span className="inline-block text-xs font-inter font-semibold tracking-[0.3em] uppercase text-metaverse-pink mb-3">
                        About The Event
                    </span>
                    <h2 className="font-orbitron font-bold text-3xl sm:text-4xl lg:text-5xl gradient-text section-underline">
                        What is HackSpectra?
                    </h2>
                </ScrollReveal>

                {/* Main description */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <ScrollReveal direction="left">
                        <div className="space-y-6">
                            <p className="text-slate-300 font-inter text-lg leading-relaxed">
                                HackSpectra is a{" "}
                                <span className="text-metaverse-pink font-semibold">24-hour hackathon</span>{" "}
                                by{" "}
                                <span className="text-metaverse-slate font-semibold">
                                    MGM's College of Engineering, Nanded
                                </span>
                                , bringing together{" "}
                                <span className="text-white font-semibold">45 teams</span> of 2 to 4
                                members to tackle real-world challenges through innovation and
                                collaboration.
                            </p>
                            <p className="text-slate-400 font-inter text-base leading-relaxed">
                                Beyond coding, participants can enjoy{" "}
                                <span className="text-metaverse-pink">midnight games</span>, a{" "}
                                <span className="text-metaverse-slate">cultural night</span>, and{" "}
                                <span className="text-metaverse-plum">free goodies</span>, making it a
                                thrilling and unforgettable experience!
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                {["Innovation", "Collaboration", "Fun", "Growth"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-4 py-1.5 rounded-full text-xs font-inter font-semibold tracking-widest uppercase glass border border-metaverse-pink/30 text-metaverse-pink"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Stats grid */}
                    <ScrollReveal direction="right">
                        <div className="grid grid-cols-2 gap-4">
                            {STATS.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    whileHover={{ scale: 1.04, y: -2 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="glass rounded-2xl p-6 text-center border border-metaverse-pink/20 hover:border-metaverse-pink/50 hover:shadow-meta transition-all duration-300"
                                >
                                    <div className="font-orbitron font-black text-4xl gradient-text mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-slate-400 font-inter text-sm tracking-wider uppercase">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>

                {/* Why join */}
                <ScrollReveal className="text-center mb-10">
                    <h3 className="font-orbitron font-bold text-2xl sm:text-3xl text-white mb-2">
                        Why Join <span className="gradient-text">HackSpectra?</span>
                    </h3>
                    <p className="text-slate-400 font-inter">
                        More than a hackathon — it&apos;s a launchpad for your journey
                    </p>
                </ScrollReveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {WHY_JOIN.map((item, i) => (
                        <ScrollReveal key={item.title} delay={i * 0.1} direction="up">
                            <motion.div
                                whileHover={{ y: -6, scale: 1.02 }}
                                className="glass rounded-2xl p-6 border border-metaverse-pink/20 hover:border-metaverse-pink/40 hover:shadow-meta transition-all duration-300 text-center group"
                            >
                                <div className="text-4xl mb-4 group-hover:animate-float inline-block">
                                    {item.icon}
                                </div>
                                <h4 className="font-orbitron font-bold text-sm text-white mb-3 tracking-wide">
                                    {item.title}
                                </h4>
                                <p className="text-slate-400 font-inter text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
