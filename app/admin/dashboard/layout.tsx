"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiHome,
    FiUsers,
    FiFileText,
    FiLogOut,
    FiMenu,
    FiX,
    FiShield
} from "react-icons/fi";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // Check if admin is authenticated
    // In a real app, this should be done in middleware or server components
    // But for this junior dev task, we'll add a simple client-side check as well
    useEffect(() => {
        // We'll rely on server-side protection for the actual dashboard data
        // This is just for UI redirection
        setIsLoading(false);
    }, []);

    const navItems = [
        { name: "Overview", href: "/admin/dashboard", icon: <FiHome /> },
        { name: "Teams", href: "/admin/dashboard/teams", icon: <FiUsers /> },
        { name: "Problem Statements", href: "/admin/dashboard/problems", icon: <FiFileText /> },
    ];

    const handleLogout = async () => {
        // Clear cookie (we'll implement an API for this if needed, or just let it expire)
        // For now, redirect to login
        router.push("/admin/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-metaverse-navy flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-metaverse-pink border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-metaverse-navy flex overflow-hidden">
            {/* Sidebar - Desktop */}
            <aside
                className={`hidden md:flex flex-col w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-metaverse-pink to-metaverse-plum flex items-center justify-center text-xl">
                            <FiShield />
                        </div>
                        <span className="font-orbitron font-bold text-xl text-white tracking-wider">
                            ADMIN
                        </span>
                    </div>

                    <nav className="space-y-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl font-inter transition-all group ${isActive
                                        ? "bg-metaverse-pink/20 text-metaverse-pink border border-metaverse-pink/30 shadow-glow-pink-sm"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? 'text-metaverse-pink' : 'text-slate-500'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-semibold">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-8">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all group font-inter"
                    >
                        <FiLogOut className="text-xl group-hover:translate-x-1 transition-transform" />
                        <span className="font-semibold">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Sidebar - Mobile */}
            <AnimatePresence>
                {!isSidebarOpen && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        className="fixed inset-0 z-50 md:hidden flex"
                    >
                        <div className="w-80 bg-slate-900 border-r border-white/10 p-8 flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-metaverse-pink to-metaverse-plum flex items-center justify-center text-xl">
                                        <FiShield />
                                    </div>
                                    <span className="font-orbitron font-bold text-xl text-white">
                                        ADMIN
                                    </span>
                                </div>
                                <button onClick={() => setIsSidebarOpen(true)} className="text-white text-2xl">
                                    <FiX />
                                </button>
                            </div>

                            <nav className="space-y-4">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsSidebarOpen(true)}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-inter transition-all ${isActive
                                                ? "bg-metaverse-pink/20 text-metaverse-pink border border-metaverse-pink/30"
                                                : "text-slate-400 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            <span className="text-xl">{item.icon}</span>
                                            <span className="font-semibold">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="mt-auto">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-inter"
                                >
                                    <FiLogOut className="text-xl" />
                                    <span className="font-semibold">Logout</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(true)}></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-slate-900/30 backdrop-blur-md relative z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-slate-400 hover:text-white transition-colors md:hidden"
                        >
                            <FiMenu className="text-2xl" />
                        </button>
                        <h1 className="font-orbitron font-bold text-xl text-white hidden sm:block">
                            {navItems.find(item => pathname === item.href)?.name || "Dashboard"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs text-metaverse-beige font-inter font-bold tracking-widest uppercase">Logged in as</span>
                            <span className="text-white font-inter font-semibold">Administrator</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-metaverse-pink/20 to-metaverse-plum/20 flex items-center justify-center text-slate-400">
                                <FiShield />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
}
