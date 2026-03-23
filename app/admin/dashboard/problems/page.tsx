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
    FiCheckCircle,
    FiEdit2,
    FiTrash2
} from "react-icons/fi";

type Problem = {
    _id: string;
    title: string;
    description: string;
    track: string;
    maxTeams: number;
    selectedTeams: string[];
    isActive: boolean;
    teamId?: string;
    teamName?: string;
    isCustom?: boolean;
    selectedAt?: string;
    status?: "pending" | "approved" | "rejected";
};

export default function ProblemsManagement() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [customProblems, setCustomProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
    const [activeTab, setActiveTab] = useState<'predefined' | 'custom'>('predefined');
    const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);

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
                if (data.customProblems) {
                    setCustomProblems(data.customProblems);
                }
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

    const handleRejectCustomProblem = async () => {
        if (!selectedProblem || !selectedProblem.isCustom) return;
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/admin/teams/${selectedProblem._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rejectCustomProblem: true,
                    rejectionMessage: "Your custom problem was not approved. Please select another problem."
                }),
            });

            const data = await response.json();
            if (data.success) {
                showToast("Custom problem rejected and team notified. 🔴", "success");
                setIsRejectModalOpen(false);
                fetchProblems();
            } else {
                showToast(data.message || "Failed to reject problem", "error");
            }
        } catch (error) {
            showToast("Network error", "error");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleEditProblem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProblem) return;
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/admin/problems/${selectedProblem._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: selectedProblem.title,
                    description: selectedProblem.description,
                    track: selectedProblem.track,
                    maxTeams: selectedProblem.maxTeams,
                    isActive: selectedProblem.isActive,
                }),
            });

            const data = await response.json();
            if (data.success) {
                showToast("Problem updated successfully! 🚀", "success");
                setIsEditModalOpen(false);
                fetchProblems();
            } else {
                showToast(data.message || "Failed to update problem", "error");
            }
        } catch (error) {
            showToast("Network error", "error");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProblem = async () => {
        if (!selectedProblem) return;
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/admin/problems/${selectedProblem._id}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (data.success) {
                showToast("Problem deleted successfully", "success");
                setIsDeleteModalOpen(false);
                fetchProblems();
            } else {
                showToast(data.message || "Failed to delete problem", "error");
            }
        } catch (error) {
            showToast("Network error", "error");
            console.error(error);
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
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab === 'predefined' ? 'predefined' : 'custom'} problems...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-metaverse-pink/50 font-inter"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800/50 border border-white/5 text-slate-300 font-inter hover:bg-white/5 transition-all">
                            <FiFilter /> All Tracks
                        </button>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex p-1 bg-slate-800/50 rounded-2xl border border-white/5 w-fit">
                        <button
                            onClick={() => {
                                setActiveTab('predefined');
                                setExpandedProblemId(null);
                            }}
                            className={`px-6 py-2.5 rounded-xl font-orbitron font-bold text-xs sm:text-sm transition-all ${
                                activeTab === 'predefined'
                                    ? 'bg-metaverse-pink text-white shadow-[0_0_20px_rgba(255,46,126,0.3)]'
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            Predefined Problems
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('custom');
                                setExpandedProblemId(null);
                            }}
                            className={`px-6 py-2.5 rounded-xl font-orbitron font-bold text-xs sm:text-sm transition-all ${
                                activeTab === 'custom'
                                    ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            Student Innovation
                        </button>
                    </div>
                </div>
            </ScrollReveal>

            {/* Predefined Problems UI */}
            <AnimatePresence mode="wait">
                {activeTab === 'predefined' && (
                    <motion.div
                        key="predefined"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="mb-6 flex items-center gap-4">
                            <h3 className="font-orbitron font-bold text-xl text-white">Predefined Problems</h3>
                            <div className="h-px flex-1 bg-white/5"></div>
                        </div>
                        {isLoading ? (
                            <div className="px-6 py-12 text-center text-slate-500 font-inter">Loading problems...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {filteredProblems.map((problem) => {
                                    const remaining = Math.max(0, problem.maxTeams - problem.selectedTeams.length);
                                    const progress = (problem.selectedTeams.length / problem.maxTeams) * 100;
                                    const isExpanded = expandedProblemId === problem._id;

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

                                            <div className="flex-1 mb-6 flex flex-col">
                                                <p className={`text-slate-400 text-sm font-inter leading-relaxed ${isExpanded ? "" : "line-clamp-3"}`}>
                                                    {problem.description}
                                                </p>
                                                {problem.description.length > 120 && (
                                                    <button
                                                        onClick={() => setExpandedProblemId(isExpanded ? null : problem._id)}
                                                        className="text-metaverse-pink text-[10px] font-bold uppercase tracking-widest mt-2 w-fit hover:underline"
                                                    >
                                                        {isExpanded ? "Read Less" : "Read More"}
                                                    </button>
                                                )}
                                            </div>

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
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedProblem(problem);
                                                                setIsEditModalOpen(true);
                                                            }}
                                                            className="p-2 text-slate-500 hover:text-metaverse-pink transition-colors"
                                                            title="Edit Problem"
                                                        >
                                                            <FiEdit2 className="text-sm" />
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedProblem(problem);
                                                                setIsDeleteModalOpen(true);
                                                            }}
                                                            className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                                                            title="Delete Problem"
                                                        >
                                                            <FiTrash2 className="text-sm" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Problems (Student Innovation) UI */}
            <AnimatePresence mode="wait">
                {activeTab === 'custom' && (
                    <motion.div
                        key="custom"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="mb-6 flex items-center gap-4">
                            <h3 className="font-orbitron font-bold text-xl text-white">Student Innovation (Custom)</h3>
                            <div className="h-px flex-1 bg-white/5"></div>
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/20">
                                {customProblems.length} Submissions
                            </span>
                        </div>

                        {customProblems.length === 0 ? (
                            <div className="glass-dark p-12 rounded-3xl border border-white/5 text-center">
                                <p className="text-slate-500 font-inter">No custom problem statements submitted yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {customProblems.filter(p => 
                                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    p.teamName?.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((problem) => {
                                    const isExpanded = expandedProblemId === problem._id;
                                    return (
                                        <div key={problem._id} className="glass-dark p-6 rounded-2xl border border-blue-500/10 hover:border-blue-500/30 transition-all flex flex-col h-full group relative overflow-hidden bg-gradient-to-br from-blue-500/[0.02] to-transparent">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                                                    {problem.track}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-bold ml-auto uppercase opacity-60">
                                                    Submitted by
                                                </span>
                                            </div>

                                            <div className="mb-4">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Team</h4>
                                                <p className="text-white font-bold font-orbitron text-sm line-clamp-1">{problem.teamName}</p>
                                                <p className="text-[10px] text-slate-500 font-mono">{problem.teamId}</p>
                                            </div>

                                            <h3 className="font-orbitron font-bold text-white text-lg mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-400 transition-colors">
                                                {problem.title}
                                            </h3>

                                            <div className="flex-1 mb-6 flex flex-col">
                                                <p className={`text-slate-400 text-sm font-inter italic leading-relaxed ${isExpanded ? "" : "line-clamp-4"}`}>
                                                    &quot;{problem.description}&quot;
                                                </p>
                                                {problem.description.length > 150 && (
                                                    <button
                                                        onClick={() => setExpandedProblemId(isExpanded ? null : problem._id)}
                                                        className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-2 w-fit hover:underline"
                                                    >
                                                        {isExpanded ? "Read Less" : "Read More"}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                                                <span className="text-[10px] text-slate-500 font-inter italic">
                                                    {problem.selectedAt ? new Date(problem.selectedAt).toLocaleDateString() : 'N/A'}
                                                </span>
                                                <div className="flex items-center gap-3">
                                                    {(!problem.status || problem.status === "pending") ? (
                                                        <>
                                                            <button 
                                                                onClick={() => {
                                                                   const approve = async () => {
                                                                       setIsSubmitting(true);
                                                                       try {
                                                                           const res = await fetch(`/api/admin/teams/${problem._id}`, {
                                                                               method: "PATCH",
                                                                               headers: { "Content-Type": "application/json" },
                                                                               body: JSON.stringify({ approveCustomProblem: true }),
                                                                           });
                                                                           const data = await res.json();
                                                                           if (data.success) {
                                                                               showToast("Problem Approved! ✅", "success");
                                                                               fetchProblems();
                                                                           }
                                                                       } catch (err) { console.error(err); }
                                                                       finally { setIsSubmitting(false); }
                                                                   };
                                                                   approve();
                                                                }}
                                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-500 text-[10px] font-bold uppercase border border-green-500/20 hover:bg-green-500 hover:text-white transition-all shadow-lg hover:shadow-green-500/20"
                                                            >
                                                                <FiCheckCircle /> Approve
                                                            </button>
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedProblem(problem);
                                                                    setIsRejectModalOpen(true);
                                                                }}
                                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-bold uppercase border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20"
                                                            >
                                                                <FiX /> Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase border ${
                                                            problem.status === "approved" 
                                                            ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                                            : "bg-red-500/10 text-red-400 border-red-500/20"
                                                        }`}>
                                                            {problem.status === "approved" ? <FiCheckCircle /> : <FiX />}
                                                            {problem.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

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
                                        className="flex-1 py-4 rounded-xl bg-slate-800 text-slate-300 font-inter font-bold hover:bg-slate-700 transition-all font-orbitron"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] py-4 px-12 rounded-xl bg-gradient-to-r from-metaverse-pink to-metaverse-plum text-white font-orbitron font-bold text-sm tracking-wider uppercase hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Creating..." : "Confirm & Create"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Problem Modal */}
            <AnimatePresence>
                {isEditModalOpen && selectedProblem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
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
                                    <h3 className="text-2xl font-orbitron font-bold text-white">Edit Problem</h3>
                                    <p className="text-slate-400 text-sm font-inter">Update problem statement details.</p>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <FiX className="text-2xl" />
                                </button>
                            </div>

                            <form onSubmit={handleEditProblem} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Problem Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={selectedProblem.title}
                                        onChange={(e) => setSelectedProblem({ ...selectedProblem, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Track</label>
                                        <select
                                            value={selectedProblem.track}
                                            onChange={(e) => setSelectedProblem({ ...selectedProblem, track: e.target.value })}
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
                                            value={selectedProblem.maxTeams}
                                            onChange={(e) => setSelectedProblem({ ...selectedProblem, maxTeams: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={selectedProblem.description}
                                        onChange={(e) => setSelectedProblem({ ...selectedProblem, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div className="flex items-center gap-2 px-1">
                                    <input 
                                        type="checkbox" 
                                        id="isActive"
                                        checked={selectedProblem.isActive}
                                        onChange={(e) => setSelectedProblem({ ...selectedProblem, isActive: e.target.checked })}
                                        className="w-4 h-4 rounded border-white/10 bg-slate-800 text-metaverse-pink focus:ring-metaverse-pink/50"
                                    />
                                    <label htmlFor="isActive" className="text-sm text-slate-300 font-inter">Active (Visible to teams)</label>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 py-4 rounded-xl bg-slate-800 text-slate-300 font-orbitron font-bold text-sm tracking-wider uppercase hover:bg-slate-700 transition-all font-inter"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] py-4 px-12 rounded-xl bg-gradient-to-r from-metaverse-pink to-metaverse-plum text-white font-orbitron font-bold text-sm tracking-wider uppercase hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-inter"
                                    >
                                        {isSubmitting ? "Updating..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Reject Custom Problem Modal */}
            <AnimatePresence>
                {isRejectModalOpen && selectedProblem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsRejectModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-slate-900 border border-red-500/20 rounded-2xl p-8 shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-2xl mx-auto mb-6">
                                    <FiX />
                                </div>
                                <h3 className="font-orbitron font-bold text-xl text-white mb-2">Reject Custom Problem?</h3>
                                <p className="text-slate-400 text-sm font-inter mb-6">
                                    This will remove the custom problem statement from <span className="text-white font-bold">{selectedProblem.teamName}</span> and allow them to reselect. A rejection message will be sent to the team.
                                </p>

                                <div className="glass-dark rounded-xl p-4 border border-white/5 mb-8 text-left">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Custom Problem Title</p>
                                    <p className="text-white font-inter text-sm font-semibold">{selectedProblem.title}</p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsRejectModalOpen(false)}
                                        className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-400 font-orbitron font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRejectCustomProblem}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-orbitron font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Rejecting..." : "Yes, Reject"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedProblem && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-red-500/20 shadow-2xl p-8 text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-3xl mx-auto mb-6">
                                <FiTrash2 />
                            </div>
                            <h3 className="text-2xl font-orbitron font-bold text-white mb-2">Delete Problem?</h3>
                            <p className="text-slate-400 font-inter mb-8">
                                Are you sure you want to delete <span className="text-white font-bold">{selectedProblem.title}</span>? This will remove it from all teams who have selected it. This action cannot be undone.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleDeleteProblem}
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-xl bg-red-500 text-white font-orbitron font-bold text-sm tracking-wider uppercase hover:bg-red-600 transition-all disabled:opacity-50 font-inter"
                                >
                                    {isSubmitting ? "Deleting..." : "Yes, Delete Problem"}
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="w-full py-4 rounded-xl bg-slate-800 text-slate-300 font-orbitron font-bold text-sm tracking-wider uppercase hover:bg-slate-700 transition-all font-inter"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
