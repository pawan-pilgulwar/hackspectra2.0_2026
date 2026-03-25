"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import Toast from "@/components/Toast";
import { TRACKS } from "@/constants";
import Link from "next/link";
import { FiMenu, FiX, FiUser, FiMail, FiUsers, FiLogOut } from "react-icons/fi";

type TeamData = {
  teamId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  teamMembers: string[];
  selectedTrack: string | null;
  selectedProblemId: string | null;
  selectedProblem: {
    _id: string;
    title: string;
    description: string;
    track: string;
  } | null;
  customProblemStatement: {
    title: string;
    description: string;
    status: "pending" | "approved" | "rejected";
  } | null;
  rejectionMessage: string | null;
  isCustomProblemRejected: boolean;
  selectedAt: string | null;
};

type Problem = {
  _id: string;
  title: string;
  description: string;
  track: string;
  maxTeams: number;
  selectedCount: number;
  remainingSlots: number;
  isActive: boolean;
};

export default function ProblemsPage() {
  const router = useRouter();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingProblem, setPendingProblem] = useState<Problem | null>(null);
  const [showCustomConfirmModal, setShowCustomConfirmModal] = useState(false);

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

  const checkAuth = useCallback(async () => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("/api/problems/list", {
          credentials: "include",
        });
        const data = await response.json();

        if (data.success && data.problems) {
          setProblems(data.problems);
        } else {
          showToast("Failed to load problems", "error");
        }
      } catch (error) {
        console.error("Failed to fetch problems:", error);
        showToast("Network error. Please refresh the page.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success && data.team) {
        setTeamData(data.team);
        fetchProblems();
      } else {
        router.push("/auth");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/auth");
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        showToast("Logged out successfully", "success");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Failed to logout", "error");
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (teamData?.rejectionMessage && teamData?.isCustomProblemRejected) {
      showToast(teamData.rejectionMessage, "error");
    }
  }, [teamData]);

  const handleSelectProblem = async (problemId: string) => {
    if (!teamData || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/problems/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          problemId: problemId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast("Problem selected successfully! 🎉", "success");
        await checkAuth();
      } else {
        showToast(data.message || "Failed to select problem", "error");
      }
    } catch (error) {
      console.error("Selection error:", error);
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCustom = async () => {
    if (!teamData || isSubmitting) return;

    if (customTitle.trim().length < 5) {
      showToast("Title must be at least 5 characters", "error");
      return;
    }

    if (customDescription.trim().length < 20) {
      showToast("Description must be at least 20 characters", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/problems/submit-custom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: customTitle.trim(),
          description: customDescription.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast("Custom problem submitted successfully! 🎉", "success");
        await checkAuth();
      } else {
        showToast(data.message || "Failed to submit custom problem", "error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const problemsByTrack = problems.reduce((acc, problem) => {
    if (!acc[problem.track]) {
      acc[problem.track] = [];
    }
    acc[problem.track].push(problem);
    return acc;
  }, {} as Record<string, Problem[]>);

  const hasAlreadySelected =
    teamData?.selectedProblemId ||
    (teamData?.customProblemStatement && teamData.customProblemStatement.status !== "rejected");

  // Team Information Panel Component
  const TeamInfoPanel = () => (
    <div className="glass-dark rounded-2xl p-6 border border-metaverse-pink/20 sticky top-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-metaverse-pink to-metaverse-plum flex items-center justify-center text-2xl">
          👥
        </div>
        <div>
          <h3 className="font-orbitron font-bold text-lg text-white">Team Info</h3>
          <p className="text-xs text-slate-400">Authenticated</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-metaverse-beige text-xs font-inter font-semibold mb-1">
            <FiUsers className="text-sm" />
            <span>TEAM NAME</span>
          </div>
          <p className="text-white font-inter font-semibold">{teamData?.teamName}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-metaverse-beige text-xs font-inter font-semibold mb-1">
            <FiUser className="text-sm" />
            <span>TEAM LEADER</span>
          </div>
          <p className="text-white font-inter">{teamData?.leaderName}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-metaverse-beige text-xs font-inter font-semibold mb-1">
            <FiMail className="text-sm" />
            <span>EMAIL</span>
          </div>
          <p className="text-slate-300 font-inter text-sm break-all">{teamData?.leaderEmail}</p>
        </div>

        {teamData?.teamMembers && teamData.teamMembers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-metaverse-beige text-xs font-inter font-semibold mb-2">
              <FiUsers className="text-sm" />
              <span>TEAM MEMBERS ({teamData.teamMembers.length})</span>
            </div>
            <div className="space-y-1">
              {teamData.teamMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-metaverse-pink"></div>
                  <p className="text-slate-300 font-inter text-sm">{member}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-700 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] text-slate-500 font-inter uppercase tracking-wider">Team ID</p>
            <p className="text-xs text-slate-400 font-mono break-all">{teamData?.teamId}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-metaverse-pink/20 to-metaverse-plum/20 border border-metaverse-pink/30 text-white font-inter font-semibold hover:from-metaverse-pink hover:to-metaverse-plum hover:border-transparent transition-all active:scale-95 group shadow-lg hover:shadow-metaverse-pink/20"
          >
            <FiLogOut className="text-lg group-hover:-translate-x-1 transition-transform" />
            <span>Logout Team</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading || !teamData) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-metaverse-navy meta-pattern">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-metaverse-pink border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-inter">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen py-16 lg:py-24 bg-metaverse-navy meta-pattern">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
        className="fixed top-20 right-4 z-50 lg:hidden w-12 h-12 rounded-full glass-dark border border-metaverse-pink/30 flex items-center justify-center text-white hover:border-metaverse-pink transition-all"
        aria-label="Toggle team info"
      >
        {mobileDrawerOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-metaverse-navy border-l border-metaverse-pink/20 z-50 lg:hidden overflow-y-auto p-6"
            >
              <TeamInfoPanel />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Layout: 30% Team Info + 70% Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Team Info Panel - Desktop Only */}
          <div className="hidden lg:block lg:col-span-4">
            <TeamInfoPanel />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Header */}
            <ScrollReveal className="text-center mb-10">
              <span className="inline-block text-xs font-inter font-semibold tracking-[0.3em] uppercase text-metaverse-beige mb-3">
                Problem Statements
              </span>
              <h1 className="font-orbitron font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
                Choose Your Challenge
              </h1>
              <p className="text-slate-400 font-inter text-base max-w-2xl mx-auto">
                Welcome, <span className="text-metaverse-pink font-semibold">{teamData.teamName}</span>!
                Select one problem statement for your team.
              </p>
            </ScrollReveal>

            {/* Already Selected Banner */}
            {hasAlreadySelected && teamData && (
              <ScrollReveal>
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className={`mb-10 p-6 rounded-2xl border ${teamData.customProblemStatement?.status === "pending"
                    ? "bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border-blue-500/30"
                    : "bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/30"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${teamData.customProblemStatement?.status === "pending"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-green-500/20 text-green-400"
                      }`}>
                      {teamData.customProblemStatement?.status === "pending" ? "⏳" : "✓"}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-orbitron font-bold text-lg mb-2 ${teamData.customProblemStatement?.status === "pending"
                        ? "text-blue-400"
                        : "text-green-400"
                        }`}>
                        {teamData.customProblemStatement?.status === "pending"
                          ? "Submission Under Review"
                          : "Selection Locked"}
                      </h3>
                      {teamData.customProblemStatement ? (
                        <div>
                          <p className="text-slate-300 font-inter mb-2">
                            <span className="font-semibold">Track:</span> Student Innovation
                          </p>
                          <p className="text-slate-300 font-inter mb-1">
                            <span className="font-semibold">Your Problem:</span>{" "}
                            {teamData.customProblemStatement.title}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {teamData.customProblemStatement.description}
                          </p>
                          {teamData.customProblemStatement.status === "pending" && (
                            <p className="mt-4 text-blue-400/80 text-xs italic font-inter">
                              You&apos;ll be notified of the outcome shortly.
                            </p>
                          )}
                        </div>
                      ) : teamData.selectedProblem ? (
                        <div>
                          <p className="text-slate-300 font-inter mb-2">
                            <span className="font-semibold">Track:</span> {teamData.selectedTrack}
                          </p>
                          <p className="text-slate-300 font-inter mb-1">
                            <span className="font-semibold">Problem:</span>{" "}
                            {teamData.selectedProblem.title}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {teamData.selectedProblem.description}
                          </p>
                        </div>
                      ) : (
                        <p className="text-slate-300 font-inter">
                          <span className="font-semibold">Track:</span> {teamData.selectedTrack}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="max-w-32 mx-auto mb-5 p-3 rounded-2xl bg-gradient-to-r from-blue-800/10 to-green-100/10 border border-green-500/30 text-center"
                >
                  <Link href={"/"}>
                    <button className="text-white hover:text-metaverse-pink transition-colors">🏠 Home</button>
                  </Link>
                </motion.div>
              </ScrollReveal>
            )}

            {/* Rejection Banner */}
            {!hasAlreadySelected && teamData?.isCustomProblemRejected && (
              <ScrollReveal>
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-2xl text-red-500">
                      ✕
                    </div>
                    <div className="flex-1">
                      <h3 className="font-orbitron font-bold text-lg text-red-400 mb-2">
                        Problem Not Approved
                      </h3>
                      <p className="text-slate-300 font-inter mb-4">
                        {teamData.rejectionMessage || "Your custom problem was not approved. Please select another problem from the predefined list or submit a new custom one."}
                      </p>
                      <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1 italic">Status:</p>
                        <p className="text-slate-400 font-bold text-sm">Selection Reset</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            )}

            {/* Track Selection & Problem Navigation */}
            {!hasAlreadySelected && (
              <ScrollReveal>
                <div className="mb-12">
                  <AnimatePresence mode="wait">
                    {!selectedTrack ? (
                      <motion.div
                        key="track-grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <h2 className="font-orbitron font-bold text-xl sm:text-2xl text-white text-center mb-6">
                          Select a Track
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {TRACKS.filter((track) => track.title !== "Student Innovation").map((track) => (
                            <button
                              key={track.title}
                              onClick={() => setSelectedTrack(track.title)}
                              className="p-4 rounded-xl glass border border-metaverse-pink/10 hover:border-metaverse-pink/30 hover:bg-metaverse-pink/5 transition-all group"
                            >
                              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                                {track.icon}
                              </div>
                              <div className="font-inter font-semibold text-xs sm:text-sm text-white">
                                {track.title}
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="track-dropdown"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-dark rounded-2xl p-6 border border-metaverse-pink/20 flex flex-col sm:flex-row items-center justify-between gap-6"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">
                            {TRACKS.find((t) => t.title === selectedTrack)?.icon}
                          </div>
                          <div>
                            <p className="text-xs text-metaverse-beige font-inter font-bold uppercase tracking-widest">
                              Selected Track
                            </p>
                            <h3 className="font-orbitron font-bold text-xl text-white">
                              {selectedTrack}
                            </h3>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                          <label className="text-[10px] text-slate-500 font-bold uppercase ml-1">
                            Switch Track
                          </label>
                          <select
                            value={selectedTrack}
                            onChange={(e) => setSelectedTrack(e.target.value)}
                            className="bg-slate-800 border border-white/10 text-white px-4 py-2.5 rounded-xl font-inter text-sm focus:border-metaverse-pink transition-all outline-none appearance-none cursor-pointer min-w-[200px]"
                          >
                            {TRACKS.map((track) => (
                              <option key={track.title} value={track.title}>
                                {track.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            )}

            {/* Student Innovation Form */}
            {!hasAlreadySelected && selectedTrack === "Student Innovation" && (
              <ScrollReveal>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12 p-8 rounded-2xl glass-dark border border-metaverse-pink/20"
                >
                  <h3 className="font-orbitron font-bold text-2xl text-white mb-4">
                    Submit Your Custom Problem
                  </h3>
                  <p className="text-slate-400 font-inter text-sm mb-6">
                    For Student Innovation track, submit your own problem statement.
                  </p>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-inter font-medium text-slate-300 mb-2">
                        Problem Title
                      </label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="Enter problem title (min 5 characters)"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 font-inter focus:outline-none focus:border-metaverse-pink focus:ring-2 focus:ring-metaverse-pink/20 transition-all disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-inter font-medium text-slate-300 mb-2">
                        Problem Description
                      </label>
                      <textarea
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder="Describe your problem statement (min 20 characters)"
                        rows={5}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 font-inter focus:outline-none focus:border-metaverse-pink focus:ring-2 focus:ring-metaverse-pink/20 transition-all disabled:opacity-50 resize-none"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (customTitle.trim().length < 5) {
                          showToast("Title must be at least 5 characters", "error");
                          return;
                        }
                        if (customDescription.trim().length < 20) {
                          showToast("Description must be at least 20 characters", "error");
                          return;
                        }
                        setShowCustomConfirmModal(true);
                      }}
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-metaverse-pink to-metaverse-plum text-white font-inter font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Custom Problem"}
                    </button>
                  </div>
                </motion.div>
              </ScrollReveal>
            )}

            {/* Problem Statements */}
            {!hasAlreadySelected &&
              selectedTrack &&
              selectedTrack !== "Student Innovation" &&
              problemsByTrack[selectedTrack] && (
                <div>
                  <h3 className="font-orbitron font-bold text-2xl text-white text-center mb-8">
                    {selectedTrack} Problems
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {problemsByTrack[selectedTrack].map((problem) => (
                      <motion.div
                        key={problem._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`glass rounded-2xl p-6 border border-metaverse-pink/10 hover:border-metaverse-pink/30 transition-all ${problem.remainingSlots === 0 ? "opacity-60 grayscale-[0.4]" : ""
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <h4 className="font-orbitron font-semibold text-lg text-white flex-1">
                            {problem.title}
                          </h4>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs text-slate-400">Slots</div>
                            <div className="font-orbitron font-bold text-xl text-metaverse-beige">
                              {problem.remainingSlots}
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                          {problem.description}
                        </p>

                        <button
                          onClick={() => {
                            setPendingProblem(problem);
                            setShowConfirmModal(true);
                          }}
                          disabled={
                            isSubmitting || problem.remainingSlots === 0
                          }
                          className={`w-full px-4 py-2 rounded-lg font-inter font-semibold text-sm transition-all ${problem.remainingSlots === 0
                            ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                            : "bg-metaverse-pink text-white hover:scale-105 active:scale-95"
                            }`}
                        >
                          {problem.remainingSlots === 0
                            ? "Limit Full"
                            : isSubmitting && pendingProblem?._id === problem._id
                              ? "Selecting..."
                              : "Select This Problem"}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Selection Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && pendingProblem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-metaverse-pink/30 shadow-2xl p-8 overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-metaverse-pink/10 rounded-full blur-3xl -z-1" />

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-metaverse-pink/20 flex items-center justify-center text-3xl mx-auto mb-6">
                  ⚠️
                </div>
                <h3 className="font-orbitron font-bold text-2xl text-white mb-2">
                  Confirm Selection
                </h3>
                <p className="text-slate-400 text-sm font-inter mb-6">
                  Are you sure you want to select this problem?
                  <span className="text-metaverse-pink block font-semibold mt-1">
                    You cannot change it later.
                  </span>
                </p>

                <div className="glass-dark rounded-xl p-4 border border-white/5 mb-8 text-left">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Track</p>
                  <p className="text-white font-inter font-semibold mb-3">{pendingProblem.track}</p>

                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Problem Title</p>
                  <p className="text-white font-inter font-semibold">{pendingProblem.title}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      handleSelectProblem(pendingProblem._id);
                      setShowConfirmModal(false);
                    }}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-metaverse-pink to-metaverse-plum text-white font-orbitron font-bold text-sm tracking-widest uppercase hover:shadow-glow-pink transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Selection"}
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-slate-800 text-slate-400 font-orbitron font-bold text-sm tracking-widest uppercase hover:bg-slate-700 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Selection Confirmation Modal */}
      <AnimatePresence>
        {showCustomConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCustomConfirmModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-metaverse-pink/30 shadow-2xl p-8 overflow-hidden"
            >
              {/* Decorative background glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-metaverse-pink/10 rounded-full blur-3xl -z-1" />

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-metaverse-pink/20 flex items-center justify-center text-3xl mx-auto mb-6">
                  ⚠️
                </div>
                <h3 className="font-orbitron font-bold text-2xl text-white mb-2">
                  Confirm Submission
                </h3>
                <p className="text-slate-400 text-sm font-inter mb-6">
                  Are you sure you want to submit this problem?
                  <span className="text-metaverse-pink block font-semibold mt-1">
                    You cannot change it later.
                  </span>
                </p>

                <div className="glass-dark rounded-xl p-4 border border-white/5 mb-8 text-left">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Custom Problem Title</p>
                  <p className="text-white font-inter font-semibold mb-3">{customTitle}</p>

                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Description Preview</p>
                  <p className="text-slate-300 font-inter text-sm line-clamp-3">
                    {customDescription}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      handleSubmitCustom();
                      setShowCustomConfirmModal(false);
                    }}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-metaverse-pink to-metaverse-plum text-white font-orbitron font-bold text-sm tracking-widest uppercase hover:shadow-glow-pink transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Confirm & Submit"}
                  </button>
                  <button
                    onClick={() => setShowCustomConfirmModal(false)}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-slate-800 text-slate-400 font-orbitron font-bold text-sm tracking-widest uppercase hover:bg-slate-700 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
