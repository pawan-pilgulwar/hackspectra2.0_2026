"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import Toast from "@/components/Toast";

export default function AuthPage() {
  const router = useRouter();
  const [teamId, setTeamId] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!teamId.trim() || !leaderEmail.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: Include cookies
        body: JSON.stringify({
          teamId: teamId.trim(),
          leaderEmail: leaderEmail.trim(),
        }),
      });

      const data = await response.json();

      if (data.success && data.team) {
        // JWT is now stored in HTTP-only cookie by the server
        // No need to store anything in sessionStorage
        
        showToast("Authentication successful! Redirecting...", "success");
        
        // Redirect to problems page after short delay
        setTimeout(() => {
          router.push("/problems");
        }, 1500);
      } else {
        showToast(
          data.message || "Invalid Team ID or Leader Email",
          "error"
        );
        
        // Redirect to home after error
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      showToast("Network error. Please try again.", "error");
      
      // Redirect to home after error
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-metaverse-navy meta-pattern py-16 px-4">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="max-w-md w-full">
        <ScrollReveal>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-dark rounded-2xl p-8 border border-metaverse-pink/20 shadow-2xl"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-metaverse-pink to-metaverse-plum flex items-center justify-center text-3xl">
                  🔐
                </div>
              </motion.div>
              
              <h1 className="font-orbitron font-bold text-2xl sm:text-3xl text-white mb-2">
                Team Authentication
              </h1>
              <p className="text-slate-400 font-inter text-sm">
                Enter your Unstop credentials to select problem statements
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="teamId"
                  className="block text-sm font-inter font-medium text-slate-300 mb-2"
                >
                  Team ID
                </label>
                <input
                  type="text"
                  id="teamId"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  placeholder="Enter your Unstop Team ID"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 font-inter focus:outline-none focus:border-metaverse-pink focus:ring-2 focus:ring-metaverse-pink/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="leaderEmail"
                  className="block text-sm font-inter font-medium text-slate-300 mb-2"
                >
                  Team Leader Email
                </label>
                <input
                  type="email"
                  id="leaderEmail"
                  value={leaderEmail}
                  onChange={(e) => setLeaderEmail(e.target.value)}
                  placeholder="leader@example.com"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 font-inter focus:outline-none focus:border-metaverse-pink focus:ring-2 focus:ring-metaverse-pink/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-metaverse-pink to-metaverse-plum text-white font-inter font-semibold text-base hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-metaverse-pink/30"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  "Authenticate & Continue"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-500 text-center font-inter">
                Don&apos;t have a Team ID?{" "}
                <a
                  href="/"
                  className="text-metaverse-pink hover:text-metaverse-beige transition-colors"
                >
                  Register on Unstop first
                </a>
              </p>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
