import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/lib/models/Team";
import ProblemStatement from "@/lib/models/ProblemStatement";
import { requireAuth } from "@/lib/jwt";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Force Node.js runtime (required for Mongoose and jsonwebtoken)
export const runtime = 'nodejs';

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
      leaderEmail: payload.leaderEmail,
    });

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    // Validate active session
    if (team.activeSessionId !== payload.sessionId) {
      return NextResponse.json(
        { success: false, message: "Session expired. Another login detected.", code: "SESSION_EXPIRED" },
        { status: 401 }
      );
    }

    // Populate selected problem details if exists
    let selectedProblem = null;
    if (team.selectedProblem) {
      // Use the embedded selectedProblem data
      selectedProblem = {
        _id: team.selectedProblem.problemId,
        title: team.selectedProblem.problemTitle,
        description: team.selectedProblem.problemDescription || "",
        track: team.selectedProblem.problemTrack,
      };

      // Backwards compatibility: if description is missing, try to fetch it
      if (!selectedProblem.description) {
        const problem = await ProblemStatement.findById(team.selectedProblem.problemId);
        if (problem) {
          selectedProblem.description = problem.description;
        }
      }
    } else if (team.selectedProblemId) {
      // Fallback: Fetch from database if only ID exists (backward compatibility)
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
        leaderName: team.leaderName,
        leaderEmail: team.leaderEmail,
        teamMembers: team.teamMembers,
        selectedTrack: team.selectedTrack,
        selectedProblemId: team.selectedProblemId,
        selectedProblem: selectedProblem,
        customProblemStatement: team.customProblemStatement,
        rejectionMessage: team.rejectionMessage,
        isCustomProblemRejected: team.isCustomProblemRejected,
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
