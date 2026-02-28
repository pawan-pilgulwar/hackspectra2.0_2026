"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { CONTACT, STUDENT_REG_URL, NAV_LINKS, EVENT_NAME, EVENT_YEAR, EVENT_DURATION } from "@/constants";
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiInstagram,
    FiGlobe,
} from "react-icons/fi";
import { RiSpeedUpFill } from "react-icons/ri";

export default function Footer() {
    const scrollTo = (id: string) => {
        document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <footer id="contact" className="relative bg-dark-200 overflow-hidden">
            {/* Top divider */}
            <div className="h-px w-full neon-line opacity-50" />

            {/* Glow accents */}
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-metaverse-pink/5 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 grid-bg opacity-10" />

            {/* Contact section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <ScrollReveal className="text-center mb-16">
                    <span className="inline-block text-xs font-inter font-semibold tracking-[0.3em] uppercase text-metaverse-pink mb-3">
                        Get In Touch
                    </span>
                    <h2 className="font-orbitron font-bold text-3xl sm:text-4xl lg:text-5xl text-white section-underline">
                        Contact <span className="gradient-text">Us</span>
                    </h2>
                </ScrollReveal>

                <div className="grid lg:grid-cols-3 gap-8 mb-20">
                    {/* Venue */}
                    <ScrollReveal delay={0.1}>
                        <div className="glass rounded-2xl p-6 border border-metaverse-pink/20 hover:border-metaverse-pink/40 hover:shadow-meta transition-all duration-300 h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-metaverse-pink to-metaverse-plum flex items-center justify-center shadow-meta">
                                    <FiMapPin className="text-white text-lg" />
                                </div>
                                <h3 className="font-orbitron font-bold text-sm text-white tracking-wide">
                                    Our Venue
                                </h3>
                            </div>
                            <p className="text-slate-400 font-inter text-sm leading-relaxed">
                                {CONTACT.venue}
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Phone */}
                    <ScrollReveal delay={0.2}>
                        <div className="glass rounded-2xl p-6 border border-metaverse-plum/20 hover:border-metaverse-plum/40 hover:shadow-meta transition-all duration-300 h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-metaverse-plum to-metaverse-navy flex items-center justify-center shadow-meta">
                                    <FiPhone className="text-white text-lg" />
                                </div>
                                <h3 className="font-orbitron font-bold text-sm text-white tracking-wide">
                                    Call Us
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {CONTACT.phones.map((phone) => (
                                    <a
                                        key={phone}
                                        href={`tel:${phone}`}
                                        className="block text-slate-300 font-inter text-sm hover:text-metaverse-pink transition-colors"
                                    >
                                        +91 {phone}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Email */}
                    <ScrollReveal delay={0.3}>
                        <div className="glass rounded-2xl p-6 border border-metaverse-slate/20 hover:border-metaverse-slate/40 hover:shadow-meta-slate transition-all duration-300 h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-metaverse-slate to-metaverse-navy flex items-center justify-center shadow-meta-slate">
                                    <FiMail className="text-white text-lg" />
                                </div>
                                <h3 className="font-orbitron font-bold text-sm text-white tracking-wide">
                                    Email Us
                                </h3>
                            </div>
                            <a
                                href={`mailto:${CONTACT.email}`}
                                className="text-slate-300 font-inter text-sm hover:text-metaverse-pink transition-colors break-all"
                            >
                                {CONTACT.email}
                            </a>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Register CTA banner */}
                <ScrollReveal className="mb-20">
                    <div className="relative rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-metaverse-navy via-metaverse-plum to-metaverse-pink opacity-80" />
                        <div className="absolute inset-0 grid-bg opacity-10" />
                        <div className="relative z-10 px-8 py-12 text-center">
                            <h3 className="font-orbitron font-black text-2xl sm:text-3xl text-white mb-3">
                                Ready to{" "}
                                <span className="gradient-text">Hack the Future</span>?
                            </h3>
                            <p className="text-slate-300 font-inter text-base mb-8 max-w-lg mx-auto">
                                Join {EVENT_NAME} {EVENT_YEAR} — {EVENT_DURATION.toLowerCase()} to build, innovate, and win amazing prizes!
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <a
                                    href={STUDENT_REG_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-3.5 rounded-xl font-inter font-bold text-sm text-white bg-gradient-to-r from-metaverse-navy via-metaverse-plum to-metaverse-pink hover:shadow-meta hover:scale-105 transition-all duration-200"
                                >
                                    ⚡ Student Registration
                                </a>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </section>

            {/* Footer bottom bar */}
            <div className="relative z-10 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-metaverse-pink to-metaverse-plum flex items-center justify-center">
                                <RiSpeedUpFill className="text-white text-sm" />
                            </div>
                            <span className="font-orbitron font-bold text-base gradient-text">
                                HACK<span className="text-metaverse-pink">SPECTRA</span>
                            </span>
                        </div>

                        {/* Quick nav */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {NAV_LINKS.slice(0, 5).map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => scrollTo(link.href)}
                                    className="text-slate-500 hover:text-metaverse-pink font-inter text-xs transition-colors"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>

                        {/* Social icons */}
                        <div className="flex items-center gap-3">
                            {[
                                { Icon: FiInstagram, href: CONTACT.socials.instagram, label: "Instagram" },
                                { Icon: FiGlobe, href: CONTACT.socials.website, label: "Website" },
                            ].map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-slate-400 hover:text-metaverse-pink hover:border-metaverse-pink/50 transition-all duration-200"
                                >
                                    <Icon className="text-sm" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <p className="text-slate-600 font-inter text-xs">
                            © {EVENT_YEAR} {EVENT_NAME} — MGM&apos;s College of Engineering, Nanded. All rights reserved.
                            <span className="mx-2 text-slate-700">·</span>
                            Built with ❤️ for Innovation
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
