"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { TIMELINE, EVENT_NAME } from "@/constants";
import { useInView } from "react-intersection-observer";

function TimelineCard({
    item,
    index,
    isLast,
}: {
    item: (typeof TIMELINE)[number];
    index: number;
    isLast: boolean;
}) {
    const isLeft = index % 2 === 0;
    const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

    return (
        // add padding on small screens to make room for the bubble/line
        <div ref={ref} className="relative flex items-center justify-center pl-12 lg:pl-0">
            {/* Vertical connector line */}
            {!isLast ? (
                <div className="absolute top-12 bottom-0 left-4 lg:left-1/2 lg:-translate-x-1/2 w-1 lg:w-2">
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="origin-top w-full h-full bg-gradient-to-b from-metaverse-beige/40 via-metaverse-pink/70 to-metaverse-plum/60 opacity-90"
                    />
                </div>
            ) : (
                <div className="absolute top-12 bottom-0 left-4 lg:left-1/2 lg:-translate-x-1/2 w-1 lg:w-2">
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="origin-top w-full h-12 bg-gradient-to-b from-metaverse-beige/40 via-metaverse-pink/70 to-metaverse-plum/60 opacity-90"
                    />
                </div>
            )}

            {/* Center step bubble */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 z-10 w-14 h-14 rounded-full glass-dark border border-metaverse-beige/20 flex items-center justify-center shadow-meta text-2xl"
            >
                {item.icon}
            </motion.div>

            {/* Card — alternates left/right on desktop */}
            <div
                className={`w-full grid grid-cols-1 lg:grid-cols-2 gap-4 py-4 ${isLeft ? "lg:text-right" : ""
                    }`}
            >
                <motion.div
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    animate={
                        inView
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: isLeft ? -40 : 40 }
                    }
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`${isLeft ? "lg:col-start-1 lg:pr-16" : "lg:col-start-2 lg:pl-16"}`}
                >
                    <div
                        className={`glass rounded-2xl p-5 border border-metaverse-pink/20 hover:border-metaverse-pink/50 hover:shadow-meta transition-all duration-300 group ${isLeft ? "lg:text-right" : "text-left"
                            }`}
                    >
                        <div
                            className={`flex items-center gap-3 mb-2 ${isLeft ? "lg:flex-row-reverse" : ""
                                }`}
                        >
                            <span className="font-orbitron text-xs font-bold text-metaverse-pink tracking-widest">
                                STEP {item.step}
                            </span>
                        </div>
                        <h3 className="font-orbitron font-bold text-xl sm:text-2xl text-white mb-2 group-hover:gradient-text transition-all">
                            {item.title}
                        </h3>
                        <p className="text-slate-300 font-inter text-sm sm:text-base leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function Timeline() {
    return (
        <section
            id="timeline"
            className="relative py-24 lg:py-32 bg-metaverse-navy meta-pattern overflow-hidden"
        >
            <div className="absolute top-0 left-0 right-0 h-px meta-line opacity-30" />
            <div className="absolute -bottom-40 right-0 w-96 h-96 rounded-full bg-metaverse-pink/5 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 grid-bg opacity-10" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollReveal className="text-center mb-16">
                    <span className="inline-block text-xs font-inter font-semibold tracking-[0.3em] uppercase text-metaverse-pink mb-3">
                        Event Structure
                    </span>
                    <h2 className="font-orbitron font-bold text-3xl sm:text-4xl lg:text-5xl text-white section-underline break-words">
                        {EVENT_NAME} <span className="gradient-text">Flow</span>
                    </h2>
                    <p className="mt-6 text-slate-400 font-inter text-base max-w-xl mx-auto">
                        The structured approach we follow for {EVENT_NAME} — from kickoff to
                        closing ceremony.
                    </p>
                </ScrollReveal>

                {/* Timeline list */}
                <div className="relative space-y-2">
                    {TIMELINE.map((item, i) => (
                        <TimelineCard
                            key={item.step}
                            item={item}
                            index={i}
                            isLast={i === TIMELINE.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
