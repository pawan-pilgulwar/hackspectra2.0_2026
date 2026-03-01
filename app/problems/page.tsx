"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import Toast from "@/components/Toast";
import { TRACKS } from "@/constants";
import Link from "next/link";

type TeamData = {
  teamId: string;
  teamName: string;
  leaderEmail: string;
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
  } | null;
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
        credentials: "include", // Include cookies
      });

      const data = await response.json();

      if (data.success && data.team) {
        setTeamData(data.team);
        fetchProblems();
      } else {
        // Not authenticated, redirect to auth page
        router.push("/auth");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/auth");
    }
  }, [router]);

  // FIX ISSUE 2: Check JWT authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleSelectProblem = async (problemId: string) => {
    if (!teamData || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/problems/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include JWT cookie
        body: JSON.stringify({
          problemId: problemId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast("Problem selected successfully! 🎉", "success");
        
        // Refresh team data to get updated selection
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
        credentials: "include", // Include JWT cookie
        body: JSON.stringify({
          title: customTitle.trim(),
          description: customDescription.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast("Custom problem submitted successfully! 🎉", "success");
        
        // Refresh team data to get updated selection
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

  // Group problems by track
  const problemsByTrack = problems.reduce((acc, problem) => {
    if (!acc[problem.track]) {
      acc[problem.track] = [];
    }
    acc[problem.track].push(problem);
    return acc;
  }, {} as Record<string, Problem[]>);

  const hasAlreadySelected =
    teamData?.selectedProblemId || teamData?.customProblemStatement;

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* FIX ISSUE 1: Already Selected Banner with Full Problem Details */}
        {hasAlreadySelected && (
          <ScrollReveal>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="max-w-3xl mx-auto mb-10 p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-2xl">
                    ✓
                  </div>
                  <div className="flex-1">
                    <h3 className="font-orbitron font-bold text-lg text-green-400 mb-2">
                      Selection Locked
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
                      </div>
                    ) : teamData.selectedProblem ? (
                      // FIX ISSUE 1: Display full problem details for predefined problems
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
                      // Fallback if problem details not available
                      <p className="text-slate-300 font-inter">
                        <span className="font-semibold">Track:</span> {teamData.selectedTrack}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="max-w-32 mx-auto mb-5 p-3 rounded-2xl bg-gradient-to-r from-blue-800/10 to-green-100/10 border border-green-500/30 text-center"
            >
                <Link href={"/"}>
                  <button>🏠 Home</button>
                </Link>
            </motion.div>
          </ScrollReveal>
        )}

        {/* Track Selection */}
        {!hasAlreadySelected && (
          <ScrollReveal>
            <div className="mb-12">
              <h2 className="font-orbitron font-bold text-xl sm:text-2xl text-white text-center mb-6">
                Select a Track
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
                {TRACKS.map((track) => (
                  <button
                    key={track.title}
                    onClick={() =>
                      setSelectedTrack(
                        selectedTrack === track.title ? null : track.title
                      )
                    }
                    className={`p-4 rounded-xl glass border transition-all ${
                      selectedTrack === track.title
                        ? "border-metaverse-pink bg-metaverse-pink/10 scale-105"
                        : "border-metaverse-pink/10 hover:border-metaverse-pink/30"
                    }`}
                  >
                    <div className="text-3xl mb-2">{track.icon}</div>
                    <div className="font-inter font-semibold text-xs sm:text-sm text-white">
                      {track.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Student Innovation Form */}
        {!hasAlreadySelected && selectedTrack === "Student Innovation" && (
          <ScrollReveal>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mb-12 p-8 rounded-2xl glass-dark border border-metaverse-pink/20"
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
                  onClick={handleSubmitCustom}
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
            <ScrollReveal>
              <div className="max-w-6xl mx-auto">
                <h3 className="font-orbitron font-bold text-2xl text-white text-center mb-8">
                  {selectedTrack} Problems
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {problemsByTrack[selectedTrack].map((problem) => (
                    <motion.div
                      key={problem._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-2xl p-6 border border-metaverse-pink/10 hover:border-metaverse-pink/30 transition-all"
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
                        onClick={() => handleSelectProblem(problem._id)}
                        disabled={
                          isSubmitting || problem.remainingSlots === 0
                        }
                        className={`w-full px-4 py-2 rounded-lg font-inter font-semibold text-sm transition-all ${
                          problem.remainingSlots === 0
                            ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                            : "bg-metaverse-pink text-white hover:scale-105 active:scale-95"
                        }`}
                      >
                        {problem.remainingSlots === 0
                          ? "Full"
                          : isSubmitting
                          ? "Selecting..."
                          : "Select This Problem"}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}
      </div>
    </section>
  );
}
