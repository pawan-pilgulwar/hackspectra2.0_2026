"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EVENT_DATE } from "@/constants";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function getTimeLeft(): TimeLeft {
    const target = new Date(EVENT_DATE).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

function DigitCard({ value, label }: { value: number; label: string }) {
    const display = String(value).padStart(2, "0");

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="countdown-card rounded-xl px-4 py-3 sm:px-6 sm:py-4 min-w-[70px] sm:min-w-[90px] text-center relative overflow-hidden">
                {/* Scan line animation */}
                <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-scan" />
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={display}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="font-orbitron text-2xl sm:text-4xl font-bold gradient-text block"
                    >
                        {display}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span className="text-xs sm:text-sm text-slate-400 font-inter uppercase tracking-widest">
                {label}
            </span>
        </div>
    );
}

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    const isOver = Object.values(timeLeft).every((v) => v === 0);

    if (isOver) {
        return (
            <div className="text-center py-4">
                <span className="font-orbitron text-2xl gradient-text font-bold tracking-widest">
                    THE HACK HAS BEGUN! 🚀
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 sm:gap-6">
            <DigitCard value={timeLeft.days} label="Days" />
            <span className="font-orbitron text-2xl sm:text-3xl text-purple-400 font-bold self-start mt-3">
                :
            </span>
            <DigitCard value={timeLeft.hours} label="Hours" />
            <span className="font-orbitron text-2xl sm:text-3xl text-purple-400 font-bold self-start mt-3">
                :
            </span>
            <DigitCard value={timeLeft.minutes} label="Mins" />
            <span className="font-orbitron text-2xl sm:text-3xl text-purple-400 font-bold self-start mt-3">
                :
            </span>
            <DigitCard value={timeLeft.seconds} label="Secs" />
        </div>
    );
}
