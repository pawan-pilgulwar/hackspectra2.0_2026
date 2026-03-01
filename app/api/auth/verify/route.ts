import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/lib/models/Team";
import ProblemStatement from "@/lib/models/ProblemStatement";
import { generateToken, setAuthCookie } from "@/lib/jwt";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Force Node.js runtime (required for Mongoose and jsonwebtoken)
export const runtime = 'nodejs';

/**
 * POST /api/auth/verify
 * 
 * Authentication endpoint with JWT
 * Validates team using Unstop Team ID and Leader Email
 * Returns JWT in HTTP-only cookie
 * 
 * Request body:
 * {
 *   "teamId": "string",
 *   "leaderEmail": "string"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "team": { 
 *     teamId, teamName, leaderEmail, selectedTrack, 
 *     selectedProblemId, selectedProblem (populated), 
 *     customProblemStatement 
 *   }
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { teamId, leaderEmail } = body;

    // Validation
    if (!teamId || !leaderEmail) {
      return NextResponse.json(
        { success: false, message: "Team ID and Leader Email are required" },
        { status: 400 }
      );
    }

    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json(
        { success: false, message: "Database connection error" },
        { status: 500 }
      );
    }

    // Find team
    const team = await Team.findOne({
      teamId: teamId.trim(),
      leaderEmail: leaderEmail.trim().toLowerCase(),
    });

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Invalid Team ID or Leader Email" },
        { status: 401 }
      );
    }

    // FIX ISSUE 1: Populate selected problem details if exists
    let selectedProblem = null;
    if (team.selectedProblemId) {
      try {
        const problem = await ProblemStatement.findById(team.selectedProblemId);
        if (problem) {
          selectedProblem = {
            _id: problem._id.toString(),
            title: problem.title,
            description: problem.description,
            track: problem.track,
          };
        }
      } catch (problemError) {
        console.error("Error fetching problem details:", problemError);
        // Continue without problem details
      }
    }

    // FIX ISSUE 2: Generate JWT token
    let token;
    try {
      token = generateToken({
        teamId: team.teamId,
        leaderEmail: team.leaderEmail,
      });
    } catch (jwtError) {
      console.error("JWT generation failed:", jwtError);
      return NextResponse.json(
        { success: false, message: "Authentication token generation failed" },
        { status: 500 }
      );
    }

    // Create response with team data
    const response = NextResponse.json({
      success: true,
      team: {
        teamId: team.teamId,
        teamName: team.teamName,
        leaderEmail: team.leaderEmail,
        selectedTrack: team.selectedTrack,
        selectedProblemId: team.selectedProblemId,
        selectedProblem: selectedProblem, // NEW: Full problem details
        customProblemStatement: team.customProblemStatement,
        selectedAt: team.selectedAt,
      },
    });

    // FIX ISSUE 2: Set JWT in HTTP-only cookie
    return setAuthCookie(response, token);
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
