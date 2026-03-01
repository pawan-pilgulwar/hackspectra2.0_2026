import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/lib/models/Team";

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
        leaderEmail: "leader1@example.com",
      },
      {
        teamId: "TEAM002",
        teamName: "Tech Innovators",
        leaderEmail: "leader2@example.com",
      },
      {
        teamId: "TEAM003",
        teamName: "Cyber Ninjas",
        leaderEmail: "leader3@example.com",
      },
      {
        teamId: "TEAM004",
        teamName: "AI Pioneers",
        leaderEmail: "leader4@example.com",
      },
      {
        teamId: "TEAM005",
        teamName: "Data Wizards",
        leaderEmail: "leader5@example.com",
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
