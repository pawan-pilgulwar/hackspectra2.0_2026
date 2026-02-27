"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const SPONSOR_TIERS = [
    {
        tier: "Host Institution",
        color: "from-purple-500 to-cyan-500",
        border: "border-purple-500/40",
        glow: "shadow-neon",
        sponsors: [
            {
                name: "MGM's College of Engineering",
                subtitle: "Nanded, Maharashtra",
                icon: "🏛️",
            },
            {
                name: "Department of CSE",
                subtitle: "Computer Science & Engineering",
                icon: "💻",
            },
        ],
    },
    {
        tier: "Community Partners",
        color: "from-yellow-500 to-orange-500",
        border: "border-yellow-500/30",
        glow: "shadow-yellow-500/30",
        sponsors: [
            { name: "Tech Community A", subtitle: "Gold Partner", icon: "🌟" },
            { name: "Developer Circle B", subtitle: "Gold Partner", icon: "🔥" },
            { name: "Startup Hub C", subtitle: "Silver Partner", icon: "💡" },
            { name: "Innovation Lab D", subtitle: "Silver Partner", icon: "⚗️" },
        ],
    },
];

export default function Sponsors() {
    return (
        <section
            id="sponsors"
            className="relative py-24 lg:py-32 bg-dark-100 overflow-hidden"
        >
            <div className="absolute top-0 left-0 right-0 h-px neon-line opacity-30" />
            <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-cyan-600/6 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 grid-bg opacity-15" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollReveal className="text-center mb-16">
                    <span className="inline-block text-xs font-inter font-semibold tracking-[0.3em] uppercase text-cyan-400 mb-3">
                        Our Supporters
                    </span>
                    <h2 className="font-orbitron font-bold text-3xl sm:text-4xl lg:text-5xl text-white section-underline">
                        Sponsors &amp; <span className="gradient-text">Partners</span>
                    </h2>
                    <p className="mt-6 text-slate-400 font-inter text-base max-w-xl mx-auto">
                        Our hackathon is made possible with the incredible support of these
                        organizations and communities.
                    </p>
                </ScrollReveal>

                {SPONSOR_TIERS.map((tierGroup, ti) => (
                    <div key={tierGroup.tier} className="mb-14">
                        <ScrollReveal className="text-center mb-8">
                            <div className="inline-flex items-center gap-3">
                                <div
                                    className={`h-px w-16 bg-gradient-to-r ${tierGroup.color}`}
                                />
                                <span
                                    className={`font-orbitron font-bold text-xs tracking-widest uppercase bg-gradient-to-r ${tierGroup.color} bg-clip-text text-transparent`}
                                >
                                    {tierGroup.tier}
                                </span>
                                <div
                                    className={`h-px w-16 bg-gradient-to-l ${tierGroup.color}`}
                                />
                            </div>
                        </ScrollReveal>

                        <div
                            className={`grid gap-5 ${tierGroup.sponsors.length === 2
                                    ? "sm:grid-cols-2 max-w-xl mx-auto"
                                    : "sm:grid-cols-2 lg:grid-cols-4"
                                }`}
                        >
                            {tierGroup.sponsors.map((sponsor, i) => (
                                <ScrollReveal key={sponsor.name} delay={i * 0.1}>
                                    <motion.div
                                        whileHover={{ y: -6, scale: 1.03 }}
                                        transition={{ type: "spring", stiffness: 280 }}
                                        className={`group glass rounded-2xl p-6 border ${tierGroup.border} hover:${tierGroup.glow} flex flex-col items-center text-center gap-3 transition-all duration-300`}
                                    >
                                        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                                            {sponsor.icon}
                                        </div>
                                        <div>
                                            <p className="font-orbitron font-bold text-sm text-white mb-1 leading-snug">
                                                {sponsor.name}
                                            </p>
                                            <p className="text-xs text-slate-500 font-inter">
                                                {sponsor.subtitle}
                                            </p>
                                        </div>
                                        <div
                                            className={`w-full h-px bg-gradient-to-r ${tierGroup.color} opacity-0 group-hover:opacity-40 transition-opacity duration-300`}
                                        />
                                    </motion.div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Become a sponsor CTA */}
                <ScrollReveal delay={0.3} className="text-center mt-6">
                    <div className="glass rounded-2xl px-8 py-6 border border-purple-500/20 max-w-lg mx-auto">
                        <p className="text-slate-300 font-inter text-base mb-1 font-semibold">
                            Interested in Sponsoring?
                        </p>
                        <p className="text-slate-500 font-inter text-sm mb-4">
                            Partner with us and reach 200+ student innovators
                        </p>
                        <a
                            href="mailto:hackspectra@mgmcen.ac.in"
                            className="inline-block px-6 py-2.5 rounded-lg font-inter font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-neon hover:scale-105 transition-all duration-200"
                        >
                            Get in Touch
                        </a>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
