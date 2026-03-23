"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import Toast from "@/components/Toast";
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiMail,
    FiX,
    FiUser,
    FiExternalLink,
    FiEdit2,
    FiTrash2
} from "react-icons/fi";

type Team = {
    _id: string;
    teamId: string;
    teamName: string;
    leaderName: string;
    leaderEmail: string;
    teamMembers: string[];
    selectedProblem: {
        problemId: string;
        problemTitle: string;
        problemTrack: string;
    } | null;
    customProblemStatement: {
        title: string;
        description: string;
    } | null;
    selectedTrack: string | null;
    createdAt: string;
};

export default function TeamsManagement() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [problems, setProblems] = useState<{ _id: string, title: string, track: string }[]>([]);

    // Form state
    const [newTeam, setNewTeam] = useState({
        teamId: "",
        teamName: "",
        leaderName: "",
        leaderEmail: "",
        members: "",
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

    const showToast = (message: string, type: "success" | "error" | "info") => {
        setToast({ message, type, isVisible: true });
    };

    const fetchTeams = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/teams");
            const data = await response.json();
            if (data.success) {
                setTeams(data.teams);
            }
        } catch (error) {
            console.error("Failed to fetch teams:", error);
            showToast("Failed to load teams", "error");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchProblems = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/problems");
            const data = await response.json();
            if (data.success) {
                setProblems(data.problems);
            }
        } catch (error) {
            console.error("Failed to fetch problems:", error);
        }
    }, []);

    useEffect(() => {
        fetchTeams();
        fetchProblems();
    }, [fetchTeams, fetchProblems]);

    const handleEditTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeam) return;
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/admin/teams/${selectedTeam._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teamName: selectedTeam.teamName,
                    leaderName: selectedTeam.leaderName,
                    leaderEmail: selectedTeam.leaderEmail,
                    teamMembers: selectedTeam.teamMembers,
                    selectedProblemId: selectedTeam.selectedProblem?.problemId || null,
                }),
            });

            const data = await response.json();
            if (data.success) {
                showToast("Team updated successfully! 🎉", "success");
                setIsEditModalOpen(false);
                fetchTeams();
            } else {
                showToast(data.message || "Failed to update team", "error");
            }
        } catch (error) {
            showToast("Network error", "error");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTeam = async () => {
        if (!selectedTeam) return;
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/admin/teams/${selectedTeam._id}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (data.success) {
                showToast("Team deleted successfully", "success");
                setIsDeleteModalOpen(false);
                fetchTeams();
            } else {
                showToast(data.message || "Failed to delete team", "error");
            }
        } catch (error) {
            showToast("Network error", "error");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                showToast("Team added successfully!", "success");
                setIsAddModalOpen(false);
                setNewTeam({ teamId: "", teamName: "", leaderName: "", leaderEmail: "", members: "" });
                fetchTeams();
            } else {
                showToast(data.message || "Failed to add team", "error");
            }
        } catch (error) {
            showToast("Network error", "error");
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredTeams = teams.filter(team =>
        team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.teamId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(p => ({ ...p, isVisible: false }))}
            />

            <ScrollReveal>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="font-orbitron font-bold text-3xl text-white">Teams Management</h2>
                        <p className="text-slate-400 font-inter">View and manage all registered hackathon teams.</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-metaverse-pink text-white font-inter font-bold hover:shadow-glow-pink transition-all"
                    >
                        <FiPlus /> Add Team
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
                            placeholder="Search by team name, ID, or leader..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-metaverse-pink/50 font-inter"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800/50 border border-white/5 text-slate-300 font-inter hover:bg-white/5 transition-all">
                        <FiFilter /> Filter
                    </button>
                </div>
            </ScrollReveal>

            {/* Teams Table / Cards */}
            <ScrollReveal delay={0.2}>
                <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left font-inter">
                            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest font-bold">
                                <tr>
                                    <th className="px-6 py-4">Team</th>
                                    <th className="px-6 py-4">Leader</th>
                                    <th className="px-6 py-4">Members</th>
                                    <th className="px-6 py-4">Problem Selection</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            Loading teams...
                                        </td>
                                    </tr>
                                ) : filteredTeams.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            No teams found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTeams.map((team) => (
                                        <tr key={team._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-white mb-1">{team.teamName}</div>
                                                <div className="text-xs text-slate-500 font-mono">{team.teamId}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-slate-300 mb-1">
                                                    <FiUser className="text-metaverse-pink/50 text-xs" />
                                                    <span className="font-semibold text-sm">{team.leaderName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 text-xs">
                                                    <FiMail className="text-xs" />
                                                    <span>{team.leaderEmail}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex -space-x-2">
                                                    {[...Array(Math.min(3, team.teamMembers.length))].map((_, i) => (
                                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                                                            {team.teamMembers[i][0]}
                                                        </div>
                                                    ))}
                                                    {team.teamMembers.length > 3 && (
                                                        <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-200 font-bold">
                                                            +{team.teamMembers.length - 3}
                                                        </div>
                                                    )}
                                                    {team.teamMembers.length === 0 && (
                                                        <span className="text-xs text-slate-600 italic">No members added</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {team.selectedProblem || team.customProblemStatement ? (
                                                    <div className="flex flex-col gap-1 max-w-[300px]">
                                                        <span className="text-[10px] font-bold uppercase tracking-tighter text-metaverse-pink px-2 py-0.5 rounded bg-metaverse-pink/10 w-fit border border-metaverse-pink/20">
                                                            {team.selectedTrack || team.selectedProblem?.problemTrack || "N/A"}
                                                        </span>
                                                        <span className="text-white font-inter text-sm font-semibold leading-snug">
                                                            {team.selectedProblem?.problemTitle || team.customProblemStatement?.title}
                                                        </span>
                                                        {team.customProblemStatement && (
                                                            <span className="text-[9px] text-blue-400 font-bold uppercase">Custom Submission</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-600 text-xs italic font-inter">No selection</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTeam(team);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="p-2 text-slate-500 hover:text-metaverse-pink transition-colors"
                                                        title="Edit Team"
                                                    >
                                                        <FiEdit2 />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTeam(team);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                                                        title="Delete Team"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                    <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                                        <FiExternalLink />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden divide-y divide-white/5">
                        {isLoading ? (
                            <div className="px-6 py-12 text-center text-slate-500 font-inter">Loading teams...</div>
                        ) : filteredTeams.map((team) => (
                            <div key={team._id} className="p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{team.teamName}</h4>
                                        <span className="text-xs text-slate-500 font-mono">{team.teamId}</span>
                                    </div>
                                    <div className="text-right">
                                        {team.selectedProblem || team.customProblemStatement ? (
                                            <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-[10px] font-bold uppercase">Assigned</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-500 text-[10px] font-bold uppercase">Pending</span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Leader</span>
                                        <p className="text-sm text-slate-300 font-medium">{team.leaderName}</p>
                                        <p className="text-xs text-slate-500 break-all">{team.leaderEmail}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Members</span>
                                        <p className="text-sm text-slate-300">{team.teamMembers.length} members</p>
                                    </div>
                                </div>

                                {team.selectedProblem && (
                                    <div className="p-3 rounded-xl bg-slate-800/50 border border-white/5">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Assigned Problem</span>
                                        <p className="text-sm text-slate-200 font-medium">{team.selectedProblem.problemTitle}</p>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        onClick={() => {
                                            setSelectedTeam(team);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="flex-1 py-2 rounded-lg bg-white/5 border border-white/5 text-slate-300 text-xs font-bold uppercase hover:bg-metaverse-pink/10 hover:text-metaverse-pink transition-all"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedTeam(team);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="flex-1 py-2 rounded-lg bg-white/5 border border-white/5 text-slate-300 text-xs font-bold uppercase hover:bg-red-500/10 hover:text-red-500 transition-all"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollReveal>

            {/* Add Team Modal */}
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
                                    <h3 className="text-2xl font-orbitron font-bold text-white">Add New Team</h3>
                                    <p className="text-slate-400 text-sm font-inter">Register a team manually into the system.</p>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <FiX className="text-2xl" />
                                </button>
                            </div>

                            <form onSubmit={handleAddTeam} className="p-8 space-y-6">
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
                                        {isSubmitting ? "Adding..." : "Confirm & Add"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Team Modal */}
            <AnimatePresence>
                {isEditModalOpen && selectedTeam && (
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
                                    <h3 className="text-2xl font-orbitron font-bold text-white">Edit Team</h3>
                                    <p className="text-slate-400 text-sm font-inter">Update team details and problem selection.</p>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <FiX className="text-2xl" />
                                </button>
                            </div>

                            <form onSubmit={handleEditTeam} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Team Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={selectedTeam.teamName}
                                            onChange={(e) => setSelectedTeam({ ...selectedTeam, teamName: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Leader Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={selectedTeam.leaderName}
                                            onChange={(e) => setSelectedTeam({ ...selectedTeam, leaderName: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Leader Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={selectedTeam.leaderEmail}
                                            onChange={(e) => setSelectedTeam({ ...selectedTeam, leaderEmail: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Selected Problem</label>
                                        <select
                                            value={selectedTeam.selectedProblem?.problemId || ""}
                                            onChange={(e) => {
                                                const pId = e.target.value;
                                                if (pId === "") {
                                                    setSelectedTeam({ ...selectedTeam, selectedProblem: null });
                                                } else {
                                                    const p = problems.find(prob => prob._id === pId);
                                                    if (p) {
                                                        setSelectedTeam({
                                                            ...selectedTeam,
                                                            selectedProblem: {
                                                                problemId: p._id,
                                                                problemTitle: p.title,
                                                                problemTrack: p.track
                                                            }
                                                        });
                                                    }
                                                }
                                            }}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all appearance-none"
                                        >
                                            <option value="">None / Pending</option>
                                            {problems.map(p => (
                                                <option key={p._id} value={p._id}>{p.title} ({p.track})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Team Members (comma separated)</label>
                                    <textarea
                                        rows={3}
                                        value={selectedTeam.teamMembers.join(", ")}
                                        onChange={(e) => setSelectedTeam({
                                            ...selectedTeam,
                                            teamMembers: e.target.value.split(",").map(m => m.trim()).filter(m => m !== "")
                                        })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/5 text-white focus:border-metaverse-pink/50 focus:outline-none transition-all resize-none font-inter"
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 py-4 rounded-xl bg-slate-800 text-slate-300 font-orbitron font-bold text-sm tracking-wider uppercase hover:bg-slate-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] py-4 px-12 rounded-xl bg-gradient-to-r from-metaverse-pink to-metaverse-plum text-white font-orbitron font-bold text-sm tracking-wider uppercase hover:shadow-glow-pink transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Updating..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedTeam && (
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
                            <h3 className="text-2xl font-orbitron font-bold text-white mb-2">Delete Team?</h3>
                            <p className="text-slate-400 font-inter mb-8">
                                Are you sure you want to delete <span className="text-white font-bold">{selectedTeam.teamName}</span>? This action cannot be undone and will free up any selected problem slots.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleDeleteTeam}
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-xl bg-red-500 text-white font-orbitron font-bold text-sm tracking-wider uppercase hover:bg-red-600 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "Deleting..." : "Yes, Delete Team"}
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="w-full py-4 rounded-xl bg-slate-800 text-slate-300 font-orbitron font-bold text-sm tracking-wider uppercase hover:bg-slate-700 transition-all"
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
