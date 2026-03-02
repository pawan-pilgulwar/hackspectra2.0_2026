import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/lib/models/Team";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Force Node.js runtime (required for Mongoose)
export const runtime = 'nodejs';

/**
 * POST /api/admin/seed-teams
 * 
 * Seeds sample teams into the database for testing
 * Protected by ADMIN_SECRET
 * 
 * Request headers:
 * - x-admin-secret: your admin secret
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Seeded X teams"
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

    // Sample teams (replace with actual Unstop data)
    const sampleTeams = [
      {
        teamId: "TEAM001",
        teamName: "Code Warriors",
        leaderName: "John Doe",
        leaderEmail: "leader1@example.com",
        teamMembers: ["John Doe", "Jane Smith", "Bob Johnson"],
      },
      {
        teamId: "TEAM002",
        teamName: "Tech Innovators",
        leaderName: "Alice Brown",
        leaderEmail: "leader2@example.com",
        teamMembers: ["Alice Brown", "Charlie Davis"],
      },
      {
        teamId: "TEAM003",
        teamName: "Cyber Ninjas",
        leaderName: "Mike Wilson",
        leaderEmail: "leader3@example.com",
        teamMembers: ["Mike Wilson", "Sarah Miller", "Tom Anderson", "Lisa Garcia"],
      },
      {
        teamId: "TEAM004",
        teamName: "AI Pioneers",
        leaderName: "David Martinez",
        leaderEmail: "leader4@example.com",
        teamMembers: ["David Martinez", "Emma Rodriguez"],
      },
      {
        teamId: "TEAM005",
        teamName: "Data Wizards",
        leaderName: "Chris Taylor",
        leaderEmail: "leader5@example.com",
        teamMembers: ["Chris Taylor", "Amy White", "Kevin Lee"],
      },
    ];

    // Insert teams (skip duplicates)
    const results = await Promise.allSettled(
      sampleTeams.map((t) => Team.create(t))
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;

    return NextResponse.json({
      success: true,
      message: `Seeded ${successCount} teams`,
      total: sampleTeams.length,
    });
  } catch (error) {
    console.error("Seed teams error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to seed teams" },
      { status: 500 }
    );
  }
}
