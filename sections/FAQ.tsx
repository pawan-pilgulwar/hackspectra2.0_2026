"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { FAQ_ITEMS } from "@/constants";

function FAQItem({
    question,
    answer,
    index,
}: {
    question: string;
    answer: string;
    index: number;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ScrollReveal delay={index * 0.07}>
            <div
                className={`rounded-xl glass border transition-all duration-300 overflow-hidden ${isOpen
                    ? "border-metaverse-pink/50 shadow-meta"
                    : "border-white/5 hover:border-metaverse-pink/30"
                    }`}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left group"
                    aria-expanded={isOpen}
                >
                    <span
                        className={`font-inter font-semibold text-sm sm:text-base transition-colors duration-200 ${isOpen ? "text-metaverse-pink" : "text-slate-200 group-hover:text-white"
                            }`}
                    >
                        {question}
                    </span>
                    <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className={`shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-200 ${isOpen
                            ? "border-metaverse-pink bg-metaverse-pink/20 text-metaverse-pink"
                            : "border-slate-600 text-slate-400 group-hover:border-metaverse-pink/50"
                            }`}
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </motion.div>
                </button>

                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <div className="px-5 pb-5">
                                <div className="h-px w-full bg-gradient-to-r from-metaverse-pink/30 to-transparent mb-4" />
                                <p className="text-slate-400 font-inter text-sm leading-relaxed">
                                    {answer}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ScrollReveal>
    );
}

export default function FAQ() {
    return (
        <section id="faq" className="relative py-24 lg:py-32 bg-metaverse-navy overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px meta-line opacity-30" />
            <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-metaverse-pink/5 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 grid-bg opacity-10" />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollReveal className="text-center mb-16">
                    <span className="inline-block text-xs font-inter font-semibold tracking-[0.3em] uppercase text-metaverse-pink mb-3">
                        Got Questions?
                    </span>
                    <h2 className="font-orbitron font-bold text-3xl sm:text-4xl lg:text-5xl text-white section-underline">
                        Frequently Asked <span className="gradient-text">Questions</span>
                    </h2>
                    <p className="mt-6 text-slate-400 font-inter text-base max-w-xl mx-auto">
                        Everything you need to know about HackSpectra. Can&apos;t find the
                        answer? Reach out to us directly.
                    </p>
                </ScrollReveal>

                <div className="space-y-3">
                    {FAQ_ITEMS.map((item, i) => (
                        <FAQItem
                            key={i}
                            question={item.question}
                            answer={item.answer}
                            index={i}
                        />
                    ))}
                </div>

                {/* Contact CTA */}
                <ScrollReveal delay={0.4} className="mt-12 text-center">
                    <div className="glass rounded-2xl px-8 py-6 border border-metaverse-pink/20">
                        <p className="text-slate-300 font-inter text-base mb-2">
                            Still have questions?
                        </p>
                        <a
                            href="mailto:hackspectra@mgmcen.ac.in"
                            className="font-inter font-semibold text-metaverse-pink hover:text-metaverse-slate transition-colors underline underline-offset-4"
                        >
                            hackspectra@mgmcen.ac.in
                        </a>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
