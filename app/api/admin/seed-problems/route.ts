import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ProblemStatement from "@/lib/models/ProblemStatement";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Force Node.js runtime (required for Mongoose)
export const runtime = 'nodejs';

/**
 * POST /api/admin/seed-problems
 * 
 * Seeds initial problem statements into the database
 * Protected by ADMIN_SECRET
 * 
 * Request headers:
 * - x-admin-secret: your admin secret
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Seeded X problem statements"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Check admin secret
    const adminSecret = req.headers.get("x-admin-secret");
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Sample problem statements for each track
    const sampleProblems = [
      // Agriculture
      {
        title: "Smart Farming Assistant",
        description:
          "Create an AI-driven assistant to help small farmers optimize crop yield, irrigation scheduling, and pest management using IoT sensors and weather data.",
        track: "Agriculture",
        maxTeams: 6,
      },
      {
        title: "Crop Disease Detection System",
        description:
          "Build a mobile app that uses image recognition to identify crop diseases early and suggest treatment options to farmers.",
        track: "Agriculture",
        maxTeams: 5,
      },

      // Healthcare
      {
        title: "Healthcare Triage Bot",
        description:
          "Build a triage system to prioritize urgent cases using symptom input, basic vitals, and AI-based risk assessment.",
        track: "Healthcare",
        maxTeams: 8,
      },
      {
        title: "Mental Health Support Platform",
        description:
          "Design a platform that provides mental health resources, mood tracking, and connects users with counselors.",
        track: "Healthcare",
        maxTeams: 6,
      },

      // Education
      {
        title: "Personalized Learning Platform",
        description:
          "Create an adaptive learning system that customizes content based on student performance and learning style.",
        track: "Education",
        maxTeams: 7,
      },
      {
        title: "Campus Safety Tracker",
        description:
          "Design an app that improves student safety with location alerts, incident reporting, and emergency contacts.",
        track: "Education",
        maxTeams: 5,
      },

      // Smart City
      {
        title: "Green City Analytics",
        description:
          "Analyze city sensor data to propose actionable steps for reducing energy consumption and carbon footprint.",
        track: "Smart City",
        maxTeams: 7,
      },
      {
        title: "Smart Parking Solution",
        description:
          "Develop a real-time parking availability system that reduces traffic congestion and helps drivers find parking spots.",
        track: "Smart City",
        maxTeams: 6,
      },

      // Disaster Management
      {
        title: "Early Warning System",
        description:
          "Build a disaster prediction and early warning system using weather data, seismic sensors, and machine learning.",
        track: "Disaster Management",
        maxTeams: 5,
      },
      {
        title: "Emergency Response Coordinator",
        description:
          "Create a platform to coordinate rescue operations, resource allocation, and communication during disasters.",
        track: "Disaster Management",
        maxTeams: 6,
      },

      // Cybersecurity
      {
        title: "Phishing Detection Tool",
        description:
          "Develop a browser extension or email plugin that detects and warns users about phishing attempts and malicious links.",
        track: "Cybersecurity",
        maxTeams: 7,
      },
      {
        title: "Secure Password Manager",
        description:
          "Build a password manager with advanced encryption, biometric authentication, and breach monitoring.",
        track: "Cybersecurity",
        maxTeams: 5,
      },

      // Transportation & Tourism
      {
        title: "Smart Public Transit App",
        description:
          "Create an app that provides real-time public transport updates, route optimization, and crowd density information.",
        track: "Transportation & Tourism",
        maxTeams: 6,
      },
      {
        title: "Virtual Tourism Guide",
        description:
          "Build an AR/VR-based virtual tour guide that showcases tourist destinations with historical information and interactive elements.",
        track: "Transportation & Tourism",
        maxTeams: 5,
      },

      // Women & Child Development
      {
        title: "Women Safety App",
        description:
          "Design a safety app with SOS alerts, location sharing, safe route suggestions, and emergency contact integration.",
        track: "Women & Child Development",
        maxTeams: 7,
      },
      {
        title: "Child Education Tracker",
        description:
          "Create a platform for parents and teachers to track child development milestones, learning progress, and health records.",
        track: "Women & Child Development",
        maxTeams: 6,
      },
    ];

    // Insert problems (skip duplicates)
    const results = await Promise.allSettled(
      sampleProblems.map((p) =>
        ProblemStatement.create({
          ...p,
          selectedTeams: [], // Initialize with empty array
          isActive: true,
        })
      )
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;

    return NextResponse.json({
      success: true,
      message: `Seeded ${successCount} problem statements`,
      total: sampleProblems.length,
    });
  } catch (error) {
    console.error("Seed problems error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to seed problems" },
      { status: 500 }
    );
  }
}
