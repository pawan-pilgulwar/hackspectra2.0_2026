"use client";

import { useEffect, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

type Problem = {
  id: string;
  title: string;
  description: string;
  limit: number;
};

const SAMPLE_PROBLEMS: Problem[] = [
  {
    id: "p1",
    title: "Smart Farming Assistant",
    description:
      "Create an AI-driven assistant to help small farmers optimize crop yield and irrigation.",
    limit: 6,
  },
  {
    id: "p2",
    title: "Healthcare Triage Bot",
    description:
      "Build a triage system to prioritize urgent cases using symptom input and basic vitals.",
    limit: 8,
  },
  {
    id: "p3",
    title: "Campus Safety Tracker",
    description:
      "Design an app that improves student safety with location alerts and incident reporting.",
    limit: 5,
  },
  {
    id: "p4",
    title: "Green City Analytics",
    description:
      "Analyze city sensor data to propose actionable steps for reducing energy consumption.",
    limit: 7,
  },
];

export default function ProblemStatements() {
  const [problems, setProblems] = useState<Problem[]>(SAMPLE_PROBLEMS);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("ps_selection");
    if (saved) setSelected(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("ps_selection", JSON.stringify(selected));
  }, [selected]);

  const handleSelect = (id: string) => {
    if (selected[id]) return; // already selected
    // decrement local limit (frontend only)
    setProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, limit: Math.max(0, p.limit - 1) } : p))
    );
    setSelected((s) => ({ ...s, [id]: true }));
  };

  return (
    <section id="problems" className="relative py-16 lg:py-24 bg-metaverse-navy meta-pattern">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-10">
          <span className="inline-block text-xs font-inter font-semibold tracking-[0.3em] uppercase text-metaverse-beige mb-3">
            Problem Statements
          </span>
          <h2 className="font-orbitron font-bold text-3xl sm:text-4xl text-white">
            Choose Your Problem Statement
          </h2>
          <p className="mt-4 text-slate-400 font-inter text-base max-w-xl mx-auto">
            Pick one problem statement for your team. Limits are shown per statement. Selections are frontend-only for now.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {problems.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-5 border border-metaverse-pink/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-orbitron font-semibold text-lg text-white mb-2">{p.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{p.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Remaining</div>
                  <div className="mt-1 font-orbitron font-bold text-xl text-metaverse-beige">{p.limit}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <button
                  onClick={() => handleSelect(p.id)}
                  disabled={selected[p.id] || p.limit <= 0}
                  className={`px-4 py-2 rounded-lg font-inter font-semibold text-sm transition-all ${
                    selected[p.id]
                      ? "bg-slate-600 text-slate-200 cursor-not-allowed"
                      : p.limit <= 0
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-metaverse-pink text-white hover:scale-105"
                  }`}
                >
                  {selected[p.id] ? "Selected" : p.limit <= 0 ? "Full" : "Select"}
                </button>
                <div className="text-xs text-slate-400">Team limit applies at launch</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
