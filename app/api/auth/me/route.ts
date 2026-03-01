import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/lib/models/Team";
import ProblemStatement from "@/lib/models/ProblemStatement";
import { requireAuth } from "@/lib/jwt";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/me
 * 
 * Get current authenticated team data
 * Requires valid JWT cookie
 * 
 * Response:
 * {
 *   "success": true,
 *   "team": { teamId, teamName, leaderEmail, selectedTrack, selectedProblem, customProblemStatement }
 * }
 */
export async function GET(req: NextRequest) {
  try {
    // Verify JWT from cookie
    const payload = requireAuth(req);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Find team
    const team = await Team.findOne({
      teamId: payload.teamId,
      leaderEmail: payload.leaderEmail,
    });

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    // Populate selected problem details if exists
    let selectedProblem = null;
    if (team.selectedProblemId) {
      const problem = await ProblemStatement.findById(team.selectedProblemId);
      if (problem) {
        selectedProblem = {
          _id: problem._id.toString(),
          title: problem.title,
          description: problem.description,
          track: problem.track,
        };
      }
    }

    // Return team data
    return NextResponse.json({
      success: true,
      team: {
        teamId: team.teamId,
        teamName: team.teamName,
        leaderEmail: team.leaderEmail,
        selectedTrack: team.selectedTrack,
        selectedProblemId: team.selectedProblemId,
        selectedProblem: selectedProblem,
        customProblemStatement: team.customProblemStatement,
        selectedAt: team.selectedAt,
      },
    });
  } catch (error) {
    console.error("Get current team error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
