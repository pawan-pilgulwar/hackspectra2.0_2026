"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import Toast from "@/components/Toast";
import {
    FiUsers,
    FiFileText,
    FiCheckCircle,
    FiClock,
    FiTrendingUp,
    FiActivity,
    FiSettings,
    FiPlus,
    FiX
} from "react-icons/fi";

type DashboardStats = {
    totalTeams: number;
    selectedTeams: number;
    totalProblems: number;
    availableSlots: number;
};

type Team = {
    selectedProblem: unknown;
    customProblemStatement: unknown;
};

type Problem = {
    maxTeams: number;
    selectedTeams: unknown[];
};

export default function AdminDashboardOverview() {
    const [stats, setStats] = useState<DashboardStats>({
        totalTeams: 0,
        selectedTeams: 0,
        totalProblems: 0,
        availableSlots: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal states
    const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
    const [isAddProblemModalOpen, setIsAddProblemModalOpen] = useState(false);

    // Form states
    const [newTeam, setNewTeam] = useState({
        teamId: "",
        teamName: "",
        leaderName: "",
        leaderEmail: "",
        members: "",
    });

    const [newProblem, setNewProblem] = useState({
        title: "",
        description: "",
        track: "Agriculture",
        maxTeams: 10,
    });

    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | "info";
        isVisible: boolean;
    }>({
        message: "",
        type: "info",
        isVisible: false,
    });

    const tracks = [
        "Agriculture",
        "Healthcare",
        "Education",
        "Smart City",
        "Disaster Management",
        "Cybersecurity",
        "Transportation & Tourism",
        "Women & Child Development",
    ];

    const showToast = (message: string, type: "success" | "error" | "info") => {
        setToast({ message, type, isVisible: true });
    };

    const fetchDashboardData = useCallback(async () => {
        try {
            const [teamsRes, problemsRes] = await Promise.all([
                fetch("/api/admin/teams"),
                fetch("/api/admin/problems"),
            ]);

            const teamsData = await teamsRes.json();
            const problemsData = await problemsRes.json();

            if (teamsData.success && problemsData.success) {
                const totalTeams = teamsData.teams.length;
                const selectedTeams = teamsData.teams.filter((t: Team) => t.selectedProblem || t.customProblemStatement).length;
                const totalProblems = problemsData.problems.length;
                const availableSlots = problemsData.problems.reduce((acc: number, p: Problem) => acc + (p.maxTeams - p.selectedTeams.length), 0);

                setStats({
                    totalTeams,
                    selectedTeams,
                    totalProblems,
                    availableSlots,
                });
            }
        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleAddTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/admin/teams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newTeam,
                    teamMembers: newTeam.members.split(",").map(m => m.trim()).filter(m => m !== ""),
                }),
            });

            const data = await response.json();
            if (data.success) {
                showToast("Team added successfully! 🎉", "success");
                setIsAddTeamModalOpen(false);
                setNewTeam({ teamId: "", teamName: "", leaderName: "", leaderEmail: "", members: "" });
                await fetchDashboardData();
            } else {
                showToast(data.message || "Failed to add team", "error");
            }
        } catch (error) {
            showToast("Network error. Please try again.", "error");
            console.log("Failed to add team:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddProblem = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/admin/problems", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProblem),
            });

            const data = await response.json();
            if (data.success) {
                showToast("Problem statement created! 🎉", "success");
                setIsAddProblemModalOpen(false);
                setNewProblem({ title: "", description: "", track: "Agriculture", maxTeams: 10 });
                await fetchDashboardData();
            } else {
                showToast(data.message || "Failed to add problem", "error");
            }
        } catch {
            showToast("Network error. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const statCards = [
        {
            label: "Total Teams",
            value: stats.totalTeams,
            icon: <FiUsers />,
            color: "from-blue-500 to-cyan-400",
            trend: "+12% from last hack",
        },
        {
            label: "Problems Selected",
            value: stats.selectedTeams,
            icon: <FiCheckCircle />,
            color: "from-green-500 to-emerald-400",
            trend: `${Math.round((stats.selectedTeams / (stats.totalTeams || 1)) * 100)}% completion`,
        },
        {
            label: "Problem Statements",
            value: stats.totalProblems,
            icon: <FiFileText />,
            color: "from-metaverse-pink to-metaverse-plum",
            trend: "Across 8 tracks",
        },
        {
            label: "Available Slots",
            value: stats.availableSlots,
            icon: <FiActivity />,
            color: "from-orange-500 to-amber-400",
            trend: "Total capacity",
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-metaverse-pink border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(p => ({ ...p, isVisible: false }))}
            />

            <ScrollReveal>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-orbitron font-bold text-3xl text-white">System Overview</h2>
                        <p className="text-slate-400 font-inter">Live statistics and platform health.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-xl border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-inter font-bold text-slate-300 uppercase tracking-widest">Server Live</span>
                    </div>
                </div>
            </ScrollReveal>

            {/* Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <ScrollReveal key={card.label} delay={index * 0.1}>
                        <div className="glass-dark p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-[0.03] blur-2xl group-hover:opacity-[0.08] transition-all`}></div>

                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white text-xl shadow-lg`}>
                                    {card.icon}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-slate-400 text-sm font-inter font-medium">{card.label}</h3>
                                <div className="text-3xl font-orbitron font-bold text-white leading-none">
                                    {card.value}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                                <FiTrendingUp className="text-green-500 text-xs" />
                                <span className="text-[10px] font-inter font-bold text-slate-500 uppercase tracking-widest">{card.trend}</span>
                            </div>
                        </div>
                    </ScrollReveal>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ScrollReveal delay={0.4}>
                    <div className="glass-dark p-8 rounded-2xl border border-white/5 h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-orbitron font-bold text-xl text-white">Quick Actions</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setIsAddTeamModalOpen(true)}
                                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-metaverse-pink/10 hover:border-metaverse-pink/30 hover:text-metaverse-pink text-slate-400 font-inter font-semibold transition-all text-left group"
                            >
                                <FiPlus className="mb-2 text-xl group-hover:scale-110 transition-transform" />
                                Add New Team
                            </button>
                            <button
                                onClick={() => setIsAddProblemModalOpen(true)}
                                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-metaverse-pink/10 hover:border-metaverse-pink/30 hover:text-metaverse-pink text-slate-400 font-inter font-semibold transition-all text-left group"
                            >
                                <FiFileText className="mb-2 text-xl group-hover:scale-110 transition-transform" />
                                Add Problem
                            </button>
                            <button className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-metaverse-pink/10 hover:border-metaverse-pink/30 hover:text-metaverse-pink text-slate-400 font-inter font-semibold transition-all text-left">
                                <FiClock className="mb-2 text-xl" />
                                Export Data
                            </button>
                            <button className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-metaverse-pink/10 hover:border-metaverse-pink/30 hover:text-metaverse-pink text-slate-400 font-inter font-semibold transition-all text-left">
                                <FiSettings className="mb-2 text-xl" />
                                Project Settings
                            </button>
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.5}>
                    <div className="glass-dark p-8 rounded-2xl border border-white/5 h-full overflow-hidden">
                        <h3 className="font-orbitron font-bold text-xl text-white mb-6">Selection Progress</h3>

                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-400 font-inter">Total Capacity Used</span>
                                    <span className="text-sm text-metaverse-pink font-orbitron">
                                        {Math.round((stats.selectedTeams / (stats.totalTeams || 1)) * 100)}%
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stats.selectedTeams / (stats.totalTeams || 1)) * 100}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-metaverse-pink to-metaverse-plum shadow-glow-pink-sm"
                                    ></motion.div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-metaverse-pink/5 border border-metaverse-pink/10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-metaverse-pink/20 flex items-center justify-center text-metaverse-pink text-xl">
                                        <FiTrendingUp />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-300 font-inter leading-relaxed">
                                            <span className="text-metaverse-pink font-bold">{stats.availableSlots} slots</span> are still available for team selection.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isAddTeamModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddTeamModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-orbitron font-bold text-white">Add New Team</h3>
                                    <p className="text-slate-400 text-sm font-inter">Quickly register a team from the dashboard.</p>
                                </div>
                                <button onClick={() => setIsAddTeamModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <FiX className="text-2xl" />
                                </button>
                            </div>

                            <form onSubmit={handleAddTeam} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Team ID (from Unstop)</label>
                                        <input
                                            type="text"
                                            required
                                            value={newTeam.teamId}
                                            onChange={(e) => setNewTeam({ ...newTeam, teamId: e.target.value })}
                                            placeholder="e.g. HS-2026-001"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Team Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={newTeam.teamName}
                                            onChange={(e) => setNewTeam({ ...newTeam, teamName: e.target.value })}
                                            placeholder="Enter team name"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Leader Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={newTeam.leaderName}
                                            onChange={(e) => setNewTeam({ ...newTeam, leaderName: e.target.value })}
                                            placeholder="Full name"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Leader Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={newTeam.leaderEmail}
                                            onChange={(e) => setNewTeam({ ...newTeam, leaderEmail: e.target.value })}
                                            placeholder="email@example.com"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Team Members (names, comma separated)</label>
                                    <textarea
                                        rows={3}
                                        value={newTeam.members}
                                        onChange={(e) => setNewTeam({ ...newTeam, members: e.target.value })}
                                        placeholder="Member 2, Member 3, Member 4..."
                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddTeamModalOpen(false)}
                                        className="flex-1 py-4 rounded-xl bg-slate-800 text-slate-300 font-inter font-bold hover:bg-slate-700 transition-all font-orbitron text-sm tracking-wider uppercase"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] py-4 px-12 rounded-xl bg-gradient-to-r from-metaverse-pink to-metaverse-plum text-white font-orbitron font-bold text-sm tracking-wider uppercase hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Adding..." : "Confirm & Add"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAddProblemModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddProblemModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-orbitron font-bold text-white">New Problem</h3>
                                    <p className="text-slate-400 text-sm font-inter">Define a challenge for a specific track.</p>
                                </div>
                                <button onClick={() => setIsAddProblemModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <FiX className="text-2xl" />
                                </button>
                            </div>

                            <form onSubmit={handleAddProblem} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Problem Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProblem.title}
                                        onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                                        placeholder="e.g. AI-driven crop disease detection"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all font-inter"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Track</label>
                                        <div className="relative">
                                            <select
                                                value={newProblem.track}
                                                onChange={(e) => setNewProblem({ ...newProblem, track: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all appearance-none font-inter cursor-pointer"
                                            >
                                                {tracks.map(track => (
                                                    <option key={track} value={track} className="bg-slate-900">{track}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                ▼
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Max Teams</label>
                                        <input
                                            type="number"
                                            required
                                            min={1}
                                            value={newProblem.maxTeams}
                                            onChange={(e) => setNewProblem({ ...newProblem, maxTeams: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all font-inter"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={newProblem.description}
                                        onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
                                        placeholder="Detailed problem description..."
                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all resize-none font-inter"
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddProblemModalOpen(false)}
                                        className="flex-1 py-4 rounded-xl bg-slate-800 text-slate-300 font-orbitron font-bold text-sm tracking-wider uppercase hover:bg-slate-700 transition-all font-inter"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] py-4 px-12 rounded-xl bg-gradient-to-r from-metaverse-pink to-metaverse-plum text-white font-orbitron font-bold text-sm tracking-wider uppercase hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-inter"
                                    >
                                        {isSubmitting ? "Creating..." : "Confirm & Create"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
