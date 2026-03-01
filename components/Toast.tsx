"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const bgColor = {
    success: "from-green-500/20 to-green-600/20 border-green-500/50",
    error: "from-red-500/20 to-red-600/20 border-red-500/50",
    info: "from-blue-500/20 to-blue-600/20 border-blue-500/50",
  };

  const icon = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md"
        >
          <div
            className={`glass-dark rounded-xl p-4 border bg-gradient-to-r ${bgColor[type]} shadow-2xl`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${
                  type === "success"
                    ? "bg-green-500/30 text-green-400"
                    : type === "error"
                    ? "bg-red-500/30 text-red-400"
                    : "bg-blue-500/30 text-blue-400"
                }`}
              >
                {icon[type]}
              </div>
              <p className="flex-1 text-white font-inter text-sm sm:text-base">
                {message}
              </p>
              <button
                onClick={onClose}
                className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
