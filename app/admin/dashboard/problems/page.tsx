"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import Toast from "@/components/Toast";
import {
    FiFileText,
    FiPlus,
    FiSearch,
    FiFilter,
    FiX,
    FiCheckCircle
} from "react-icons/fi";

type Problem = {
    _id: string;
    title: string;
    description: string;
    track: string;
    maxTeams: number;
    selectedTeams: string[];
    isActive: boolean;
};

export default function ProblemsManagement() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form state
    const [newProblem, setNewProblem] = useState({
        title: "",
        description: "",
        track: "Agriculture",
        maxTeams: 10,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const fetchProblems = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/problems");
            const data = await response.json();
            if (data.success) {
                setProblems(data.problems);
            }
        } catch (error) {
            console.error("Failed to fetch problems:", error);
            showToast("Failed to load problems", "error");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProblems();
    }, [fetchProblems]);

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
                showToast("Problem statement added!", "success");
                setIsAddModalOpen(false);
                setNewProblem({ title: "", description: "", track: "Agriculture", maxTeams: 10 });
                fetchProblems();
            } else {
                showToast(data.message || "Failed to add problem", "error");
            }
        } catch (error) {
            showToast("Network error", "error");
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredProblems = problems.filter(problem =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.track.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(p => ({ ...p, isVisible: false }))}
            />

            <ScrollReveal>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="font-orbitron font-bold text-3xl text-white">Problem Statements</h2>
                        <p className="text-slate-400 font-inter">Define and manage hackathon challenges.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-metaverse-pink text-white font-inter font-bold hover:shadow-glow-pink transition-all"
                    >
                        <FiPlus /> New Problem
                    </button>
                </div>
            </ScrollReveal>

            {/* Filters & Search */}
            <ScrollReveal delay={0.1}>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by title or track..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-metaverse-pink/50 font-inter"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800/50 border border-white/5 text-slate-300 font-inter hover:bg-white/5 transition-all">
                        <FiFilter /> All Tracks
                    </button>
                </div>
            </ScrollReveal>

            {/* Problems UI */}
            <ScrollReveal delay={0.2}>
                {isLoading ? (
                    <div className="px-6 py-12 text-center text-slate-500 font-inter">Loading problems...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProblems.map((problem) => {
                            const remaining = Math.max(0, problem.maxTeams - problem.selectedTeams.length);
                            const progress = (problem.selectedTeams.length / problem.maxTeams) * 100;

                            return (
                                <div key={problem._id} className="glass-dark p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col h-full group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <FiFileText className="text-6xl text-metaverse-pink" />
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-3 py-1 rounded-md bg-metaverse-pink/10 text-metaverse-pink text-[10px] font-bold uppercase tracking-widest border border-metaverse-pink/20">
                                            {problem.track}
                                        </span>
                                        {problem.isActive ? (
                                            <span className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase ml-auto">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase ml-auto">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                                                Inactive
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-orbitron font-bold text-white text-lg mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-metaverse-pink transition-colors">
                                        {problem.title}
                                    </h3>

                                    <p className="text-slate-400 text-sm font-inter line-clamp-3 mb-6 flex-1">
                                        {problem.description}
                                    </p>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between text-xs font-inter">
                                            <span className="text-slate-500">Utilization</span>
                                            <span className="text-white font-bold">{problem.selectedTeams.length} / {problem.maxTeams} Teams</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                style={{ width: `${progress}%` }}
                                                className={`h-full transition-all duration-500 ${progress >= 100 ? 'bg-red-500' : 'bg-metaverse-pink'}`}
                                            ></div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            {remaining === 0 ? (
                                                <span className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase">
                                                    <FiX /> Problem Full
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 text-green-500 text-xs font-bold uppercase">
                                                    <FiCheckCircle /> {remaining} Slots Left
                                                </span>
                                            )}
                                            <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase transition-colors tracking-widest">
                                                Edit Logic
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ScrollReveal>

            {/* Add Problem Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
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
                                    <h3 className="text-2xl font-orbitron font-bold text-white">Create Problem</h3>
                                    <p className="text-slate-400 text-sm font-inter">Define a new challenge for a specific track.</p>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <FiX className="text-2xl" />
                                </button>
                            </div>

                            <form onSubmit={handleAddProblem} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Problem Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProblem.title}
                                        onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                                        placeholder="e.g. AI-driven crop disease detection"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Track</label>
                                        <select
                                            value={newProblem.track}
                                            onChange={(e) => setNewProblem({ ...newProblem, track: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all appearance-none"
                                        >
                                            {tracks.map(track => (
                                                <option key={track} value={track}>{track}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Max Teams</label>
                                        <input
                                            type="number"
                                            required
                                            min={1}
                                            value={newProblem.maxTeams}
                                            onChange={(e) => setNewProblem({ ...newProblem, maxTeams: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all"
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
                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 py-4 rounded-xl bg-slate-800 text-slate-300 font-inter font-bold hover:bg-slate-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-3 py-4 px-12 rounded-xl bg-metaverse-pink text-white font-inter font-bold hover:shadow-glow-pink transition-all flex items-center justify-center gap-2"
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
