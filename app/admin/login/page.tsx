"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import Toast from "@/components/Toast";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | "info";
        isVisible: boolean;
    }>({
        message: "",
        type: "info",
        isVisible: false,
    });

    const showToast = (message: string, type: "success" | "error" | "info") => {
        setToast({ message, type, isVisible: true });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, isVisible: false }));
    };

    // Check for session expired error
    useEffect(() => {
        const error = searchParams.get("error");
        if (error === "session_expired") {
            showToast("Your session has expired or you logged in from another device.", "error");
            
            // Clean up the URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, "", newUrl);
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;

        setIsLoading(true);

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (data.success) {
                showToast("Login successful! Redirecting to dashboard...", "success");
                setTimeout(() => {
                    router.push("/admin/dashboard");
                }, 1500);
            } else {
                showToast(data.message || "Invalid password", "error");
            }
        } catch (error) {
            console.error("Login error:", error);
            showToast("Network error. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-metaverse-navy meta-pattern py-12 px-4 sm:px-6 lg:px-8">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />

            <div className="max-w-md w-full space-y-8">
                <ScrollReveal className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-metaverse-pink to-metaverse-plum flex items-center justify-center text-4xl shadow-glow-pink">
                            🛡️
                        </div>
                    </div>
                    <h2 className="font-orbitron font-bold text-3xl sm:text-4xl text-white mb-2">
                        Admin Access
                    </h2>
                    <p className="text-slate-400 font-inter">
                        Enter the master password to access the dashboard.
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                    <div className="glass-dark rounded-3xl p-8 border border-metaverse-pink/20 shadow-2xl relative overflow-hidden group">
                        {/* Ambient background glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-metaverse-pink/10 rounded-full blur-3xl group-hover:bg-metaverse-pink/20 transition-all duration-700"></div>

                        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-inter font-medium text-slate-300 mb-2"
                                >
                                    Admin Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    disabled={isLoading}
                                    className="w-full px-4 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 font-inter focus:outline-none focus:border-metaverse-pink focus:ring-2 focus:ring-metaverse-pink/20 transition-all disabled:opacity-50"
                                    autoComplete="current-password"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                                type="submit"
                                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-metaverse-pink to-metaverse-plum text-white font-inter font-bold text-lg hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Authenticating...
                                    </>
                                ) : (
                                    "Unlock Dashboard"
                                )}
                            </motion.button>
                        </form>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.push("/")}
                            className="text-slate-500 hover:text-metaverse-beige font-inter text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            ← Back to Main Page
                        </button>
                    </div>
                </ScrollReveal>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 -left-12 w-64 h-64 bg-metaverse-pink/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-metaverse-plum/5 rounded-full blur-[100px]"></div>
            </div>
        </section>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-metaverse-navy flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-metaverse-pink border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
